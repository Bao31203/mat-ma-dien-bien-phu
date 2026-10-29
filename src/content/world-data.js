// Fictional rooms for exploration; these plans are not historical military maps.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const scaled=rect=>rect.map(n=>n*2);
const bunkerWalls=[
  [16,16,1168,16],[16,688,1168,16],[16,32,16,656],[1168,32,16,656],
  [392,32,16,218],[784,32,16,218],[392,430,16,258],[784,430,16,258],
  [32,250,208,16],[330,250,260,16],[680,250,300,16],[1070,250,98,16],
  [32,414,98,16],[220,414,320,16],[630,414,310,16],[1030,414,138,16],
].map(scaled);
const prop=(type,x,y,w,h)=>({type,x:x*2,y:y*2,w:w*2,h:h*2});
function furniture(theme){
  const result=[prop('desk',220,110,90,44),prop('chair',251,166,27,17),prop('map',73,55,88,48),
    prop('radio',535,100,90,44),prop('radio',669,175,90,44),prop('map',428,50,76,45),
    prop('map',78,480,130,78),prop('desk',252,589,90,44),prop('desk',1049,514,90,44),
    prop('map',830,458,76,45),prop('map',930,278,90,38),prop('chair',1080,570,27,17)];
  for(const [x,y,w,h] of [[57,191,36,29],[88,205,36,29],[335,65,36,29],[865,184,53,36],[908,185,35,27],
    [61,624,43,30],[707,627,39,30],[360,278,37,26],[760,374,36,28]])result.push(prop('crate',x,y,w,h));
  for(let i=0;i<3;i++){result.push(prop('crate',827+i*43,73,36,34));result.push(prop('crate',1082,132+i*33,43,29));}
  for(const x of [448,545,651])result.push(prop(theme==='peace'?'garden':'bed',x,485,53,83));
  if(theme==='campaign-map')result.push(prop('map',545,610,104,42));
  if(theme==='command-post')result.push(prop('radio',850,585,90,44));
  return result;
}
const clue=(id,x,y,label)=>({id,type:'clue',clueId:id,x,y,radius:180,label});
const clueSets={
  'him-lam':[clue('him-lam-position',530,270,'Hồ sơ chuẩn bị'),clue('him-lam-artillery',1160,260,'Dòng ghi điện đài'),
    clue('him-lam-infantry',1950,594,'Sơ đồ hành lang'),clue('him-lam-victory',285,1040,'Bản tin Him Lam')],
  'campaign-map':[clue('campaign-north',530,270,'Chú giải phương hướng'),clue('campaign-chronology',1160,260,'Dải mốc chiến dịch'),
    clue('campaign-encirclement',285,1040,'Lời nhắc bên sa bàn')],
  'command-post':[clue('command-report',530,270,'Mẩu điện: sở chỉ huy'),clue('command-advance',1160,260,'Mẩu điện: tiến quân'),
    clue('command-capture',1950,594,'Mẩu điện: kết quả')],
  peace:[clue('peace-memory',530,270,'Ký ức trong tấm ảnh'),clue('peace-community',1950,594,'Bàn học hôm nay')],
};
const themes={
  'him-lam':{name:'HỒ SƠ HIM LAM',floor:'#64664b',wall:'#6c694c',accent:'#d9b66c'},
  'campaign-map':{name:'GIAN BẢN ĐỒ',floor:'#57634e',wall:'#5e6b52',accent:'#b9cc8b'},
  'command-post':{name:'SỞ CHỈ HUY',floor:'#53605b',wall:'#5d6d60',accent:'#b5c6a2'},
  peace:{name:'CÁNH CỬA HÒA BÌNH',floor:'#6b7050',wall:'#7d7952',accent:'#efcc83'},
};
function bunker(id,next){
  const interactables=[...clueSets[id]];
  interactables.push(id==='peace'?{id:'peace-reflection',type:'puzzle',puzzleId:'peace',x:1710,y:730,radius:150,label:'Một điều mang về'}:
    {id:`${id}-puzzle`,type:'puzzle',puzzleId:id,x:1710,y:730,radius:150,label:'Bàn ghép hồ sơ'});
  return {id,width:2400,height:1440,theme:themes[id],walls:bunkerWalls,props:furniture(id),
    checkpoints:[{id:'entry',x:580,y:350,radius:56},{id:'hall',x:1120,y:680,radius:64},
      {id:'archive',x:600,y:1080,radius:60},{id:'east',x:2070,y:720,radius:52}],interactables,
    exits:[{id:`${id}-exit`,type:'exit',x:2290,y:680,radius:150,label:'Cánh cửa ký ức',toChapterId:next,spawnId:'entry',
      requiresRoomId:id,gate:[2208,532,24,296]}]};
}
function museum(id){
  const ending=id==='ending';
  return {id,width:1280,height:800,theme:{name:ending?'TRỞ LẠI BẢO TÀNG':'BẢO TÀNG · HIỆN TẠI',floor:'#777963',wall:'#92917a',accent:'#eed29a'},
    walls:[[32,32,1216,24],[32,744,1216,24],[32,56,24,688],[1224,56,24,688],
      ...(ending?[]:[[1100,360,124,24],[1100,576,124,24]])],
    props:[{type:'model',x:232,y:190,w:200,h:120},{type:'display',x:560,y:190,w:200,h:120},
      {type:'display',x:888,y:190,w:200,h:120},{type:'bench',x:550,y:565,w:190,h:44},
      {type:'garden',x:96,y:640,w:76,h:64},{type:'garden',x:1104,y:640,w:76,h:64}],
    checkpoints:[{id:'entry',x:380,y:470,radius:64}],
    interactables:[{id:`${id}-journal`,type:'story',beatId:`${id}-intro`,x:332,y:300,radius:200,label:ending?'Bên mô hình hầm':'Mô hình hầm chỉ huy'}],
    exits:ending?[]:[{id:'museum-exit',type:'exit',x:1160,y:480,radius:150,label:'Bước vào ký ức',toChapterId:'him-lam',spawnId:'entry',
      requiresBeatId:'museum-intro',gate:[1100,384,24,192]}]};
}
export const maps=freeze({museum:museum('museum'),'him-lam':bunker('him-lam','campaign-map'),
  'campaign-map':bunker('campaign-map','command-post'),'command-post':bunker('command-post','peace'),
  peace:bunker('peace','ending'),ending:museum('ending')});
export function getMap(chapterId){return maps[chapterId]||null;}
