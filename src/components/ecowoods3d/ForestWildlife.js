import * as THREE from "three";

/**
 * LearnX — Forest Wildlife Manager
 * Lightweight, procedural 3D forest wildlife:
 * - Fluttering butterflies with animated wings in spirals
 * - Soaring forest birds gliding above the glades
 * - Peaceful sanctuary rabbits hopping with ear twitches
 * - Graceful forest deer near the sanctuary
 */
export class ForestWildlifeManager {
  constructor(scene) {
    this.scene = scene;
    this.butterflies = [];
    this.birds = [];
    this.rabbits = [];
    this.deer = null;
    this.clock = new THREE.Clock();

    this.initButterflies();
    this.initBirds();
    this.initRabbits();
    this.initDeer();
  }

  // 1. Butterflies fluttering with flapping wings
  initButterflies() {
    const butterflyColors = [0xf59e0b, 0x38bdf8, 0xec4899, 0xa855f7, 0x10b981];
    const wingGeo = new THREE.PlaneGeometry(0.35, 0.28);

    for (let i = 0; i < 12; i++) {
      const group = new THREE.Group();
      const color = butterflyColors[i % butterflyColors.length];

      const mat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });

      const leftWing = new THREE.Mesh(wingGeo, mat);
      leftWing.position.x = -0.16;
      leftWing.rotation.y = Math.PI / 4;

      const rightWing = new THREE.Mesh(wingGeo, mat);
      rightWing.position.x = 0.16;
      rightWing.rotation.y = -Math.PI / 4;

      group.add(leftWing);
      group.add(rightWing);

      // Random starting positions near trail flowers & sanctuary
      const angle = (i / 12) * Math.PI * 2;
      const radius = 6 + (i % 4) * 3;
      const startX = Math.cos(angle) * radius;
      const startZ = Math.sin(angle) * radius;

      group.position.set(startX, 1.2 + Math.random() * 1.5, startZ);
      this.scene.add(group);

      this.butterflies.push({
        group,
        leftWing,
        rightWing,
        center: new THREE.Vector3(startX, 1.5, startZ),
        orbitRadius: 1.5 + Math.random() * 2,
        speed: 1.2 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2
      });
    }
  }

  // 2. High-flying forest birds
  initBirds() {
    const birdGeo = new THREE.BufferGeometry();
    // Simple V-wing geometry for lightweight high-performance bird silhouette
    const vertices = new Float32Array([
      -0.6, 0, -0.3,
       0.0, 0,  0.4,
       0.6, 0, -0.3
    ]);
    birdGeo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    birdGeo.computeVertexNormals();

    const birdMat = new THREE.MeshStandardMaterial({
      color: 0x22382b,
      side: THREE.DoubleSide,
      roughness: 0.8
    });

    for (let i = 0; i < 5; i++) {
      const bird = new THREE.Mesh(birdGeo, birdMat);
      bird.scale.set(0.9, 0.9, 0.9);
      bird.position.set(-10 + i * 5, 12 + (i % 3) * 2, -5 + (i % 2) * 8);
      this.scene.add(bird);

      this.birds.push({
        mesh: bird,
        orbitRadius: 18 + i * 4,
        speed: 0.4 + i * 0.08,
        height: 12 + (i % 3) * 2,
        phase: (i / 5) * Math.PI * 2
      });
    }
  }

  // 3. Sanctuary Rabbits
  initRabbits() {
    const rabbitMat = new THREE.MeshStandardMaterial({
      color: 0xe2d9cb, // Soft sandy cream
      roughness: 0.8
    });
    const earMat = new THREE.MeshStandardMaterial({
      color: 0xf4a6a6, // Pinkish ear interior
      roughness: 0.9
    });

    const spawnPoints = [
      [13, 0.3, 9],
      [15, 0.3, 11],
      [14, 0.3, 12],
      [12.5, 0.3, 10.5]
    ];

    spawnPoints.forEach(([x, y, z], idx) => {
      const rabbitGroup = new THREE.Group();

      // Body
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), rabbitMat);
      body.scale.set(1, 0.8, 1.3);
      body.position.y = 0.28;
      rabbitGroup.add(body);

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), rabbitMat);
      head.position.set(0, 0.45, 0.3);
      rabbitGroup.add(head);

      // Ears
      const earGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.3, 8);
      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.position.set(-0.08, 0.65, 0.25);
      leftEar.rotation.z = -0.15;
      rabbitGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.position.set(0.08, 0.65, 0.25);
      rightEar.rotation.z = 0.15;
      rabbitGroup.add(rightEar);

      // Fluffy tail
      const tail = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), rabbitMat);
      tail.position.set(0, 0.35, -0.4);
      rabbitGroup.add(tail);

      rabbitGroup.position.set(x, y, z);
      this.scene.add(rabbitGroup);

      this.rabbits.push({
        group: rabbitGroup,
        baseY: y,
        origPos: new THREE.Vector3(x, y, z),
        hopPhase: idx * 1.5,
        isHopping: false
      });
    });
  }

  // 4. Forest Deer near Sanctuary
  initDeer() {
    const deerGroup = new THREE.Group();
    const deerMat = new THREE.MeshStandardMaterial({
      color: 0x8c5e3c, // Warm fawn brown
      roughness: 0.7
    });
    const antlerMat = new THREE.MeshStandardMaterial({
      color: 0x4a3728, // Dark antler horn
      roughness: 0.6
    });

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 1.8, 12), deerMat);
    body.rotation.x = Math.PI / 2;
    body.position.y = 1.3;
    deerGroup.add(body);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.9, 10), deerMat);
    neck.position.set(0, 1.9, 0.85);
    neck.rotation.x = -Math.PI / 6;
    deerGroup.add(neck);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.7, 10), deerMat);
    head.rotation.x = Math.PI / 2 + 0.2;
    head.position.set(0, 2.3, 1.15);
    deerGroup.add(head);

    // Antlers
    const leftAntler = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.6, 6), antlerMat);
    leftAntler.position.set(-0.25, 2.7, 1.0);
    leftAntler.rotation.z = -0.4;
    deerGroup.add(leftAntler);

    const rightAntler = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.6, 6), antlerMat);
    rightAntler.position.set(0.25, 2.7, 1.0);
    rightAntler.rotation.z = 0.4;
    deerGroup.add(rightAntler);

    // 4 Legs
    const legGeo = new THREE.CylinderGeometry(0.09, 0.07, 1.2, 8);
    const legPositions = [
      [-0.32, 0.6, 0.65],
      [0.32, 0.6, 0.65],
      [-0.32, 0.6, -0.65],
      [0.32, 0.6, -0.65]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, deerMat);
      leg.position.set(lx, ly, lz);
      deerGroup.add(leg);
    });

    deerGroup.position.set(16.5, 0, 8);
    deerGroup.rotation.y = -Math.PI / 3;
    this.scene.add(deerGroup);
    this.deer = deerGroup;
  }

  // Animation Update Loop
  update(delta) {
    const time = this.clock.getElapsedTime();

    // 1. Butterflies
    this.butterflies.forEach((b) => {
      const t = time * b.speed + b.offset;
      const bx = b.center.x + Math.sin(t) * b.orbitRadius;
      const bz = b.center.z + Math.cos(t) * b.orbitRadius;
      const by = b.center.y + Math.sin(t * 2) * 0.4;

      b.group.position.set(bx, by, bz);
      b.group.rotation.y = Math.atan2(Math.cos(t), -Math.sin(t));

      // Flap wings rapidly
      const flap = Math.sin(time * 18 + b.offset) * 0.75;
      b.leftWing.rotation.y = Math.PI / 4 + flap;
      b.rightWing.rotation.y = -Math.PI / 4 - flap;
    });

    // 2. High-flying birds circling overhead
    this.birds.forEach((bird) => {
      const angle = time * bird.speed + bird.phase;
      const bx = Math.cos(angle) * bird.orbitRadius;
      const bz = Math.sin(angle) * bird.orbitRadius;
      bird.mesh.position.set(bx, bird.height + Math.sin(time + bird.phase) * 0.5, bz);
      bird.mesh.rotation.y = -angle + Math.PI / 2;
    });

    // 3. Rabbits hopping gently
    this.rabbits.forEach((r, idx) => {
      const hopCycle = Math.sin(time * 2.5 + r.hopPhase);
      if (hopCycle > 0.4) {
        r.group.position.y = r.baseY + (hopCycle - 0.4) * 0.35;
      } else {
        r.group.position.y = r.baseY;
      }
    });

    // 4. Deer breathing / head nodding
    if (this.deer) {
      this.deer.position.y = Math.sin(time * 1.5) * 0.04;
    }
  }
}
