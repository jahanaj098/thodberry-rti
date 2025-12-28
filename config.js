// GitHub repository configuration
// Update these values with your GitHub username and repository name
const GITHUB_CONFIG = {
  owner: 'jahanaj098',                   // TODO: Update with your GitHub username
  repo: 'thodberry-rti',              // TODO: Update with your repository name
  branch: 'main',                     // Update if using different branch
  dataPath: 'data/rti-data.json',
  documentsPath: 'assets/documents/',
  departmentsPath: 'data/departments.json',
  apiUrl: 'https://api.github.com'
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GITHUB_CONFIG;
}

