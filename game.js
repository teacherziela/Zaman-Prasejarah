const video=document.querySelector('#video'),canvas=document.querySelector('#canvas'),ctx=canvas.getContext('2d');
const card=document.querySelector('#objectCard'),cursor=document.querySelector('#cursor'),feedback=document.querySelector('#feedback');
const scoreEl=document.querySelector('#score'),livesEl=document.querySelector('#lives');
const items=[
 {e:'🪨',n:'Peralatan batu ringkas',era:'Paleolitik'},
 {e:'🔥',n:'Kehidupan nomad',era:'Paleolitik'},
 {e:'🏹',n:'Alat memburu yang semakin baik',era:'Mesolitik'},
 {e:'🐟',n:'Menangkap ikan & mengumpul makanan',era:'Mesolitik'},
 {e:'🏺',n:'Tembikar',era:'Neolitik'},
 {e:'🌾',n:'Pertanian & penternakan',era:'Neolitik'},
 {e:'🏘️',n:'Petempatan kekal',era:'Neolitik'},
 {e:'⚔️',n:'Peralatan daripada logam',era:'Logam'},
 {e:'🔨',n:'Penggunaan gangsa dan besi',era:'Logam'}
].sort(()=>Math.random()-.5);
let index=0,score=0,lives=3,held=false,wasPinch=false,demo=false,active=false;
function size(){canvas.width=innerWidth;canvas.height=innerHeight}addEventListener('resize',size);size();
function load(){if(index>=items.length||lives<=0)return finish();let x=items[index];emoji.textContent=x.e;objectName.textContent=x.n;card.style.left='50%';card.style.top='39%';card.style.transform='translate(-50%,-50%)'}
function pointIn(el,x,y){let r=el.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom}
function drop(x,y){if(!held)return;held=false;let target=[...document.querySelectorAll('.portal')].find(p=>pointIn(p,x,y));if(!target){card.style.left='50%';card.style.top='39%';return}
 if(target.dataset.era===items[index].era){score+=100;scoreEl.textContent=score;flash('✨ TEPAT! +100','ok');index++;setTimeout(load,650)}
 else{lives--;livesEl.textContent='❤️'.repeat(lives)+'🖤'.repeat(3-lives);flash('💥 SALAH ZAMAN!','bad');setTimeout(()=>{card.style.left='50%';card.style.top='39%';if(lives<=0)finish()},650)}}
function flash(t){feedback.textContent=t;setTimeout(()=>feedback.textContent='',600)}
function moveHand(x,y,pinch){cursor.style.display='block';cursor.style.left=x+'px';cursor.style.top=y+'px';cursor.textContent=pinch?'✊':'✋';
 document.querySelectorAll('.portal').forEach(p=>p.classList.toggle('hot',held&&pointIn(p,x,y)));
 if(pinch&&!wasPinch&&pointIn(card,x,y))held=true;
 if(held){card.style.left=x+'px';card.style.top=y+'px';card.style.transform='translate(-50%,-50%) scale(.9)'}
 if(!pinch&&wasPinch)drop(x,y);wasPinch=pinch}
function finish(){active=false;document.querySelector('#end').classList.remove('hidden');finalScore.textContent=score+' MATA';rank.textContent=score>=700?'🏆 PAKAR PRASEJARAH!':score>=400?'⭐ PENJELAJAH SEJARAH!':'🗿 Cuba lagi untuk kuasai garis masa.'}
async function cameraMode(){document.querySelector('#welcome').classList.add('hidden');active=true;load();
 const hands=new Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`});hands.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:.55,minTrackingConfidence:.55});
 hands.onResults(r=>{ctx.clearRect(0,0,canvas.width,canvas.height);if(!active||!r.multiHandLandmarks?.length)return;let l=r.multiHandLandmarks[0],ix=(1-l[8].x)*innerWidth,iy=l[8].y*innerHeight,tx=(1-l[4].x)*innerWidth,ty=l[4].y*innerHeight;let d=Math.hypot(ix-tx,iy-ty);moveHand(ix,iy,d<55)});
 try{const cam=new Camera(video,{onFrame:async()=>await hands.send({image:video}),width:1280,height:720});cam.start()}catch(e){alert('Kamera tidak dapat dibuka. Cuba MOD DEMO dahulu.');location.reload()}}
function demoMode(){demo=true;active=true;document.querySelector('#welcome').classList.add('hidden');video.style.display='none';load();cursor.style.display='block';
 addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';if(held){card.style.left=e.clientX+'px';card.style.top=e.clientY+'px'}});
 addEventListener('mousedown',e=>{if(pointIn(card,e.clientX,e.clientY))held=true;cursor.textContent='✊'});addEventListener('mouseup',e=>{cursor.textContent='✋';drop(e.clientX,e.clientY)})}
start.onclick=cameraMode;mouse.onclick=demoMode;