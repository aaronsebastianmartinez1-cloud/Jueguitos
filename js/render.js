// ── render.js — dibujo del mundo, jugador y enemigos ──
const wx=x=>x-camX;
const wy=y=>y-camY;

function drawBG(){
  const sky=ctx.createLinearGradient(0,0,0,CH);
  sky.addColorStop(0,W.sky[0]); sky.addColorStop(1,W.sky[1]);
  ctx.fillStyle=sky; ctx.fillRect(0,0,CW,CH);
  if(W.bgStars){
    ctx.fillStyle=(planet==='tierra'&&worldIdx===5)?'rgba(180,160,255,0.9)':'rgba(255,255,255,0.8)';
    [[50,20],[150,35],[300,15],[450,28],[600,10],[650,40],[200,8],[500,22],[380,38],
     [80,60],[250,70],[420,50],[560,65],[700,55],[620,80],[100,90],[350,85]].forEach(([sx,sy])=>{
      ctx.beginPath();ctx.arc(sx,sy,1.2,0,Math.PI*2);ctx.fill();
    });
  }
  if(planet==='tierra'){
    if(worldIdx===0){
      ctx.fillStyle='#FFE066';ctx.beginPath();ctx.arc(CW-60,48,26,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,224,102,0.18)';ctx.beginPath();ctx.arc(CW-60,48,42,0,Math.PI*2);ctx.fill();
    }else if(worldIdx===1){
      const g2=ctx.createRadialGradient(CW-60,50,5,CW-60,50,35);
      g2.addColorStop(0,'#ffdd44');g2.addColorStop(1,'#ff8800');
      ctx.fillStyle=g2;ctx.beginPath();ctx.arc(CW-60,50,30,0,Math.PI*2);ctx.fill();
    }else if(worldIdx===2){
      ctx.fillStyle='#ffffcc';ctx.beginPath();ctx.arc(CW-70,55,20,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=W.sky[0];ctx.beginPath();ctx.arc(CW-58,48,16,0,Math.PI*2);ctx.fill();
    }else if(worldIdx===4){
      ctx.fillStyle='rgba(255,60,0,0.08)';ctx.fillRect(0,CH/2,CW,CH/2);
    }else if(worldIdx===5){
      ctx.fillStyle='rgba(80,0,150,0.12)';ctx.beginPath();ctx.ellipse(200,CH/2,180,80,0.3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(0,80,180,0.10)';ctx.beginPath();ctx.ellipse(500,CH/2-20,160,70,-0.2,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#6644aa';ctx.beginPath();ctx.arc(CW-70,55,22,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=W.sky[1];ctx.beginPath();ctx.arc(CW-60,48,18,0,Math.PI*2);ctx.fill();
    }
  }else if(planet==='marte'){
    ctx.fillStyle='#ffb066';ctx.beginPath();ctx.arc(CW-60,50,22,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,150,90,0.16)';ctx.beginPath();ctx.arc(CW-60,50,36,0,Math.PI*2);ctx.fill();
    if(W.earthInSky){
      const ex=90,ey=54;
      ctx.fillStyle='rgba(60,140,220,0.9)';ctx.beginPath();ctx.arc(ex,ey,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(110,200,110,0.75)';ctx.beginPath();ctx.arc(ex-3,ey-2,3.2,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(ex+4,ey+3,2.3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(180,220,255,0.7)';ctx.font='bold 9px Courier New,monospace';ctx.textAlign='center';
      ctx.fillText('la Tierra',ex,ey-18);
      ctx.textAlign='left';
    }
  }
  if(W.clouds&&W.clouds.length){
    ctx.fillStyle=worldIdx===2?'rgba(80,100,160,0.5)':'rgba(255,255,255,0.82)';
    W.clouds.forEach(([cx,cy,rw,rh])=>{
      const sx=cx-camX*0.38;if(sx<-120||sx>CW+80)return;
      ctx.beginPath();ctx.ellipse(sx,cy,rw,rh,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(sx+22,cy+6,rw*.6,rh*.6,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(sx-14,cy+5,rw*.5,rh*.5,0,0,Math.PI*2);ctx.fill();
    });
  }
  const segs=W.plats.filter(p=>p.g);
  const gy=wy(GY);
  segs.forEach(p=>{
    const sx=wx(p.x);if(sx>CW||sx+p.w<0)return;
    ctx.fillStyle=W.ground;ctx.fillRect(sx,gy,p.w,60);
    ctx.fillStyle=W.gline;
    if(planet==='tierra'&&worldIdx<3){
      for(let i=0;i<p.w;i+=18){ctx.beginPath();ctx.moveTo(sx+i,gy);ctx.lineTo(sx+i+9,gy-10);ctx.lineTo(sx+i+18,gy);ctx.fill();}
    }else{ctx.fillRect(sx,gy,p.w,4);}
  });
  for(let i=0;i<segs.length-1;i++){
    const a=segs[i],b=segs[i+1],gap=b.x-(a.x+a.w);if(gap<=0)continue;
    const sx=wx(a.x+a.w);
    if(worldIdx===4){
      const lc=`rgb(255,${70+Math.sin(Date.now()*0.004+i)*35|0},0)`;
      ctx.fillStyle=lc;ctx.fillRect(sx,gy+2,gap,58);
      ctx.fillStyle='rgba(255,200,50,0.6)';ctx.fillRect(sx,gy+2,gap,5);
    }else{ctx.fillStyle=W.pitCol;ctx.fillRect(sx,gy,gap,60);}
  }
}

function drawPlats(){
  const movs=[...(mp?[mp]:[]),...(mp2?[mp2]:[]),...(mp3?[mp3]:[])];
  [...W.plats.filter(p=>!p.g),...movs].forEach(p=>{
    const sx=wx(p.x);if(sx>CW||sx+p.w<0)return;
    const sy=wy(p.y);if(sy>CH||sy+p.h<0)return;
    const isM=movs.includes(p);
    ctx.fillStyle=isM?(worldIdx>=3?'#aa4400':'#c06030'):W.platCol;
    ctx.fillRect(sx,sy,p.w,p.h);
    ctx.fillStyle='rgba(0,0,0,0.28)';ctx.fillRect(sx,sy+p.h-4,p.w,4);
    ctx.strokeStyle='rgba(0,0,0,0.18)';ctx.lineWidth=1;
    for(let b=0;b<p.w;b+=26)ctx.strokeRect(sx+b,sy,Math.min(26,p.w-b),p.h);
  });
}

function drawSpikes(){
  W.spikes.forEach(s=>{
    const sx=wx(s.x);if(sx>CW||sx+s.w<0)return;
    const sy=wy(s.y);
    const n=Math.floor(s.w/10);
    let col,strokeCol;
    if(planet==='marte'){ col='#ff6644'; strokeCol='#a52a1a'; }
    else{
      col=worldIdx>=5?'#aa66ff':worldIdx>=4?'#ff6622':worldIdx===2?'#88aaff':'#d0d0d0';
      strokeCol=worldIdx>=5?'#6600cc':worldIdx>=4?'#cc3300':'#888';
    }
    for(let i=0;i<n;i++){
      ctx.fillStyle=col;
      ctx.beginPath();ctx.moveTo(sx+i*10,sy);ctx.lineTo(sx+i*10+5,sy-13);ctx.lineTo(sx+i*10+10,sy);
      ctx.closePath();ctx.fill();
      ctx.strokeStyle=strokeCol;ctx.lineWidth=0.8;ctx.stroke();
    }
  });
}

function drawCheckpoint(){
  if(worldIdx!==3||checkpointX===null)return;
  const sx=wx(checkpointX);if(sx<-60||sx>CW+60)return;
  const bob=Math.sin(Date.now()*0.004)*3;
  const gy=wy(GY);
  ctx.fillStyle='#555';ctx.fillRect(sx+10,gy-68+bob,4,68);
  ctx.fillStyle=checkpointActive?'#00ff88':'#bbbbbb';
  ctx.beginPath();ctx.moveTo(sx+14,gy-68+bob);ctx.lineTo(sx+38,gy-58+bob);ctx.lineTo(sx+14,gy-48+bob);ctx.closePath();ctx.fill();
  if(checkpointActive){ctx.fillStyle='rgba(0,255,136,0.2)';ctx.beginPath();ctx.arc(sx+12,gy-50,22,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle=checkpointActive?'#00ff88':'#fff';
  ctx.font='bold 9px monospace';ctx.textAlign='center';
  ctx.fillText(checkpointActive?'✅ CP':'CP',sx+12,gy-6);
  ctx.textAlign='left';
}

function drawExtraLife(){
  for(const el of extraLives){
    if(el.collected)continue;
    const sx=wx(el.x);if(sx<-40||sx>CW+40)continue;
    const sy=wy(el.y);
    const bob=Math.sin(el.pulse)*5;
    const glow=Math.abs(Math.sin(el.pulse))*0.55+0.3;
    ctx.save();
    ctx.globalAlpha=glow*0.4;
    ctx.fillStyle='#ff88cc';
    ctx.beginPath();ctx.arc(sx+6,sy+5+bob,18,0,Math.PI*2);ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(sx+6,sy+5+bob);
    ctx.fillStyle='#ff2266';
    ctx.beginPath();ctx.arc(-4,-3,6,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(4,-3,6,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.lineTo(0,10);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,200,220,0.7)';
    ctx.beginPath();ctx.arc(-3,-4,2.5,0,Math.PI*2);ctx.fill();
    ctx.restore();
    ctx.fillStyle='#fff';ctx.font='bold 9px monospace';ctx.textAlign='center';
    ctx.fillText('+1♥',sx+6,sy-10+bob);
    ctx.textAlign='left';
  }
}

function drawGoal(){
  if(goalHidden()) return;
  const g=W.goal,sx=wx(g.x);if(sx>CW||sx+g.w<0)return;
  const y=wy(g.y),{h}=g;
  const locked=!!(W.keyGate&&keysCollected<pickupKeys.length);
  ctx.fillStyle='#aaa';ctx.fillRect(sx+11,y,6,h+14);
  ctx.fillStyle='#ccc';ctx.fillRect(sx+11,y,2,h+14);
  const wave=locked?0:Math.sin((winT||Date.now()*.005)*.09)*6;
  const fc=locked?'#666677':planet==='marte'?'#ff5522':(worldIdx>=5?'#aa00ff':worldIdx>=4?'#ff6600':'#e82020');
  ctx.fillStyle=fc;
  ctx.beginPath();ctx.moveTo(sx+17,y);ctx.lineTo(sx+42,y+9+wave);ctx.lineTo(sx+17,y+18);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillRect(sx+17,y+1,4,6);
  ctx.fillStyle='#5a3e1b';ctx.fillRect(sx+6,y+h+12,20,8);
  if(locked){
    ctx.font='bold 13px monospace';ctx.textAlign='center';
    ctx.fillStyle='#ffcc33';ctx.fillText('🔒',sx+27,y-16);
    ctx.font='bold 10px monospace';ctx.fillStyle='#ff9999';
    ctx.fillText(keysCollected+'/'+pickupKeys.length,sx+27,y-4);
    ctx.textAlign='left';
  }else{
    ctx.fillStyle='#2ecc40';ctx.font='bold 11px monospace';ctx.textAlign='left';
    ctx.fillText('META',sx-6,y-10);
  }
}

function darken(hex){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgb(${Math.max(0,r-55)},${Math.max(0,g-55)},${Math.max(0,b-55)})`;
}

function drawWorm(e){
  const sx=wx(e.x);if(sx>CW+60||sx+40<0)return;
  ctx.save();
  ctx.translate(sx+16,wy(e.y)+11);
  if(e.dmgFlash>0)ctx.globalAlpha=0.5;
  ctx.scale(e.dir,1);
  const bc=e.dmgFlash>0?'#ffffff':e.col;
  const dk=darken(e.col);
  const fr=e.frame;
  const segs=[{ox:-12,oy:0,rx:7,ry:5},{ox:-2,oy:fr%2?-2:2,rx:8,ry:5.5},{ox:8,oy:fr%2?2:-2,rx:7,ry:5},{ox:17,oy:0,rx:6,ry:4.5}];
  segs.forEach((s,i)=>{
    ctx.fillStyle=i===0?dk:bc;
    ctx.beginPath();ctx.ellipse(s.ox,s.oy,s.rx,s.ry,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=dk;ctx.lineWidth=0.8;ctx.stroke();
  });
  ctx.fillStyle=dk;ctx.beginPath();ctx.ellipse(24,0,9,7,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(27,-2,3.2,3.2,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';ctx.beginPath();ctx.ellipse(28,-2,1.6,1.6,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(28.5,-2.5,0.7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(30,2);ctx.lineTo(33,1);ctx.lineTo(34,3);ctx.lineTo(31,4);ctx.closePath();ctx.fill();
  ctx.strokeStyle=dk;ctx.lineWidth=1;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(26,-6);ctx.lineTo(23,-11);ctx.stroke();
  ctx.beginPath();ctx.moveTo(29,-5);ctx.lineTo(30,-11);ctx.stroke();
  ctx.fillStyle=bc;ctx.beginPath();ctx.arc(23,-11,2.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(30,-11,2.2,0,Math.PI*2);ctx.fill();
  if(e.hp>1){
    ctx.scale(1/e.dir,1);
    ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillRect(-15,-22,30,5);
    const pct=e.hpCur/e.hp;
    ctx.fillStyle=pct>0.6?'#44ff44':pct>0.3?'#ffaa00':'#ff3333';
    ctx.fillRect(-15,-22,30*pct,5);
  }
  ctx.restore();
}

function drawAlien(e){
  const sx=wx(e.x);if(sx>CW+60||sx+40<0)return;
  const sy=wy(e.y);
  const bob=Math.sin((e.ft||0)*0.25)*1.5;
  ctx.save();
  ctx.translate(sx+16,sy+16);
  if(e.dmgFlash>0)ctx.globalAlpha=0.5;
  ctx.scale(e.dir,1);
  const bc=e.dmgFlash>0?'#ffffff':e.col;
  const dk=darken(e.col);
  ctx.strokeStyle=dk;ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-5,10+bob);ctx.lineTo(-7,16+bob);ctx.stroke();
  ctx.beginPath();ctx.moveTo(5,10+bob);ctx.lineTo(7,16+bob);ctx.stroke();
  ctx.fillStyle=bc;
  ctx.beginPath();ctx.ellipse(0,4+bob,9,7,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=dk;ctx.lineWidth=0.8;ctx.stroke();
  ctx.beginPath();ctx.ellipse(0,-7+bob,10,9,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=dk;ctx.stroke();
  ctx.strokeStyle=dk;ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(-4,-15+bob);ctx.lineTo(-6,-21+bob);ctx.stroke();
  ctx.beginPath();ctx.moveTo(4,-15+bob);ctx.lineTo(6,-21+bob);ctx.stroke();
  ctx.fillStyle=bc;
  ctx.beginPath();ctx.arc(-6,-21+bob,2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(6,-21+bob,2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.ellipse(-4,-8+bob,3.2,4,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(4,-8+bob,3.2,4,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.85)';
  ctx.beginPath();ctx.arc(-3,-9.5+bob,1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(5,-9.5+bob,1,0,Math.PI*2);ctx.fill();
  ctx.restore();
  if(e.hp>1){
    ctx.save();
    ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillRect(sx+1,sy-10,30,5);
    const pct=e.hpCur/e.hp;
    ctx.fillStyle=pct>0.6?'#44ff44':pct>0.3?'#ffaa00':'#ff3333';
    ctx.fillRect(sx+1,sy-10,30*pct,5);
    ctx.restore();
  }
}

function drawProjectiles(){
  for(const p of projectiles){
    const sx=wx(p.wx);if(sx<-10||sx>CW+10)continue;
    const sy=wy(p.wy);
    ctx.save();ctx.globalAlpha=p.life;
    ctx.fillStyle=p.col;
    ctx.beginPath();ctx.arc(sx+4,sy+4,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,180,0.85)';
    ctx.beginPath();ctx.arc(sx+3,sy+3,2.2,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=p.col;ctx.lineWidth=2;ctx.globalAlpha=p.life*0.35;
    ctx.beginPath();ctx.moveTo(sx+4,sy+4);ctx.lineTo(sx+4-p.vx*4,sy+4);ctx.stroke();
    ctx.restore();
  }
}

function drawClau(px,py,dir,frame,alive){
  const sx=wx(px),sy=wy(py);
  ctx.save();ctx.translate(sx+15,sy+14);
  if(!alive){ctx.rotate(Math.PI/2*dir);ctx.globalAlpha=0.42;}
  else if(inv>0&&Math.floor(inv/5)%2===0)ctx.globalAlpha=0.35;
  ctx.scale(dir,1);
  ctx.fillStyle='#FFD700';
  ctx.beginPath();ctx.ellipse(0,5,12,10,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(0,-7,10,8,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#FFA500';ctx.beginPath();ctx.ellipse(8,-5,4.5,2.8,.3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';ctx.beginPath();ctx.ellipse(6,-11,2.4,2.4,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(7,-12,.9,.9,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#111';ctx.lineWidth=1;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(5,-14);ctx.lineTo(4.5,-16);ctx.stroke();
  ctx.beginPath();ctx.moveTo(7,-14.2);ctx.lineTo(7,-16.2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(8.5,-13.5);ctx.lineTo(9.2,-15.3);ctx.stroke();
  ctx.fillStyle='#FF6600';ctx.beginPath();ctx.moveTo(8,-6);ctx.lineTo(13,-5);ctx.lineTo(8,-4);ctx.closePath();ctx.fill();
  const lo=frame%2===0?3:-3;
  ctx.strokeStyle='#cc8800';ctx.lineWidth=2.2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-3,13);ctx.lineTo(-3+lo,20);ctx.stroke();
  ctx.beginPath();ctx.moveTo(3,13);ctx.lineTo(3-lo,20);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-3+lo,20);ctx.lineTo(-3+lo-4,20);ctx.stroke();
  ctx.beginPath();ctx.moveTo(3-lo,20);ctx.lineTo(3-lo+4,20);ctx.stroke();
  ctx.fillStyle='#FFD700';ctx.beginPath();ctx.ellipse(-11,2,6,4,-.4,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.scale(1/dir,1);
  const lx=-3,ly=-19;
  ctx.fillStyle='#e8003a';
  ctx.beginPath();ctx.ellipse(lx-4,ly,4,2.5,-.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(lx+4,ly,4,2.5,.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ff4477';ctx.beginPath();ctx.ellipse(lx,ly,2,2,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.7)';
  ctx.beginPath();ctx.arc(lx-5,ly-0.5,0.7,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(lx+5,ly-0.5,0.7,0,Math.PI*2);ctx.fill();
  ctx.restore();ctx.restore();
}

function drawProgress(){
  const n=worldCount();
  const bw=220,bh=9,bx=CW/2-bw/2,by=10;
  ctx.fillStyle='rgba(0,0,0,0.28)';ctx.beginPath();ctx.roundRect(bx-1,by-1,bw+2,bh+2,4);ctx.fill();
  const bgCols=planet==='marte'?['#5a1c0c','#4a1030','#2a0a30','#3a0c14']:['#5a8a3f','#7a3510','#1a3060','#1a4020','#5a1800','#050520'];
  ctx.fillStyle=bgCols[worldIdx]||'#1a1a2e';ctx.beginPath();ctx.roundRect(bx,by,bw,bh,4);ctx.fill();
  const prog=Math.min(1,pl.x/WW);
  ctx.fillStyle='#FFD700';ctx.beginPath();ctx.roundRect(bx,by,bw*prog,bh,4);ctx.fill();
  ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(bx+bw*prog,by+bh/2,5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#e8003a';
  ctx.beginPath();ctx.ellipse(bx+bw*prog-3,by+bh/2-4,2.5,1.5,-.4,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(bx+bw*prog+3,by+bh/2-4,2.5,1.5,.4,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ff4477';ctx.beginPath();ctx.arc(bx+bw*prog,by+bh/2-4,1.5,0,Math.PI*2);ctx.fill();
  for(let i=0;i<n;i++){
    const dx=bx+bw*(i/(n+0.5)+0.03);
    ctx.fillStyle=i<worldIdx?'#FFD700':i===worldIdx?'#fff':'rgba(255,255,255,0.3)';
    ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.fillText('W'+(i+1),dx,by-3);
  }
  ctx.textAlign='left';
}
