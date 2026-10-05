import * as THREE from "three";

/**
 * Hero light study.
 *
 * A dark board-marked concrete room. Low sun behind the back wall enters through
 * vertical slits and lays blades of light across the floor. The sun drifts
 * slowly so the blades move the way they would over a real afternoon.
 * Everything is procedural: no models, no textures to download.
 */

export type SceneOptions = {
  canvas: HTMLCanvasElement;
  reducedMotion: boolean;
  lowPower: boolean;
};

type Vec3 = [number, number, number];

const CAMERA_FROM: Vec3 = [0.8, 3.4, 18];
const CAMERA_TO: Vec3 = [0.4, 2.7, 10.5];
const LOOK_AT: Vec3 = [-0.3, 1.25, -4];

function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Seeded PRNG so the concrete looks identical on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Board-marked concrete: panel joints, tie holes, low-frequency staining. */
function concreteTexture(size: number, panels: boolean) {
  const rand = mulberry32(panels ? 7 : 19);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.fillStyle = "#8f8d88";
  g.fillRect(0, 0, size, size);

  // Soft stains
  for (let i = 0; i < 90; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = (0.04 + rand() * 0.18) * size;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    const light = rand() > 0.5;
    grd.addColorStop(0, light ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Fine grain
  const img = g.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * 18;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);

  if (panels) {
    const cols = 2;
    const rows = 4;
    g.strokeStyle = "rgba(30,30,30,0.35)";
    g.lineWidth = Math.max(1, size / 700);
    for (let i = 1; i < cols; i++) {
      g.beginPath();
      g.moveTo((i * size) / cols, 0);
      g.lineTo((i * size) / cols, size);
      g.stroke();
    }
    for (let j = 1; j < rows; j++) {
      g.beginPath();
      g.moveTo(0, (j * size) / rows);
      g.lineTo(size, (j * size) / rows);
      g.stroke();
    }
    // Tie holes, six per panel, the way formwork is actually bolted.
    g.fillStyle = "rgba(25,25,25,0.55)";
    const pw = size / cols;
    const ph = size / rows;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        for (const fx of [0.18, 0.82]) {
          for (const fy of [0.2, 0.5, 0.8]) {
            g.beginPath();
            g.arc(i * pw + fx * pw, j * ph + fy * ph, size / 260, 0, Math.PI * 2);
            g.fill();
          }
        }
      }
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

/** The haze behind the slit wall: warm near the horizon, falling to dusk above. */
function hazeTexture() {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, "#3a3835");
  grd.addColorStop(0.45, "#b9a58a");
  grd.addColorStop(0.62, "#f3dcbc");
  grd.addColorStop(0.75, "#e8cfae");
  grd.addColorStop(1, "#5c554d");
  g.fillStyle = grd;
  g.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class LightStudy {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private sun: THREE.DirectionalLight;
  private hemi: THREE.HemisphereLight;
  private t0 = 0;
  private elapsed = 0;
  private raf = 0;
  private running = false;
  private disposed = false;
  private introStart = -1;
  private introDuration = 3.6;
  private pointer = new THREE.Vector2();
  private pointerEased = new THREE.Vector2();
  private scroll = 0;
  private scrollEased = 0;
  private lookAt = new THREE.Vector3(...LOOK_AT);
  private reducedMotion: boolean;
  private disposables: { dispose: () => void }[] = [];

  constructor({ canvas, reducedMotion, lowPower }: SceneOptions) {
    this.reducedMotion = reducedMotion;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !lowPower,
      powerPreference: "high-performance",
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    const night = new THREE.Color("#0f1112");
    this.scene.background = night;
    this.scene.fog = new THREE.Fog(night, 9, 34);

    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    this.camera.position.set(...(reducedMotion ? CAMERA_TO : CAMERA_FROM));

    this.hemi = new THREE.HemisphereLight("#b4bcc2", "#2a2724", 0.75);
    this.scene.add(this.hemi);
    // Cool fill from the viewer's side so the board marks read in the shade.
    const fill = new THREE.DirectionalLight("#9fb0bd", 0.35);
    fill.position.set(-4, 6, 14);
    this.scene.add(fill);

    this.sun = new THREE.DirectionalLight("#ffd7ab", 0);
    this.sun.castShadow = true;
    const s = lowPower ? 1024 : 2048;
    this.sun.shadow.mapSize.set(s, s);
    this.sun.shadow.camera.left = -12;
    this.sun.shadow.camera.right = 12;
    this.sun.shadow.camera.top = 12;
    this.sun.shadow.camera.bottom = -12;
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 60;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.02;
    this.sun.shadow.radius = 3;
    this.sun.target.position.set(0, 0, 0);
    this.scene.add(this.sun, this.sun.target);

    // A faint warm bounce where the blades land, standing in for global illumination.
    const bounce = new THREE.PointLight("#c9a27a", 0, 14, 2);
    bounce.position.set(0.5, 0.4, -1.5);
    bounce.name = "bounce";
    this.scene.add(bounce);

    this.build();
    this.setSun(0);
    if (reducedMotion) {
      this.sun.intensity = 4.2;
      bounce.intensity = 3.2;
    }
  }

  private build() {
    const wallTex = concreteTexture(1024, true);
    const floorTex = concreteTexture(1024, false);
    this.disposables.push(wallTex, floorTex);

    const wallMat = (repeatX: number, repeatY: number) => {
      const t = wallTex.clone();
      t.needsUpdate = true;
      t.repeat.set(repeatX, repeatY);
      const m = new THREE.MeshStandardMaterial({ color: "#a5a29c", map: t, roughness: 0.92, metalness: 0 });
      this.disposables.push(t, m);
      return m;
    };

    const add = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      pos: Vec3,
      { cast = true, receive = true }: { cast?: boolean; receive?: boolean } = {},
    ) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.castShadow = cast;
      mesh.receiveShadow = receive;
      this.scene.add(mesh);
      this.disposables.push(geo);
      return mesh;
    };

    // Floor: honed stone, slightly smoother so the blades read as light, not paint.
    floorTex.repeat.set(6, 6);
    const floorMat = new THREE.MeshStandardMaterial({ color: "#8d8a84", map: floorTex, roughness: 0.62 });
    this.disposables.push(floorMat);
    const floor = add(new THREE.PlaneGeometry(60, 60), floorMat, [0, 0, 0], { cast: false });
    floor.rotation.x = -Math.PI / 2;

    // Back wall: a rhythm of piers. Gaps are irregular on purpose.
    const H = 8.5;
    const D = 0.7;
    const zBack = -7;
    const piers = [1.6, 0.9, 0.55, 1.25, 0.4, 0.75, 1.9, 0.6, 1.1, 2.2];
    const gaps = [0.07, 0.11, 0.06, 0.16, 0.05, 0.09, 0.12, 0.06, 0.1];
    const total = piers.reduce((a, b) => a + b, 0) + gaps.reduce((a, b) => a + b, 0);
    let x = -total / 2 - 0.6;
    piers.forEach((w, i) => {
      add(new THREE.BoxGeometry(w, H, D), wallMat(w / 2.2, H / 4.4), [x + w / 2, H / 2, zBack]);
      x += w + (gaps[i] ?? 0);
    });
    // Lintel band above the slits keeps the opening proportioned like a room, not a fence.
    add(new THREE.BoxGeometry(total + 6, 1.4, D), wallMat(6, 0.7), [-0.6, H + 0.7, zBack]);

    // Side walls and a roof slab with a long skylight slot.
    add(new THREE.BoxGeometry(D, H + 1.4, 20), wallMat(4.5, 2.2), [-6.4, (H + 1.4) / 2, 2.6]);
    add(new THREE.BoxGeometry(D, H + 1.4, 9), wallMat(2, 2.2), [6.6, (H + 1.4) / 2, -2.9]);
    add(new THREE.BoxGeometry(14, 0.6, 6.2), wallMat(3, 1.5), [0, H + 1.7, -4.2]);
    add(new THREE.BoxGeometry(14, 0.6, 7.5), wallMat(3, 1.8), [0, H + 1.7, 4.4]);

    // Cantilevered stair rising along the left wall.
    const stepMat = new THREE.MeshStandardMaterial({ color: "#b9b1a4", roughness: 0.8 });
    this.disposables.push(stepMat);
    for (let i = 0; i < 12; i++) {
      add(new THREE.BoxGeometry(1.5, 0.16, 0.62), stepMat, [-5.3, 0.42 + i * 0.52, 1.8 - i * 0.62]);
    }

    // A single travertine bench: the only object in the room.
    const benchMat = new THREE.MeshStandardMaterial({ color: "#c2b6a2", roughness: 0.7 });
    this.disposables.push(benchMat);
    add(new THREE.BoxGeometry(3.4, 0.46, 0.9), benchMat, [2.6, 0.23, -5.2]);

    // Haze beyond the wall. Unlit, unfogged, so the slits glow.
    const hazeTex = hazeTexture();
    const hazeMat = new THREE.MeshBasicMaterial({ map: hazeTex, fog: false, toneMapped: true });
    this.disposables.push(hazeTex, hazeMat);
    add(new THREE.PlaneGeometry(80, 26), hazeMat, [0, 6, -18], { cast: false, receive: false });
  }

  /** t in [0..1] maps the sun along a short arc behind the wall. */
  private setSun(t: number) {
    const azimuth = -0.32 + t * 0.5;
    const elevation = 0.36 - t * 0.06;
    const r = 30;
    this.sun.position.set(
      Math.sin(azimuth) * Math.cos(elevation) * r,
      Math.sin(elevation) * r,
      -Math.cos(azimuth) * Math.cos(elevation) * r,
    );
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
  }

  /** 0 at the top of the hero, 1 when the hero has scrolled out. */
  setScroll(p: number) {
    this.scroll = Math.min(1, Math.max(0, p));
    if (this.reducedMotion) this.renderOnce();
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    // Portrait screens get a wider lens so the slit wall stays in frame.
    this.camera.fov = width / height < 0.8 ? 52 : width / height < 1.2 ? 42 : 34;
    this.camera.updateProjectionMatrix();
    if (!this.running) this.renderOnce();
  }

  /** Starts the entrance: camera dolly and the sun coming up behind the wall. */
  playIntro() {
    if (this.reducedMotion) return;
    this.introStart = this.elapsed;
  }

  start() {
    if (this.running || this.disposed) return;
    if (this.reducedMotion) {
      this.renderOnce();
      return;
    }
    this.running = true;
    this.t0 = performance.now() / 1000 - this.elapsed;
    const loop = () => {
      if (!this.running) return;
      this.tick();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  renderOnce() {
    if (this.disposed) return;
    if (this.reducedMotion) {
      const p = this.scroll;
      this.camera.position.set(CAMERA_TO[0], CAMERA_TO[1] + p * 0.4, CAMERA_TO[2] - p * 2.5);
      this.camera.lookAt(this.lookAt);
      this.setSun(0.45);
    }
    this.renderer.render(this.scene, this.camera);
  }

  private tick() {
    const t = (this.elapsed = performance.now() / 1000 - this.t0);
    const intro = this.introStart < 0 ? 0 : Math.min(1, (t - this.introStart) / this.introDuration);
    const k = easeOutExpo(intro);

    // Sun rises first, then the camera settles: light before architecture.
    const sunK = this.introStart < 0 ? 0 : Math.min(1, (t - this.introStart) / 2.4);
    const bounce = this.scene.getObjectByName("bounce") as THREE.PointLight;
    this.sun.intensity = 4.2 * sunK * sunK;
    bounce.intensity = 3.2 * sunK;

    // A slow, slightly irregular drift. Roughly a minute per cycle.
    this.setSun(0.5 + Math.sin(t * 0.09) * 0.32 + Math.sin(t * 0.031) * 0.12);

    this.pointerEased.lerp(this.pointer, 0.035);
    this.scrollEased += (this.scroll - this.scrollEased) * 0.08;
    const p = this.scrollEased;

    const cx = CAMERA_FROM[0] + (CAMERA_TO[0] - CAMERA_FROM[0]) * k;
    const cy = CAMERA_FROM[1] + (CAMERA_TO[1] - CAMERA_FROM[1]) * k;
    const cz = CAMERA_FROM[2] + (CAMERA_TO[2] - CAMERA_FROM[2]) * k;
    this.camera.position.set(
      cx + this.pointerEased.x * 0.45,
      cy + this.pointerEased.y * 0.22 + p * 0.5,
      cz - p * 3.2,
    );
    this.lookAt.set(LOOK_AT[0] + this.pointerEased.x * 0.15, LOOK_AT[1] - p * 0.4, LOOK_AT[2]);
    this.camera.lookAt(this.lookAt);
    this.renderer.toneMappingExposure = 1.0 - p * 0.55;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
  }
}

export function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
