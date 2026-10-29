/* Local procedural sound. No AudioContext exists before an explicit enable gesture.
   Pausing silences ambience/steps; deliberate dialog cues may still play. */
(() => {
  const AudioEngine=window.AudioContext||window.webkitAudioContext;
  let context=null,master=null,ambientGain=null,noiseBuffer=null,enabled=false,wanted=false;
  let manualPaused=false,windowFocused=document.hasFocus(),operation=0,lastStep=-Infinity,error=null;
  let lastCue=null,stepCount=0,cueCount=0,recordingStep=false;
  const sources=new Set(),ambient=new Set(),footsteps=new Set();
  const dialogOpen=()=>Boolean(document.querySelector('dialog[open]'));
  const background=()=>document.hidden||!windowFocused;
  const paused=()=>manualPaused||dialogOpen()||background();
  const getState=()=>Object.freeze({enabled,available:Boolean(AudioEngine),running:context?.state==='running',
    paused:paused(),state:context?.state||'uninitialized',error,lastCue,stepCount,cueCount,
    activeSources:sources.size,ambientSources:ambient.size});
  function announce(){document.dispatchEvent(new CustomEvent('preview-audio-change',{detail:getState()}));}
  function silence(sourceSet){for(const source of [...sourceSet]){try{source.stop();}catch{}source.disconnect();sourceSet.delete(source);}}
  function track(source,destination,group=sources){
    source.connect(destination);group.add(source);if(recordingStep)footsteps.add(source);
    source.onended=()=>{source.disconnect();group.delete(source);footsteps.delete(source);};return source;
  }
  function initialize(){
    context=new AudioEngine();master=context.createGain();master.gain.value=0;master.connect(context.destination);
    ambientGain=context.createGain();ambientGain.gain.value=0;ambientGain.connect(master);
    noiseBuffer=context.createBuffer(1,context.sampleRate,context.sampleRate);
    const data=noiseBuffer.getChannelData(0);let smooth=0;
    for(let i=0;i<data.length;i++){smooth=(smooth+Math.random()*2-1)/1.4;data[i]=smooth*.5;}
    context.addEventListener('statechange',()=>{sync();announce();});
  }
  function startAmbience(){
    if(ambient.size||!context)return;
    const tone=track(context.createOscillator(),ambientGain,ambient);tone.type='sine';tone.frequency.value=58;tone.start();
    const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=240;filter.Q.value=.3;filter.connect(ambientGain);
    const air=track(context.createBufferSource(),filter,ambient);air.buffer=noiseBuffer;air.loop=true;
    air.onended=()=>{air.disconnect();filter.disconnect();ambient.delete(air);};air.start();
  }
  function sync(){
    if(!context)return;
    const now=context.currentTime,audible=enabled&&wanted&&context.state==='running'&&!background();
    master.gain.cancelScheduledValues(now);master.gain.setValueAtTime(audible ? .32 : 0,now);
    ambientGain.gain.cancelScheduledValues(now);ambientGain.gain.setValueAtTime(audible&&!paused() ? .025 : 0,now);
    if(!audible)silence(sources);
    if(paused())silence(footsteps);
    if(audible&&!paused())startAmbience();
  }
  async function setEnabled(value){
    const version=++operation;wanted=Boolean(value);error=null;
    if(!wanted){enabled=false;sync();silence(ambient);announce();return false;}
    if(!AudioEngine){wanted=false;error='Trình duyệt này không hỗ trợ âm thanh Web Audio.';announce();return false;}
    try{
      if(!context)initialize();
      // Called directly from the toggle's gesture before awaiting the resume promise.
      await context.resume();
      if(version!==operation)return enabled;
      enabled=wanted&&context.state==='running';
      if(!enabled){wanted=false;error='Chưa bật được âm thanh. Hãy bấm thử lại.';}
    }catch{if(version!==operation)return enabled;wanted=false;enabled=false;error='Chưa bật được âm thanh. Hãy bấm thử lại.';}
    sync();announce();return enabled;
  }
  function setPaused(value){manualPaused=Boolean(value);sync();announce();}
  function envelope(destination,volume,duration,delay=0){
    const gain=context.createGain(),now=context.currentTime+delay;
    gain.gain.value=0;
    gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,now+duration);gain.connect(destination);return gain;
  }
  function tone(frequency,delay,duration,volume,type='sine'){
    const source=context.createOscillator(),gain=envelope(master,volume,duration,delay),now=context.currentTime;
    source.type=type;source.frequency.setValueAtTime(frequency,now+delay);track(source,gain);
    source.onended=()=>{source.disconnect();gain.disconnect();sources.delete(source);footsteps.delete(source);};source.start(now+delay);source.stop(now+delay+duration);
  }
  function rustle(duration,volume,frequency){
    const filter=context.createBiquadFilter(),gain=envelope(master,volume,duration),source=context.createBufferSource();
    filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.6;filter.connect(gain);
    source.buffer=noiseBuffer;track(source,filter);
    source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();sources.delete(source);footsteps.delete(source);};
    source.start();source.stop(context.currentTime+duration);
  }
  function play(kind){
    if(!enabled||!wanted||!context||context.state!=='running'||background()||sources.size>20)return false;
    if(kind==='footstep'){
      if(paused()||context.currentTime-lastStep<.15)return false;
      lastStep=context.currentTime;recordingStep=true;rustle(.085,.13,240);tone(78,0,.07,.085);recordingStep=false;stepCount++;
    }else if(kind==='paper')rustle(.22,.15,1800);
    else if(kind==='reveal'){rustle(.16,.09,1400);tone(392,0,.28,.09);tone(523,.09,.32,.07);}
    else if(kind==='success'){tone(392,0,.28,.12);tone(494,.12,.3,.1);tone(587,.24,.5,.1);}
    else if(kind==='error'){tone(196,0,.14,.09,'triangle');tone(165,.14,.2,.08,'triangle');}
    else return false;
    lastCue=kind;cueCount++;
    return true;
  }
  // Single lifecycle listeners; no per-click contexts, loops, or event handlers.
  const refresh=()=>{sync();announce();};
  window.addEventListener('blur',()=>{windowFocused=false;refresh();});
  window.addEventListener('focus',()=>{windowFocused=true;refresh();});
  document.addEventListener('visibilitychange',refresh);
  new MutationObserver(refresh).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
  document.addEventListener('close',refresh,true);
  Object.defineProperty(window,'previewAudio',{value:Object.freeze({setEnabled,play,setPaused,getState}),writable:false,configurable:false});
})();
