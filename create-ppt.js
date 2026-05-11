const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "情绪花园团队";
pres.title = "情绪花园 — 数字沙盘情绪管理工具";

// Color palette (Coral Energy + warm tones matching the app)
const C = {
  bg: "FFF5F7",
  primary: "F96167",
  accent: "F9E795",
  dark: "2F3C7E",
  text: "5D4037",
  lightText: "999999",
  white: "FFFFFF",
  green: "43E97B",
  purple: "C44DFF",
};

function makeShadow() {
  return { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.12 };
}

// ==================== SLIDE 1: Title ====================
let s1 = pres.addSlide();
s1.background = { color: C.dark };
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 5.625,
  fill: { color: C.dark }
});
s1.addText("🌱 情绪花园", {
  x: 0.5, y: 1.0, w: 9, h: 1.2,
  fontSize: 48, fontFace: "Georgia", bold: true,
  color: C.accent, align: "center", margin: 0
});
s1.addText("数字沙盘 · 青少年情绪管理工具", {
  x: 0.5, y: 2.2, w: 9, h: 0.6,
  fontSize: 22, fontFace: "Calibri", color: C.white,
  align: "center", margin: 0
});
s1.addText("全国青少年心理成长知识与应用创新大赛", {
  x: 0.5, y: 3.0, w: 9, h: 0.5,
  fontSize: 14, fontFace: "Calibri", color: C.lightText,
  align: "center", margin: 0
});
s1.addText("赛项一：沙盘游戏创新方向", {
  x: 0.5, y: 3.5, w: 9, h: 0.4,
  fontSize: 12, fontFace: "Calibri", color: C.accent,
  align: "center", margin: 0, italic: true
});
s1.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 4.3, w: 3, h: 0.04,
  fill: { color: C.primary }
});
s1.addNotes(`
【开场话术 · 1分钟】
大家好，今天为大家介绍的是「情绪花园」——一款基于Three.js 3D引擎的数字沙盘情绪管理工具。

我们针对的是青春期少年（12-16岁）这个群体。这个阶段的孩子们面临着学业压力、同伴关系、亲子冲突、自我认同等多重挑战，但传统的心理辅导方式往往让他们有抵触感——"又要被谈话了"。

情绪花园的核心理念是：用游戏化的沙盘搭建体验，让青少年在不知不觉中学会识别、表达和调节自己的情绪。

它不是一个"教学工具"，而是一个"情绪游乐场"。
`);

// ==================== SLIDE 2: Problem ====================
let s2 = pres.addSlide();
s2.background = { color: C.white };
s2.addText("青春期情绪管理的三大痛点", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: "Georgia", bold: true,
  color: C.dark, margin: 0
});
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 0.95, w: 1.2, h: 0.04,
  fill: { color: C.primary }
});

const problems = [
  { icon: "😶", title: "表达障碍", desc: "青少年往往说不清自己\n的情绪状态，只能用\n「还行」「不知道」来回应" },
  { icon: "📱", title: "工具脱节", desc: "传统的纸笔日记/量表\n对数字原生代缺乏吸\n引力，3天就放弃" },
  { icon: "📊", title: "评估缺失", desc: "缺少可视化的情绪数\n据追踪，家长和老师\n难以量化干预效果" }
];

problems.forEach((p, i) => {
  const x = 0.6 + i * 3.2;
  s2.addShape(pres.shapes.RECTANGLE, {
    x, y: 1.5, w: 2.8, h: 3.2,
    fill: { color: C.bg }, shadow: makeShadow()
  });
  s2.addText(p.icon, { x, y: 1.7, w: 2.8, h: 0.7, fontSize: 40, align: "center", margin: 0 });
  s2.addText(p.title, { x, y: 2.35, w: 2.8, h: 0.4, fontSize: 18, bold: true, color: C.text, align: "center", margin: 0 });
  s2.addText(p.desc, { x: x + 0.15, y: 2.8, w: 2.5, h: 1.5, fontSize: 13, color: "666666", align: "center", fontFace: "Calibri", margin: 0 });
});
s2.addNotes(`
【讲解话术 · 1.5分钟】
为什么青春期情绪管理这么难？我们总结出三个核心痛点：

第一是表达障碍。你去问一个初中生"你今天心情怎么样"，90%的回答是"还行"。不是他们不想说，是他们自己也搞不清楚那种复杂的感受叫什么。青春期的大脑前额叶还在发育中，情绪识别能力本身就不成熟。

第二是工具脱节。我们试过给孩子们发情绪日记本，让他们每天写。第一天写了，第二天应付，第三天就找不到了。现在的孩子是数字原生代，他们需要的是手机、平板、电脑上能用的东西，是像游戏一样好玩的东西。

第三是评估缺失。老师或者家长想了解孩子的情绪变化，只能靠问或者观察。没有一个可视化的、量化的方式来追踪情绪的长期趋势。而这个恰恰是干预效果评估中最需要的。

情绪花园就是针对这三大痛点设计的。
`);

// ==================== SLIDE 3: Solution Overview ====================
let s3 = pres.addSlide();
s3.background = { color: C.dark };
s3.addText("情绪花园 = 数字沙盘 + 情绪管理 + 游戏化", {
  x: 0.5, y: 0.4, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Georgia", bold: true,
  color: C.accent, align: "center", margin: 0
});

const solutions = [
  { icon: "🎨", title: "3D 沙盘场景", desc: "12种心理学沙具\n自由拖拽布置\n点击获取心理小贴士" },
  { icon: "😊", title: "情绪记录", desc: "4种情绪选择\n记录后沙盘开花\n自动存入日记" },
  { icon: "📈", title: "数据分析", desc: "7天情绪趋势图\n情绪分布饼图\n可打印成长报告" },
  { icon: "🏆", title: "成就激励", desc: "6个收集成就\n连续打卡奖励\n游戏化持续使用" },
  { icon: "📖", title: "叙事引导", desc: "讲故事模式\n花园命名·天气·\n最重要的沙具" },
  { icon: "📱", title: "全平台", desc: "macOS原生应用\nWindows Electron\niOS PWA离线支持" }
];

solutions.forEach((sol, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.5 + col * 3.15;
  const y = 1.5 + row * 1.85;

  s3.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 2.85, h: 1.6,
    fill: { color: "3A4A9E" },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.2 }
  });
  s3.addText(sol.icon, { x: x - 0.3, y: y - 0.05, w: 0.8, h: 0.6, fontSize: 28, align: "center", margin: 0 });
  s3.addText(sol.title, { x: x + 0.3, y: y + 0.05, w: 2.4, h: 0.35, fontSize: 16, bold: true, color: C.accent, margin: 0 });
  s3.addText(sol.desc, { x: x + 0.15, y: y + 0.45, w: 2.55, h: 1.0, fontSize: 12, color: "CADCFC", fontFace: "Calibri", margin: 0 });
});
s3.addNotes(`
【讲解话术 · 2分钟】
情绪花园不是什么神秘的心理学黑科技，它的设计理念很简单：

就是把传统的沙盘游戏疗法搬到数字世界里，再加上情绪记录和数据分析。

我们来看这六大核心功能：

第一，3D沙盘场景。我们有12种心理学沙具，每一个都有明确的象征意义——太阳代表积极情绪，乌云代表压力，小屋代表安全感……孩子们可以自由拖拽布置自己的花园。点击任何一个沙具，都会弹出一句心理学金句和一个可展开的青春期专属小贴士。

第二，情绪记录。点击"写心情"，选择开心/平静/难过/生气四种中的一种，写一句话，沙盘上就会开出一朵对应颜色的花。记录越多，花园越茂盛。

第三，数据分析。打开日记面板，顶部就是7天情绪趋势图——堆叠柱状图清晰显示每天每种情绪出现的次数。还能一键生成"情绪成长报告"，直接打印给评委或家长看。

第四，成就激励。我们设了6个成就——比如连续记录7天解锁"阳光一周"、集齐4种情绪各5次解锁"情绪彩虹"。游戏化的设计让孩子有动力坚持下去。

第五，叙事引导。点击"讲故事"按钮，孩子可以给花园起名字、说说最重要的沙具是什么、描述花园今天的故事。这些内容自动存入日记，本身就是很好的叙事治疗素材。

第六，全平台。一个HTML文件，同时支持macOS原生应用、Windows Electron应用、以及iOS的PWA离线访问。
`);

// ==================== SLIDE 4: Screenshot ====================
let s4 = pres.addSlide();
s4.background = { color: C.white };
s4.addText("🖼️ 应用界面展示", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Georgia", bold: true,
  color: C.dark, margin: 0
});
s4.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 0.95, w: 1.2, h: 0.04,
  fill: { color: C.primary }
});

// Find screenshot files
const ssDir = path.join(__dirname, "screenshots");
const ssFiles = [];
if (fs.existsSync(ssDir)) {
  fs.readdirSync(ssDir).forEach(f => {
    if (f.endsWith(".png")) ssFiles.push(path.join(ssDir, f));
  });
}

if (ssFiles.length >= 2) {
  // Place first two screenshots side by side
  s4.addImage({ path: ssFiles[0], x: 0.4, y: 1.4, w: 4.3, h: 2.7, sizing: { type: "contain", w: 4.3, h: 2.7 } });
  s4.addText("欢迎页面 · 引导探索", {
    x: 0.4, y: 4.1, w: 4.3, h: 0.3, fontSize: 11, color: C.lightText, align: "center", margin: 0, fontFace: "Calibri"
  });
  if (ssFiles[1]) {
    s4.addImage({ path: ssFiles[1], x: 5.1, y: 1.4, w: 4.5, h: 2.7, sizing: { type: "contain", w: 4.5, h: 2.7 } });
    s4.addText("3D沙盘场景 · 12种沙具", {
      x: 5.1, y: 4.1, w: 4.5, h: 0.3, fontSize: 11, color: C.lightText, align: "center", margin: 0, fontFace: "Calibri"
    });
  }
  if (ssFiles[2]) {
    s4.addImage({ path: ssFiles[2], x: 0.4, y: 4.5, w: 9.2, h: 1.0, sizing: { type: "contain", w: 9.2, h: 1.0 } });
  }
} else {
  s4.addText("（截图文件请参见项目 screenshots/ 目录）", {
    x: 0.5, y: 2.0, w: 9, h: 1.0, fontSize: 16, color: C.lightText, align: "center", margin: 0, fontFace: "Calibri", italic: true
  });
}
s4.addNotes(`
【讲解话术 · 1分钟】
这是情绪花园的实际界面截图。

左边是欢迎引导页面——第一次打开时会弹出这个温暖的引导卡，告诉孩子们怎么玩。我们特别注意到了"第一印象"的重要性，所以整个UI采用粉紫渐变 + 发光粒子效果，视觉上先抓住孩子的注意力。

右边是3D沙盘场景——可以看到12种沙具以圆形排列，在绿色的草地上漂浮着。背景有闪烁的星光粒子，整体氛围温暖治愈。每一个沙具都可以点击查看心理学知识，可以拖拽自由放置。

（如果有多张截图，可以继续介绍日记面板、趋势图等）
`);

// ==================== SLIDE 5: Psychology Foundation ====================
let s5 = pres.addSlide();
s5.background = { color: C.white };
s5.addText("🧠 心理学设计基础", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Georgia", bold: true,
  color: C.dark, margin: 0
});
s5.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 0.95, w: 1.2, h: 0.04,
  fill: { color: C.primary }
});

// Left column - Sandplay theory
s5.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.3, w: 4.2, h: 3.8,
  fill: { color: C.bg }, shadow: makeShadow()
});
s5.addText("沙盘游戏疗法理论", {
  x: 0.7, y: 1.4, w: 3.8, h: 0.4,
  fontSize: 16, bold: true, color: C.primary, margin: 0
});
s5.addText([
  { text: "多拉·卡尔夫「自由与受保护的空间」", options: { bullet: true, breakLine: true, fontSize: 12, color: "555555" } },
  { text: "12种沙具对应12种心理象征意义", options: { bullet: true, breakLine: true, fontSize: 12, color: "555555" } },
  { text: "沙盘叙事：通过场景讲述内心故事", options: { bullet: true, breakLine: true, fontSize: 12, color: "555555" } },
  { text: "沙具摆放位置反映潜意识关系", options: { bullet: true, breakLine: true, fontSize: 12, color: "555555" } },
  { text: "情绪外化：将抽象情绪实体化", options: { bullet: true, fontSize: 12, color: "555555" } },
], { x: 0.7, y: 1.9, w: 3.8, h: 3.0, fontFace: "Calibri", valign: "top", margin: 0 });

// Right column - CBT + Emotion theories
s5.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.3, w: 4.3, h: 3.8,
  fill: { color: C.bg }, shadow: makeShadow()
});
s5.addText("情绪管理理论支撑", {
  x: 5.4, y: 1.4, w: 3.9, h: 0.4,
  fontSize: 16, bold: true, color: C.primary, margin: 0
});
s5.addText([
  { text: "情绪 ABC 理论（认知行为疗法）", options: { bullet: true, breakLine: true, fontSize: 12, color: "555555" } },
  { text: "5-4-3-2-1 着陆法（正念技术）", options: { bullet: true, breakLine: true, fontSize: 12, color: "555555" } },
  { text: "我句式沟通（非暴力沟通）", options: { bullet: true, breakLine: true, fontSize: 12, color: "555555" } },
  { text: "自我关怀书信练习（Self-Compassion）", options: { bullet: true, breakLine: true, fontSize: 12, color: "555555" } },
  { text: "压力泡泡法（外化技术）", options: { bullet: true, fontSize: 12, color: "555555" } },
], { x: 5.4, y: 1.9, w: 3.9, h: 3.0, fontFace: "Calibri", valign: "top", margin: 0 });

// Bottom highlight
s5.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 5.1, w: 9, h: 0.4,
  fill: { color: C.dark }
});
s5.addText("✅ 经 MECE + SMART 原则系统审查，覆盖沙盘教学六大维度", {
  x: 0.5, y: 5.1, w: 9, h: 0.4,
  fontSize: 12, color: C.accent, align: "center", margin: 0, fontFace: "Calibri"
});
s5.addNotes(`
【讲解话术 · 2分钟】
情绪花园不是拍脑袋做的，每一个设计都有心理学理论支撑。

左边是沙盘游戏疗法的理论基础。我们借鉴了多拉·卡尔夫的经典理论——「自由与受保护的空间」。在数字沙盘中，孩子可以自由选择放什么沙具、放在哪里，没有人评判对错。12个沙具各自有明确的心理学象征意义，比如镜子象征自我认同、锁链象征压力感、鸽子象征和解。沙具的摆放位置本身就是心理状态的投射——我们把乌云放在小屋旁边意味着什么？这些都可以作为后续心理咨询的素材。

右边是情绪管理的具体技术。每一条小贴士都是可操作的心理学工具：
- 5-4-3-2-1着陆法帮助从情绪风暴中回到当下
- 我句式沟通帮助表达真实感受
- 自我关怀书信练习帮助应对自我否定

我们还用MECE（相互独立、完全穷尽）和SMART（具体、可衡量、可达成、相关、有时限）两个方法论对整个产品做了系统审查，确保六大维度没有遗漏。
`);

// ==================== SLIDE 6: Emotional Data Tracking ====================
let s6 = pres.addSlide();
s6.background = { color: C.dark };
s6.addText("📊 从「记录」到「看见」", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 30, fontFace: "Georgia", bold: true,
  color: C.accent, align: "center", margin: 0
});

// Pie chart data
s6.addChart(pres.charts.PIE, [{
  name: "情绪分布",
  labels: ["开心 😊", "平静 😌", "难过 😢", "生气 😤"],
  values: [35, 30, 20, 15]
}], {
  x: 0.5, y: 1.3, w: 4, h: 3.2,
  showPercent: true,
  showTitle: false,
  showLegend: true,
  legendPos: "b",
  chartColors: ["FFD700", "87CEEB", "A9A9A9", "FF6B6B"],
  dataLabelColor: "FFFFFF",
  dataLabelFontSize: 12,
});

// Features list on right
s6.addShape(pres.shapes.RECTANGLE, {
  x: 5.0, y: 1.3, w: 4.5, h: 3.5,
  fill: { color: "3A4A9E" }
});
s6.addText([
  { text: "📈 7天情绪趋势图", options: { breakLine: true, fontSize: 16, bold: true, color: C.accent } },
  { text: "堆叠柱状图显示每日情绪频率\n", options: { breakLine: true, fontSize: 12, color: "CADCFC" } },
  { text: "🎯 一句话情绪总结", options: { breakLine: true, fontSize: 16, bold: true, color: C.accent } },
  { text: "「本周😊出现3次，占比最高🏆」\n", options: { breakLine: true, fontSize: 12, color: "CADCFC" } },
  { text: "📋 情绪成长报告", options: { breakLine: true, fontSize: 16, bold: true, color: C.accent } },
  { text: "含饼图·趋势·成就·可打印HTML\n", options: { breakLine: true, fontSize: 12, color: "CADCFC" } },
  { text: "🏆 成就徽章系统", options: { breakLine: true, fontSize: 16, bold: true, color: C.accent } },
  { text: "6个成就·解锁动画·可视化激励", options: { fontSize: 12, color: "CADCFC" } },
], { x: 5.3, y: 1.5, w: 4.0, h: 3.0, fontFace: "Calibri", valign: "top", margin: 0 });

s6.addNotes(`
【讲解话术 · 1.5分钟】
情绪花园最核心的价值在于——它让情绪「被看见」。

传统的情绪日记就是写写写，写完了就放一边了。但在情绪花园里，每一次记录都会变成：
- 沙盘上的一朵花（视觉反馈）
- 趋势图上的一根柱子（数据反馈）
- 成就系统里的一个进度（游戏化反馈）

看这个饼图——这是模拟数据。当孩子坚持记录一段时间后，打开日记面板，一眼就能看到「我这周开心的天数最多」「难过主要集中在周三」。这种可视化的自我认知，是传统纸笔日记完全做不到的。

还有情绪成长报告——一键生成包含饼图、趋势图、成就徽章的HTML文件，可以直接打开打印。比赛的时候，评委拿到这份图文并茂的报告，比任何口头描述都有说服力。
`);

// ==================== SLIDE 7: Technical Architecture ====================
let s7 = pres.addSlide();
s7.background = { color: C.white };
s7.addText("🛠️ 技术架构", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Georgia", bold: true,
  color: C.dark, margin: 0
});
s7.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 0.95, w: 1.2, h: 0.04,
  fill: { color: C.primary }
});

// Architecture boxes
s7.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.3, w: 2.7, h: 3.5,
  fill: { color: C.bg }, shadow: makeShadow()
});
s7.addText("单文件架构", {
  x: 0.6, y: 1.4, w: 2.5, h: 0.4,
  fontSize: 16, bold: true, color: C.primary, margin: 0
});
s7.addText([
  { text: "HTML + CSS + JS 全内联", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "零外部依赖（除Three.js CDN）", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "localStorage 数据持久化", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "Canvas 原生图表 (无第三方库)", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "纯前端，无服务器成本", options: { bullet: true, fontSize: 12 } },
], { x: 0.7, y: 1.9, w: 2.4, h: 2.5, fontFace: "Calibri", color: "555555", valign: "top", margin: 0 });

s7.addShape(pres.shapes.RECTANGLE, {
  x: 3.6, y: 1.3, w: 2.7, h: 3.5,
  fill: { color: C.bg }, shadow: makeShadow()
});
s7.addText("3D 渲染", {
  x: 3.7, y: 1.4, w: 2.5, h: 0.4,
  fontSize: 16, bold: true, color: C.primary, margin: 0
});
s7.addText([
  { text: "Three.js r160 (ES Module)", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "OrbitControls 自由视角", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "UnrealBloomPass 发光特效", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "CSS2DRenderer 文字标签", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "阴影映射 + PCF软阴影", options: { bullet: true, fontSize: 12 } },
], { x: 3.7, y: 1.9, w: 2.5, h: 2.5, fontFace: "Calibri", color: "555555", valign: "top", margin: 0 });

s7.addShape(pres.shapes.RECTANGLE, {
  x: 6.7, y: 1.3, w: 2.8, h: 3.5,
  fill: { color: C.bg }, shadow: makeShadow()
});
s7.addText("跨平台封装", {
  x: 6.8, y: 1.4, w: 2.6, h: 0.4,
  fontSize: 16, bold: true, color: C.primary, margin: 0
});
s7.addText([
  { text: "macOS: Swift + WKWebView", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "Windows: Electron + builder", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "iOS: PWA + Service Worker", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "全部离线可用", options: { bullet: true, breakLine: true, fontSize: 12 } },
  { text: "GitHub 版本管理", options: { bullet: true, fontSize: 12 } },
], { x: 6.8, y: 1.9, w: 2.6, h: 2.5, fontFace: "Calibri", color: "555555", valign: "top", margin: 0 });

// Stats bar at bottom
s7.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 5.0, w: 9, h: 0.5,
  fill: { color: C.dark }
});
s7.addText("情绪花园 v4.0  ·  1500+ 行代码  ·  12 种沙具  ·  6 个成就  ·  3 个平台", {
  x: 0.5, y: 5.0, w: 9, h: 0.5,
  fontSize: 12, color: C.accent, align: "center", margin: 0, fontFace: "Calibri"
});
s7.addNotes(`
【讲解话术 · 1分钟】
技术层面，情绪花园有几个值得说的设计亮点：

第一、单文件架构。整个应用就是一个HTML文件，HTML、CSS、JavaScript全部内联。这意味着你可以直接双击打开，不需要安装任何东西，不需要服务器。Three.js从CDN加载，网络畅通时一次加载后就缓存了。

第二、纯 Canvas 图表。情绪趋势图和成长报告中的饼图，我们全部用原生 Canvas 绘制，没有引入任何第三方图表库。这样做的目的是保持单文件体积小巧，同时不依赖外部服务。

第三、跨平台封装。同一个HTML文件，我们提供了三种封装方式：
- macOS上用Swift + WKWebView创建一个原生.app包
- Windows上用Electron打包成可安装应用
- iOS上通过PWA（Progressive Web App）实现离线访问和添加到主屏幕

全部离线可用，这对学校场景特别重要——不需要联网也能用。
`);

// ==================== SLIDE 8: Improvement Journey ====================
let s8 = pres.addSlide();
s8.background = { color: C.white };
s8.addText("📋 改善路径：从 v1 到 v4", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Georgia", bold: true,
  color: C.dark, margin: 0
});
s8.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 0.95, w: 1.2, h: 0.04,
  fill: { color: C.primary }
});

const phases = [
  { label: "Phase 1", title: "低垂果实", time: "1天", items: "沙具选择面板\n小贴士双态显示\n隐私提示·清空确认" },
  { label: "Phase 2", title: "核心升级", time: "3-5天", items: "7天情绪趋势图\n6个成就系统\n沙具删除·叙事引导" },
  { label: "Phase 3", title: "比赛冲刺", time: "5-10天", items: "情绪成长报告\n6个新沙具(共12个)\n三平台封装" },
  { label: "v4.0", title: "综合版", time: "完成", items: "1500+行代码\n20+心理学小贴士\n跨平台部署" }
];

phases.forEach((p, i) => {
  const x = 0.4 + i * 2.4;
  s8.addShape(pres.shapes.RECTANGLE, {
    x, y: 1.4, w: 2.1, h: 3.6,
    fill: { color: i === 3 ? C.primary : C.bg },
    shadow: makeShadow()
  });
  const labelColor = i === 3 ? C.white : C.primary;
  const textColor = i === 3 ? C.white : C.text;
  const descColor = i === 3 ? "FFE0E0" : "666666";

  s8.addText(p.label, { x, y: 1.5, w: 2.1, h: 0.3, fontSize: 11, bold: true, color: labelColor, align: "center", margin: 0 });
  s8.addText(p.title, { x, y: 1.75, w: 2.1, h: 0.4, fontSize: 18, bold: true, color: textColor, align: "center", margin: 0 });
  s8.addText(`⏱ ${p.time}`, { x, y: 2.15, w: 2.1, h: 0.25, fontSize: 10, color: descColor, align: "center", margin: 0, italic: true });
  s8.addText(p.items, { x: x + 0.1, y: 2.5, w: 1.9, h: 2.2, fontSize: 12, color: descColor, fontFace: "Calibri", align: "center", margin: 0 });
});

s8.addNotes(`
【讲解话术 · 1分钟】
这个产品不是一天建成的。我们按照MECE+SMART的审查结果，分了三个阶段来迭代：

Phase 1 低垂果实——改得少、见效快。把随机添加沙具改成选择面板，小贴士从一大段文字改成一句金句+可展开，加上了隐私提示和清空确认。这些改动只用了1天，但体验提升非常大。

Phase 2 核心升级——增加了情绪趋势图、成就系统、叙事引导。让沙盘从「好看的工具」变成「孩子愿意持续使用的伙伴」。

Phase 3 比赛冲刺——增加了情绪成长报告、6个新沙具（从6个扩展到12个）、以及三个平台的封装。

现在的v4.0版本，1500多行代码，包含20多条青春期专属心理学小贴士，真正做到了一个可以在比赛中展示的完整作品。
`);

// ==================== SLIDE 9: Demo Video Guide ====================
let s9 = pres.addSlide();
s9.background = { color: C.dark };
s9.addText("🎬 操作演示指南", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 28, fontFace: "Georgia", bold: true,
  color: C.accent, align: "center", margin: 0
});

// Demo steps as numbered list
s9.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.3, w: 9, h: 1.0,
  fill: { color: "3A4A9E" }
});
s9.addText("🎥 推荐使用 OBS Studio 录制，分辨率 1920×1080，时长建议 3-5 分钟", {
  x: 0.7, y: 1.4, w: 8.6, h: 0.8,
  fontSize: 14, color: C.accent, align: "center", margin: 0, fontFace: "Calibri"
});

const steps = [
  "打开欢迎页面 → 展示引导卡（10秒）",
  "点击开始探索 → 展示12种沙具的3D场景（15秒）",
  "点击「添加」→ 展示沙具选择面板 → 选一个沙具放置（20秒）",
  "点击沙具 → 展示金句小贴士 → 展开查看完整内容（15秒）",
  "拖拽沙具移动位置 → 展示拖拽交互（10秒）",
  "点击「写心情」→ 选择情绪 → 写文字 → 种花（20秒）",
  "打开日记 → 展示情绪趋势图 → 查看成就（15秒）",
  "点击「讲故事」→ 输入花园信息（15秒）",
  "点击「成长报告」→ 生成并展示报告HTML（15秒）",
  "展示macOS/Windows/iOS三个平台的效果（20秒）"
];

steps.forEach((step, i) => {
  const row = Math.floor(i / 2);
  const col = i % 2;
  const x = 0.5 + col * 4.7;
  const y = 2.6 + row * 0.45;
  s9.addText(`Step ${i + 1}  ${step}`, {
    x, y, w: 4.4, h: 0.4,
    fontSize: 11, color: "CADCFC", fontFace: "Calibri", margin: 0
  });
});

s9.addNotes(`
【讲解话术 · 配合演示视频】
这里是我们推荐的操作演示流程，一共10步，3-5分钟就能完整展示所有核心功能。

如果现场有网络条件，建议直接打开HTML文件做实时演示。如果环境有限制，可以提前录制好演示视频。

录制建议用OBS Studio，免费开源，画质好。分辨率1920×1080，配上语音讲解效果最佳。

演示结束后，可以现场生成一份成长报告——只要之前有记录过数据，点击「成长报告」按钮，就能看到一份包含饼图、趋势图的完整HTML报告，直接打印出来就是很好的展示材料。
`);

// ==================== SLIDE 10: Thank You ====================
let s10 = pres.addSlide();
s10.background = { color: C.dark };
s10.addText("🌱 谢谢聆听", {
  x: 0.5, y: 1.2, w: 9, h: 1.0,
  fontSize: 44, fontFace: "Georgia", bold: true,
  color: C.accent, align: "center", margin: 0
});
s10.addText("情绪花园 · 数字沙盘情绪管理工具", {
  x: 0.5, y: 2.2, w: 9, h: 0.5,
  fontSize: 18, color: C.white, align: "center", margin: 0
});
s10.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 3.0, w: 3, h: 0.04,
  fill: { color: C.primary }
});
s10.addText("github.com/pengzhan00/emotion-garden-sandplay", {
  x: 0.5, y: 3.3, w: 9, h: 0.4,
  fontSize: 14, color: "87CEEB", align: "center", margin: 0, fontFace: "Calibri"
});
s10.addText("欢迎提问 · 欢迎体验 · 欢迎改善", {
  x: 0.5, y: 3.8, w: 9, h: 0.4,
  fontSize: 16, color: C.lightText, align: "center", margin: 0, fontFace: "Calibri"
});
s10.addNotes(`
【结语话术 · 1分钟】
情绪花园的核心理念，用一句话说就是：

别让孩子觉得他们在「上课」或「被治疗」，让他们觉得在「养花园」「搭积木」「玩游戏」——在这个过程中，顺带学会了认识和管理自己的情绪。

这个项目会持续迭代。如果有任何建议或者想法，欢迎在GitHub上提issue或者直接联系我们。谢谢大家！

（如果现场有时间，可以打开HTML做快速演示）
`);

// ==================== WRITE FILE ====================
const outputPath = path.join(__dirname, "情绪花园_展示PPT.pptx");
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log("✅ PPT created: " + outputPath);
  console.log("   Slides: 10");
  console.log("   Includes speaker notes on every slide");
}).catch(err => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
