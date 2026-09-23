// ── ui-world-intro.js — premisa/objetivo mostrado antes de un mundo ──
function drawWorldIntro(){
  ctx.save();ctx.globalAlpha=0.8;ctx.fillStyle='#000';ctx.fillRect(0,0,CW,CH);ctx.restore();

  const bw=440,bh=240,bx=CW/2-bw/2,by=CH/2-bh/2;
  const grad=ctx.createLinearGradient(bx,by,bx,by+bh);
  if(planet==='marte'){ grad.addColorStop(0,'#3a1006'); grad.addColorStop(1,'#7a2a10'); }
  else { grad.addColorStop(0,'#0d2a10'); grad.addColorStop(1,'#1a4a20'); }
  ctx.fillStyle=grad;
  ctx.beginPath();ctx.roundRect(bx,by,bw,bh,18);ctx.fill();
  ctx.strokeStyle='rgba(255,215,0,0.55)';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(bx,by,bw,bh,18);ctx.stroke();

  const info=W.intro||{title:'',body:''};
  ctx.textAlign='center';
  ctx.fillStyle='rgba(0,0,0,0.6)';ctx.font='bold 21px Courier New,monospace';
  ctx.fillText(info.title,CW/2+2,by+44+2);
  ctx.fillStyle='#FFD700';
  ctx.fillText(info.title,CW/2,by+44);

  ctx.fillStyle='#fff';ctx.font='13px Courier New,monospace';
  wrapText(info.body,CW/2,by+80,bw-56,19);

  const bbw=210,bbh=44,bbx=CW/2-bbw/2,bby=by+bh-64;
  ctx.fillStyle='rgba(0,0,0,0.35)';ctx.beginPath();ctx.roundRect(bbx+3,bby+3,bbw,bbh,14);ctx.fill();
  ctx.fillStyle='#FFD700';ctx.beginPath();ctx.roundRect(bbx,bby,bbw,bbh,14);ctx.fill();
  ctx.fillStyle='#1a1a2e';ctx.font='bold 16px Courier New,monospace';
  ctx.fillText('▶  ¡Vamos, Clau!',CW/2,bby+28);
  ctx.textAlign='left';

  window._introBtn={x:bbx,y:bby,w:bbw,h:bbh};
}
