// ── DIBUJO DEL MENÚ PRINCIPAL ────────────────────
// Animaciones suaves: estrellas que titilan, estrellas fugaces, planetas que
// giran, un cohete que cruza de vez en cuando, título en ola, y Clau junto a
// un marciano a los lados del botón.

// Estrellas fijas con fase propia (generador determinista: siempre igual)
const MENU_STARS=(()=>{
  let s=7;const rnd=()=>(s=(s*9301+49297)%233280)/233280;
  return Array.from({length:55},()=>({x:rnd()*CW,y:rnd()*CH*0.85,r:0.6+rnd()*1.2,ph:rnd()*6.28,sp:0.02+rnd()*0.05}));
})();
let menuShoot=null, menuRocket=null;

function drawMenuSky(){
  const sky=ctx.createLinearGradient(0,0,0,CH);
  sky.addColorStop(0,'#050518'); sky.addColorStop(0.7,'#0d2a50'); sky.addColorStop(1,'#16325a');
  ctx.fillStyle=sky; ctx.fillRect(0,0,CW,CH);

  // estrellas que titilan
  MENU_STARS.forEach(st=>{
    const a=0.35+0.55*Math.abs(Math.sin(st.ph+menuTick*st.sp));
    ctx.fillStyle=`rgba(255,255,255,${a})`;
    ctx.beginPath();ctx.arc(st.x,st.y,st.r,0,Math.PI*2);ctx.fill();
  });

  // estrella fugaz cada tanto
  if(!menuShoot&&menuTick%240===120) menuShoot={x:80+Math.random()*300,y:10+Math.random()*60,t:0};
  if(menuShoot){
    const s=menuShoot,k=s.t/40,x=s.x+s.t*9,y=s.y+s.t*3.5;
    const g=ctx.createLinearGradient(x,y,x-70,y-27);
    g.addColorStop(0,`rgba(255,255,255,${1-k})`);g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.strokeStyle=g;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-70,y-27);ctx.stroke();
    if(++s.t>40) menuShoot=null;
  }

  // Marte grande abajo a la derecha, girando despacio (cráteres que se desplazan)
  const mx=585,my=285,mr=88;
  ctx.save();
  ctx.globalAlpha=0.33;
  const mg=ctx.createRadialGradient(mx-30,my-30,10,mx,my,mr);
  mg.addColorStop(0,'#e0703a');mg.addColorStop(1,'#6a1c08');
  ctx.fillStyle=mg;ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.clip();
  ctx.fillStyle='rgba(60,10,0,0.45)';
  [[0,-30,14],[60,20,10],[120,-50,18],[170,40,12],[230,-5,9]].forEach(([ox,oy,r])=>{
    const cx=mx-mr-20+((ox+menuTick*0.15)%(2*mr+60));
    ctx.beginPath();ctx.ellipse(cx,my+oy,r,r*0.8,0,0,Math.PI*2);ctx.fill();
  });
  ctx.restore();

  // Tierra pequeña arriba a la izquierda con su luna orbitando
  const ex=70,ey=205;
  ctx.save();ctx.globalAlpha=0.4;
  ctx.fillStyle='#3a7bd5';ctx.beginPath();ctx.arc(ex,ey,26,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#5fbf5f';
  ctx.beginPath();ctx.ellipse(ex-8,ey-6,9,6,0.4,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(ex+9,ey+8,7,5,-0.3,0,Math.PI*2);ctx.fill();
  const ma=menuTick*0.012;
  ctx.fillStyle='#ddd';ctx.beginPath();ctx.arc(ex+Math.cos(ma)*44,ey+Math.sin(ma)*14,5,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // cohete que cruza cada ~10 s, dejando una estela
  if(!menuRocket&&menuTick%600===300) menuRocket={t:0,trail:[]};
  if(menuRocket){
    const r=menuRocket,x=-40+r.t*2.6,y=150+Math.sin(r.t*0.03)*30,ang=Math.atan(Math.cos(r.t*0.03)*0.35);
    r.trail.push({x:x-14,y,life:1});
    r.trail.forEach(p=>{p.life-=0.03;p.y+=0.15;});
    r.trail=r.trail.filter(p=>p.life>0);
    r.trail.forEach(p=>{ctx.fillStyle=`rgba(255,${150+p.life*80|0},80,${p.life*0.35})`;ctx.beginPath();ctx.arc(p.x,p.y,2+4*(1-p.life),0,Math.PI*2);ctx.fill();});
    ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.globalAlpha=0.85;
    ctx.fillStyle='#ffcc33';ctx.beginPath();ctx.moveTo(-14,-4);ctx.lineTo(-22-Math.random()*5,0);ctx.lineTo(-14,4);ctx.fill();
    ctx.fillStyle='#e8e8f0';ctx.beginPath();ctx.moveTo(-14,-6);ctx.lineTo(8,-6);ctx.quadraticCurveTo(18,0,8,6);ctx.lineTo(-14,6);ctx.closePath();ctx.fill();
    ctx.fillStyle='#e8003a';ctx.beginPath();ctx.moveTo(-14,-6);ctx.lineTo(-19,-11);ctx.lineTo(-9,-6);ctx.fill();
    ctx.beginPath();ctx.moveTo(-14,6);ctx.lineTo(-19,11);ctx.lineTo(-9,6);ctx.fill();
    ctx.fillStyle='#66ccff';ctx.beginPath();ctx.arc(2,0,3,0,Math.PI*2);ctx.fill();
    ctx.restore();
    if(++r.t>300) menuRocket=null;
  }
}

// Título con cada letra flotando en ola
function drawMenuTitle(){
  const title='POLLICLAU';
  ctx.font='bold 58px Courier New,monospace';ctx.textAlign='center';
  const cw=ctx.measureText('M').width, total=cw*title.length;
  const x0=CW/2-total/2+cw/2+22;
  ctx.font='50px monospace';
  ctx.fillText('🐣',x0-cw-26,88+Math.sin(menuTick*0.08)*4);
  ctx.font='bold 58px Courier New,monospace';
  [...title].forEach((ch,i)=>{
    const y=88+Math.sin(menuTick*0.06-i*0.5)*5;
    const x=x0+i*cw;
    ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillText(ch,x+3,y+3);
    ctx.save();ctx.shadowColor='#FFD700';ctx.shadowBlur=14+Math.sin(menuTick*0.05)*6;
    ctx.fillStyle=i<5?'#FFD700':'#FFB347';ctx.fillText(ch,x,y);
    ctx.restore();
  });
  ctx.textAlign='left';
}

// Clau saltando feliz a la izquierda del botón y un marciano saludando a la derecha
function drawMenuCharacters(by){
  const hop=Math.abs(Math.sin(menuTick*0.07))*22;
  const cx=145,cy=by+18-hop;
  // sombra que se achica cuando Clau sube
  ctx.fillStyle='rgba(0,0,0,0.3)';
  ctx.beginPath();ctx.ellipse(cx+15,by+56,14-hop*0.25,4,0,0,Math.PI*2);ctx.fill();
  const savedInv=inv; inv=0;
  drawClau(cx+camX,cy+camY,1,hop>2?1:Math.floor(menuTick/10),true);
  const al={x:505+camX,y:by+22+camY,dir:-1,ft:menuTick,dmgFlash:0,hp:1,col:'#44dd77'};
  ctx.fillStyle='rgba(0,0,0,0.3)';
  ctx.beginPath();ctx.ellipse(521,by+56,13,4,0,0,Math.PI*2);ctx.fill();
  drawAlien(al);
  inv=savedInv;
  // manita del marciano saludando
  const wave=Math.sin(menuTick*0.2)*0.6;
  ctx.save();ctx.translate(530,by+36);ctx.rotate(0.6+wave);
  ctx.strokeStyle='#2a8a4a';ctx.lineWidth=2.4;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-12);ctx.stroke();
  ctx.fillStyle='#44dd77';ctx.beginPath();ctx.arc(0,-13,2.6,0,Math.PI*2);ctx.fill();
  ctx.restore();
  // corazoncito que sale de vez en cuando entre los dos
  const hk=(menuTick%160)/160;
  if(hk<0.6){
    ctx.save();ctx.globalAlpha=1-hk/0.6;ctx.font='14px monospace';ctx.textAlign='center';
    ctx.fillText('💛',175+hk*20,by-12-hk*45);
    ctx.restore();
  }
}

function drawMenu(){
  drawMenuSky();

  function txt(t,x,y,fill,font,shadowAlpha=0.6,sOff=3){
    ctx.font=font; ctx.textAlign='center';
    ctx.fillStyle=`rgba(0,0,0,${shadowAlpha})`; ctx.fillText(t,x+sOff,y+sOff);
    ctx.fillStyle=fill; ctx.fillText(t,x,y);
  }

  drawMenuTitle();
  txt('Aventuras de PolliClau, la futura obstetra',CW/2,120,'#aaddff','bold 18px Courier New,monospace',0.5,2);

  // Separador decorativo con un brillo que lo recorre
  ctx.strokeStyle='rgba(255,215,0,0.3)';
  ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(CW/2-140,134);ctx.lineTo(CW/2+140,134);ctx.stroke();
  const sp=CW/2-140+((menuTick*2.2)%320);
  if(sp<CW/2+140){
    const sg=ctx.createRadialGradient(sp,134,0,sp,134,18);
    sg.addColorStop(0,'rgba(255,240,150,0.9)');sg.addColorStop(1,'rgba(255,240,150,0)');
    ctx.fillStyle=sg;ctx.fillRect(sp-18,126,36,16);
  }

  // Mundos en miniatura, flotando en ola
  const worldColors=['#8bc34a','#c47a2a','#1a3060','#1a4020','#5a1a00','#050530'];
  const worldEmojis=['🌷','🐻','🍬','🌙','⭐','🤍'];
  const ww=38,wh=22,gap=10;
  const totalW=6*ww+5*gap;
  const startX=CW/2-totalW/2;
  worldColors.forEach((col,i)=>{
    const wx2=startX+i*(ww+gap);
    const wy2=148+Math.sin(menuTick*0.05-i*0.7)*2.5;
    ctx.fillStyle='rgba(0,0,0,0.3)';
    ctx.beginPath();ctx.roundRect(wx2+2,wy2+2,ww,wh,5);ctx.fill();
    ctx.fillStyle=col;
    ctx.beginPath();ctx.roundRect(wx2,wy2,ww,wh,5);ctx.fill();
    ctx.font='13px monospace';ctx.textAlign='center';
    ctx.fillText(worldEmojis[i],wx2+ww/2,wy2+wh-5);
    ctx.fillStyle='rgba(255,255,255,0.6)';
    ctx.font='bold 7px monospace';
    ctx.fillText('W'+(i+1),wx2+ww/2,wy2+10);
  });
  ctx.textAlign='left';

  // Botón JUGAR (pulsante, con un destello que lo cruza)
  const bw=230,bh=56,bx=CW/2-bw/2,by=190;
  const bp=Math.sin(menuTick*0.07)*2;
  ctx.fillStyle='rgba(0,0,0,0.4)';
  ctx.beginPath();ctx.roundRect(bx+4,by+4+bp,bw,bh,16);ctx.fill();
  ctx.save();
  ctx.shadowColor='rgba(255,200,0,0.7)';ctx.shadowBlur=10+Math.sin(menuTick*0.07)*6;
  const btnGrad=ctx.createLinearGradient(bx,by+bp,bx,by+bh+bp);
  btnGrad.addColorStop(0,'#FFE033');
  btnGrad.addColorStop(1,'#FFB300');
  ctx.fillStyle=btnGrad;
  ctx.beginPath();ctx.roundRect(bx,by+bp,bw,bh,16);ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();ctx.roundRect(bx,by+bp,bw,bh,16);ctx.clip();
  ctx.fillStyle='rgba(255,255,255,0.25)';
  ctx.beginPath();ctx.roundRect(bx+6,by+bp+4,bw-12,18,10);ctx.fill();
  const shx=bx-60+((menuTick*4)%(bw+400));
  ctx.fillStyle='rgba(255,255,255,0.35)';
  ctx.beginPath();ctx.moveTo(shx,by+bp);ctx.lineTo(shx+22,by+bp);ctx.lineTo(shx-8,by+bp+bh);ctx.lineTo(shx-30,by+bp+bh);ctx.closePath();ctx.fill();
  ctx.restore();
  ctx.fillStyle='#1a1a2e';
  ctx.font='bold 24px Courier New,monospace';
  ctx.textAlign='center';
  ctx.fillText('▶   JUGAR',CW/2,by+36+bp);
  ctx.textAlign='left';
  window._playBtn={x:bx,y:by+bp-6,w:bw,h:bh+12};

  drawMenuCharacters(by);

  // Instrucciones
  txt('← → Mover   |   Espacio / ↑ Saltar (Si clau, puedes saltar doble jajaja)',CW/2,270,'#88bbdd','12px Courier New,monospace',0.4,1);
  txt('Brinca encima para matar gusanos   |   Recoge vidas extra',CW/2,288,'#88bbdd','11px Courier New,monospace',0.4,1);
  txt(bestScore>0?('🏆 Mejor puntaje: '+bestScore+' pts'):'Suerte',CW/2,306,bestScore>0?'#FFD700':'rgba(100,140,180,0.7)','bold 11px Courier New,monospace',0.35,1);

  ctx.strokeStyle='rgba(255,215,0,0.15)';
  ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(CW/2-160,315);ctx.lineTo(CW/2+160,315);ctx.stroke();

  txt('🐣 Aventuras de PolliClau',CW/2,334,'rgba(80,120,160,0.6)','9px Courier New,monospace',0.2,1);

  // Hint "Presiona Espacio" que respira en vez de parpadear de golpe
  const ha=0.3+0.35*(0.5+0.5*Math.sin(menuTick*0.08));
  txt('Presiona  ESPACIO  o haz clic para jugar',CW/2,358,`rgba(200,230,255,${ha})`,'bold 10px Courier New,monospace',0.2,1);

  drawFW();
}
