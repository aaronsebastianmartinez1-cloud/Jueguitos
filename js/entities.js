// ── entities.js — enemigos y proyectiles ──
function stompEnemy(e){
  pl.vy=-10; pl.jumps=1; inv=10;
  shake(2,5); sfx.stomp(); spawnDust(e.x+16,e.y+16,5,1);
  e.hpCur--;
  e.dmgFlash=18;
  if(e.hpCur<=0){
    e.alive=false;
    score+=50+worldIdx*20; setHUD();
    spawnFW(e.x+16, e.y-10);
  }
}

function updateEnemies(){
  for(const e of enemies){
    if(!e.alive) continue;
    e.x+=e.spd*e.dir;
    if(e.pb){
      const mn=e.pb.x+4, mx=e.pb.x+e.pb.w-36;
      if(e.x>=mx){e.x=mx;e.dir=-1;} else if(e.x<=mn){e.x=mn;e.dir=1;}
    }else{
      if(e.x>e.ox+e.range){e.x=e.ox+e.range;e.dir=-1;}
      else if(e.x<e.ox){e.x=e.ox;e.dir=1;}
    }
    if(e.dmgFlash>0) e.dmgFlash--;
    e.ft++; if(e.ft%8===0) e.frame=(e.frame+1)%4;
    if(pl.vy>1&&inv<=0){
      const plBot=pl.y+pl.h, eTop=e.y+2;
      if(plBot>=eTop&&plBot<=eTop+16&&pl.x+pl.w-6>e.x+6&&pl.x+6<e.x+30){
        stompEnemy(e); return;
      }
    }
    if(inv<=0&&rc(pl.x+5,pl.y+8,pl.w-10,pl.h-14,e.x+4,e.y+4,28,16)){die();return;}
    if(e.shoots){
      e.shootTimer--;
      if(e.shootTimer<=0){
        e.shootTimer=(e.shootCd||120)+(Math.random()*30|0);
        const dx=pl.x+15-(e.x+16);
        if(Math.abs(dx)<480){
          const spd=worldIdx>=5?3.8:3.0;
          projectiles.push({
            wx:e.x+(dx>0?32:0), wy:e.y+10,
            vx:dx>0?spd:-spd, vy:-0.4,
            col:worldIdx>=5?'#bb44ff':worldIdx>=4?'#ff6600':'#ff4400',
            life:1, age:0
          });
        }
      }
    }
  }
  for(const p of projectiles){
    p.wx+=p.vx; p.wy+=p.vy; p.vy+=0.1;
    p.age++; p.life=Math.max(0,1-p.age/220);
    for(const pl2 of W.plats){
      if(rc(p.wx,p.wy,8,8,pl2.x,pl2.y,pl2.w,pl2.h)){p.life=0;break;}
    }
    if(inv<=0&&rc(p.wx,p.wy,8,8,pl.x+3,pl.y+3,pl.w-6,pl.h-6)){p.life=0;die();return;}
  }
  projectiles=projectiles.filter(p=>p.life>0&&p.wx>camX-60&&p.wx<camX+CW+60);
}
