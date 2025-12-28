// ============================================
// ADMIN AUTHENTICATION
// Token management and session handling
// ============================================

class AdminAuth {
    constructor() {
        this.githubAPI = new GitHubAPI();
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = localStorage.getItem('github_token');
        return token !== null && token !== '';
    }

    // Get stored token
    getToken() {
        return localStorage.getItem('github_token');
    }

    // Store token
    async login(token) {
        try {
            // Test token validity
            this.githubAPI.setToken(token);
            const isValid = await this.githubAPI.validateToken();

            if (!isValid) {
                throw new Error('Invalid GitHub token');
            }

            localStorage.setItem('github_token', token);
            localStorage.setItem('login_time', new Date().toISOString());

            return true;
        } catch (error) {
            localStorage.removeItem('github_token');
            localStorage.removeItem('login_time');
            throw error;
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('github_token');
        localStorage.removeItem('login_time');
        window.location.href = 'login.html';
    }

    // Ensure user is authenticated (for protected pages)
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Get login time
    getLoginTime() {
        return localStorage.getItem('login_time');
    }

    // Check if session is expired (optional - for enhanced security)
    isSessionExpired(maxHours = 24) {
        const loginTime = this.getLoginTime();
        if (!loginTime) return true;

        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);

        return hoursSinceLogin > maxHours;
    }
}

// Auto-redirect to login if not authenticated (for admin pages)
function initAdminAuth() {
    const auth = new AdminAuth();

    // Check if we're on an admin page (not login page)
    const isAdminPage = window.location.pathname.includes('/admin/') &&
        !window.location.pathname.includes('/login.html');

    if (isAdminPage && !auth.requireAuth()) {
        return false;
    }

    return auth;
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.AdminAuth = AdminAuth;
    window.initAdminAuth = initAdminAuth;
}
