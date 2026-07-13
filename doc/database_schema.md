# Database Schemas & Security Rules

This document describes the Firestore database design, document properties, security policies, and access validations used in the portfolio system.

---

## 1. Document Collections & Schemas

Firestore is configured as a NoSQL document database. There are four public data collections and one system log/message collection:

### 1.1 Collection: `config` (System Parameters)
This collection holds system-wide configuration documents. The primary document is `/config/about`, which contains the developer's profile and landing page setup.

#### Document: `/config/about`
| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Display name (e.g. `"Shashika"`). |
| `role` | `string` | Title or tagline rendered in headers (e.g. `"Software Engineer"`). |
| `title` | `string` | Primary header in Hero section (e.g. `"Computer Science & Engineering Undergraduate"`). |
| `subtitle` | `string` | Sub-header description in Hero section. |
| `bio` | `string` | Short Markdown introduction printed in the landing page's About card. |
| `secondaryBio` | `string` | Detailed Markdown biography loaded on profile summaries. |
| `githubUrl` | `string` | Link to GitHub profile. |
| `linkedinUrl` | `string` | Link to LinkedIn profile. |
| `contactEmail` | `string` | Primary email address. |
| `resumeUrl` | `string` | Link to CV PDF (hosted in Cloud Storage or externally). Enables "Download CV" button. |
| `avatarUrl` | `string` | Profile image URL. Falls back to local `/hero.jpg` if not configured. |
| `availabilityStatus` | `string` | Work availability badge (e.g. `"Available for Opportunities"`). |
| `skills` | `array` | List of items representing the tech stack. Supports strings (e.g. `"C++"`) and serialized objects or string-pipes (e.g. `"React\|https://cdn.simpleicons.org/react"`) to render custom tech icons. |

---

### 1.2 Collection: `projects`
Contains portfolio items showcased in the projects section.

| Property | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Name of the project. |
| `description` | `string` | Summary of features, context, and accomplishments. |
| `techStack` | `array` | List of strings representing technologies (e.g. `["C", "Linux", "Bash"]`). |
| `githubUrl` | `string` | (Optional) Link to source code repository. |
| `liveUrl` | `string` | (Optional) Link to live demonstration site. |
| `imageUrl` | `string` | (Optional) Cover image URL. |
| `visibility` | `boolean` | Public display switch. Documents with `visibility: false` are filtered out of public views. |
| `order` | `integer`| Sequencing index for sorting projects in lists. |
| `createdAt` | `timestamp`| Creation timestamp. |
| `updatedAt` | `timestamp`| Last update timestamp. |

---

### 1.3 Collection: `blogs`
Contains technical articles and stories.

| Property | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Blog post title. |
| `slug` | `string` | URL-safe handle derived from title (e.g. `"my-journey-into-os-kernels"`). |
| `summary` | `string` | Brief excerpt displayed in lists. |
| `content` | `string` | Full body text written in Markdown. |
| `imageUrl` | `string` | (Optional) Article header cover image URL. |
| `readingTime` | `string` | Estimated reading duration (e.g. `"5 min read"`). |
| `featured` | `boolean` | Highlights the post in special carousels or home widgets. |
| `published` | `boolean` | Toggles post availability. Drafts (`published: false`) are hidden from guests. |
| `createdAt` | `timestamp`| Creation timestamp. |
| `updatedAt` | `timestamp`| Last update timestamp. |
| `publishedAt` | `timestamp`| Dynamic publish date shown in lists. |

---

### 1.4 Collection: `academics`
Stores educational timeline milestones.

| Property | Type | Description |
| :--- | :--- | :--- |
| `institution` | `string` | Name of school, college, or university (e.g. `"Royal College"`). |
| `degree` | `string` | Level of degree or certification (e.g. `"G.C.E. Advanced Level"`). |
| `period` | `string` | Enrollment timeframe (e.g. `"2018 - 2021"`). |
| `gpa` | `string` | (Optional) Performance grades or averages (e.g. `"3A's"` or `"3.89"`). |
| `imageUrl` | `string` | (Optional) Institution logo URL. |
| `courses` | `array` | List of key subjects or relevant courses taken. |
| `achievements` | `array` | Honors, ranking positions, or outstanding awards. |
| `skills` | `array` | Key competencies gained (e.g. `["Analytical Thinking", "C++"]`). |
| `order` | `integer`| Sequencing index for chronological rendering. |
| `createdAt` | `timestamp`| Creation timestamp. |

---

### 1.5 Collection: `competitions`
Stores competition wins, hackathons, and rankings.

| Property | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Competition title. |
| `award` | `string` | Award or ranking (e.g. `"Winner (1st Place)"`). |
| `description` | `string` | Detailed description of the event and accomplishment. |
| `imageUrl` | `string` | Primary visual image link. |
| `imageUrl2` | `string` | Secondary visual image link. |
| `link` | `string` | (Optional) External event link. |
| `date` | `string` | Month and year of competition (e.g. `"Oct 2025"`). |
| `order` | `integer`| Sequencing index for sorting. |
| `createdAt` | `timestamp`| Creation timestamp. |

---

### 1.6 Collection: `messages`
Stores contact form submissions received from the landing page.

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Submitter's full name (validated to be between 1-100 characters). |
| `email` | `string` | Submitter's email (validated using a regular expression filter). |
| `subject` | `string` | (Optional) Header of inquiry. |
| `message` | `string` | Body content of submission (validated up to 5000 characters). |
| `status` | `string` | Message status (`"unread"` or `"read"`). |
| `createdAt` | `timestamp`| Dynamic creation timestamp. |

---

## 2. Database Security Rules (`firestore.rules`)

Access control is strictly managed at the database level to ensure public visitors cannot alter your portfolio data, while letting them submit message inquiries:

*   **Public Reads**: Granted to `blogs`, `projects`, `academics`, `competitions`, and `/config/about`.
*   **Public Writes**: Denied across all public documents. Only authorized accounts authenticated with `admin@shashika.lk` are allowed to write or modify documents.
*   **Form Submissions**: Public users are granted `create` access on the `/messages` collection. The write operation undergoes rigid schema validation (email regex format, character size limits, field list whitelist) before acceptance. Public reads, updates, and deletes on messages are fully blocked.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper: Checks if the user is authenticated as the single allowed admin
    function isAdmin() {
      return request.auth != null && request.auth.token.email == 'admin@shashika.lk';
    }

    // Public collections: read-only for public, write for the specific admin
    match /blogs/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /projects/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /academics/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /competitions/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /config/about {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Messages collection: public can create (submit inquiry), admin can read/manage
    match /messages/{messageId} {
      allow create: if request.resource.data.keys().hasAll(['name', 'email', 'message'])
                    && request.resource.data.keys().hasOnly(['name', 'email', 'subject', 'message', 'createdAt', 'status'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() < 100
                    && request.resource.data.email is string
                    && request.resource.data.email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
                    && request.resource.data.message is string
                    && request.resource.data.message.size() > 0
                    && request.resource.data.message.size() < 5000;
      allow read, update, delete: if isAdmin();
    }
  }
}
```
