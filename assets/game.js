const CAT_TEMPLATES = [
  {id:'naicha',name:'CANDY',personality:'A',fur:'#d8783e',x:42,y:45},
  {id:'zhima',name:'SESAME',personality:'B',fur:'#596268',x:62,y:56},
  {id:'nuomi',name:'MOCHI',personality:'C',fur:'#e8dfc7',x:27,y:62}
];
const LEVELS = {
  1:{cats:1,hiddenAt:80,interval:5000},
  2:{cats:2,hiddenAt:70,interval:5000},
  3:{cats:3,hiddenAt:60,interval:4000}
};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let state={level:1,tick:0,selected:null,cats:[],tensions:{},sound:true,over:false,timer:null,press:null,conflicts:0,ball:{x:50,y:72,angle:0,dragging:false,speed:0,chasers:[]}};

$$('.preset').forEach(button=>button.onclick=()=>{$$('.preset').forEach(x=>x.classList.remove('active'));button.classList.add('active');state.level=+button.dataset.level});
$('#startBtn').onclick=startGame;
$('#retryBtn').onclick=()=>{$('#resultModal').classList.add('hidden');startGame()};
$('#soundBtn').onclick=()=>{state.sound=!state.sound;$('#soundBtn').textContent=`SOUND ${state.sound?'ON':'OFF'}`};
$('#endDayBtn').onclick=finish;
$('#quietCorner').onclick=()=>sceneAct('space',20,22);
$('#litter').onclick=cleanUsedLitter;
$('#scratch').onclick=()=>sceneAct('space',83,31);
bindBall();

function startGame(){
  clearInterval(state.timer);
  const cfg=LEVELS[state.level];
  state={level:state.level,tick:0,selected:null,tensions:{},sound:state.sound,over:false,timer:null,press:null,conflicts:0,ball:{x:20+Math.random()*58,y:62+Math.random()*20,angle:-35+Math.random()*70,dragging:false,speed:0,chasers:[]},cats:CAT_TEMPLATES.slice(0,cfg.cats).map((base,i)=>{const activity=i===1?'window':'sit',start=i===0?[70,62]:i===1?[20,22]:[55,45];return {...base,x:start[0],y:start[1],hunger:55+i*3,trust:52,stress:22+i*7,hidden:false,foodBowl:35,litterClean:i===0?28:65-i*3,litterVisited:false,usingLitterUntil:0,bowlZero:false,litterZero:false,emptyTicks:0,hiddenTicks:0,criticalTicks:0,spaceTicks:0,spaceUntil:0,windowUntil:0,windowFacing:Math.random()<.5?'front':'back',activity,activityUntil:3+i,lastPetTick:-99,lookRight:false,positiveUntil:0,touchedUntil:0,retreatUntil:0,meowSince:null,timelyRewarded:false}})};
  for(let i=0;i<state.cats.length;i++)for(let j=i+1;j<state.cats.length;j++)state.tensions[pairKey(state.cats[i],state.cats[j])]=18;
  $('#briefPanel').classList.add('hidden');$('#playArea').classList.remove('hidden');
  render();state.timer=setInterval(tick,cfg.interval);requestAnimationFrame(animateTails);
}

function bindPress(element,type){
  element.onpointerdown=e=>{state.press={type,start:performance.now(),pointer:e.pointerId};element.setPointerCapture?.(e.pointerId)};
  element.onpointerup=e=>{if(!state.press||state.press.pointer!==e.pointerId)return;const speed=performance.now()-state.press.start>=520?'slow':'fast';state.press=null;act(type,speed)};
}

function bindBall(){
  const ball=$('#toyBall'),room=$('#room');
  ball.onpointerdown=e=>{if(state.over)return;state.ball.dragging=true;state.ball.lastX=e.clientX;state.ball.lastY=e.clientY;state.ball.lastTime=performance.now();ball.setPointerCapture?.(e.pointerId)};
  ball.onpointermove=e=>{if(!state.ball.dragging)return;const rect=room.getBoundingClientRect(),now=performance.now(),dt=Math.max(8,now-state.ball.lastTime),dx=e.clientX-state.ball.lastX,dy=e.clientY-state.ball.lastY;state.ball.speed=Math.min(1,Math.hypot(dx,dy)/dt/0.45);state.ball.x=Math.max(3,Math.min(94,(e.clientX-rect.left)/rect.width*100));state.ball.y=Math.max(8,Math.min(86,(e.clientY-rect.top)/rect.height*100));state.ball.lastX=e.clientX;state.ball.lastY=e.clientY;state.ball.lastTime=now;updateChasers();renderBall()};
  ball.onpointerup=()=>{if(!state.ball.dragging)return;state.ball.dragging=false;const speed=state.ball.speed>=.58?'fast':'slow',candidates=state.ball.chasers.map(id=>state.cats.find(c=>c.id===id)).filter(c=>c&&distanceToBall(c)<10);state.ball.speed=0;state.ball.chasers=[];$$('.cat').forEach(el=>el.classList.remove('following-wand','wand-right'));candidates.forEach(cat=>{const start=performance.now();setTimeout(()=>{if(!state.over&&performance.now()-start>=950&&distanceToBall(cat)<10)socialAct(cat,'play',speed)},1000)});if(!candidates.length&&Math.hypot(state.ball.x-73,state.ball.y-38)<8)$('#scratch').classList.add('scratched');setTimeout(()=>$('#scratch').classList.remove('scratched'),700);renderBall()};
}

function updateChasers(){state.ball.chasers=state.cats.filter(cat=>!cat.hidden&&state.ball.speed*({A:1.2,B:.6,C:.1}[cat.personality])>.5).map(cat=>cat.id)}
function chaseBall(){if(!state.ball.dragging)return;updateChasers();state.ball.chasers.forEach(id=>{const cat=state.cats.find(c=>c.id===id);cat.lookRight=state.ball.x>cat.x;cat.lookAngle=Math.max(-8,Math.min(8,(state.ball.y-cat.y)*.35));cat.x+=(state.ball.x-cat.x)*.025;cat.y+=(state.ball.y-cat.y)*.025});resolveCatOverlaps();state.ball.chasers.forEach(id=>{const cat=state.cats.find(c=>c.id===id),el=$(`.cat[data-id="${id}"]`);if(el){el.style.left=`${cat.x}%`;el.style.top=`${cat.y}%`;el.style.setProperty('--look-angle',`${cat.lookAngle}deg`);el.classList.remove('floor-resting','room-sitting','window-sitting','tower-resting');el.classList.add('walking','following-wand');el.classList.toggle('wand-right',cat.lookRight)}})}
function renderBall(){const ball=$('#toyBall');ball.style.left=`${state.ball.x}%`;ball.style.top=`${state.ball.y}%`;ball.style.setProperty('--wand-angle',`${state.ball.angle}deg`);ball.classList.toggle('dragging',state.ball.dragging)}
function distanceToBall(cat){return Math.hypot(cat.x-state.ball.x,cat.y-state.ball.y)}

function bindCats(){
  $$('.cat').forEach(element=>{
    element.onpointerdown=e=>{state.press={id:element.dataset.id,start:performance.now(),pointer:e.pointerId};element.setPointerCapture?.(e.pointerId)};
    element.onpointerup=e=>{if(!state.press||state.press.pointer!==e.pointerId)return;const speed=performance.now()-state.press.start>=520?'slow':'fast',id=state.press.id;state.press=null;state.selected=id;act('pet',speed)};
  });
}

function tick(){
  if(state.over)return;
  state.tick++;
  const cfg=LEVELS[state.level];
  state.cats.forEach(cat=>{
    cat.hunger-=1;
    if(cat.foodBowl>0&&cat.hunger<80&&Math.hypot(cat.x-18,cat.y-50)<13){cat.hunger=Math.min(100,cat.hunger+5);cat.foodBowl=Math.max(0,cat.foodBowl-5)}
    cat.litterClean-=1;
    const isolated=cat.hidden&&nearestDistance(cat)>24;
    const untouchedHighStress=cat.stress>=55&&state.tick-cat.lastPetTick>=1&&cat.touchedUntil<performance.now();
    const timidCalming=cat.personality==='B'&&state.tick-cat.lastPetTick>=2;
    cat.stress+=untouchedHighStress?-7:(isolated||timidCalming?-1:1);
    if(cat.hunger<20||cat.litterClean<30)cat.stress+=2;
    if(cat.spaceUntil>=state.tick){cat.spaceTicks++;if(cat.personality==='A'&&cat.spaceTicks===3)cat.trust-=6}else{cat.spaceTicks=0}
    if(cat.stress>=cfg.hiddenAt)cat.hidden=true;
    if(cat.hidden&&cat.stress<40)cat.hidden=false;
    if(cat.hidden)cat.hiddenTicks++;
    cat.criticalTicks=cat.trust<=10?cat.criticalTicks+1:0;
    cat.emptyTicks=cat.foodBowl<=0?cat.emptyTicks+1:0;cat.bowlZero ||= cat.emptyTicks>=2;cat.litterZero ||= cat.litterClean<=0;
    clampCat(cat);
    moveCat(cat);
    updateLitterVisit(cat);
    if(cat.hunger<20){if(cat.meowSince===null){cat.meowSince=state.tick;cat.timelyRewarded=false}cat.meowUntil=state.tick+1;meow()}else{cat.meowSince=null;cat.timelyRewarded=false}
  });
  resolveCatOverlaps();updateTensions();
  if(state.cats.some(c=>c.trust<=0))return finish();
  render();
}

function act(type,speed){
  if(state.over)return;
  const cat=state.cats.find(c=>c.id===state.selected);
  if(!cat)return react(false);
  if(cat.hidden&&type!=='space')return react(false,cat);
  if(type==='clean'){cat.litterClean=100;cat.litterVisited=false;cat.usingLitterUntil=0;const litter=$('#litter');litter.classList.add('scooping','clean-flash');setTimeout(()=>litter.classList.remove('scooping','clean-flash'),1100);return react(true,cat)}
  if(type==='space'){
    cat.stress-=10;cat.spaceUntil=state.tick+3;cat.windowUntil=state.tick+3;cat.windowFacing=Math.random()<.5?'front':'back';
    if(cat.personality==='C')reward(cat);else react(true,cat);
    if(cat.hidden&&cat.stress<40)cat.hidden=false;
    clampCat(cat);render();return;
  }
  socialAct(cat,type,speed);
}

function sceneAct(type,x,y){
  const nearby=state.cats.filter(c=>(type==='space'||!c.hidden)&&Math.hypot(c.x-x,c.y-y)<15).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];
  if(!nearby)return;
  state.selected=nearby.id;act(type,'slow');
}

function cleanUsedLitter(){
  const cat=state.cats.filter(c=>c.litterVisited&&c.usingLitterUntil===0).sort((a,b)=>a.litterClean-b.litterClean)[0];
  if(!cat)return;
  state.selected=cat.id;act('clean','slow');
}

function updateLitterVisit(cat){
  if(cat.usingLitterUntil>0){
    if(state.tick>=cat.usingLitterUntil){cat.usingLitterUntil=0;cat.litterVisited=true;cat.litterClean=Math.max(0,cat.litterClean-20);cat.x=Math.max(58,cat.x-18);cat.y=61;cat.activity='wander';cat.activityUntil=state.tick+3}
    return;
  }
  if(cat.litterClean<30&&!cat.litterVisited&&!cat.hidden&&Math.hypot(cat.x-77,cat.y-67)<7){cat.usingLitterUntil=state.tick+2;cat.x=77;cat.y=67}
}

function socialAct(cat,type,speed){if(cat.hidden)return react(false,cat);if(type==='play'){cat.stress-=10;cat.trust+=cat.personality==='A'?8:4;cat.positiveUntil=performance.now()+1000;clampCat(cat);react(true,cat);purr();return}if(type==='pet'){cat.lastPetTick=state.tick;if((cat.windowUntil>=state.tick||cat.activity==='window')&&cat.x<25&&cat.y<28)return mismatch(cat)}const tail=tailState(cat);cat.touchedUntil=performance.now()+900;const interrupted=tail==='puffed'||tail==='flick';const matched=!interrupted&&((cat.personality==='A'&&speed==='fast'&&type==='pet')||(cat.personality==='B'&&speed==='slow'&&type==='pet'));if(matched)reward(cat);else mismatch(cat)}

function refillBowl(id){const cat=state.cats.find(c=>c.id===id);if(!cat)return;const bag=$('#foodBags'),bowl=$('#bowl');bag.classList.remove('pouring');void bag.offsetWidth;bag.classList.add('pouring');bowl.classList.add('refilled');setTimeout(()=>{bag.classList.remove('pouring');bowl.classList.remove('refilled')},750);if(cat.foodBowl>=100)return;cat.foodBowl=100;cat.emptyTicks=0;cat.trust+=3;if(cat.hunger<20&&cat.meowSince!==null&&state.tick-cat.meowSince<=2&&!cat.timelyRewarded){cat.trust+=3;cat.timelyRewarded=true}cat.positiveUntil=performance.now()+1000;purr();clampCat(cat);react(true,cat);render()}

function reward(cat){cat.trust+=8;cat.stress-=5;cat.positiveUntil=performance.now()+1000;if(cat.hidden&&cat.stress<40)cat.hidden=false;react(true,cat);clampCat(cat);render();purr()}
function mismatch(cat){cat.trust-=6;cat.stress+=12;cat.retreatUntil=performance.now()+1000;if(cat.stress>=LEVELS[state.level].hiddenAt)cat.hidden=true;moveAway(cat);react(false,cat);clampCat(cat);render()}
function react(good,cat){$('#feedback').className=`feedback ${good?'good':'bad'}`;$('#feedback').innerHTML=`<b>${good?'♥':'×'}</b><p></p>`;if(cat){cat.last=good?'happy':'wrong';setTimeout(()=>{cat.last='';if(!state.over)render()},900)}else render()}

function separate(){
  if(state.over||state.cats.length<2)return react(false);
  const cat=state.cats.find(c=>c.id===state.selected);if(!cat)return react(false);
  const partner=state.cats.filter(c=>c!==cat).reduce((best,c)=>(state.tensions[pairKey(cat,c)]||0)>(state.tensions[pairKey(cat,best)]||0)?c:best);
  const key=pairKey(cat,partner);state.tensions[key]=Math.max(0,state.tensions[key]-30);cat.x=18;partner.x=75;react(true,cat);render();
}

function updateTensions(){
  if(state.level!==3)return;
  for(let i=0;i<state.cats.length;i++)for(let j=i+1;j<state.cats.length;j++){
    const a=state.cats[i],b=state.cats[j],key=pairKey(a,b),close=distance(a,b)<19;
    state.tensions[key]=Math.max(0,(state.tensions[key]||0)+(close&&a.stress>50&&b.stress>50?3:-1));
    if(state.tensions[key]>=80){state.conflicts++;a.trust-=10;b.trust-=10;a.stress+=15;b.stress+=15;state.tensions[key]=0;moveAway(a);moveAway(b);hiss()}
  }
}

function moveCat(cat){
  let target;
  if(cat.windowUntil>=state.tick)target=[20,22];
  else if(cat.hidden)target=[83,31];
  else if(cat.usingLitterUntil>0)target=[77,67];
  else if(cat.litterClean<30&&!cat.litterVisited)target=[77,67];
  else if(cat.hunger<80&&cat.foodBowl>0)target=[18,50];
  else{
    if(state.tick>=cat.activityUntil){const options=['sit','sit','sit','wander','window','tower','floor'];cat.activity=options[Math.floor(Math.random()*options.length)];cat.activityUntil=state.tick+3+Math.floor(Math.random()*4);if(cat.activity==='window')cat.windowFacing=Math.random()<.5?'front':'back'}
    const idx=CAT_TEMPLATES.findIndex(c=>c.id===cat.id);target=cat.activity==='window'?[20,22]:cat.activity==='tower'?[80,9]:cat.activity==='floor'?[35+idx*16,61]:cat.activity==='sit'?[32+idx*22,48+(idx%2)*10]:[27+idx*23,43];
  }
  cat.x+=Math.sign(target[0]-cat.x)*Math.min(5,Math.abs(target[0]-cat.x));cat.y+=Math.sign(target[1]-cat.y)*Math.min(3,Math.abs(target[1]-cat.y));
}
function moveAway(cat){cat.x=cat.x<50?Math.max(7,cat.x-15):Math.min(84,cat.x+15);cat.y=Math.min(68,cat.y+8)}
function resolveCatOverlaps(){for(let i=0;i<state.cats.length;i++)for(let j=i+1;j<state.cats.length;j++){const a=state.cats[i],b=state.cats[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<13){const push=(13-d)/2,nx=d?dx/d:(i%2?1:-1),ny=d?dy/d:.25;a.x=Math.max(7,Math.min(88,a.x-nx*push));b.x=Math.max(7,Math.min(88,b.x+nx*push));a.y=Math.max(8,Math.min(76,a.y-ny*push));b.y=Math.max(8,Math.min(76,b.y+ny*push))}}}

function tailState(cat){
  const now=performance.now(),touched=cat.touchedUntil>now;
  if(cat.stress>=80&&touched)return'puffed';
  if(cat.stress>=60&&!touched)return'flick';
  if(cat.hidden||(cat.stress>=55&&!touched))return'low';
  if(cat.positiveUntil>now)return'quiver';
  const lift=cat.personality==='C'?80:70,wrap=cat.personality==='C'?95:85;
  if(cat.trust>=wrap&&cat.stress<20)return'wrap';
  if(cat.trust>=lift&&cat.stress<40)return'up';
  return'natural';
}

function needsPet(cat){
  if(cat.hidden||cat.usingLitterUntil>0||cat.stress>=55)return false;
  if((cat.windowUntil>=state.tick||cat.activity==='window')&&cat.x<25&&cat.y<28)return false;
  if(cat.personality==='C')return false;
  return cat.personality==='A'?cat.trust<75:cat.trust<65;
}

function animateTails(){
  if(state.over)return;
  chaseBall();
  state.cats.forEach(cat=>{const el=$(`.cat[data-id="${cat.id}"]`);if(!el)return;['puffed','flick','low','quiver','up','wrap','natural'].forEach(s=>el.classList.toggle(`tail-${s}`,tailState(cat)===s))});
  requestAnimationFrame(animateTails);
}

function render(){
  const cfg=LEVELS[state.level];
  $('#dayLabel').textContent=`L${state.level}`;$('#actionsLabel').textContent='';$('#dayProgress').style.width='100%';
  $('#cats').innerHTML=state.cats.map(cat=>{const atWindow=(cat.windowUntil>=state.tick||(!cat.hidden&&cat.activity==='window'))&&cat.x<25&&cat.y<28,atTower=cat.hidden?(cat.x>76&&cat.y<38):cat.activity==='tower'&&cat.x>74&&cat.y<17,onFloor=!cat.hidden&&cat.activity==='floor'&&Math.abs(cat.y-61)<5,isSitting=!cat.hidden&&cat.activity==='sit';return `<button class="cat ${state.selected===cat.id?'selected':''} ${needsPet(cat)?'needs-pet':''} ${cat.hidden?'hiding':''} ${cat.usingLitterUntil>0?'in-litter':''} ${atTower?'tower-resting':''} ${atWindow?`window-sitting facing-${cat.windowFacing}`:''} ${onFloor?'floor-resting':''} ${isSitting?'room-sitting':''} ${cat.last||''} tail-${tailState(cat)}" data-id="${cat.id}" style="--fur:${cat.fur};left:${cat.x}%;top:${cat.y}%"><span class="signal">${cat.hunger<20?'!':cat.positiveUntil>performance.now()?'♥':''}</span><i class="cat-body"></i><i class="cat-head"></i><i class="face">${cat.stress>=60?'×﹏×':cat.trust>=70?'•ᴗ•':'•_•'}</i><i class="tail"></i><span class="cat-name">${cat.name}</span></button>`}).join('');
  bindCats();
  const minBowl=Math.min(...state.cats.map(c=>c.foodBowl)),minLitter=Math.min(...state.cats.map(c=>c.litterClean)),maxTension=Math.max(0,...Object.values(state.tensions));
  $('#bowl').style.setProperty('--level',`${minBowl}%`);$('#bowl').classList.toggle('empty',minBowl<30);
  $('#litter').style.setProperty('--dirt',`${100-minLitter}%`);$('#litter').classList.toggle('dirty',minLitter<30);
  $('#bowl i').innerHTML=state.cats.map(c=>`<em style="--fur:${c.fur};--fill:${c.foodBowl}%"></em>`).join('');
  $('#litter i').innerHTML=state.cats.map(c=>`<em style="--fur:${c.fur};--soil:${100-c.litterClean}%"></em>`).join('');
  const bowlCat=state.cats.filter(c=>c.foodBowl<100).sort((a,b)=>a.foodBowl-b.foodBowl)[0]||state.cats.slice().sort((a,b)=>a.foodBowl-b.foodBowl)[0];
  $('#foodBags').innerHTML=`<button data-id="${bowlCat.id}" aria-label="Pour cat food"></button>`;
  $('#foodBags button').onclick=()=>refillBowl(bowlCat.id);renderBall();
  $('#room').classList.toggle('tense',maxTension>70);
  $('#litter').classList.toggle('cat-using',state.cats.some(c=>c.usingLitterUntil>0));$('#litter').classList.toggle('ready-clean',state.cats.some(c=>c.litterVisited&&c.usingLitterUntil===0));
  $('#scratch').classList.toggle('worn',state.cats.some(c=>c.stress>50));$('#quietCorner').classList.toggle('occupied',state.cats.some(c=>c.hidden));
  $('#catStatusList').innerHTML=state.cats.map(cat=>statusCard(cat)).join('');
  $$('#catStatusList .cat-status').forEach(card=>card.onclick=()=>{state.selected=card.dataset.id;render()});
}

function statusCard(cat){
  const rows=[['HUNGER','',cat.hunger,'metric-hunger'],['STRESS','',cat.stress,'metric-stress'],['LITTER DIRT','',100-cat.litterClean,'metric-litter']];
  return `<button class="cat-status ${state.selected===cat.id?'active':''} ${cat.last==='happy'?'value-up':cat.last==='wrong'?'value-down':''}" data-id="${cat.id}"><header><span class="cat-identity"><i class="cat-avatar"></i><b>${cat.name}</b></span><strong class="affection-value">♥ ${Math.round(cat.trust)}</strong></header>${rows.map(([zh,en,value,type])=>`<div class="status-row ${type}"><label><strong>${zh}</strong><small>${en}</small></label><i><span style="width:${value}%"></span></i></div>`).join('')}</button>`;
}

function finish(){
  if(state.over)return;state.over=true;clearInterval(state.timer);const cfg=LEVELS[state.level];
  const stable=state.cats.every(c=>c.trust>=60&&c.stress<=50&&c.hiddenTicks<=Math.max(1,state.tick*.3)&&c.foodBowl>=40&&c.litterClean>=40&&!c.bowlZero&&!c.litterZero);
  const tensionsSafe=Object.values(state.tensions).every(v=>v<80)&&state.conflicts<=1,win=stable&&tensionsSafe;
  $('#resultEyebrow').textContent=win?'SAFE':'LOST';$('#resultTitle').textContent=win?'♥':'×';$('#resultText').textContent='';
  $('#catResults').innerHTML=state.cats.map(c=>`<div><b>${c.name}</b>${c.trust>=60&&c.stress<=50?'♥':'×'}</div>`).join('');$('#resultModal').classList.remove('hidden');
}

function pairKey(a,b){return[a.id,b.id].sort().join('|')}
function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function nearestDistance(cat){return Math.min(100,...state.cats.filter(c=>c!==cat).map(c=>distance(cat,c)))}
function clampCat(cat){['hunger','trust','stress','foodBowl','litterClean'].forEach(k=>cat[k]=Math.max(0,Math.min(100,cat[k])))}
function tone(freq,duration=.18,type='square'){if(!state.sound)return;try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.025,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+duration);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+duration)}catch(e){}}
function meow(){tone(380,.22,'square')}
function purr(){tone(48,.5,'square')}
function hiss(){tone(110,.35,'sawtooth')}
