// ── input.js — teclado y controles táctiles unificados ──
const keys={};
window.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  // Enter/Space en el menú lleva a la selección de planetas
  if(state==='menu'&&(e.code==='Space'||e.code==='Enter'||e.code==='KeyW'||e.code==='ArrowUp')){
    state='planetSelect';
  }
  if(state==='worldIntro'&&(e.code==='Space'||e.code==='Enter')){
    state='playing';
  }
  if((e.code==='KeyP'||e.code==='Escape')&&state==='playing'){ togglePause(); }
  if(e.code==='Escape'&&state==='exitConfirm'){ state='playing'; }
});
window.addEventListener('keyup',e=>keys[e.code]=false);
const touch={left:false,right:false,jump:false,_jh:false,_jq:false};
// Controles táctiles por zonas: cada zona es mucho más grande que el botón
// que se ve, y se recalcula con TODOS los dedos en cada evento. Así se puede
// deslizar el dedo de ◀ a ▶ sin levantarlo y los toques cerca del botón
// también cuentan.
const tc=document.getElementById('touch-controls');
const zoneMove=document.getElementById('zone-move');
const zoneJump=document.getElementById('zone-jump');
const bL=document.getElementById('btn-left'),bR=document.getElementById('btn-right'),bJ=document.getElementById('btn-jump');
const tracked=new Set(); // ids de dedos que empezaron dentro de una zona
function syncTouch(list){
  let l=false,r=false,j=false;
  const rl=bL.getBoundingClientRect(),rr=bR.getBoundingClientRect();
  const splitX=(rl.right+rr.left)/2;  // frontera entre ◀ y ▶
  const mid=window.innerWidth/2;
  for(const t of list){
    if(!tracked.has(t.identifier))continue;
    if(t.clientX<mid){ if(t.clientX<splitX)l=true; else r=true; }
    else j=true;
  }
  touch.left=l; touch.right=r; touch.jump=j;
  bL.classList.toggle('pressed',l); bR.classList.toggle('pressed',r); bJ.classList.toggle('pressed',j);
}
function zoneStart(e){
  e.preventDefault();
  for(const t of e.changedTouches){
    tracked.add(t.identifier);
    // Un toque rapidísimo (menos de un frame) no se pierde
    if(t.clientX>=window.innerWidth/2)touch._jq=true;
  }
  syncTouch(e.touches);
}
zoneMove.addEventListener('touchstart',zoneStart,{passive:false});
zoneJump.addEventListener('touchstart',zoneStart,{passive:false});
window.addEventListener('touchmove',e=>{if(tracked.size){e.preventDefault();syncTouch(e.touches);}},{passive:false});
function touchEnd(e){
  if(!tracked.size)return;
  for(const t of e.changedTouches)tracked.delete(t.identifier);
  syncTouch(e.touches);
}
window.addEventListener('touchend',touchEnd);
window.addEventListener('touchcancel',touchEnd);
// Los controles solo aparecen mientras se juega (no tapan los botones de los menús)
function watchTouchUI(){
  const active=state==='playing'&&!paused;
  if(tc.classList.contains('active')!==active){
    tc.classList.toggle('active',active);
    if(!active){tracked.clear();touch._jq=false;syncTouch([]);}
  }
  requestAnimationFrame(watchTouchUI);
}
requestAnimationFrame(watchTouchUI); // arranca cuando ya cargaron todos los scripts
const isLeft=()=>keys['ArrowLeft']||keys['KeyA']||touch.left;
const isRight=()=>keys['ArrowRight']||keys['KeyD']||touch.right;
const isJump=()=>{const q=touch._jq;touch._jq=false;return keys['Space']||keys['ArrowUp']||keys['KeyW']||touch.jump||q;};
