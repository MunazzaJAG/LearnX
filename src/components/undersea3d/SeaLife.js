import * as THREE from "three";

/**
 * 3D SeaLife Simulation
 * Art-directed precisely to match visual references:
 * - Giant Bioluminescent Leviathan / Sea Dragon (Ref 2): Serpentine undulating creature with glowing electric purple & cyan stripes cruising through the deep midground.
 * - Yellow-and-Black Striped Angel Fish / Moorish Idols (Ref 3): Tight, reactive tropical fish schools that dart around coral heads.
 * - Graceful swimming Hawksbill Sea Turtle with articulated flippers.
 * - Translucent pulsating bioluminescent jellyfish swarms with herding physics.
 * - Ancient cybernetic Reef Guardian.
 */
export class SeaLifeManager {
  constructor(scene) {
    this.scene = scene;
    this.fishSchools = [];
    this.jellyfishSwarm = [];
    this.guardian = null;
    this.turtle = null;
    this.leviathan = null;

    this.initSeaTurtle();
    this.initFishSchools();
    this.initBioluminescentLeviathan();
    this.initJellyfishSwarm();
    this.initMantaGuardian();
  }

  // 1. Graceful Swimming Sea Turtle
  initSeaTurtle() {
    this.turtleGroup = new THREE.Group();
    this.turtleGroup.name = "SeaTurtle";
    this.turtleGroup.position.set(-18, 5.5, 5);

    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Olive green carapace
      roughness: 0.5,
      metalness: 0.1
    });

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x86efac, // Pale sea green skin
      roughness: 0.6
    });

    // Oval Carapace Shell
    const shellGeo = new THREE.SphereGeometry(1.2, 16, 12);
    shellGeo.scale(1.0, 0.45, 1.35);
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.castShadow = true;
    this.turtleGroup.add(shell);

    // Turtle Head
    const headGeo = new THREE.SphereGeometry(0.35, 12, 12);
    headGeo.scale(0.8, 0.7, 1.2);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 0.1, 1.6);
    this.turtleGroup.add(head);

    // Front Left Flipper (Articulated for flapping)
    this.turtleFrontL = new THREE.Group();
    this.turtleFrontL.position.set(-1.0, 0, 0.6);
    const flipperGeo = new THREE.BoxGeometry(1.2, 0.05, 0.45);
    const flipperL = new THREE.Mesh(flipperGeo, bodyMat);
    flipperL.position.set(-0.6, 0, 0);
    this.turtleFrontL.add(flipperL);
    this.turtleGroup.add(this.turtleFrontL);

    // Front Right Flipper
    this.turtleFrontR = new THREE.Group();
    this.turtleFrontR.position.set(1.0, 0, 0.6);
    const flipperR = new THREE.Mesh(flipperGeo, bodyMat);
    flipperR.position.set(0.6, 0, 0);
    this.turtleFrontR.add(flipperR);
    this.turtleGroup.add(this.turtleFrontR);

    // Rear Flippers
    const rearGeo = new THREE.BoxGeometry(0.5, 0.04, 0.35);
    const rearL = new THREE.Mesh(rearGeo, bodyMat);
    rearL.position.set(-0.7, -0.1, -1.3);
    const rearR = new THREE.Mesh(rearGeo, bodyMat);
    rearR.position.set(0.7, -0.1, -1.3);
    this.turtleGroup.add(rearL, rearR);

    this.scene.add(this.turtleGroup);
    this.turtleState = { angle: 0, speed: 0.35 };
  }

  // 2. Yellow-and-Black Striped Tropical Angel Fish & Damselfish (Matches Ref 3)
  initFishSchools() {
    const schoolConfigs = [
      {
        name: "MoorishIdols", // Yellow and black striped tropical angel fish (Ref 3)
        count: 24,
        type: "striped",
        radius: 14,
        center: new THREE.Vector3(-12, 3.2, 14),
        speed: 2.4
      },
      {
        name: "CyanDamselfish",
        count: 20,
        type: "cyan",
        radius: 12,
        center: new THREE.Vector3(15, 2.5, -6),
        speed: 2.0
      },
      {
        name: "SunburstTangs",
        count: 18,
        type: "yellow",
        radius: 15,
        center: new THREE.Vector3(20, 4.0, 20),
        speed: 2.2
      }
    ];

    schoolConfigs.forEach((config) => {
      const schoolGroup = new THREE.Group();
      schoolGroup.name = `School_${config.name}`;
      const fishItems = [];

      for (let i = 0; i < config.count; i++) {
        const fishMesh = new THREE.Group();

        // Fusiform flattened body
        const bodyGeo = new THREE.ConeGeometry(0.22, 0.75, 8);
        bodyGeo.rotateZ(Math.PI / 2);

        let bodyMat;
        if (config.type === "striped") {
          // Yellow and Black striped Angel Fish (Ref 3)
          bodyMat = new THREE.MeshStandardMaterial({
            color: 0xfacc15, // Bright yellow
            roughness: 0.3,
            metalness: 0.1
          });
        } else if (config.type === "cyan") {
          bodyMat = new THREE.MeshStandardMaterial({
            color: 0x06b6d4, // Electric cyan
            emissive: 0x0891b2,
            emissiveIntensity: 0.3,
            roughness: 0.3
          });
        } else {
          bodyMat = new THREE.MeshStandardMaterial({
            color: 0xfbbf24, // Sunburst gold
            roughness: 0.3
          });
        }

        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.scale.set(0.65, 1.3, 0.45);
        fishMesh.add(body);

        // Black stripes for Moorish Idols (Ref 3)
        if (config.type === "striped") {
          const stripeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
          const stripeGeo = new THREE.BoxGeometry(0.08, 0.38, 0.22);
          const s1 = new THREE.Mesh(stripeGeo, stripeMat);
          s1.position.set(-0.08, 0, 0);
          const s2 = new THREE.Mesh(stripeGeo, stripeMat);
          s2.position.set(0.12, 0, 0);
          fishMesh.add(s1, s2);
        }

        // Tail Fin
        const tailGeo = new THREE.BufferGeometry();
        const vertices = new Float32Array([
          0, 0, 0,
          -0.35, 0.22, 0,
          -0.35, -0.22, 0
        ]);
        tailGeo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        const tailMat = new THREE.MeshBasicMaterial({
          color: config.type === "striped" ? 0x0f172a : (config.color || 0x38bdf8),
          side: THREE.DoubleSide
        });
        const tail = new THREE.Mesh(tailGeo, tailMat);
        tail.position.x = -0.38;
        fishMesh.add(tail);

        const initAngle = (i / config.count) * Math.PI * 2;
        const fishRadius = config.radius + (Math.random() - 0.5) * 4.5;
        fishMesh.position.set(
          config.center.x + Math.cos(initAngle) * fishRadius,
          config.center.y + (Math.random() - 0.5) * 2.2,
          config.center.z + Math.sin(initAngle) * fishRadius
        );

        schoolGroup.add(fishMesh);
        fishItems.push({
          mesh: fishMesh,
          tail: tail,
          angle: initAngle,
          radius: fishRadius,
          speed: config.speed * (0.85 + Math.random() * 0.3),
          yBase: fishMesh.position.y,
          swimOffset: Math.random() * Math.PI * 2
        });
      }

      this.scene.add(schoolGroup);
      this.fishSchools.push({ center: config.center, items: fishItems });
    });
  }

  // 3. Giant Bioluminescent Leviathan / Sea Dragon (Matches Reference 2)
  initBioluminescentLeviathan() {
    this.leviathanGroup = new THREE.Group();
    this.leviathanGroup.name = "BioluminescentLeviathan";
    this.leviathanGroup.position.set(25, 7.5, -35);

    // Dark sleek aquatic hide
    const hideMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b, // Deep indigo
      roughness: 0.3,
      metalness: 0.4
    });

    // Luminous electric purple & cyan glowing bioluminescent stripes (Ref 2)
    const biolumMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7, // Electric purple
      emissive: 0x9333ea,
      emissiveIntensity: 1.6,
      roughness: 0.2
    });

    const cyanBiolumMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee, // Electric cyan
      emissive: 0x06b6d4,
      emissiveIntensity: 1.4,
      roughness: 0.2
    });

    // Articulated serpentine spine segments (8 interconnected body segments)
    this.leviathanSegments = [];
    const segmentCount = 9;

    for (let s = 0; s < segmentCount; s++) {
      const segGroup = new THREE.Group();
      segGroup.position.set(0, 0, -s * 1.5);

      const rad = Math.max(0.3, 1.4 - s * 0.12);
      const segGeo = new THREE.SphereGeometry(rad, 16, 12);
      segGeo.scale(0.8, 1.1, 1.3);
      const segMesh = new THREE.Mesh(segGeo, hideMat);
      segGroup.add(segMesh);

      // Bioluminescent glowing spinal crest
      const crestGeo = new THREE.BoxGeometry(0.1, rad * 1.2, 0.8);
      const crest = new THREE.Mesh(crestGeo, s % 2 === 0 ? biolumMat : cyanBiolumMat);
      crest.position.y = rad * 0.8;
      segGroup.add(crest);

      // Bioluminescent side stripes
      const stripeGeo = new THREE.BoxGeometry(rad * 1.65, 0.12, 0.6);
      const stripe = new THREE.Mesh(stripeGeo, cyanBiolumMat);
      stripe.position.y = 0;
      segGroup.add(stripe);

      this.leviathanGroup.add(segGroup);
      this.leviathanSegments.push({ group: segGroup, baseZ: -s * 1.5, index: s });
    }

    // Majestic head with sweeping dorsal fins
    const headGroup = this.leviathanSegments[0].group;
    const hornGeo = new THREE.ConeGeometry(0.18, 1.8, 8);
    const hornL = new THREE.Mesh(hornGeo, biolumMat);
    hornL.position.set(-0.8, 1.1, 0.4);
    hornL.rotation.set(-0.4, 0, -0.5);
    headGroup.add(hornL);

    const hornR = new THREE.Mesh(hornGeo, biolumMat);
    hornR.position.set(0.8, 1.1, 0.4);
    hornR.rotation.set(-0.4, 0, 0.5);
    headGroup.add(hornR);

    // Glowing eyes
    const eyeGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, cyanBiolumMat);
    eyeL.position.set(-0.85, 0.2, 0.9);
    const eyeR = new THREE.Mesh(eyeGeo, cyanBiolumMat);
    eyeR.position.set(0.85, 0.2, 0.9);
    headGroup.add(eyeL, eyeR);

    // Pectoral Glide Wings
    const wingGeo = new THREE.BoxGeometry(4.5, 0.08, 1.6);
    const wingL = new THREE.Mesh(wingGeo, hideMat);
    wingL.position.set(-2.6, -0.2, 0.2);
    wingL.rotation.y = 0.25;
    this.leviathanWingL = wingL;
    headGroup.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, hideMat);
    wingR.position.set(2.6, -0.2, 0.2);
    wingR.rotation.y = -0.25;
    this.leviathanWingR = wingR;
    headGroup.add(wingR);

    this.scene.add(this.leviathanGroup);
    this.leviathanState = { angle: 0, speed: 0.22 };
  }

  // 4. Bioluminescent Jellyfish Swarm
  initJellyfishSwarm() {
    this.jellyfishGroup = new THREE.Group();
    this.jellyfishGroup.name = "BioluminescentJellyfish";

    const count = 8; // Exactly matches Sublevel 4: Jellyfish Herding
    const bellMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.72
    });

    const tentacleMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.65
    });

    for (let i = 0; i < count; i++) {
      const jelly = new THREE.Group();
      const spreadX = 35 + (i % 3) * 4.5;
      const spreadZ = -8 + (i % 4) * 4.0;
      const startPos = new THREE.Vector3(spreadX, 3.5 + (i % 3) * 1.5, spreadZ);
      jelly.position.copy(startPos);

      // Bell
      const bellGeo = new THREE.SphereGeometry(0.75, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const bell = new THREE.Mesh(bellGeo, bellMat);
      jelly.add(bell);

      // Inner glowing nucleus
      const coreGeo = new THREE.SphereGeometry(0.28, 8, 8);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.15;
      jelly.add(core);

      // Trailing tentacles
      const tenGeo = new THREE.CylinderGeometry(0.015, 0.02, 1.8, 6);
      for (let t = 0; t < 6; t++) {
        const tMesh = new THREE.Mesh(tenGeo, tentacleMat);
        const tAngle = (t / 6) * Math.PI * 2;
        tMesh.position.set(Math.cos(tAngle) * 0.45, -0.9, Math.sin(tAngle) * 0.45);
        jelly.add(tMesh);
      }

      this.jellyfishGroup.add(jelly);
      this.jellyfishSwarm.push({
        group: jelly,
        bell: bell,
        basePos: startPos.clone(),
        sanctuaryPos: new THREE.Vector3(40 + (i % 2) * 3, 4.0, -10 + (i % 4) * 2),
        isHerded: false,
        pulseOffset: (i / count) * Math.PI * 2
      });
    }

    this.scene.add(this.jellyfishGroup);
  }

  // 5. Ancient Mechanical Manta Guardian
  initMantaGuardian() {
    this.guardianGroup = new THREE.Group();
    this.guardianGroup.name = "MechanicalMantaGuardian";
    this.guardianGroup.position.set(0, 4.5, -45);

    this.guardianHullMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2
    });

    this.guardianGlowMat = new THREE.MeshBasicMaterial({
      color: 0xef4444 // Hostile red initially, turns serene turquoise when repaired!
    });

    // Central Main Body
    const bodyGeo = new THREE.ConeGeometry(1.6, 5.0, 16);
    bodyGeo.rotateX(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, this.guardianHullMat);
    this.guardianGroup.add(body);

    // Left Wing
    this.leftWing = new THREE.Group();
    this.leftWing.position.set(-0.8, 0, 0);
    const lGeo = new THREE.BufferGeometry();
    const lVertices = new Float32Array([
      0, 0, 1.8,
      -5.2, 0, -1.0,
      0, 0, -2.2
    ]);
    lGeo.setAttribute("position", new THREE.BufferAttribute(lVertices, 3));
    lGeo.computeVertexNormals();
    const lMesh = new THREE.Mesh(lGeo, this.guardianHullMat);
    this.leftWing.add(lMesh);
    this.guardianGroup.add(this.leftWing);

    // Right Wing
    this.rightWing = new THREE.Group();
    this.rightWing.position.set(0.8, 0, 0);
    const rGeo = new THREE.BufferGeometry();
    const rVertices = new Float32Array([
      0, 0, 1.8,
      5.2, 0, -1.0,
      0, 0, -2.2
    ]);
    rGeo.setAttribute("position", new THREE.BufferAttribute(rVertices, 3));
    rGeo.computeVertexNormals();
    const rMesh = new THREE.Mesh(rGeo, this.guardianHullMat);
    this.rightWing.add(rMesh);
    this.guardianGroup.add(this.rightWing);

    // Optical Sensor Eye
    const eyeGeo = new THREE.BoxGeometry(0.8, 0.2, 0.3);
    this.guardianEye = new THREE.Mesh(eyeGeo, this.guardianGlowMat);
    this.guardianEye.position.set(0, 0.25, 2.2);
    this.guardianGroup.add(this.guardianEye);

    // Tail
    const tailGeo = new THREE.CylinderGeometry(0.06, 0.02, 4.5, 8);
    tailGeo.rotateX(Math.PI / 2);
    const tail = new THREE.Mesh(tailGeo, this.guardianHullMat);
    tail.position.set(0, 0, -4.0);
    this.guardianGroup.add(tail);

    this.scene.add(this.guardianGroup);
    this.guardianState = { isFriendly: false, wingTime: 0 };
  }

  herdJellyfish() {
    this.jellyfishSwarm.forEach((jelly) => {
      jelly.isHerded = true;
    });
  }

  setGuardianFriendly(friendly = true) {
    this.guardianState.isFriendly = friendly;
    if (this.guardianGlowMat) {
      this.guardianGlowMat.color.set(friendly ? 0x06b6d4 : 0xef4444);
    }
  }

  update(delta) {
    const time = Date.now() * 0.001;

    // 1. Update Sea Turtle Swimming
    if (this.turtleGroup) {
      this.turtleState.angle += delta * 0.15;
      this.turtleGroup.position.x = -18 + Math.cos(this.turtleState.angle) * 16;
      this.turtleGroup.position.z = 5 + Math.sin(this.turtleState.angle) * 16;
      this.turtleGroup.position.y = 5.5 + Math.sin(time * 0.8) * 0.6;
      this.turtleGroup.rotation.y = -this.turtleState.angle + Math.PI / 2;

      // Flipper flapping kinematics
      const flipperFlap = Math.sin(time * 2.2) * 0.35;
      this.turtleFrontL.rotation.z = flipperFlap;
      this.turtleFrontR.rotation.z = -flipperFlap;
    }

    // 2. Update Fish Schools
    this.fishSchools.forEach((school) => {
      school.items.forEach((fish) => {
        fish.angle += fish.speed * delta * 0.35;
        fish.mesh.position.x = school.center.x + Math.cos(fish.angle) * fish.radius;
        fish.mesh.position.z = school.center.z + Math.sin(fish.angle) * fish.radius;
        fish.mesh.position.y = fish.yBase + Math.sin(time * 3 + fish.swimOffset) * 0.25;

        fish.mesh.rotation.y = -fish.angle + Math.PI / 2;
        fish.tail.rotation.y = Math.sin(time * 12 + fish.swimOffset) * 0.45;
      });
    });

    // 3. Update Giant Bioluminescent Leviathan (Ref 2)
    if (this.leviathanGroup) {
      this.leviathanState.angle += delta * this.leviathanState.speed;
      this.leviathanGroup.position.x = Math.cos(this.leviathanState.angle) * 36;
      this.leviathanGroup.position.z = -25 + Math.sin(this.leviathanState.angle) * 22;
      this.leviathanGroup.position.y = 7.0 + Math.sin(time * 0.8) * 1.4;
      this.leviathanGroup.rotation.y = -this.leviathanState.angle + Math.PI / 2;

      // Serpentine spine undulation
      this.leviathanSegments.forEach((seg, idx) => {
        const wave = Math.sin(time * 2.5 - idx * 0.6) * 0.45;
        seg.group.position.x = wave;
        seg.group.rotation.y = wave * 0.35;
      });

      // Wing flex
      const wingFlap = Math.sin(time * 1.8) * 0.22;
      this.leviathanWingL.rotation.z = wingFlap;
      this.leviathanWingR.rotation.z = -wingFlap;
    }

    // 4. Update Jellyfish Swarm
    this.jellyfishSwarm.forEach((jelly) => {
      const p = Math.sin(time * 2.5 + jelly.pulseOffset);
      const pulseScale = 1.0 + p * 0.18;
      jelly.bell.scale.set(pulseScale, 1.0 - p * 0.12, pulseScale);

      if (jelly.isHerded) {
        jelly.group.position.lerp(jelly.sanctuaryPos, delta * 0.9);
      } else {
        jelly.group.position.y = jelly.basePos.y + Math.sin(time * 1.5 + jelly.pulseOffset) * 0.8;
      }
    });

    // 5. Update Guardian Manta
    if (this.guardianGroup) {
      this.guardianState.wingTime += delta * (this.guardianState.isFriendly ? 2.2 : 3.5);
      const wingFlap = Math.sin(this.guardianState.wingTime) * 0.28;
      this.leftWing.rotation.z = wingFlap;
      this.rightWing.rotation.z = -wingFlap;

      if (this.guardianState.isFriendly) {
        this.guardianGroup.position.x = Math.sin(time * 0.4) * 8;
        this.guardianGroup.position.y = 4.5 + Math.cos(time * 0.5) * 1.5;
        this.guardianGroup.rotation.y = time * 0.4;
      } else {
        this.guardianGroup.position.y = 4.0 + Math.sin(time * 1.2) * 0.4;
        this.guardianGroup.rotation.y = Math.sin(time * 0.5) * 0.3;
      }
    }
  }
}
