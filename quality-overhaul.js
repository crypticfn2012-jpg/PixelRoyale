/* PixelRoyale quality pass: extra cosmetics, map readability and CrazyGames room integration. */
(function(){
"use strict";

/* New cosmetics are appended so every previously saved cosmetic index stays valid. */
SK.push(
  ["Arctic Recon","#a9e9f5",5200],["Rustline","#c56b45",5600],["Signal Runner","#50e5e0",6100],
  ["Deep Current","#287f9e",6600],["Solar Flare","#ffb45b",7100],["Night Circuit","#6378bd",7600],
  ["Rift Walker","#a16cff",8200],["Containment Gold","#d8bd78",8800]
);
HT.push(
  ["Arctic Comms","❄",5000],["Signal Antenna","⌁",5600],["Rift Crown","✦",6200],
  ["Recon Goggles","◉",6800],["Containment Crest","⬟",7400]
);
TR.push(
  ["Arctic Wake","#b8f3ff",5200],["Signal Trace","#50e5e0",5700],["Rift Spark","#a16cff",6200],
  ["Solar Dust","#ffc36b",6800],["Night Circuit","#7388d8",7400],["Containment Glow","#e3d0ff",8000]
);
WL.push(
  ["Arctic Alloy","#a9dce8",5000],["Rustline Steel","#b87553",5500],["Signal Glass","#52e9dc",6100],
  ["Riftstone","#8762d8",6700],["Containment Gold","#d4b66e",7300]
);
S.own=SK.map((_,i)=>i===0||!!(S.own&&S.own[i])?1:0);
S.oh=HT.map((_,i)=>i===0||!!(S.oh&&S.oh[i])?1:0);
S.ot=TR.map((_,i)=>i===0||!!(S.ot&&S.ot[i])?1:0);
S.ow=WL.map((_,i)=>i===0||!!(S.ow&&S.ow[i])?1:0);
if(typeof save==="function")save();

/* Give the five new hats their own readable silhouettes at the actual player scale. */
const originalHatd=hatd;
hatd=function(h){
  if(h<18){originalHatd(h);return}
  cx.save();
  if(h===18){
    cx.fillStyle="#bcefff";cx.strokeStyle="#456b83";cx.lineWidth=1.8;
    cx.beginPath();cx.roundRect(-10,-7,20,12,4);cx.fill();cx.stroke();
    cx.fillStyle="#eaffff";cx.fillRect(-7,-4,14,3);
    cx.strokeStyle="#8bdfff";cx.lineWidth=2;cx.beginPath();cx.arc(0,-5,7,Math.PI,Math.PI*2);cx.stroke();
  }else if(h===19){
    cx.strokeStyle="#4deaff";cx.lineWidth=2.5;cx.beginPath();cx.moveTo(0,-5);cx.lineTo(0,-15);cx.stroke();
    cx.fillStyle="#ff5bd2";cx.beginPath();cx.arc(0,-16,3,0,Math.PI*2);cx.fill();
    cx.fillStyle="#253d55";cx.beginPath();cx.roundRect(-9,-6,18,12,3);cx.fill();cx.stroke();
  }else if(h===20){
    cx.fillStyle="#382552";cx.strokeStyle="#d6a0ff";cx.lineWidth=2;
    cx.beginPath();cx.moveTo(-11,3);cx.lineTo(-9,-10);cx.lineTo(-3,-5);cx.lineTo(0,-17);cx.lineTo(4,-5);cx.lineTo(10,-10);cx.lineTo(11,3);cx.closePath();cx.fill();cx.stroke();
    cx.fillStyle="#56efff";cx.fillRect(-2,-5,4,5);
  }else if(h===21){
    cx.fillStyle="#26394c";cx.strokeStyle="#8bdcff";cx.lineWidth=2;
    cx.beginPath();cx.roundRect(-12,-5,24,10,4);cx.fill();cx.stroke();
    cx.fillStyle="#8cecff";cx.fillRect(-9,-3,7,5);cx.fillRect(2,-3,7,5);
    cx.strokeStyle="#d7f8ff";cx.lineWidth=1;cx.beginPath();cx.moveTo(-2,0);cx.lineTo(2,0);cx.stroke();
  }else{
    cx.fillStyle="#29223c";cx.strokeStyle="#e3c78a";cx.lineWidth=2;
    cx.beginPath();cx.moveTo(-11,6);cx.lineTo(-10,-7);cx.lineTo(-5,-4);cx.lineTo(0,-15);cx.lineTo(5,-4);cx.lineTo(10,-7);cx.lineTo(11,6);cx.closePath();cx.fill();cx.stroke();
    cx.fillStyle="#f1d58e";cx.fillRect(-7,1,14,2);
  }
  cx.restore();
};

/* Add contrast to collision footprints and natural ground detail without changing collision data. */
function polishMap(){
  if(!MAP||!MAP.getContext)return;
  const x=MAP.getContext("2d");
  x.save();
  x.lineJoin="round";
  for(const o of OB){
    if(!o||![o.x,o.y,o.w,o.h].every(Number.isFinite))continue;
    x.fillStyle="rgba(3,8,16,.10)";
    x.fillRect(o.x+3,o.y+4,o.w,o.h);
    x.strokeStyle="rgba(4,10,19,.48)";
    x.lineWidth=Math.max(2,Math.min(5,Math.min(o.w,o.h)*.13));
    x.strokeRect(o.x+1,o.y+1,o.w-2,o.h-2);
    x.strokeStyle="rgba(225,240,246,.16)";
    x.lineWidth=1.2;
    x.strokeRect(o.x+3,o.y+3,Math.max(1,o.w-6),Math.max(1,o.h-6));
  }
  /* Walkable ground gets low-contrast grass and pebble clusters; no new blocked areas are introduced. */
  const clear=(px,py,r)=>!OB.some(o=>px+r>o.x&&px-r<o.x+o.w&&py+r>o.y&&py-r<o.y+o.h);
  for(let i=0;i<980;i++){
    const a=rnd()*Math.PI*2,d=Math.sqrt(rnd())*(IR-35),px=C+Math.cos(a)*d,py=C+Math.sin(a)*d;
    if(!clear(px,py,14)||POI.some(p=>Math.hypot(p[1]-px,p[2]-py)<155))continue;
    if(i%5===0){
      x.fillStyle=i%10===0?"rgba(210,194,139,.20)":"rgba(28,66,37,.22)";
      x.beginPath();x.ellipse(px,py,3+rnd()*5,2+rnd()*3,rnd()*3,0,Math.PI*2);x.fill();
    }else{
      x.strokeStyle=i%3===0?"rgba(205,226,143,.36)":"rgba(24,75,39,.34)";
      x.lineWidth=1.4;x.beginPath();x.moveTo(px-2,py+3);x.lineTo(px,py-2-rnd()*4);x.lineTo(px+2,py+2);x.stroke();
    }
  }
  /* A broken shoreline highlight gives the island a clearer edge at normal gameplay zoom. */
  x.setLineDash([18,25]);x.strokeStyle="rgba(227,244,255,.32)";x.lineWidth=5;
  x.beginPath();x.arc(C,C,IR+25,0,Math.PI*2);x.stroke();
  x.setLineDash([]);x.restore();
}
const originalBuildMap=buildMap;
buildMap=function(){originalBuildMap();polishMap()};

/* Keep the renderer in sync when a portal resizes the iframe without a full window resize. */
if(typeof onGameViewportResize==="function"){
  addEventListener("resize",onGameViewportResize,{passive:true});
  if(window.visualViewport)visualViewport.addEventListener("resize",onGameViewportResize,{passive:true});
  requestAnimationFrame(onGameViewportResize);
}

/* CrazyGames room data is a portal layer over the same Worker rooms used by the Windows client. */
function crazyReady(){return !!(sdkReady&&CG&&CG.environment!=="disabled"&&CG.game)}
function crazyUpdateRoom(joinable){
  if(!crazyReady()||!mpPrivate||!mpRoomCode||typeof CG.game.updateRoom!=="function")return;
  try{
    const result=CG.game.updateRoom({
      roomId:"pixelroyale-"+String(mpRoomCode).toUpperCase(),
      isJoinable:!!joinable,
      inviteParams:{room:String(mpRoomCode).toUpperCase()}
    });
    if(result&&typeof result.catch==="function")result.catch(e=>console.warn("CrazyGames room update unavailable",e));
  }catch(e){console.warn("CrazyGames room update unavailable",e)}
}
function crazyLeaveRoom(){
  if(!crazyReady()||typeof CG.game.leftRoom!=="function")return;
  try{const result=CG.game.leftRoom();if(result&&typeof result.catch==="function")result.catch(()=>{})}catch(_){}
}
const originalMpDisconnect=mpDisconnect;
mpDisconnect=function(){try{originalMpDisconnect()}finally{crazyLeaveRoom()}};
const originalMpConnect=mpConnect;
mpConnect=function(params){
  originalMpConnect(params);
  const socket=mpSocket;
  if(!socket||typeof socket.addEventListener!=="function")return;
  socket.addEventListener("message",event=>{
    let packet;try{packet=JSON.parse(event.data)}catch(_){return}
    if(packet.type==="room_joined"&&mpPrivate)crazyUpdateRoom(true);
    else if(packet.type==="game_start")crazyUpdateRoom(false);
    else if(packet.type==="kicked")crazyLeaveRoom();
  });
  socket.addEventListener("close",crazyLeaveRoom,{once:true});
};
const originalHostStart=mpHostStart;
mpHostStart=function(){originalHostStart();crazyUpdateRoom(false)};

function joinCrazyInvite(params){
  const room=params&&(params.room||params.roomCode||params.code);
  if(!room)return false;
  const code=String(room).toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);
  if(code.length!==6)return false;
  const field=$("mpRoomCode");if(field)field.value=code;
  joinPrivateRoom();
  return true;
}
let crazyEntryHandled=false,crazyJoinListenerAdded=false,crazyPolls=0;
const crazyEntryPoll=setInterval(()=>{
  crazyPolls++;
  if(!crazyReady()){
    if(crazyPolls>=100)clearInterval(crazyEntryPoll);
    return;
  }
  if(!crazyJoinListenerAdded&&typeof CG.game.addJoinRoomListener==="function"){
    try{CG.game.addJoinRoomListener(joinCrazyInvite);crazyJoinListenerAdded=true}catch(e){console.warn("CrazyGames join listener unavailable",e)}
  }
  if(!crazyEntryHandled){
    crazyEntryHandled=true;
    const params=CG.game.inviteParams||null;
    if(!joinCrazyInvite(params)&&CG.game.isInstantMultiplayer===true){
      selectedMode=selectedMode||"br";
      createPrivateRoom();
    }
  }
  if(crazyEntryHandled)clearInterval(crazyEntryPoll);
},250);

console.info("PixelRoyale quality layer loaded · shared Worker multiplayer enabled");
})();