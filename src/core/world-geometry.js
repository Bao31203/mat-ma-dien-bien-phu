// Footprint dimensions are shared by pure checks and the Phaser Arcade body.
export const PLAYER_BODY=Object.freeze({width:24,height:16,halfWidth:12,halfHeight:8});
export function normalizedDirection(x,y,speed=1){
  const length=Math.hypot(x,y);return length?{x:x/length*speed,y:y/length*speed}:{x:0,y:0};
}
export function collisionRects(map,{lockedGates=false}={}){
  return [...map.walls,...map.props.filter(p=>p.solid!==false).map(p=>[p.x,p.y,p.w,p.h]),
    ...(lockedGates?map.exits.filter(e=>e.gate).map(e=>e.gate):[])];
}
function intersects(x,y,[rx,ry,w,h],halfWidth=12,halfHeight=8){
  return x+halfWidth>rx&&x-halfWidth<rx+w&&y+halfHeight>ry&&y-halfHeight<ry+h;
}
export function isWalkable(map,x,y,options={}){
  if(!map||!Number.isFinite(x)||!Number.isFinite(y)||x<12||y<8||x>map.width-12||y>map.height-8)return false;
  return !collisionRects(map,options).some(rect=>intersects(x,y,rect));
}
export function resolveCheckpoint(map,id='entry'){
  if(!map)return null;
  const valid=point=>point&&isWalkable(map,point.x,point.y,{lockedGates:true});
  const requested=map.checkpoints.find(point=>point.id===id);
  if(valid(requested))return requested;
  const entry=map.checkpoints.find(point=>point.id==='entry');return valid(entry)?entry:null;
}
export const safeCheckpoint=resolveCheckpoint;
export function segmentClear(map,from,to,{wallsOnly=false,lockedGates=false}={}){
  const rects=wallsOnly?map.walls:collisionRects(map,{lockedGates});
  const steps=Math.max(1,Math.ceil(Math.hypot(to.x-from.x,to.y-from.y)/4));
  for(let i=0;i<=steps;i++){
    const x=from.x+(to.x-from.x)*i/steps,y=from.y+(to.y-from.y)*i/steps;
    if(rects.some(rect=>intersects(x,y,rect,wallsOnly?0:12,wallsOnly?0:8)))return false;
  }
  return true;
}
export function nearbyTarget(map,point,targets){
  let nearest=null,distance=Infinity;
  for(const target of targets){
    const next=Math.hypot(point.x-target.x,point.y-target.y);
    if(next<=target.radius&&next<distance&&segmentClear(map,point,target,{wallsOnly:true})){nearest=target;distance=next;}
  }
  return nearest;
}
// Flood the actual collision geometry with body clearance; used in map validation,
// never to move a player or bypass gates at runtime.
export function buildReachability(map,origin,{step=16,lockedGates=false}={}){
  const visited=new Set(),queue=[],options={lockedGates};
  const rects=collisionRects(map,options);
  const safe=(x,y)=>x>=12&&y>=8&&x<=map.width-12&&y<=map.height-8&&!rects.some(r=>intersects(x,y,r));
  const key=(x,y)=>`${x},${y}`;
  const sx=Math.round(origin.x/step)*step,sy=Math.round(origin.y/step)*step;
  if(safe(sx,sy)&&segmentClear(map,origin,{x:sx,y:sy},options)){visited.add(key(sx,sy));queue.push({x:sx,y:sy});}
  for(let index=0;index<queue.length;index++){
    const point=queue[index];
    for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){
      const x=point.x+dx,y=point.y+dy,k=key(x,y);
      if(!visited.has(k)&&safe(x,y)&&safe((x+point.x)/2,(y+point.y)/2)){visited.add(k);queue.push({x,y});}
    }
  }
  const canReach=(target,radius=target.radius||0)=>queue.some(point=>{
    const distance=Math.hypot(point.x-target.x,point.y-target.y);
    if(radius)return distance<=radius&&segmentClear(map,point,target,{wallsOnly:true});
    return distance<=step*1.5&&segmentClear(map,point,target,options);
  });
  return {size:visited.size,canReach,points:queue};
}
export function isReachable(map,from,target,options={}){return buildReachability(map,from,options).canReach(target);}
