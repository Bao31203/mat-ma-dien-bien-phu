/* Shared native-dialog host, preferences, and input routing for the chapter-one specimen. */
(() => {
  const dialog=document.querySelector('#specimen-dialog'),content=document.querySelector('#dialog-content');
  const narrative=window.narrativePreview,announcement=document.querySelector('#announcement');
  let returnFocus=null;
  const sound=cue=>window.previewAudio?.play(cue);
  function show({title,kicker,body,kind=''}){
    dialog.className=kind;
    document.querySelector('#dialog-kicker').textContent=kicker;
    document.querySelector('#dialog-title').textContent=title;
    content.innerHTML=body;
    if(!dialog.open){
      returnFocus=document.activeElement.matches('button,canvas')?document.activeElement:document.querySelector('#focus-map');
      dialog.showModal();
    }
    document.querySelector('.dialog-close').focus();
  }
  const close=()=>dialog.close();
  function updateSound(){
    const enabled=window.previewAudio?.getState().enabled===true;
    const button=document.querySelector('#sound-toggle');
    button.textContent=enabled?'Âm thanh: bật':'Bật âm thanh';button.setAttribute('aria-pressed',String(enabled));
    const check=document.querySelector('#sound-enabled');if(check)check.checked=enabled;
  }
  async function setSound(enabled){
    const result=await window.previewAudio?.setEnabled(enabled);
    updateSound();announcement.textContent=result===false&&enabled?'Trình duyệt chưa thể phát âm thanh. Hãy thử bật lại.':enabled?'Đã bật hiệu ứng âm thanh.':'Đã tắt âm thanh.';
    if(result&&enabled)sound('paper');
  }
  function settings(){
    const checked=name=>document.body.classList.contains(name)?'checked':'';
    show({kicker:'TÙY CHỌN BẢN MẪU',title:'Một khoảng dừng',body:`<p>Khám phá bốn dấu vết để đọc lời Minh, nhận manh mối và ghép lại trình tự trận Him Lam. Hội thoại dừng chuyển động; đóng bảng rồi nhấn lại phím để đi tiếp.</p><label class="setting-row"><input id="sound-enabled" type="checkbox"> Hiệu ứng âm thanh</label><label class="setting-row"><input id="reduced-motion" type="checkbox" ${checked('reduce-motion')}> Hiện chữ ngay, bỏ độ trễ camera</label><label class="setting-row"><input id="high-visibility" type="checkbox" ${checked('high-visibility')}> Tăng độ sáng khung cảnh</label><p class="dialog-note">Âm thanh chỉ bật khi bạn chọn. Lời kể hiển thị bằng văn bản, chưa có lồng tiếng. Chưa có cảm ứng, lưu tiến độ hoặc ba chương tiếp theo.</p><div class="dialog-actions"><button class="primary-button" data-close>Trở lại căn hầm →</button></div>`});updateSound();
  }
  function openClue(){
    const id=window.cameraPreview?.getState().nearbyClueId;
    if(id)narrative.openClue(id);
  }
  function open(view){
    if(view==='clue')return openClue();
    if(view==='settings')return settings();
    sound('paper');
    ({notebook:()=>narrative.openNotebook(),puzzle:()=>narrative.openPuzzle(),history:()=>narrative.openHistory(),sources:()=>narrative.openSources()})[view]?.();
  }
  narrative.init({show,close});
  document.addEventListener('preview-interact',event=>narrative.openClue(event.detail?.clueId));
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-open]');if(button)open(button.dataset.open);
    if(event.target.closest('[data-close]'))close();
  });
  document.querySelector('.dialog-close').addEventListener('click',close);
  dialog.addEventListener('close',()=>returnFocus?.focus());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;const b=dialog.getBoundingClientRect();
    if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)close();
  });
  content.addEventListener('change',event=>{
    if(event.target.id==='sound-enabled')setSound(event.target.checked);
    if(event.target.id==='reduced-motion')document.body.classList.toggle('reduce-motion',event.target.checked);
    if(event.target.id==='high-visibility')document.body.classList.toggle('high-visibility',event.target.checked);
  });
  document.querySelector('#sound-toggle').addEventListener('click',()=>setSound(!window.previewAudio?.getState().enabled));
  document.addEventListener('keydown',event=>{
    if(event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.target.isContentEditable||/INPUT|SELECT|TEXTAREA/.test(event.target.tagName)||dialog.open)return;
    if(event.key.toLowerCase()==='e')openClue();
    if(event.key.toLowerCase()==='n')open('notebook');
    if(event.key==='Escape')settings();
  });
  document.querySelector('#reset-preview').addEventListener('click',()=>{
    close();narrative.reset();document.body.classList.remove('reduce-motion','high-visibility');
    document.dispatchEvent(new Event('preview-reset'));announcement.textContent='Đã đặt lại chương I; chưa có manh mối nào được nhận.';
    requestAnimationFrame(()=>narrative.openIntro());
  });
  updateSound();requestAnimationFrame(()=>narrative.openIntro());
})();
