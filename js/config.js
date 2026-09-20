// ── config.js — canvas, contexto y constantes globales ──
const cv=document.getElementById('gc'),ctx=cv.getContext('2d',{alpha:false});
ctx.imageSmoothingEnabled=false;
const CW=680,CH=380,GY=CH-60;
const GRAV=0.68,SPD=4.2;
const GS=GY-22;

function resizeCanvas(){
  const gw=document.getElementById('gw');
  const s=Math.min((gw.clientWidth-20)/CW,(gw.clientHeight-80)/CH);
  cv.style.width=(CW*s)+'px'; cv.style.height=(CH*s)+'px';
}
window.addEventListener('resize',resizeCanvas);
window.addEventListener('orientationchange',()=>setTimeout(resizeCanvas,200));
resizeCanvas();
