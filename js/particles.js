// ── particles.js — polvo, fuegos artificiales y sacudida de cámara ──
let dust=[];
function spawnDust(wx2,wy2,n,spread){
  spread=spread||1;
  for(let i=0;i<n;i++){
    dust.push({wx:wx2+(Math.random()-0.5)*10*spread,wy:wy2,
      vx:(Math.random()-0.5)*1.6*spread,vy:-Math.random()*1.3-0.3,
      life:1,sz:2+Math.random()*2.2});
  }
}
function tickDust(){dust.forEach(d=>{d.wx+=d.vx;d.wy+=d.vy;d.vy+=0.05;d.life-=0.035;});dust=dust.filter(d=>d.life>0);}
function drawDust(){
  dust.forEach(d=>{
    const sx=wx(d.wx);if(sx<-10||sx>CW+10)return;
    ctx.save();ctx.globalAlpha=Math.max(0,d.life*0.55);
    ctx.fillStyle='rgba(255,255,255,0.85)';
    ctx.beginPath();ctx.arc(sx,d.wy,d.sz*d.life,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });
}

// ── Sacudida de cámara ──
let shakeT=0,shakeMag=0;
function shake(mag,t){shakeMag=Math.max(shakeMag,mag);shakeT=Math.max(shakeT,t);}

// ── Fuegos artificiales ──────────────────────────
let fws=[];
function spawnFW(wx2,wy){
  fws.push({
    wx:wx2, wy:wy,
    parts:Array.from({length:24},()=>({
      a:Math.random()*Math.PI*2,
      spd:1.2+Math.random()*2.8,
      col:`hsl(${Math.random()*360|0},100%,62%)`,
      px:0, py:0, life:1
    })),
    life:1
  });
}

function tickFW(){
  fws.forEach(fw=>{
    fw.life-=0.018;
    fw.parts.forEach(p=>{
      p.px+=Math.cos(p.a)*p.spd;
      p.py+=Math.sin(p.a)*p.spd+0.06;
      p.spd*=0.97;
      p.life-=0.022;
    });
  });
  fws=fws.filter(f=>f.life>0);
}

function drawFW(){
  fws.forEach(fw=>{
    fw.parts.forEach(p=>{
      if(p.life<=0)return;
      // En el menú los fuegos no usan camX (wx), son coordenadas de pantalla directas
      const sx = (state==='menu') ? (fw.wx+p.px) : wx(fw.wx+p.px);
      const sy=fw.wy+p.py;
      if(sx<-10||sx>CW+10)return;
      ctx.save();ctx.globalAlpha=Math.max(0,p.life*fw.life);
      ctx.fillStyle=p.col;
      ctx.beginPath();ctx.arc(sx,sy,2.8,0,Math.PI*2);ctx.fill();
      ctx.restore();
    });
  });
}
