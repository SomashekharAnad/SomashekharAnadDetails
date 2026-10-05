/* "Ask Somashekhar" – offline portfolio assistant.
   Runs fully in the browser on data/portfolio data (window.PORTFOLIO). No data leaves the page.
   Optional: wire `askRemote()` to an ABB-approved internal LLM endpoint if available. */
(function(){
 const P=window.PORTFOLIO; if(!P) return;
 const base=document.body.dataset.base||'';
 const fab=document.createElement('button');fab.id='ai-fab';fab.setAttribute('aria-label','Open portfolio assistant');fab.innerHTML='<span>AI</span>';
 const panel=document.createElement('div');panel.id='ai-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Portfolio assistant');
 panel.innerHTML=`<div class="ai-head"><div><strong>Ask about ${P.short}</strong><small><span class="live-dot"></span> Offline assistant · on-page data only</small></div><button class="ai-x" aria-label="Close">×</button></div>
 <div class="ai-log" aria-live="polite"></div>
 <div class="ai-sugg"></div>
 <form class="ai-form"><input placeholder="e.g. What OPC UA experience?" aria-label="Your question"/><button>Send</button></form>`;
 document.body.append(fab,panel);
 const log=panel.querySelector('.ai-log'),inp=panel.querySelector('input');
 const sugg=['Current role','Symphony Plus experience','Protocols','NTPC projects','Contact details','Education'];
 panel.querySelector('.ai-sugg').innerHTML=sugg.map(s=>`<button>${s}</button>`).join('');
 const add=(t,who)=>{const d=document.createElement('div');d.className='ai-msg '+who;d.innerHTML=t;log.appendChild(d);log.scrollTop=log.scrollHeight;};
 const open=()=>{panel.classList.add('open');if(!log.children.length)add(`Hi. I can answer questions about ${P.name}'s experience, projects, skills and contact details.`,'bot');inp.focus();};
 fab.onclick=()=>panel.classList.contains('open')?panel.classList.remove('open'):open();
 panel.querySelector('.ai-x').onclick=()=>panel.classList.remove('open');
 panel.querySelector('.ai-sugg').onclick=e=>{if(e.target.tagName==='BUTTON'){ask(e.target.textContent)}};
 panel.querySelector('form').onsubmit=e=>{e.preventDefault();if(inp.value.trim())ask(inp.value.trim());inp.value='';};

 // Build searchable knowledge chunks
 const K=[];
 P.experience.forEach(x=>K.push({t:`<b>${x.role}</b> – ${x.company} (${x.period})<br>`+x.points.slice(0,5).map(p=>'• '+p).join('<br>'),k:(x.role+' '+x.company+' '+x.tags.join(' ')+' '+x.points.join(' ')).toLowerCase()}));
 P.projects.forEach(x=>K.push({t:`<b>${x.title}</b><br>${x.summary}<br><a href="${base}projects/${x.slug}.html">Open case study →</a>`,k:(x.title+' '+x.cat+' '+x.stack.join(' ')+' '+x.summary+' '+x.approach).toLowerCase()}));
 P.skills.forEach(g=>K.push({t:`<b>${g.group}</b>: `+g.items.map(i=>i[0]).join(', '),k:(g.group+' skills '+g.items.map(i=>i[0]).join(' ')).toLowerCase()}));
 K.push({t:`<b>Contact</b><br>Phone: <a href="tel:${P.phoneRaw}">${P.phone}</a><br>Email: <a href="mailto:${P.email}">${P.email}</a>`,k:'contact phone email reach call mail number'});
 K.push({t:'<b>Education</b><br>'+P.education.map(e=>`${e.degree}, ${e.school} (${e.year})`).join('<br>'),k:'education degree college university study qualification b.e vtu'});
 K.push({t:'<b>Languages</b>: '+P.languages.join(', '),k:'language languages speak kannada hindi telugu english'});
 K.push({t:P.summary,k:'summary about who profile overview introduction current role'});
 const stop=new Set('the a an of to in on for and or is are what which who how does do his her my your with about tell me any experience'.split(' '));
 function ask(q){add(q.replace(/</g,'&lt;'),'user');
  const terms=q.toLowerCase().replace(/[^a-z0-9+.\s]/g,' ').split(/\s+/).filter(w=>w&&!stop.has(w));
  const scored=K.map(c=>({c,s:terms.reduce((a,t)=>a+(c.k.includes(t)?(t.length>3?2:1):0),0)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,2);
  setTimeout(()=>add(scored.length?scored.map(x=>x.c.t).join('<hr>'):`I don't have that in the portfolio data. Contact ${P.short} directly at <a href="mailto:${P.email}">${P.email}</a>.`,'bot'),250);}
})();
