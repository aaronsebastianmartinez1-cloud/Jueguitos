// ── input.js — teclado y controles táctiles unificados ──
const keys={};
window.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  // Enter/Space en el menú lleva a la selección de planetas
  if(state==='menu'&&(e.code==='Space'||e.code==='Enter'||e.code==='KeyW'||e.code==='ArrowUp')){
    state='planetSelect';
  }
  if((e.code==='KeyP'||e.code==='Escape')&&state==='playing'){ togglePause(); }
  if(e.code==='Escape'&&state==='exitConfirm'){ state='playing'; }
});
window.addEventListener('keyup',e=>keys[e.code]=false);
const touch={left:false,right:false,jump:false,_jh:false};
function addHold(el,flag){
  const on=()=>{touch[flag]=true;el.classList.add('pressed');};
  const off=()=>{touch[flag]=false;el.classList.remove('pressed');};
  el.addEventListener('touchstart',e=>{e.preventDefault();on();},{passive:false});
  el.addEventListener('touchend',e=>{e.preventDefault();off();},{passive:false});
  el.addEventListener('touchcancel',off);
  el.addEventListener('mousedown',on);
  el.addEventListener('mouseup',off);
  el.addEventListener('mouseleave',off);
}
addHold(document.getElementById('btn-left'),'left');
addHold(document.getElementById('btn-right'),'right');
addHold(document.getElementById('btn-jump'),'jump');
const isLeft=()=>keys['ArrowLeft']||keys['KeyA']||touch.left;
const isRight=()=>keys['ArrowRight']||keys['KeyD']||touch.right;
const isJump=()=>keys['Space']||keys['ArrowUp']||keys['KeyW']||touch.jump;
