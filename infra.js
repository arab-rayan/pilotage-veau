/* ===================== INFRASTRUCTURE ===================== */
let IX={site:'bib',view:'topo',floor:null,sel:null,connect:false,src:null,rot:0,explode:1.2,layer:'tout',tab:'inventaire',cam:{},hot:null};
let IW=null,idrag=null;
function INFRA_BUSY(){return CUR==='infra'&&!!idrag}
function onSitesSnapshot(){}
const isInter=()=>IX.site==='inter';
const siteDoc=()=>IW&&IW.id===IX.site?IW:(IW=clone(D.sites.get(IX.site)));
const NODE=44,TN=56;
const VIEWS_INFRA=[['topo','Topologie','topo'],['plan','Plan','plan'],['iso','Vue 3D','cube'],['baie','Baie','rack'],['tables','Tableaux','table']];
const DOCK=[['poste','PC agent'],['public','PC public'],['imprimante','Imprimante'],['borne','Borne catalogue'],['mobile','Smartphone'],['wifi','Borne Wi-Fi'],['switch','Switch'],['parefeu','Pare-feu'],['routeur','Routeur'],['box','Box Internet'],['serveur','Serveur'],['vm','Machine virtuelle'],['nas','NAS'],['automate','Automate'],['service','Service']];
const PREFIX={poste:'PC',public:'PUB',imprimante:'IMP',borne:'OPAC',mobile:'TEL',wifi:'AP',switch:'SW',parefeu:'FW',routeur:'RT',box:'BOX',serveur:'SRV',vm:'VM',nas:'NAS',automate:'AUTO',service:'SVC',peripherique:'USB',onduleur:'UPS',brassage:'PP'};
const ZONE_EXCL=['cloud','box','routeur','parefeu','switch','wifi','brassage','onduleur','service'];
const zoneable=e=>!ZONE_EXCL.includes(e.type);
const ZPAL=['#2d5bd8','#d9822b','#1f9d74','#8b4fd1','#c23b3b','#0e8fa3','#b5486f','#6b7280'];
const vColor=(v,s)=>{const o=typeof v==='object'?v:(s?.vlans||[]).find(x=>String(x.id)===String(v));return o?.color||VLAN_COLORS[o?.id??v]||'#64748b'};
const vlanOf=(s,v)=>(s.vlans||[]).find(x=>String(x.id)===String(v));
function camKey(){return IX.site+'/'+(isInter()?'inter':IX.view)}
function cam(){return IX.cam[camKey()]||(IX.cam[camKey()]={x:40,y:40,k:1,fit:false})}
const eqVisible=e=>!(IX.layer==='physique'&&e.type==='service');
const linkVisible=l=>IX.layer==='tout'||LINKS[l.type]?.layer===IX.layer;
const snap=n=>Math.round(n/10)*10;

/* ---------- zones VLAN ---------- */
function zonesOf(s){return (s.vlans||[]).filter(v=>v.zone!==false&&v.zx!=null).map(v=>{const mem=s.eq.filter(e=>zoneable(e)&&String(e.vlan)===String(v.id)&&e.tx!=null);let x0=v.zx,y0=v.zy,x1=v.zx+v.zw,y1=v.zy+v.zh;mem.forEach(e=>{x0=Math.min(x0,e.tx-24);y0=Math.min(y0,e.ty-50);x1=Math.max(x1,e.tx+TN+24);y1=Math.max(y1,e.ty+TN+40)});return{v,x:x0,y:y0,w:x1-x0,h:y1-y0,mem}})}
const zoneAt=(s,p)=>zonesOf(s).find(z=>p.x>=z.x&&p.x<=z.x+z.w&&p.y>=z.y&&p.y<=z.y+z.h);
function nextIp(s,v){const m=String(v.net||'').match(/^(\d+\.\d+\.\d+)\./);if(!m)return '';const pre=m[1]+'.';const used=new Set(s.eq.map(e=>e.ip));for(let i=11;i<250;i++){if(!used.has(pre+i))return pre+i}return ''}
function autoTopo(s){const tier={cloud:0,box:0,routeur:1,parefeu:1,switch:2,brassage:2,onduleur:2,wifi:2,serveur:2,nas:2};
 const Z=(s.vlans||[]).filter(v=>v.zone!==false);let gx=0;const y0=345;
 Z.forEach(v=>{const L=s.eq.filter(e=>zoneable(e)&&String(e.vlan)===String(v.id));const cols=Math.max(2,Math.min(3,L.length));const rows=Math.max(1,Math.ceil(L.length/cols));v.zx=gx;v.zy=y0;v.zw=cols*110+30;v.zh=rows*112+60;L.forEach((e,i)=>{e.tx=gx+24+(i%cols)*110;e.ty=y0+50+Math.floor(i/cols)*112});gx+=v.zw+50});
 const W=Math.max(gx-50,420);
 [0,1,2].forEach(t=>{const L=s.eq.filter(e=>!zoneable(e)&&e.type!=='service'&&tier[e.type]===t);L.forEach((e,i)=>{e.tx=W/2-TN/2+(i-(L.length-1)/2)*130;e.ty=t*108})});
 s.eq.filter(e=>e.type==='service').forEach((e,i)=>{e.tx=Math.min(W-TN,W/2+260)+(i%2)*110;e.ty=20+Math.floor(i/2)*110});
 let oy=y0+Math.max(0,...Z.map(v=>v.zh))+60;s.eq.filter(e=>e.tx==null).forEach((e,i)=>{e.tx=i*110;e.ty=oy});
 s.layout=1}
function placeInZone(s,e){const z=zonesOf(s).find(z=>String(z.v.id)===String(e.vlan));if(!z){const maxY=Math.max(0,...s.eq.filter(x=>x.tx!=null).map(x=>x.ty));e.tx=0;e.ty=maxY+130;return}
 const i=z.mem.length;const cols=3;e.tx=z.v.zx+24+(i%cols)*110;e.ty=z.v.zy+50+Math.floor(i/cols)*112}

VIEWS.infra=function(){
 const sites=arr('sites').sort((a,b)=>(a.code||0)-(b.code||0));
 if(!isInter()&&!D.sites.get(IX.site))IX.site=sites.find(s=>s.id==='bib')?.id||'inter';
 IW=isInter()?null:clone(D.sites.get(IX.site));
 if(IW&&!IW.layout)autoTopo(IW);
 if(IW&&(!IX.floor||!IW.floors?.some(f=>f.id===IX.floor)))IX.floor=IW.floors?.[0]?.id||null;
 const v=isInter()?'inter':IX.view;const dock=['topo','plan'].includes(v);
 $('#view').innerHTML=`<div class="infra-top"><div class="row" style="gap:10px"><h1 style="font-size:24px">Infrastructure</h1><select id="siteSel" class="site-sel"><option value="inter" ${isInter()?'selected':''}>🌐 Tous les bâtiments</option>${sites.filter(s=>s.kind!=='cloud').map(s=>`<option value="${s.id}" ${s.id===IX.site?'selected':''}>${s.central?'🏛':'🏢'} ${esc(s.name)}</option>`).join('')}</select></div>
 ${isInter()?'':tabsHtml(VIEWS_INFRA,IX.view,'setIV')}
 <div class="row" style="gap:6px">${v==='topo'?`<button class="btn" onclick="addZone()">${ui('plus',16)} Zone VLAN</button>`:''}${v==='plan'?`<button class="btn" onclick="addRoom()">${ui('plus',16)} Salle</button>`:''}${['topo','plan','inter'].includes(v)?`<button class="btn ${IX.connect?'primary':''}" onclick="IX.connect=!IX.connect;IX.src=null;renderView()">${ui('link',16)} ${IX.connect?'Terminer':'Câbler'}</button>`:''}
 ${v==='iso'?`<button class="btn" onclick="IX.rot=(IX.rot+1)%4;drawInfra();fitInfra()">${ui('rotate',16)} Pivoter</button>`:''}
 ${v!=='tables'?`<div class="export"><button class="btn" onclick="this.parentNode.classList.toggle('open')">${ui('download',16)} Exporter</button><div class="menu"><button onclick="exportView('pdf')">PDF (schéma + inventaire)</button><button onclick="exportView('png')">Image PNG</button><button onclick="exportView('svg')">SVG (pour LibreOffice Draw)</button></div></div>`:''}</div></div>
 ${v==='tables'?`<div id="tablesHost"></div>`:`<div class="stage ${['topo','plan','inter'].includes(v)?'grid-bg':''}" id="stage"><svg class="canvas" id="isvg"><g id="ig"></g></svg>
  <div class="legend" id="ileg"></div>
  <div class="zoom"><button class="btn icon" title="Tout voir" onclick="fitInfra()">${ui('fit',16)}</button><button class="btn icon" title="Zoomer" onclick="zoomBy(1.2)">${ui('plus',16)}</button><button class="btn icon" title="Dézoomer" onclick="zoomBy(1/1.2)"><svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg></button></div>
  ${IX.connect?`<div class="hint">${IX.src?'Clique maintenant sur le 2e équipement':'Câblage : clique sur un 1er équipement'}</div>`:''}
  ${v==='topo'&&!IX.connect?`<div class="hint soft">Glisse un équipement du bas dans une zone : il prend le VLAN et une adresse IP.</div>`:''}
  ${dock?`<div class="dock" id="dock">${DOCK.map(([t,l])=>`<div class="dock-item" data-type="${t}" title="Glisse-moi sur le schéma">${icon(t,34)}<span>${l}</span></div>`).join('')}</div>`:''}
  <aside class="drawer" id="drawer"></aside></div>`}`;
 $('#siteSel').onchange=e=>{IX.site=e.target.value;IX.sel=null;IX.src=null;IX.connect=false;renderView()};
 if(v==='tables'){renderTables();return}
 const svg=$('#isvg');svg.onpointerdown=iDown;svg.onpointermove=iMove;svg.onpointerup=iUp;svg.onpointercancel=iUp;svg.onwheel=iWheel;svg.ondblclick=iDbl;
 svg.addEventListener('mouseover',tipOver);svg.addEventListener('mouseout',tipOut);svg.addEventListener('mousemove',tipMove);
 $$('.dock-item').forEach(d=>d.onpointerdown=e=>dockDown(e,d.dataset.type));
 drawInfra();renderDrawer();if(!cam().fit){cam().fit=true;fitInfra()}
};
const setIV=k=>{IX.view=k;IX.sel=null;IX.connect=false;renderView()};

/* ---------- rendu ---------- */
function drawInfra(){tipHide();const g=$('#ig');if(!g)return;const c=cam();g.setAttribute('transform',`translate(${c.x},${c.y}) scale(${c.k})`);
 const v=isInter()?'inter':IX.view;g.innerHTML=v==='inter'?svgInter():v==='plan'?svgPlan():v==='iso'?svgIso():v==='topo'?svgTopo():v==='baie'?svgRack():'';
 const leg=$('#ileg');if(leg)leg.innerHTML=legendHtml(v)}
function legendHtml(v){if(v==='inter')return `<span><svg width="26" height="8"><line x1="0" y1="4" x2="26" y2="4" stroke="var(--logic)" stroke-width="2" stroke-dasharray="7 4"/></svg> Tunnel VPN</span><span><svg width="26" height="8"><line x1="0" y1="4" x2="26" y2="4" stroke="var(--ink-2)" stroke-width="2"/></svg> Internet</span>`;
 const s=siteDoc();if(v==='baie')return '<span>Vue de face de la baie du local technique</span>';
 return `${(s.vlans||[]).filter(x=>x.zone!==false).map(x=>`<span><span class="dot" style="background:${vColor(x)}"></span> VLAN ${x.id} ${esc(x.name)}</span>`).join('')}<span><svg width="22" height="8"><line x1="0" y1="4" x2="22" y2="4" stroke="var(--ink-2)" stroke-width="2"/></svg> câble</span><span><svg width="22" height="8"><line x1="0" y1="4" x2="22" y2="4" stroke="var(--logic)" stroke-width="2" stroke-dasharray="5 4"/></svg> flux logique</span><span><b style="color:var(--warn)">?</b> proposé</span>`}
const useIcon=(type,x,y,size)=>`<use href="#i-${EQ[type]?type:'service'}" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
function linkStroke(l,sel){const L=LINKS[l.type]||LINKS.rj45;const lg=L.layer==='logique';return `stroke="${sel?'var(--accent)':lg?'var(--logic)':'var(--ink-2)'}" stroke-width="${sel?3.5:l.type==='trunk'||l.type==='fibre'||l.type==='wan'?2.8:1.6}" ${L.dash?`stroke-dasharray="${L.dash}"`:''} ${lg?'class="flow"':''} fill="none" opacity="${sel?1:.85}"`}
function nodeSvg(e,x,y,size,big){const sel=IX.sel?.id===e.id,src=IX.src===e.id;const s=siteDoc();const vc=e.vlan&&vlanOf(s,e.vlan)?vColor(e.vlan,s):null;
 return `<g data-kind="eq" data-id="${e.id}" data-eq="${e.id}" class="node ${sel?'sel':''}" transform="translate(${x} ${y})"><rect class="halo" x="-8" y="-8" width="${size+16}" height="${size+16}" rx="14" fill="var(--accent)" fill-opacity=".12" stroke="var(--accent)" stroke-width="2" ${sel?'style="opacity:1"':''}/>${src?`<rect x="-8" y="-8" width="${size+16}" height="${size+16}" rx="14" fill="none" stroke="var(--warn)" stroke-width="3"/>`:''}${useIcon(e.type,0,0,size)}
 <text x="${size/2}" y="${size+15}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">${esc(e.name)}</text>${big&&e.ip?`<text x="${size/2}" y="${size+29}" text-anchor="middle" font-size="10.5" font-family="var(--f-mono)" fill="var(--muted)">${esc(e.ip)}</text>`:''}
 ${vc&&!big?`<circle cx="${size-2}" cy="4" r="5" fill="${vc}" stroke="var(--surface)" stroke-width="1.5"/>`:''}${e.status==='propose'?`<g transform="translate(${size-6} -4)"><circle r="7" fill="var(--warn)"/><text y="3.5" font-size="10" font-weight="800" text-anchor="middle" fill="#fff">?</text></g>`:''}</g>`}

/* Topologie */
function svgTopo(){const s=siteDoc();let o='';const eqs=s.eq.filter(eqVisible);
 zonesOf(s).forEach(z=>{const c=vColor(z.v);const hot=IX.hot===String(z.v.id);const sel=IX.sel?.kind==='zone'&&IX.sel.id===String(z.v.id);
  o+=`<g data-kind="zone" data-id="${z.v.id}" class="zone ${hot?'hot':''}" style="cursor:move"><rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="22" fill="${c}" fill-opacity="${hot?.18:.07}" stroke="${c}" stroke-width="${hot||sel?3:1.5}" ${hot?'':'stroke-dasharray="8 5"'}/><rect x="${z.x+12}" y="${z.y+10}" width="${Math.min(z.w-24,190)}" height="34" rx="9" fill="${c}"/><text x="${z.x+22}" y="${z.y+25}" font-size="12.5" font-weight="800" fill="#fff">VLAN ${z.v.id} · ${esc(z.v.name)}</text><text x="${z.x+22}" y="${z.y+38}" font-size="10" font-family="var(--f-mono)" fill="#fff" opacity=".9">${esc(z.v.net||'')}</text>${hot?`<text x="${z.x+z.w/2}" y="${z.y+z.h-14}" text-anchor="middle" font-size="12" font-weight="700" fill="${c}">Déposer ici → VLAN ${z.v.id}</text>`:''}</g><rect data-kind="zresize" data-id="${z.v.id}" x="${z.x+z.w-16}" y="${z.y+z.h-16}" width="12" height="12" rx="3" fill="${c}" opacity=".5" style="cursor:nwse-resize"/>`});
 const svc=eqs.filter(e=>e.type==='service'&&e.tx!=null);if(svc.length){const x0=Math.min(...svc.map(e=>e.tx))-22,y0=Math.min(...svc.map(e=>e.ty))-40,x1=Math.max(...svc.map(e=>e.tx))+TN+22,y1=Math.max(...svc.map(e=>e.ty))+TN+40;o+=`<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" rx="22" fill="var(--logic)" fill-opacity=".05" stroke="var(--logic)" stroke-opacity=".5" stroke-dasharray="4 4"/><text x="${x0+14}" y="${y0+22}" font-size="11.5" font-weight="800" fill="var(--logic)">Services hébergés à la mairie</text>`}
 const byId=Object.fromEntries(eqs.map(e=>[e.id,e]));
 s.links.filter(linkVisible).forEach(l=>{const a=byId[l.a],b=byId[l.b];if(!a||!b||a.tx==null||b.tx==null)return;const ax=a.tx+TN/2,ay=a.ty+TN/2,bx=b.tx+TN/2,by=b.ty+TN/2;const sel=IX.sel?.id===l.id;
  o+=`<g data-kind="link" data-id="${l.id}" class="node"><line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="transparent" stroke-width="14"/><line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" ${linkStroke(l,sel)}/>${l.label&&((l.type!=='rj45'&&l.type!=='wan')||sel)?`<text x="${(ax+bx)/2}" y="${(ay+by)/2-6}" text-anchor="middle" font-size="10.5" font-family="var(--f-mono)" fill="var(--ink-2)" style="paint-order:stroke" stroke="var(--surface)" stroke-width="4">${esc(l.label)}</text>`:''}</g>`});
 eqs.forEach(e=>{if(e.tx!=null)o+=nodeSvg(e,e.tx,e.ty,TN,true)});
 return o}

/* Plan */
function svgPlan(){const s=siteDoc();if(!s.floors?.length)return `<text x="20" y="40" font-size="13" fill="var(--muted)">Aucun étage.</text>`;
 let o='';const rooms=s.rooms.filter(r=>r.floorId===IX.floor);
 rooms.forEach((r,i)=>{const sel=IX.sel?.id===r.id,hot=IX.hot===r.id;const col=ZPAL[i%ZPAL.length];o+=`<g data-kind="room" data-id="${r.id}" style="cursor:move"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="12" fill="${col}" fill-opacity="${hot?.16:.05}" stroke="${sel||hot?'var(--accent)':col}" stroke-opacity="${sel||hot?1:.5}" stroke-width="${sel||hot?2.5:1.5}"/><text x="${r.x+14}" y="${r.y+24}" font-size="13.5" font-weight="800" fill="var(--ink)">${esc(r.name)}</text></g><rect data-kind="resize" data-id="${r.id}" x="${r.x+r.w-14}" y="${r.y+r.h-14}" width="11" height="11" rx="3" fill="var(--muted)" opacity=".45" style="cursor:nwse-resize"/>`});
 const eqs=s.eq.filter(e=>e.floorId===IX.floor&&e.type!=='service'&&e.type!=='vm');const byId=Object.fromEntries(eqs.map(e=>[e.id,e]));
 s.links.forEach(l=>{const a=byId[l.a],b=byId[l.b];if(!a||!b||!IX.sel||(IX.sel.id!==a.id&&IX.sel.id!==b.id&&IX.sel.id!==l.id))return;o+=`<g data-kind="link" data-id="${l.id}" class="node"><line x1="${a.x+NODE/2}" y1="${a.y+NODE/2}" x2="${b.x+NODE/2}" y2="${b.y+NODE/2}" ${linkStroke(l,IX.sel?.id===l.id)}/></g>`});
 eqs.forEach(e=>o+=nodeSvg(e,e.x,e.y,NODE));
 return o}

/* 3D */
function isoSetup(s){const R=s.rooms.filter(r=>r.floorId===s.floors[0]?.id||true);const xs=R.flatMap(r=>[r.x,r.x+r.w]),ys=R.flatMap(r=>[r.y,r.y+r.h]);const b={x0:Math.min(...xs)-24,y0:Math.min(...ys)-24,x1:Math.max(...xs)+24,y1:Math.max(...ys)+24};const cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2;
 const rot=(x,y)=>{const dx=x-cx,dy=y-cy;return [[dx,dy],[-dy,dx],[-dx,-dy],[dy,-dx]][IX.rot]};const P=(x,y,z)=>{const [a,c]=rot(x,y);return [(a-c)*.866*.7,(a+c)*.5*.7-z]};return{b,rot,P}}
function svgIso(){const s=siteDoc();if(!s.rooms?.length)return `<text x="20" y="40" font-size="13" fill="var(--muted)">Ajoute des salles dans le Plan pour voir le bâtiment en 3D.</text>`;
 const {b,rot,P}=isoSetup(s);const FH=220*IX.explode;const depth=(x,y)=>{const [a,c]=rot(x,y);return a+c};const poly=pts=>pts.map(p=>p.join(',')).join(' ');let o='';
 s.floors.forEach((f,fi)=>{const z=fi*FH;const C=[[b.x0,b.y0],[b.x1,b.y0],[b.x1,b.y1],[b.x0,b.y1]];const mid=depth((b.x0+b.x1)/2,(b.y0+b.y1)/2);
  for(let i=0;i<4;i++){const p1=C[i],p2=C[(i+1)%4];if(depth((p1[0]+p2[0])/2,(p1[1]+p2[1])/2)>mid)o+=`<polygon points="${poly([P(...p1,z),P(...p2,z),P(...p2,z-16),P(...p1,z-16)])}" fill="${i%2?'#8d9ab3':'#aab5c8'}"/>`}
  o+=`<polygon points="${poly(C.map(([x,y])=>P(x,y,z)))}" fill="var(--surface-2)" stroke="var(--line-2)" stroke-width="1.2"/>`;
  if(s.floors.length>1){const lab=P(b.x0,b.y1,z);o+=`<text x="${lab[0]-10}" y="${lab[1]+26}" font-size="17" font-weight="800" fill="var(--ink-2)" text-anchor="end">${esc(f.name)}</text>`}
  s.rooms.filter(r=>r.floorId===f.id).forEach((r,ri)=>{const c=[[r.x,r.y],[r.x+r.w,r.y],[r.x+r.w,r.y+r.h],[r.x,r.y+r.h]];const sel=IX.sel?.id===r.id;const col=ZPAL[ri%ZPAL.length];
   o+=`<polygon data-kind="room" data-id="${r.id}" points="${poly(c.map(([x,y])=>P(x,y,z)))}" fill="${col}" fill-opacity="${sel?.22:.09}" stroke="${sel?'var(--accent)':'var(--line-2)'}" stroke-width="${sel?2:1}" style="cursor:pointer"/>`;
   const rc=depth(r.x+r.w/2,r.y+r.h/2);for(let i=0;i<4;i++){const p1=c[i],p2=c[(i+1)%4];if(depth((p1[0]+p2[0])/2,(p1[1]+p2[1])/2)<rc)o+=`<polygon points="${poly([P(...p1,z),P(...p2,z),P(...p2,z+34),P(...p1,z+34)])}" fill="var(--surface)" fill-opacity=".8" stroke="var(--line-2)"/>`}
   const t=P(r.x+r.w/2,r.y+r.h-16,z);o+=`<text x="${t[0]}" y="${t[1]}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink-2)" style="pointer-events:none;paint-order:stroke" stroke="var(--surface-2)" stroke-width="3">${esc(r.name)}</text>`});
  const eqs=s.eq.filter(e=>e.floorId===f.id&&eqVisible(e)&&e.type!=='vm'&&e.type!=='service').sort((a,c)=>depth(a.x,a.y)-depth(c.x,c.y));
  const pos=e=>P(e.x+NODE/2,e.y+NODE/2,Math.max(0,s.floors.findIndex(x=>x.id===e.floorId))*FH);
  if(IX.sel)s.links.filter(l=>l.a===IX.sel.id||l.b===IX.sel.id).forEach(l=>{const a=s.eq.find(e=>e.id===l.a),c2=s.eq.find(e=>e.id===l.b);if(!a||!c2||a.floorId!==f.id||!c2.floorId)return;const p=pos(a),q=pos(c2);o+=`<path d="M${p[0]} ${p[1]-4} L${q[0]} ${q[1]-4}" ${linkStroke(l,false)}/>`});
  eqs.forEach(e=>{const [x,y]=pos(e);const sz=56;const sel=IX.sel?.id===e.id;const up=e.type==='wifi'?34:2;
   o+=`<g data-kind="eq" data-id="${e.id}" data-eq="${e.id}" class="node ${sel?'sel':''}"><ellipse cx="${x}" cy="${y}" rx="20" ry="8" fill="#0f1b33" opacity=".18"/>${sel?`<ellipse cx="${x}" cy="${y}" rx="26" ry="10" fill="none" stroke="var(--accent)" stroke-width="2.5"/>`:''}${e.type==='wifi'?`<line x1="${x}" y1="${y}" x2="${x}" y2="${y-up}" stroke="var(--line-2)" stroke-width="2"/>`:''}${useIcon(e.type,x-sz/2,y-sz-up,sz)}${e.status==='propose'?`<g transform="translate(${x+sz/2-4} ${y-sz-up+4})"><circle r="7" fill="var(--warn)"/><text y="3.5" font-size="10" font-weight="800" text-anchor="middle" fill="#fff">?</text></g>`:''}<text x="${x}" y="${y+18}" font-size="12" font-weight="800" text-anchor="middle" fill="var(--ink)" style="paint-order:stroke" stroke="var(--surface)" stroke-width="3">${esc(e.name)}</text></g>`})});
 return o}

/* Baie */
function svgRack(){const s=siteDoc();const L=s.eq.filter(e=>+e.rackU>0).sort((a,b)=>b.rackU-a.rackU);const U=Math.max(10,...L.map(e=>+e.rackU+(+e.rackH||1)-1));const UH=36,W=380,X=60,Y=40;
 let o=`<rect x="${X-22}" y="${Y-22}" width="${W+44}" height="${U*UH+44}" rx="12" fill="#1b2130"/><rect x="${X}" y="${Y}" width="${W}" height="${U*UH}" fill="#0f141e"/>`;
 for(let u=1;u<=U;u++){const y=Y+(U-u)*UH;o+=`<text x="${X-8}" y="${y+22}" font-size="9" fill="#8a93a3" text-anchor="end" font-family="monospace">${u}U</text>`}
 if(!L.length)o+=`<text x="${X+W/2}" y="${Y+U*UH/2}" text-anchor="middle" font-size="13" fill="#a8b2c4">Clique un équipement du local technique</text><text x="${X+W/2}" y="${Y+U*UH/2+18}" text-anchor="middle" font-size="13" fill="#a8b2c4">et indique sa position « U » dans la baie.</text>`;
 L.forEach(e=>{const h=(+e.rackH||1)*UH-4,y=Y+(U-(+e.rackU)-(+e.rackH||1)+1)*UH+2,x=X+14,w=W-28;const sel=IX.sel?.id===e.id;
  let face='';if(e.type==='switch'||e.type==='brassage'){for(let i=0;i<24;i++){const px=x+70+(i%12)*21,py=y+5+Math.floor(i/12)*14;face+=`<rect x="${px}" y="${py}" width="15" height="11" rx="1.5" fill="${e.type==='brassage'?'#e9edf3':'#0b0f17'}" stroke="#5c6680"/>`;if(e.type==='switch')face+=`<circle cx="${px+7.5}" cy="${py+2.5}" r="1.3" fill="${i%3?'#22c55e':'#f59e0b'}"/>`}}
  else face=`<circle cx="${x+78}" cy="${y+h/2}" r="3" fill="#22c55e"/><circle cx="${x+90}" cy="${y+h/2}" r="3" fill="#22c55e"/><circle cx="${x+102}" cy="${y+h/2}" r="3" fill="#f59e0b"/>${[0,1,2,3].map(i=>`<rect x="${x+130+i*22}" y="${y+h/2-6}" width="15" height="11" rx="1.5" fill="#0b0f17" stroke="#5c6680"/>`).join('')}`;
  o+=`<g data-kind="eq" data-id="${e.id}" data-eq="${e.id}" class="node"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${e.type==='parefeu'?'#7c2417':e.type==='box'?'#e9edf3':'#3a4354'}" stroke="${sel?'#6d93ff':'#59637a'}" stroke-width="${sel?3:1}"/><text x="${x+8}" y="${y+h/2+4}" font-size="11" font-weight="800" fill="${e.type==='box'?'#1b2130':'#fff'}">${esc(trunc(e.name,9))}</text>${face}</g>`;
  const note=e.specs?.ports||e.role||'';o+=`<line x1="${X+W+22}" y1="${y+h/2}" x2="${X+W+52}" y2="${y+h/2}" stroke="#e05252" stroke-width="1.5"/><circle cx="${X+W+52}" cy="${y+h/2}" r="3" fill="#e05252"/><text x="${X+W+60}" y="${y+h/2-2}" font-size="12.5" font-weight="800" fill="var(--ink)">${esc(e.name)} · ${esc(EQ[e.type]?.l||'')}</text><text x="${X+W+60}" y="${y+h/2+13}" font-size="11" fill="var(--muted)">${esc(trunc(note,70))}</text>`});
 return o}

/* Inter-sites */
function svgInter(){const S=arr('sites');const inter=D.meta.get('inter')?.links||[];let o='';const byId=Object.fromEntries(S.map(s=>[s.id,s]));
 inter.filter(linkVisible).forEach(l=>{const a=byId[l.a],b=byId[l.b];if(!a||!b)return;const sel=IX.sel?.id===l.id;const ax=a.x+45,ay=a.y+45,bx=b.x+45,by=b.y+45;
  o+=`<g data-kind="ilink" data-id="${l.id}" class="node"><line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="transparent" stroke-width="14"/><line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" ${linkStroke(l,sel)}/>${l.label?`<text x="${(ax+bx)/2}" y="${(ay+by)/2-6}" text-anchor="middle" font-size="10.5" font-family="var(--f-mono)" fill="var(--logic)" style="paint-order:stroke" stroke="var(--surface)" stroke-width="4">${esc(l.label)}</text>`:''}</g>`});
 S.forEach(s=>{const sel=IX.sel?.id===s.id;const ic=s.kind==='cloud'?'cloud':s.central?'mairie':'building';
  o+=`<g data-kind="site" data-id="${s.id}" data-site="${s.id}" class="node ${sel?'sel':''}" transform="translate(${s.x} ${s.y})"><circle class="halo" cx="45" cy="45" r="58" fill="var(--accent)" fill-opacity=".1" stroke="var(--accent)" ${sel?'style="opacity:1"':''}/>${IX.src===s.id?'<circle cx="45" cy="45" r="58" fill="none" stroke="var(--warn)" stroke-width="3"/>':''}<use href="#i-${ic}" x="0" y="0" width="90" height="90"/><text x="45" y="106" text-anchor="middle" font-size="14" font-weight="800" fill="var(--ink)">${esc(s.name)}</text>${s.kind!=='cloud'?`<text x="45" y="121" text-anchor="middle" font-size="10.5" font-family="var(--f-mono)" fill="var(--muted)">10.${s.code}.0.0/16 · ${(s.eq||[]).length} éq.</text>`:''}</g>`});
 return o}

/* ---------- interactions ---------- */
function toWorld(e){const r=$('#isvg').getBoundingClientRect(),c=cam();return{x:(e.clientX-r.left-c.x)/c.k,y:(e.clientY-r.top-c.y)/c.k}}
function iDown(e){const t=e.target.closest('[data-kind]');$('#isvg').setPointerCapture(e.pointerId);tipHide();$('.export')?.classList.remove('open');
 if(!t){idrag={mode:'pan',cx:e.clientX,cy:e.clientY,ox:cam().x,oy:cam().y,moved:false};return}
 const kind=t.dataset.kind,id=t.dataset.id;const v=isInter()?'inter':IX.view;const p=toWorld(e);
 if(IX.connect&&(kind==='eq'||kind==='site')){connectClick(id);return}
 if(kind==='link'||kind==='ilink'){IX.sel={kind,id};drawInfra();renderDrawer();return}
 if(v==='iso'||v==='baie'){IX.sel={kind,id};drawInfra();renderDrawer();return}
 if(kind==='site'){const s=clone(D.sites.get(id));idrag={mode:'site',obj:s,p,ox:s.x,oy:s.y,moved:false,id};return}
 const s=siteDoc();
 if(kind==='zone'||kind==='zresize'){const z=zonesOf(s).find(z=>String(z.v.id)===id);if(!z)return;
  if(kind==='zresize'){idrag={mode:'zresize',v:z.v,p,ow:z.w,oh:z.h,ox:z.x,oy:z.y,moved:false};return}
  idrag={mode:'zone',v:z.v,p,ox:z.x,oy:z.y,inside:z.mem.map(q=>({o:q,x:q.tx,y:q.ty})),moved:false,id};return}
 if(kind==='resize'){const r=s.rooms.find(x=>x.id===id);idrag={mode:'resize',obj:r,p,ow:r.w,oh:r.h,moved:false,id};return}
 if(kind==='room'){const r=s.rooms.find(x=>x.id===id);idrag={mode:'room',obj:r,p,ox:r.x,oy:r.y,inside:s.eq.filter(q=>q.roomId===r.id).map(q=>({o:q,x:q.x,y:q.y})),moved:false,id};return}
 if(kind==='eq'){const q=s.eq.find(x=>x.id===id);const tp=v==='topo';idrag={mode:'eq',obj:q,p,ox:tp?q.tx:q.x,oy:tp?q.ty:q.y,tp,moved:false,id}}}
function iMove(e){if(!idrag)return;const d=idrag;
 if(d.mode==='pan'){const c=cam();c.x=d.ox+e.clientX-d.cx;c.y=d.oy+e.clientY-d.cy;if(Math.abs(e.clientX-d.cx)+Math.abs(e.clientY-d.cy)>3)d.moved=true;$('#ig').setAttribute('transform',`translate(${c.x},${c.y}) scale(${c.k})`);return}
 const p=toWorld(e),dx=p.x-d.p.x,dy=p.y-d.p.y;if(Math.abs(dx)+Math.abs(dy)>3)d.moved=true;if(!d.moved)return;
 if(d.mode==='resize'){d.obj.w=Math.max(120,snap(d.ow+dx));d.obj.h=Math.max(90,snap(d.oh+dy))}
 else if(d.mode==='room'){d.obj.x=snap(d.ox+dx);d.obj.y=snap(d.oy+dy);d.inside.forEach(i=>{i.o.x=i.x+(d.obj.x-d.ox);i.o.y=i.y+(d.obj.y-d.oy)})}
 else if(d.mode==='zone'){d.v.zx=snap(d.ox+dx);d.v.zy=snap(d.oy+dy);d.inside.forEach(i=>{i.o.tx=i.x+(d.v.zx-d.ox);i.o.ty=i.y+(d.v.zy-d.oy)})}
 else if(d.mode==='zresize'){d.v.zx=d.ox;d.v.zy=d.oy;d.v.zw=Math.max(160,snap(d.ow+dx));d.v.zh=Math.max(140,snap(d.oh+dy))}
 else if(d.mode==='eq'){if(d.tp){d.obj.tx=snap(d.ox+dx);d.obj.ty=snap(d.oy+dy);const z=zoneable(d.obj)?zoneAt(siteDoc(),{x:d.obj.tx+TN/2,y:d.obj.ty+TN/2}):null;IX.hot=z?String(z.v.id):null}else{d.obj.x=snap(d.ox+dx);d.obj.y=snap(d.oy+dy);const r=roomAt(siteDoc(),{x:d.obj.x+NODE/2,y:d.obj.y+NODE/2});IX.hot=r?.id||null}}
 else if(d.mode==='site'){d.obj.x=snap(d.ox+dx);d.obj.y=snap(d.oy+dy);D.sites.set(d.obj.id,d.obj)}
 drawInfra()}
function iUp(){if(!idrag)return;const d=idrag;idrag=null;IX.hot=null;
 if(d.mode==='pan'){if(!d.moved&&IX.sel){IX.sel=null;drawInfra();renderDrawer()}return}
 if(!d.moved){IX.sel={kind:{zone:'zone',zresize:'zone',resize:'room',room:'room',site:'site',eq:'eq'}[d.mode],id:String(d.id??d.v?.id)};drawInfra();renderDrawer();return}
 if(d.mode==='site'){put('sites',d.obj.id,stripId(d.obj));drawInfra();return}
 const s=siteDoc();
 if(d.mode==='eq'&&d.tp&&zoneable(d.obj)){const q=d.obj;const z=zoneAt(s,{x:q.tx+TN/2,y:q.ty+TN/2});
  if(z&&String(z.v.id)!==String(q.vlan)){q.vlan=String(z.v.id);q.ip=nextIp(s,z.v);relabel(s,q);toast(`${q.name} → VLAN ${z.v.id} (${z.v.name}) · IP ${q.ip||'à définir'}`);saveSite(`a mis ${q.name} dans le VLAN ${z.v.id} de`)}
  else if(!z&&q.vlan&&vlanOf(s,q.vlan)?.zone!==false){toast(`${q.name} n'est plus dans aucun VLAN : pense à revoir son adresse IP.`);q.vlan='';saveSite()}else saveSite()}
 else if(d.mode==='eq'&&!d.tp){const q=d.obj;const r=roomAt(s,{x:q.x+NODE/2,y:q.y+NODE/2});q.roomId=r?r.id:'';saveSite()}
 else saveSite();drawInfra();renderDrawer()}
function relabel(s,q){s.links.forEach(l=>{if((l.a===q.id||l.b===q.id)&&l.type==='rj45')l.label='VLAN '+q.vlan})}
const roomAt=(s,p)=>s.rooms.find(r=>r.floorId===IX.floor&&p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h);
function iWheel(e){e.preventDefault();const c=cam(),r=$('#isvg').getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;const k2=Math.min(2.5,Math.max(.35,c.k*(e.deltaY<0?1.08:1/1.08)));c.x=mx-(mx-c.x)*(k2/c.k);c.y=my-(my-c.y)*(k2/c.k);c.k=k2;$('#ig').setAttribute('transform',`translate(${c.x},${c.y}) scale(${c.k})`)}
function zoomBy(f){const c=cam(),svg=$('#isvg');const mx=svg.clientWidth/2,my=svg.clientHeight/2;const k2=Math.min(2.5,Math.max(.35,c.k*f));c.x=mx-(mx-c.x)*(k2/c.k);c.y=my-(my-c.y)*(k2/c.k);c.k=k2;const g=$('#ig');g.style.transition='transform .25s';drawInfra();setTimeout(()=>g.style.transition='',260)}
function iDbl(e){const t=e.target.closest('[data-site]');if(t&&D.sites.get(t.dataset.site)?.kind!=='cloud'){IX.site=t.dataset.site;IX.sel=null;renderView()}}
function fitInfra(){const g=$('#ig'),svg=$('#isvg');if(!g||!svg)return;const c=cam();g.setAttribute('transform','');let bb;try{bb=g.getBBox()}catch(e){return}if(!bb.width){c.x=40;c.y=40;c.k=1;drawInfra();return}
 const W=svg.clientWidth||900,H=svg.clientHeight||600;const dockH=$('#dock')?110:20;const pad=40;c.k=Math.min(1.3,Math.max(.6,Math.min((W-pad*2)/bb.width,(H-dockH-pad*2)/bb.height)));c.x=(W-bb.width*c.k)/2-bb.x*c.k;c.y=Math.max(pad,(H-dockH-bb.height*c.k)/2)-bb.y*c.k+10;drawInfra()}

/* ---------- glisser depuis la barre d'équipements ---------- */
function dockDown(e,type){e.preventDefault();const ghost=document.createElement('div');ghost.className='drag-ghost';ghost.innerHTML=icon(type,48);document.body.appendChild(ghost);
 const st={type,ghost,moved:false,sx:e.clientX,sy:e.clientY};const svg=$('#isvg');
 const move=ev=>{if(Math.abs(ev.clientX-st.sx)+Math.abs(ev.clientY-st.sy)>4)st.moved=true;ghost.style.left=ev.clientX+'px';ghost.style.top=ev.clientY+'px';
  const r=svg.getBoundingClientRect();const inside=ev.clientX>r.left&&ev.clientX<r.right&&ev.clientY>r.top&&ev.clientY<r.bottom-100;ghost.classList.toggle('ok',inside);
  const p=toWorld(ev);const s=siteDoc();let hot=null;if(inside){if(IX.view==='topo'&&zoneable({type})){const z=zoneAt(s,p);hot=z?String(z.v.id):null}else if(IX.view==='plan'){hot=roomAt(s,p)?.id||null}}
  if(hot!==IX.hot){IX.hot=hot;drawInfra()}};
 const up=ev=>{removeEventListener('pointermove',move);removeEventListener('pointerup',up);ghost.remove();const r=svg.getBoundingClientRect();const inside=ev.clientX>r.left&&ev.clientX<r.right&&ev.clientY>r.top&&ev.clientY<r.bottom-100;IX.hot=null;
  if(!st.moved){const c=cam();createEq(type,{x:(svg.clientWidth/2-c.x)/c.k,y:(svg.clientHeight/2-60-c.y)/c.k});return}if(inside)createEq(type,toWorld(ev));else drawInfra()};
 addEventListener('pointermove',move);addEventListener('pointerup',up);move(e)}
function createEq(type,p){const s=siteDoc();const n=s.eq.filter(q=>q.type===type).length+1;const name=`${PREFIX[type]||'EQ'}-${String(n).padStart(2,'0')}`;
 const fl=IX.floor||s.floors[0]?.id||'';const T=EQ[type];
 const e={id:uid('e'),type,name,role:'',floorId:['service','vm'].includes(type)?'':fl,roomId:'',x:40+n*12,y:40+n*12,ip:'',vlan:'',os:'',scope:['service','vm'].includes(type)?'central':'local',status:'propose',notes:'',specs:{}};
 let msg=`${name} ajouté.`;
 if(IX.view==='topo'){e.tx=snap(p.x-TN/2);e.ty=snap(p.y-TN/2);const z=zoneable(e)?zoneAt(s,p):null;if(z){e.vlan=String(z.v.id);e.ip=nextIp(s,z.v);msg=`${name} ajouté au VLAN ${z.v.id} · IP ${e.ip}`}
  else if(['switch','wifi','routeur'].includes(type)&&vlanOf(s,99)){e.vlan='99';e.ip=nextIp(s,vlanOf(s,99))}}
 else{e.x=snap(p.x-NODE/2);e.y=snap(p.y-NODE/2);const r=roomAt(s,p);if(r)e.roomId=r.id;placeInZone(s,e)}
 if(IX.view==='topo'&&e.tx==null)placeInZone(s,e);
 s.eq.push(e);
 if(zoneable(e)&&type!=='mobile'){const sw=s.eq.find(q=>q.type==='switch');if(sw){s.links.push({id:uid('l'),a:sw.id,b:e.id,type:'rj45',label:e.vlan?'VLAN '+e.vlan:''});msg+=` · câblé à ${sw.name}`}}
 if(type==='mobile'){const ap=s.eq.find(q=>q.type==='wifi');if(ap){s.links.push({id:uid('l'),a:ap.id,b:e.id,type:'wifi',label:'Wi-Fi'});msg+=` · connecté en Wi-Fi à ${ap.name}`}}
 IX.sel={kind:'eq',id:e.id};saveSite(`a ajouté ${name} (${T.l}) dans`);toast(msg+'. Clique dessus pour le modifier.');drawInfra();renderDrawer()}
function connectClick(id){if(!IX.src){IX.src=id;renderView();return}if(IX.src===id){IX.src=null;renderView();return}
 if(isInter()){const m=clone(D.meta.get('inter'))||{links:[]};const l={id:uid('il'),a:IX.src,b:id,type:'vpn',label:'VPN IPsec'};m.links.push(l);put('meta','inter',{links:m.links},['a relié',`${D.sites.get(IX.src)?.name} et ${D.sites.get(id)?.name}`,'infra']);IX.sel={kind:'ilink',id:l.id}}
 else{const s=siteDoc();const a=s.eq.find(x=>x.id===IX.src),b=s.eq.find(x=>x.id===id);let type='rj45';const ty=[a.type,b.type];if(ty.includes('service')||ty.includes('vm')&&!ty.includes('switch'))type='flux';else if(ty.includes('peripherique'))type='usb';else if(ty.includes('mobile'))type='wifi';else if(ty.every(t=>['switch','parefeu','routeur','wifi'].includes(t)))type='trunk';else if(ty.includes('box'))type='wan';
  const l={id:uid('l'),a:a.id,b:b.id,type,label:type==='rj45'&&(zoneable(a)?a:b).vlan?'VLAN '+(zoneable(a)?a:b).vlan:''};s.links.push(l);IX.sel={kind:'link',id:l.id};saveSite(`a câblé ${a.name} à ${b.name} dans`);toast(`${a.name} ↔ ${b.name} : ${LINKS[type].l}`)}
 IX.src=null;renderView()}
function saveSite(verb){const s=siteDoc();IW=s;put('sites',s.id,stripId(s),verb?[verb,s.name,'infra']:null)}

/* ---------- info-bulles ---------- */
function tipEl(){let t=$('#tip');if(!t){t=document.createElement('div');t.id='tip';t.className='tip';document.body.appendChild(t)}return t}
function tipOver(e){if(idrag)return;const n=e.target.closest('[data-eq],[data-site]');if(!n)return;const t=tipEl();
 if(n.dataset.site){const s=D.sites.get(n.dataset.site);const ic=s.kind==='cloud'?'cloud':s.central?'mairie':'building';t.innerHTML=`<div class="pic">${icon(ic,62)}</div><div><h4>${esc(s.name)}</h4><p>${s.kind==='cloud'?esc(EQ.cloud.d):esc(s.notes||'Bâtiment municipal.')}</p>${s.kind!=='cloud'?`<dl><dt>Réseau</dt><dd>10.${s.code}.0.0/16</dd><dt>Équipements</dt><dd>${(s.eq||[]).length}</dd></dl>`:''}</div>`}
 else{const s=siteDoc();const q=s?.eq.find(x=>x.id===n.dataset.eq);if(!q)return;const T=EQ[q.type]||EQ.service;const room=s.rooms.find(r=>r.id===q.roomId);const vl=vlanOf(s,q.vlan);
  const specs=(EQ_FIELDS[q.type]||[]).map(([k,l])=>q.specs?.[k]?`<dt>${esc(l)}</dt><dd>${esc(q.specs[k])}</dd>`:'').join('');
  t.innerHTML=`<div class="pic">${icon(q.type,62)}</div><div><h4>${esc(q.name)} <span class="chip ${q.status==='propose'?'warn':'ok'}" style="font-size:10px">${q.status==='propose'?'Proposé':'Validé'}</span></h4><div class="tiny muted">${esc(T.l)}${q.type==='switch'&&q.specs?.niveau?' · niveau '+esc(q.specs.niveau):''}</div><p>${esc(q.role||T.d)}</p>
  <dl>${q.ip?`<dt>Adresse IP</dt><dd>${esc(q.ip)}</dd>`:''}${q.vlan?`<dt>VLAN</dt><dd>${esc(q.vlan)}${vl?' · '+esc(vl.name):''}</dd>`:''}${q.os?`<dt>Système</dt><dd>${esc(q.os)}</dd>`:''}${specs}${room?`<dt>Salle</dt><dd>${esc(room.name)}</dd>`:''}</dl><div class="tiny muted" style="margin-top:6px">Clique pour modifier</div></div>`}
 t.classList.add('on');tipMove(e)}
function tipMove(e){const t=$('#tip');if(!t||!t.classList.contains('on'))return;const w=330,h=t.offsetHeight;let x=e.clientX+18,y=e.clientY+14;if(x+w>innerWidth-10)x=e.clientX-w-18;if(y+h>innerHeight-10)y=innerHeight-h-10;t.style.left=x+'px';t.style.top=y+'px'}
function tipOut(e){const n=e.target.closest('[data-eq],[data-site]');if(n&&!n.contains(e.relatedTarget))tipHide()}
function tipHide(){$('#tip')?.classList.remove('on')}

/* ---------- panneau latéral ---------- */
const pin=(label,val,on,type='text',extra='')=>`<label class="field"><span>${label}</span><div class="row" style="flex-wrap:nowrap;gap:6px"><input type="${type}" value="${esc(val??'')}" onchange="${on}">${extra}</div></label>`;
const ptx=(label,val,on)=>`<label class="field"><span>${label}</span><textarea rows="2" onchange="${on}">${esc(val??'')}</textarea></label>`;
const psel=(label,val,opts,on)=>`<label class="field"><span>${label}</span><select onchange="${on}">${opts.map(([v,l])=>`<option value="${esc(v)}" ${String(v)===String(val??'')?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
function renderDrawer(){const el=$('#drawer');if(!el)return;const sel=IX.sel;if(!sel){el.classList.remove('open');return}
 const head=(title,sub,ic)=>`<div class="drawer-head"><div class="row" style="flex-wrap:nowrap;gap:12px;min-width:0">${ic?`<div class="pic">${ic}</div>`:''}<div style="min-width:0"><h2>${title}</h2>${sub?`<div class="tiny muted">${sub}</div>`:''}</div></div><button class="btn ghost icon" onclick="IX.sel=null;drawInfra();renderDrawer()" aria-label="Fermer">${ui('close',16)}</button></div>`;
 let h='';
 if(isInter()){if(sel.kind==='site'){const s=D.sites.get(sel.id);if(!s){IX.sel=null;return renderDrawer()}h=head(esc(s.name),s.kind==='cloud'?'Réseau public':'Bâtiment n°'+s.code,icon(s.kind==='cloud'?'cloud':s.central?'mairie':'building',52))+pin('Nom',s.name,`updSite('${s.id}','name',this.value)`)+(s.kind!=='cloud'?pin('Numéro (plan d\'adressage)',s.code,`updSite('${s.id}','code',+this.value)`,'number'):'')+ptx('Notes',s.notes,`updSite('${s.id}','notes',this.value)`)+(s.kind!=='cloud'?`<button class="btn primary" style="width:100%;justify-content:center" onclick="IX.site='${s.id}';IX.sel=null;renderView()">Ouvrir ce bâtiment ›</button>`:'')}
  else{const l=(D.meta.get('inter')?.links||[]).find(x=>x.id===sel.id);if(!l){IX.sel=null;return renderDrawer()}h=head('Liaison',`${esc(D.sites.get(l.a)?.name)} ↔ ${esc(D.sites.get(l.b)?.name)}`)+psel('Type',l.type,Object.entries(LINKS).map(([k,v])=>[k,v.l]),`updILink('${l.id}','type',this.value)`)+pin('Étiquette',l.label,`updILink('${l.id}','label',this.value)`)+`<button class="btn danger sm" onclick="delILink('${l.id}')">${ui('trash',14)} Supprimer</button>`}
  el.innerHTML=h;el.classList.add('open');return}
 const s=siteDoc();
 if(sel.kind==='eq'){const q=s.eq.find(x=>x.id===sel.id);if(!q){IX.sel=null;return renderDrawer()}const T=EQ[q.type]||EQ.service;const links=s.links.filter(l=>l.a===q.id||l.b===q.id);const on=k=>`updEq('${q.id}','${k}',this.value)`;const infra=!zoneable(q);
  h=head(esc(q.name),esc(T.l),icon(q.type,52))+`<p class="small muted" style="margin:0 0 12px">${esc(T.d)}</p>`+
  pin('Nom',q.name,on('name'))+
  `<div class="grid" style="grid-template-columns:1fr 1fr;gap:8px">${psel('VLAN',q.vlan,[['','Aucun'],...(s.vlans||[]).map(v=>[String(v.id),v.id+' · '+v.name]),['WAN','WAN (Internet)'],['Tous','Tous (trunk)']],on('vlan'))}${psel('Statut',q.status,[['propose','Proposé'],['valide','Validé'],['existant','Existant']],on('status'))}</div>`+
  pin('Adresse IP',q.ip,on('ip'),'text',vlanOf(s,q.vlan)?`<button type="button" class="btn sm" title="Prendre la prochaine adresse libre du VLAN" onclick="autoIp('${q.id}')">Auto</button>`:'')+
  ptx('Rôle',q.role,on('role'))+
  psel('Salle',q.roomId,[['','—'],...s.rooms.map(r=>[r.id,r.name])],on('roomId'))+
  pin(q.type==='service'||q.type==='vm'?'Logiciel / système':'Modèle / système',q.os,on('os'))+
  (EQ_FIELDS[q.type]||[]).map(([k,l,t,o])=>t==='select'?psel(l,q.specs?.[k],[['','—'],...o.map(x=>[x,x])],`updSpec('${q.id}','${k}',this.value)`):pin(l,q.specs?.[k],`updSpec('${q.id}','${k}',this.value)`)).join('')+
  (infra?`<div class="grid" style="grid-template-columns:1fr 1fr;gap:8px">${pin('Baie : position (U)',q.rackU,on('rackU'),'number')}${pin('Hauteur (U)',q.rackH,on('rackH'),'number')}</div>`:'')+
  `<div class="eyebrow" style="margin:8px 0 6px">Câbles et liaisons (${links.length})</div>${links.map(l=>{const o=s.eq.find(x=>x.id===(l.a===q.id?l.b:l.a));return `<div class="ti" onclick="IX.sel={kind:'link',id:'${l.id}'};drawInfra();renderDrawer()">${icon(o?.type||'service',22)} ${esc(o?.name||'?')}<span class="tiny muted" style="margin-left:auto">${esc(LINKS[l.type]?.l||l.type)}</span></div>`}).join('')||'<p class="small muted">Aucun.</p>'}
  <div class="row" style="flex-wrap:nowrap;gap:6px;margin-top:8px"><select id="cnTo" style="min-width:0">${s.eq.filter(x=>x.id!==q.id).map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select><button class="btn sm" onclick="addLink('${q.id}')">${ui('link',14)} Relier</button></div>
  <button class="btn danger sm" style="margin-top:16px" onclick="delEq('${q.id}')">${ui('trash',14)} Supprimer</button>`}
 else if(sel.kind==='zone'){const v=vlanOf(s,sel.id);if(!v){IX.sel=null;return renderDrawer()}const mem=s.eq.filter(e=>String(e.vlan)===String(v.id));const i=s.vlans.indexOf(v);
  h=head(`VLAN ${v.id} · ${esc(v.name)}`,'Zone de réseau',`<span class="zone-ico" style="background:${vColor(v)}"></span>`)+`<p class="small muted" style="margin:0 0 12px">Un VLAN est un réseau séparé à l'intérieur du même switch. Les équipements d'un VLAN ne parlent pas à ceux d'un autre sans passer par le pare-feu.</p>`+
  `<div class="grid" style="grid-template-columns:1fr 1fr;gap:8px">${pin('Numéro',v.id,`updVlan(${i},'id',this.value)`,'number')}${pin('Nom',v.name,`updVlan(${i},'name',this.value)`)}</div>${pin('Réseau',v.net,`updVlan(${i},'net',this.value)`)}${pin('Passerelle',v.gw,`updVlan(${i},'gw',this.value)`)}${pin('Pour qui ?',v.use,`updVlan(${i},'use',this.value)`)}
  <label class="field"><span>Couleur</span><div class="row" style="gap:6px">${ZPAL.map(c=>`<button type="button" class="swatch ${vColor(v)===c?'on':''}" style="background:${c}" onclick="updVlan(${i},'color','${c}')" aria-label="Couleur"></button>`).join('')}</div></label>
  <div class="eyebrow" style="margin:8px 0 6px">Dans cette zone (${mem.length})</div>${mem.map(e=>`<div class="ti" onclick="IX.sel={kind:'eq',id:'${e.id}'};drawInfra();renderDrawer()">${icon(e.type,22)} ${esc(e.name)}<span class="tiny muted mono" style="margin-left:auto">${esc(e.ip)}</span></div>`).join('')||'<p class="small muted">Vide : glisse un équipement dedans.</p>'}
  <button class="btn danger sm" style="margin-top:16px" onclick="delVlan(${i})">${ui('trash',14)} Supprimer la zone</button>`}
 else if(sel.kind==='room'){const r=s.rooms.find(x=>x.id===sel.id);if(!r){IX.sel=null;return renderDrawer()}h=head(esc(r.name),'Salle')+pin('Nom',r.name,`updRoom('${r.id}','name',this.value)`)+ptx('Usage',r.notes,`updRoom('${r.id}','notes',this.value)`)+`<div class="eyebrow" style="margin:8px 0 6px">Équipements</div>${s.eq.filter(q=>q.roomId===r.id).map(q=>`<div class="ti" onclick="IX.sel={kind:'eq',id:'${q.id}'};drawInfra();renderDrawer()">${icon(q.type,22)} ${esc(q.name)}</div>`).join('')||'<p class="small muted">Aucun.</p>'}<button class="btn danger sm" style="margin-top:16px" onclick="delRoom('${r.id}')">${ui('trash',14)} Supprimer la salle</button>`}
 else if(sel.kind==='link'){const l=s.links.find(x=>x.id===sel.id);if(!l){IX.sel=null;return renderDrawer()}const a=s.eq.find(x=>x.id===l.a),b=s.eq.find(x=>x.id===l.b);h=head('Liaison',`${esc(a?.name)} ↔ ${esc(b?.name)}`)+psel('Type de liaison',l.type,Object.entries(LINKS).map(([k,v])=>[k,v.l]),`updLink('${l.id}','type',this.value)`)+pin('Étiquette (port, VLAN…)',l.label,`updLink('${l.id}','label',this.value)`)+`<button class="btn danger sm" onclick="delLink('${l.id}')">${ui('trash',14)} Supprimer</button>`}
 el.innerHTML=h;el.classList.add('open')}

/* ---------- modifications ---------- */
function updEq(id,k,v){const s=siteDoc();const q=s.eq.find(x=>x.id===id);const old=q[k];q[k]=v;
 if(k==='rackU'||k==='rackH')q[k]=v?+v:'';
 if(k==='roomId'&&v){const r=s.rooms.find(x=>x.id===v);q.floorId=r.floorId;q.x=snap(r.x+20+Math.random()*Math.max(10,r.w-NODE-40));q.y=snap(r.y+40+Math.random()*Math.max(10,r.h-NODE-70))}
 if(k==='vlan'){const z=vlanOf(s,v);if(z&&zoneable(q)&&z.zone!==false){q.ip=nextIp(s,z);const zz=zonesOf(s).find(x=>String(x.v.id)===String(v));if(zz){q.tx=zz.x+zz.w-TN-20;q.ty=zz.y+zz.h-TN-36}}relabel(s,q)}
 saveSite(`a modifié ${q.name} dans`);drawInfra();if(['vlan','name','roomId'].includes(k))renderDrawer()}
function autoIp(id){const s=siteDoc();const q=s.eq.find(x=>x.id===id);const z=vlanOf(s,q.vlan);if(!z)return;q.ip='';q.ip=nextIp(s,z);saveSite(`a donné une adresse à ${q.name} dans`);drawInfra();renderDrawer()}
function updSpec(id,k,v){const q=siteDoc().eq.find(x=>x.id===id);q.specs={...(q.specs||{}),[k]:v};saveSite(`a modifié ${q.name} dans`)}
function updRoom(id,k,v){siteDoc().rooms.find(x=>x.id===id)[k]=v;saveSite('a modifié une salle de');drawInfra()}
function updLink(id,k,v){siteDoc().links.find(x=>x.id===id)[k]=v;saveSite('a modifié une liaison dans');drawInfra()}
function updVlan(i,k,v){const s=siteDoc();const z=s.vlans[i];const old=z.id;z[k]=v;if(k==='id'){z.id=+v;s.eq.forEach(e=>{if(String(e.vlan)===String(old))e.vlan=String(v)})}saveSite('a modifié le VLAN '+z.id+' de');drawInfra();if(IX.view==='tables')renderTables();else{if(k==='id')IX.sel={kind:'zone',id:String(z.id)};renderDrawer()}}
function updSite(id,k,v){const s=clone(D.sites.get(id));s[k]=v;put('sites',id,stripId(s),['a modifié le bâtiment',s.name,'infra']);drawInfra()}
function updILink(id,k,v){const m=clone(D.meta.get('inter'));m.links.find(x=>x.id===id)[k]=v;put('meta','inter',{links:m.links});drawInfra()}
async function delILink(id){const m=clone(D.meta.get('inter'));m.links=m.links.filter(x=>x.id!==id);IX.sel=null;await put('meta','inter',{links:m.links},['a supprimé une liaison','entre bâtiments','infra']);drawInfra();renderDrawer()}
async function delEq(id){const s=siteDoc();const q=s.eq.find(x=>x.id===id);if(!await confirmBox(`Supprimer ${q.name} et ses câbles ?`))return;s.eq=s.eq.filter(x=>x.id!==id);s.links=s.links.filter(l=>l.a!==id&&l.b!==id);IX.sel=null;saveSite(`a supprimé ${q.name} de`);drawInfra();renderDrawer()}
async function delRoom(id){const s=siteDoc();if(!await confirmBox('Supprimer cette salle ? Ses équipements restent.'))return;s.rooms=s.rooms.filter(r=>r.id!==id);s.eq.forEach(q=>{if(q.roomId===id)q.roomId=''});IX.sel=null;saveSite('a supprimé une salle de');drawInfra();renderDrawer()}
function delLink(id){const s=siteDoc();s.links=s.links.filter(l=>l.id!==id);IX.sel=null;saveSite('a supprimé une liaison dans');drawInfra();renderDrawer()}
function addLink(a){const s=siteDoc();const b=$('#cnTo').value;if(!b)return;IX.src=a;connectClick(b)}
async function addZone(){const s=siteDoc();const used=new Set((s.vlans||[]).map(v=>+v.id));let n=10;while(used.has(n))n+=10;
 openForm({title:'Nouvelle zone (VLAN)',values:{id:n,name:'',net:`10.${s.code}.${n}.0/24`,gw:`10.${s.code}.${n}.254`,use:''},
  fields:[{k:'id',label:'Numéro du VLAN',type:'number',hint:'Ex. 10, 20, 50…'},{k:'name',label:'Nom (en majuscules)',placeholder:'EX. INVITES'},{k:'net',label:'Réseau',hint:'Proposé selon la règle 10.site.VLAN.0/24'},{k:'gw',label:'Passerelle'},{k:'use',label:'Pour qui ?',wide:true}],
  onSave:v=>{const zs=zonesOf(s);const x=zs.length?Math.max(...zs.map(z=>z.x+z.w))+50:0;const y=zs.length?Math.min(...zs.map(z=>z.y)):400;s.vlans=s.vlans||[];s.vlans.push({id:+v.id,name:(v.name||'VLAN'+v.id).toUpperCase(),net:v.net,gw:v.gw,use:v.use,zx:x,zy:y,zw:260,zh:190,color:ZPAL[s.vlans.length%ZPAL.length]});IX.sel={kind:'zone',id:String(+v.id)};saveSite(`a créé la zone VLAN ${v.id} dans`);drawInfra();renderDrawer();toast(`Zone VLAN ${v.id} créée : glisse des équipements dedans.`)}})}
async function addRoom(){const s=siteDoc();const n=await promptBox('Nom de la salle');if(!n)return;const fid=IX.floor||s.floors[0]?.id;if(!fid){s.floors=[{id:'f0',name:'Rez-de-chaussée'}];IX.floor='f0'}const R=s.rooms.filter(r=>r.floorId===(fid||'f0'));const maxY=R.length?Math.max(...R.map(r=>r.y+r.h)):-20;
 const r={id:uid('r'),name:n,floorId:fid||'f0',x:0,y:maxY+20,w:260,h:200,notes:''};s.rooms.push(r);IX.sel={kind:'room',id:r.id};saveSite(`a ajouté la salle ${n} à`);drawInfra();renderDrawer()}

/* ---------- tableaux ---------- */
function renderTables(){const s=siteDoc();const tabs=[['inventaire','Inventaire'],['adressage','Plan d\'adressage'],['serveurs','Serveurs et services'],['liens','Câblage']];let body='';
 if(IX.tab==='inventaire')body=`<table><thead><tr><th></th><th>Nom</th><th>Type</th><th>Salle</th><th>VLAN</th><th>Adresse IP</th><th>Rôle</th><th>Statut</th></tr></thead><tbody>${s.eq.map(q=>`<tr><td>${icon(q.type,28)}</td><td><b>${esc(q.name)}</b></td><td class="small">${esc(EQ[q.type]?.l||'')}</td><td class="small">${esc(s.rooms.find(r=>r.id===q.roomId)?.name||'')}</td><td>${q.vlan?`<span class="chip" style="color:${vColor(q.vlan,s)}">${esc(q.vlan)}</span>`:''}</td><td class="mono small">${esc(q.ip)}</td><td class="small">${esc(q.role)}</td><td><span class="chip ${q.status==='propose'?'warn':'ok'}">${q.status==='propose'?'Proposé':'Validé'}</span></td></tr>`).join('')}</tbody></table>`;
 else if(IX.tab==='adressage')body=`<table><thead><tr><th>VLAN</th><th>Nom</th><th>Réseau</th><th>Passerelle</th><th>Pour qui</th><th>Équipements</th></tr></thead><tbody>${(s.vlans||[]).map((v,i)=>`<tr><td><span class="dot" style="background:${vColor(v)}"></span> <b>${v.id}</b></td><td><input value="${esc(v.name)}" onchange="updVlan(${i},'name',this.value)"></td><td><input class="mono" value="${esc(v.net)}" onchange="updVlan(${i},'net',this.value)"></td><td><input class="mono" value="${esc(v.gw)}" onchange="updVlan(${i},'gw',this.value)"></td><td><input value="${esc(v.use||'')}" onchange="updVlan(${i},'use',this.value)"></td><td class="num">${s.eq.filter(q=>String(q.vlan)===String(v.id)).length}</td></tr>`).join('')}</tbody></table>`;
 else if(IX.tab==='serveurs'){const L=s.eq.filter(q=>['serveur','vm','service','nas','parefeu'].includes(q.type));body=L.length?`<div class="grid g-3" style="padding:12px">${L.map(q=>`<div class="card" style="padding:0;overflow:hidden"><div class="row" style="padding:12px;background:var(--surface-2);flex-wrap:nowrap">${icon(q.type,36)}<div><b>${esc(q.name)}</b><div class="tiny muted">${esc(EQ[q.type]?.l)}</div></div></div><table><tbody><tr><td class="muted small">Adresse IP</td><td class="mono small">${esc(q.ip||'—')}</td></tr><tr><td class="muted small">Système</td><td class="small">${esc(q.os||'—')}</td></tr><tr><td class="muted small">Rôle</td><td class="small">${esc(q.role||'—')}</td></tr></tbody></table></div>`).join('')}</div>`:'<div class="empty" style="margin:12px">Aucun serveur dans ce bâtiment : ils sont à la mairie.</div>'}
 else body=`<table><thead><tr><th>De</th><th>Vers</th><th>Type</th><th>Étiquette</th></tr></thead><tbody>${s.links.map(l=>`<tr><td>${esc(s.eq.find(x=>x.id===l.a)?.name)}</td><td>${esc(s.eq.find(x=>x.id===l.b)?.name)}</td><td class="small">${esc(LINKS[l.type]?.l)}</td><td class="small">${esc(l.label)}</td></tr>`).join('')}</tbody></table>`;
 $('#tablesHost').innerHTML=`<div class="row between" style="margin:6px 0 14px"><div class="seg">${tabs.map(([k,l])=>`<button class="${IX.tab===k?'on':''}" onclick="IX.tab='${k}';renderTables()">${l}</button>`).join('')}</div><button class="btn" onclick="exportCsv()">${ui('download',16)} Exporter (CSV)</button></div><div class="card tablewrap" style="padding:4px">${body}</div>`}
async function delVlan(i){if(!await confirmBox('Supprimer cette zone VLAN ? Ses équipements resteront, sans VLAN.'))return;const s=siteDoc();const id=s.vlans[i].id;s.vlans.splice(i,1);s.eq.forEach(e=>{if(String(e.vlan)===String(id))e.vlan=''});IX.sel=null;saveSite('a supprimé un VLAN de');drawInfra();renderDrawer()}
function exportCsv(){const s=siteDoc();const q=v=>`"${String(v??'').replace(/"/g,'""')}"`;let rows;
 if(IX.tab==='adressage')rows=[['VLAN','Nom','Réseau','Passerelle','Pour qui'],...(s.vlans||[]).map(v=>[v.id,v.name,v.net,v.gw,v.use])];
 else if(IX.tab==='liens')rows=[['De','Vers','Type','Étiquette'],...s.links.map(l=>[s.eq.find(x=>x.id===l.a)?.name,s.eq.find(x=>x.id===l.b)?.name,LINKS[l.type]?.l,l.label])];
 else rows=[['Nom','Type','Salle','VLAN','IP','Système','Rôle','Statut'],...s.eq.map(e=>[e.name,EQ[e.type]?.l,s.rooms.find(r=>r.id===e.roomId)?.name,e.vlan,e.ip,e.os,e.role,e.status])];
 saveFile(`${slug(s.name)}-${IX.tab}.csv`,new Blob(['﻿'+rows.map(r=>r.map(q).join(';')).join('\n')],{type:'text/csv'}))}

/* ---------- exports ---------- */
function resolvedSvg(){const g=$('#ig');const prevT=g.getAttribute('transform');g.setAttribute('transform','');const bb=g.getBBox();g.setAttribute('transform',prevT);
 const root=document.documentElement;const prev=root.getAttribute('data-theme');root.setAttribute('data-theme','light');
 const pad=30,w=Math.ceil(bb.width+pad*2),h=Math.ceil(bb.height+pad*2);const R=s=>s.replace(/var\((--[a-z0-9-]+)\)/g,(m,n)=>cssVar(n)||'#000');
 const inner=R(g.innerHTML),defs=R(ICON_DEFS),bg=cssVar('--surface');if(prev==null)root.removeAttribute('data-theme');else root.setAttribute('data-theme',prev);
 return{svg:`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="${bb.x-pad} ${bb.y-pad} ${w} ${h}"><defs>${defs}</defs><style>text{font-family:Arial,Helvetica,sans-serif}.halo{opacity:0}</style><rect x="${bb.x-pad}" y="${bb.y-pad}" width="${w}" height="${h}" fill="${bg}"/>${inner.replace(/href="#/g,'xlink:href="#')}</svg>`,w,h}}
function svgToImg({svg,w,h}){const scale=Math.min(2,3000/Math.max(w,h));return new Promise((res,rej)=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=w*scale;c.height=h*scale;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);c.toBlob(b=>res({blob:b,jpg:c.toDataURL('image/jpeg',.9),w:c.width,h:c.height}),'image/png')};img.onerror=rej;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)})}
async function exportView(fmt){$('.export')?.classList.remove('open');const v=isInter()?'inter':IX.view;const name=isInter()?'Tous les bâtiments':siteDoc().name;const vname={inter:'Interconnexion des bâtiments',iso:'Vue 3D',plan:'Plan',topo:'Topologie réseau',baie:'Baie de brassage'}[v];
 const fn=`veau-${slug(name)}-${slug(vname)}`;tipHide();const sel=IX.sel;IX.sel=null;drawInfra();const R=resolvedSvg();IX.sel=sel;drawInfra();
 if(fmt==='svg')return saveFile(fn+'.svg',new Blob([R.svg],{type:'image/svg+xml'}));
 let im;try{im=await svgToImg(R)}catch(e){toast('Conversion de l\'image impossible.','bad');return}
 if(fmt==='png')return saveFile(fn+'.png',im.blob);
 if(!window.jspdf){toast('Le module PDF n\'a pas pu se charger.','bad');return}
 const doc=new jspdf.jsPDF({orientation:'landscape',unit:'mm',format:'a4'});const PW=297,PH=210;
 const band=t=>{doc.setFillColor(15,27,51);doc.rect(0,0,PW,18,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(13);doc.text(t,10,11.5);doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text(`${new Date().toLocaleDateString('fr-FR')} · ${ME.name}`,PW-10,11.5,{align:'right'})};
 band(`Mairie de Veau — ${name} — ${vname}`);const maxW=PW-20,maxH=PH-40;const r=Math.min(maxW/im.w,maxH/im.h);doc.addImage(im.jpg,'JPEG',(PW-im.w*r)/2,24+(maxH-im.h*r)/2,im.w*r,im.h*r);
 doc.setTextColor(110,120,140);doc.setFontSize(8);doc.text('BTS SIO SISR · Projet SI de la Mairie de Veau · « ? » = proposition à valider',10,PH-6);
 if(!isInter()){const s=siteDoc();doc.addPage();band(`${s.name} — Inventaire et plan d'adressage`);let y=28;doc.setTextColor(15,27,51);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('Plan d\'adressage',10,y);y+=6;doc.setFont('helvetica','normal');doc.setFontSize(9);
  (s.vlans||[]).forEach(v=>{doc.text(`VLAN ${v.id}  ${v.name}`,12,y);doc.text(String(v.net||''),70,y);doc.text('passerelle '+(v.gw||''),112,y);doc.text(trunc(v.use||'',50),160,y);y+=5});
  y+=6;doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('Inventaire',10,y);y+=6;doc.setFontSize(8.5);const cols=[[10,'Nom'],[42,'Type'],[92,'Salle'],[142,'VLAN'],[158,'Adresse IP'],[190,'Rôle']];cols.forEach(([x,t])=>doc.text(t,x,y));doc.setFont('helvetica','normal');y+=5;
  s.eq.forEach(q=>{if(y>PH-12){doc.addPage();y=22}[q.name,EQ[q.type]?.l,s.rooms.find(r=>r.id===q.roomId)?.name,q.vlan,q.ip,q.role].forEach((t,i)=>doc.text(trunc(String(t||''),i===5?60:i===1?28:i===2?28:20),cols[i][0],y));y+=4.6})}
 saveFile(fn+'.pdf',doc.output('blob'))}
