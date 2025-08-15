// --- Configuration: list your media files here ---
const mediaFiles = [
  // images
  'assets/media/photo1.jpg',
  'assets/media/photo3.jpg',
  'assets/media/photo4.jpg',
  'assets/media/photo5.jpg',
  'assets/media/photo6.jpg',
  'assets/media/photo7.jpg',
  'assets/media/photo8.jpg',
  'assets/media/photo9.jpg',
  'assets/media/photo10.jpg',
  'assets/media/photo11.jpg',
  'assets/media/photo12.jpg',
  'assets/media/photo14.jpg',
  'assets/media/photo15.jpg',
  'assets/media/photo16.jpg',
  'assets/media/photo17.jpg',
  'assets/media/photo18.jpg',
  'assets/media/photo20.jpg',
  'assets/media/photo21.jpg',
  'assets/media/photo22.jpg',
  'assets/media/photo23.jpg',
  'assets/media/video3.mp4',
  'assets/media/photo24.jpg',
  'assets/media/photo25.jpg',
  'assets/media/photo26.jpg',
  'assets/media/photo27.jpg',
  'assets/media/photo28.jpg',
  'assets/media/photo29.jpg',
  'assets/media/video4.mp4',
  'assets/media/photo30.jpg',
  'assets/media/photo31.jpg',
  'assets/media/photo32.jpg',
  'assets/media/photo33.jpg',

];

// --- Slideshow logic ---
const slideshow = document.getElementById('slideshow');
const slides = [];

function createSlide(path){
  const slide = document.createElement('div');
  slide.className = 'slide';
  if(path.match(/\.(mp4|webm|ogg)$/i)){
    const v = document.createElement('video');
    v.src = path;
    v.playsInline = true;
    v.loop = true;
    v.muted = true;
    v.autoplay = true;
    slide.appendChild(v);
  }else{
    const img = document.createElement('img');
    img.src = path;
    img.alt = 'memory';
    slide.appendChild(img);
  }
  slideshow.appendChild(slide);
  slides.push(slide);
}

mediaFiles.forEach(createSlide);
let current = 0, timer=null, interval=3500;
function show(i){
  slides.forEach(s => s.classList.remove('active'));
  current = (i+slides.length)%slides.length;
  slides[current].classList.add('active');
}
function next(){ show(current+1); }
function prev(){ show(current-1); }
function play(){ stop(); timer = setInterval(next, interval); }
function stop(){ if(timer){ clearInterval(timer); timer=null; } }

document.getElementById('next').addEventListener('click', ()=>{ next(); });
document.getElementById('prev').addEventListener('click', ()=>{ prev(); });
document.getElementById('pause').addEventListener('click', (e)=>{
  if(timer){ stop(); e.target.textContent='▶️ Play'; }
  else { play(); e.target.textContent='⏸️ Pause'; }
});

// Start
show(0); play();

// --- Message area ---
const msgInput = document.getElementById('messageInput');
const msgDisplay = document.getElementById('messageDisplay');
const saveBtn = document.getElementById('saveMessage');
const showBtn = document.getElementById('showMessage');
const STORAGE_KEY = 'bd_msg_v1';

saveBtn.addEventListener('click', ()=>{
  localStorage.setItem(STORAGE_KEY, msgInput.value);
  saveBtn.textContent='Saved ✔';
  setTimeout(()=> saveBtn.textContent='Save Message 💌', 1200);
});

showBtn.addEventListener('click', ()=>{
  msgDisplay.innerText = msgInput.value.trim() || 'No message yet — write something sweet!';
  msgDisplay.classList.remove('hidden');
});

window.addEventListener('DOMContentLoaded', ()=>{
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){ msgInput.value = saved; }
});

// --- Confetti animation (vanilla canvas) ---
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function launchConfetti(){
  const count = 160;
  for(let i=0;i<count;i++){
    confettiPieces.push({
      x: Math.random()*confettiCanvas.width,
      y: Math.random()*-confettiCanvas.height/2,
      r: Math.random()*6+4,
      vx: (Math.random()-0.5)*2,
      vy: Math.random()*3+2,
      rot: Math.random()*Math.PI,
      vr: (Math.random()-0.5)*0.2
    });
  }
  document.getElementById('confetti-audio').currentTime=0;
  document.getElementById('confetti-audio').play();
}
function tick(){
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height+20);
  for(const p of confettiPieces){
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    drawPiece(p);
  }
  requestAnimationFrame(tick);
}
function drawPiece(p){
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  // alternating neon colors
  const neon = ['#ff3df2','#26ffff','#ffe066','#3df26f','#ff6b6b'];
  ctx.fillStyle = neon[Math.floor((p.x+p.y)%neon.length)];
  ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r);
  ctx.restore();
}
tick();

document.getElementById('playConfetti').addEventListener('click', launchConfetti);

// --- Balloons ---
const layer = document.getElementById('balloon-layer');
function spawnBalloons(n=12){
  const audio = document.getElementById('balloon-audio');
  audio.currentTime = 0; audio.play();
  for(let i=0;i<n;i++){
    const b = document.createElement('div');
    b.className = 'balloon';
    const hue = Math.floor(Math.random()*360);
    b.style.background = `hsl(${hue} 100% 55%)`;
    const left = Math.random()*100;
    b.style.left = left+'vw';
    const duration = 10 + Math.random()*10;
    b.style.animationDuration = duration+'s';
    // sway
    const offset = (Math.random()*2-1)*30;
    b.animate([{transform:`translate(${offset}px,0)`},{transform:`translate(${-offset}px,-100vh)`}], {duration: duration*1000, iterations:1});
    layer.appendChild(b);
    setTimeout(()=> b.remove(), duration*1000);
  }
}
document.getElementById('spawnBalloons').addEventListener('click', ()=> spawnBalloons());

// --- Music toggle (reuses small sound as placeholder) ---
const bgm = document.getElementById('bgm');
let musicOn=false;
document.getElementById('toggleMusic').addEventListener('click', ()=>{
  musicOn = !musicOn;
  if(musicOn){ bgm.loop=true; bgm.play(); }
  else{ bgm.pause(); }
});
