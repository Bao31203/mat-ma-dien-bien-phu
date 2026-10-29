import test from 'node:test';
import assert from 'node:assert/strict';
import {maps} from '../src/content/world-data.js';
import {normalizedDirection,isWalkable,resolveCheckpoint,buildReachability,segmentClear} from '../src/core/world-geometry.js';

test('diagonal input has the same speed as a straight direction',()=>{
  assert.equal(Math.hypot(...Object.values(normalizedDirection(1,0,260))),260);
  assert.ok(Math.abs(Math.hypot(...Object.values(normalizedDirection(1,-1,260)))-260)<1e-9);
  assert.deepEqual(normalizedDirection(0,0,260),{x:0,y:0});
});
for(const map of Object.values(maps)){
  test(`${map.id}: safe spawn, separate checkpoints, and real walkable approaches`,()=>{
    const entry=resolveCheckpoint(map,'entry');assert.ok(entry);
    assert.equal(resolveCheckpoint(map,'missing'),entry);
    const reachable=buildReachability(map,entry,{lockedGates:true});
    assert.ok(reachable.size>800,'map contains a substantial connected world');
    for(const [index,checkpoint] of map.checkpoints.entries()){
      assert.ok(isWalkable(map,checkpoint.x,checkpoint.y,{lockedGates:true}),checkpoint.id);
      assert.ok(reachable.canReach(checkpoint,0),`checkpoint ${checkpoint.id} connected to entry`);
      for(const other of map.checkpoints.slice(index+1))assert.ok(Math.hypot(checkpoint.x-other.x,checkpoint.y-other.y)>checkpoint.radius+other.radius);
    }
    for(const target of [...map.interactables,...map.exits])assert.ok(reachable.canReach(target),`${target.id} has a reachable interaction approach`);
    for(const exit of map.exits){
      if(exit.gate){
        const [x,y,w,h]=exit.gate;assert.equal(isWalkable(map,x+w/2,y+h/2,{lockedGates:true}),false);
        assert.equal(reachable.canReach(exit,0),false,`${exit.id} cannot be walked through while locked`);
      }
      assert.ok(buildReachability(map,entry).canReach(exit,0),`${exit.id} can be walked to after unlocking`);
      assert.ok(maps[exit.toChapterId],`exit destination ${exit.toChapterId} exists`);
      assert.ok(resolveCheckpoint(maps[exit.toChapterId],exit.spawnId));
    }
  });
}
test('geometry rejects out-of-world, invalid, wall and prop positions with body clearance',()=>{
  const map=maps['him-lam'];
  for(const [x,y] of [[-1,50],[2400,800],[NaN,10],[36,100],[450,240],[429,240]])assert.equal(isWalkable(map,x,y),false,`${x},${y}`);
  assert.equal(segmentClear(map,{x:760,y:300},{x:840,y:300}),false,'cannot reach through the west partition');
});
