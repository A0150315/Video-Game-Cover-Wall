import * as THREE from 'three';

const CARD_W = 1.4;
const CARD_H = 2.1;
const BAND_GAP = 0.4;
const CARD_GAP = 0.3;
const BANDS = 2;
const FOV = 50;
const CAM_FRONT_DIST = 9;
const ROT_SPEED = 0.02;
const MAX_DPR = 1.5;

const INK_PALETTES: [number, number][] = [
  [0x24305e, 0x0e3a3a], // indigo / teal
  [0x3a1830, 0x24305e], // wine / indigo
  [0x0e3a3a, 0x1d3313], // teal / moss
  [0x1d3313, 0x3a1830], // moss / wine
];

const BG_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BG_FRAG = `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.3, 9.1); a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = vUv * 3.0;
  uv.x *= 1.8;
  float t = uTime * 0.015;
  // double domain warp (iq) — organic ink-bleed shapes
  vec2 q = vec2(fbm(uv + t * 0.3), fbm(uv + vec2(5.2, 1.3) - t * 0.2));
  vec2 r = vec2(fbm(uv + 2.0 * q + vec2(1.7, 9.2) + t * 0.15),
                fbm(uv + 2.0 * q + vec2(8.3, 2.8) - t * 0.12));
  float f = fbm(uv + 2.5 * r);
  vec3 col = vec3(0.012, 0.012, 0.018);
  col = mix(col, uColorA, smoothstep(0.35, 0.75, f) * 0.55);
  col = mix(col, uColorB, smoothstep(0.45, 0.9, length(q) * 0.9) * 0.35);
  col += uColorA * smoothstep(0.6, 0.95, r.x) * 0.18;
  col += noise(uv * 40.0) * 0.05 * smoothstep(0.4, 0.8, f); // granulation
  float d = distance(vUv, vec2(0.5));
  col *= 1.0 - smoothstep(0.3, 0.85, d) * 0.75;
  gl_FragColor = vec4(col, 1.0);
}
`;

export interface CoverWallHandle {
  dispose(): void;
}

interface Card {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  fading: boolean;
}

function bandCounts(n: number): number[] {
  const base = Math.floor(n / BANDS);
  const counts = Array.from({ length: BANDS }, () => base);
  for (let k = 0; k < n - base * BANDS; k++) counts[k % BANDS]++;
  return counts;
}

export function createCoverWall(container: HTMLElement, posters: string[]): CoverWallHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const counts = bandCounts(posters.length);
  const radius = (Math.max(...counts) * (CARD_W + CARD_GAP)) / (2 * Math.PI);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050507, 20, radius + 28);

  const camera = new THREE.PerspectiveCamera(
    FOV,
    container.clientWidth / container.clientHeight,
    0.1,
    200,
  );
  camera.position.set(1.2, 0, radius + CAM_FRONT_DIST);
  camera.lookAt(0, 0, 0);

  const palette = INK_PALETTES[Math.floor(Math.random() * INK_PALETTES.length)];
  const bgMaterial = new THREE.ShaderMaterial({
    vertexShader: BG_VERT,
    fragmentShader: BG_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(palette[0]) },
      uColorB: { value: new THREE.Color(palette[1]) },
    },
    depthWrite: false,
  });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(200, 110), bgMaterial);
  bg.position.z = -80;
  bg.renderOrder = -1;
  scene.add(bg);

  const wall = new THREE.Group();
  scene.add(wall);

  const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H);
  const loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';
  const maxAnisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

  const cards: Card[] = [];
  const placeholder = new THREE.DataTexture(new Uint8Array([24, 24, 29, 255]), 1, 1);
  placeholder.needsUpdate = true;
  const worldUp = new THREE.Vector3(0, 1, 0);
  let idx = 0;

  for (let b = 0; b < BANDS; b++) {
    const y = (b - (BANDS - 1) / 2) * (CARD_H + BAND_GAP);
    const ringR = Math.sqrt(radius * radius - y * y);
    const count = counts[b];
    for (let j = 0; j < count && idx < posters.length; j++, idx++) {
      const theta = (2 * Math.PI * j) / count + (b % 2) * (Math.PI / count);
      const normal = new THREE.Vector3(
        ringR * Math.sin(theta),
        y,
        ringR * Math.cos(theta),
      ).divideScalar(radius);

      const right = new THREE.Vector3().crossVectors(worldUp, normal).normalize();
      const cardUp = new THREE.Vector3().crossVectors(normal, right);
      const basis = new THREE.Matrix4().makeBasis(right, cardUp, normal);

      const material = new THREE.MeshBasicMaterial({
        map: placeholder,
        transparent: true,
        opacity: 1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(normal).multiplyScalar(radius);
      mesh.quaternion.setFromRotationMatrix(basis);
      wall.add(mesh);
      const card: Card = { mesh, fading: false };
      cards.push(card);

      loader.load(posters[idx], texture => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = maxAnisotropy;
        material.map = texture;
        material.opacity = 0;
        card.fading = true;
      });
    }
  }

  let last = performance.now();
  let rafId = 0;

  const params = new URLSearchParams(location.search);
  const DEBUG = params.has('debug');
  const HQ = params.has('hq');
  let tier = 0;
  let badWindows = 0;
  let frameCount = 0;
  let sumMs = 0;
  let worstMs = 0;
  let windowStart = performance.now();
  let windows = 0;

  const degrade = () => {
    if (HQ) return;
    if (tier === 0) {
      tier = 1;
      renderer.setPixelRatio(1.0);
      renderer.setSize(container.clientWidth, container.clientHeight);
      console.warn('[cover-wall] perf tier 1: pixelRatio lowered to 1.0');
    } else if (tier === 1) {
      tier = 2;
      bg.visible = false;
      scene.background = new THREE.Color(0x050507);
      console.warn('[cover-wall] perf tier 2: background shader removed');
    }
  };

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    const frameMs = now - last;
    last = now;
    const t = now / 1000;

    if (tier < 2) bgMaterial.uniforms.uTime.value = t;
    wall.rotation.y += ROT_SPEED * dt;
    camera.position.x = 1.2 + Math.sin(t * 0.05) * 0.4;
    camera.lookAt(0, 0, 0);

    for (const card of cards) {
      if (card.fading) {
        const m = card.mesh.material;
        m.opacity = Math.min(1, m.opacity + dt * 1.5);
        if (m.opacity >= 1) {
          card.fading = false;
          m.transparent = false;
        }
      }
    }

    renderer.render(scene, camera);

    frameCount++;
    sumMs += frameMs;
    if (frameMs > worstMs) worstMs = frameMs;
    if (now - windowStart >= 3000) {
      const avgMs = sumMs / frameCount;
      if (DEBUG) {
        console.log(
          `[perf] avg ${avgMs.toFixed(1)}ms worst ${worstMs.toFixed(1)}ms tier ${tier}`,
          `drawcalls ${renderer.info.render.calls} tris ${renderer.info.render.triangles}`,
        );
      }
      windows++;
      if (windows > 1 && frameCount > 60) {
        if (avgMs > 24) {
          badWindows++;
          if (badWindows >= 2) {
            badWindows = 0;
            if (tier < 2) degrade();
          }
        } else {
          badWindows = 0;
        }
      }
      frameCount = 0;
      sumMs = 0;
      worstMs = 0;
      windowStart = now;
    }

    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  return {
    dispose() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      for (const card of cards) {
        const map = card.mesh.material.map;
        if (map && map !== placeholder) map.dispose();
        card.mesh.material.dispose();
      }
      placeholder.dispose();
      geometry.dispose();
      bg.geometry.dispose();
      bgMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
