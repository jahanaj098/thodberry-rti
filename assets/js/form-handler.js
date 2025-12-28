// ============================================
// PUBLIC SUBMISSION FORM HANDLER
// Handles the public RTI submission form
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('rti-submit-form');

    if (!submitForm) return;

    initFileUpload();
    initFormValidation();
    handleFormSubmission();
});

// ============================================
// FILE UPLOAD HANDLING
// ============================================
function initFileUpload() {
    const fileInput = document.getElementById('rti-file');
    const fileLabel = document.querySelector('.file-upload-label');
    const fileInfo = document.querySelector('.file-info');

    if (!fileInput) return;

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (!file) {
            resetFileDisplay();
            return;
        }

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showToast('Please upload a PDF or image file (JPG, PNG)', 'error');
            resetFileDisplay();
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showToast('File size must be less than 10MB', 'error');
            resetFileDisplay();
            return;
        }

        // Display file info
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
    });
}

function resetFileDisplay() {
    const fileInput = document.getElementById('rti-file');
    const fileInfo = document.querySelector('.file-info');

    if (fileInput) fileInput.value = '';
    if (fileInfo) {
        fileInfo.innerHTML = '';
        fileInfo.classList.add('hidden');
    }
}

// ============================================
// FORM VALIDATION
// ============================================
function initFormValidation() {
    const form = document.getElementById('rti-submit-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            // Clear error on input
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');

    // Remove existing error
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }

    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-sm text-error mt-2';
    errorDiv.textContent = message;

    field.parentElement.appendChild(errorDiv);
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // Check file upload
    const fileInput = document.getElementById('rti-file');
    if (fileInput && fileInput.hasAttribute('required') && !fileInput.files.length) {
        showToast('Please upload your RTI reply document', 'error');
        isValid = false;
    }

    // Check confirmation checkbox
    const confirmCheckbox = document.getElementById('confirm-legal');
    if (confirmCheckbox && !confirmCheckbox.checked) {
        showToast('Please confirm that your RTI reply was obtained legally', 'error');
        isValid = false;
    }

    return isValid;
}

// ============================================
// FORM SUBMISSION
// ============================================
function handleFormSubmission() {
    const form = document.getElementById('rti-submit-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validate form
        if (!validateForm(form)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></span> Submitting...';

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // For public submission, we'll save to localStorage as a draft
        // In a real implementation, this would send an email or notification
        try {
            // Helper to convert file to Base64
            const fileToBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = error => reject(error);
            });

            // Get file if present
            const fileInput = document.getElementById('rti-file');
            let fileContent = null;
            let fileName = null;

            if (fileInput && fileInput.files.length > 0) {
                fileContent = await fileToBase64(fileInput.files[0]);
                fileName = fileInput.files[0].name;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Save to localStorage for demo
            const submissions = JSON.parse(localStorage.getItem('rti_submissions') || '[]');
            submissions.push({
                ...data,
                fileContent: fileContent, // Base64 string
                fileName: fileName,
                submittedAt: new Date().toISOString(),
                status: 'pending',
                id: 'sub_' + Date.now() // Temp ID
            });
            localStorage.setItem('rti_submissions', JSON.stringify(submissions));

            // Show success message
            showToast('Submitted successfully! Waiting for approval.', 'success');

            // Reset form
            form.reset();
            resetFileDisplay();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Submission error:', error);
            showToast('An error occurred. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Add error styling
const style = document.createElement('style');
style.textContent = `
  .form-input.error,
  .form-select.error,
  .form-textarea.error {
    border-color: var(--color-error);
  }
  
  .error-message {
    color: var(--color-error);
  }
`;
document.head.appendChild(style);
