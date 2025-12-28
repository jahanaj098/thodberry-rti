// ============================================
// GITHUB API INTEGRATION
// Core functions for interacting with GitHub API
// ============================================

class GitHubAPI {
    constructor() {
        this.token = localStorage.getItem('github_token');
        this.config = GITHUB_CONFIG;
        this.apiUrl = this.config.apiUrl;
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('github_token', token);
    }

    // Get authentication headers
    getHeaders() {
        return {
            'Authorization': `token ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        };
    }

    // Test if token is valid
    async validateToken() {
        try {
            const response = await fetch(`${this.apiUrl}/user`, {
                headers: this.getHeaders()
            });
            return response.ok;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    }

    // Get file from repository
    async getFile(path) {
        try {
            const url = `${this.apiUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`;
            const response = await fetch(url, {
                headers: this.getHeaders()
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null; // File doesn't exist
                }
                throw new Error(`Failed to get file: ${response.status}`);
            }

            const data = await response.json();
            return {
                content: atob(data.content), // Decode base64
                sha: data.sha
            };
        } catch (error) {
            console.error('Error getting file:', error);
            throw error;
        }
    }

    // Upload new file to repository
    async uploadFile(path, content, message) {
        try {
            const url = `${this.apiUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

            const body = {
                message: message || `Upload ${path}`,
                content: btoa(unescape(encodeURIComponent(content))), // Encode to base64 with UTF-8 support
                branch: this.config.branch
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Upload failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    // Update existing file in repository
    async updateFile(path, content, sha, message) {
        try {
            const url = `${this.apiUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

            const body = {
                message: message || `Update ${path}`,
                content: btoa(unescape(encodeURIComponent(content))), // Encode to base64 with UTF-8 support
                sha: sha,
                branch: this.config.branch
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Update failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating file:', error);
            throw error;
        }
    }

    // Delete file from repository
    async deleteFile(path, sha, message) {
        try {
            const url = `${this.apiUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

            const body = {
                message: message || `Delete ${path}`,
                sha: sha,
                branch: this.config.branch
            };

            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Delete failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    // Upload binary file (PDF, images)
    async uploadBinaryFile(path, base64Content, message) {
        try {
            const url = `${this.apiUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

            // Remove data URL prefix if present
            const cleanBase64 = base64Content.replace(/^data:.*?;base64,/, '');

            const body = {
                message: message || `Upload ${path}`,
                content: cleanBase64,
                branch: this.config.branch
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Upload failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading binary file:', error);
            throw error;
        }
    }

    // Helper: Convert file to base64
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Helper: Generate unique ID
    generateId() {
        return 'rti-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.GitHubAPI = GitHubAPI;
}
