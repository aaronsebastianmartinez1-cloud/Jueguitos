// ── state.js — estado central del juego, carga de mundos y jugador ──
let WW=1800;
let worldIdx=0,state='menu',lives=3,score=0,deathT=0;
let winT=0,inv=0,camX=0,celebT=0,deathMsg='';
let checkpointX=null,checkpointActive=false;
let enemies=[],projectiles=[],extraLife=null;
let menuTick=0; // animación del menú
let paused=false;

const setMsg=t=>document.getElementById('msg').textContent=t;
let bestScore=parseInt(localStorage.getItem('polliclau_best')||'0',10);
const setHUD=()=>{
  document.getElementById('hLives').textContent=lives;
  document.getElementById('hScore').textContent=score;
  document.getElementById('hWorld').textContent='🌍 Mundo '+(worldIdx+1);
  if(score>bestScore){bestScore=score;localStorage.setItem('polliclau_best',String(bestScore));}
};

// ── Runtime del mundo actual ──────────────────────
let W,mp,mp2,mp3;
function loadWorld(idx){
  W=WORLDS[idx];
  WW=WWS[idx];
  mp=Object.assign({},W.mp);
  mp2=W.mp2?Object.assign({},W.mp2):null;
  mp3=W.mp3?Object.assign({},W.mp3):null;
  camX=0; winT=0; celebT=0; fws=[];
  enemies=W.enemyDefs.map(d=>({
    ...d, hpCur:d.hp,
    shootTimer:Math.floor(Math.random()*(d.shootCd||80)+20),
    alive:true, frame:0, ft:0, dmgFlash:0,
  }));
  projectiles=[];
  extraLife={...W.elDef, collected:false, pulse:0};
  checkpointX=null; checkpointActive=false;
  if(W.checkpoint) checkpointX=W.checkpoint.x;
  document.getElementById('hWorld').textContent='🌍 Mundo '+(idx+1);
}
loadWorld(0);

function mkPl(cx,cy){
  return{x:cx??40,y:cy??(GY-44),w:30,h:36,vx:0,vy:0,
         onGround:false,jumps:0,dir:1,frame:0,ft:0,alive:true};
}
let pl=mkPl();
