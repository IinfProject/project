// PAGE NAVIGATION
function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('active'); });
  document.getElementById('page-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
  window.scrollTo(0, 0);
  if (id === 'sights' && !bigbenInit) initBigBen();
}

// HERO CANVAS
var heroInit = false;
function initHeroCanvas() {
  heroInit = true;
  var canvas = document.getElementById('canvas-hero');
  var ctx = canvas.getContext('2d');
  var W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < 130; i++) {
    particles.push({
      x: Math.random() * 2000, y: Math.random() * 600,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.1,
      a: Math.random() * 0.6 + 0.3
    });
  }

  function drawSkyline() {
    ctx.fillStyle = 'rgba(43,108,176,0.07)';
    ctx.beginPath();
    ctx.rect(W*0.12, H*0.35, W*0.025, H*0.55);
    ctx.rect(W*0.108, H*0.25, W*0.049, H*0.12);
    ctx.rect(W*0.36, H*0.4, W*0.02, H*0.5);
    ctx.rect(W*0.44, H*0.4, W*0.02, H*0.5);
    ctx.moveTo(W*0.62, H*0.1);
    ctx.lineTo(W*0.605, H*0.9);
    ctx.lineTo(W*0.635, H*0.9);
    ctx.closePath();
    ctx.arc(W*0.5, H*0.42, W*0.03, Math.PI, 0);
    ctx.rect(W*0.47, H*0.42, W*0.06, H*0.48);
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#020510');
    grad.addColorStop(0.6, '#0d1828');
    grad.addColorStop(1, '#111827');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    drawSkyline();
    for (var i = 0; i < 70; i++) {
      var x = (i / 70) * W;
      var y = H * 0.78 + Math.sin(Date.now() * 0.001 + i * 0.3) * 7;
      ctx.fillStyle = 'rgba(43,108,176,' + (0.04 + Math.sin(Date.now() * 0.002 + i) * 0.02) + ')';
      ctx.fillRect(x, y, W/70 + 1, 2);
    }
    particles.forEach(function(p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      var pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.002 + p.x);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,190,150,' + (p.a * pulse * 0.7) + ')';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

initHeroCanvas();

// 3D BIG BEN
var bigbenInit = false;
function initBigBen() {
  bigbenInit = true;
  var canvas = document.getElementById('canvas-bigben');
  if (!canvas) return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 2, 10);

  scene.add(new THREE.AmbientLight(0xfff0cc, 0.5));
  var dirLight = new THREE.DirectionalLight(0xffe090, 1.2);
  dirLight.position.set(3, 6, 4);
  scene.add(dirLight);
  var rimLight = new THREE.DirectionalLight(0x3355aa, 0.4);
  rimLight.position.set(-4, 2, -3);
  scene.add(rimLight);

  var gold = new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: 0.5, metalness: 0.7 });
  var stone = new THREE.MeshStandardMaterial({ color: 0x8a7d5a, roughness: 0.8, metalness: 0.1 });
  var darkStone = new THREE.MeshStandardMaterial({ color: 0x3d3520, roughness: 0.9, metalness: 0.0 });
  var clockFace = new THREE.MeshStandardMaterial({ color: 0xf5efe0, roughness: 0.5, metalness: 0.1 });

  var tower = new THREE.Group();

  tower.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 2.6), stone), { position: { x:0, y:-4.8, z:0 } }));
  var base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 2.6), stone);
  base.position.y = -4.8;
  tower.add(base);

  var body = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 2), stone);
  body.position.y = -2.3;
  tower.add(body);

  for (var i = 0; i < 4; i++) {
    var band = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 2.1), darkStone);
    band.position.y = -4.2 + i * 1.1;
    tower.add(band);
  }

  var windowMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 1 });
  var winGeo = new THREE.BoxGeometry(0.35, 0.6, 0.05);
  [[0.8,-1.5],[-0.8,-1.5],[0,-1.5],[0.8,-2.8],[-0.8,-2.8]].forEach(function(pos) {
    var w = new THREE.Mesh(winGeo, windowMat);
    w.position.set(pos[0], pos[1], 1.02);
    tower.add(w);
    var wb = new THREE.Mesh(winGeo, windowMat);
    wb.position.set(pos[0], pos[1], -1.02);
    tower.add(wb);
  });

  var clockSection = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 2.2), darkStone);
  clockSection.position.y = 0.4;
  tower.add(clockSection);

  var clockGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.08, 32);
  [
    { pos: [0,0.4,1.12], rot: [Math.PI/2,0,0] },
    { pos: [0,0.4,-1.12], rot: [-Math.PI/2,0,0] },
    { pos: [1.12,0.4,0], rot: [0,0,Math.PI/2] },
    { pos: [-1.12,0.4,0], rot: [0,0,-Math.PI/2] }
  ].forEach(function(s) {
    var face = new THREE.Mesh(clockGeo, clockFace);
    face.position.set(s.pos[0], s.pos[1], s.pos[2]);
    face.rotation.set(s.rot[0], s.rot[1], s.rot[2]);
    tower.add(face);
  });

  var belfry = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.2, 2.3), stone);
  belfry.position.y = 1.9;
  tower.add(belfry);

  var spireBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 1.8), darkStone);
  spireBase.position.y = 2.75;
  tower.add(spireBase);

  var spire = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.0, 8), gold);
  spire.position.y = 4.55;
  tower.add(spire);

  var finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), gold);
  finial.position.y = 6.1;
  tower.add(finial);

  [[-0.9,1.65],[0.9,1.65],[-0.9,-1.65],[0.9,-1.65]].forEach(function(p) {
    var pin = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.0, 6), gold);
    pin.position.set(p[0], 3.55, p[1]);
    tower.add(pin);
  });

  scene.add(tower);

  var isDragging = false, prevX = 0, rotY = 0, targetRotY = 0, autoSpin = true;
  canvas.addEventListener('mousedown', function(e) { isDragging = true; prevX = e.clientX; autoSpin = false; });
  canvas.addEventListener('touchstart', function(e) { isDragging = true; prevX = e.touches[0].clientX; autoSpin = false; });
  window.addEventListener('mouseup', function() { isDragging = false; });
  window.addEventListener('touchend', function() { isDragging = false; });
  window.addEventListener('mousemove', function(e) { if (!isDragging) return; targetRotY += (e.clientX - prevX) * 0.01; prevX = e.clientX; });
  canvas.addEventListener('touchmove', function(e) { if (!isDragging) return; targetRotY += (e.touches[0].clientX - prevX) * 0.01; prevX = e.touches[0].clientX; });

  function animate() {
    requestAnimationFrame(animate);
    if (autoSpin) targetRotY += 0.005;
    rotY += (targetRotY - rotY) * 0.08;
    tower.rotation.y = rotY;
    tower.position.y = Math.sin(Date.now() * 0.001) * 0.08;
    renderer.render(scene, camera);
  }
  animate();
}