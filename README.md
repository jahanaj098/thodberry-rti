# Thodberry RTI Intelligence Platform

A public, searchable platform that organizes Right to Information (RTI) replies from across India into structured, easy-to-understand insights for citizens, journalists, researchers, and institutions.

## 🌟 Features

- **RTI Library**: Searchable archive of RTI replies with advanced filtering
- **Admin Panel**: GitHub-powered content management system (zero server costs)
- **Public Submission**: Community-driven RTI contribution system
- **Department Dashboards**: Track transparency metrics by government department
- **Insights Section**: Curated analysis and trend reports (coming soon)

## 🚀 Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no framework dependencies)
- **Backend**: GitHub API (serverless architecture)
- **Hosting**: GitHub Pages / Cloudflare Pages (free)
- **Data Storage**: JSON files in GitHub repository
- **Authentication**: GitHub Personal Access Tokens

## 📁 Project Structure

```
rti/
├── index.html              # Landing page
├── about.html              # About & transparency page
├── submit.html             # Public submission form
├── library.html            # RTI archive
├── insights.html           # Insights & analysis
├── config.js               # GitHub configuration
│
├── admin/                  # Admin panel
│   ├── login.html
│   ├── dashboard.html
│   ├── upload.html
│   └── manage.html
│
├── assets/
│   ├── css/
│   │   ├── main.css        # Design system
│   │   └── components.css  # Component styles
│   ├── js/
│   │   ├── main.js         # Core functionality
│   │   ├── form-handler.js
│   │   ├── github-api.js   # GitHub API integration
│   │   ├── admin-auth.js   # Authentication
│   │   └── admin-upload.js # Upload handling
│   ├── images/             # Images and icons
│   └── documents/          # RTI documents (PDFs)
│
└── data/
    ├── rti-data.json       # RTI entries
    └── departments.json    # Reference data
```

## ⚙️ Setup Instructions

### 1. Clone or Download

```bash
git clone <your-repo-url>
cd rti
```

### 2. Configure GitHub Integration

Edit `config.js` with your GitHub details:

```javascript
const GITHUB_CONFIG = {
  owner: 'your-github-username',      // Your GitHub username
  repo: 'thodberry-rti',              # Your repository name
  branch: 'main',                     // Branch name
  dataPath: 'data/rti-data.json',
  documentsPath: 'assets/documents/',
  apiUrl: 'https://api.github.com'
};
```

### 3. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Thodberry RTI Admin")
4. Select scope: **repo** (full control of private repositories)
5. Generate and copy the token

### 4. Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select branch: `main`
4. Select folder: `/` (root)
5. Save and wait for deployment

Your site will be available at: `https://your-username.github.io/repository-name/`

### 5. First Login

1. Navigate to `/admin/login.html`
2. Enter your GitHub Personal Access Token
3. You'll be redirected to the dashboard

## 📤 Uploading RTI Data

### Via Admin Panel

1. Login to admin panel (`/admin/login.html`)
2. Go to "Upload RTI" page
3. Fill in the form with RTI details
4. Upload the RTI document (PDF/image)
5. Click "Upload to GitHub"

The system will:
- Upload the document to `assets/documents/`
- Add entry to `data/rti-data.json`
- Commit both files to GitHub
- Make it immediately available on the public site

### Manual Upload (Direct GitHub)

You can also manually edit `data/rti-data.json`:

```json
{
  "rtis": [
    {
      "id": "rti-unique-id",
      "department": "Kerala Health Department",
      "authority": "State",
      "state": "Kerala",
      "subject": "Hospital fire safety audits",
      "year": 2022,
      "date": "2022-08-15",
      "tags": ["health", "safety", "audit"],
      "disclosure": "213 government hospitals had not undergone fire safety audit in 2022",
      "documentUrl": "/assets/documents/rti-001.pdf",
      "uploadedBy": "Contributor Name",
      "uploadDate": "2024-01-15T00:00:00Z"
    }
  ],
  "metadata": {
    "totalCount": 1,
    "lastUpdated": "2024-01-15T00:00:00Z",
    "version": "1.0"
  }
}
```

## 🎨 Design System

The platform uses a modern, accessible design system with:

- **Dark mode support**: Automatic theme toggle
- **Responsive design**: Mobile-first approach
- **Glassmorphism**: Modern UI effects
- **Color palette**: Trust-based (blues/teals)
- **Typography**: Inter (UI) + Crimson Pro (headings)

## 🔒 Security Considerations

1. **Token Security**: Never commit your GitHub token to the repository
2. **Token Storage**: Stored in browser localStorage (use on trusted devices only)
3. **Token Scope**: Use minimum required scope (repo only)
4. **Fine-grained Tokens**: Consider using fine-grained tokens limited to one repository
5. **HTTPS Only**: Always use HTTPS for the admin panel

## 📝 Data Privacy

- All RTI documents are sanitized to remove personal information
- Personal data (phone, email, address) is masked
- Only legally disclosed public information is published
- Source attribution on every RTI entry

## 🤝 Contributing

### Public Contributions

Users can submit RTI replies via the public form at `/submit.html`. These submissions are stored locally and require admin review before publication.

### Developer Contributions

Contributions to the codebase are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📜 License

This project follows the editorial and legal policies outlined in `/about.html`.

## 🆘 Support

For issues, questions, or suggestions:

- **Email**: contact@thodberry.com
- **GitHub Issues**: [Create an issue](https://github.com/your-username/thodberry-rti/issues)

## 🙏 Acknowledgments

- RTI Act, 2005 (Government of India)
- RTI activists and contributors across India
- Open source community

---

**Thodberry RTI Intelligence** - Making government disclosures permanent and public.
