/* Interactive 3D hero scene (Three.js): floating laptop showing a VertexIQ site, with a glowing gold ring.
   Progressive enhancement: the HTML cards remain if WebGL is unavailable. */
(function () {
  var host = document.querySelector('.hero-visual');
  if (!host || typeof THREE === 'undefined') return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) { return; }

  var canvas = renderer.domElement;
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.insertBefore(canvas, host.firstChild);
  host.classList.add('has-3d');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var GOLD = 0xe2b25c, PURPLE = '#e2b25c';
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.3, 8);

  /* ---- Screen texture: a mini VertexIQ landing page drawn on a canvas ---- */
  function rrect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function makeScreen() {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 640;
    var g = c.getContext('2d');
    var bg = g.createLinearGradient(0, 0, 1024, 640);
    bg.addColorStop(0, '#0c0c12'); bg.addColorStop(1, '#1d1810');
    g.fillStyle = bg; g.fillRect(0, 0, 1024, 640);
    var glow = g.createRadialGradient(780, 220, 10, 780, 220, 330);
    glow.addColorStop(0, 'rgba(226,178,92,.40)'); glow.addColorStop(1, 'rgba(226,178,92,0)');
    g.fillStyle = glow; g.fillRect(0, 0, 1024, 640);
    g.fillStyle = '#fff'; g.font = '700 26px Inter, Arial'; g.fillText('VertexIQ', 56, 64);
    g.fillStyle = 'rgba(255,255,255,.55)'; g.font = '500 20px Inter, Arial';
    ['Home', 'Services', 'Work', 'Contact'].forEach(function (t, i) { g.fillText(t, 560 + i * 110, 62); });
    g.fillStyle = '#fff'; g.font = '800 62px Inter, Arial';
    g.fillText('Websites that', 56, 220); g.fillText('stand out.', 56, 292);
    g.fillStyle = '#e2b25c'; g.fillRect(56, 318, 90, 5);
    g.fillStyle = 'rgba(255,255,255,.6)'; g.font = '500 22px Inter, Arial';
    g.fillText('3D visuals. Fast. Built to convert.', 56, 372);
    g.fillStyle = PURPLE; rrect(g, 56, 410, 210, 58, 29); g.fill();
    g.fillStyle = '#1a1305'; g.font = '700 22px Inter, Arial'; g.fillText('Start a project', 84, 447);
    g.strokeStyle = '#e2b25c'; g.lineWidth = 3;
    g.beginPath(); g.arc(770, 300, 130, 0, Math.PI * 2); g.stroke();
    g.fillStyle = PURPLE; g.beginPath(); g.moveTo(770, 210); g.lineTo(850, 255); g.lineTo(770, 300); g.lineTo(690, 255); g.fill();
    g.fillStyle = '#a87a2a'; g.beginPath(); g.moveTo(690, 255); g.lineTo(770, 300); g.lineTo(770, 390); g.lineTo(690, 345); g.fill();
    g.fillStyle = '#f6dc9b'; g.beginPath(); g.moveTo(850, 255); g.lineTo(770, 300); g.lineTo(770, 390); g.lineTo(850, 345); g.fill();
    var tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }

  var laptop = new THREE.Group();
  scene.add(laptop);

  var metal = new THREE.MeshStandardMaterial({ color: 0x2a2a31, metalness: 0.9, roughness: 0.35 });
  var W = 3.2, D = 2.1, H = 0.11, SW = 3.2, SH = 2.0;

  laptop.add(new THREE.Mesh(new THREE.BoxGeometry(W, H, D), metal));
  var keys = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.86, D * 0.42),
    new THREE.MeshStandardMaterial({ color: 0x0b0b0f, roughness: 0.8 }));
  keys.rotation.x = -Math.PI / 2; keys.position.set(0, H / 2 + 0.002, -0.2);
  laptop.add(keys);
  var pad = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.34, D * 0.22),
    new THREE.MeshStandardMaterial({ color: 0x3a3a44, metalness: 0.8, roughness: 0.4 }));
  pad.rotation.x = -Math.PI / 2; pad.position.set(0, H / 2 + 0.002, 0.65);
  laptop.add(pad);

  var lid = new THREE.Group();
  lid.position.set(0, H / 2, -D / 2);
  lid.rotation.x = -0.28;
  laptop.add(lid);
  var shell = new THREE.Mesh(new THREE.BoxGeometry(SW, SH, 0.07), metal);
  shell.position.y = SH / 2;
  lid.add(shell);
  var screen = new THREE.Mesh(new THREE.PlaneGeometry(SW - 0.14, SH - 0.14),
    new THREE.MeshBasicMaterial({ map: makeScreen() }));
  screen.position.set(0, SH / 2, 0.037);
  lid.add(screen);
  laptop.position.y = -0.7;

  /* ---- Glowing gold ring behind ---- */
  var ring = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.025, 12, 160),
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.9 }));
  ring.position.set(0.2, 0.5, -1.6);
  scene.add(ring);
  var halo = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.18, 12, 160),
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.08 }));
  halo.position.copy(ring.position);
  scene.add(halo);

  /* ---- Dark glossy spheres + gold specks ---- */
  var sphereMat = new THREE.MeshStandardMaterial({ color: 0x111114, metalness: 1, roughness: 0.18 });
  var s1 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 40, 40), sphereMat);
  s1.position.set(2.5, -1.5, 0.8);
  var s2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), sphereMat);
  s2.position.set(-2.7, 1.5, -0.4);
  scene.add(s1, s2);

  var N = 140, pos = new Float32Array(N * 3);
  for (var p = 0; p < N; p++) {
    pos[p * 3] = (Math.random() - 0.5) * 11;
    pos[p * 3 + 1] = (Math.random() - 0.5) * 7;
    pos[p * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
  }
  var pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var points = new THREE.Points(pg, new THREE.PointsMaterial({ color: GOLD, size: 0.035, transparent: true, opacity: 0.7 }));
  scene.add(points);

  /* ---- Lights: warm gold rim + purple fill ---- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  var key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(3, 5, 6); scene.add(key);
  var goldLight = new THREE.PointLight(GOLD, 3, 18);
  goldLight.position.set(3, 2, -1); scene.add(goldLight);
  var fill = new THREE.PointLight(0xfff1d0, 1.6, 18);
  fill.position.set(-4, -1, 3); scene.add(fill);

  function resize() {
    var w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 500 ? 10 : 7.6;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  var tx = 0, ty = 0, mx = 0, my = 0;
  window.addEventListener('pointermove', function (e) {
    var r = host.getBoundingClientRect();
    tx = Math.max(-1.5, Math.min(1.5, ((e.clientX - r.left) / r.width - 0.5) * 2));
    ty = Math.max(-1.5, Math.min(1.5, ((e.clientY - r.top) / r.height - 0.5) * 2));
  }, { passive: true });

  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(host);
  }

  var clock = new THREE.Clock();
  function draw() {
    var t = clock.getElapsedTime();
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;
    var scroll = Math.min(window.scrollY / 800, 1);

    laptop.rotation.y = -0.45 + mx * 0.35 + Math.sin(t * 0.4) * 0.08 + scroll * 0.8;
    laptop.rotation.x = 0.12 + my * 0.12;
    laptop.position.y = -0.7 + Math.sin(t * 0.9) * 0.1;
    ring.rotation.z = t * 0.1; halo.rotation.z = t * 0.1;
    ring.position.x = 0.2 + mx * 0.25; halo.position.x = ring.position.x;
    s1.position.y = -1.5 + Math.sin(t * 0.8) * 0.15;
    s2.position.y = 1.5 + Math.cos(t * 0.7) * 0.15;
    points.rotation.y = t * 0.02;
    renderer.render(scene, camera);
  }
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    draw();
  }
  if (reduce) { draw(); } else { frame(); }
})();
