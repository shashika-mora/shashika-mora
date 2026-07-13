# Roadmap & Future Enhancements

This document outlines recommended improvements and roadmap features for the portfolio system, aimed at enhancing security, usability, and developer branding.

---

## 1. Firebase Storage Integration (Direct Uploads)

### Current Limitations
Currently, setting covers for Projects, Blogs, Academics, or the Profile Avatar requires the administrator to manually host files elsewhere and paste the URL into the Admin Panel.

### Proposed Improvement
*   **Storage Setup**: Initialize a Firebase Storage bucket to host media.
*   **Upload Widget**: Integrate a drag-and-drop file upload component (such as `react-dropzone`) into the Admin Panel forms.
*   **Automated Storage Service**: Upon file upload, a script should upload the image to Firestore, retrieve the public download URL, and auto-populate the corresponding image URL field.

---

## 2. Real-Time Contact Notifications

### Current Limitations
Submissions from the landing page contact form are saved silently inside the `messages` collection. The administrator must log in to the admin panel to check for new inquiries.

### Proposed Improvement
*   **Webhook Submissions**: Trigger notifications immediately when a new message is created.
*   **Firebase Cloud Functions**: Write a background Firestore Trigger Function (`onCreate` on the `/messages` collection) that sends an alert:
    *   **Email**: Use the Firebase "Trigger Email" extension with SendGrid or Nodemailer to forward the inquiry to the admin email.
    *   **Chat Platforms**: Post a formatted notification payload containing the subject and sender info to a private Telegram channel or Discord channel via webhooks.

---

## 3. Brand Identity & Custom Domain Mapping

### Current Limitations
The project currently runs on default Firebase subdomains (`shashika-dev.web.app`).

### Proposed Improvement
*   **Custom Domain**: Purchase a custom domain name (e.g. `shashika.lk` or `shashika.dev`).
*   **DNS Binding**: Set up Firebase Hosting's custom domain feature by mapping the DNS records (A and TXT records) inside your domain registrar. Firebase automatically provisions free, auto-renewing SSL certificates for your domain.

---

## 4. Advanced Authentication Security

### Current Limitations
The admin panel login is currently protected by Firebase Email/Password credentials.

### Proposed Improvement
*   **OAuth Integration**: Enable Google Sign-In as an authentication provider in the Firebase Console.
*   **Security Rule Whitelist**: Hardcode or query-validate authenticated emails in `firestore.rules` (e.g. `request.auth.token.email == 'my-personal-email@gmail.com'`) so only your Google account is allowed to log in and write to Firestore. This eliminates password storage risks.

---

## 5. SEO & Web Vitals Optimizations

*   **Next-Gen Images**: Add an image optimization function or convert uploaded files to `WebP` or `AVIF` formats to reduce bundle sizes and improve mobile loading speeds.
*   **Automatic Sitemaps**: Install `next-sitemap` to generate automated `sitemap.xml` and `robots.txt` files on every static build to improve search engine indexing.
*   **Metadata Expansion**: Configure page-specific OpenGraph meta tags so that links shared on LinkedIn or Twitter render rich preview cards (title, summary description, and cover image).
