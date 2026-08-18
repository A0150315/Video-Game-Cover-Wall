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

// Ported from JRMeyer/ghostty-watercolors — wet-on-wet-bg.glsl (MIT-style, open source).
// Adaptations: hue as uniform (random per load), time-drifting noise domains,
// dimmed over dark base to sit behind the cover wall.
const BG_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BG_FRAG = `
uniform float uTime;
uniform float uHue;
varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += vnoise(p) * a; p *= 2.0; a *= 0.5; }
  return s;
}
void main() {
  float t = uTime * 0.05;
  vec2 p = vUv * vec2(1.75, 1.0) * 1.9 + vec2(uHue * 100.0, uHue * 73.0);

  // three pigments on wet paper (cosine palette)
  vec3 pigment1 = 0.35 + 0.2 * cos(6.28318 * (uHue + vec3(0.0, 0.33, 0.67)));
  vec3 pigment2 = 0.35 + 0.2 * cos(6.28318 * (uHue + 0.15 + vec3(0.0, 0.33, 0.67)));
  vec3 pigment3 = 0.35 + 0.2 * cos(6.28318 * (uHue + 0.4 + vec3(0.0, 0.33, 0.67)));

  // domain-warped soft bleed shapes
  vec2 q1 = vec2(fbm(p * 1.2 + t * 0.3), fbm(p * 1.2 + vec2(5.2, 1.3) - t * 0.2));
  float bloom1 = fbm(p * 1.2 + 3.0 * q1);
  vec2 q2 = vec2(fbm(p * 1.0 + vec2(8.0, 3.0) + t * 0.15), fbm(p * 1.0 + vec2(2.0, 7.0) - t * 0.1));
  float bloom2 = fbm(p * 1.0 + 3.0 * q2);
  float bloom3 = fbm(p * 1.4 + vec2(12.0, 5.0) + t * 0.1);

  float m1 = smoothstep(0.3, 0.7, bloom1);
  float m2 = smoothstep(0.35, 0.7, bloom2);
  float m3 = smoothstep(0.3, 0.65, bloom3);

  vec3 wash = mix(pigment1, pigment2, m1);
  wash = mix(wash, pigment3, m2 * 0.6);

  // water blooms — lighter spots where water pushed pigment away
  float waterBloom = fbm(p * 2.0 + vec2(20.0) + t * 0.15);
  wash = mix(wash, wash * 1.4, smoothstep(0.55, 0.75, waterBloom) * 0.25);

  // pigment concentration variation
  float concentration = fbm(p * 1.8 + vec2(15.0, 8.0) + t * 0.12);
  wash = mix(wash * 0.7, wash, smoothstep(0.3, 0.7, concentration));

  // paper grain
  wash *= 0.97 + 0.06 * vnoise(p * 40.0);
  wash = clamp(wash, 0.0, 1.0);

  vec3 col = vec3(0.012, 0.012, 0.018) + wash * (0.30 + 0.25 * m3);
  float d = distance(vUv, vec2(0.5));
  col *= 1.0 - smoothstep(0.35, 0.9, d) * 0.6;
  // encode linear working space to sRGB for display
  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
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

  const bgMaterial = new THREE.ShaderMaterial({
    vertexShader: BG_VERT,
    fragmentShader: BG_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uHue: { value: Math.random() },
    },
    depthWrite: false,
  });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(280, 160), bgMaterial);
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
