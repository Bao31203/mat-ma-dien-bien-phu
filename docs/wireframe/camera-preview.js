/* Movement/camera design specimen, independent of the future Phaser game. */
(() => {
  const canvas=document.querySelector('#bunker-scene'),ctx=canvas.getContext('2d');
  const world=window.bunkerArtwork,dialog=document.querySelector('#specimen-dialog');
  const button=document.querySelector('#desk-interaction'),status=document.querySelector('#camera-status');
  const player={...world.start},camera={x:0,y:0},viewport={width:960,height:540};
  const animation={facing:'down',frame:0,walking:false};
  const keys=new Set(),motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
  const controls=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
  let lastTime=0,active=false,nearbyClueId=null,walkTime=0,stepDistance=0;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const paused=()=>Boolean(document.querySelector('dialog[open]'))||document.hidden||!active;
  const reduced=()=>motionPreference.matches||document.body.classList.contains('reduce-motion');
  function idle(){animation.walking=false;animation.frame=0;walkTime=0;stepDistance=0;}
  const clearKeys=()=>{keys.clear();idle();};
  function follow(dt,snap=false){
    const targetX=clamp(player.x-viewport.width/2,0,world.width-viewport.width);
    const targetY=clamp(player.y-viewport.height/2,0,world.height-viewport.height);
    const blend=snap||reduced()?1:1-Math.exp(-9*dt);
    camera.x+=(targetX-camera.x)*blend;camera.y+=(targetY-camera.y)*blend;
    camera.x=clamp(camera.x,0,world.width-viewport.width);camera.y=clamp(camera.y,0,world.height-viewport.height);
  }
  function resize(){
    const bounds=canvas.getBoundingClientRect();
    viewport.width=960;viewport.height=Math.round(960*bounds.height/bounds.width);
    viewport.height=Math.min(1100,Math.max(300,viewport.height));
    canvas.width=viewport.width;canvas.height=viewport.height;ctx.imageSmoothingEnabled=false;
    follow(0,true);draw();
  }
  function blocked(x,y){
    if(x<12||y<12||x>world.width-12||y>world.height-12)return true;
    return world.obstacles.some(([ox,oy,w,h])=>x+12>ox&&x-12<ox+w&&y+8>oy&&y-8<oy+h);
  }
  function move(dt){
    let x=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));
    let y=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));
    const length=Math.hypot(x,y),before={...player};if(!length)return {dx:0,dy:0};
    x=x/length*220*dt;y=y/length*220*dt;
    // Substeps prevent tunneling; independent axes allow natural wall sliding.
    const steps=Math.max(1,Math.ceil(Math.max(Math.abs(x),Math.abs(y))/5));
    for(let i=0;i<steps;i++){
      if(!blocked(player.x+x/steps,player.y))player.x+=x/steps;
      if(!blocked(player.x,player.y+y/steps))player.y+=y/steps;
    }
    return {dx:player.x-before.x,dy:player.y-before.y};
  }
  function animate({dx,dy},dt){
    const distance=Math.hypot(dx,dy);
    if(distance<.001){idle();return;}
    animation.walking=true;
    animation.facing=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
    walkTime+=dt;animation.frame=Math.floor(walkTime/.11)%4;
    // Cadence follows distance actually travelled, never a held key against a wall.
    stepDistance+=distance;
    if(stepDistance>=64){stepDistance%=64;window.previewAudio?.play('footstep');}
  }
  function proximity(){
    const targets=world.interactables||[{id:'prepare',...world.desk,radius:190,label:'bàn làm việc'}];
    let nearest=null,nearestDistance=Infinity;
    for(const target of targets){
      const distance=Math.hypot(player.x-target.x,player.y-target.y);
      if(distance<(target.radius||190)&&distance<nearestDistance){nearest=target;nearestDistance=distance;}
    }
    const nextId=nearest?.id||null;
    if(button.disabled===Boolean(nearest)||nearbyClueId!==nextId){
      button.disabled=!nearest;
      button.querySelector('span').textContent=nearest?`Khám phá ${nearest.label||'tư liệu'}`:'Đến gần điểm tư liệu để khám phá';
      if(nextId)button.dataset.clueId=nextId;else delete button.dataset.clueId;
    }
    nearbyClueId=nextId;
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(world.bitmap,Math.round(camera.x),Math.round(camera.y),viewport.width,viewport.height,0,0,viewport.width,viewport.height);
    window.previewCharacter.draw(ctx,{x:player.x-camera.x,y:player.y-camera.y,...animation,reducedMotion:reduced()});
    proximity();
    const message=active?'CAMERA THEO MINH':'BẤM BẢN ĐỒ ĐỂ DI CHUYỂN';
    if(status.textContent!==message)status.textContent=message;
  }
  function frame(time){
    const dt=Math.min((time-lastTime)/1000||0,0.04);lastTime=time;
    if(!paused()){animate(move(dt),dt);follow(dt);}else idle();
    draw();requestAnimationFrame(frame);
  }
  canvas.addEventListener('focus',()=>{active=true;clearKeys();});
  canvas.addEventListener('blur',()=>{active=false;clearKeys();});
  canvas.addEventListener('pointerdown',()=>canvas.focus());
  document.querySelector('#focus-map').addEventListener('click',()=>canvas.focus());
  canvas.addEventListener('keydown',event=>{
    if(event.ctrlKey||event.metaKey||event.altKey||event.target.isContentEditable||dialog.open)return;
    if(event.repeat&&!keys.has(event.code)){if(controls.has(event.code))event.preventDefault();return;}
    if(controls.has(event.code)){event.preventDefault();keys.add(event.code);}
  });
  window.addEventListener('keyup',event=>{keys.delete(event.code);if(!keys.size)idle();});
  window.addEventListener('blur',()=>{active=false;clearKeys();});
  window.addEventListener('focus',()=>{active=document.activeElement===canvas;clearKeys();});
  document.addEventListener('visibilitychange',()=>{clearKeys();active=!document.hidden&&document.activeElement===canvas;lastTime=0;});
  new MutationObserver(()=>{clearKeys();if(dialog.open)active=false;}).observe(dialog,{attributes:true,attributeFilter:['open']});
  dialog.addEventListener('close',()=>{clearKeys();active=document.activeElement===canvas;lastTime=0;});
  document.addEventListener('preview-reset',()=>{clearKeys();animation.facing='down';Object.assign(player,world.start);follow(0,true);draw();});
  new ResizeObserver(resize).observe(canvas);
  // Frozen snapshot copies provide QA visibility without state mutation methods.
  Object.defineProperty(window,'cameraPreview',{value:Object.freeze({getState:()=>Object.freeze({
    player:Object.freeze({...player}),camera:Object.freeze({...camera}),world:Object.freeze({width:world.width,height:world.height}),
    viewport:Object.freeze({...viewport}),paused:paused(),nearDesk:Boolean(nearbyClueId),nearbyClueId,
    animation:Object.freeze({...animation})
  })}),writable:false,configurable:false});
  resize();requestAnimationFrame(frame);
})();
