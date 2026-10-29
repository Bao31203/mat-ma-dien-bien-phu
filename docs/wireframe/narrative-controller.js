/* Chapter-one design prototype: explore, read at your own pace, collect, then order four stages. */
(() => {
  const data=window.narrativeData, collected=new Set(), history=[];
  const byId=id=>data.stages.find(stage=>stage.id===id);
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let host,scene,page=0,timer=null,fullText='',revealed=true,solved=false,hintLevel=0;
  let order=['artillery','victory','prepare','infantry'];
  const sound=cue=>window.previewAudio?.play(cue);
  const action=(name,text,css='quiet-button')=>`<button class="${css}" data-story-action="${name}">${text}</button>`;
  function stopTyping(){clearInterval(timer);timer=null;}
  function updateHud(){
    document.querySelector('#clue-count').textContent=`${collected.size} / 4`;
    document.querySelector('#clue-status').textContent=`Đã nhận ${collected.size} trên 4 manh mối`;
    document.querySelector('#mission-text').innerHTML=solved?'Ký ức Him Lam đã liền mạch.<br><strong>Đã hoàn thành chương I trong bản mẫu.</strong>':`Đã tìm ${collected.size}/4 dấu vết trong hầm.<br><strong>${collected.size===4?'Mở hồ sơ để ghép trình tự.':'Sổ tay chỉ đường tới những mảnh còn lại.'}</strong>`;
  }
  function reveal(){
    stopTyping();revealed=true;
    const target=document.querySelector('#vn-text');if(target)target.textContent=fullText;
    const button=document.querySelector('#reveal-line');if(button)button.disabled=true;
  }
  function writeLine(text){
    stopTyping();fullText=text;revealed=false;
    const target=document.querySelector('#vn-text');
    const immediate=matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('reduce-motion');
    if(immediate)return reveal();
    let index=0;const letters=Array.from(text);target.textContent='';
    timer=setInterval(()=>{index+=3;target.textContent=letters.slice(0,index).join('');if(index>=letters.length)reveal();},24);
  }
  function showScene(){
    const intro=scene.id==='intro',last=page===scene.lines.length-1;
    const nextLabel=last?(intro?'Bắt đầu khám phá →':collected.has(scene.id)?'Trở lại bản đồ →':'Ghi vào sổ tay ✓'):'Tiếp lời →';
    host.show({kind:'vn-dialog',kicker:'LỜI KỂ CỦA MINH · SÁNG TÁC CHO GAME',title:scene.clue,
      body:`<div class="vn-layout"><div class="vn-portrait"><span class="portrait-fallback" aria-hidden="true">M</span><img src="assets/minh-portrait.png" alt="Minh, nhân vật hư cấu" width="180" height="220" onerror="this.hidden=true"></div><div class="vn-copy"><div class="vn-speaker"><strong>MINH</strong><span>${intro?'LỜI MỞ ĐẦU':escape(scene.location)} · ${page+1}/${scene.lines.length}</span></div><p id="vn-text" aria-hidden="true"></p><p class="sr-only" id="vn-accessible-text">${escape(scene.lines[page])}</p><p class="vn-fiction">${escape(data.disclaimer)}</p><div class="vn-controls">${action('reveal','Hiện hết','quiet-button reveal-button').replace('data-story-action','id="reveal-line" data-story-action')}${action('full','Đọc toàn cảnh')}${action('advance',nextLabel,'primary-button')}</div><p class="vn-help">Đọc theo nhịp của bạn · Hiện hết để bỏ hiệu ứng chữ · Esc tạm rời lời kể</p></div></div>`});
    writeLine(scene.lines[page]);sound('reveal');
  }
  function openClue(id){
    const nearest=window.cameraPreview?.getState().nearbyClueId;
    if(!byId(id)||(!collected.has(id)&&nearest!==id))return false;
    scene=byId(id);page=0;showScene();return true;
  }
  function collect(){
    if(!collected.has(scene.id)){collected.add(scene.id);history.push(scene.id);sound('paper');}
    updateHud();openNotebook();
  }
  function openNotebook(){
    stopTyping();
    const entries=data.stages.map(stage=>`<li class="notebook-entry ${collected.has(stage.id)?'collected':''}"><span class="entry-state">${collected.has(stage.id)?'✓ ĐÃ GHI NHẬN':'◇ CHƯA TÌM THẤY'}</span><h3>${escape(stage.clue)}</h3><p>${escape(collected.has(stage.id)?stage.fact:stage.direction)}</p><small>${escape(stage.location)}</small>${collected.has(stage.id)?`<button class="notebook-read" data-story-clue="${stage.id}">Đọc lại lời Minh ↗</button>`:''}</li>`).join('');
    host.show({kicker:`SỔ TAY KÝ ỨC · ${collected.size}/4 MANH MỐI`,title:'Bốn dấu vết của trận mở màn',body:`<p>Ghi chép lịch sử dưới đây được lược thuật từ tư liệu. Lời kể riêng của Minh là sáng tác cho trò chơi.</p><ul class="notebook-entries">${entries}</ul><div class="dialog-actions">${action('puzzle','Ghép trình tự →','primary-button')}${action('history','Lịch sử lời kể')}${action('sources','Xem tư liệu')}</div>`});
  }
  function openHistory(){
    stopTyping();
    const body=history.length?history.map(id=>{const stage=byId(id);return `<section class="history-entry"><h3>${escape(stage.clue)}</h3>${stage.lines.map(line=>`<p>“${escape(line)}”</p>`).join('')}</section>`;}).join(''):'<p>Chưa có lời kể được ghi lại. Đến gần bản ghi trên bàn hồ sơ để bắt đầu.</p>';
    host.show({kicker:'LỊCH SỬ LỜI KỂ · KHÔNG LƯU QUA TẢI LẠI',title:'Những điều Minh đã đọc',body:`<p class="dialog-note">${escape(data.disclaimer)}</p>${body}<div class="dialog-actions">${action('notebook','Trở lại sổ tay')}</div>`});
  }
  function openSources(){
    stopTyping();host.show({kicker:'ĐỌC VÀ ĐỐI CHIẾU',title:'Tư liệu lịch sử',body:`<p>Bốn giai đoạn trong câu đố là bản lược thuật: chuẩn bị trận địa → pháo binh mở màn chiều 13/3/1954 → bộ binh xung phong → làm chủ Him Lam, giành thắng lợi trận mở màn.</p><p><a href="${data.source.url}" target="_blank" rel="noopener noreferrer">${escape(data.source.title)} ↗</a></p><p><a href="https://dienbienphu.nhandan.vn/" target="_blank" rel="noopener noreferrer">Chuyên trang Điện Biên Phủ — Báo Nhân Dân ↗</a></p><p class="dialog-note">${escape(data.disclaimer)} Các mảnh giấy, điện lệnh, sơ đồ và căn hầm trong game là hình thức kể chuyện hư cấu; không phải bản sao hiện vật. Kết quả Him Lam không đồng nghĩa kết thúc toàn bộ chiến dịch ngày 7/5/1954.</p><div class="dialog-actions">${action('notebook','Mở sổ tay')}</div>`});
  }
  function openPuzzle(feedback=''){
    stopTyping();const ready=collected.size===4;
    const cards=order.map((id,i)=>`<li class="sequence-card" data-stage-id="${id}" tabindex="-1"><span class="sequence-number">${i+1}</span><div><h3>${escape(byId(id).title)}</h3><span>${collected.has(id)?'✓ Có manh mối trong sổ tay':'◇ Chưa thu thập manh mối'}</span></div><div class="sequence-moves"><button data-move="up" data-stage="${id}" aria-label="Đưa ${escape(byId(id).title)} lên" ${i===0?'disabled':''}>↑</button><button data-move="down" data-stage="${id}" aria-label="Đưa ${escape(byId(id).title)} xuống" ${i===3?'disabled':''}>↓</button></div></li>`).join('');
    host.show({kicker:`HỒ SƠ HIM LAM · ${collected.size}/4 MANH MỐI`,title:'Đặt ký ức vào đúng trình tự',body:`<p>Dùng nút ↑ ↓ để xếp bốn giai đoạn từ trước đến sau. Không cần kéo thả.</p><ol id="sequence-cards" class="sequence-cards">${cards}</ol><p id="puzzle-lock" class="dialog-note">${ready?'Đủ bốn manh mối. Bạn có thể đối chiếu trình tự.':`Cần tìm đủ bốn manh mối để đối chiếu; còn ${4-collected.size} dấu vết. Sổ tay có chỉ đường.`}</p><div id="puzzle-feedback" role="status" aria-live="polite">${feedback}</div><div class="dialog-actions"><button class="primary-button" id="sequence-check" data-story-action="check" ${ready?'':'disabled'}>Đối chiếu trình tự →</button>${action('hint','Xem gợi ý')}${action('notebook','Đọc sổ tay')}</div><p class="dialog-note">Chỉ chương I có thể hoàn thành trong bản mẫu; chưa có lưu tiến độ.</p>`});
  }
  function check(){
    if(collected.size!==4)return;
    if(order.every((id,i)=>id===data.stages[i].id)){
      solved=true;updateHud();sound('success');
      host.show({kicker:'CHƯƠNG I · KÝ ỨC ĐÃ LIỀN MẠCH',title:'Mình đã hiểu một khởi đầu',body:`<p class="feedback success">✓ Chuẩn bị trận địa → Pháo binh mở màn → Bộ binh xung phong → Làm chủ Him Lam.</p><blockquote>“Mình đã nối những dấu vết thành một câu chuyện. Đó là thắng lợi ở Him Lam, trận mở màn của chiến dịch.”</blockquote><p class="dialog-note">Lời Minh là sáng tác. Chương I đã hoàn thành trong bản mẫu; ba chương tiếp theo chưa triển khai.</p><div class="dialog-actions">${action('close','Trở lại căn hầm →','primary-button')}${action('history','Đọc lại lời kể')}</div>`});
    }else{sound('error');openPuzzle('<p class="feedback">Trình tự chưa khớp. Hãy xem bước chuẩn bị và bước mở màn; bạn có thể đổi vị trí thẻ rồi thử lại.</p>');}
  }
  function hint(){
    hintLevel=Math.min(2,hintLevel+1);
    const text=hintLevel===1?'Chuẩn bị trận địa đứng trước pháo binh mở màn. Làm chủ Him Lam là kết quả, đứng cuối chuỗi.':'Chuẩn bị → Pháo binh mở màn chiều 13/3 → Bộ binh xung phong → Làm chủ Him Lam.';
    openPuzzle(`<p class="feedback hint">Gợi ý ${hintLevel}: ${text}</p>`);
  }
  function handle(event){
    const move=event.target.closest('[data-move]');
    if(move){
      const id=move.dataset.stage,direction=move.dataset.move;
      const i=order.indexOf(id),j=i+(direction==='up'?-1:1);if(j<0||j>3)return;
      [order[i],order[j]]=[order[j],order[i]];openPuzzle();
      const card=document.querySelector(`[data-stage-id="${id}"]`);
      const sameDirection=card.querySelector(`[data-move="${direction}"]`);
      // Keep repeated activation moving in the chosen direction; boundaries have neutral focus.
      (sameDirection.disabled?card:sameDirection).focus();
      document.querySelector('#announcement').textContent=`Đã đưa ${byId(id).title} đến vị trí ${j+1}`;return;
    }
    const reread=event.target.closest('[data-story-clue]');if(reread)return openClue(reread.dataset.storyClue);
    const button=event.target.closest('[data-story-action]');if(!button)return;
    const name=button.dataset.storyAction;
    if(name==='reveal')return reveal();
    if(name==='full'){page=scene.lines.length-1;showScene();fullText=scene.lines.join('\n\n');document.querySelector('#vn-accessible-text').textContent=fullText;reveal();return;}
    if(name==='advance'){
      if(!revealed)return reveal();
      if(page<scene.lines.length-1){page++;return showScene();}
      if(scene.id==='intro'||collected.has(scene.id)){host.close();document.querySelector('#bunker-scene').focus();return;}
      return collect();
    }
    ({notebook:openNotebook,puzzle:openPuzzle,history:openHistory,sources:openSources,check,hint,close:()=>host.close()})[name]?.();
  }
  window.narrativePreview=Object.freeze({
    init(value){host=value;document.querySelector('#dialog-content').addEventListener('click',handle);document.querySelector('#specimen-dialog').addEventListener('close',stopTyping);updateHud();},
    openClue,openNotebook,openPuzzle,openHistory,openSources,
    openIntro(){scene=data.intro;page=0;showScene();},
    reset(){stopTyping();collected.clear();history.length=0;order=['artillery','victory','prepare','infantry'];hintLevel=0;solved=false;updateHud();},
    getState:()=>Object.freeze({collected:Object.freeze([...collected]),order:Object.freeze([...order]),solved,sceneId:scene?.id||null,page,revealed,historyCount:history.length})
  });
})();

