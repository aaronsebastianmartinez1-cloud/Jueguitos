// ── audio.js — sonido sintetizado (AudioContext), sin archivos externos ──
let actx=null, muted=localStorage.getItem('polliclau_muted')==='1';
function ensureAudio(){ if(!actx){ try{actx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} } }
function beep(freq,dur,type,vol,delay){
  if(muted||!actx) return;
  const t0=actx.currentTime+(delay||0);
  const o=actx.createOscillator(), g=actx.createGain();
  o.type=type||'square'; o.frequency.setValueAtTime(freq,t0);
  g.gain.setValueAtTime(vol||0.08,t0);
  g.gain.exponentialRampToValueAtTime(0.001,t0+dur);
  o.connect(g); g.connect(actx.destination);
  o.start(t0); o.stop(t0+dur+0.02);
}
const sfx={
  jump:()=>beep(520,0.09,'square',0.06),
  stomp:()=>{beep(180,0.07,'square',0.09);beep(340,0.06,'square',0.06,0.03);},
  hurt:()=>{beep(220,0.18,'sawtooth',0.10);beep(120,0.22,'sawtooth',0.09,0.05);},
  life:()=>{[660,880,1100].forEach((f,i)=>beep(f,0.09,'square',0.07,i*0.06));},
  checkpoint:()=>beep(740,0.12,'sine',0.06),
  key:()=>{[880,1200].forEach((f,i)=>beep(f,0.08,'square',0.06,i*0.05));},
  meteor:()=>beep(140,0.08,'sawtooth',0.05),
  win:()=>{[523,659,784,1047].forEach((f,i)=>beep(f,0.14,'square',0.08,i*0.09));},
};
function updateSoundBtn(){document.getElementById('btn-sound').textContent=muted?'🔇':'🔊';}
updateSoundBtn();
document.getElementById('btn-sound').addEventListener('click',e=>{
  e.stopPropagation(); ensureAudio(); muted=!muted;
  localStorage.setItem('polliclau_muted',muted?'1':'0'); updateSoundBtn();
});
