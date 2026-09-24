// ── ui-exit-confirm.js — NUEVO diálogo: confirmar salida de Tierra ──
function wrapText(text,cx,y,maxW,lh){
  const words=text.split(' ');
  let line='',lines=[];
  for(const w of words){
    const test=line+w+' ';
    if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=w+' ';}
    else line=test;
  }
  lines.push(line);
  lines.forEach((l,i)=>ctx.fillText(l.trim(),cx,y+i*lh));
  return lines.length;
}

function drawExitConfirm(){
  ctx.save();ctx.globalAlpha=0.72;ctx.fillStyle='#000';ctx.fillRect(0,0,CW,CH);ctx.restore();

  const bw=340,bh=170,bx=CW/2-bw/2,by=CH/2-bh/2;
  ctx.fillStyle='rgba(20,20,40,0.95)';
  ctx.beginPath();ctx.roundRect(bx,by,bw,bh,16);ctx.fill();
  ctx.strokeStyle='rgba(255,215,0,0.5)';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(bx,by,bw,bh,16);ctx.stroke();

  ctx.textAlign='center';
  ctx.fillStyle='#fff';ctx.font='bold 15px Courier New,monospace';
  wrapText(`¿Segura que deseas salir de ${planet==='marte'?'Marte':'Tierra'}, Clau?`,CW/2,by+38,bw-40,20);

  const bbw=130,bbh=42,gap=16;
  const nx=CW/2-bbw-gap/2, yx=CW/2+gap/2;
  const yy=by+bh-58;

  function bt(x,label,col,txtCol){
    ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x,yy,bbw,bbh,12);ctx.fill();
    ctx.fillStyle=txtCol;ctx.font='bold 13px Courier New,monospace';
    ctx.fillText(label,x+bbw/2,yy+27);
  }
  bt(nx,'NO / CONTINUAR','#4caf50','#fff');
  bt(yx,'SÍ / SALIR','#e04444','#fff');
  ctx.textAlign='left';

  window._exitBtns={
    no:{x:nx,y:yy,w:bbw,h:bbh},
    yes:{x:yx,y:yy,w:bbw,h:bbh},
  };
}
