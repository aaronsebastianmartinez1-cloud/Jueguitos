// ── ui-planet-select.js — NUEVA pantalla: selección de planeta ──
function drawPlanetSelect(){
  const sky=ctx.createLinearGradient(0,0,0,CH);
  sky.addColorStop(0,'#050518'); sky.addColorStop(1,'#0d2a50');
  ctx.fillStyle=sky; ctx.fillRect(0,0,CW,CH);

  ctx.fillStyle='rgba(255,255,255,0.7)';
  [[40,18],[130,32],[280,14],[430,26],[580,10],[645,38],[195,9],[490,20],[370,36]].forEach(([sx,sy])=>{
    ctx.beginPath();ctx.arc(sx,sy,1.1,0,Math.PI*2);ctx.fill();
  });

  function txt(t,x,y,fill,font,shadowAlpha=0.6,sOff=3){
    ctx.font=font; ctx.textAlign='center';
    ctx.fillStyle=`rgba(0,0,0,${shadowAlpha})`; ctx.fillText(t,x+sOff,y+sOff);
    ctx.fillStyle=fill; ctx.fillText(t,x,y);
  }

  txt('🌌 SELECCIÓN DE PLANETA',CW/2,55,'#FFD700','bold 30px Courier New,monospace');
  txt('Elige a dónde quiere ir Clau',CW/2,82,'#aaddff','14px Courier New,monospace',0.4,1);

  const cardW=170,cardH=220,gap=30;
  const totalW=3*cardW+2*gap;
  const startX=CW/2-totalW/2;
  const cardY=115;

  const planets=[PLANET_TIERRA,PLANET_MARTE,PLANET_MERCURIO];
  window._planetBtns={};

  planets.forEach((p,i)=>{
    const cx=startX+i*(cardW+gap), cy=cardY;
    ctx.save();
    if(!p.available) ctx.globalAlpha=0.55;
    ctx.fillStyle='rgba(0,0,0,0.35)';
    ctx.beginPath();ctx.roundRect(cx+4,cy+4,cardW,cardH,14);ctx.fill();
    const grad=ctx.createLinearGradient(cx,cy,cx,cy+cardH);
    grad.addColorStop(0,p.colors[0]); grad.addColorStop(1,p.colors[1]);
    ctx.fillStyle=grad;
    ctx.beginPath();ctx.roundRect(cx,cy,cardW,cardH,14);ctx.fill();
    ctx.strokeStyle=p.available?'rgba(255,215,0,0.7)':'rgba(255,255,255,0.2)';
    ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(cx,cy,cardW,cardH,14);ctx.stroke();
    ctx.font='54px sans-serif'; ctx.textAlign='center';
    ctx.fillText(p.emoji,cx+cardW/2,cy+90);
    ctx.font='bold 16px Courier New,monospace';
    ctx.fillStyle='#fff';
    ctx.fillText(p.name,cx+cardW/2,cy+130);
    if(p.available){
      ctx.font='bold 12px Courier New,monospace';
      ctx.fillStyle='#FFD700';
      ctx.fillText('▶ JUGAR',cx+cardW/2,cy+165);
    }else{
      ctx.font='bold 11px Courier New,monospace';
      ctx.fillStyle='#ddd';
      ctx.fillText('PRÓXIMAMENTE',cx+cardW/2,cy+165);
    }
    ctx.restore();
    window._planetBtns[p.key]={x:cx,y:cy,w:cardW,h:cardH};
  });
  ctx.textAlign='left';

  txt('Presiona un planeta para continuar',CW/2,cardY+cardH+34,'rgba(200,230,255,0.6)','bold 10px Courier New,monospace',0.2,1);
}
