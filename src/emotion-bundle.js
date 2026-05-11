import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ==================== 沙具数据 ====================
const ITEMS_DATA = [
  { id:'sun', icon:'☀️', name:'太阳', color:0xFFD700, emissive:0xFFA000,
    meaning:'象征积极情绪与希望',
    shortTip:'☀️ 开心的时候，大脑会释放多巴胺——你身体自带的「快乐奖杯」',
    tip:'每天给自己一个「小成就清单」—— 可以是今天听懂了一道数学题、主动和同学打了招呼、或者按时完成了作业。青春期的每一次小进步，都值得被看见和肯定。' },
  { id:'cloud', icon:'🌧️', name:'乌云', color:0x7986CB, emissive:0x5C6BC0,
    meaning:'象征负面情绪与压力',
    shortTip:'🌧️ 情绪像过山车很正常。试试「5-4-3-2-1」着陆法，把大脑拉回当下',
    tip:'青春期情绪像过山车很正常！试试「5-4-3-2-1」着陆法：说出你看到的5样东西、摸到的4样、听到的3样、闻到的2样、尝到的1样。这能帮你从情绪风暴中回到当下。' },
  { id:'house', icon:'🏠', name:'小屋', color:0xFF8A80, emissive:0xFF5252,
    meaning:'象征安全感与避风港',
    shortTip:'🏠 深呼吸三次——你的身体就是随身携带的「安全角」',
    tip:'青春期的你，需要一个属于自己的「安全角」。可以是你房间的某个角落，摆上你喜欢的抱枕、耳机、一本日记。当感觉被全世界不理解时，去那里待10分钟——和自己待在一起，就是最好的充电。' },
  { id:'tree', icon:'🌳', name:'大树', color:0x69F0AE, emissive:0x00E676,
    meaning:'象征成长与韧性',
    shortTip:'🌳 每一次挫折，都是在给你的「心理肌肉」增加力量',
    tip:'考试没考好？被老师或父母批评了？记住：你现在遇到的每一个挫折，都是在给你的「心理肌肉」增加力量。问自己：「这件事教会了我什么？一个月后回头看，它还会这么重要吗？」' },
  { id:'bridge', icon:'🌉', name:'桥梁', color:0xCE93D8, emissive:0xBA68C8,
    meaning:'象征沟通与求助',
    shortTip:'🌉 试试「我句式」：我感到……是因为……我希望……',
    tip:'觉得没人理解你？试试「我句式」跟父母或朋友沟通：「我感到……是因为……我希望……」。比如：「我感到很沮丧，是因为我觉得你们只关心成绩，我希望你们也能听听我的想法。」表达真实感受不是顶嘴，而是长大的标志。' },
  { id:'pillow', icon:'🧸', name:'抱枕', color:0xF48FB1, emissive:0xEC407A,
    meaning:'象征自我安抚与关爱',
    shortTip:'🧸 你觉得「不够好」的时候，把安慰朋友的话，说给自己听',
    tip:'青春期很容易陷入自我否定。当你觉得自己「不够好」时，试试「写给好朋友的一封信」—— 你最好的朋友正处于你所经历的一切，你会对他说什么？现在，把这句话说给自己听。自我关怀，是青春期最温柔的铠甲。' },
  // 新增沙具 v4.0
  { id:'mirror', icon:'🪞', name:'镜子', color:0xFFAB91, emissive:0xFF8A65,
    meaning:'象征自我认同与自我认识',
    shortTip:'🪞 你喜欢镜子里的自己吗？青春期最难的功课，是学会和「自己」做朋友',
    tip:'照镜子的时候，你是不是总盯着自己不满意的地方看？试试「三件喜欢的事」练习：每天对着镜子说出三个你喜欢自己的地方——可以是你今天帮助了同学、你的眼睛很漂亮、或者你坚持跑完了800米。这不是自恋，这是自我关怀的开始。' },
  { id:'compass', icon:'🧭', name:'指南针', color:0x81C784, emissive:0x66BB6A,
    meaning:'象征方向感与目标感',
    shortTip:'🧭 不知道该往哪里走的时候，停一下比乱走更重要',
    tip:'「我不知道将来想做什么」——这可能是青春期最常听到的一句话。没有关系！指南针不需要知道目的地，它只需要知道「现在往哪个方向是对的」。试着写下三个问题：① 做什么事情会让你忘记时间？② 你羡慕什么样的人？③ 如果不会失败，你最想尝试什么？答案不需要完美，但你会在其中找到属于你的方向。' },
  { id:'chains', icon:'🔗', name:'锁链', color:0x90A4AE, emissive:0x78909C,
    meaning:'象征束缚感与压力',
    shortTip:'🔗 感觉透不过气的时候，把你的压力「画」出来——它会变小',
    tip:'有压力是正常的，但被压力淹没不是。试试「压力泡泡法」：拿出一张纸，画几个圆圈，在每个圈里写一个让你有压力的事情（考试、父母期待、同学关系……）。然后看着这些圈圈问自己：① 这些事里哪些是我能控制的？② 哪些是别人该负责的？③ 如果今天只能解决一个，我会选哪个？把能控制的圈起来，其他的——试着放一放。' },
  { id:'dove', icon:'🕊', name:'鸽子', color:0xB39DDB, emissive:0x9575CD,
    meaning:'象征自由与和解',
    shortTip:'🕊 原谅不是忘记，而是选择不再背着昨天的情绪继续走',
    tip:'和父母吵了一架？和朋友闹了矛盾？「和解」不是认输，是选择让自己自由。试着写一封「不寄出的信」：把所有的委屈、愤怒、不理解写下来，写完读一遍——不是为了寄出去，是为了把堵在心里的东西清空。然后问问自己：如果是我最好的朋友遇到这件事，我会建议他怎么做？' },
  { id:'flame', icon:'🔥', name:'火焰', color:0xFF7043, emissive:0xFF5722,
    meaning:'象征愤怒与能量',
    shortTip:'🔥 愤怒不是坏东西——它在告诉你「这件事对我很重要」',
    tip:'当你想摔东西、想大喊、想哭的时候——先停下来，做这个「7秒灭火法」：① 深呼吸（4秒）② 在心里默念「我在生气，这很正常」（3秒）。愤怒就像火，小火可以取暖（保护自己），大火才会烧毁一切。问自己：「我真正生气的，是眼前这件事，还是别的什么？」' },
  { id:'gem', icon:'💎', name:'宝石', color:0xCE93D8, emissive:0xBA68C8,
    meaning:'象征自我价值',
    shortTip:'💎 你的价值不取决于成绩单上的分数，就像钻石的价格不取决于它放在什么盒子里',
    tip:'「我觉得自己什么都做不好」「别人都比我强」「我配不上……」。这些想法有个名字叫「冒名顶替综合症」——就是总觉得自己不够好，即使别人觉得你很好。试试「证据收集法」：准备一个本子，每天记录一件「我做得还不错的事」（哪怕只是今天按时起床了）。一周后翻翻看——那些你觉得自己"不够好"的证据，真的比这些多吗？' }
];
const MOOD_COLORS = { happy:0xFFD700, calm:0x87CEEB, sad:0xA9A9A9, angry:0xFF6B6B };
const MOOD_EMOJIS = { happy:'😊', calm:'😌', sad:'😢', angry:'😤' };
const MOOD_NAMES = { happy:'开心', calm:'平静', sad:'难过', angry:'生气' };
const MOOD_LABELS = { happy:'🌻', calm:'💙', sad:'🩶', angry:'❤️' };
const STORAGE_KEY = 'hermes_garden_diary';

// ==================== 场景 ====================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfc9a9e);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(9, 7, 11);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

// 后处理
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.25, 0.4, 0.1);
composer.addPass(bloomPass);

// CSS2D
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position='absolute';labelRenderer.domElement.style.top='0';labelRenderer.domElement.style.pointerEvents='none';
container.appendChild(labelRenderer.domElement);

// 相机控制
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.minDistance = 4; controls.maxDistance = 22;
controls.maxPolarAngle = Math.PI / 2.2; controls.target.set(0, 0.3, 0);

// ==================== 灯光 ====================
const ambient = new THREE.AmbientLight(0xffe0e0, 0.35);
scene.add(ambient);
const hemi = new THREE.HemisphereLight(0xffb3c6, 0x90EE90, 0.55);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffe4b5, 1.4);
dir.position.set(6,12,4); dir.castShadow=true;
dir.shadow.mapSize.width=2048; dir.shadow.mapSize.height=2048;
dir.shadow.camera.near=0.5; dir.shadow.camera.far=30;
dir.shadow.camera.left=-15; dir.shadow.camera.right=15;
dir.shadow.camera.top=15; dir.shadow.camera.bottom=-15;
scene.add(dir);
const rim = new THREE.DirectionalLight(0xd500f9, 0.4);
rim.position.set(-4,6,-6); scene.add(rim);
const fill = new THREE.DirectionalLight(0xffab91, 0.35);
fill.position.set(-3,4,5); scene.add(fill);

// ==================== 地面 ====================
function makeGroundTex(){
  const c=document.createElement('canvas');c.width=512;c.height=512;
  const ctx=c.getContext('2d');
  const g=ctx.createRadialGradient(256,256,0,256,256,256);
  g.addColorStop(0,'#b2df8a');g.addColorStop(0.6,'#8bc34a');g.addColorStop(1,'#7cb342');
  ctx.fillStyle=g;ctx.fillRect(0,0,512,512);
  for(let i=0;i<60;i++){
    const fx=Math.random()*512,fy=Math.random()*512,s=2+Math.random()*4;
    ctx.beginPath();ctx.arc(fx,fy,s,0,Math.PI*2);
    ctx.fillStyle=`hsla(${80+Math.random()*30},60%,75%,0.3)`;ctx.fill();
    ctx.beginPath();ctx.arc(fx,fy,s*0.3,0,Math.PI*2);
    ctx.fillStyle=`hsla(${100+Math.random()*30},70%,85%,0.5)`;ctx.fill();
  }
  ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
  for(let i=0;i<32;i++){const p=i*16;ctx.beginPath();ctx.moveTo(p,0);ctx.lineTo(p,512);ctx.stroke();ctx.beginPath();ctx.moveTo(0,p);ctx.lineTo(512,p);ctx.stroke()}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);return t;
}
const ground=new THREE.Mesh(new THREE.CircleGeometry(14,64),new THREE.MeshStandardMaterial({map:makeGroundTex(),roughness:0.85,metalness:0}));
ground.rotation.x=-Math.PI/2;ground.position.y=-0.05;ground.receiveShadow=true;scene.add(ground);

// ==================== 粒子 ====================
const PC=200,pGeom=new THREE.BufferGeometry(),pPos=new Float32Array(PC*3),pSizes=new Float32Array(PC),pOff=new Float32Array(PC);
for(let i=0;i<PC;i++){const a=Math.random()*Math.PI*2,r=1+Math.random()*6;pPos[i*3]=Math.cos(a)*r;pPos[i*3+1]=0.5+Math.random()*3;pPos[i*3+2]=Math.sin(a)*r;pSizes[i]=0.03+Math.random()*0.06;pOff[i]=Math.random()*Math.PI*2}
pGeom.setAttribute('position',new THREE.BufferAttribute(pPos,3));pGeom.setAttribute('size',new THREE.BufferAttribute(pSizes,1));
const pc=document.createElement('canvas');pc.width=32;pc.height=32;
const pctx=pc.getContext('2d'),pg=pctx.createRadialGradient(16,16,0,16,16,16);
pg.addColorStop(0,'rgba(255,255,255,1)');pg.addColorStop(0.3,'rgba(255,215,0,0.8)');pg.addColorStop(1,'rgba(255,215,0,0)');
pctx.fillStyle=pg;pctx.fillRect(0,0,32,32);
const particles=new THREE.Points(pGeom,new THREE.PointsMaterial({size:0.15,map:new THREE.CanvasTexture(pc),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.7,color:0xffd54f}));
scene.add(particles);

// ==================== 沙具系统 ====================
const sandObjects=[],sandGroup=new THREE.Group();scene.add(sandGroup);
let floatTime=0;

function makeLabel(text, bg='rgba(255,255,255,0.85)'){
  const d=document.createElement('div');d.textContent=text;
  d.style.cssText=`background:${bg};backdrop-filter:blur(6px);color:#5D4037;font-size:13px;padding:4px 12px;border-radius:20px;font-family:'ZCOOL KuaiLe','PingFang SC',sans-serif;pointer-events:none;user-select:none;white-space:nowrap;border:1px solid rgba(255,255,255,0.5);box-shadow:0 4px 12px rgba(0,0,0,0.08);letter-spacing:1px`;
  return new CSS2DObject(d);
}

function buildMesh(data){
  const g=new THREE.Group(),c=data.color,e=data.emissive||c;
  switch(data.id){
    case'sun':{
      const s=new THREE.Mesh(new THREE.SphereGeometry(0.5,20,20),new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.25,roughness:0.25,metalness:0.1}));
      s.position.y=0.5;s.castShadow=true;g.add(s);
      const gl=new THREE.Mesh(new THREE.RingGeometry(0.55,0.72,24),new THREE.MeshBasicMaterial({color:0xFFF176,transparent:true,opacity:0.15,side:THREE.DoubleSide}));
      gl.position.y=0.5;gl.rotation.x=-Math.PI/2;g.add(gl);
      for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2,r=new THREE.Mesh(new THREE.ConeGeometry(0.07,0.35,6),new THREE.MeshStandardMaterial({color:0xFFF176,emissive:0xFFD700,emissiveIntensity:0.15}));r.position.set(Math.cos(a)*0.85,0.5+Math.sin(a)*0.3,Math.sin(a)*0.85);r.rotation.x=Math.PI/2;r.rotation.z=-a;g.add(r)}
      break;
    }
    case'cloud':{
      const m=new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.1,roughness:0.5});
      const p1=new THREE.Mesh(new THREE.SphereGeometry(0.45,14,14),m);p1.position.set(-0.4,0.55,0);p1.castShadow=true;g.add(p1);
      const p2=new THREE.Mesh(new THREE.SphereGeometry(0.55,14,14),m);p2.position.set(0.2,0.7,0);p2.castShadow=true;g.add(p2);
      const p3=new THREE.Mesh(new THREE.SphereGeometry(0.38,14,14),m);p3.position.set(0.6,0.48,0);p3.castShadow=true;g.add(p3);
      const rm=new THREE.MeshStandardMaterial({color:0x90CAF9,emissive:0x64B5F6,emissiveIntensity:0.1,transparent:true,opacity:0.5});
      for(let i=0;i<6;i++){const d=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.03,0.1,4),rm);d.position.set(-0.3+Math.random()*0.8,0.08-Math.random()*0.12,0.15-Math.random()*0.3);d.rotation.x=0.1;g.add(d)}
      break;
    }
    case'house':{
      const wm=new THREE.MeshStandardMaterial({color:c,roughness:0.4,emissive:e,emissiveIntensity:0.05});
      const w=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.5,0.8),wm);w.position.y=0.25;w.castShadow=true;g.add(w);
      const rm=new THREE.MeshStandardMaterial({color:0xFF6B6B,emissive:0xFF1744,emissiveIntensity:0.05,roughness:0.3});
      const r=new THREE.Mesh(new THREE.ConeGeometry(0.62,0.38,4),rm);r.position.y=0.68;r.rotation.y=Math.PI/4;r.castShadow=true;g.add(r);
      const dm=new THREE.MeshStandardMaterial({color:0x8D6E63});const d=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.25,0.04),dm);d.position.set(0,0.15,0.41);g.add(d);
      const wim=new THREE.MeshStandardMaterial({color:0xBBDEFB,emissive:0x90CAF9,emissiveIntensity:0.15});
      const w1=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.12,0.04),wim);w1.position.set(0.25,0.35,0.41);g.add(w1);
      const w2=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.12,0.04),wim);w2.position.set(-0.25,0.35,0.41);g.add(w2);
      break;
    }
    case'tree':{
      const tm=new THREE.MeshStandardMaterial({color:0x8D6E63,roughness:0.8});const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.14,0.5,8),tm);tr.position.y=0.25;tr.castShadow=true;g.add(tr);
      const cm=new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.1,roughness:0.4});
      const cr=new THREE.Mesh(new THREE.SphereGeometry(0.42,14,14),cm);cr.position.y=0.72;cr.castShadow=true;g.add(cr);
      const cr2=new THREE.Mesh(new THREE.SphereGeometry(0.32,12,12),cm);cr2.position.set(0.22,0.58,0.15);cr2.castShadow=true;g.add(cr2);
      const cr3=new THREE.Mesh(new THREE.SphereGeometry(0.28,12,12),cm);cr3.position.set(-0.2,0.55,-0.12);cr3.castShadow=true;g.add(cr3);
      const am=new THREE.MeshStandardMaterial({color:0xFF5252,emissive:0xFF1744,emissiveIntensity:0.1});
      for(let i=0;i<3;i++){const a=new THREE.Mesh(new THREE.SphereGeometry(0.04,6,6),am);const aa=Math.random()*Math.PI*2;a.position.set(Math.cos(aa)*0.25,0.65+Math.random()*0.15,Math.sin(aa)*0.25);g.add(a)}
      break;
    }
    case'bridge':{
      const bm=new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.05,roughness:0.5,metalness:0.1});
      const ar=new THREE.Mesh(new THREE.TorusGeometry(0.52,0.06,10,18,Math.PI),bm);ar.position.y=0.38;ar.castShadow=true;g.add(ar);
      const pm=new THREE.MeshStandardMaterial({color:0xD7CCC8,roughness:0.9});const p=new THREE.Mesh(new THREE.BoxGeometry(0.72,0.03,0.22),pm);p.position.y=0.015;g.add(p);
      const plm=new THREE.MeshStandardMaterial({color:0xCE93D8,emissive:0xCE93D8,emissiveIntensity:0.05});
      const pL=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.05,0.08,8),plm);pL.position.set(-0.42,0.04,0);g.add(pL);
      const pR=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.05,0.08,8),plm);pR.position.set(0.42,0.04,0);g.add(pR);
      const lm=new THREE.MeshStandardMaterial({color:0xFFD54F,emissive:0xFFC107,emissiveIntensity:0.3});
      const lL=new THREE.Mesh(new THREE.SphereGeometry(0.05,8,8),lm);lL.position.set(-0.42,0.5,0);g.add(lL);
      const lR=new THREE.Mesh(new THREE.SphereGeometry(0.05,8,8),lm);lR.position.set(0.42,0.5,0);g.add(lR);
      break;
    }
    case'pillow':{
      const pm=new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.08,roughness:0.5});
      const p=new THREE.Mesh(new THREE.SphereGeometry(0.4,18,18),pm);p.scale.set(1,0.55,0.85);p.position.y=0.22;p.castShadow=true;g.add(p);
      const hm=new THREE.MeshStandardMaterial({color:0xFF80AB,emissive:0xFF4081,emissiveIntensity:0.2});
      for(let i=0;i<4;i++){const a=(i/4)*Math.PI*2+0.3;const h=new THREE.Mesh(new THREE.SphereGeometry(0.05,6,6),hm);h.position.set(Math.cos(a)*0.2,0.3,Math.sin(a)*0.2);g.add(h)}
      const sm=new THREE.MeshStandardMaterial({color:0xFFD700,emissive:0xFFC107,emissiveIntensity:0.3});
      const st=new THREE.Mesh(new THREE.OctahedronGeometry(0.06),sm);st.position.set(0,0.42,0);st.rotation.y=Math.PI/4;g.add(st);
      break;
    }
    case'mirror':{
      const fm=new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.05,roughness:0.3,metalness:0.2});
      const f=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.55,0.08),fm);f.position.y=0.28;f.castShadow=true;g.add(f);
      const rm=new THREE.MeshStandardMaterial({color:0xBBDEFB,emissive:0x90CAF9,emissiveIntensity:0.2,metalness:0.5,roughness:0.1});
      const r=new THREE.Mesh(new THREE.BoxGeometry(0.33,0.43,0.04),rm);r.position.set(0,0.28,0.06);g.add(r);
      const dm=new THREE.MeshStandardMaterial({color:0x8D6E63});
      const d=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.06,0.06,6),dm);d.position.set(0,0.03,0);g.add(d);
      break;
    }
    case'compass':{
      const bm=new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.05,roughness:0.3,metalness:0.1});
      const b=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.35,0.06,20),bm);b.position.y=0.03;b.castShadow=true;g.add(b);
      const dm2=new THREE.MeshStandardMaterial({color:0xFFF176,emissive:0xFFD700,emissiveIntensity:0.2});
      const d2=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.22,4),dm2);d2.position.set(0,0.17,0);d2.rotation.z=Math.PI/4;d2.castShadow=true;g.add(d2);
      const dm3=new THREE.MeshStandardMaterial({color:0x81C784});
      const d3=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.18,4),dm3);
      d3.position.set(0,0.14,0);d3.rotation.z=-Math.PI/4;d3.rotation.y=Math.PI;g.add(d3);
      const cm=new THREE.MeshStandardMaterial({color:0xFF6B6B});
      const ct2=new THREE.Mesh(new THREE.SphereGeometry(0.03,6,6),cm);ct2.position.set(0,0.06,0);g.add(ct2);
      break;
    }
    case'chains':{
      const cm2=new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.05,roughness:0.5,metalness:0.3});
      const c1=new THREE.Mesh(new THREE.TorusGeometry(0.15,0.04,8,12),cm2);c1.position.set(-0.1,0.35,0);c1.rotation.x=Math.PI/2;c1.castShadow=true;g.add(c1);
      const c2=new THREE.Mesh(new THREE.TorusGeometry(0.12,0.035,8,10),cm2);c2.position.set(0.1,0.2,0);c2.rotation.x=Math.PI/3;c2.castShadow=true;g.add(c2);
      const c3=new THREE.Mesh(new THREE.TorusGeometry(0.1,0.03,8,8),cm2);c3.position.set(-0.05,0.05,0);c3.rotation.x=Math.PI/4;c3.castShadow=true;g.add(c3);
      break;
    }
    case'dove':{
      const dm4=new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.05,roughness:0.4});
      const body=new THREE.Mesh(new THREE.SphereGeometry(0.25,12,12),dm4);body.scale.set(1,0.6,0.7);body.position.y=0.3;body.castShadow=true;g.add(body);
      const wm2=new THREE.MeshStandardMaterial({color:0xD1C4E9,emissive:0xB39DDB,emissiveIntensity:0.05,roughness:0.4});
      const wL=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,8),wm2);wL.scale.set(0.3,1,0.5);wL.position.set(-0.25,0.4,0);g.add(wL);
      const wR=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,8),wm2);wR.scale.set(0.3,1,0.5);wR.position.set(0.25,0.4,0);g.add(wR);
      const ym=new THREE.MeshStandardMaterial({color:0xFFD54F,emissive:0xFFC107,emissiveIntensity:0.2});
      const y=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.08,6),ym);y.position.set(0,0.15,0.3);y.rotation.x=0.2;g.add(y);
      break;
    }
    case'flame':{
      const fm2=new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.25,roughness:0.2});
      const f1=new THREE.Mesh(new THREE.ConeGeometry(0.2,0.5,8),fm2);f1.position.y=0.25;f1.castShadow=true;g.add(f1);
      const fm3=new THREE.MeshStandardMaterial({color:0xFFAB40,emissive:0xFFA000,emissiveIntensity:0.3,roughness:0.2});
      const f2=new THREE.Mesh(new THREE.ConeGeometry(0.14,0.35,6),fm3);f2.position.set(0.05,0.45,0.03);f2.castShadow=true;g.add(f2);
      const fm4=new THREE.MeshStandardMaterial({color:0xFFF176,emissive:0xFFD700,emissiveIntensity:0.4,roughness:0.1});
      const f3=new THREE.Mesh(new THREE.ConeGeometry(0.07,0.2,6),fm4);f3.position.set(0.02,0.62,0);g.add(f3);
      const lm2=new THREE.MeshStandardMaterial({color:0x8D6E63,roughness:0.8});
      const l=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.1,0.12,6),lm2);l.position.y=0.06;g.add(l);
      break;
    }
    case'gem':{
      const gm=new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:0.2,roughness:0.1,metalness:0.3});
      const ge=new THREE.Mesh(new THREE.OctahedronGeometry(0.28),gm);ge.position.y=0.35;ge.castShadow=true;g.add(ge);
      const gm2=new THREE.MeshStandardMaterial({color:0xFFF176,emissive:0xFFD700,emissiveIntensity:0.3});
      const gl2=new THREE.Mesh(new THREE.OctahedronGeometry(0.12),gm2);gl2.position.set(0,0.55,0);gl2.scale.set(0.5,1,0.5);g.add(gl2);
      const pm2=new THREE.MeshStandardMaterial({color:0x8D6E63,roughness:0.8});
      const p2=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.06,0.04,6),pm2);p2.position.y=0.02;g.add(p2);
      break;
    }
  }
  return g;
}

function placeItem(data, x, z, animateIn=false){
  const mesh=buildMesh(data);mesh.position.set(x,0,z);mesh.rotation.y=Math.random()*Math.PI*2;
  if(animateIn)mesh.scale.set(0,0,0);
  sandGroup.add(mesh);
  const label=makeLabel(`${data.icon} ${data.name}`);label.position.set(x,1.3,z);
  sandGroup.add(label);
  const obj={mesh,label,data,floatOffset:Math.random()*Math.PI*2,position:new THREE.Vector3(x,0,z),isFlower:false};
  sandObjects.push(obj);
  if(animateIn){const st=performance.now();function pa(t){const tt=Math.min((t-st)/400,1),e=1-Math.pow(1-tt,3);mesh.scale.setScalar(e);mesh.position.y=Math.sin(e*Math.PI)*0.3;if(tt<1)requestAnimationFrame(pa);else{mesh.position.y=0;mesh.scale.set(1,1,1)}}requestAnimationFrame(pa)}
  return obj;
}

const initPos=[];for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2-Math.PI/12+(Math.random()-0.5)*0.3,d=2+Math.random()*2.5;initPos.push([Math.cos(a)*d,Math.sin(a)*d])}
ITEMS_DATA.forEach((d,i)=>{if(i<initPos.length)placeItem(d,initPos[i][0],initPos[i][1])});

// ==================== 拖拽系统 ====================
const groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0.05);
const dragOffset=new THREE.Vector3();
let isDragging=false,dragObj=null,dragStartPos=new THREE.Vector2();
const dragThreshold=5; // pixels to distinguish click vs drag
let dragMoved=false;

function getGroundIntersect(event){
  const rect=renderer.domElement.getBoundingClientRect();
  const mx=((event.clientX-rect.left)/rect.width)*2-1;
  const my=-((event.clientY-rect.top)/rect.height)*2+1;
  const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(mx,my),camera);
  const pt=new THREE.Vector3();ray.ray.intersectPlane(groundPlane,pt);
  return pt;
}

function findDragTarget(event){
  const rect=renderer.domElement.getBoundingClientRect();
  const mx=((event.clientX-rect.left)/rect.width)*2-1;
  const my=-((event.clientY-rect.top)/rect.height)*2+1;
  const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(mx,my),camera);
  const meshes=[];sandGroup.children.forEach(c=>{c.traverse(n=>{if(n.isMesh)meshes.push(n)})});
  const hits=ray.intersectObjects(meshes);
  if(hits.length>0){
    for(const obj of sandObjects){
      let found=false;obj.mesh.traverse(n=>{if(n===hits[0].object)found=true});
      if(found)return obj;
    }
  }
  return null;
}

renderer.domElement.addEventListener('pointerdown',(e)=>{
  const target=findDragTarget(e);
  if(target){
    isDragging=true;dragObj=target;dragMoved=false;
    dragStartPos.set(e.clientX,e.clientY);
    controls.enabled=false;
    const pt=getGroundIntersect(e);
    dragOffset.copy(pt).sub(dragObj.mesh.position);
    // lift object slightly
    dragObj.mesh.position.y=0.15;
  }
});

renderer.domElement.addEventListener('pointermove',(e)=>{
  if(!isDragging||!dragObj)return;
  const dx=e.clientX-dragStartPos.x,dy=e.clientY-dragStartPos.y;
  if(Math.sqrt(dx*dx+dy*dy)>dragThreshold)dragMoved=true;
  if(dragMoved){
    const pt=getGroundIntersect(e);
    if(pt){
      const r=Math.sqrt(pt.x*pt.x+pt.z*pt.z);
      if(r<6.5){
        dragObj.mesh.position.x=pt.x-dragOffset.x;
        dragObj.mesh.position.z=pt.z-dragOffset.z;
      }
    }
  }
});

renderer.domElement.addEventListener('pointerup',()=>{
  if(isDragging&&dragObj){
    if(dragMoved){
      // Finalize position
      dragObj.mesh.position.y=0;
      dragObj.label.position.x=dragObj.mesh.position.x;
      dragObj.label.position.z=dragObj.mesh.position.z;
    }else{
      // Reset lift if no drag
      dragObj.mesh.position.y=0;
    }
    controls.enabled=true;
    isDragging=false;dragObj=null;
  }
});

// Override click to check if dragged
const origClickListener=renderer.domElement._listeners?.['click'];
// We handle click manually via the pointerup with threshold check
renderer.domElement.addEventListener('click',(e)=>{
  if(dragMoved)return; // was a drag, not a click
  const rect=renderer.domElement.getBoundingClientRect();
  const mx=((e.clientX-rect.left)/rect.width)*2-1;
  const my=-((e.clientY-rect.top)/rect.height)*2+1;
  const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(mx,my),camera);
  const meshes=[];sandGroup.children.forEach(c=>{c.traverse(n=>{if(n.isMesh)meshes.push(n)})});
  const hits=ray.intersectObjects(meshes);
  if(hits.length>0){
    for(const obj of sandObjects){
      let found=false;obj.mesh.traverse(n=>{if(n===hits[0].object)found=true});
      if(found){
        // Track clicked item for explorer achievement
        const clicked = JSON.parse(localStorage.getItem('hermes_clicked_items')||'[]');
        if(!clicked.includes(obj.data.id)){
          clicked.push(obj.data.id);
          localStorage.setItem('hermes_clicked_items', JSON.stringify(clicked));
        }
        checkAchievements();
        if(!obj._bouncing){
          obj._bouncing=true;
          obj.mesh.position.y=0;let f=0;
          function db(){f++;const t=f/10;if(t>=1){obj.mesh.position.y=0;obj._bouncing=false;showInfo(obj.data);return}obj.mesh.position.y=Math.sin(t*Math.PI)*0.25;requestAnimationFrame(db)}
          db();
        }
        break;
      }
    }
  }
});

// ==================== 7天情绪趋势图 ====================
function drawTrendChart(){
  const entries = getDiary();
  const canvas = document.getElementById('trend-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 432, H = 140;
  ctx.clearRect(0, 0, W, H);

  // Get last 7 days
  const days = [];
  for(let i = 6; i >= 0; i--){
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ date: d, label: ['日','一','二','三','四','五','六'][d.getDay()], entries: [] });
  }

  // Group entries by day
  entries.forEach(e => {
    const ed = new Date(e.timestamp);
    days.forEach(d => {
      if(ed.getFullYear() === d.date.getFullYear() && ed.getMonth() === d.date.getMonth() && ed.getDate() === d.date.getDate()){
        d.entries.push(e);
      }
    });
  });

  const moodOrder = ['happy','calm','sad','angry'];
  const moodColors = { happy:'#FFD700', calm:'#87CEEB', sad:'#A9A9A9', angry:'#FF6B6B' };
  const moodEmojis = { happy:'😊', calm:'😌', sad:'😢', angry:'😤' };

  // Count moods per day
  const dayMoods = days.map(d => {
    const counts = { happy:0, calm:0, sad:0, angry:0 };
    d.entries.forEach(e => { if(counts[e.mood] !== undefined) counts[e.mood]++; });
    return counts;
  });

  // Find dominant mood per day for line chart
  const padL = 36, padR = 10, padT = 14, padB = 22;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  // Draw grid lines
  ctx.strokeStyle = 'rgba(200,200,200,0.3)';
  ctx.lineWidth = 0.5;
  for(let i = 0; i < 4; i++){
    const y = padT + (chartH / 3) * i;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
  }

  // Draw bars for each day
  const barW = Math.min(36, chartW / days.length - 6);
  days.forEach((d, i) => {
    const x = padL + (chartW / days.length) * i + (chartW / days.length - barW) / 2;
    const total = Object.values(dayMoods[i]).reduce((a,b) => a+b, 0);
    if(total === 0){
      // Draw empty indicator
      ctx.fillStyle = 'rgba(200,200,200,0.15)';
      ctx.fillRect(x, padT + chartH * 0.7, barW, chartH * 0.3);
      ctx.fillStyle = '#ccc';
      ctx.font = '9px PingFang SC,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('--', x + barW/2, padT + chartH * 0.85);
    } else {
      let yOffset = padT + chartH;
      moodOrder.forEach(mood => {
        const count = dayMoods[i][mood];
        if(count > 0){
          const h = (count / Math.max(...Object.values(dayMoods[i]))) * chartH * 0.8;
          yOffset -= h;
          ctx.fillStyle = moodColors[mood] + 'cc';
          ctx.fillRect(x, yOffset, barW, h);
        }
      });
    }

    // Day label
    ctx.fillStyle = '#999';
    ctx.font = '10px PingFang SC,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.label, x + barW/2, H - 4);
  });

  // Summary
  const totalEntries = days.reduce((s,d) => s + d.entries.length, 0);
  const moodTotals = { happy:0, calm:0, sad:0, angry:0 };
  days.forEach(d => { d.entries.forEach(e => { if(moodTotals[e.mood] !== undefined) moodTotals[e.mood]++; }); });
  let topMood = 'happy', topCount = 0;
  moodOrder.forEach(m => { if(moodTotals[m] > topCount){ topCount = moodTotals[m]; topMood = m; } });
  const summary = document.getElementById('trend-summary');
  if(totalEntries > 0){
    summary.textContent = `📊 近7天共 ${totalEntries} 条 · ${moodEmojis[topMood]}「${MOOD_NAMES[topMood]}」出现 ${topCount} 次，占比最高 🏆`;
  } else {
    summary.textContent = '📊 近7天暂无记录，开始记录心情吧 🌸';
  }
}

// ==================== 成就系统 ====================
const ACHIEVEMENTS_KEY = 'hermes_garden_achievements';
const ACHIEVEMENTS = [
  { id:'first_flower', name:'初次播种', icon:'🌱', desc:'第一次记录心情',
    check:(diary)=> diary.length >= 1, effect:'第一朵花绽放' },
  { id:'sun_week', name:'阳光一周', icon:'🌻', desc:'连续记录 7 天',
    check:(diary)=> { if(diary.length < 7) return false; let streak=1; for(let i=1;i<diary.length;i++){const diff=Math.abs(diary[i-1].timestamp-diary[i].timestamp);if(diff<172800000){streak++;if(streak>=7)return true}else streak=1} return false; },
    effect:'花园中出现金色向日葵 🌻' },
  { id:'mood_observer', name:'情绪观察员', icon:'🦋', desc:'累计记录 21 天',
    check:(diary)=> { if(diary.length<21)return false; let days=new Set();diary.forEach(e=>{const d=new Date(e.timestamp);days.add(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`)});return days.size>=21; },
    effect:'花丛中飞舞蝴蝶 🦋' },
  { id:'emotion_rainbow', name:'情绪彩虹', icon:'🌈', desc:'集齐 4 种情绪各 5 次以上',
    check:(diary)=> { if(diary.length<20)return false;const c={happy:0,calm:0,sad:0,angry:0};diary.forEach(e=>{if(c[e.mood]!==undefined)c[e.mood]++});return c.happy>=5&&c.calm>=5&&c.sad>=5&&c.angry>=5; },
    effect:'天空出现彩虹弧 🌈' },
  { id:'explorer', name:'五感探索者', icon:'🌟', desc:'点击过所有 12 个沙具',
    check:(diary)=> { const clicked=JSON.parse(localStorage.getItem('hermes_clicked_items')||'[]');return clicked.length>=12; },
    effect:'星星粒子变成彩色 ✨' },
  { id:'resilience', name:'韧性之树', icon:'💪', desc:'在难过/生气后 24h 内记录了开心',
    check:(diary)=> { for(let i=1;i<diary.length;i++){if((diary[i-1].mood==='sad'||diary[i-1].mood==='angry')&&diary[i].mood==='happy'&&Math.abs(diary[i].timestamp-diary[i-1].timestamp)<86400000)return true}return false; },
    effect:'大树长出金色叶子 🍂' }
];

function getAchievements(){ try{return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY))||[]}catch{return[]} }
function saveAchievements(a){ localStorage.setItem(ACHIEVEMENTS_KEY,JSON.stringify(a)) }

function checkAchievements(){
  const diary = getDiary();
  const unlocked = getAchievements();
  const unlockedIds = new Set(unlocked.map(a => a.id));
  let newUnlock = null;
  ACHIEVEMENTS.forEach(a => {
    if(!unlockedIds.has(a.id) && a.check(diary)){
      const ach = { id:a.id, name:a.name, icon:a.icon, desc:a.desc, unlockedAt:Date.now() };
      unlocked.push(ach);
      newUnlock = ach;
    }
  });
  if(newUnlock) saveAchievements(unlocked);
  return newUnlock;
}

function showAchievementUnlock(ach){
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(160deg,#fff8e0,#fff);border-radius:24px;padding:28px 36px;text-align:center;z-index:300;box-shadow:0 20px 60px rgba(0,0,0,0.3);border:2px solid rgba(255,215,0,0.5);animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  div.innerHTML = `
    <div style="font-size:56px;margin-bottom:8px;">${ach.icon}</div>
    <div style="font-size:13px;color:#999;letter-spacing:2px;">🏆 成就解锁</div>
    <div style="font-size:22px;color:#5D4037;margin:4px 0 2px;letter-spacing:2px;">${ach.name}</div>
    <div style="font-size:14px;color:#e91e63;margin-bottom:10px;font-family:PingFang SC,sans-serif;">${ach.desc}</div>
    <div style="font-size:12px;color:#FF6B9D;font-family:PingFang SC,sans-serif;">✨ ${ach.effect}</div>
    <button onclick="this.parentElement.remove()" style="margin-top:14px;padding:8px 28px;border:none;border-radius:50px;background:linear-gradient(135deg,#FFD700,#FFA000);color:#fff;font-size:15px;cursor:pointer;letter-spacing:2px;font-family:ZCOOL KuaiLe,PingFang SC,sans-serif;">太棒了 ✨</button>
  `;
  document.body.appendChild(div);
  setTimeout(() => { if(div.parentElement) div.remove(); }, 5000);
}

function renderAchievements(){
  const unlocked = getAchievements();
  const diary = document.getElementById('diary-entries');
  if(!diary) return;
  // Add achievement section at bottom of diary
  // We'll add this to the export area instead
}

// Update renderDiary to include trend chart and achievement check
const origRenderDiary = renderDiary;
function enhancedRenderDiary(filter){
  origRenderDiary(filter);
  drawTrendChart();
  const newAch = checkAchievements();
  if(newAch) showAchievementUnlock(newAch);
}
renderDiary = enhancedRenderDiary;
function getDiary(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||[]}catch{return[]}}
function saveDiary(entries){localStorage.setItem(STORAGE_KEY,JSON.stringify(entries))}

function addDiaryEntry(mood,text,timestamp){
  const entries=getDiary();
  entries.unshift({id:Date.now(),timestamp,mood,emoji:MOOD_EMOJIS[mood],text:text||'',color:MOOD_COLORS[mood]});
  saveDiary(entries);
  renderDiary(getActiveFilter());
  updateReminderTime(); // reset reminder after recording
}

function deleteDiaryEntry(id){
  let entries=getDiary();
  entries=entries.filter(e=>e.id!==id);
  saveDiary(entries);
  renderDiary(getActiveFilter());
}

function getActiveFilter(){
  const active=document.querySelector('#diary-filter .active');
  return active?active.dataset.filter:'all';
}

function formatTime(ts){
  const d=new Date(ts);
  const pad=(n)=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function isToday(ts){const d=new Date(ts),t=new Date();return d.getFullYear()===t.getFullYear()&&d.getMonth()===t.getMonth()&&d.getDate()===t.getDate()}
function isThisWeek(ts){
  const d=new Date(ts),t=new Date();
  const getMon=(date)=>{const d=new Date(date);d.setDate(d.getDate()-(d.getDay()||7)+1);d.setHours(0,0,0,0);return d};
  return d>=getMon(t);
}

function renderDiary(filter){
  const entries=getDiary();
  const container=document.getElementById('diary-entries');
  const stats=document.getElementById('diary-stats');

  let filtered=entries;
  if(filter==='today')filtered=entries.filter(e=>isToday(e.timestamp));
  else if(filter==='week')filtered=entries.filter(e=>isThisWeek(e.timestamp));

  stats.textContent=`共 ${filtered.length} 条记录 · 最近记录：${filtered.length>0?formatTime(filtered[0].timestamp):'--'}`;

  if(filtered.length===0){
    container.innerHTML=`<div class="diary-empty"><span class="big">📝</span>还没有心情记录<br>去沙盘上种一朵花吧 🌸</div>`;
    return;
  }

  container.innerHTML=filtered.map(e=>`
    <div class="diary-entry">
      <div class="de-mood">${e.emoji}</div>
      <div class="de-body">
        <div class="de-time">${formatTime(e.timestamp)} ${MOOD_LABELS[e.mood]||''} ${MOOD_NAMES[e.mood]||''}</div>
        <div class="de-text">${e.text||'（没有写文字）'}</div>
      </div>
      <button class="de-delete" data-id="${e.id}" title="删除">✕</button>
    </div>
  `).join('');

  // Delete handlers
  container.querySelectorAll('.de-delete').forEach(btn=>{
    btn.addEventListener('click',(ev)=>{
      ev.stopPropagation();
      const id=parseInt(btn.dataset.id);
      deleteDiaryEntry(id);
    });
  });
}

// ==================== UI 事件 ====================
function showInfo(data){
  document.getElementById('info-icon').textContent=data.icon;
  document.getElementById('info-name').textContent=data.name;
  document.getElementById('info-meaning').textContent=data.meaning;
  document.getElementById('info-tip-short').textContent = data.shortTip || `💡 ${data.meaning}...`;
  document.getElementById('info-tip').textContent=data.tip;
  document.getElementById('info-tip-long').classList.remove('show');
  document.getElementById('info-expand-btn').textContent = '🧠 我想知道更多';
  // Add delete button
  let delBtn = document.getElementById('info-delete-btn');
  if(!delBtn){
    delBtn = document.createElement('button');
    delBtn.id = 'info-delete-btn';
    delBtn.textContent = '🗑 移走这个';
    delBtn.style.cssText = 'display:block;margin:8px auto 0;padding:6px 20px;border:none;border-radius:50px;background:#f0e0d8;color:#8D6E63;font-size:12px;cursor:pointer;letter-spacing:1px;transition:all 0.2s;font-family:PingFang SC,sans-serif';
    delBtn.addEventListener('mouseenter',()=>{delBtn.style.background='#e0c8c0'});
    delBtn.addEventListener('mouseleave',()=>{delBtn.style.background='#f0e0d8'});
    document.getElementById('info-panel').appendChild(delBtn);
    delBtn.addEventListener('click',() => {
      const name = document.getElementById('info-name').textContent;
      if(confirm(`确定要移走这个 ${document.getElementById('info-icon').textContent} ${name} 吗？`)){
        const icon = document.getElementById('info-icon').textContent;
        // Find matching obj by data name+icon
        for(let i = sandObjects.length - 1; i >= 0; i--){
          const obj = sandObjects[i];
          if(obj.data && obj.data.icon === icon && obj.data.name === name){
            removeSandObject(i);
            break;
          }
        }
        hideInfo();
      }
    });
  }
  document.getElementById('info-panel').style.display='block';
  document.getElementById('info-overlay').style.display='block';
}

function removeSandObject(index){
  const obj = sandObjects[index];
  if(!obj) return;
  sandGroup.remove(obj.mesh);
  sandGroup.remove(obj.label);
  sandObjects.splice(index, 1);
}

document.getElementById('info-expand-btn').addEventListener('click', () => {
  const long = document.getElementById('info-tip-long');
  const btn = document.getElementById('info-expand-btn');
  if(long.classList.contains('show')){
    long.classList.remove('show');
    btn.textContent = '🧠 我想知道更多';
  } else {
    long.classList.add('show');
    btn.textContent = '收起 ▲';
  }
});
function hideInfo(){
  document.getElementById('info-panel').style.display='none';
  document.getElementById('info-overlay').style.display='none';
}
document.getElementById('info-close').addEventListener('click',hideInfo);
document.getElementById('info-overlay').addEventListener('click',hideInfo);

// ==================== 选择面板 & 放置模式 ====================
let pendingPick = null; // 待放置的沙具数据
let isPlaceMode = false;

function showPickPanel(){
  const grid = document.getElementById('pick-grid');
  grid.innerHTML = ITEMS_DATA.map(d => `
    <div class="pick-item" data-id="${d.id}">
      <div class="pi-icon">${d.icon}</div>
      <div class="pi-name">${d.name}</div>
      <div class="pi-meaning">${d.meaning}</div>
    </div>
  `).join('');
  document.getElementById('pick-panel').style.display = 'block';
  document.getElementById('pick-overlay').style.display = 'block';
  // Item click handlers
  grid.querySelectorAll('.pick-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const data = ITEMS_DATA.find(d => d.id === id);
      if(!data) return;
      hidePickPanel();
      enterPlaceMode(data);
    });
  });
}
function hidePickPanel(){
  document.getElementById('pick-panel').style.display = 'none';
  document.getElementById('pick-overlay').style.display = 'none';
}
document.getElementById('pick-close').addEventListener('click', hidePickPanel);
document.getElementById('pick-overlay').addEventListener('click', hidePickPanel);

function enterPlaceMode(data){
  pendingPick = data;
  isPlaceMode = true;
  document.getElementById('place-hint').style.display = 'block';
  document.getElementById('hint').textContent = `👆 点击地面放置 ${data.icon} ${data.name}`;
  controls.enabled = false;
}
function exitPlaceMode(){
  isPlaceMode = false;
  pendingPick = null;
  document.getElementById('place-hint').style.display = 'none';
  document.getElementById('hint').textContent = '💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记';
  controls.enabled = true;
}

// 覆盖 btn-add 打开选择面板
document.getElementById('btn-add').addEventListener('click', showPickPanel);

// 放置模式下点击地面放置沙具
renderer.domElement.addEventListener('dblclick', (e) => {
  if(!isPlaceMode || !pendingPick) return;
  const pt = getGroundIntersect(e);
  if(pt){
    const r = Math.sqrt(pt.x*pt.x + pt.z*pt.z);
    if(r < 6.5){
      placeItem(pendingPick, pt.x, pt.z, true);
      exitPlaceMode();
    }
  }
});
// Also allow click when in placement mode
renderer.domElement.addEventListener('click', (e) => {
  if(!isPlaceMode || !pendingPick) return;
  if(dragMoved) return;
  // Check didn't click on existing object
  const rect=renderer.domElement.getBoundingClientRect();
  const mx=((e.clientX-rect.left)/rect.width)*2-1;
  const my=-((e.clientY-rect.top)/rect.height)*2+1;
  const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(mx,my),camera);
  const meshes=[];sandGroup.children.forEach(c=>{c.traverse(n=>{if(n.isMesh)meshes.push(n)})});
  const hits=ray.intersectObjects(meshes);
  if(hits.length > 0) return; // hit an object, not ground
  const pt = getGroundIntersect(e);
  if(pt && pt.x && pt.z){
    const r = Math.sqrt(pt.x*pt.x + pt.z*pt.z);
    if(r < 6.5){
      placeItem(pendingPick, pt.x, pt.z, true);
      exitPlaceMode();
    }
  }
});

// ==================== 讲故事（叙事引导） ====================
document.getElementById('btn-story').addEventListener('click', () => {
  const name = prompt('📖 给你的花园起个名字吧 ✏️');
  if(!name) return;
  const important = prompt('🌟 这个花园里谁最重要？为什么把它放在那里？');
  const weather = prompt('🌤 如果这个花园有天气，今天是晴天还是雨天？');
  const story = prompt('🌱 用一句话描述你的花园今天的故事');
  const timestamp = Date.now();
  const text = `【叙事日志】花园名：${name}\n重要沙具：${important||'（未填写）'}\n天气：${weather||'（未填写）'}\n故事：${story||'（未填写）'}`;
  addDiaryEntry('calm', text, timestamp);
  document.getElementById('hint').textContent = '📖 故事已存入日记！';
  setTimeout(() => {
    document.getElementById('hint').textContent = '💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记';
  }, 3000);
});

// 清空加确认
document.getElementById('btn-clear').addEventListener('click',()=>{
  if(sandObjects.length <= 6){
    // No user-added items, just reset
  } else if(!confirm('🌀 确定要清空整个花园吗？所有沙具和花朵将消失！')){
    return;
  }
  while(sandGroup.children.length>0){const c=sandGroup.children[0];c.traverse(n=>{if(n.geometry)n.geometry.dispose();if(n.material)n.material.dispose()});sandGroup.remove(c)}
  sandObjects.length=0;
  ITEMS_DATA.forEach((d,i)=>{placeItem(d,initPos[i%12][0],initPos[i%12][1])});
});

// ===== 心情记录 =====
let selectedMood='happy';
document.getElementById('btn-mood').addEventListener('click',()=>{
  const now=new Date();
  const pad=(n)=>String(n).padStart(2,'0');
  document.getElementById('mood-timestamp').textContent=`⏱️ 记录时间：${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById('mood-dialog').style.display='block';
  selectedMood='happy';
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('selected'));
  document.querySelector('.mood-btn[data-mood="happy"]').classList.add('selected');
});

document.querySelectorAll('.mood-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMood=btn.dataset.mood;
  });
});
document.getElementById('mood-cancel').addEventListener('click',()=>{document.getElementById('mood-dialog').style.display='none'});
document.getElementById('mood-ok').addEventListener('click',()=>{
  const text=document.getElementById('mood-text').value.trim();
  const now=Date.now();
  addDiaryEntry(selectedMood,text||`心情：${MOOD_NAMES[selectedMood]}`,now);
  createFlower(selectedMood,text||`心情：${MOOD_NAMES[selectedMood]}`,now);
  document.getElementById('mood-dialog').style.display='none';
  document.getElementById('mood-text').value='';
});

// ===== 日记 =====
document.getElementById('btn-diary').addEventListener('click',()=>{
  document.getElementById('diary-panel').classList.add('show');
  document.getElementById('diary-overlay').style.display='block';
  renderDiary(getActiveFilter());
});
document.getElementById('diary-close').addEventListener('click',()=>{
  document.getElementById('diary-panel').classList.remove('show');
  document.getElementById('diary-overlay').style.display='none';
});
document.getElementById('diary-overlay').addEventListener('click',()=>{
  document.getElementById('diary-panel').classList.remove('show');
  document.getElementById('diary-overlay').style.display='none';
});
document.querySelectorAll('#diary-filter button[data-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('#diary-filter button[data-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderDiary(btn.dataset.filter);
  });
});
// ===== 日记导出 =====
document.getElementById('btn-export').addEventListener('click',()=>{
  const entries=getDiary();
  if(entries.length===0){document.getElementById('hint').textContent='📝 还没有日记可以导出哦~';setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},3000);return}
  let txt='== 情绪花园 · 心情日记 ==\n\n';
  entries.forEach(e=>{txt+=`${formatTime(e.timestamp)} ${e.emoji} ${MOOD_NAMES[e.mood]}\n${e.text||'(无文字)'}\n\n`});
  const blob=new Blob([txt],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`情绪日记_${new Date().toISOString().slice(0,10)}.txt`;a.click();
  URL.revokeObjectURL(a.href);
  document.getElementById('hint').textContent='📥 日记已导出！';
  setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},3000);
});

// ===== 数据备份/恢复 =====
const BACKUP_KEY = 'hermes_garden_last_backup';
const REMINDER_KEY = 'hermes_garden_backup_reminder';

function getAllData(){
  return {
    diary: getDiary(),
    achievements: getAchievements(),
    reminderInterval: parseInt(localStorage.getItem('hermes_garden_reminder_interval')||'0'),
    clickedItems: JSON.parse(localStorage.getItem('hermes_clicked_items')||'[]'),
    version: '4.0',
    exportDate: new Date().toISOString()
  };
}

document.getElementById('btn-backup').addEventListener('click', () => {
  const data = getAllData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], {type:'application/json;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `情绪花园_备份_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);

  // Record backup time
  localStorage.setItem(BACKUP_KEY, Date.now().toString());

  document.getElementById('hint').textContent = '💾 数据已备份为 JSON 文件！可随时导入恢复';
  setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},4000);
});

// 恢复功能：创建隐藏的 file input
const restoreInput = document.createElement('input');
restoreInput.type = 'file';
restoreInput.accept = '.json';
restoreInput.style.display = 'none';
document.body.appendChild(restoreInput);

restoreInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if(!data.diary || !Array.isArray(data.diary)){
        document.getElementById('hint').textContent = '❌ 备份文件格式不正确';
        setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},3000);
        return;
      }
      // Confirm before restoring
      const existing = getDiary().length;
      if(existing > 0 && !confirm(`当前有 ${existing} 条记录。导入备份将覆盖现有数据，确定要继续吗？`)){
        return;
      }
      // Restore all data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.diary));
      if(data.achievements) localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(data.achievements));
      if(data.reminderInterval) localStorage.setItem('hermes_garden_reminder_interval', String(data.reminderInterval));
      if(data.clickedItems) localStorage.setItem('hermes_clicked_items', JSON.stringify(data.clickedItems));
      // Refresh UI
      renderDiary(getActiveFilter());
      document.getElementById('hint').textContent = `✅ 已恢复 ${data.diary.length} 条记录！💾`;
      setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},4000);
    } catch(err) {
      document.getElementById('hint').textContent = '❌ 备份文件读取失败：' + err.message;
      setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},4000);
    }
  };
  reader.readAsText(file);
  restoreInput.value = '';
});

// 在工具栏加恢复按钮
const restoreBtn = document.createElement('button');
restoreBtn.id = 'btn-restore';
restoreBtn.textContent = '📂 恢复';
restoreBtn.style.cssText = 'background:linear-gradient(135deg,#81C784,#43E97B);color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.15)';
document.getElementById('toolbar').appendChild(restoreBtn);
document.getElementById('btn-restore').addEventListener('click', () => restoreInput.click());

// 备份提醒：如果7天没备份，打开日记时提示
function checkBackupReminder(){
  const lastBackup = localStorage.getItem(BACKUP_KEY);
  if(!lastBackup){
    const entries = getDiary();
    if(entries.length >= 3){
      document.getElementById('hint').textContent = '💡 已有 ' + entries.length + ' 条记录，建议点击「💾 备份数据」保存到本地';
      setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},6000);
    }
    return;
  }
  const daysSinceBackup = (Date.now() - parseInt(lastBackup)) / 86400000;
  if(daysSinceBackup > 7){
    document.getElementById('hint').textContent = `⏰ 上次备份已是 ${Math.floor(daysSinceBackup)} 天前，建议重新备份 💾`;
    setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},6000);
  }
}
// Run backup check on diary open
const origDiaryOpen = document.getElementById('btn-diary').click;
document.getElementById('btn-diary').addEventListener('click', () => {
  setTimeout(checkBackupReminder, 500);
});

// ===== 成长报告 =====
document.getElementById('btn-report').addEventListener('click', () => {
  const entries = getDiary();
  if(entries.length === 0){
    document.getElementById('hint').textContent='📝 还没有数据，先记录心情吧~';
    setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},3000);
    return;
  }

  // Count stats
  const totalDays = new Set(entries.map(e => {
    const d = new Date(e.timestamp);
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  })).size;

  const moodCounts = { happy:0, calm:0, sad:0, angry:0 };
  entries.forEach(e => { if(moodCounts[e.mood] !== undefined) moodCounts[e.mood]++; });

  // Most used sand items (from flower text analysis)
  const itemFreq = {};
  entries.forEach(e => {
    const text = e.text || '';
    itemFreq[e.mood] = (itemFreq[e.mood] || 0) + 1;
  });

  const unlocked = getAchievements();
  const moodEmojiMap = { happy:'😊', calm:'😌', sad:'😢', angry:'😤' };

  // Build report HTML
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const totalMoods = entries.length;

  // Generate inline pie chart using canvas
  const pieCanvas = document.createElement('canvas');
  pieCanvas.width = 200;
  pieCanvas.height = 200;
  const pctx = pieCanvas.getContext('2d');
  const cx = 100, cy = 100, r = 80;
  const colors = ['#FFD700','#87CEEB','#A9A9A9','#FF6B6B'];
  const labels = ['开心','平静','难过','生气'];
  const moodKeys = ['happy','calm','sad','angry'];
  let totalPie = 0;
  moodKeys.forEach(k => totalPie += moodCounts[k]);
  let startAngle = -Math.PI / 2;
  if(totalPie > 0){
    moodKeys.forEach((k, i) => {
      const val = moodCounts[k];
      if(val === 0) return;
      const sliceAngle = (val / totalPie) * Math.PI * 2;
      pctx.beginPath();
      pctx.moveTo(cx, cy);
      pctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
      pctx.closePath();
      pctx.fillStyle = colors[i];
      pctx.fill();
      pctx.strokeStyle = '#fff';
      pctx.lineWidth = 2;
      pctx.stroke();
      startAngle += sliceAngle;
    });
    // Center circle for donut
    pctx.beginPath();
    pctx.arc(cx, cy, 35, 0, Math.PI * 2);
    pctx.fillStyle = '#fff';
    pctx.fill();
    pctx.fillStyle = '#5D4037';
    pctx.font = 'bold 20px PingFang SC,sans-serif';
    pctx.textAlign = 'center';
    pctx.textBaseline = 'middle';
    pctx.fillText(totalMoods, cx, cy);
  }

  const pieDataUrl = pieCanvas.toDataURL();

  const achievementsHtml = unlocked.length > 0
    ? unlocked.map(a => `<span style="display:inline-block;margin:4px;padding:4px 12px;border-radius:30px;background:linear-gradient(135deg,#fff8e0,#fff);border:1px solid #FFD700;font-size:13px;">${a.icon} ${a.name}</span>`).join(' ')
    : '<span style="color:#ccc;">暂无解锁成就</span>';

  // Mood timeline
  const recentEntries = entries.slice(0, 10);
  const timelineHtml = recentEntries.map(e =>
    `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #f5e8e0;font-size:13px;">
      <span>${e.emoji}</span>
      <span style="color:#999;font-size:11px;font-family:PingFang SC,sans-serif;">${formatTime(e.timestamp)}</span>
      <span style="color:#555;font-family:PingFang SC,sans-serif;">${(e.text||'').substring(0,30)}${(e.text||'').length>30?'...':''}</span>
    </div>`
  ).join('');

  const reportHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>情绪花园 · 成长报告</title>
<style>
  body{font-family:PingFang SC,Noto Sans SC,sans-serif;background:#fef9f5;margin:0;padding:20px;color:#444}
  .container{max-width:700px;margin:0 auto;background:#fff;border-radius:24px;padding:30px 32px;box-shadow:0 8px 30px rgba(255,105,135,0.1);border:1px solid #f0e0d8}
  h1{text-align:center;font-size:28px;color:#5D4037;margin:0 0 4px;letter-spacing:2px}
  .date{text-align:center;font-size:13px;color:#bbb;margin-bottom:20px;font-family:PingFang SC,sans-serif}
  .section{background:linear-gradient(135deg,#fff5f7,#fff);border-radius:16px;padding:16px 20px;margin-bottom:14px;border:1px solid #f5e8e0}
  .section h2{font-size:16px;color:#e91e63;margin:0 0 10px;letter-spacing:1px}
  .stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center}
  .stat-item{background:#fef9f5;border-radius:12px;padding:10px 6px}
  .stat-item .num{font-size:22px;font-weight:bold;color:#5D4037}
  .stat-item .label{font-size:11px;color:#999;font-family:PingFang SC,sans-serif}
  .mood-bar{display:flex;gap:6px;align-items:flex-end;height:80px;padding:4px 0}
  .mood-bar-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
  .mood-bar-fill{width:100%;border-radius:6px 6px 0 0;min-height:4px;transition:height 0.3s}
  .mood-bar-label{font-size:11px;color:#999;font-family:PingFang SC,sans-serif}
  .footer{text-align:center;font-size:11px;color:#ccc;margin-top:20px;font-family:PingFang SC,sans-serif}
  @media print{body{background:#fff;padding:0}.container{box-shadow:none;border:none}}
</style>
</head>
<body>
<div class="container">
  <h1>🌱 情绪花园 · 成长报告</h1>
  <div class="date">📅 ${dateStr} · 共 ${totalDays} 天 · ${totalMoods} 条记录</div>

  <div class="section">
    <h2>📊 使用概览</h2>
    <div class="stat-grid">
      <div class="stat-item"><div class="num">${totalDays}</div><div class="label">使用天数</div></div>
      <div class="stat-item"><div class="num">${totalMoods}</div><div class="label">记录总数</div></div>
      <div class="stat-item"><div class="num">${unlocked.length}</div><div class="label">已解锁成就</div></div>
      <div class="stat-item"><div class="num">${totalDays > 0 ? Math.round(totalMoods / totalDays) : 0}</div><div class="label">日均记录</div></div>
    </div>
  </div>

  <div class="section">
    <h2>🎨 情绪分布</h2>
    <div style="display:flex;align-items:center;gap:20px;">
      <img src="${pieDataUrl}" style="width:160px;height:160px;border-radius:50%;" alt="情绪饼图">
      <div style="flex:1;">
        ${moodKeys.map((k, i) => `
          <div style="display:flex;align-items:center;gap:6px;margin:4px 0;">
            <span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${colors[i]};"></span>
            <span style="font-size:13px;">${moodEmojiMap[k]} ${labels[i]}</span>
            <span style="font-size:12px;color:#999;font-family:PingFang SC,sans-serif;">${moodCounts[k]} 次 (${totalPie > 0 ? Math.round(moodCounts[k]/totalPie*100) : 0}%)</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <div class="section">
    <h2>🏆 成就徽章</h2>
    <div>${achievementsHtml}</div>
  </div>

  <div class="section">
    <h2>📝 最近记录</h2>
    ${timelineHtml}
  </div>

  <div class="footer">
    🌱 情绪花园 · 我的沙盘世界 v4.0 · 由情绪花园数字沙盘生成
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([reportHTML], {type:'text/html;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `情绪成长报告_${dateStr}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
  document.getElementById('hint').textContent = '📊 成长报告已生成！可直接打开打印 🖨️';
  setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},4000);
});

// ===== 提醒设置 =====
document.getElementById('btn-reminder').addEventListener('click',()=>{
  const current=parseInt(localStorage.getItem('hermes_garden_reminder_interval')||'0');
  document.querySelectorAll('.reminder-options input').forEach(r=>{
    r.checked=parseInt(r.value)===current;
  });
  document.getElementById('reminder-panel').classList.add('show');
  document.getElementById('reminder-overlay').style.display='block';
});
document.getElementById('reminder-cancel').addEventListener('click',()=>{
  document.getElementById('reminder-panel').classList.remove('show');
  document.getElementById('reminder-overlay').style.display='none';
});
document.getElementById('reminder-overlay').addEventListener('click',()=>{
  document.getElementById('reminder-panel').classList.remove('show');
  document.getElementById('reminder-overlay').style.display='none';
});
document.getElementById('reminder-save').addEventListener('click',()=>{
  const selected=document.querySelector('.reminder-options input:checked');
  if(selected){
    const interval=parseInt(selected.value);
    localStorage.setItem('hermes_garden_reminder_interval',String(interval));
    setupReminder(interval);
    document.getElementById('reminder-panel').classList.remove('show');
    document.getElementById('reminder-overlay').style.display='none';
    document.getElementById('hint').textContent=interval>0?`⏰ 已设置每 ${interval>=1440?'天':interval>=60?`${interval/60} 小时`:`${interval} 分钟`} 提醒`:'⏰ 已关闭提醒';
    setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},3000);
  }
});

// ===== 提醒计时器 =====
let reminderTimer=null,lastReminderTime=0;

function setupReminder(intervalMinutes){
  if(reminderTimer){clearInterval(reminderTimer);reminderTimer=null;}
  if(intervalMinutes<=0)return;
  lastReminderTime=Date.now();
  reminderTimer=setInterval(()=>{
    const nextTime=lastReminderTime+intervalMinutes*60*1000;
    if(Date.now()>=nextTime){
      showReminder();
      lastReminderTime=Date.now();
    }
  },10000); // check every 10 seconds
}

function showReminder(){
  const notice=document.getElementById('reminder-notice');
  notice.style.display='block';
  setTimeout(()=>{notice.style.display='none'},8000);
}

document.getElementById('reminder-notice').addEventListener('click',()=>{
  document.getElementById('reminder-notice').style.display='none';
  document.getElementById('btn-mood').click();
});

function updateReminderTime(){
  lastReminderTime=Date.now();
}

// Init reminder on load
(function(){
  const interval=parseInt(localStorage.getItem('hermes_garden_reminder_interval')||'0');
  if(interval>0)setupReminder(interval);
})();

// ===== 引导 =====
document.getElementById('welcome-start').addEventListener('click',()=>{document.getElementById('welcome-overlay').style.display='none'});

// ==================== 心情之花 ====================
let flowerIdCounter=0;
function createFlower(mood,text,timestamp){
  const color=MOOD_COLORS[mood]||0xFFD700;
  const fg=new THREE.Group();
  const sm=new THREE.MeshStandardMaterial({color:0x66BB6A,emissive:0x4CAF50,emissiveIntensity:0.05});
  const st=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.05,0.6,6),sm);st.position.y=0.3;st.castShadow=true;fg.add(st);
  const pm=new THREE.MeshStandardMaterial({color,roughness:0.3,emissive:color,emissiveIntensity:0.08});
  for(let i=0;i<7;i++){const a=(i/7)*Math.PI*2;const p=new THREE.Mesh(new THREE.SphereGeometry(0.09,8,8),pm);p.position.set(Math.cos(a)*0.14,0.68,Math.sin(a)*0.14);p.scale.set(1.3,0.5,1.3);fg.add(p)}
  const cm=new THREE.MeshStandardMaterial({color:0xFFEB3B,emissive:0xFFD700,emissiveIntensity:0.3});
  const ct=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,8),cm);ct.position.y=0.68;fg.add(ct);
  const lm=new THREE.MeshStandardMaterial({color:0x81C784});const lf=new THREE.Mesh(new THREE.SphereGeometry(0.05,6,6),lm);lf.scale.set(0.7,0.3,1.2);lf.position.set(0.1,0.2,0);lf.rotation.x=0.4;fg.add(lf);

  const a=Math.random()*Math.PI*2,dist=0.5+Math.random()*4;
  const x=Math.cos(a)*dist,z=Math.sin(a)*dist;
  fg.position.set(x,0,z);fg.rotation.y=Math.random()*Math.PI*2;fg.scale.set(0,0,0);
  sandGroup.add(fg);

  const label=makeLabel(`🌸 ${(text||'心情').substring(0,18)}${(text||'').length>18?'...':''}`,'rgba(255,240,245,0.95)');
  label.position.set(x,1.1,z);sandGroup.add(label);

  const obj={mesh:fg,label,floatOffset:Math.random()*Math.PI*2,
    data:{name:'心情之花',icon:'🌸',meaning:`情绪：${MOOD_NAMES[mood]}`,tip:'青春期的每一种情绪都是正常的——无论是开心、平静、难过还是生气，它们都是你内心最真实的信号。学会识别它、接纳它、温柔地照顾它，这就是成长的开始。'},
    position:new THREE.Vector3(x,0,z),isFlower:true,flowerMood:mood,flowerText:text,flowerTime:timestamp};
  sandObjects.push(obj);

  const st2=performance.now();
  function pf(time){const t=Math.min((time-st2)/400,1),e=1-Math.pow(1-t,3);fg.scale.setScalar(e);fg.position.y=Math.sin(e*Math.PI)*0.3;if(t<1)requestAnimationFrame(pf);else{fg.position.y=0;fg.scale.set(1,1,1)}}
  requestAnimationFrame(pf);

  document.getElementById('hint').textContent=`🌸 已记录 ${MOOD_NAMES[mood]} · 日记+1 📖`;
  setTimeout(()=>{document.getElementById('hint').textContent='💫 点击获取小贴士 · 拖拽移动沙具 · 记录心情 · 写日记'},4000);
}

// ==================== 窗口自适应 ====================
window.addEventListener('resize',()=>{
  const w=window.innerWidth,h=window.innerHeight;
  camera.aspect=w/h;camera.updateProjectionMatrix();
  renderer.setSize(w,h);composer.setSize(w,h);
  labelRenderer.setSize(w,h);
});

// ==================== 动画循环 ====================
function animate(time){
  requestAnimationFrame(animate);
  controls.update();
  floatTime=time*0.001;
  sandObjects.forEach((obj,i)=>{
    const off=obj.floatOffset||(obj.floatOffset=i*0.8);
    const f=Math.sin(floatTime*0.8+off)*0.04;
    if(!isDragging||obj!==dragObj)obj.mesh.position.y=f;
    obj.label.position.y=1.3+f;
    obj.mesh.rotation.y+=Math.sin(floatTime*0.3+off)*0.01;
  });
  const pp=particles.geometry.attributes.position.array;
  for(let i=0;i<PC;i++){const idx=i*3;const th=Math.atan2(pp[idx+2],pp[idx]),r=Math.sqrt(pp[idx]*pp[idx]+pp[idx+2]*pp[idx+2]);pp[idx]=Math.cos(th+0.002)*r;pp[idx+2]=Math.sin(th+0.002)*r;pp[idx+1]+=0.003;if(pp[idx+1]>3.5)pp[idx+1]=0.3}
  particles.geometry.attributes.position.needsUpdate=true;
  composer.render();labelRenderer.render(scene,camera);
}
animate(0);
console.log('🌱 情绪花园 v4.0 — 沙具选择·小贴士·趋势图·成就·报告·12沙具 ✨');
