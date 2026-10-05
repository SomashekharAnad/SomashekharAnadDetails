# Somashekhar S. Anad – ABB Internal Portfolio

Static, dependency-free portfolio site (HTML/CSS/JS) in ABB style. **For internal ABB use only.**

## Structure
```
index.html, about.html, projects.html, experience.html, certifications.html, blog.html, contact.html
css/            core stylesheet (ABB red #FF000F / lilac #6764f6, light + dark)
js/             main.js (interactions), data.js (content), sw.js (offline cache)
animations/     reveal / motion library (respects prefers-reduced-motion)
projects/       one case-study page per project
certifications/ one page per competency; put PDFs in certifications/files/
resume/         printable resume page
dashboard/      skill radar, project donut, simulated protocol monitor (pure SVG)
downloads/      PDF resume, vCard
github/         README and CI workflow for an internal repo
data/           portfolio.json (single source of content)
ai/             offline "Ask" assistant – runs in-browser on page data only
images/         logo, OG image, PWA icons
```

## Run locally
Open `index.html` directly, or serve it:
```
python -m http.server 8080
```

## Editing content
Update `data/portfolio.json` and mirror it in `js/data.js` (used by the dashboard and the AI assistant). Page text is static HTML.

## Hosting (internal)
Host on an ABB-approved internal location, such as SharePoint, an internal GitHub Enterprise / Azure DevOps Pages instance, or an intranet web server. `robots.txt` and the `noindex` meta tag prevent search indexing.

## Contact
+91 95915 57311 · somashekhar.anad@in.abb.com
