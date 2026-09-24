// ── maze.js — laberinto de Marte: cofres, fragmentos de casco y géiseres ──
const GEYSER_CYCLE=200, GEYSER_WARN=110, GEYSER_FIRE=150, GEYSER_H=84;
const btnOpen=document.getElementById('btn-open');

// ── Cofres ──
function nearChest(){
  if(state!=='playing'||paused||!pl.alive) return null;
  const cx=pl.x+pl.w/2, feet=pl.y+pl.h;
  for(const c of chests){
    if(c.opened) continue;
    if(Math.abs(cx-c.x)<48&&Math.abs(feet-c.y)<24) return c;
  }
  return null;
}

function tryOpenChest(){
  const c=nearChest();
  if(!c) return;
  if(keysCollected<=0){
    setMsg('🔒 No te quedan llaves');
    setTimeout(()=>setMsg(''),1500);
    return;
  }
  keysCollected--; fragments++;
  c.opened=true; c.openT=0;
  score+=100;
  respawnPt={x:c.x-15,y:c.y-44}; // si Clau cae, vuelve junto al último cofre abierto
  sfx.chest(); spawnFW(c.x,c.y-30);
  const total=chests.length;
  banner={t:0,dur:150,title:'🪖 ¡Fragmento de casco obtenido!',sub:`${fragments}/${total}`};
  if(fragments>=total){
    banner.next={t:0,dur:190,title:'🏁 ¡Busca la meta!',sub:'Ya apareció en algún lugar del laberinto',goal:true};
  }
  setMsg(`🪖 Fragmento de casco ${fragments}/${total}`);
  setTimeout(()=>setMsg(''),1800);
  setHUD();
}

btnOpen.addEventListener('click',e=>{e.stopPropagation();ensureAudio();tryOpenChest();});
btnOpen.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();ensureAudio();tryOpenChest();},{passive:false});

// Coloca el botón "Abrir" justo encima del cofre cercano (coordenadas de pantalla)
function updateOpenBtn(){
  const c=nearChest();
  if(!c){ btnOpen.classList.remove('show'); return; }
  const r=cv.getBoundingClientRect(), gr=cv.parentElement.getBoundingClientRect();
  const s=cv.clientWidth/CW;
  const sx=Math.max(50,Math.min(CW-50,wx(c.x))), sy=Math.max(40,wy(c.y-40));
  btnOpen.style.left=(r.left+cv.clientLeft-gr.left+sx*s)+'px';
  btnOpen.style.top=(r.top+cv.clientTop-gr.top+sy*s)+'px';
  btnOpen.textContent=keysCollected>0?'🔓 Abrir':'🔒 Sin llaves';
  btnOpen.classList.add('show');
}

function updateChests(){
  for(const c of chests) if(c.opened) c.openT++;
  if(banner){
    banner.t++;
    if(banner.gift&&banner.t===1) sfx.gift();
    if(banner.t>=banner.dur){
      banner=banner.next||null;
      if(banner&&banner.goal){ sfx.win(); setMsg('🏁 ¡Busca la meta!'); setTimeout(()=>setMsg(''),2500); }
    }
  }
}

function drawFragment(x,y,sc){
  ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
  ctx.fillStyle='rgba(140,220,255,0.35)';
  ctx.beginPath();ctx.arc(0,0,13,0,Math.PI*2);ctx.fill();
  // trozo de casco: media cúpula de cristal con borde metálico
  ctx.fillStyle='#bfe9ff';
  ctx.beginPath();ctx.moveTo(-9,4);ctx.arc(0,4,9,Math.PI,Math.PI*1.75);ctx.lineTo(1,4);ctx.closePath();ctx.fill();
  ctx.fillStyle='#d0d6de';ctx.fillRect(-10,3,12,3);
  ctx.fillStyle='rgba(255,255,255,0.9)';
  ctx.beginPath();ctx.arc(-4,-1,1.6,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawChests(){
  const near=nearChest();
  chests.forEach(c=>{
    const sx=wx(c.x);if(sx<-40||sx>CW+40)return;
    const sy=wy(c.y);
    const bx=sx-17,by=sy-22;
    if(c===near){
      ctx.save();ctx.globalAlpha=0.28+Math.abs(Math.sin(Date.now()*0.006))*0.25;
      ctx.fillStyle='#ffd700';ctx.beginPath();ctx.ellipse(sx,sy-12,30,20,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    // cuerpo
    ctx.fillStyle='#7a4a1a';ctx.fillRect(bx,by,34,22);
    ctx.fillStyle='#5a3410';ctx.fillRect(bx,by+10,34,2);
    ctx.fillStyle='#e0b030';ctx.fillRect(bx,by,3,22);ctx.fillRect(bx+31,by,3,22);
    if(!c.opened){
      // tapa cerrada + candado
      ctx.fillStyle='#8d5a22';ctx.beginPath();ctx.roundRect(bx-1,by-9,36,10,[6,6,0,0]);ctx.fill();
      ctx.fillStyle='#e0b030';ctx.fillRect(bx-1,by-1,36,3);
      ctx.fillStyle='#ffd700';ctx.fillRect(sx-4,by-2,8,9);
      ctx.fillStyle='#5a3410';ctx.fillRect(sx-1,by+2,2,3);
    }else{
      // tapa abierta hacia atrás y brillo interior
      ctx.fillStyle='rgba(140,220,255,0.35)';ctx.fillRect(bx+3,by-2,28,4);
      ctx.fillStyle='#8d5a22';ctx.fillRect(bx-1,by-16,36,7);
      ctx.fillStyle='#e0b030';ctx.fillRect(bx-1,by-10,36,2);
      if(c.openT<70){
        const k=c.openT/70;
        ctx.save();ctx.globalAlpha=1-k;
        drawFragment(sx,by-8-k*40,1+k*0.6);
        ctx.restore();
      }
    }
  });
}

// ── Géiseres de fuego ──
function geyserPhase(g){ return g.t%GEYSER_CYCLE; }
function geyserFlameH(g){
  const p=geyserPhase(g);
  if(p<GEYSER_FIRE) return 0;
  const k=p-GEYSER_FIRE, len=GEYSER_CYCLE-GEYSER_FIRE;
  return GEYSER_H*Math.min(1,k/6,(len-k)/8);
}

function updateGeysers(){
  for(const g of geysers){
    g.t++;
    if(geyserPhase(g)===GEYSER_FIRE&&Math.abs(g.x-pl.x)<CW) sfx.geyser();
    const h=geyserFlameH(g);
    if(h>10&&inv<=0&&rc(pl.x+4,pl.y+4,pl.w-8,pl.h-4,g.x+5,g.y-h,14,h)){ die(); return; }
  }
}

function drawGeysers(){
  geysers.forEach(g=>{
    const sx=wx(g.x);if(sx<-40||sx>CW+40)return;
    const sy=wy(g.y);
    const p=geyserPhase(g);
    // boca del géiser
    ctx.fillStyle='#2a0c08';
    ctx.beginPath();ctx.moveTo(sx-4,sy);ctx.lineTo(sx+3,sy-8);ctx.lineTo(sx+21,sy-8);ctx.lineTo(sx+28,sy);ctx.closePath();ctx.fill();
    const warn=p>=GEYSER_WARN&&p<GEYSER_FIRE;
    ctx.fillStyle=warn?`rgba(255,${120+Math.sin(g.t*0.5)*60|0},0,0.95)`:'#140504';
    ctx.fillRect(sx+6,sy-8,12,3);
    if(warn){
      // aviso: humo y chispas antes de la erupción
      for(let i=0;i<3;i++){
        const k=((g.t*1.4+i*14)%40)/40;
        ctx.fillStyle=`rgba(180,160,150,${0.45*(1-k)})`;
        ctx.beginPath();ctx.arc(sx+12+Math.sin(g.t*0.2+i*2)*4,sy-10-k*34,3+k*5,0,Math.PI*2);ctx.fill();
      }
    }
    const h=geyserFlameH(g);
    if(h>0){
      const fl=Math.sin(g.t*0.9)*2;
      const grad=ctx.createLinearGradient(0,sy-8,0,sy-8-h);
      grad.addColorStop(0,'#ffffaa');grad.addColorStop(0.35,'#ffb020');grad.addColorStop(1,'rgba(255,40,0,0.15)');
      ctx.fillStyle=grad;
      ctx.beginPath();
      ctx.moveTo(sx+3,sy-8);
      ctx.quadraticCurveTo(sx-2+fl,sy-8-h*0.5,sx+12,sy-8-h);
      ctx.quadraticCurveTo(sx+26-fl,sy-8-h*0.5,sx+21,sy-8);
      ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(255,120,0,0.18)';
      ctx.beginPath();ctx.ellipse(sx+12,sy-8-h*0.5,18,h*0.55,0,0,Math.PI*2);ctx.fill();
    }
  });
}

// ── Fondo de roca del laberinto ──
function drawMazeBackdrop(){
  if(!W.maze) return;
  const top=wy(MAZE_ROOF), h=GY-MAZE_ROOF;
  ctx.fillStyle='rgba(25,6,8,0.62)';
  ctx.fillRect(wx(0),top,WW,h);
  // piedritas decorativas (posiciones fijas, sin azar por frame)
  ctx.fillStyle='rgba(90,30,20,0.35)';
  const c0=Math.max(0,Math.floor(camX/80)), c1=Math.floor((camX+CW)/80)+1;
  for(let i=c0;i<=c1;i++){
    for(let r=0;r<6;r++){
      const px=i*80+((i*37+r*53)%70), py=MAZE_ROOF+30+r*75+((i*29+r*17)%40);
      ctx.beginPath();ctx.arc(wx(px),wy(py),2+((i+r)%3),0,Math.PI*2);ctx.fill();
    }
  }
}

// ── Meta del laberinto: oculta hasta tener todos los fragmentos ──
function goalHidden(){ return !!(W.fragGate&&fragments<chests.length); }

// Flecha en el borde de la pantalla que apunta a la meta cuando ya apareció
function drawGoalPointer(){
  if(!W.fragGate||goalHidden()) return;
  const g=W.goal, gx=wx(g.x+13), gy=wy(g.y+g.h/2);
  if(gx>20&&gx<CW-20&&gy>30&&gy<CH-20) return; // ya se ve en pantalla
  const bob=Math.sin(Date.now()*0.008)*4;
  ctx.save();
  const cx=CW/2,cy=CH/2,ang=Math.atan2(gy-cy,gx-cx);
  const px=Math.max(28,Math.min(CW-28,cx+Math.cos(ang)*CW)), py=Math.max(34,Math.min(CH-28,cy+Math.sin(ang)*CH));
  ctx.translate(px,py);
  ctx.fillStyle='rgba(0,0,0,0.45)';ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.fill();
  ctx.rotate(ang);
  ctx.fillStyle='#2ecc40';
  ctx.beginPath();ctx.moveTo(13+bob*0.5,0);ctx.lineTo(-6,-9);ctx.lineTo(-6,9);ctx.closePath();ctx.fill();
  ctx.rotate(-ang);
  ctx.fillStyle='#fff';ctx.font='bold 8px monospace';ctx.textAlign='center';
  ctx.fillText('META',0,28);
  ctx.restore();
}

// Cartel grande a mitad de pantalla ("Fragmento de casco obtenido", "Busca la meta")
// Cartel del regalo de vidas: bonito pero con un toque tétrico
function drawGiftBanner(){
  const t=banner.t, a=Math.max(0,Math.min(1,t/20,(banner.dur-t)/30));
  const flick=Math.random()<0.06?0.55:1; // parpadeo de vela
  ctx.save();
  ctx.globalAlpha=a;
  // viñeta oscura con borde rojo sangre
  const vg=ctx.createRadialGradient(CW/2,CH/2,60,CW/2,CH/2,CW*0.62);
  vg.addColorStop(0,'rgba(0,0,0,0.25)');vg.addColorStop(1,'rgba(70,0,10,0.75)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,CW,CH);
  // corazones que suben como almas
  for(let i=0;i<7;i++){
    const k=((t*0.6+i*37)%140)/140;
    const hx=CW/2-200+i*66+Math.sin(t*0.03+i)*10, hy=CH-20-k*CH*0.9;
    ctx.save();ctx.globalAlpha=a*(1-k)*0.55;ctx.fillStyle='#ff3366';
    ctx.beginPath();ctx.arc(hx-3,hy,3.5,0,Math.PI*2);ctx.arc(hx+3,hy,3.5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(hx-6.5,hy+1);ctx.lineTo(hx+6.5,hy+1);ctx.lineTo(hx,hy+8);ctx.closePath();ctx.fill();
    ctx.restore();
  }
  const bw=430,bh=156,bx=CW/2-bw/2,by=CH/2-bh/2-14;
  const pop=1+Math.max(0,0.18-t*0.012);
  ctx.translate(CW/2,by+bh/2);ctx.scale(pop,pop);ctx.translate(-CW/2,-(by+bh/2));
  // lápida/cuadro oscuro
  const bg=ctx.createLinearGradient(0,by,0,by+bh);
  bg.addColorStop(0,'#24000a');bg.addColorStop(1,'#060006');
  ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(bx,by,bw,bh,[28,28,10,10]);ctx.fill();
  ctx.strokeStyle=`rgba(200,20,40,${0.8*flick})`;ctx.lineWidth=3;
  ctx.beginPath();ctx.roundRect(bx,by,bw,bh,[28,28,10,10]);ctx.stroke();
  // gotas que escurren del borde superior
  ctx.fillStyle='#b0102a';
  for(let i=0;i<9;i++){
    const dx=bx+30+i*46+(i%2)*9;
    const len=6+((i*13)%10)+Math.min(26,Math.max(0,(t-10-i*6)*0.35))*((i%3)+1)/3;
    ctx.fillRect(dx-2,by+1,4,len);
    ctx.beginPath();ctx.arc(dx,by+1+len,3.4,0,Math.PI*2);ctx.fill();
  }
  ctx.textAlign='center';
  // título con brillo rosado
  ctx.shadowColor='#ff2255';ctx.shadowBlur=14*flick;
  ctx.fillStyle='#ff6b8f';ctx.font='bold 26px Courier New,monospace';
  ctx.fillText(`🩷 +${banner.gift} VIDAS EXTRA 🩷`,CW/2,by+56);
  ctx.shadowBlur=0;
  ctx.fillStyle='#f3e6ea';ctx.font='bold 14px Courier New,monospace';
  ctx.fillText('El laberinto te hace un regalo, Clau...',CW/2,by+88);
  // despedida fantasmal que tiembla un poquito
  const jx=(Math.random()-0.5)*1.2, jy=(Math.random()-0.5)*1.2;
  ctx.shadowColor='#9dff9d';ctx.shadowBlur=10;
  ctx.fillStyle=`rgba(190,255,200,${0.75+0.25*Math.sin(t*0.12)})`;
  ctx.font='italic bold 16px Courier New,monospace';
  ctx.fillText('Suerte... la vas a necesitar 💀',CW/2+jx,by+124+jy);
  ctx.shadowBlur=0;
  ctx.textAlign='left';
  ctx.restore();
}

function drawBanner(){
  if(!banner||banner.t<1) return;
  if(banner.gift){ drawGiftBanner(); return; }
  const a=Math.min(1,banner.t/12,(banner.dur-banner.t)/20);
  const pop=1+Math.max(0,0.25-banner.t*0.02);
  ctx.save();
  ctx.globalAlpha=a;
  ctx.translate(CW/2,96);ctx.scale(pop,pop);
  ctx.fillStyle='rgba(10,10,30,0.82)';
  ctx.beginPath();ctx.roundRect(-190,-40,380,84,16);ctx.fill();
  ctx.strokeStyle=banner.goal?'#2ecc40':'#8fd8ff';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(-190,-40,380,84,16);ctx.stroke();
  ctx.textAlign='center';
  ctx.fillStyle=banner.goal?'#2ecc40':'#FFD700';ctx.font='bold 19px Courier New,monospace';
  ctx.fillText(banner.title,0,-10);
  if(banner.goal){
    ctx.fillStyle='#fff';ctx.font='bold 12px Courier New,monospace';
    ctx.fillText(banner.sub,0,20);
  }else{
    // indicador de progreso de fragmentos: 1/4, 2/4…
    const n=chests.length;
    for(let i=0;i<n;i++){
      const on=i<fragments;
      ctx.globalAlpha=a*(on?1:0.35);
      drawFragment(-(n-1)*16+i*32-40,18,on?1:0.8);
    }
    ctx.globalAlpha=a;
    ctx.fillStyle='#8fd8ff';ctx.font='bold 22px Courier New,monospace';
    ctx.fillText(banner.sub,(n-1)*16+10,26);
  }
  ctx.textAlign='left';
  ctx.restore();
}
