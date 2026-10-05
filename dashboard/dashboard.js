(function(){const P=window.PORTFOLIO;
const svgNS='http://www.w3.org/2000/svg';
// Skill radar
const avg=P.skills.map(g=>({k:g.group,v:g.items.reduce((a,i)=>a+i[1],0)/g.items.length}));
const r=document.getElementById('radar'),cx=160,cy=160,R=120,n=avg.length;let s='';
[.25,.5,.75,1].forEach(f=>{s+=`<polygon points="${avg.map((_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return (cx+R*f*Math.cos(a))+','+(cy+R*f*Math.sin(a))}).join(' ')}" fill="none" stroke="var(--line)"/>`});
const pts=avg.map((d,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+R*d.v/100*Math.cos(a),cy+R*d.v/100*Math.sin(a),a,d]});
s+=`<polygon points="${pts.map(p=>p[0]+','+p[1]).join(' ')}" fill="rgba(255,0,15,.18)" stroke="#FF000F" stroke-width="2"/>`;
pts.forEach(p=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#FF000F"/><text x="${cx+(R+22)*Math.cos(p[2])}" y="${cy+(R+22)*Math.sin(p[2])}" text-anchor="middle" font-size="12" fill="currentColor">${p[3].k}</text>`});
r.innerHTML=s;
// Bars: top skills
const all=P.skills.flatMap(g=>g.items).sort((a,b)=>b[1]-a[1]).slice(0,10);
document.getElementById('bars').innerHTML=all.map(([k,v])=>`<div class="skill"><div class="row"><span>${k}</span><span>${v}%</span></div><div class="bar"><span data-w="${v}" style="width:${v}%"></span></div></div>`).join('');
// Projects by category (donut)
const cats={};P.projects.forEach(p=>cats[p.cat]=(cats[p.cat]||0)+1);const tot=P.projects.length;const cols=['#FF000F','#6764f6','#ff957e','#93a1ff'];
let off=0,d='';Object.entries(cats).forEach(([k,v],i)=>{const L=2*Math.PI*60,len=v/tot*L;d+=`<circle r="60" cx="90" cy="90" fill="none" stroke="${cols[i%4]}" stroke-width="26" stroke-dasharray="${len} ${L-len}" stroke-dashoffset="${-off}" transform="rotate(-90 90 90)"/>`;off+=len});
d+=`<text x="90" y="86" text-anchor="middle" font-size="28" font-weight="800" fill="currentColor">${tot}</text><text x="90" y="106" text-anchor="middle" font-size="12" fill="currentColor">projects</text>`;
document.getElementById('donut').innerHTML=d;
document.getElementById('legend').innerHTML=Object.entries(cats).map(([k,v],i)=>`<div style="display:flex;gap:8px;align-items:center;margin:6px 0"><span style="width:12px;height:12px;border-radius:3px;background:${cols[i%4]}"></span>${k} <strong style="margin-left:auto">${v}</strong></div>`).join('');
// Live-style protocol monitor (simulated)
const prot=['OPC UA','Modbus TCP','PubSub','SCADA GW','COD session'];const m=document.getElementById('monitor');
function tick(){m.innerHTML=prot.map(p=>{const l=(Math.random()*18+4).toFixed(1),ok=Math.random()>.06;return `<tr><td>${p}</td><td><span class="badge" style="background:${ok?'#e4e7ff':'#ffdccd'};color:${ok?'#3a37b8':'#a3000a'}">${ok?'OK':'RETRY'}</span></td><td>${l} ms</td><td>${Math.floor(Math.random()*900+100)}/s</td></tr>`}).join('')}
tick();setInterval(tick,2000);
})();