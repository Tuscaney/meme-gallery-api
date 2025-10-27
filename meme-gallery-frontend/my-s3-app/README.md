# 🖼️ Meme Viewer (React + Tailwind) — AWS S3 Deployment

This project was built with **React** and **TailwindCSS**, then deployed as a static website to an **AWS S3 bucket** for public access.

### 🌐 Live URL
**[View the live app here](http://meme-gallery-s3-tuscaney.s3-website.us-east-2.amazonaws.com)**  
Deployed to region: **us-east-2**

---
## Screenshots
![AWS S3 Live App](./screenshots/AWS-S3LiveApp.png)

![AWS S3 Live App (Incognito )](./screenshots/AWS-S3Incognito.png)


### CloudFront Fix: Origin Path & SPA Routing
- Cleared **Origin path** (was `/index.html`, which caused 403s for `/favicon.ico`, `/assets/*`)
- Set **Default root object** to `index.html`
- Added SPA fallbacks under **Error pages**:
  - 403 → `/index.html` (HTTP 200, TTL 0)
  - 404 → `/index.html` (HTTP 200, TTL 0)
- Created cache invalidation: `/*`
- Verified at **https://dik737e6l9bef.cloudfront.net**

