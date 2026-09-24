// ── state.js — estado central del juego, carga de mundos y jugador ──
let WW=1800;
let planet='tierra';
let worldIdx=0,state='menu',lives=3,score=0,deathT=0;
let winT=0,inv=0,camX=0,camY=0,celebT=0,deathMsg='';
let checkpointX=null,checkpointActive=false;
let enemies=[],projectiles=[],extraLives=[];
let meteors=[],meteorState=[],pickupKeys=[],keysCollected=0,lockMsgCd=0;
// Mundo del laberinto: las llaves del mundo anterior se guardan en carriedKeys
let carriedKeys=0,chests=[],geysers=[],fragments=0,respawnPt=null,banner=null;
let menuTick=0; // animación del menú
let paused=false;

function worldCount(){return planet==='marte'?MARTE_WORLDS.length:6;}

const setMsg=t=>document.getElementById('msg').textContent=t;
let bestScore=parseInt(localStorage.getItem('polliclau_best')||'0',10);
const setHUD=()=>{
  document.getElementById('hLives').textContent=lives;
  document.getElementById('hScore').textContent=score;
  document.getElementById('hWorld').textContent=(planet==='marte'?'🔴 Mundo ':'🌍 Mundo ')+(worldIdx+1);
  const keysEl=document.getElementById('hKeys');
  if(keysEl){
    if(W&&(W.keyGate||W.usesKeys)){
      keysEl.style.display='';
      document.getElementById('hKeysCount').textContent=keysCollected;
      document.getElementById('hKeysOf').style.display=W.keyGate?'':'none';
      document.getElementById('hKeysTotal').textContent=pickupKeys.length;
    }else keysEl.style.display='none';
  }
  const fragEl=document.getElementById('hFrags');
  if(fragEl){
    if(W&&W.fragGate){
      fragEl.style.display='';
      document.getElementById('hFragsCount').textContent=fragments;
      document.getElementById('hFragsTotal').textContent=chests.length;
    }else fragEl.style.display='none';
  }
  if(score>bestScore){bestScore=score;localStorage.setItem('polliclau_best',String(bestScore));}
};

// ── Runtime del mundo actual ──────────────────────
let W,mp,mp2,mp3;
function loadWorld(idx){
  const worldsArr=planet==='marte'?MARTE_WORLDS:TIERRA_WORLDS;
  const wwsArr=planet==='marte'?MARTE_WWS:TIERRA_WWS;
  W=worldsArr[idx];
  WW=wwsArr[idx];
  mp=W.mp?Object.assign({},W.mp):null;
  mp2=W.mp2?Object.assign({},W.mp2):null;
  mp3=W.mp3?Object.assign({},W.mp3):null;
  camX=0; camY=0; winT=0; celebT=0; fws=[];
  enemies=W.enemyDefs.map(d=>({
    ...d, hpCur:d.hp,
    shootTimer:Math.floor(Math.random()*(d.shootCd||80)+20),
    alive:true, frame:0, ft:0, dmgFlash:0,
  }));
  projectiles=[];
  const elDefsArr=W.elDefs||(W.elDef?[W.elDef]:[]);
  extraLives=elDefsArr.map(d=>({...d, collected:false, pulse:Math.random()*10}));
  checkpointX=null; checkpointActive=false;
  if(W.checkpoint) checkpointX=W.checkpoint.x;
  meteors=[];
  meteorState=W.meteorCols?W.meteorCols.map(c=>({x:c.x,cd:c.cd||100,timer:(c.cd||100)+(Math.random()*40|0)})):[];
  pickupKeys=W.keyDefs?W.keyDefs.map(k=>({...k,collected:false,pulse:Math.random()*10})):[];
  keysCollected=W.usesKeys?carriedKeys:0; lockMsgCd=0;
  chests=W.chestDefs?W.chestDefs.map(c=>({...c,opened:false,openT:0})):[];
  geysers=W.geyserDefs?W.geyserDefs.map(g=>({...g,t:g.off||0})):[];
  fragments=0; respawnPt=null; banner=null;
  document.getElementById('hWorld').textContent=(planet==='marte'?'🔴 Mundo ':'🌍 Mundo ')+(idx+1);
}
loadWorld(0);

function mkPl(cx,cy){
  return{x:cx??40,y:cy??(GY-44),w:30,h:36,vx:0,vy:0,
         onGround:false,jumps:0,dir:1,frame:0,ft:0,alive:true};
}
let pl=mkPl();
