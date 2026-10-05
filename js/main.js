/* Core interactions – no external dependencies */
(function(){
 const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
 const root=document.documentElement;

 // Theme
 const saved=localStorage.getItem('theme');
 if(saved) root.dataset.theme=saved;
 else if(matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme='dark';
 document.addEventListener('click',e=>{
  if(e.target.closest('#theme-toggle')){
   const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;localStorage.setItem('theme',t);
   const b=$('#theme-toggle'); if(b) b.textContent=t==='dark'?'☀':'☾';
  }
  if(e.target.closest('.burger')) $('.menu').classList.toggle('open');
  const cp=e.target.closest('[data-copy]');
  if(cp){navigator.clipboard?.writeText(cp.dataset.copy).then(()=>toast('Copied: '+cp.dataset.copy));}
 });
 window.addEventListener('DOMContentLoaded',()=>{
  const b=$('#theme-toggle'); if(b) b.textContent=root.dataset.theme==='dark'?'☀':'☾';
 });

 // Toast
 window.toast=function(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2400);};

 // Scroll progress + back to top
 window.addEventListener('scroll',()=>{
  const h=document.body.scrollHeight-innerHeight; const p=h>0?scrollY/h*100:0;
  const bar=$('#progress'); if(bar) bar.style.width=p+'%';
  const top=$('#top'); if(top) top.classList.toggle('show',scrollY>500);
 },{passive:true});

 // Reveal, counters, skill bars
 const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting) return; const el=en.target; el.classList.add('in');
  if(el.dataset.count){const end=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length,suf=el.dataset.suffix||'';
   let s=null;const step=ts=>{s=s||ts;const k=Math.min((ts-s)/1400,1);el.textContent=(end*(1-Math.pow(1-k,3))).toFixed(dec)+suf;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step);}
  $$('.bar span',el).forEach(b=>b.style.width=b.dataset.w+'%');
  io.unobserve(el);
 }),{threshold:.15});
 window.addEventListener('DOMContentLoaded',()=>$$('.reveal,[data-count],.skills-block').forEach(el=>io.observe(el)));

 // Typed roles
 window.addEventListener('DOMContentLoaded',()=>{
  const el=$('.typed'); if(!el) return; const words=JSON.parse(el.dataset.words); let w=0,i=0,del=false;
  (function tick(){const word=words[w];el.textContent=word.slice(0,i);
   if(!del&&i<word.length){i++;setTimeout(tick,70)}else if(!del){del=true;setTimeout(tick,1600)}
   else if(i>0){i--;setTimeout(tick,35)}else{del=false;w=(w+1)%words.length;setTimeout(tick,250)}})();
 });

 // Project filters + search
 window.addEventListener('DOMContentLoaded',()=>{
  const wrap=$('.filters'); if(!wrap) return; let cat='All',q='';
  const apply=()=>$$('[data-cat]').forEach(c=>{const okC=cat==='All'||c.dataset.cat===cat;const okQ=!q||c.textContent.toLowerCase().includes(q);c.style.display=okC&&okQ?'':'none'});
  wrap.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',wrap).forEach(x=>x.classList.remove('on'));b.classList.add('on');cat=b.dataset.f;apply();});
  const s=$('.search'); if(s) s.addEventListener('input',()=>{q=s.value.toLowerCase().trim();apply();});
 });

 // Contact form -> opens mail client (no backend, internal-safe)
 window.addEventListener('DOMContentLoaded',()=>{
  const f=$('#contact-form'); if(!f) return;
  f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f);
   const body=`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nTeam/BU: ${d.get('team')}\n\n${d.get('message')}`;
   location.href=`mailto:${f.dataset.to}?subject=${encodeURIComponent('[Portfolio] '+d.get('topic'))}&body=${encodeURIComponent(body)}`;
   toast('Opening your mail client…');});
 });

 // Hero animated network canvas (IIoT nodes)
 window.addEventListener('DOMContentLoaded',()=>{
  const c=$('#grid-canvas'); if(!c||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const x=c.getContext('2d'); let W,H,pts=[];
  const size=()=>{W=c.width=c.offsetWidth*devicePixelRatio;H=c.height=c.offsetHeight*devicePixelRatio;
   pts=Array.from({length:Math.min(70,Math.floor(W*H/26000))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()<.12}))};
  size();addEventListener('resize',size);
  (function draw(){x.clearRect(0,0,W,H);const D=140*devicePixelRatio;
   pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;});
   for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
    if(d<D){x.strokeStyle=`rgba(103,100,246,${(1-d/D)*.35})`;x.lineWidth=devicePixelRatio;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}}
   pts.forEach(p=>{x.fillStyle=p.r?'#FF000F':'#93a1ff';x.beginPath();x.arc(p.x,p.y,(p.r?3:2)*devicePixelRatio,0,7);x.fill();});
   requestAnimationFrame(draw);})();
 });

 // PWA
 if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  window.addEventListener('load',()=>navigator.serviceWorker.register((document.body.dataset.base||'')+'js/sw.js').catch(()=>{}));
 }
})();
