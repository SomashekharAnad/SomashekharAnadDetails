// Simple offline cache
const C='sa-portfolio-v1';
const ASSETS=['../index.html','../about.html','../projects.html','../experience.html','../certifications.html','../blog.html','../contact.html','../css/style.css','../animations/animations.css','./main.js','./data.js','../ai/assistant.js','../ai/assistant.css'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).catch(()=>{})));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
