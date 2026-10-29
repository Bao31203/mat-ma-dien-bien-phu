const movementCodes=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
export function bindSceneInput(scene){
  const canvas=scene.game.canvas,unsubscribers=[];
  const listen=(target,event,handler)=>{target.addEventListener(event,handler);unsubscribers.push(()=>target.removeEventListener(event,handler));};
  canvas.tabIndex=0;canvas.setAttribute('role','region');
  canvas.setAttribute('aria-label','Bản đồ khám phá. WASD hoặc phím mũi tên để di chuyển, E để tương tác, Tab để rời bản đồ.');
  scene.input.keyboard?.disableGlobalCapture();
  if(scene.input.keyboard)scene.input.keyboard.enabled=false;
  listen(canvas,'pointerdown',()=>canvas.focus({preventScroll:true}));
  listen(canvas,'keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||document.activeElement!==canvas)return;
    if(!movementCodes.has(event.code)&&event.code!=='KeyE')return;
    event.preventDefault();
    if(scene.motionUnavailable())return;
    if(event.code==='KeyE'){event.stopPropagation();if(!event.repeat)scene.interactNearby();return;}
    // OS repeat events surviving a modal/blur cannot reintroduce a cleared key.
    if(event.repeat&&!scene.heldKeys.has(event.code))return;
    scene.heldKeys.add(event.code);
  });
  listen(window,'keyup',event=>{scene.heldKeys.delete(event.code);});
  listen(canvas,'blur',()=>scene.clearMotion());
  listen(window,'blur',()=>{scene.windowFocused=false;scene.clearMotion();});
  listen(window,'focus',()=>{scene.windowFocused=true;scene.clearMotion();});
  listen(document,'visibilitychange',()=>scene.clearMotion());
  return ()=>{unsubscribers.forEach(unsubscribe=>unsubscribe());scene.clearMotion();};
}
