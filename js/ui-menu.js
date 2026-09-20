// ── DIBUJO DEL MENÚ PRINCIPAL ────────────────────
function drawMenu(){
  // Fondo degradado oscuro a azul
  const sky=ctx.createLinearGradient(0,0,0,CH);
  sky.addColorStop(0,'#050518'); sky.addColorStop(1,'#0d2a50');
  ctx.fillStyle=sky; ctx.fillRect(0,0,CW,CH);

  // Estrellas de fondo
  ctx.fillStyle='rgba(255,255,255,0.75)';
  [[40,18],[130,32],[280,14],[430,26],[580,10],[645,38],[195,9],[490,20],[370,36],
   [75,58],[240,68],[415,48],[555,62],[695,52],[615,78],[95,88],[345,83],[500,72]].forEach(([sx,sy])=>{
    ctx.beginPath();ctx.arc(sx,sy,1.1,0,Math.PI*2);ctx.fill();
  });

  // Planeta decorativo fondo
  ctx.save();
  ctx.globalAlpha=0.18;
  ctx.fillStyle='#3366cc';
  ctx.beginPath();ctx.arc(580,260,90,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#2244aa';
  ctx.beginPath();ctx.arc(580,260,60,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // Nube decorativa izquierda
  ctx.save();
  ctx.globalAlpha=0.12;
  ctx.fillStyle='#aaddff';
  ctx.beginPath();ctx.ellipse(80,200,70,30,0,0,Math.PI*2);ctx.fill();
  ctx.restore();

  function txt(t,x,y,fill,font,shadowAlpha=0.6,sOff=3){
    ctx.font=font; ctx.textAlign='center';
    ctx.fillStyle=`rgba(0,0,0,${shadowAlpha})`; ctx.fillText(t,x+sOff,y+sOff);
    ctx.fillStyle=fill; ctx.fillText(t,x,y);
  }

  // Título con efecto pulsante
  const pulse=Math.sin(menuTick*0.05)*3;
  ctx.save();
  ctx.shadowColor='#FFD700';
  ctx.shadowBlur=18+pulse*2;
  txt('🐣 POLLICLAU',CW/2,88,'#FFD700','bold 58px Courier New,monospace');
  ctx.restore();
  txt('Aventuras de PolliClau, la futura obstetra',CW/2,120,'#aaddff','bold 18px Courier New,monospace',0.5,2);

  // Separador decorativo
  ctx.strokeStyle='rgba(255,215,0,0.3)';
  ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(CW/2-140,134);ctx.lineTo(CW/2+140,134);ctx.stroke();

  // Mundos en miniaturas decorativas
  const worldColors=['#8bc34a','#c47a2a','#1a3060','#1a4020','#5a1a00','#050530'];
  const worldEmojis=['🌷','🐻','🍬','🌙','⭐','🤍'];
  const ww=38,wh=22,gap=10;
  const totalW=6*ww+5*gap;
  const startX=CW/2-totalW/2;
  worldColors.forEach((col,i)=>{
    const wx2=startX+i*(ww+gap);
    const wy2=148;
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

  // Botón JUGAR (pulsante)
  const bw=230,bh=56,bx=CW/2-bw/2,by=190;
  const bp=Math.sin(menuTick*0.07)*2;
  // Sombra
  ctx.fillStyle='rgba(0,0,0,0.4)';
  ctx.beginPath();ctx.roundRect(bx+4,by+4+bp,bw,bh,16);ctx.fill();
  // Fondo botón
  const btnGrad=ctx.createLinearGradient(bx,by+bp,bx,by+bh+bp);
  btnGrad.addColorStop(0,'#FFE033');
  btnGrad.addColorStop(1,'#FFB300');
  ctx.fillStyle=btnGrad;
  ctx.beginPath();ctx.roundRect(bx,by+bp,bw,bh,16);ctx.fill();
  // Brillo superior
  ctx.fillStyle='rgba(255,255,255,0.25)';
  ctx.beginPath();ctx.roundRect(bx+6,by+bp+4,bw-12,18,10);ctx.fill();
  // Texto botón
  ctx.fillStyle='#1a1a2e';
  ctx.font='bold 24px Courier New,monospace';
  ctx.textAlign='center';
  ctx.fillText('▶   JUGAR',CW/2,by+36+bp);
  ctx.textAlign='left';
  window._playBtn={x:bx,y:by+bp-6,w:bw,h:bh+12};

  // Instrucciones
  txt('← → Mover   |   Espacio / ↑ Saltar (Si clau, puedes saltar doble jajaja)',CW/2,270,'#88bbdd','12px Courier New,monospace',0.4,1);
  txt('Brinca encima para matar gusanos   |   Recoge vidas extra',CW/2,288,'#88bbdd','11px Courier New,monospace',0.4,1);
  txt(bestScore>0?('🏆 Mejor puntaje: '+bestScore+' pts'):'Suerte',CW/2,306,bestScore>0?'#FFD700':'rgba(100,140,180,0.7)','bold 11px Courier New,monospace',0.35,1);

  // Separador
  ctx.strokeStyle='rgba(255,215,0,0.15)';
  ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(CW/2-160,315);ctx.lineTo(CW/2+160,315);ctx.stroke();

  // Créditos / versión
  txt('🐣 Aventuras de PolliClau',CW/2,334,'rgba(80,120,160,0.6)','9px Courier New,monospace',0.2,1);

  // Hint "Presiona Espacio"
  if(Math.floor(menuTick/28)%2===0){
    txt('Presiona  ESPACIO  o haz clic para jugar',CW/2,358,'rgba(200,230,255,0.55)','bold 10px Courier New,monospace',0.2,1);
  }

  // Fuegos artificiales decorativos encima de todo
  drawFW();
}
