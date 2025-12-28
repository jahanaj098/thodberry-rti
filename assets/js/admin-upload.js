// ============================================
// ADMIN UPLOAD FUNCTIONALITY
// Handle RTI uploads from admin panel
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const auth = initAdminAuth();
    if (!auth) return;

    const uploadForm = document.getElementById('admin-upload-form');
    if (uploadForm) {
        initUploadForm();
    }
});

let githubAPI;

function initUploadForm() {
    githubAPI = new GitHubAPI();

    const form = document.getElementById('admin-upload-form');
    const fileInput = document.getElementById('rti-document');
    const previewBtn = document.getElementById('preview-btn');

    // File upload handling
    fileInput.addEventListener('change', handleFileSelect);

    // Preview button
    if (previewBtn) {
        previewBtn.addEventListener('click', showPreview);
    }

    // Form submission
    form.addEventListener('submit', handleUpload);
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    const fileInfo = document.getElementById('file-info');

    if (!file) {
        if (fileInfo) fileInfo.classList.add('hidden');
        return;
    }

    // Validate file
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showToast('Please upload a PDF or image file', 'error');
        e.target.value = '';
        return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showToast('File size must be less than 10MB', 'error');
        e.target.value = '';
        return;
    }

    // Show file info
    if (fileInfo) {
        fileInfo.innerHTML = `
      <div class="flex items-center gap-3">
        <span>📄</span>
        <div>
          <div class="font-semibold">${file.name}</div>
          <div class="text-sm text-muted">${formatFileSize(file.size)}</div>
        </div>
      </div>
    `;
        fileInfo.classList.remove('hidden');
    }
}

// Show preview before submission
function showPreview(e) {
    e.preventDefault();

    const form = document.getElementById('admin-upload-form');
    const formData = new FormData(form);

    // Create preview content
    const previewData = {
        department: formData.get('department'),
        authority: formData.get('authority'),
        state: formData.get('state'),
        subject: formData.get('subject'),
        date: formData.get('reply-date'),
        tags: formData.get('tags'),
        disclosure: formData.get('key-disclosure'),
        contributor: formData.get('contributor') || 'Admin'
    };

    const preview = `
    <div class="card">
      <h3>Preview RTI Entry</h3>
      <div class="grid grid-2 gap-4 mt-4">
        <div><strong>Department:</strong> ${previewData.department}</div>
        <div><strong>Authority:</strong> ${previewData.authority}</div>
        <div><strong>State:</strong> ${previewData.state || 'N/A'}</div>
        <div><strong>Date:</strong> ${previewData.date || 'N/A'}</div>
        <div class="col-span-2"><strong>Subject:</strong> ${previewData.subject}</div>
        <div class="col-span-2"><strong>Tags:</strong> ${previewData.tags}</div>
        <div class="col-span-2"><strong>Key Disclosure:</strong><br>${previewData.disclosure || 'N/A'}</div>
      </div>
    </div>
  `;

    // Show in modal or alert
    alert('Preview:\n\n' + JSON.stringify(previewData, null, 2));
}

// Handle form submission
async function handleUpload(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></span> Uploading...';

    try {
        // Get form data
        const formData = new FormData(form);
        const fileInput = document.getElementById('rti-document');
        const file = fileInput.files[0];

        if (!file) {
            throw new Error('No file selected');
        }

        // Generate unique ID for this RTI
        const rtiId = githubAPI.generateId();
        const fileExt = file.name.split('.').pop();
        const documentPath = `${GITHUB_CONFIG.documentsPath}${rtiId}.${fileExt}`;

        // Convert file to base64
        showToast('Converting file...', 'info');
        const base64Content = await githubAPI.fileToBase64(file);

        // Upload document to GitHub
        showToast('Uploading document to GitHub...', 'info');
        await githubAPI.uploadBinaryFile(
            documentPath,
            base64Content,
            `Upload RTI document: ${formData.get('subject')}`
        );

        // Create RTI entry object
        const rtiEntry = {
            id: rtiId,
            department: formData.get('department'),
            authority: formData.get('authority'),
            state: formData.get('state') || null,
            subject: formData.get('subject'),
            year: formData.get('reply-date') ? new Date(formData.get('reply-date')).getFullYear() : new Date().getFullYear(),
            date: formData.get('reply-date') || null,
            tags: formData.get('tags').split(',').map(t => t.trim()).filter(t => t),
            disclosure: formData.get('key-disclosure') || '',
            documentUrl: `/${documentPath}`,
            uploadedBy: formData.get('contributor') || 'Admin',
            uploadDate: new Date().toISOString()
        };

        // Get current RTI data
        showToast('Updating RTI database...', 'info');
        const rtiDataFile = await githubAPI.getFile(GITHUB_CONFIG.dataPath);

        let rtiData;
        if (rtiDataFile) {
            rtiData = JSON.parse(rtiDataFile.content);
        } else {
            rtiData = { rtis: [], metadata: { totalCount: 0, lastUpdated: '', version: '1.0' } };
        }

        // Add new RTI entry
        rtiData.rtis.unshift(rtiEntry); // Add to beginning
        rtiData.metadata.totalCount = rtiData.rtis.length;
        rtiData.metadata.lastUpdated = new Date().toISOString();

        // Upload updated data
        const updatedContent = JSON.stringify(rtiData, null, 2);

        if (rtiDataFile && rtiDataFile.sha) {
            await githubAPI.updateFile(
                GITHUB_CONFIG.dataPath,
                updatedContent,
                rtiDataFile.sha,
                `Add RTI entry: ${formData.get('subject')}`
            );
        } else {
            await githubAPI.uploadFile(
                GITHUB_CONFIG.dataPath,
                updatedContent,
                `Add RTI entry: ${formData.get('subject')}`
            );
        }

        // Success!
        showToast('RTI uploaded successfully!', 'success');

        // Reset form
        form.reset();
        document.getElementById('file-info')?.classList.add('hidden');

        // Redirect to manage page after a delay
        setTimeout(() => {
            window.location.href = 'manage.html';
        }, 2000);

    } catch (error) {
        console.error('Upload error:', error);
        showToast(`Upload failed: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Utility: Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
