// ── main.js — loop principal, estados y navegación ──

// ── Inicio de juego ────────────────────────────────
function startGame(p){
  ensureAudio();
  planet=p||'tierra';
  lives=3; score=0; worldIdx=0; carriedKeys=0;
  loadWorld(0); pl=mkPl(); inv=90;
  fws=[]; dust=[]; paused=false;
  document.getElementById('btn-pause').textContent='⏸';
  state=W.intro?'worldIntro':'playing';
  setMsg(''); setHUD();
}

// Vidas de regalo al empezar un mundo (solo una vez por entrada al mundo)
function giveWorldBonus(){
  if(!W.bonusLives) return;
  lives+=W.bonusLives; setHUD();
  // Cartel tétrico: aparece cuando Clau empieza a jugar (tras el aviso del mundo)
  banner={t:0,dur:300,gift:W.bonusLives};
}

function doRestart(){
  lives=3;score=0;worldIdx=0;carriedKeys=0;loadWorld(0);pl=mkPl();inv=90;
  state='menu'; winT=0;fws=[];dust=[];paused=false;menuTick=0;setMsg('');setHUD();
}

// ── Pausa ──
function togglePause(){
  if(state!=='playing') return;
  paused=!paused;
  document.getElementById('btn-pause').textContent=paused?'▶':'⏸';
}
document.getElementById('btn-pause').addEventListener('click',e=>{e.stopPropagation();ensureAudio();togglePause();});

// ── Salir de Tierra (con confirmación, sin penalizar vidas) ──
document.getElementById('btn-exit').addEventListener('click',e=>{
  e.stopPropagation();
  if(state==='playing'){
    paused=false;
    state='exitConfirm';
  }
});

function die(){
  if(state!=='playing'||inv>0) return;
  pl.alive=false; if(!testerInfLives) lives--;
  shake(7,16); sfx.hurt();
  if(navigator.vibrate) navigator.vibrate(120);
  state='dead'; deathT=lives<=0?220:140;
  const frases=[
    '¡Tú puedes, Clau! 💪','¡Clau no se rinde! 🎀','¡Arriba ese ánimo, Clau! 🐣',
    '¡Vamos Clau, otra vez! ⭐','¡Esquiva esos gusanos, Clau! 🪱','¡Clau es imparable! 🔥',
    '¡Casi lo logras, Clau! 🌟','¡Respira y vuelve a intentarlo! 🌸',
    '¡Clau siempre se levanta! 💛','¡Los gusanos no pueden con Clau! 🐣',
  ];
  deathMsg=frases[Math.random()*frases.length|0];
  // Si se acaban las vidas, la transición a la pantalla de Game Over
  // ocurre en update() una vez termina la animación de "dead" (deathT).
  setMsg(''); setHUD();
}

// ── Update principal ─────────────────────────────
function update(){
  if(paused) return;

  // ── MENÚ: solo animar fuegos artificiales decorativos ──
  if(state==='menu'){
    menuTick++;
    if(menuTick%150===0) spawnFW(80+Math.random()*520, 30+Math.random()*120);
    tickFW();
    return;
  }

  // ── SELECCIÓN DE PLANETAS: pantalla estática ──
  if(state==='planetSelect') return;

  // ── PREMISA / REQUISITO DE MUNDO: juego congelado detrás ──
  if(state==='worldIntro') return;

  // ── DIÁLOGO DE SALIDA: juego congelado detrás ──
  if(state==='exitConfirm') return;

  // ── GAME OVER: esperando elección del jugador ──
  if(state==='gameover') return;

  if(state==='dead'){
    if(--deathT<=0){
      if(lives<=0){
        state='gameover';
      }else{
        state='playing';
        pl=respawnPt?mkPl(respawnPt.x,respawnPt.y)
          :checkpointActive&&checkpointX!==null?mkPl(checkpointX,GY-44):mkPl();
        inv=100; setMsg(''); setHUD();
      }
    }
    return;
  }
  if(state==='win'){
    winT++; if(winT%10===0) spawnFW(100+Math.random()*480,40+Math.random()*160);
    tickFW();
    if(++celebT>210){
      const tw=worldCount();
      if(worldIdx<tw-1){
        worldIdx++;loadWorld(worldIdx);pl=mkPl();inv=90;
        state=W.intro?'worldIntro':'playing';
        setMsg('');setHUD();
        giveWorldBonus();
      }else state='final';
    }
    return;
  }
  if(state==='final'){winT++;if(winT%10===0)spawnFW(100+Math.random()*480,40+Math.random()*160);tickFW();return;}

  if(inv>0) inv--;
  if(lockMsgCd>0) lockMsgCd--;
  tickDust();

  const movPlat=p=>{p.x+=p.spd*p.dir;if(p.x>p.ox+p.range||p.x<p.ox)p.dir*=-1;};
  if(mp)movPlat(mp); if(mp2)movPlat(mp2); if(mp3)movPlat(mp3);

  const left=isLeft(),right=isRight(),jump=isJump();
  const hardJump=planet==='tierra'&&worldIdx>=3;
  const j1=hardJump?-12.2:-13.2, j2=hardJump?-9.8:-10.8;
  if(left){pl.vx=-SPD;pl.dir=-1;} else if(right){pl.vx=SPD;pl.dir=1;} else pl.vx*=0.72;

  if(jump&&!keys['_jh']&&!touch._jh&&pl.jumps<2){
    pl.vy=pl.jumps===0?j1:j2; pl.jumps++;
    spawnDust(pl.x+pl.w/2,pl.y+pl.h,6,1.1); sfx.jump();
    if(touch.jump)touch._jh=true; else keys['_jh']=true;
  }
  if(!touch.jump)touch._jh=false;
  if(!keys['Space']&&!keys['ArrowUp']&&!keys['KeyW'])keys['_jh']=false;

  const wasGround=pl.onGround;
  pl.vy+=GRAV; if(pl.vy>18)pl.vy=18;
  pl.x+=pl.vx; pl.y+=pl.vy;
  if(pl.x<0)pl.x=0; if(pl.x+pl.w>WW)pl.x=WW-pl.w;
  resolve(); spikeHit();
  if(!wasGround&&pl.onGround) spawnDust(pl.x+pl.w/2,pl.y+pl.h,7,1.2);

  if(worldIdx===3&&checkpointX!==null&&!checkpointActive&&pl.x>checkpointX+20){
    checkpointActive=true;
    sfx.checkpoint();
    setMsg('✅ ¡Checkpoint activado!');
    setTimeout(()=>setMsg(''),2000);
  }

  for(const el of extraLives){
    if(el.collected) continue;
    el.pulse+=0.1;
    if(rc(pl.x,pl.y,pl.w,pl.h,el.x-10,el.y-10,26,26)){
      el.collected=true;
      lives++; setHUD();
      sfx.life();
      spawnFW(el.x+6, el.y+6);
      setMsg('🩷 ¡+1 Vida extra!');
      setTimeout(()=>setMsg(''),2000);
    }
  }

  updateEnemies();
  updateMeteors();
  updateKeys();
  updateChests();
  updateGeysers();
  if(pl.y>CH+40) die();

  const ns=Math.max(score,Math.floor((pl.x/WW)*100)+(worldIdx*100));
  if(ns>score){score=ns;setHUD();}
  pl.ft++; if(Math.abs(pl.vx)>0.5&&pl.onGround&&pl.ft%9===0)pl.frame++;
  if(!pl.onGround)pl.frame=1;
  if(Math.abs(pl.vx)>1.5&&pl.onGround&&pl.ft%7===0) spawnDust(pl.x+pl.w/2,pl.y+pl.h-2,1,0.6);

  camX+=(pl.x-CW*0.32-camX)*0.12;
  camX=Math.max(0,Math.min(WW-CW,camX));

  // La cámara vertical solo entra en acción cuando Clau escala más arriba de
  // lo que cualquier nivel normal necesita (umbral por debajo de todo lo
  // existente), así que niveles sin torres altas se ven exactamente igual.
  // En el laberinto la cámara centra a Clau para ver los pisos de arriba y abajo.
  const camYTarget=Math.min(0,W.maze?pl.y-CH*0.5:pl.y-15);
  camY+=(camYTarget-camY)*0.12;
  if(camY>0)camY=0;

  const g=W.goal;
  const goalLocked=!!(W.keyGate&&keysCollected<pickupKeys.length);
  if(!goalHidden()&&rc(pl.x,pl.y,pl.w,pl.h,g.x,g.y,g.w,g.h+12)){
    if(goalLocked){
      if(lockMsgCd<=0){
        setMsg('🔒 Necesitas las 4 llaves para pasar');
        lockMsgCd=110;
        setTimeout(()=>setMsg(''),1500);
      }
    }else{
      state='win'; celebT=0; sfx.win();
      if(W.keyGate) carriedKeys=keysCollected; // las llaves viajan al siguiente mundo
      const tw=worldCount();
      if(worldIdx<tw-1)setMsg(`¡Clau llegó! 🎉 Mundo ${worldIdx+1} superado. ¡Vamos al ${worldIdx+2}!`);
      else setMsg(planet==='marte'?'¡Lo lograste, Clau! 🏆 ¡Marte está a salvo!':'¡Lo lograste, Clau! 🏆 ¡Los 6 mundos conquistados!');
      for(let i=0;i<5;i++)spawnFW(100+Math.random()*480,40+Math.random()*200);
    }
  }
}

// ── Dibujo principal ─────────────────────────────
function draw(){
  ctx.clearRect(0,0,CW,CH);

  // ── MENÚ PRINCIPAL ──
  if(state==='menu'){
    drawMenu();
    return;
  }

  // ── SELECCIÓN DE PLANETAS ──
  if(state==='planetSelect'){
    drawPlanetSelect();
    return;
  }

  // ── JUEGO NORMAL (también sirve de fondo para dead/win/final/gameover/exitConfirm) ──
  ctx.save();
  if(shakeT>0){
    ctx.translate((Math.random()-0.5)*shakeMag,(Math.random()-0.5)*shakeMag);
    shakeT--; if(shakeT<=0)shakeMag=0;
  }
  drawBG();drawMazeBackdrop();drawPlats();drawSpikes();
  drawGeysers();
  drawChests();
  drawCheckpoint();
  drawExtraLife();
  drawPickupKeys();
  drawGoal();
  for(const e of enemies){if(e.alive)(e.kind==='alien'?drawAlien(e):drawWorm(e));}
  drawProjectiles();
  drawMeteors();
  drawDust();
  drawClau(pl.x,pl.y,pl.dir,pl.frame,pl.alive);
  drawGoalPointer();
  drawProgress();drawBanner();drawFW();
  ctx.restore();

  function txt(t,x,y,fill,font,shadow='rgba(0,0,0,0.7)',sOff=3){
    ctx.font=font;ctx.textAlign='center';
    ctx.fillStyle=shadow;ctx.fillText(t,x+sOff,y+sOff);
    ctx.fillStyle=fill;ctx.fillText(t,x,y);
  }

  if(state==='win'){
    ctx.save();ctx.globalAlpha=0.7;ctx.fillStyle='#111';ctx.fillRect(0,0,CW,CH);ctx.restore();
    if(worldIdx<worldCount()-1){
      txt(`🎉 ¡Mundo ${worldIdx+1} superado!`,CW/2,CH/2-28,'#FFD700','bold 34px Courier New,monospace');
      txt(`¡Vamos al Mundo ${worldIdx+2}, Clau! ⭐`,CW/2,CH/2+20,'#fff','bold 20px Courier New,monospace');
      const bar=Math.min(1,celebT/210);
      ctx.fillStyle='rgba(255,255,255,0.18)';ctx.beginPath();ctx.roundRect(CW/2-120,CH/2+44,240,12,6);ctx.fill();
      ctx.fillStyle='#FFD700';ctx.beginPath();ctx.roundRect(CW/2-120,CH/2+44,240*bar,12,6);ctx.fill();
    }else{
      txt('¡FELICIDADES CLAU! 🏆',CW/2,CH/2-30,'#FFD700','bold 32px Courier New,monospace');
      txt(planet==='marte'?`¡Superaste los ${worldCount()} mundos de Marte!`:'¡Superaste los 6 mundos!',CW/2,CH/2+14,'#ffe066','bold 22px Courier New,monospace');
      txt('🐣 ¡Clau es la campeona! 🎀',CW/2,CH/2+46,'#fff','bold 16px Courier New,monospace');
    }
    ctx.textAlign='left';drawFW();
  }

  if(state==='final'){
    ctx.save();ctx.globalAlpha=0.78;ctx.fillStyle='#111';ctx.fillRect(0,0,CW,CH);ctx.restore();
    const tw=worldCount();
    txt('¡FELICIDADES CLAU! 🏆',CW/2,CH/2-52,'#FFD700','bold 34px Courier New,monospace');
    txt(planet==='marte'?'🔴 ¡Clau protegió Marte! 🔴':'🎀 ¡Clau conquistó los 6 mundos! 🎀',CW/2,CH/2-8,'#ffe066','bold 20px Courier New,monospace');
    txt(`Score: ${score} pts  •  Mundos: ${tw}/${tw}`,CW/2,CH/2+28,'#fff','bold 17px Courier New,monospace');
    txt(planet==='marte'?'👽 ¡Ningún marciano pudo con Clau! 🐣':'🪱 ¡Ningún gusano pudo con Clau! 🐣',CW/2,CH/2+52,'#aaffaa','bold 14px Courier New,monospace');
    if(winT>120){
      const bw=270,bh=50,bx=CW/2-bw/2,by=CH/2+68;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.beginPath();ctx.roundRect(bx+3,by+3,bw,bh,14);ctx.fill();
      ctx.fillStyle='#FFD700';ctx.beginPath();ctx.roundRect(bx,by,bw,bh,14);ctx.fill();
      ctx.fillStyle='#1a1a2e';ctx.font='bold 20px Courier New,monospace';ctx.textAlign='center';
      ctx.fillText('🐣  ¡Jugar de nuevo!',CW/2,by+34);
      window._restartBtn={x:bx,y:by,w:bw,h:bh};
    }else{window._restartBtn=null;}
    ctx.textAlign='left';drawFW();
  }

  if(state==='dead'){
    ctx.save();ctx.globalAlpha=0.52;ctx.fillStyle='#000';ctx.fillRect(0,0,CW,CH);ctx.restore();
    txt('¡Pipipi! 🐥',CW/2,CH/2-18,'#FF5555','bold 44px Courier New,monospace');
    txt(deathMsg,CW/2,CH/2+30,'#ffddaa','bold 20px Courier New,monospace');
    if(checkpointActive)txt('↩ Volviendo al checkpoint...',CW/2,CH/2+58,'#88ff88','bold 12px Courier New,monospace');
    ctx.textAlign='left';
  }

  if(state==='gameover'){ drawGameOver(); }
  if(state==='exitConfirm'){ drawExitConfirm(); }
  if(state==='worldIntro'){ drawWorldIntro(); }

  if(paused){
    ctx.save();ctx.globalAlpha=0.58;ctx.fillStyle='#000';ctx.fillRect(0,0,CW,CH);ctx.restore();
    txt('⏸ PAUSA',CW/2,CH/2-8,'#FFD700','bold 36px Courier New,monospace');
    txt('Presiona P / Esc o toca ⏸ para continuar',CW/2,CH/2+28,'#fff','bold 13px Courier New,monospace');
    ctx.textAlign='left';
  }
}

function getCanvasPos(e){
  const rect=cv.getBoundingClientRect();
  const scaleX=CW/rect.width,scaleY=CH/rect.height;
  const src=(e.changedTouches&&e.changedTouches[0])||(e.touches&&e.touches[0])||e;
  return{x:(src.clientX-rect.left)*scaleX,y:(src.clientY-rect.top)*scaleY};
}

function hit(b,x,y){ return !!b && x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h; }

function checkClick(e){
  const{x,y}=getCanvasPos(e);

  // Botón del menú principal → ahora lleva a selección de planetas
  if(state==='menu'&&window._playBtn){
    const b=window._playBtn;
    if(hit(b,x,y)){ state='planetSelect'; return; }
  }

  // Tarjetas de selección de planeta
  if(state==='planetSelect'&&window._planetBtns){
    const pb=window._planetBtns;
    if(hit(pb.tierra,x,y)){ startGame('tierra'); return; }
    if(hit(pb.marte,x,y)){
      if(PLANET_MARTE.available){ startGame('marte'); }
      else { setMsg('🚀 Marte: ¡Próximamente!'); setTimeout(()=>setMsg(''),1500); }
      return;
    }
    if(hit(pb.mercurio,x,y)){ setMsg('☄️ Mercurio: ¡Próximamente!'); setTimeout(()=>setMsg(''),1500); return; }
  }

  // Premisa / requisito de mundo → continuar
  if(state==='worldIntro'&&window._introBtn){
    if(hit(window._introBtn,x,y)){ state='playing'; return; }
  }

  // Diálogo de confirmación de salida
  if(state==='exitConfirm'&&window._exitBtns){
    const eb=window._exitBtns;
    if(hit(eb.no,x,y)){ state='playing'; return; }
    if(hit(eb.yes,x,y)){
      state='planetSelect';
      lives=3;score=0;worldIdx=0; setHUD();
      return;
    }
  }

  // Pantalla de Game Over
  if(state==='gameover'&&window._gameoverBtns){
    const gb=window._gameoverBtns;
    if(hit(gb.replay,x,y)){ startGame(planet); return; }
    if(hit(gb.planets,x,y)){ state='planetSelect'; return; }
  }

  // Botón reiniciar en pantalla final
  if(state==='final'&&window._restartBtn){
    if(hit(window._restartBtn,x,y)) doRestart();
  }
}

cv.addEventListener('click',e=>{cv.focus();checkClick(e);});
cv.addEventListener('touchend',e=>{e.preventDefault();checkClick(e);},{passive:false});

const FRAME_MS=1000/60; let lastT=0;
function loop(ts){
  requestAnimationFrame(loop);
  if(ts-lastT<FRAME_MS-1)return;
  lastT=ts; update(); draw(); updateOpenBtn();
}
cv.setAttribute('tabindex','0');cv.focus();
requestAnimationFrame(loop);
