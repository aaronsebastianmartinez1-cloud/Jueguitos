// ── tester.js — modo tester para probar mundos sin jugar los anteriores ──
// Se activa abriendo el juego con ?tester en la dirección (index.html?tester).
// Teclas durante el juego:
//   1-9  saltar a ese mundo del planeta actual
//   V    vidas infinitas (sí/no)
//   L    +1 llave
// En celular: tocar la etiqueta 🧪 TESTER del HUD pasa al siguiente mundo.
const TESTER=new URLSearchParams(location.search).has('tester');
let testerInfLives=false;

function testerJump(i){
  if(i>=worldCount()) return;
  worldIdx=i;
  loadWorld(i);
  if(W.usesKeys) keysCollected=carriedKeys=W.chestDefs.length; // como si ya tuviera las llaves del mundo anterior
  pl=mkPl(); inv=90; paused=false; fws=[];
  state=W.intro?'worldIntro':'playing';
  setHUD();
  testerMsg(`🧪 Mundo ${i+1}`);
  giveWorldBonus();
}

function testerMsg(t){ setMsg(t); setTimeout(()=>setMsg(''),1500); }

if(TESTER){
  const badge=document.createElement('span');
  badge.id='hTester';
  badge.title='1-9: ir a mundo · V: vidas infinitas · L: +1 llave';
  document.getElementById('hud').appendChild(badge);
  const paintBadge=()=>badge.textContent='🧪 TESTER'+(testerInfLives?' ∞':'');
  paintBadge();
  // En celular no hay teclado: tocar la etiqueta pasa al siguiente mundo
  badge.addEventListener('click',e=>{
    e.stopPropagation();
    if(['playing','worldIntro','dead','win'].includes(state)) testerJump((worldIdx+1)%worldCount());
  });

  window.addEventListener('keydown',e=>{
    if(!['playing','worldIntro','dead','win'].includes(state)) return;
    if(/^Digit[1-9]$/.test(e.code)){ testerJump(+e.code.slice(5)-1); return; }
    if(e.code==='KeyV'){
      testerInfLives=!testerInfLives; paintBadge();
      testerMsg(testerInfLives?'🧪 Vidas infinitas: SÍ':'🧪 Vidas infinitas: NO');
    }
    if(e.code==='KeyL'&&state==='playing'){ keysCollected++; setHUD(); testerMsg('🧪 +1 llave'); }
  });
}
