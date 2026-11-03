/* ===== Illustrations des équipements (dessinées pour le projet, viewBox 64x64) ===== */
const ICON_DEFS=`
<linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef1f6"/><stop offset="1" stop-color="#c9d0dc"/></linearGradient>
<linearGradient id="gDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5466"/><stop offset="1" stop-color="#262d3a"/></linearGradient>
<linearGradient id="gDarkTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b7689"/><stop offset="1" stop-color="#3c4556"/></linearGradient>
<linearGradient id="gWhite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe4ec"/></linearGradient>
<linearGradient id="gScreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5aa0ff"/><stop offset="1" stop-color="#1f4fb8"/></linearGradient>
<linearGradient id="gScreenT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#45d1b8"/><stop offset="1" stop-color="#127a6c"/></linearGradient>
<linearGradient id="gCisco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b86e0"/><stop offset="1" stop-color="#1b4f9c"/></linearGradient>
<linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8644f"/><stop offset="1" stop-color="#a8301f"/></linearGradient>
<linearGradient id="gCloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc6ff"/><stop offset="1" stop-color="#4c86e6"/></linearGradient>
<linearGradient id="gPurple" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b48bf2"/><stop offset="1" stop-color="#6a3fc0"/></linearGradient>
<symbol id="i-cloud" viewBox="0 0 64 64"><path d="M18 46h30a11 11 0 0 0 1-22 15 15 0 0 0-28-3 10 10 0 0 0-3 25z" fill="url(#gCloud)" stroke="#2f62c4" stroke-width="1.5"/><path d="M22 36h20M24 31h16" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="i-box" viewBox="0 0 64 64"><path d="M10 34l22-9 22 9-22 9z" fill="url(#gTop)" stroke="#8a93a3"/><path d="M10 34v8l22 9v-8z" fill="#cfd5df" stroke="#8a93a3"/><path d="M54 34v8l-22 9v-8z" fill="#b7bfcc" stroke="#8a93a3"/><circle cx="16" cy="40" r="1.3" fill="#22c55e"/><circle cx="20" cy="41.6" r="1.3" fill="#22c55e"/><circle cx="24" cy="43.2" r="1.3" fill="#f59e0b"/><path d="M40 28v-12M46 31v-10" stroke="#4a5466" stroke-width="2.4" stroke-linecap="round"/></symbol>
<symbol id="i-routeur" viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="22" ry="9" fill="#173f7d"/><rect x="10" y="30" width="44" height="10" fill="url(#gCisco)"/><ellipse cx="32" cy="30" rx="22" ry="9" fill="#5b9cf0" stroke="#1b4f9c"/><g fill="#fff"><path d="M32 22l3 4h-2v3h-2v-3h-2z"/><path d="M32 38l-3-4h2v-3h2v3h2z"/><path d="M19 30l4-3v2h4v2h-4v2z"/><path d="M45 30l-4 3v-2h-4v-2h4v-2z"/></g></symbol>
<symbol id="i-parefeu" viewBox="0 0 64 64"><path d="M8 26l24-8 24 8-24 8z" fill="url(#gDarkTop)"/><path d="M8 26v14l24 8V34z" fill="url(#gRed)"/><path d="M56 26v14l-24 8V34z" fill="#7c2417"/><g stroke="#f9d3cc" stroke-width="1"><path d="M8 33l24 8M8 26.5l24 8"/><path d="M14 28v7M22 31v7M18 36v6M26 39v6M30 33v7"/></g><path d="M44 30c2 3 6 4 5 9-1 3-5 4-7 2 3 0 3-3 1-5 0 2-2 3-3 2 0-3 2-4 4-8z" fill="#ffb347"/></symbol>
<symbol id="i-switch" viewBox="0 0 64 64"><path d="M4 30l26-9 30 9-26 9z" fill="url(#gDarkTop)"/><path d="M4 30v7l30 10v-7z" fill="url(#gDark)"/><path d="M60 30v7l-26 10v-7z" fill="#1d232e"/><g fill="#9fb0c8">${Array.from({length:8},(_,i)=>{const x=6.5+i*3.4,y=31.4+(x-4)*0.333;return `<path d="M${x} ${y}l2.4.8v2.2l-2.4-.8z"/>`}).join('')}</g><g fill="#22c55e">${Array.from({length:8},(_,i)=>{const x=7.6+i*3.4,y=36.3+(x-4)*0.333;return `<circle cx="${x}" cy="${y}" r=".65"/>`}).join('')}</g><path d="M22 25l6-2M34 27l6 2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M28 23l-2 2.5M28 23l-2-1.2M34 27l2.2 0M40 29l-2.4.3" stroke="#fff" stroke-width="1.2"/></symbol>
<symbol id="i-wifi" viewBox="0 0 64 64"><ellipse cx="32" cy="42" rx="20" ry="7" fill="#c9d0dc"/><ellipse cx="32" cy="39" rx="20" ry="7" fill="url(#gWhite)" stroke="#a9b2c1"/><ellipse cx="32" cy="39" rx="5" ry="1.8" fill="#3b82f6"/><g fill="none" stroke="#3b82f6" stroke-width="2.2" stroke-linecap="round"><path d="M24 26a12 12 0 0 1 16 0"/><path d="M19 20a19 19 0 0 1 26 0"/><path d="M28 31a6 6 0 0 1 8 0"/></g></symbol>
<symbol id="i-brassage" viewBox="0 0 64 64"><rect x="4" y="26" width="56" height="12" rx="1.5" fill="#1f2530"/><g fill="#e9edf3">${Array.from({length:12},(_,i)=>`<rect x="${8+i*4.1}" y="29" width="2.8" height="2.6"/><rect x="${8+i*4.1}" y="33.2" width="2.8" height="2.6"/>`).join('')}</g><path d="M14 38c0 8 8 10 14 10M30 38c0 6 10 9 18 9" fill="none" stroke="#3b82f6" stroke-width="1.6"/><path d="M22 38c0 7 4 12 12 14" fill="none" stroke="#f59e0b" stroke-width="1.6"/></symbol>
<symbol id="i-onduleur" viewBox="0 0 64 64"><path d="M14 18l18-6 18 6-18 6z" fill="url(#gDarkTop)"/><path d="M14 18v32l18 6V24z" fill="url(#gDark)"/><path d="M50 18v32l-18 6V24z" fill="#1d232e"/><path d="M18 27l10 3.3v6L18 33z" fill="#7dd3fc"/><path d="M19 42l3 1v4l-3-1zM24 44l3 1v4l-3-1z" fill="#22c55e"/><path d="M39 34l4-1.3-1 4 3-1-6 7 1-5-3 1z" fill="#facc15"/></symbol>
<symbol id="i-serveur" viewBox="0 0 64 64"><path d="M18 14l16-5 14 5-16 5z" fill="url(#gDarkTop)"/><path d="M18 14v38l14 5V19z" fill="url(#gDark)"/><path d="M48 14v38l-16 5V19z" fill="#1d232e"/><g fill="#7e8aa0">${Array.from({length:4},(_,i)=>`<path d="M21 ${22+i*6}l8 2.6v3l-8-2.6z"/>`).join('')}</g><g fill="#22c55e">${Array.from({length:4},(_,i)=>`<circle cx="30.5" cy="${26+i*6}" r=".8"/>`).join('')}</g><circle cx="25" cy="48" r="1.6" fill="#3b82f6"/></symbol>
<symbol id="i-vm" viewBox="0 0 64 64"><rect x="10" y="22" width="34" height="26" rx="4" fill="#a78bfa" opacity=".45"/><rect x="16" y="16" width="34" height="26" rx="4" fill="#8b5cf6" opacity=".6"/><rect x="22" y="10" width="34" height="26" rx="4" fill="url(#gPurple)" stroke="#5b2fb0"/><rect x="26" y="14" width="26" height="4" rx="1.5" fill="#fff" opacity=".5"/><text x="39" y="31" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="800" font-size="10" fill="#fff">VM</text></symbol>
<symbol id="i-nas" viewBox="0 0 64 64"><path d="M16 20l16-5 16 5-16 5z" fill="url(#gTop)"/><path d="M16 20v26l16 5V25z" fill="#2d3442"/><path d="M48 20v26l-16 5V25z" fill="#1d232e"/><g fill="#9aa6ba">${Array.from({length:4},(_,i)=>`<path d="M${18.5+i*3.3} ${28+i*1.05}l2.3.75v14l-2.3-.75z"/>`).join('')}</g><circle cx="36" cy="30" r="1" fill="#22c55e"/></symbol>
<symbol id="i-poste" viewBox="0 0 64 64"><rect x="8" y="12" width="38" height="27" rx="2.5" fill="#2a303c"/><rect x="11" y="15" width="32" height="21" rx="1" fill="url(#gScreen)"/><path d="M14 19h12M14 23h18M14 27h9" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/><path d="M23 39h8l2 7h-12z" fill="#7a8395"/><rect x="16" y="46" width="22" height="3" rx="1.5" fill="#5b6475"/><rect x="48" y="20" width="10" height="30" rx="1.5" fill="url(#gDark)"/><circle cx="53" cy="25" r="1.2" fill="#22c55e"/><path d="M50 30h6M50 33h6" stroke="#8892a6"/></symbol>
<symbol id="i-public" viewBox="0 0 64 64"><rect x="10" y="10" width="44" height="31" rx="2.5" fill="#2a303c"/><rect x="13" y="13" width="38" height="25" rx="1" fill="url(#gScreenT)"/><circle cx="32" cy="22" r="4" fill="#fff" opacity=".85"/><path d="M24 33c1-5 15-5 16 0z" fill="#fff" opacity=".85"/><path d="M28 41h8l2 6H26z" fill="#7a8395"/><path d="M14 50l4-3h28l4 3z" fill="#5b6475"/></symbol>
<symbol id="i-borne" viewBox="0 0 64 64"><rect x="20" y="6" width="24" height="36" rx="3" fill="#2a303c"/><rect x="23" y="9" width="18" height="28" rx="1" fill="url(#gScreen)"/><path d="M26 14h12M26 18h9M26 22h12M26 26h7" stroke="#fff" stroke-opacity=".7" stroke-width="1.5" stroke-linecap="round"/><rect x="29" y="42" width="6" height="12" fill="#5b6475"/><ellipse cx="32" cy="56" rx="12" ry="3" fill="#3d4453"/></symbol>
<symbol id="i-automate" viewBox="0 0 64 64"><path d="M16 8h32v48H16z" fill="url(#gWhite)" stroke="#a9b2c1"/><rect x="20" y="12" width="24" height="16" rx="1" fill="url(#gScreen)"/><rect x="20" y="31" width="10" height="10" fill="#fff" stroke="#2a303c"/><path d="M21 32h3v3h-3zM26 32h3v3h-3zM21 37h3v3h-3zM26 37h1.5v1.5H26zM27.5 38.5H29V40h-1.5z" fill="#2a303c"/><rect x="33" y="33" width="11" height="6" rx="1" fill="#2a303c"/><path d="M34 35h9" stroke="#ef4444" stroke-width="1.2"/><rect x="22" y="46" width="20" height="3" rx="1" fill="#2a303c"/></symbol>
<symbol id="i-imprimante" viewBox="0 0 64 64"><path d="M20 12h24v12H20z" fill="#fff" stroke="#a9b2c1"/><path d="M10 24h44a3 3 0 0 1 3 3v17H7V27a3 3 0 0 1 3-3z" fill="url(#gTop)" stroke="#8a93a3"/><rect x="7" y="38" width="50" height="6" fill="#6b7689"/><path d="M18 42h28v12H18z" fill="#fff" stroke="#a9b2c1"/><path d="M22 47h20M22 50h14" stroke="#b6bfcd"/><circle cx="48" cy="30" r="1.6" fill="#22c55e"/></symbol>
<symbol id="i-peripherique" viewBox="0 0 64 64"><path d="M14 18l26-6 8 9-24 7z" fill="url(#gDark)"/><path d="M28 26l6-2 8 26-7 2z" fill="#2f3644"/><path d="M14 18l-4 2 2 3 12 5z" fill="#ef4444" opacity=".9"/><path d="M4 20l8 1M5 24l7-1" stroke="#ef4444" stroke-width="1.4"/><circle cx="36" cy="18" r="1.4" fill="#22c55e"/></symbol>
<symbol id="i-mobile" viewBox="0 0 64 64"><rect x="20" y="6" width="24" height="50" rx="5" fill="#2a303c"/><rect x="23" y="11" width="18" height="38" rx="1.5" fill="url(#gScreen)"/><circle cx="32" cy="52.5" r="1.6" fill="#7a8395"/><path d="M27 22a7 7 0 0 1 10 0M29 25a4 4 0 0 1 6 0" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/></symbol>
<symbol id="i-service" viewBox="0 0 64 64"><rect x="10" y="10" width="44" height="44" rx="12" fill="url(#gPurple)"/><path d="M32 22l3 1 2-2 3 3-2 2 1 3h3v4h-3l-1 3 2 2-3 3-2-2-3 1v3h-4v-3l-3-1-2 2-3-3 2-2-1-3h-3v-4h3l1-3-2-2 3-3 2 2 3-1v-3h4z" fill="#fff" opacity=".92"/><circle cx="30" cy="32" r="4" fill="#7c4bd6"/></symbol>
<symbol id="i-building" viewBox="0 0 64 64"><path d="M8 26l24-10 24 10-24 10z" fill="url(#gTop)" stroke="#8a93a3"/><path d="M8 26v20l24 10V36z" fill="#dfe4ec" stroke="#8a93a3"/><path d="M56 26v20L32 56V36z" fill="#bcc4d1" stroke="#8a93a3"/><g fill="#5a8fe0">${[0,1,2].map(i=>`<path d="M${12+i*6} ${34+i*2.5}l3.4 1.4v5l-3.4-1.4z"/>`).join('')}${[0,1,2].map(i=>`<path d="M${36+i*6} ${41-i*2.5}l3.4-1.4v5l-3.4 1.4z"/>`).join('')}</g></symbol>
<symbol id="i-mairie" viewBox="0 0 64 64"><path d="M6 28l26-12 26 12-26 12z" fill="url(#gTop)" stroke="#8a93a3"/><path d="M6 28v18l26 12V40z" fill="#e7e1d2" stroke="#8a93a3"/><path d="M58 28v18L32 58V40z" fill="#c9c1ad" stroke="#8a93a3"/><path d="M24 22l8-14 8 14-8 4z" fill="#2d5bd8"/><path d="M32 8v-4" stroke="#2a303c" stroke-width="1.2"/><path d="M32 4h5v2.5h-5z" fill="#c23b3b"/><g fill="#7a6f57">${[0,1,2,3].map(i=>`<path d="M${10+i*5} ${35+i*2.3}l2 .9v7l-2-.9z"/>`).join('')}</g></symbol>
`;
(function(){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width','0');s.setAttribute('height','0');s.style.position='absolute';s.innerHTML='<defs>'+ICON_DEFS+'</defs>';s.id='icon-defs';document.addEventListener('DOMContentLoaded',()=>document.body.prepend(s));if(document.body)document.body.prepend(s)})();
const icon=(type,size=28)=>`<svg class="ill" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><use href="#i-${EQ[type]||type==='building'||type==='mairie'?type:'service'}"/></svg>`;

/* Pictogrammes d'interface (trait) */
const UI_ICONS={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 tasks:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
 gantt:'<path d="M4 6h9M7 12h11M5 18h7"/><path d="M4 3v18"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 map:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 docs:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
 decision:'<path d="M12 3v18M5 7h14M5 7l-2 6h4zM19 7l-2 6h4z"/>',
 check:'<path d="M4 7h3M4 12h3M4 17h3"/><path d="M10 7h10M10 12h10M10 17h6"/>',
 req:'<path d="M5 4h14v16H5z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
 qq:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17.5v.5"/>',
 learn:'<path d="M3 8l9-4 9 4-9 4z"/><path d="M7 10v5c3 2 7 2 10 0v-5"/>',
 team:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2c3 .3 5.5 2.5 5.5 5.8"/>',
 bell:'<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 ext:'<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
 download:'<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1"/><path d="M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 rotate:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
 fit:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 history:'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5M12 8v5l3 2"/>',
 drive:'<path d="M8 3h8l6 11-4 7H6l-4-7z"/><path d="M8 3l6 11h8M2 14l6-11M6 21l4-7"/>',
 search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 rack:'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M5 8h14M5 13h14M8 5.5h2M8 10.5h2M8 15.5h2"/>',
 table:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M9 10v9M15 10v9"/>',
 cube:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
 topo:'<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M12 7.5v4M12 11.5L6.5 16M12 11.5l5.5 4.5"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 plan:'<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 12h9V3M12 12v9M16 12h5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
 spark:'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>'
};
const ui=(n,s=18)=>`<svg class="uic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${UI_ICONS[n]||''}</svg>`;
