// ── physics.js — colisiones y resolución de física ──
function rc(ax,ay,aw,ah,bx,by,bw,bh){
  return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by;
}

function resolve(){
  pl.onGround=false;
  const all=[...W.plats,...(mp?[mp]:[]),...(mp2?[mp2]:[]),...(mp3?[mp3]:[])];
  for(const p of all){
    if(!rc(pl.x,pl.y,pl.w,pl.h,p.x,p.y,p.w,p.h)) continue;
    const ox=Math.min(pl.x+pl.w,p.x+p.w)-Math.max(pl.x,p.x);
    const oy=Math.min(pl.y+pl.h,p.y+p.h)-Math.max(pl.y,p.y);
    if(oy<=ox){
      if(pl.y+pl.h/2<p.y+p.h/2){pl.y=p.y-pl.h;if(pl.vy>0){pl.vy=0;pl.onGround=true;pl.jumps=0;}}
      else{pl.y=p.y+p.h;if(pl.vy<0)pl.vy=1;}
    }else{
      if(pl.x+pl.w/2<p.x+p.w/2)pl.x=p.x-pl.w; else pl.x=p.x+p.w;
      pl.vx=0;
    }
  }
}

function spikeHit(){
  if(inv>0) return;
  for(const s of W.spikes){
    if(rc(pl.x+3,pl.y+18,pl.w-6,pl.h-18,s.x+2,s.y-13,s.w-4,13)){die();return;}
  }
}
