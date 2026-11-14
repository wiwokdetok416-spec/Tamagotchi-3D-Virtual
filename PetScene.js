import * as THREE from 'three';
import { soundFx } from '../audio/soundEffects';
// Reusable math vectors to prevent GC allocations in loop
const _vec3 = new THREE.Vector3();
const _color = new THREE.Color();
export class PetScene {
  container;
  renderer;
  scene;
  camera;
  clock;
  frameId = 0;
  isDisposed = false;
  isSoftwareGl = false;
  // Active scene objects
  currentPetId = 'milo';
  petGroup;
  environmentGroup;
  particleGroup;
  foodGroup;
  accessoryGroup;
  contactShadow;
  // J0ssy bot 3D companion
  jossyGroup = null;
  jossyEyeMesh = null;
  jossyGlowLight = null;
  jossyArmL = null;
  jossyArmR = null;
  jossyAntennaOrb = null;
  isJossyOwned = false;
  jossyBattery = 100;
  isJossySleeping = false;
  onJossyInteractedCallback;
  // Dancing state
  isDancing = false;
  currentDanceStyle = null;
  danceTimeout = null;
  // Pet bone/part references for animations
  petParts = {};
  // Interactive toy
  toyBall = null;
  toyBallVelocity = new THREE.Vector3(0, 0, 0);
  // Lighting
  dirLight;
  hemiLight;
  roomLight;
  // State
  isSleeping = false;
  isEating = false;
  isPetting = false;
  currentMood = 'happy';
  equippedHat = null;
  quality = 'medium';
  // Raycasting for interaction
  raycaster;
  mousePos;
  onPetInteractedCallback;
  resizeObserver;
  constructor(container, petId, quality = 'medium') {
    this.container = container;
    this.currentPetId = petId;
    this.quality = quality;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mousePos = new THREE.Vector2();
    // 1. Detect software WebGL
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();
    // 2. Setup Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl && quality !== 'low',
      powerPreference: 'high-performance',
      alpha: true,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.touchAction = 'none';
    // 3. Scene & Camera (Must be initialized BEFORE applyQualitySettings / onResize)
    this.scene = new THREE.Scene();
    const bgCol = this.currentPetId === 'fizzi' ? 0x0c4a6e : 0x1e1b4b;
    this.scene.background = new THREE.Color(bgCol);
    this.scene.fog = new THREE.FogExp2(bgCol, 0.03);
    const initW = Math.max(this.container.clientWidth || window.innerWidth || 400, 1);
    const initH = Math.max(this.container.clientHeight || window.innerHeight || 600, 1);
    this.camera = new THREE.PerspectiveCamera(40, initW / initH, 0.1, 50);
    this.camera.position.set(0, 2.2, 5.2);
    this.camera.lookAt(0, 0.9, 0);
    // Now safely apply quality settings
    this.applyQualitySettings(quality);
    // 4. Groups
    this.environmentGroup = new THREE.Group();
    this.petGroup = new THREE.Group();
    this.particleGroup = new THREE.Group();
    this.foodGroup = new THREE.Group();
    this.accessoryGroup = new THREE.Group();
    this.scene.add(this.environmentGroup);
    this.scene.add(this.petGroup);
    this.scene.add(this.particleGroup);
    this.scene.add(this.foodGroup);
    this.petGroup.add(this.accessoryGroup);
    // 5. Lighting
    this.hemiLight = new THREE.HemisphereLight(0xfffaed, 0x93c5fd, 0.9);
    this.scene.add(this.hemiLight);
    this.dirLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    this.dirLight.position.set(3, 6, 4);
    this.dirLight.castShadow = !this.isSoftwareGl && quality === 'high';
    if (this.dirLight.castShadow) {
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;
      this.dirLight.shadow.camera.near = 0.5;
      this.dirLight.shadow.camera.far = 15;
      const d = 3;
      this.dirLight.shadow.camera.left = -d;
      this.dirLight.shadow.camera.right = d;
      this.dirLight.shadow.camera.top = d;
      this.dirLight.shadow.camera.bottom = -d;
      this.dirLight.shadow.bias = -0.0005;
      this.dirLight.shadow.normalBias = 0.02;
    }
    this.scene.add(this.dirLight);
    this.roomLight = new THREE.PointLight(0xfef08a, 0.4, 8);
    this.roomLight.position.set(-2, 2.5, 1);
    this.scene.add(this.roomLight);
    // 6. Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(2.2, 2.2);
    const shadowTex = this.createRadialShadowTexture();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    this.contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = 0.01;
    this.scene.add(this.contactShadow);
    // 7. Build Environment & Pet
    this.buildEnvironment();
    this.buildPet(this.currentPetId);
    // 8. Event Listeners with ResizeObserver for exact container bounding
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.container);
    }
    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.onResize();
    // 9. Start Loop
    this.startLoop();
  }
  setPetInteractedCallback(cb) {
    this.onPetInteractedCallback = cb;
  }
  setJossyInteractedCallback(cb) {
    this.onJossyInteractedCallback = cb;
  }
  setJossyBot(owned, battery, isSleeping) {
    this.isJossyOwned = owned;
    this.jossyBattery = battery;
    this.isJossySleeping = isSleeping;
    if (!owned) {
      if (this.jossyGroup) {
        this.scene.remove(this.jossyGroup);
        this.jossyGroup = null;
        this.jossyEyeMesh = null;
        this.jossyGlowLight = null;
        this.jossyArmL = null;
        this.jossyArmR = null;
        this.jossyAntennaOrb = null;
      }
      return;
    }
    if (!this.jossyGroup) {
      this.buildJossyBot();
    }
  }
  buildJossyBot() {
    this.jossyGroup = new THREE.Group();
    this.jossyGroup.position.set(1.4, 1.35, 0.4);
    // 1. Sleek glossy white pod chassis
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const darkAccentMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.4,
    });
    const bodyGeo = new THREE.CapsuleGeometry(0.24, 0.26, 12, 16);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    this.jossyGroup.add(body);
    // 2. Front Face Visor (curved dark screen)
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x020617,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0,
    });
    const visorGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.scale.set(0.85, 0.55, 0.4);
    visor.position.set(0, 0.08, 0.14);
    this.jossyGroup.add(visor);
    // 3. Digital glowing eyes inside visor
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
    const eyeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.08, 0.22);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.x = -0.09;
    eyeL.scale.set(1.1, 0.8, 0.5);
    eyesGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.x = 0.09;
    eyeR.scale.set(1.1, 0.8, 0.5);
    eyesGroup.add(eyeR);
    this.jossyGroup.add(eyesGroup);
    this.jossyEyeMesh = eyeL;
    // 4. Antenna with glowing orb
    const antRodGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.16, 8);
    const antRod = new THREE.Mesh(antRodGeo, darkAccentMat);
    antRod.position.set(0, 0.38, 0);
    this.jossyGroup.add(antRod);
    const antOrbGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const antOrbMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const antOrb = new THREE.Mesh(antOrbGeo, antOrbMat);
    antOrb.position.set(0, 0.46, 0);
    this.jossyGroup.add(antOrb);
    this.jossyAntennaOrb = antOrb;
    // 5. Magnetic Hovering Floating Arms (left & right)
    const armGeo = new THREE.CapsuleGeometry(0.06, 0.14, 8, 8);
    const armL = new THREE.Mesh(armGeo, bodyMat);
    armL.position.set(-0.35, 0.02, 0);
    armL.rotation.z = 0.2;
    this.jossyGroup.add(armL);
    this.jossyArmL = armL;
    const armR = new THREE.Mesh(armGeo, bodyMat);
    armR.position.set(0.35, 0.02, 0);
    armR.rotation.z = -0.2;
    this.jossyGroup.add(armR);
    this.jossyArmR = armR;
    // 6. Base Thruster Hover Ring & Light
    const thrusterGeo = new THREE.TorusGeometry(0.15, 0.025, 8, 20);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.rotation.x = Math.PI / 2;
    thruster.position.set(0, -0.22, 0);
    this.jossyGroup.add(thruster);
    this.jossyGlowLight = new THREE.PointLight(0x00f5ff, 0.6, 2.5);
    this.jossyGlowLight.position.set(0, 0, 0.2);
    this.jossyGroup.add(this.jossyGlowLight);
    this.scene.add(this.jossyGroup);
  }
  // Dance routines
  startDance(style, durationMs = 7000, onFinish) {
    if (this.isSleeping) {
      // Pet is asleep and cannot dance
      return;
    }
    this.isDancing = true;
    this.currentDanceStyle = style;
    // Spawn musical / disco particles
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (this.isDancing) this.spawnMusicNoteParticle();
      }, i * 350);
    }
    if (this.danceTimeout) {
      clearTimeout(this.danceTimeout);
    }
    this.danceTimeout = setTimeout(() => {
      this.stopDance();
      if (onFinish) onFinish();
    }, durationMs);
  }
  stopDance() {
    this.isDancing = false;
    this.currentDanceStyle = null;
    if (this.danceTimeout) {
      clearTimeout(this.danceTimeout);
      this.danceTimeout = null;
    }
    // Reset positions
    this.petGroup.position.set(0, 0, 0);
    this.petGroup.rotation.set(0, 0, 0);
    if (this.petParts.head) this.petParts.head.rotation.set(0, 0, 0);
    if (this.petParts.pawFL) this.petParts.pawFL.position.y = 0.2;
    if (this.petParts.pawFR) this.petParts.pawFR.position.y = 0.2;
  }
  applyQualitySettings(quality) {
    this.quality = quality;
    if (quality === 'low' || this.isSoftwareGl) {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
    } else if (quality === 'medium') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      this.renderer.shadowMap.enabled = false;
    } else {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    this.onResize();
  }
  onResize = () => {
    if (!this.container || !this.camera || !this.renderer || this.isDisposed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
  createRadialShadowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.7)');
    grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.3)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
  // Build Environment according to Pet habitat
  buildEnvironment() {
    // Clear previous
    while (this.environmentGroup.children.length > 0) {
      const obj = this.environmentGroup.children[0];
      this.environmentGroup.remove(obj);
    }
    if (this.currentPetId === 'fizzi') {
      // Aquarium habitat for Betta fish
      this.scene.fog = new THREE.FogExp2(0x0c4a6e, 0.05);
      // Glass bowl / water globe base
      const bowlGeo = new THREE.SphereGeometry(2.4, 32, 24);
      const bowlMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.22,
        roughness: 0.1,
        metalness: 0.05,
        depthWrite: false,
      });
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);
      bowl.position.y = 1.3;
      this.environmentGroup.add(bowl);
      // Water bowl stand
      const standGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.2, 32);
      const standMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.4,
      });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.y = 0.1;
      this.environmentGroup.add(stand);
      // Sea floor sand
      const sandGeo = new THREE.CylinderGeometry(1.5, 1.4, 0.15, 32);
      const sandMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.9,
      });
      const sand = new THREE.Mesh(sandGeo, sandMat);
      sand.position.y = 0.2;
      this.environmentGroup.add(sand);
      // Smooth aquatic pebbles
      const pebbleMat1 = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
      const pebbleMat2 = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
      for (let i = 0; i < 7; i++) {
        const pGeo = new THREE.DodecahedronGeometry(0.12 + Math.random() * 0.08);
        const p = new THREE.Mesh(pGeo, i % 2 === 0 ? pebbleMat1 : pebbleMat2);
        const angle = (i / 7) * Math.PI * 2;
        p.position.set(Math.cos(angle) * 0.8, 0.26, Math.sin(angle) * 0.8);
        p.rotation.set(Math.random(), Math.random(), Math.random());
        this.environmentGroup.add(p);
      }
      // Seaweed / aquatic plants
      for (let j = 0; j < 4; j++) {
        const plant = this.createAquaticPlant();
        const a = (j / 4) * Math.PI * 2 + 0.5;
        plant.position.set(Math.cos(a) * 0.9, 0.25, Math.sin(a) * 0.9);
        this.environmentGroup.add(plant);
      }
    } else {
      // Cozy Room for Milo (dog) & Ngkur (cat)
      this.scene.fog = new THREE.FogExp2(0xfefce8, 0.03);
      // Pastel circular rug
      const rugGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.04, 32);
      const rugMat = new THREE.MeshStandardMaterial({
        color: this.currentPetId === 'milo' ? 0xfef08a : 0xfbcfe8,
        roughness: 0.8,
      });
      const rug = new THREE.Mesh(rugGeo, rugMat);
      rug.position.y = 0.02;
      rug.receiveShadow = true;
      this.environmentGroup.add(rug);
      // Rug border ring
      const ringGeo = new THREE.TorusGeometry(2.28, 0.03, 8, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: this.currentPetId === 'milo' ? 0xf59e0b : 0xf43f5e,
        roughness: 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.03;
      this.environmentGroup.add(ring);
      // Wooden floor disc
      const floorGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.05, 32);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0xdeb887,
        roughness: 0.6,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.position.y = -0.02;
      floor.receiveShadow = true;
      this.environmentGroup.add(floor);
      // Cozy Pet Cushion / Pillow in background
      const cushionGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.2, 24);
      const cushionMat = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        roughness: 0.7,
      });
      const cushion = new THREE.Mesh(cushionGeo, cushionMat);
      cushion.position.set(-1.4, 0.1, -1.2);
      this.environmentGroup.add(cushion);
      // Bouncing interactive toy ball
      const ballGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const ballMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.3,
        metalness: 0.1,
      });
      this.toyBall = new THREE.Mesh(ballGeo, ballMat);
      this.toyBall.position.set(1.4, 0.2, 0.5);
      this.toyBall.castShadow = true;
      this.environmentGroup.add(this.toyBall);
    }
  }
  createAquaticPlant() {
    const group = new THREE.Group();
    const leafGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.8, 8);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.5,
    });
    for (let i = 0; i < 3; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set((i - 1) * 0.08, 0.4, 0);
      leaf.rotation.z = (i - 1) * 0.15;
      group.add(leaf);
    }
    return group;
  }
  // Switch pet
  switchPet(petId) {
    this.currentPetId = petId;
    if (this.scene) {
      const bgCol = petId === 'fizzi' ? 0x0c4a6e : 0x1e1b4b;
      this.scene.background = new THREE.Color(bgCol);
      this.scene.fog = new THREE.FogExp2(bgCol, 0.03);
    }
    this.buildEnvironment();
    this.buildPet(petId);
    this.updateAccessories(this.equippedHat);
    this.onResize();
  }
  // Procedural 3D Pet Models
  buildPet(petId) {
    // Clear previous
    while (this.petGroup.children.length > 0) {
      const c = this.petGroup.children[0];
      this.petGroup.remove(c);
    }
    this.petParts = {};
    // Reattach accessory group
    this.petGroup.add(this.accessoryGroup);
    if (petId === 'milo') {
      this.buildMiloDog();
    } else if (petId === 'fizzi') {
      this.buildFizziBetta();
    } else if (petId === 'patar') {
      this.buildPatarCrab();
    } else {
      this.buildNgkurCat();
    }
    // Always reapply equipped accessories to the newly built pet!
    this.updateAccessories(this.equippedHat);
  }
  // 1. MILO: Si Anjing Penurut (Obedient Golden Corgi Puppy)
  buildMiloDog() {
    const furGold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.65 });
    const furCream = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.7 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    const goldBellMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.8,
      roughness: 0.2,
    });
    const tongueMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
    // Pivot group
    const root = new THREE.Group();
    root.position.y = 0;
    // Body
    const bodyGeo = new THREE.CapsuleGeometry(0.48, 0.6, 12, 16);
    const body = new THREE.Mesh(bodyGeo, furGold);
    body.rotation.x = Math.PI / 4;
    body.position.set(0, 0.65, 0);
    body.castShadow = true;
    root.add(body);
    this.petParts.body = body;
    // Belly patch (cream)
    const bellyGeo = new THREE.SphereGeometry(0.38, 12, 12);
    const belly = new THREE.Mesh(bellyGeo, furCream);
    belly.position.set(0, 0.6, 0.25);
    belly.scale.set(0.9, 1.1, 0.6);
    root.add(belly);
    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.25, 0.35);
    const headGeo = new THREE.SphereGeometry(0.52, 16, 16);
    const head = new THREE.Mesh(headGeo, furGold);
    head.scale.set(1.05, 0.95, 1);
    head.castShadow = true;
    headGroup.add(head);
    this.petParts.head = headGroup;
    // Snout / Muzzle
    const snoutGeo = new THREE.CylinderGeometry(0.24, 0.3, 0.35, 16);
    const snout = new THREE.Mesh(snoutGeo, furCream);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, -0.06, 0.42);
    headGroup.add(snout);
    // Cute Dark Nose
    const noseGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const nose = new THREE.Mesh(noseGeo, darkMat);
    nose.position.set(0, 0.05, 0.58);
    nose.scale.set(1.2, 0.8, 1);
    headGroup.add(nose);
    // Eyes (with glossy highlight)
    const eyeGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const eyeL = new THREE.Mesh(eyeGeo, darkMat);
    eyeL.position.set(-0.24, 0.1, 0.42);
    const eyeR = new THREE.Mesh(eyeGeo, darkMat);
    eyeR.position.set(0.24, 0.1, 0.42);
    headGroup.add(eyeL);
    headGroup.add(eyeR);
    this.petParts.eyeL = eyeL;
    this.petParts.eyeR = eyeR;
    // Eye highlights
    const hiMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hiGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const hiL = new THREE.Mesh(hiGeo, hiMat);
    hiL.position.set(-0.02, 0.03, 0.07);
    eyeL.add(hiL);
    const hiR = new THREE.Mesh(hiGeo, hiMat);
    hiR.position.set(-0.02, 0.03, 0.07);
    eyeR.add(hiR);
    // Floppy Puppy Ears
    const earGeo = new THREE.ConeGeometry(0.22, 0.55, 12);
    const earL = new THREE.Mesh(earGeo, furGold);
    earL.position.set(-0.48, 0.28, -0.05);
    earL.rotation.set(0.2, 0, 1.2);
    headGroup.add(earL);
    this.petParts.earL = earL;
    const earR = new THREE.Mesh(earGeo, furGold);
    earR.position.set(0.48, 0.28, -0.05);
    earR.rotation.set(0.2, 0, -1.2);
    headGroup.add(earR);
    this.petParts.earR = earR;
    // Tongue
    const tongueGeo = new THREE.BoxGeometry(0.12, 0.04, 0.2);
    const tongue = new THREE.Mesh(tongueGeo, tongueMat);
    tongue.position.set(0, -0.18, 0.45);
    tongue.rotation.x = 0.3;
    headGroup.add(tongue);
    this.petParts.tongue = tongue;
    root.add(headGroup);
    // Collar & Bell
    const collarGeo = new THREE.TorusGeometry(0.4, 0.06, 8, 24);
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, 0.95, 0.22);
    collar.rotation.x = Math.PI / 3;
    root.add(collar);
    const bellGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const bell = new THREE.Mesh(bellGeo, goldBellMat);
    bell.position.set(0, 0.8, 0.48);
    root.add(bell);
    // 4 Paws
    const pawGeo = new THREE.CylinderGeometry(0.13, 0.16, 0.38, 12);
    const pawFL = new THREE.Mesh(pawGeo, furCream);
    pawFL.position.set(-0.28, 0.2, 0.3);
    pawFL.castShadow = true;
    root.add(pawFL);
    this.petParts.pawFL = pawFL;
    const pawFR = new THREE.Mesh(pawGeo, furCream);
    pawFR.position.set(0.28, 0.2, 0.3);
    pawFR.castShadow = true;
    root.add(pawFR);
    this.petParts.pawFR = pawFR;
    const pawBL = new THREE.Mesh(pawGeo, furCream);
    pawBL.position.set(-0.32, 0.18, -0.28);
    pawBL.castShadow = true;
    root.add(pawBL);
    this.petParts.pawBL = pawBL;
    const pawBR = new THREE.Mesh(pawGeo, furCream);
    pawBR.position.set(0.32, 0.18, -0.28);
    pawBR.castShadow = true;
    root.add(pawBR);
    this.petParts.pawBR = pawBR;
    // Wagging Puppy Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.65, -0.45);
    const tailGeo = new THREE.ConeGeometry(0.12, 0.45, 12);
    const tail = new THREE.Mesh(tailGeo, furGold);
    tail.rotation.x = -Math.PI / 3;
    tail.position.y = 0.15;
    tailGroup.add(tail);
    root.add(tailGroup);
    this.petParts.tail = tailGroup;
    this.petGroup.add(root);
  }
  // 2. FIZZI: Si Ikan Cupang (Betta Fish Halfmoon)
  buildFizziBetta() {
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.25,
      metalness: 0.4,
    });
    const finMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const root = new THREE.Group();
    root.position.y = 1.3; // floats in the water bubble
    // Streamlined fish body
    const bodyGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.scale.set(0.65, 0.8, 1.5);
    root.add(body);
    this.petParts.body = body;
    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.25, 0.1, 0.4);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.25, 0.1, 0.4);
    root.add(eyeL);
    root.add(eyeR);
    this.petParts.eyeL = eyeL;
    this.petParts.eyeR = eyeR;
    // Eye sparkles
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sGeo = new THREE.SphereGeometry(0.02, 6, 6);
    const spL = new THREE.Mesh(sGeo, sparkMat);
    spL.position.set(-0.02, 0.02, 0.06);
    eyeL.add(spL);
    const spR = new THREE.Mesh(sGeo, sparkMat);
    spR.position.set(0.02, 0.02, 0.06);
    eyeR.add(spR);
    // Magnificent Halfmoon Caudal Tail Fin
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0, -0.65);
    const tailFinGeo = new THREE.CircleGeometry(0.85, 24, 0, Math.PI * 1.3);
    const tailFin = new THREE.Mesh(tailFinGeo, finMat);
    tailFin.rotation.y = Math.PI / 2;
    tailFin.rotation.z = Math.PI / 4;
    tailGroup.add(tailFin);
    root.add(tailGroup);
    this.petParts.finTail = tailGroup;
    // Dorsal Fin (Top crest)
    const dorsalGroup = new THREE.Group();
    dorsalGroup.position.set(0, 0.4, -0.1);
    const dorsalGeo = new THREE.PlaneGeometry(0.7, 0.45);
    const dorsal = new THREE.Mesh(dorsalGeo, finMat);
    dorsal.rotation.y = Math.PI / 2;
    dorsal.rotation.z = -0.3;
    dorsalGroup.add(dorsal);
    root.add(dorsalGroup);
    this.petParts.finDorsal = dorsalGroup;
    // Ventral / Pectoral Fins (Paddles)
    const pecGeo = new THREE.PlaneGeometry(0.35, 0.25);
    const pecL = new THREE.Mesh(pecGeo, finMat);
    pecL.position.set(-0.35, -0.15, 0.1);
    pecL.rotation.y = 0.5;
    root.add(pecL);
    this.petParts.finL = pecL;
    const pecR = new THREE.Mesh(pecGeo, finMat);
    pecR.position.set(0.35, -0.15, 0.1);
    pecR.rotation.y = -0.5;
    root.add(pecR);
    this.petParts.finR = pecR;
    this.petGroup.add(root);
  }
  // 3. NGKUR: Si Kucing Manis dan Pemberani (Sweet & Brave Calico Cat)
  buildNgkurCat() {
    const furOrange = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.65 });
    const furWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
    const furBlack = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.65 });
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.5 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2 }); // Brave emerald eyes
    const darkPupil = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
    const capeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const root = new THREE.Group();
    root.position.y = 0;
    // Body
    const bodyGeo = new THREE.CapsuleGeometry(0.42, 0.55, 12, 16);
    const body = new THREE.Mesh(bodyGeo, furOrange);
    body.rotation.x = Math.PI / 4.2;
    body.position.set(0, 0.62, 0);
    body.castShadow = true;
    root.add(body);
    this.petParts.body = body;
    // Calico belly/chest patch
    const chestGeo = new THREE.SphereGeometry(0.32, 12, 12);
    const chest = new THREE.Mesh(chestGeo, furWhite);
    chest.position.set(0, 0.65, 0.25);
    chest.scale.set(0.9, 1.1, 0.6);
    root.add(chest);
    // Calico side spot (black)
    const spotGeo = new THREE.SphereGeometry(0.2, 10, 10);
    const spot = new THREE.Mesh(spotGeo, furBlack);
    spot.position.set(-0.35, 0.65, -0.05);
    spot.scale.set(0.5, 0.8, 0.8);
    root.add(spot);
    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.25, 0.3);
    const headGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const head = new THREE.Mesh(headGeo, furOrange);
    head.scale.set(1.08, 0.96, 1);
    head.castShadow = true;
    headGroup.add(head);
    this.petParts.head = headGroup;
    // White muzzle & chin
    const muzzleGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const muzzle = new THREE.Mesh(muzzleGeo, furWhite);
    muzzle.position.set(0, -0.1, 0.36);
    muzzle.scale.set(1.3, 0.8, 0.8);
    headGroup.add(muzzle);
    // Pink triangle nose
    const noseGeo = new THREE.ConeGeometry(0.05, 0.08, 6);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.rotation.z = Math.PI;
    nose.position.set(0, -0.04, 0.48);
    headGroup.add(nose);
    // Brave Emerald Eyes
    const eyeGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.22, 0.08, 0.4);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.22, 0.08, 0.4);
    headGroup.add(eyeL);
    headGroup.add(eyeR);
    this.petParts.eyeL = eyeL;
    this.petParts.eyeR = eyeR;
    // Pupil
    const pupilGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const pupL = new THREE.Mesh(pupilGeo, darkPupil);
    pupL.position.set(0, 0, 0.07);
    pupL.scale.set(0.5, 1.3, 0.5);
    eyeL.add(pupL);
    const pupR = new THREE.Mesh(pupilGeo, darkPupil);
    pupR.position.set(0, 0, 0.07);
    pupR.scale.set(0.5, 1.3, 0.5);
    eyeR.add(pupR);
    // Pointed Cat Ears
    const earGeo = new THREE.ConeGeometry(0.2, 0.42, 6);
    const earL = new THREE.Mesh(earGeo, furOrange);
    earL.position.set(-0.35, 0.44, 0);
    earL.rotation.set(-0.1, 0, 0.4);
    headGroup.add(earL);
    this.petParts.earL = earL;
    const inEarGeo = new THREE.ConeGeometry(0.12, 0.3, 6);
    const inL = new THREE.Mesh(inEarGeo, innerEarMat);
    inL.position.set(0, 0, 0.05);
    earL.add(inL);
    const earR = new THREE.Mesh(earGeo, furBlack); // Calico black right ear!
    earR.position.set(0.35, 0.44, 0);
    earR.rotation.set(-0.1, 0, -0.4);
    headGroup.add(earR);
    this.petParts.earR = earR;
    const inR = new THREE.Mesh(inEarGeo, innerEarMat);
    inR.position.set(0, 0, 0.05);
    earR.add(inR);
    // Brave Hero Mini Cape
    const capeGeo = new THREE.PlaneGeometry(0.6, 0.7);
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, 0.8, -0.32);
    cape.rotation.x = -0.3;
    root.add(cape);
    this.petParts.cape = cape;
    root.add(headGroup);
    // 4 White Sock Paws
    const pawGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.36, 12);
    const pawFL = new THREE.Mesh(pawGeo, furWhite);
    pawFL.position.set(-0.25, 0.18, 0.28);
    root.add(pawFL);
    this.petParts.pawFL = pawFL;
    const pawFR = new THREE.Mesh(pawGeo, furWhite);
    pawFR.position.set(0.25, 0.18, 0.28);
    root.add(pawFR);
    this.petParts.pawFR = pawFR;
    const pawBL = new THREE.Mesh(pawGeo, furWhite);
    pawBL.position.set(-0.28, 0.18, -0.25);
    root.add(pawBL);
    this.petParts.pawBL = pawBL;
    const pawBR = new THREE.Mesh(pawGeo, furWhite);
    pawBR.position.set(0.28, 0.18, -0.25);
    root.add(pawBR);
    this.petParts.pawBR = pawBR;
    // Curled Cat Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.65, -0.42);
    const tailGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 10);
    const tail = new THREE.Mesh(tailGeo, furOrange);
    tail.position.set(0, 0.3, 0);
    tail.rotation.x = -0.6;
    tailGroup.add(tail);
    root.add(tailGroup);
    this.petParts.tail = tailGroup;
    this.petGroup.add(root);
  }
  // 4. PATAR: Si Kepiting Kasar (The Grumpy & Fierce Red Reef Crab)
  buildPatarCrab() {
    const shellRed = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.45,
      metalness: 0.1,
    });
    const shellDarkRed = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.5,
    });
    const orangeAcc = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.4,
    });
    const underbellyMat = new THREE.MeshStandardMaterial({
      color: 0xfed7aa,
      roughness: 0.6,
    });
    const eyeWhite = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
    });
    const eyePupil = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
    });
    const mouthMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.6,
    });
    const root = new THREE.Group();
    root.position.y = 0;
    // Main Carapace (Curved top shell)
    const carapaceGroup = new THREE.Group();
    carapaceGroup.position.set(0, 0.48, 0);
    // Main shell dome
    const shellGeo = new THREE.SphereGeometry(0.56, 16, 14);
    const shellMesh = new THREE.Mesh(shellGeo, shellRed);
    shellMesh.scale.set(1.25, 0.52, 0.95);
    shellMesh.castShadow = true;
    carapaceGroup.add(shellMesh);
    this.petParts.body = carapaceGroup;
    // Ventral underbelly plate
    const underGeo = new THREE.SphereGeometry(0.48, 14, 12);
    const underMesh = new THREE.Mesh(underGeo, underbellyMat);
    underMesh.scale.set(1.15, 0.4, 0.88);
    underMesh.position.y = -0.06;
    carapaceGroup.add(underMesh);
    // Carapace rim / lateral spikes (fierce look)
    const rimPoints = [-0.62, 0.62];
    rimPoints.forEach((xPos) => {
      const spikeGeo = new THREE.ConeGeometry(0.08, 0.24, 8);
      const spike = new THREE.Mesh(spikeGeo, shellDarkRed);
      spike.position.set(xPos, 0, 0);
      spike.rotation.z = xPos < 0 ? Math.PI / 2.3 : -Math.PI / 2.3;
      carapaceGroup.add(spike);
    });
    // Grumpy Eyestalks (Upright cylinders topped with expressive eyes)
    const eyestalkGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.35, 10);
    const eyeBallGeo = new THREE.SphereGeometry(0.11, 14, 14);
    const pupilGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const catchlightGeo = new THREE.SphereGeometry(0.02, 8, 8);
    // Left Eyestalk
    const stalkL = new THREE.Mesh(eyestalkGeo, orangeAcc);
    stalkL.position.set(-0.2, 0.32, 0.3);
    stalkL.rotation.z = -0.12;
    stalkL.rotation.x = 0.08;
    carapaceGroup.add(stalkL);
    const eyeL = new THREE.Mesh(eyeBallGeo, eyeWhite);
    eyeL.position.set(-0.22, 0.5, 0.32);
    const pupilL = new THREE.Mesh(pupilGeo, eyePupil);
    pupilL.position.set(0, 0, 0.08);
    const catchL = new THREE.Mesh(catchlightGeo, eyeWhite);
    catchL.position.set(0.02, 0.02, 0.1);
    eyeL.add(pupilL);
    eyeL.add(catchL);
    carapaceGroup.add(eyeL);
    this.petParts.eyeL = eyeL;
    // Right Eyestalk
    const stalkR = new THREE.Mesh(eyestalkGeo, orangeAcc);
    stalkR.position.set(0.2, 0.32, 0.3);
    stalkR.rotation.z = 0.12;
    stalkR.rotation.x = 0.08;
    carapaceGroup.add(stalkR);
    const eyeR = new THREE.Mesh(eyeBallGeo, eyeWhite);
    eyeR.position.set(0.22, 0.5, 0.32);
    const pupilR = new THREE.Mesh(pupilGeo, eyePupil);
    pupilR.position.set(0, 0, 0.08);
    const catchR = new THREE.Mesh(catchlightGeo, eyeWhite);
    catchR.position.set(0.02, 0.02, 0.1);
    eyeR.add(pupilR);
    eyeR.add(catchR);
    carapaceGroup.add(eyeR);
    this.petParts.eyeR = eyeR;
    // Grumpy mouthplate / mandibles
    const mouthGeo = new THREE.BoxGeometry(0.22, 0.07, 0.05);
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 0.04, 0.5);
    carapaceGroup.add(mouth);
    // Two Big Pincer Claws!
    // Left Claw Arm
    const armL = new THREE.Group();
    armL.position.set(-0.55, 0.08, 0.22);
    // Bicep/shoulder segment
    const shoulderLGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.32, 10);
    const shoulderL = new THREE.Mesh(shoulderLGeo, shellRed);
    shoulderL.rotation.z = Math.PI / 3;
    armL.add(shoulderL);
    // Forearm
    const forearmLGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.35, 10);
    const forearmL = new THREE.Mesh(forearmLGeo, orangeAcc);
    forearmL.position.set(-0.24, 0.12, 0.12);
    forearmL.rotation.y = -Math.PI / 4;
    forearmL.rotation.z = -Math.PI / 6;
    armL.add(forearmL);
    // Palm Claw (Fixed lower jaw)
    const palmLGeo = new THREE.BoxGeometry(0.26, 0.22, 0.14);
    const palmL = new THREE.Mesh(palmLGeo, shellRed);
    palmL.position.set(-0.44, 0.24, 0.22);
    palmL.scale.set(1.2, 1, 1);
    armL.add(palmL);
    const lowerTeethLGeo = new THREE.ConeGeometry(0.08, 0.26, 8);
    const lowerTeethL = new THREE.Mesh(lowerTeethLGeo, orangeAcc);
    lowerTeethL.position.set(-0.46, 0.36, 0.22);
    lowerTeethL.rotation.z = -0.4;
    armL.add(lowerTeethL);
    // Movable Upper Pincer
    const pincerLGroup = new THREE.Group();
    pincerLGroup.position.set(-0.38, 0.35, 0.22);
    const upperTeethLGeo = new THREE.ConeGeometry(0.075, 0.26, 8);
    const upperTeethL = new THREE.Mesh(upperTeethLGeo, shellRed);
    upperTeethL.rotation.z = 0.5;
    pincerLGroup.add(upperTeethL);
    armL.add(pincerLGroup);
    this.petParts.clawPincerL = pincerLGroup;
    carapaceGroup.add(armL);
    this.petParts.clawL = armL;
    // Right Claw Arm (Big Claw!)
    const armR = new THREE.Group();
    armR.position.set(0.55, 0.08, 0.22);
    const shoulderRGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.32, 10);
    const shoulderR = new THREE.Mesh(shoulderRGeo, shellRed);
    shoulderR.rotation.z = -Math.PI / 3;
    armR.add(shoulderR);
    const forearmRGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.35, 10);
    const forearmR = new THREE.Mesh(forearmRGeo, orangeAcc);
    forearmR.position.set(0.24, 0.12, 0.12);
    forearmR.rotation.y = Math.PI / 4;
    forearmR.rotation.z = Math.PI / 6;
    armR.add(forearmR);
    const palmRGeo = new THREE.BoxGeometry(0.26, 0.22, 0.14);
    const palmR = new THREE.Mesh(palmRGeo, shellRed);
    palmR.position.set(0.44, 0.24, 0.22);
    palmR.scale.set(1.2, 1, 1);
    armR.add(palmR);
    const lowerTeethRGeo = new THREE.ConeGeometry(0.08, 0.26, 8);
    const lowerTeethR = new THREE.Mesh(lowerTeethRGeo, orangeAcc);
    lowerTeethR.position.set(0.46, 0.36, 0.22);
    lowerTeethR.rotation.z = 0.4;
    armR.add(lowerTeethR);
    const pincerRGroup = new THREE.Group();
    pincerRGroup.position.set(0.38, 0.35, 0.22);
    const upperTeethRGeo = new THREE.ConeGeometry(0.075, 0.26, 8);
    const upperTeethR = new THREE.Mesh(upperTeethRGeo, shellRed);
    upperTeethR.rotation.z = -0.5;
    pincerRGroup.add(upperTeethR);
    armR.add(pincerRGroup);
    this.petParts.clawPincerR = pincerRGroup;
    carapaceGroup.add(armR);
    this.petParts.clawR = armR;
    // 6 Scuttling Crab Legs (3 left, 3 right)
    const crabLegs = [];
    const legZOffsets = [-0.22, -0.04, 0.14];
    const legGeoUpper = new THREE.CylinderGeometry(0.04, 0.05, 0.28, 8);
    const legGeoLower = new THREE.ConeGeometry(0.035, 0.3, 8);
    // Left legs
    legZOffsets.forEach((zOffset, idx) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(-0.48, -0.05, zOffset);
      const upper = new THREE.Mesh(legGeoUpper, shellRed);
      upper.position.set(-0.12, 0.08, 0);
      upper.rotation.z = Math.PI / 3 + (idx - 1) * 0.1;
      legGroup.add(upper);
      const lower = new THREE.Mesh(legGeoLower, orangeAcc);
      lower.position.set(-0.25, -0.15, 0);
      lower.rotation.z = -Math.PI / 4;
      legGroup.add(lower);
      carapaceGroup.add(legGroup);
      crabLegs.push(legGroup);
    });
    // Right legs
    legZOffsets.forEach((zOffset, idx) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(0.48, -0.05, zOffset);
      const upper = new THREE.Mesh(legGeoUpper, shellRed);
      upper.position.set(0.12, 0.08, 0);
      upper.rotation.z = -Math.PI / 3 - (idx - 1) * 0.1;
      legGroup.add(upper);
      const lower = new THREE.Mesh(legGeoLower, orangeAcc);
      lower.position.set(0.25, -0.15, 0);
      lower.rotation.z = Math.PI / 4;
      legGroup.add(lower);
      carapaceGroup.add(legGroup);
      crabLegs.push(legGroup);
    });
    this.petParts.crabLegs = crabLegs;
    root.add(carapaceGroup);
    this.petGroup.add(root);
  }
  // Update Hats & Accessories with full procedural 3D attachments
  updateAccessories(hatId) {
    this.equippedHat = hatId;
    // 1. Clear previous accessory meshes
    while (this.accessoryGroup.children.length > 0) {
      const child = this.accessoryGroup.children[0];
      this.accessoryGroup.remove(child);
    }
    // Detach accessoryGroup from its previous parent if any
    if (this.accessoryGroup.parent) {
      this.accessoryGroup.parent.remove(this.accessoryGroup);
    }
    // Clean up toy ball if unequipped
    if (hatId !== 'toy_ball' && this.toyBall) {
      this.scene.remove(this.toyBall);
      this.toyBall = null;
    }
    if (!hatId) return;
    // Reset transform on accessory group
    this.accessoryGroup.position.set(0, 0, 0);
    this.accessoryGroup.rotation.set(0, 0, 0);
    this.accessoryGroup.scale.set(1, 1, 1);
    if (hatId === 'hat_party') {
      // 1. Topi Pesta Kerucut (Party Cone Hat)
      const hatMeshGroup = new THREE.Group();
      const coneGeo = new THREE.ConeGeometry(0.24, 0.58, 20);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        roughness: 0.35,
        metalness: 0.1,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = 0.29;
      hatMeshGroup.add(cone);
      // Gold & cyan striped ring bands
      const ringMatGold = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.2,
        metalness: 0.5,
      });
      const ringGeo1 = new THREE.TorusGeometry(0.18, 0.02, 8, 20);
      const ring1 = new THREE.Mesh(ringGeo1, ringMatGold);
      ring1.position.y = 0.12;
      ring1.rotation.x = Math.PI / 2;
      hatMeshGroup.add(ring1);
      const ringMatCyan = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
      const ringGeo2 = new THREE.TorusGeometry(0.11, 0.018, 8, 16);
      const ring2 = new THREE.Mesh(ringGeo2, ringMatCyan);
      ring2.position.y = 0.34;
      ring2.rotation.x = Math.PI / 2;
      hatMeshGroup.add(ring2);
      // Fluffy golden pom-pom at tip
      const pomGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const pom = new THREE.Mesh(pomGeo, ringMatGold);
      pom.position.y = 0.6;
      hatMeshGroup.add(pom);
      this.accessoryGroup.add(hatMeshGroup);
      // Attach to head bone so it follows all nods and breathing
      if (this.currentPetId === 'milo' && this.petParts.head) {
        this.petParts.head.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.5, 0.05);
        this.accessoryGroup.rotation.set(-0.1, 0, 0.06);
      } else if (this.currentPetId === 'ngkur' && this.petParts.head) {
        this.petParts.head.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.48, 0.02);
        this.accessoryGroup.rotation.set(-0.08, 0, 0.04);
      } else if (this.currentPetId === 'patar') {
        this.petGroup.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.72, 0.05);
        this.accessoryGroup.scale.setScalar(0.75);
      } else {
        // Fizzi Betta
        this.petGroup.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 1.82, 0.1);
        this.accessoryGroup.scale.setScalar(0.75);
      }
    } else if (hatId === 'hat_crown') {
      // 2. Mahkota Emas Raja Kecil (Royal Gold Crown)
      const crownMeshGroup = new THREE.Group();
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        metalness: 0.85,
        roughness: 0.2,
      });
      const rubyMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.1,
        metalness: 0.3,
      });
      // Base ring
      const baseGeo = new THREE.CylinderGeometry(0.26, 0.24, 0.14, 20, 1, true);
      const base = new THREE.Mesh(baseGeo, goldMat);
      base.position.y = 0.07;
      crownMeshGroup.add(base);
      // 5 Crown points with sparkling ruby jewels
      const pointGeo = new THREE.ConeGeometry(0.06, 0.18, 8);
      const rubyGeo = new THREE.SphereGeometry(0.035, 8, 8);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const x = Math.cos(a) * 0.24;
        const z = Math.sin(a) * 0.24;
        const spire = new THREE.Mesh(pointGeo, goldMat);
        spire.position.set(x, 0.18, z);
        crownMeshGroup.add(spire);
        const ruby = new THREE.Mesh(rubyGeo, rubyMat);
        ruby.position.set(x, 0.28, z);
        crownMeshGroup.add(ruby);
      }
      // Front emerald jewel
      const emeraldMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.1 });
      const emeraldGeo = new THREE.DodecahedronGeometry(0.045);
      const emerald = new THREE.Mesh(emeraldGeo, emeraldMat);
      emerald.position.set(0, 0.07, 0.26);
      crownMeshGroup.add(emerald);
      this.accessoryGroup.add(crownMeshGroup);
      if (this.currentPetId === 'milo' && this.petParts.head) {
        this.petParts.head.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.5, 0.02);
      } else if (this.currentPetId === 'ngkur' && this.petParts.head) {
        this.petParts.head.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.46, 0);
      } else if (this.currentPetId === 'patar') {
        this.petGroup.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.75, 0.05);
        this.accessoryGroup.scale.setScalar(0.85);
      } else {
        this.petGroup.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 1.76, 0.05);
        this.accessoryGroup.scale.setScalar(0.8);
      }
    } else if (hatId === 'acc_glasses') {
      // 3. Kacamata Hitam Gaul (Trendy Sunglasses)
      const glassesGroup = new THREE.Group();
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.3,
        metalness: 0.2,
      });
      const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        roughness: 0.1,
        metalness: 0.6,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.88,
      });
      const lensSpacing =
        this.currentPetId === 'milo' ? 0.24 : this.currentPetId === 'ngkur' ? 0.22 : 0.25;
      const lensRadius = 0.13;
      // Left Frame & Lens
      const rimGeo = new THREE.TorusGeometry(lensRadius, 0.025, 12, 24);
      const rimL = new THREE.Mesh(rimGeo, frameMat);
      rimL.position.set(-lensSpacing, 0, 0);
      glassesGroup.add(rimL);
      const lensGeo = new THREE.CylinderGeometry(lensRadius, lensRadius, 0.012, 24);
      lensGeo.rotateX(Math.PI / 2);
      const lensL = new THREE.Mesh(lensGeo, lensMat);
      lensL.position.set(-lensSpacing, 0, 0);
      glassesGroup.add(lensL);
      // Right Frame & Lens
      const rimR = new THREE.Mesh(rimGeo, frameMat);
      rimR.position.set(lensSpacing, 0, 0);
      glassesGroup.add(rimR);
      const lensR = new THREE.Mesh(lensGeo, lensMat);
      lensR.position.set(lensSpacing, 0, 0);
      glassesGroup.add(lensR);
      // Nose bridge
      const bridgeGeo = new THREE.CylinderGeometry(0.02, 0.02, lensSpacing * 1.2, 8);
      bridgeGeo.rotateZ(Math.PI / 2);
      const bridge = new THREE.Mesh(bridgeGeo, frameMat);
      bridge.position.set(0, 0.03, 0.01);
      glassesGroup.add(bridge);
      // Temple arms going back along cheeks
      const armGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.42, 8);
      armGeo.rotateX(Math.PI / 2);
      const armL = new THREE.Mesh(armGeo, frameMat);
      armL.position.set(-lensSpacing - lensRadius + 0.01, 0.02, -0.21);
      armL.rotation.y = -0.15;
      glassesGroup.add(armL);
      const armR = new THREE.Mesh(armGeo, frameMat);
      armR.position.set(lensSpacing + lensRadius - 0.01, 0.02, -0.21);
      armR.rotation.y = 0.15;
      glassesGroup.add(armR);
      this.accessoryGroup.add(glassesGroup);
      if (this.currentPetId === 'milo' && this.petParts.head) {
        this.petParts.head.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.11, 0.45);
        this.accessoryGroup.rotation.set(-0.04, 0, 0);
      } else if (this.currentPetId === 'ngkur' && this.petParts.head) {
        this.petParts.head.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.09, 0.43);
        this.accessoryGroup.rotation.set(-0.04, 0, 0);
      } else if (this.currentPetId === 'patar') {
        this.petGroup.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.98, 0.3);
        this.accessoryGroup.scale.setScalar(0.82);
      } else {
        // Fizzi
        this.petGroup.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 1.4, 0.42);
        this.accessoryGroup.scale.setScalar(0.9);
      }
    } else if (hatId === 'acc_bowtie') {
      // 4. Dasi Kupu-Kupu Merah (Dapper Red Satin Bow Tie)
      const bowGroup = new THREE.Group();
      const redSatinMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.35,
        metalness: 0.15,
      });
      const goldKnotMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.2,
        metalness: 0.6,
      });
      // Center gold knot
      const knotGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const knot = new THREE.Mesh(knotGeo, goldKnotMat);
      knot.scale.set(1.1, 1.3, 0.9);
      bowGroup.add(knot);
      // Left flared wing
      const wingGeo = new THREE.ConeGeometry(0.14, 0.26, 12);
      wingGeo.rotateZ(Math.PI / 2);
      const wingL = new THREE.Mesh(wingGeo, redSatinMat);
      wingL.position.set(-0.16, 0, 0);
      wingL.rotation.y = -0.2;
      bowGroup.add(wingL);
      // Right flared wing
      const wingR = new THREE.Mesh(wingGeo, redSatinMat);
      wingR.position.set(0.16, 0, 0);
      wingR.rotation.y = Math.PI + 0.2;
      bowGroup.add(wingR);
      // Ribbon tails
      const ribGeo = new THREE.BoxGeometry(0.06, 0.18, 0.02);
      const ribL = new THREE.Mesh(ribGeo, redSatinMat);
      ribL.position.set(-0.06, -0.12, 0.02);
      ribL.rotation.z = 0.2;
      bowGroup.add(ribL);
      const ribR = new THREE.Mesh(ribGeo, redSatinMat);
      ribR.position.set(0.06, -0.12, 0.02);
      ribR.rotation.z = -0.2;
      bowGroup.add(ribR);
      this.accessoryGroup.add(bowGroup);
      // Attached at neck collar
      this.petGroup.add(this.accessoryGroup);
      if (this.currentPetId === 'milo') {
        this.accessoryGroup.position.set(0, 0.92, 0.5);
      } else if (this.currentPetId === 'ngkur') {
        this.accessoryGroup.position.set(0, 0.88, 0.44);
      } else if (this.currentPetId === 'patar') {
        this.accessoryGroup.position.set(0, 0.44, 0.46);
        this.accessoryGroup.scale.setScalar(0.8);
      } else {
        this.accessoryGroup.position.set(0, 1.15, 0.36);
        this.accessoryGroup.scale.setScalar(0.75);
      }
    } else if (hatId === 'hat_hero') {
      // 5. Ikat Kepala Pahlawan (Hero Headband)
      const heroGroup = new THREE.Group();
      const bandMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.45,
      });
      const metalPlateMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.9,
        roughness: 0.15,
      });
      // Headband loop
      const ringGeo = new THREE.TorusGeometry(0.48, 0.045, 12, 32);
      const band = new THREE.Mesh(ringGeo, bandMat);
      band.rotation.x = Math.PI / 2;
      heroGroup.add(band);
      // Forehead ninja emblem plate
      const plateGeo = new THREE.BoxGeometry(0.24, 0.12, 0.04);
      const plate = new THREE.Mesh(plateGeo, metalPlateMat);
      plate.position.set(0, 0, 0.48);
      heroGroup.add(plate);
      // Center plate emblem stud
      const dotGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.05, 12);
      dotGeo.rotateX(Math.PI / 2);
      const dotMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(0, 0, 0.5);
      heroGroup.add(dot);
      // Fluttering knot & tails at the back
      const knotBackGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const knotBack = new THREE.Mesh(knotBackGeo, bandMat);
      knotBack.position.set(0, 0, -0.48);
      heroGroup.add(knotBack);
      const tailGeo = new THREE.BoxGeometry(0.07, 0.35, 0.02);
      const tail1 = new THREE.Mesh(tailGeo, bandMat);
      tail1.position.set(-0.06, -0.16, -0.52);
      tail1.rotation.set(-0.3, 0, 0.25);
      heroGroup.add(tail1);
      const tail2 = new THREE.Mesh(tailGeo, bandMat);
      tail2.position.set(0.06, -0.16, -0.52);
      tail2.rotation.set(-0.4, 0, -0.3);
      heroGroup.add(tail2);
      this.accessoryGroup.add(heroGroup);
      if (this.currentPetId === 'milo' && this.petParts.head) {
        this.petParts.head.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.2, 0.12);
        this.accessoryGroup.rotation.set(0.18, 0, 0);
      } else if (this.currentPetId === 'ngkur' && this.petParts.head) {
        this.petParts.head.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.18, 0.08);
        this.accessoryGroup.rotation.set(0.15, 0, 0);
      } else if (this.currentPetId === 'patar') {
        this.petGroup.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 0.65, 0.06);
        this.accessoryGroup.scale.setScalar(0.8);
      } else {
        this.petGroup.add(this.accessoryGroup);
        this.accessoryGroup.position.set(0, 1.5, 0.15);
        this.accessoryGroup.scale.setScalar(0.75);
      }
    } else if (hatId === 'toy_ball') {
      // 6. Bola Mainan Ceria (Playful Bouncing Toy Ball)
      if (!this.toyBall) {
        const ballGeo = new THREE.SphereGeometry(0.24, 24, 24);
        const ballMat = new THREE.MeshStandardMaterial({
          color: 0xef4444,
          roughness: 0.3,
          metalness: 0.1,
        });
        this.toyBall = new THREE.Mesh(ballGeo, ballMat);
        // Pattern stripes on ball
        const stripeGeo = new THREE.TorusGeometry(0.24, 0.025, 8, 24);
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const s1 = new THREE.Mesh(stripeGeo, stripeMat);
        const s2 = new THREE.Mesh(stripeGeo, stripeMat);
        s2.rotation.x = Math.PI / 2;
        this.toyBall.add(s1);
        this.toyBall.add(s2);
        this.toyBall.position.set(0.75, 0.24, 0.7);
        this.scene.add(this.toyBall);
      }
    }
  }
  // Pointer interaction: petting / tapping
  onPointerDown = (e) => {
    if (this.isDisposed) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mousePos, this.camera);
    const interactables = [this.petGroup];
    if (this.toyBall) interactables.push(this.toyBall);
    if (this.jossyGroup) interactables.push(this.jossyGroup);
    const intersects = this.raycaster.intersectObjects(interactables, true);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (
        this.jossyGroup &&
        (hit === this.jossyGroup || this.isDescendantOf(hit, this.jossyGroup))
      ) {
        // Tapped J0ssy bot!
        soundFx.playBeep(880, 0.1);
        if (this.onJossyInteractedCallback) {
          this.onJossyInteractedCallback();
        }
      } else if (this.toyBall && hit === this.toyBall) {
        // Kick toy ball
        this.kickBall();
      } else {
        // Pet the animal!
        this.petAnimal();
      }
    }
  };
  isDescendantOf(child, parent) {
    let curr = child;
    while (curr) {
      if (curr === parent) return true;
      curr = curr.parent;
    }
    return false;
  }
  kickBall() {
    if (!this.toyBall) return;
    this.toyBallVelocity.set((Math.random() - 0.5) * 4, 3.5, (Math.random() - 0.5) * 3);
    soundFx.playBeep(600, 0.09);
  }
  petAnimal() {
    if (this.isPetting) return;
    this.isPetting = true;
    if (this.isSleeping) {
      // Pet is disturbed while sleeping: do NOT wake up!
      // Gentle reaction: spawn floating Zzz/sleepy particles and soft tone
      this.spawnSleepDisturbedParticles();
      soundFx.playBeep(320, 0.12);
      if (this.onPetInteractedCallback) {
        this.onPetInteractedCallback(this.currentPetId);
      }
      setTimeout(() => {
        this.isPetting = false;
      }, 800);
      return;
    }
    // Spawn floating love hearts
    this.spawnHeartParticles();
    // Sound
    soundFx.playLove();
    if (this.currentPetId === 'milo') {
      soundFx.playBark();
    } else if (this.currentPetId === 'ngkur') {
      soundFx.playMeow();
    } else if (this.currentPetId === 'patar') {
      soundFx.playCrabSnap();
    } else {
      soundFx.playBubble();
    }
    if (this.onPetInteractedCallback) {
      this.onPetInteractedCallback(this.currentPetId);
    }
    setTimeout(() => {
      this.isPetting = false;
    }, 1200);
  }
  // Feed animation: drop food in 3D
  dropFood(foodEmoji = '🦴') {
    if (this.isEating || this.isSleeping) return;
    this.isEating = true;
    // Create 3D food token
    const foodMat = new THREE.MeshStandardMaterial({
      color:
        this.currentPetId === 'milo'
          ? 0xf59e0b
          : this.currentPetId === 'fizzi'
            ? 0xfacc15
            : this.currentPetId === 'patar'
              ? 0x10b981
              : 0xf43f5e,
      roughness: 0.4,
    });
    const foodGeo =
      this.currentPetId === 'milo'
        ? new THREE.CapsuleGeometry(0.12, 0.25, 8, 8)
        : this.currentPetId === 'fizzi'
          ? new THREE.SphereGeometry(0.12, 12, 12)
          : new THREE.CylinderGeometry(0.15, 0.15, 0.08, 12);
    const foodMesh = new THREE.Mesh(foodGeo, foodMat);
    foodMesh.position.set(0, 3.2, 0.8);
    this.foodGroup.add(foodMesh);
    // Fall animation
    let t = 0;
    const dropTimer = setInterval(() => {
      t += 0.05;
      foodMesh.position.y -= 0.16;
      foodMesh.rotation.x += 0.1;
      foodMesh.rotation.y += 0.15;
      const targetY = this.currentPetId === 'fizzi' ? 1.3 : 0.15;
      if (foodMesh.position.y <= targetY) {
        clearInterval(dropTimer);
        foodMesh.position.y = targetY;
        // Play eat sound
        soundFx.playEat();
        this.spawnEatParticles(foodMesh.position);
        setTimeout(() => {
          this.foodGroup.remove(foodMesh);
          this.isEating = false;
        }, 500);
      }
    }, 30);
  }
  // Soap bubble wash animation
  triggerWash() {
    if (this.isSleeping) return;
    soundFx.playSparkle();
    for (let i = 0; i < 15; i++) {
      const bubbleGeo = new THREE.SphereGeometry(0.1 + Math.random() * 0.12, 12, 12);
      const bubbleMat = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.75,
        roughness: 0.1,
      });
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      b.position.set(
        (Math.random() - 0.5) * 1.5,
        0.5 + Math.random() * 1.2,
        (Math.random() - 0.5) * 1.5,
      );
      this.particleGroup.add(b);
      // Bubble pop timeout
      setTimeout(
        () => {
          this.particleGroup.remove(b);
        },
        1400 + Math.random() * 600,
      );
    }
  }
  spawnHeartParticles() {
    for (let i = 0; i < 5; i++) {
      const heartGeo = new THREE.SphereGeometry(0.09, 8, 8);
      const heartMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
      const h = new THREE.Mesh(heartGeo, heartMat);
      h.position.set(
        (Math.random() - 0.5) * 0.6,
        1.5 + (Math.random() - 0.5) * 0.3,
        0.5 + (Math.random() - 0.5) * 0.3,
      );
      this.particleGroup.add(h);
      let ht = 0;
      const anim = setInterval(() => {
        ht += 0.05;
        h.position.y += 0.035;
        h.scale.multiplyScalar(0.96);
        if (ht > 1) {
          clearInterval(anim);
          this.particleGroup.remove(h);
        }
      }, 30);
    }
  }
  spawnSleepDisturbedParticles() {
    const symbols = ['💤', 'Zzz', '✨', '💤'];
    for (let i = 0; i < 3; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, 32, 32);
      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.95 });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.32, 0.32, 0.32);
      sprite.position.set(
        this.petGroup.position.x + (Math.random() - 0.5) * 0.5,
        1.1 + (Math.random() - 0.5) * 0.2,
        this.petGroup.position.z + 0.3 + (Math.random() - 0.5) * 0.2,
      );
      this.particleGroup.add(sprite);
      let t = 0;
      const anim = setInterval(() => {
        t += 0.05;
        sprite.position.y += 0.025;
        sprite.position.x += Math.sin(t * 3) * 0.015;
        sprite.scale.multiplyScalar(0.97);
        if (t > 1) {
          clearInterval(anim);
          this.particleGroup.remove(sprite);
        }
      }, 30);
    }
  }
  spawnEatParticles(pos) {
    for (let i = 0; i < 8; i++) {
      const crumbGeo = new THREE.DodecahedronGeometry(0.04);
      const crumbMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const c = new THREE.Mesh(crumbGeo, crumbMat);
      c.position.copy(pos);
      this.particleGroup.add(c);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        Math.random() * 2,
        (Math.random() - 0.5) * 1.5,
      );
      let ct = 0;
      const anim = setInterval(() => {
        ct += 0.05;
        c.position.addScaledVector(vel, 0.03);
        vel.y -= 0.1;
        if (ct > 0.6) {
          clearInterval(anim);
          this.particleGroup.remove(c);
        }
      }, 30);
    }
  }
  setSleeping(sleeping) {
    this.isSleeping = sleeping;
    if (sleeping) {
      if (this.isDancing) {
        this.stopDance();
      }
      soundFx.playSleep();
    } else {
      // Waking up: restore neutral pose
      this.petGroup.position.set(0, 0, 0);
      this.petGroup.rotation.set(0, 0, 0);
      if (this.petParts.head) this.petParts.head.rotation.set(0, 0, 0);
      if (this.petParts.eyeL && this.petParts.eyeR) {
        this.petParts.eyeL.scale.set(1, 1, 1);
        this.petParts.eyeR.scale.set(1, 1, 1);
      }
    }
  }
  setMood(mood) {
    this.currentMood = mood;
  }
  // Animation Loop
  startLoop() {
    let lastTime = performance.now();
    const tick = () => {
      if (this.isDisposed) return;
      this.frameId = requestAnimationFrame(tick);
      try {
        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        const time = this.clock.getElapsedTime();
        this.updateAnimations(time, delta);
        this.renderer.render(this.scene, this.camera);
      } catch (err) {
        // Safe guard to prevent frame loop death
        console.warn('Animation loop warn:', err);
      }
    };
    this.frameId = requestAnimationFrame(tick);
  }
  updateAnimations(time, delta) {
    // 0. J0ssy bot companion hover & lights
    if (this.jossyGroup && this.isJossyOwned) {
      if (this.isJossySleeping) {
        // Resting & charging mode
        this.jossyGroup.position.set(1.4, 0.45 + Math.sin(time * 2) * 0.03, 0.4);
        this.jossyGroup.rotation.z = 0.12;
        if (this.jossyEyeMesh) {
          this.jossyEyeMesh.material.color.setHex(0x10b981);
        }
        if (this.jossyGlowLight) {
          this.jossyGlowLight.color.setHex(0x10b981);
          this.jossyGlowLight.intensity = 0.35 + Math.sin(time * 3) * 0.15;
        }
      } else if (this.jossyBattery <= 0) {
        // Empty battery: shut down on floor
        this.jossyGroup.position.set(1.4, 0.22, 0.4);
        this.jossyGroup.rotation.x = 0.25;
        this.jossyGroup.rotation.z = 0.15;
        if (this.jossyEyeMesh) {
          this.jossyEyeMesh.material.color.setHex(0x1e293b);
        }
        if (this.jossyGlowLight) {
          this.jossyGlowLight.intensity = 0;
        }
      } else {
        // Active floating hover
        this.jossyGroup.rotation.x = 0;
        this.jossyGroup.rotation.z = Math.sin(time * 1.5) * 0.05;
        this.jossyGroup.position.set(
          1.35 + Math.cos(time * 1.2) * 0.05,
          1.35 + Math.sin(time * 2.8) * 0.09,
          0.35 + Math.sin(time * 1.5) * 0.05,
        );
        if (this.jossyArmL) this.jossyArmL.position.y = 0.02 + Math.sin(time * 3.5) * 0.03;
        if (this.jossyArmR) this.jossyArmR.position.y = 0.02 - Math.sin(time * 3.5) * 0.03;
        // Eye color & warning blink when low battery (< 20%)
        const isLow = this.jossyBattery < 20;
        const eyeCol = isLow ? (Math.sin(time * 8) > 0 ? 0xef4444 : 0x7f1d1d) : 0x00f5ff;
        if (this.jossyEyeMesh) {
          this.jossyEyeMesh.material.color.setHex(eyeCol);
        }
        if (this.jossyGlowLight) {
          this.jossyGlowLight.color.setHex(isLow ? 0xef4444 : 0x00f5ff);
          this.jossyGlowLight.intensity = 0.6;
        }
      }
    }
    // 1. Dancing or idle animations
    if (this.isDancing && this.currentDanceStyle) {
      if (this.currentDanceStyle === 'robot_stiff') {
        // Discrete stepped mechanical rotation
        const step = Math.floor(time * 4);
        this.petGroup.rotation.y = (step % 4) * (Math.PI / 2);
        this.petGroup.position.y = step % 2 === 0 ? 0.22 : 0;
        if (this.petParts.head) this.petParts.head.rotation.x = step % 2 === 0 ? -0.2 : 0.2;
        if (this.petParts.pawFL) this.petParts.pawFL.position.y = step % 2 === 0 ? 0.35 : 0.18;
        if (this.petParts.pawFR) this.petParts.pawFR.position.y = step % 2 === 1 ? 0.35 : 0.18;
      } else if (this.currentDanceStyle === 'wiggle') {
        // Fast rhythmic hip wiggle
        this.petGroup.rotation.y = Math.sin(time * 14) * 0.45;
        this.petGroup.rotation.z = Math.cos(time * 14) * 0.22;
        this.petGroup.position.y = Math.abs(Math.sin(time * 14)) * 0.22;
        if (this.petParts.tail) this.petParts.tail.rotation.y = Math.sin(time * 28) * 0.7;
        if (this.petParts.earL && this.petParts.earR) {
          this.petParts.earL.rotation.z = 1.2 + Math.sin(time * 14) * 0.2;
          this.petParts.earR.rotation.z = -1.2 - Math.sin(time * 14) * 0.2;
        }
      } else if (this.currentDanceStyle === 'breakdance') {
        // 360-spin with aerial flip
        this.petGroup.rotation.y = time * 8;
        this.petGroup.position.y = 0.15 + Math.abs(Math.sin(time * 4)) * 0.7;
        this.petGroup.rotation.x = Math.sin(time * 4) * 0.25;
      } else if (this.currentDanceStyle === 'disco') {
        // Shuffle bounce & sky pointer
        this.petGroup.position.x = Math.sin(time * 6) * 0.45;
        this.petGroup.position.y = Math.abs(Math.sin(time * 12)) * 0.35;
        this.petGroup.rotation.z = Math.sin(time * 6) * 0.2;
        if (this.petParts.pawFR) this.petParts.pawFR.position.set(0.28, 0.48, 0.35);
      } else if (this.currentDanceStyle === 'moonwalk') {
        // Smooth reverse slide
        this.petGroup.rotation.y = -Math.PI / 2.2;
        this.petGroup.position.x = Math.sin(time * 2.5) * 0.65;
        this.petGroup.position.y = 0.05;
        if (this.petParts.head) this.petParts.head.rotation.z = -0.15;
      }
      if (this.currentPetId === 'patar') {
        // Patar Crab Rave dance: claws pump up high and snap rapidly!
        if (this.petParts.clawL) {
          this.petParts.clawL.rotation.z = Math.sin(time * 10) * 0.4 + 0.3;
          this.petParts.clawL.position.y = 0.25 + Math.abs(Math.sin(time * 10)) * 0.15;
        }
        if (this.petParts.clawR) {
          this.petParts.clawR.rotation.z = -Math.sin(time * 10) * 0.4 - 0.3;
          this.petParts.clawR.position.y = 0.25 + Math.abs(Math.cos(time * 10)) * 0.15;
        }
        if (this.petParts.clawPincerL) {
          this.petParts.clawPincerL.rotation.z = Math.sin(time * 16) * 0.4 + 0.4;
        }
        if (this.petParts.clawPincerR) {
          this.petParts.clawPincerR.rotation.z = -Math.sin(time * 16) * 0.4 - 0.4;
        }
      }
    } else if (this.isSleeping) {
      // Pet curls up and breathes slowly
      this.petGroup.position.y = -0.15;
      this.petGroup.rotation.z = 0.25;
      if (this.petParts.head) {
        this.petParts.head.rotation.x = 0.35;
      }
      if (this.petParts.eyeL && this.petParts.eyeR) {
        this.petParts.eyeL.scale.set(1, 0.1, 1);
        this.petParts.eyeR.scale.set(1, 0.1, 1);
      }
      if (this.currentPetId === 'patar') {
        if (this.petParts.clawL) this.petParts.clawL.rotation.z = -0.4;
        if (this.petParts.clawR) this.petParts.clawR.rotation.z = 0.4;
        if (this.petParts.clawPincerL) this.petParts.clawPincerL.rotation.z = 0;
        if (this.petParts.clawPincerR) this.petParts.clawPincerR.rotation.z = 0;
      }
      // Floating Zzz particle occasionally
      if (Math.random() < 0.02) {
        this.spawnZzzParticle();
      }
    } else {
      this.petGroup.rotation.z = 0;
      // Normal awake idle
      const breath = Math.sin(time * 3) * 0.04;
      this.petGroup.position.y =
        (this.isPetting ? Math.abs(Math.sin(time * 12)) * 0.3 : 0) + breath;
      // Natural eye blinking
      const blink = Math.sin(time * 0.8);
      const isBlinking = blink > 0.96;
      if (this.petParts.eyeL && this.petParts.eyeR) {
        const eyeScaleY = isBlinking ? 0.15 : 1;
        this.petParts.eyeL.scale.set(1, eyeScaleY, 1);
        this.petParts.eyeR.scale.set(1, eyeScaleY, 1);
      }
      // Animal specific animations
      if (this.currentPetId === 'milo') {
        // Milo tail wagging (faster if petting)
        if (this.petParts.tail) {
          const wagSpeed = this.isPetting ? 22 : 8;
          this.petParts.tail.rotation.y = Math.sin(time * wagSpeed) * 0.55;
        }
        // Milo floppy ears wiggle
        if (this.petParts.earL && this.petParts.earR) {
          this.petParts.earL.rotation.z = 1.2 + Math.sin(time * 4) * 0.08;
          this.petParts.earR.rotation.z = -1.2 - Math.sin(time * 4) * 0.08;
        }
        // Tongue peek
        if (this.petParts.tongue) {
          this.petParts.tongue.scale.set(1, 1, 1 + Math.sin(time * 5) * 0.3);
        }
      } else if (this.currentPetId === 'fizzi') {
        // Fizzi Betta swimming motion
        const swimAngle = Math.sin(time * 2.5) * 0.3;
        if (this.petParts.body) {
          this.petParts.body.rotation.y = swimAngle * 0.3;
        }
        if (this.petParts.finTail) {
          this.petParts.finTail.rotation.y = Math.PI / 2 + Math.sin(time * 5) * 0.45;
        }
        if (this.petParts.finDorsal) {
          this.petParts.finDorsal.rotation.z = -0.3 + Math.sin(time * 3) * 0.15;
        }
        if (this.petParts.finL && this.petParts.finR) {
          this.petParts.finL.rotation.y = 0.5 + Math.sin(time * 6) * 0.3;
          this.petParts.finR.rotation.y = -0.5 - Math.sin(time * 6) * 0.3;
        }
        // Gentle circular swim path
        this.petGroup.position.x = Math.sin(time * 0.8) * 0.35;
        this.petGroup.position.z = Math.cos(time * 0.8) * 0.25;
        // Occasional rising water bubble
        if (Math.random() < 0.04) {
          this.spawnWaterBubble();
        }
      } else if (this.currentPetId === 'ngkur') {
        // Ngkur cat tail curled swaying
        if (this.petParts.tail) {
          this.petParts.tail.rotation.y = Math.sin(time * 3.5) * 0.4;
          this.petParts.tail.rotation.z = Math.cos(time * 2.5) * 0.2;
        }
        // Hero cape flutter
        if (this.petParts.cape) {
          this.petParts.cape.rotation.x = -0.3 + Math.sin(time * 6) * 0.12;
        }
      } else if (this.currentPetId === 'patar') {
        // Patar the grumpy crab idle: sideways scuttle waddle & claw snaps
        const scuttleSpeed = this.isPetting ? 8 : 2.5;
        const scuttleRange = this.isPetting ? 0.35 : 0.18;
        this.petGroup.position.x = Math.sin(time * scuttleSpeed) * scuttleRange;
        // Claw idle sway & snapping
        const snapSpeed = this.isPetting ? 14 : 3;
        if (this.petParts.clawL) {
          this.petParts.clawL.rotation.y = Math.sin(time * snapSpeed) * 0.15;
        }
        if (this.petParts.clawR) {
          this.petParts.clawR.rotation.y = -Math.sin(time * snapSpeed) * 0.15;
        }
        if (this.petParts.clawPincerL) {
          this.petParts.clawPincerL.rotation.z = 0.2 + Math.abs(Math.sin(time * snapSpeed)) * 0.3;
        }
        if (this.petParts.clawPincerR) {
          this.petParts.clawPincerR.rotation.z = -0.2 - Math.abs(Math.sin(time * snapSpeed)) * 0.3;
        }
        // 6 legs alternating scuttling steps
        if (this.petParts.crabLegs) {
          this.petParts.crabLegs.forEach((leg, idx) => {
            const phase = idx % 2 === 0 ? 0 : Math.PI;
            leg.rotation.z =
              (idx < 3 ? 1 : -1) * (0.1 + Math.sin(time * scuttleSpeed * 2 + phase) * 0.12);
          });
        }
      }
    }
    // Toy ball physics
    if (this.toyBall && this.toyBallVelocity.lengthSq() > 0.001) {
      this.toyBall.position.addScaledVector(this.toyBallVelocity, delta);
      this.toyBallVelocity.y -= 9.8 * delta; // Gravity
      // Floor bounce
      if (this.toyBall.position.y <= 0.2) {
        this.toyBall.position.y = 0.2;
        this.toyBallVelocity.y = -this.toyBallVelocity.y * 0.65;
        this.toyBallVelocity.x *= 0.85;
        this.toyBallVelocity.z *= 0.85;
        if (Math.abs(this.toyBallVelocity.y) < 0.2) {
          this.toyBallVelocity.set(0, 0, 0);
        }
      }
      // Wall boundary
      if (this.toyBall.position.x > 2.2 || this.toyBall.position.x < -2.2) {
        this.toyBallVelocity.x *= -0.7;
      }
      if (this.toyBall.position.z > 2.2 || this.toyBall.position.z < -2.2) {
        this.toyBallVelocity.z *= -0.7;
      }
    }
  }
  spawnZzzParticle() {
    const geo = new THREE.SphereGeometry(0.06, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0x93c5fd });
    const z = new THREE.Mesh(geo, mat);
    z.position.set(0.3 + Math.random() * 0.2, 1.4, 0.4);
    this.particleGroup.add(z);
    let t = 0;
    const anim = setInterval(() => {
      t += 0.05;
      z.position.y += 0.03;
      z.position.x += Math.sin(t * 4) * 0.02;
      z.scale.multiplyScalar(0.96);
      if (t > 1.2) {
        clearInterval(anim);
        this.particleGroup.remove(z);
      }
    }, 40);
  }
  spawnWaterBubble() {
    const geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
    const bubble = new THREE.Mesh(geo, mat);
    bubble.position.set((Math.random() - 0.5) * 1.2, 0.3, (Math.random() - 0.5) * 1.2);
    this.particleGroup.add(bubble);
    let t = 0;
    const anim = setInterval(() => {
      t += 0.05;
      bubble.position.y += 0.04;
      bubble.position.x += Math.sin(t * 5) * 0.01;
      if (bubble.position.y > 2.3) {
        clearInterval(anim);
        this.particleGroup.remove(bubble);
      }
    }, 35);
  }
  spawnMusicNoteParticle() {
    const symbols = ['🎵', '🎶', '⭐', '✨', '🕺', '💃'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 32, 32);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.95 });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.35, 0.35, 0.35);
    sprite.position.set(
      this.petGroup.position.x + (Math.random() - 0.5) * 1.2,
      1.2 + Math.random() * 0.7,
      this.petGroup.position.z + (Math.random() - 0.5) * 0.6,
    );
    this.particleGroup.add(sprite);
    let t = 0;
    const anim = setInterval(() => {
      t += 0.05;
      sprite.position.y += 0.03;
      sprite.position.x += Math.sin(t * 4) * 0.015;
      sprite.scale.multiplyScalar(0.97);
      if (t > 1) {
        clearInterval(anim);
        this.particleGroup.remove(sprite);
      }
    }, 30);
  }
  dispose() {
    this.isDisposed = true;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    this.resizeObserver?.disconnect();
    if (this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
      if (this.container.contains(this.renderer.domElement)) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
    this.renderer.dispose();
  }
}
