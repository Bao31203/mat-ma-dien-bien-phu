/* Schematized bunker bitmap. Art coordinates use two-world-pixel units. */
(() => {
  const bitmap=document.createElement('canvas');bitmap.width=2400;bitmap.height=1440;
  const ctx=bitmap.getContext('2d');ctx.scale(2,2);
  const walls=[
    [16,16,1168,16],[16,688,1168,16],[16,32,16,656],[1168,32,16,656],
    [392,32,16,218],[784,32,16,218],[392,430,16,258],[784,430,16,258],
    [32,250,208,16],[330,250,260,16],[680,250,300,16],[1070,250,98,16],
    [32,414,98,16],[220,414,320,16],[630,414,310,16],[1030,414,138,16]
  ];
  const props=[];
  const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
  const line=(points,c,width=1)=>{ctx.strokeStyle=c;ctx.lineWidth=width;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
  const shadow=(x,y,w,h)=>rect(x+4,y+6,w,h,'#17231b77');
  const block=(x,y,w,h)=>props.push([x,y,w,h]);
  let seed=93;
  const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const label=(text,x,y,color='#d6d2af')=>{
    ctx.font='8px "Segoe UI",Tahoma,sans-serif';ctx.textAlign='center';
    const width=ctx.measureText(text).width;
    ctx.fillStyle='#24301dcc';ctx.fillRect(x-width/2-5,y-8,width+10,13);
    ctx.fillStyle=color;ctx.fillText(text,x,y+1);
  };
  const plank=(x,y,w,h)=>{
    rect(x,y,w,h,'#4d402b');rect(x+2,y+2,w-4,h-4,'#80613a');rect(x+3,y+3,w-6,2,'#ac8a53');
    for(let i=9;i<h-3;i+=9)line([[x+3,y+i],[x+w-3,y+i]],'#574a30');
    rect(x+2,y+h-4,w-4,2,'#363421');
  };
  const crate=(x,y,w=36,h=29)=>{
    block(x,y,w,h);shadow(x,y,w,h);plank(x,y,w,h);
    rect(x+3,y+2,4,h-4,'#ae8b52');rect(x+w-7,y+2,4,h-4,'#ae8b52');
    line([[x+6,y+4],[x+w-6,y+h-5]],'#b29456',3);
    rect(x+3,y+3,2,2,'#3b3828');rect(x+w-5,y+h-5,2,2,'#3b3828');
  };
  const lamp=(x,y)=>{
    const glow=ctx.createRadialGradient(x,y,3,x,y,115);
    glow.addColorStop(0,'#efc15c65');glow.addColorStop(.35,'#e1ad4e28');glow.addColorStop(1,'#d4a34b00');
    ctx.fillStyle=glow;ctx.fillRect(x-115,y-115,230,230);
    rect(x-4,y-6,8,13,'#2b2e20');rect(x-3,y-3,6,8,'#ecbc55');rect(x-2,y-1,4,5,'#fff0a3');rect(x-5,y+6,10,2,'#242b1d');
  };
  const desk=(x,y,kind='paper')=>{
    block(x,y,90,44);shadow(x,y,90,44);plank(x,y,90,44);
    if(kind==='radio'){
      rect(x+9,y-5,69,31,'#303e31');rect(x+12,y-3,63,26,'#4d5d43');
      rect(x+16,y+1,32,12,'#252f28');rect(x+18,y+3,27,3,'#b6a66a');
      for(let i=18;i<45;i+=4)rect(x+i,y+8,1,2,'#7d8a5e');
      rect(x+57,y+2,11,10,'#25362a');rect(x+61,y+4,3,6,'#b6b887');
      for(let i=16;i<72;i+=5)rect(x+i,y+17,2,3,'#273a2b');
      line([[x+72,y-5],[x+72,y-31],[x+80,y-35]],'#7f8d60');
    }else{
      rect(x+20,y+7,29,24,'#e0d3a0');for(let i=11;i<28;i+=4)rect(x+24,y+i,19-(i%3),1,'#8e8c63');
      rect(x+49,y+23,21,12,'#bab27d');rect(x+53,y+26,13,1,'#72774c');
      rect(x+66,y+6,14,17,'#40543e');rect(x+68,y+8,10,2,'#78815a');rect(x+66,y+23,14,2,'#c9c18c');
      lamp(x+11,y+13);
    }
    plank(x+31,y+56,27,17);block(x+31,y+56,27,17);
  };
  const map=(x,y,w=88,h=48)=>{
    block(x,y,w,h);shadow(x,y,w,h);rect(x,y,w,h,'#4e5135');rect(x+3,y+3,w-6,h-6,'#b8ad7b');
    line([[x+10,y+h-10],[x+24,y+14],[x+38,y+23],[x+53,y+10],[x+w-10,y+17]],'#6e7d50',2);
    line([[x+20,y+8],[x+27,y+28],[x+43,y+h-8],[x+68,y+25]],'#91855a');
    for(let [px,py] of [[24,14],[53,10],[68,25]])rect(x+px,y+py,3,3,'#864b35');
  };
  rect(0,0,1200,720,'#19251b');
  for(let i=0;i<4000;i++)rect(Math.floor(random()*1200),Math.floor(random()*720),2+Math.floor(random()*4),2,['#2d3828','#35412c','#1f2c20'][i%3]);
  rect(32,32,1136,656,'#424d35');
  const stones=['#5c6045','#62644a','#65664b','#595f45','#6a6b4e','#5e6248'];
  for(let y=32;y<688;y+=17)for(let x=32;x<1168;x+=25){
    rect(x,y,24,16,stones[Math.floor(random()*stones.length)]);rect(x+2,y+1,20,1,'#7c7d5755');
    if(random()>.6)rect(x+5+Math.floor(random()*12),y+6,3,1,'#3c493377');
  }
  // A continuous timber corridor connects six distinct stone-floored rooms.
  for(let y=267;y<414;y+=12)for(let x=32;x<1168;x+=64){
    rect(x,y,63,11,['#726440','#7b6944','#6c613d'][Math.floor(random()*3)]);
    rect(x+3,y+2,55,1,'#a38b5555');rect(x+4,y+8,2,1,'#3f4d31');
  }
  for(const [x,y,w,h] of walls){
    shadow(x,y,w,h);rect(x,y,w,h,'#34412c');
    if(w>h)for(let yy=y;yy<y+h;yy+=6)for(let xx=x;xx<x+w;xx+=23){
      rect(xx+1,yy,Math.min(21,x+w-xx-1),5,['#777151','#676448','#5c6243'][(xx+yy)%3]);rect(xx+1,yy,Math.min(21,x+w-xx-1),1,'#a39a6955');
    }else for(let yy=y;yy<y+h;yy+=14){rect(x+1,yy,w-2,12,'#626448');rect(x+1,yy,w-2,2,'#878260');line([[x+8,yy+2],[x+8,yy+11]],'#3a4931');}
  }
  // Upper rooms: archive, signals station, supplies.
  desk(220,110);map(73,55);crate(57,191);crate(88,205);crate(335,65);
  desk(535,100,'radio');desk(669,175,'radio');map(428,50,76,45);
  for(let i=0;i<3;i++)crate(827+i*43,73,36,34);
  for(let i=0;i<3;i++)crate(1082,132+i*33,43,29);
  crate(865,184,53,36);crate(908,185,35,27);
  // Lower rooms: campaign documents, sleeping alcove and memory door.
  map(78,480,130,78);desk(252,589);crate(61,624,43,30);
  for(let x of [448,545,651]){
    block(x,485,53,83);shadow(x,485,53,83);rect(x,485,53,83,'#343f2d');
    rect(x+3,489,47,74,'#7c8055');rect(x+5,493,43,17,'#b2ad7b');
    rect(x+4,520,45,39,'#626e47');rect(x+6,524,41,3,'#8a9260');
  }
  crate(707,627,39,30);desk(1049,514);map(830,458,76,45);
  block(950,662,80,26);plank(950,662,80,26);rect(955,669,70,4,'#b49b60');rect(986,674,7,10,'#b9a15e');
  // Furniture stays at the corridor edges, leaving an uninterrupted route.
  crate(360,278,37,26);crate(760,374,36,28);crate(1130,280,28,26);map(930,278,90,38);
  for(const [x,y] of [[163,47],[348,232],[498,278],[757,232],[1002,49],[74,396],[987,395],[340,457],[444,650],[1094,638]])lamp(x,y);
  label('HỒ SƠ HIM LAM',214,82);label('✧ BẢN GHI CHUẨN BỊ',265,103,'#f0d396');
  label('ĐIỆN ĐÀI',590,66);label('KHO TIẾP TẾ',971,54);label('HÀNH LANG KÝ ỨC  →',594,338,'#e6d8ac');
  label('GIAN BẢN ĐỒ',212,458);label('GÓC NGHỈ CHÂN',590,461);label('CÁNH CỬA KÝ ỨC',986,643);
  label('✧ ĐIỆN LỆNH PHÁO BINH',580,92,'#f0d396');label('✧ SƠ ĐỒ XUNG PHONG',975,274,'#f0d396');label('✧ BẢN TIN HIM LAM',143,474,'#f0d396');
  for(const [x,y] of [[285,258],[635,258],[1025,258],[175,422],[585,422],[985,422]]){rect(x-13,y-3,26,6,'#aa8c51');rect(x-11,y-2,22,2,'#d2b879');}
  const interactables=[
    {id:'prepare',x:530,y:270,radius:190,label:'Bản ghi chuẩn bị',stageId:'prepare'},
    {id:'artillery',x:1160,y:260,radius:190,label:'Điện lệnh pháo binh',stageId:'artillery'},
    {id:'infantry',x:1950,y:594,radius:170,label:'Sơ đồ xung phong',stageId:'infantry'},
    {id:'victory',x:285,y:1040,radius:190,label:'Bản tin Him Lam',stageId:'victory'}
  ].map(item=>Object.freeze(item));
  window.bunkerArtwork=Object.freeze({bitmap,width:2400,height:1440,obstacles:[...walls,...props].map(r=>r.map(v=>v*2)),desk:{x:530,y:270},start:{x:580,y:350},interactables:Object.freeze(interactables)});
})();
