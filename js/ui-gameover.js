// ── ui-gameover.js — NUEVA pantalla: Game Over con navegación ──
function drawGameOver(){
  ctx.save();ctx.globalAlpha=0.82;ctx.fillStyle='#111';ctx.fillRect(0,0,CW,CH);ctx.restore();

  function txt(t,x,y,fill,font,shadow=3){
    ctx.font=font;ctx.textAlign='center';
    ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillText(t,x+shadow,y+shadow);
    ctx.fillStyle=fill;ctx.fillText(t,x,y);
  }

  txt('💀 GAME OVER',CW/2,CH/2-60,'#FF5555','bold 38px Courier New,monospace');
  txt('Puntuación final: '+score+' pts',CW/2,CH/2-20,'#FFD700','bold 16px Courier New,monospace');

  const bw=250,bh=48,gap=14,bx=CW/2-bw/2;
  const by1=CH/2+6, by2=by1+bh+gap;

  function btn(y,label,col){
    ctx.fillStyle='rgba(0,0,0,0.35)';ctx.beginPath();ctx.roundRect(bx+3,y+3,bw,bh,14);ctx.fill();
    ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(bx,y,bw,bh,14);ctx.fill();
    ctx.fillStyle='#1a1a2e';ctx.font='bold 15px Courier New,monospace';ctx.textAlign='center';
    ctx.fillText(label,CW/2,y+30);
  }
  btn(by1,'🐣 Volver a jugar Tierra','#FFD700');
  btn(by2,'🌍 Volver a planetas','#88bbdd');
  ctx.textAlign='left';

  window._gameoverBtns={
    tierra:{x:bx,y:by1,w:bw,h:bh},
    planets:{x:bx,y:by2,w:bw,h:bh},
  };
}
