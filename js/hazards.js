// ── hazards.js — meteoritos y llaves coleccionables (Marte) ──
function spawnMeteor(x){
  meteors.push({wx:x,wy:-24,vy:2+Math.random()*0.8,r:8+Math.random()*2,rot:Math.random()*Math.PI*2});
}

function updateMeteors(){
  if(meteorState.length){
    for(const c of meteorState){
      c.timer--;
      if(c.timer<=0){
        spawnMeteor(c.x+(Math.random()-0.5)*30);
        c.timer=c.cd+(Math.random()*40|0);
      }
    }
  }
  if(!meteors.length) return;
  const all=[...W.plats,...(mp?[mp]:[]),...(mp2?[mp2]:[]),...(mp3?[mp3]:[])];
  for(const m of meteors){
    if(m.dead) continue;
    m.vy+=0.13; if(m.vy>7.5)m.vy=7.5;
    m.wy+=m.vy; m.rot+=0.2;
    for(const p of all){
      if(p&&rc(m.wx-m.r,m.wy-m.r,m.r*2,m.r*2,p.x,p.y,p.w,p.h)){
        m.dead=true; spawnDust(m.wx,m.wy,6,1.3); shake(2,4); sfx.meteor();
        break;
      }
    }
    if(!m.dead&&inv<=0&&rc(m.wx-m.r,m.wy-m.r,m.r*2,m.r*2,pl.x,pl.y,pl.w,pl.h)){
      m.dead=true; die();
      return;
    }
    if(m.wy>CH+60) m.dead=true;
  }
  meteors=meteors.filter(m=>!m.dead);
}

function drawMeteors(){
  meteors.forEach(m=>{
    const sx=wx(m.wx);if(sx<-20||sx>CW+20)return;
    ctx.save();
    ctx.translate(sx,wy(m.wy));ctx.rotate(m.rot);
    ctx.fillStyle='rgba(255,140,60,0.35)';
    ctx.beginPath();ctx.arc(0,-m.r*0.6,m.r*1.6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#5a3018';
    ctx.beginPath();ctx.arc(0,0,m.r,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#8a4a24';
    ctx.beginPath();ctx.arc(-m.r*0.3,-m.r*0.25,m.r*0.4,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });
}

function updateKeys(){
  if(!pickupKeys.length) return;
  for(const k of pickupKeys){
    if(k.collected||k.locked) continue;
    k.pulse+=0.09;
    if(rc(pl.x,pl.y,pl.w,pl.h,k.x-9,k.y-9,22,22)){
      k.collected=true; keysCollected++;
      sfx.key(); spawnFW(k.x,k.y);
      setMsg(`🔑 ¡Llave conseguida! (${keysCollected}/${pickupKeys.length})`);
      setTimeout(()=>setMsg(''),1600);
      setHUD();
    }
  }
}

function drawPickupKeys(){
  pickupKeys.forEach(k=>{
    if(k.collected||k.locked) return;
    const sx=wx(k.x);if(sx<-30||sx>CW+30)return;
    const sy=wy(k.y);
    const bob=Math.sin(k.pulse)*4;
    const glow=Math.abs(Math.sin(k.pulse))*0.5+0.35;
    ctx.save();
    ctx.globalAlpha=glow*0.4;
    ctx.fillStyle='#ffd700';
    ctx.beginPath();ctx.arc(sx,sy+bob,15,0,Math.PI*2);ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(sx,sy+bob);
    ctx.fillStyle='#ffd700';
    ctx.beginPath();ctx.arc(-5,0,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#a5730a';
    ctx.beginPath();ctx.arc(-5,0,2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffd700';
    ctx.fillRect(-1,-2,10,4);
    ctx.fillRect(5,-2,3,3);
    ctx.fillRect(5,3,3,3);
    ctx.restore();
  });
}
