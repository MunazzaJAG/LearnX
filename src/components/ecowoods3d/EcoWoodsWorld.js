import * as THREE from "three";

/**
 * LearnX — Eco Woods: The Living Forest 3D World Engine
 * 
 * Crafted specifically for the user's visual direction:
 * - Tall majestic trees with layered foliage and sprawling mossy roots
 * - Natural dirt trails with stepping stones and wooden bridges
 * - Flowing forest river that transforms from murky to sparkling clear
 * - Volumetric warm sunlight shafts, golden pollen, and floating fireflies
 * - Dynamic world responses for all 6 missions:
 *   1. Ancient Forest Gate swings open
 *   2. Stream water clears & filtration waterwheel turns
 *   3. Wildlife gathers in the sanctuary
 *   4. Barren clearing sprouts flourishing saplings & flowers
 *   5. Botanical scanner projects holographic identification beam
 *   6. Giant Ancient Heart Tree blazes with golden runes and continental restoration pulse
 */
export class EcoWoodsWorld {
  constructor(scene) {
    this.scene = scene;
    this.trees = [];
    this.fireflies = [];
    this.godRays = [];
    this.waterMeshes = [];
    this.mushrooms = [];
    this.saplings = [];
    this.waterwheel = null;
    this.gateLeftDoor = null;
    this.gateRightDoor = null;
    this.isGateOpen = false;
    this.gateOpenAngle = 0;
    this.isStreamClean = false;
    this.isNurserySprouted = false;
    this.isScannerActive = false;
    this.isHeartTreeAwakened = false;
    this.restorationPercent = 0;

    this.initLightingAndAtmosphere();
    this.initTerrainAndTrails();
    this.initRiverAndBridge();
    this.initForestTrees();
    this.initFoliageAndMushrooms();
    this.initVolumetricSunbeams();
    this.initParticleSystems();

    // 6 Interactive Mission Landmarks
    this.initMission1Gate();
    this.initMission2RiverStation();
    this.initMission3Sanctuary();
    this.initMission4Nursery();
    this.initMission5BotanicalOutpost();
    this.initMission6HeartTree();
  }

  // 1. Forest Lighting & Atmosphere (Deep emerald fog and warm golden sunlight)
  initLightingAndAtmosphere() {
    // Rich forest depth fog
    this.scene.fog = new THREE.FogExp2(0x133827, 0.018);

    // Warm, lush ambient light
    this.ambientLight = new THREE.AmbientLight(0x27593f, 2.4);
    this.scene.add(this.ambientLight);

    // Primary sunlight filtering from canopy angle
    this.sunLight = new THREE.DirectionalLight(0xfef08a, 3.2); // Warm sunlight gold
    this.sunLight.position.set(25, 45, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 150;
    const d = 45;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    // Forest floor soft upward fill
    this.fillLight = new THREE.DirectionalLight(0x1e4620, 1.2);
    this.fillLight.position.set(-20, -10, -20);
    this.scene.add(this.fillLight);
  }

  // 2. Sculpted Terrain with Mossy Grass and Dirt Trail Paths
  initTerrainAndTrails() {
    const terrainGeo = new THREE.PlaneGeometry(160, 160, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);

      // Organic rolling forest knolls and mounds
      let vy = Math.sin(vx * 0.06) * Math.cos(vz * 0.06) * 1.8;
      vy += Math.sin(vx * 0.02 + vz * 0.03) * 2.5;

      // River bed depression (carves a winding trench through x = -16 to -8)
      const riverPathX = -12 + Math.sin(vz * 0.08) * 5;
      const distToRiver = Math.abs(vx - riverPathX);
      if (distToRiver < 7) {
        vy -= (7 - distToRiver) * 0.65;
      }

      // Smooth central trail path (from z=15 down to z=-25)
      const distToMainTrail = Math.abs(vx - Math.sin(vz * 0.1) * 2);
      if (distToMainTrail < 5 && vz > -24 && vz < 16) {
        vy *= 0.35;
      }

      pos.setY(i, vy - 0.5);
    }
    terrainGeo.computeVertexNormals();

    this.terrainMat = new THREE.MeshStandardMaterial({
      color: 0x22492f, // Deep mossy forest grass
      roughness: 0.9,
      metalness: 0.05
    });

    this.terrain = new THREE.Mesh(terrainGeo, this.terrainMat);
    this.terrain.receiveShadow = true;
    this.scene.add(this.terrain);

    // Decorative Trail Stepping Stones
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x5a6358,
      roughness: 0.85
    });
    for (let z = 12; z > -22; z -= 2.2) {
      const stone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55 + Math.random() * 0.2, 0.65, 0.12, 8),
        stoneMat
      );
      const sx = Math.sin(z * 0.1) * 1.8 + (Math.random() - 0.5) * 0.8;
      stone.position.set(sx, 0.06, z);
      stone.rotation.y = Math.random() * Math.PI;
      this.scene.add(stone);
    }
  }

  // 3. Winding River Stream and Wooden Bridge
  initRiverAndBridge() {
    // Flowing River Plane
    const riverGeo = new THREE.PlaneGeometry(12, 120, 16, 32);
    riverGeo.rotateX(-Math.PI / 2);

    this.riverMat = new THREE.MeshStandardMaterial({
      color: 0x4d4233, // Starts murky brown/sludgy
      roughness: 0.25,
      metalness: 0.3,
      transparent: true,
      opacity: 0.88
    });

    this.riverMesh = new THREE.Mesh(riverGeo, this.riverMat);
    this.riverMesh.position.set(-13, -0.65, 0);
    this.scene.add(this.riverMesh);
    this.waterMeshes.push(this.riverMesh);

    // Wooden Bridge crossing the river (at z = 4)
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(-13, -0.1, 4);

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x614328, // Weathered oak timber
      roughness: 0.85
    });

    // Bridge Planks
    for (let bx = -5.5; bx <= 5.5; bx += 0.65) {
      const plank = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.14, 3.2),
        woodMat
      );
      plank.position.set(bx, 0.1, 0);
      plank.castShadow = true;
      bridgeGroup.add(plank);
    }

    // Bridge Beams underneath
    const beam1 = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.25, 0.3), woodMat);
    beam1.position.set(0, -0.05, 1.3);
    const beam2 = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.25, 0.3), woodMat);
    beam2.position.set(0, -0.05, -1.3);
    bridgeGroup.add(beam1);
    bridgeGroup.add(beam2);

    // Bridge Railings
    [-1.45, 1.45].forEach((rz) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.12, 0.12), woodMat);
      rail.position.set(0, 0.85, rz);
      bridgeGroup.add(rail);

      for (let px = -5.2; px <= 5.2; px += 2.6) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.9, 0.15), woodMat);
        post.position.set(px, 0.45, rz);
        bridgeGroup.add(post);
      }
    });

    this.scene.add(bridgeGroup);
  }

  // 4. Procedural Majestic Forest Trees (Ancient Oaks & Spruces)
  initForestTrees() {
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x4a3319, // Deep bark brown
      roughness: 0.9
    });
    const foliageMat1 = new THREE.MeshStandardMaterial({
      color: 0x1d5e38, // Rich forest emerald
      roughness: 0.75
    });
    const foliageMat2 = new THREE.MeshStandardMaterial({
      color: 0x2b7a4b, // Vibrant moss green
      roughness: 0.8
    });
    const foliageMat3 = new THREE.MeshStandardMaterial({
      color: 0x144026, // Deep shaded pine
      roughness: 0.85
    });

    const treePositions = [
      // Along left flank
      [-22, 12], [-26, 0], [-24, -14], [-20, -28], [-12, -32],
      // Along right flank
      [22, 14], [25, 2], [23, -12], [24, -26], [14, -30],
      // Groves around glades (leaving clear paths to missions)
      [-8, 14], [8, 14], [-8, -6], [8, -6],
      [-22, 22], [0, 20], [22, 22],
      [-5, -18], [7, -18], [-28, -8], [28, -4]
    ];

    treePositions.forEach(([tx, tz], i) => {
      const treeGroup = new THREE.Group();
      const heightScale = 1 + (i % 5) * 0.2;

      // Tree Trunk
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.8, 6.5 * heightScale, 10),
        trunkMat
      );
      trunk.position.y = (6.5 * heightScale) / 2;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Sprawling Roots at base
      for (let r = 0; r < 4; r++) {
        const angle = (r / 4) * Math.PI * 2;
        const root = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.35, 2.2, 6),
          trunkMat
        );
        root.rotation.z = Math.PI / 4;
        root.rotation.y = angle;
        root.position.set(Math.cos(angle) * 0.7, 0.4, Math.sin(angle) * 0.7);
        treeGroup.add(root);
      }

      // Layered Foliage Tiers
      const fMat = i % 3 === 0 ? foliageMat1 : i % 3 === 1 ? foliageMat2 : foliageMat3;
      const tiers = 3;
      for (let t = 0; t < tiers; t++) {
        const tierRadius = (3.4 - t * 0.7) * heightScale;
        const tierHeight = (3.2 - t * 0.4) * heightScale;
        const canopy = new THREE.Mesh(
          new THREE.ConeGeometry(tierRadius, tierHeight, 9),
          fMat
        );
        canopy.position.y = (5.2 + t * 2.2) * heightScale;
        canopy.castShadow = true;
        treeGroup.add(canopy);
      }

      treeGroup.position.set(tx, 0, tz);
      this.scene.add(treeGroup);
      this.trees.push(treeGroup);
    });
  }

  // 5. Ground Foliage, Ferns, Mossy Rocks, and Red Spotted Mushrooms
  initFoliageAndMushrooms() {
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x3d473c,
      roughness: 0.95
    });
    const mushroomStemMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ea,
      roughness: 0.6
    });
    const mushroomCapMat = new THREE.MeshStandardMaterial({
      color: 0xdf2929, // Vibrant red
      roughness: 0.4
    });

    // Rock Boulders
    for (let i = 0; i < 16; i++) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.8 + (i % 4) * 0.4),
        rockMat
      );
      const angle = (i / 16) * Math.PI * 2;
      const dist = 10 + (i % 5) * 4;
      rock.position.set(
        Math.cos(angle) * dist + (Math.random() - 0.5) * 3,
        0.4,
        Math.sin(angle) * dist + (Math.random() - 0.5) * 3
      );
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      this.scene.add(rock);
    }

    // Mushroom Clusters
    const mushroomSpots = [
      [3, 5], [-5, 8], [6, -8], [-4, -12], [10, 3], [-10, 1]
    ];
    mushroomSpots.forEach(([mx, mz]) => {
      for (let m = 0; m < 4; m++) {
        const mGroup = new THREE.Group();
        const scale = 0.35 + Math.random() * 0.35;

        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08 * scale, 0.12 * scale, 0.6 * scale, 8),
          mushroomStemMat
        );
        stem.position.y = (0.3 * scale);
        mGroup.add(stem);

        const cap = new THREE.Mesh(
          new THREE.SphereGeometry(0.3 * scale, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2),
          mushroomCapMat
        );
        cap.position.y = (0.55 * scale);
        mGroup.add(cap);

        mGroup.position.set(
          mx + (Math.random() - 0.5) * 1.5,
          0.05,
          mz + (Math.random() - 0.5) * 1.5
        );
        this.scene.add(mGroup);
        this.mushrooms.push(mGroup);
      }
    });

    // Fallen Mossy Logs
    const logMat = new THREE.MeshStandardMaterial({
      color: 0x4d3823,
      roughness: 0.95
    });
    [[-8, 0.35, -2], [8, 0.35, -14]].forEach(([lx, ly, lz], i) => {
      const log = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.45, 5.5, 8),
        logMat
      );
      log.rotation.z = Math.PI / 2 + 0.1;
      log.rotation.y = i * 0.8;
      log.position.set(lx, ly, lz);
      log.castShadow = true;
      this.scene.add(log);
    });
  }

  // 6. Volumetric Sunlight Shafts (God-Rays filtering through canopies)
  initVolumetricSunbeams() {
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const rayPositions = [
      [4, 14, 2], [-6, 14, -8], [8, 14, -16], [-10, 14, 8], [0, 16, -22]
    ];

    rayPositions.forEach(([rx, ry, rz]) => {
      const rayGeo = new THREE.ConeGeometry(3.5, 18, 12, 1, true);
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.set(rx, ry, rz);
      ray.rotation.x = Math.PI - 0.35;
      ray.rotation.z = 0.25;
      this.scene.add(ray);
      this.godRays.push(ray);
    });
  }

  // 7. Particle Systems: Golden Fireflies & Floating Pollen
  initParticleSystems() {
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = 0.8 + Math.random() * 6.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      // Golden amber and bio-green fireflies
      if (i % 2 === 0) {
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.35;
      } else {
        colors[i * 3] = 0.35;
        colors[i * 3 + 1] = 0.92;
        colors[i * 3 + 2] = 0.55;
      }
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particleSystem);
  }

  // =========================================================================
  // MISSION 1 LANDMARK: The Ancient Forest Gate (coords: [0, 0, 6])
  // =========================================================================
  initMission1Gate() {
    this.gateGroup = new THREE.Group();
    this.gateGroup.position.set(0, 0, 6);

    const stonePillarMat = new THREE.MeshStandardMaterial({
      color: 0x485246,
      roughness: 0.85
    });
    const woodGateMat = new THREE.MeshStandardMaterial({
      color: 0x54361e,
      roughness: 0.8
    });
    const runeMat = new THREE.MeshStandardMaterial({
      color: 0x52b788,
      emissive: 0x2d6a4f,
      emissiveIntensity: 0.7
    });

    // Left & Right Stone Gate Pillars
    [-2.8, 2.8].forEach((px) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.5, 1.2), stonePillarMat);
      pillar.position.set(px, 2.75, 0);
      pillar.castShadow = true;
      this.gateGroup.add(pillar);

      // Glowing stone capstone
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.1, 4), stonePillarMat);
      cap.position.set(px, 6.0, 0);
      cap.rotation.y = Math.PI / 4;
      this.gateGroup.add(cap);
    });

    // Overhead Arch Beam
    const arch = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.7, 0.9), stonePillarMat);
    arch.position.set(0, 5.1, 0);
    this.gateGroup.add(arch);

    // Left Wooden Gate Door (Pivots at x = -2.2)
    this.gateLeftDoorPivot = new THREE.Group();
    this.gateLeftDoorPivot.position.set(-2.2, 0, 0);

    const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(2.1, 4.2, 0.25), woodGateMat);
    leftDoor.position.set(1.05, 2.2, 0);
    leftDoor.castShadow = true;
    this.gateLeftDoorPivot.add(leftDoor);

    // Runic symbol on door
    const rune1 = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.48, 8), runeMat);
    rune1.position.set(1.05, 2.4, 0.15);
    this.gateLeftDoorPivot.add(rune1);

    this.gateGroup.add(this.gateLeftDoorPivot);

    // Right Wooden Gate Door (Pivots at x = 2.2)
    this.gateRightDoorPivot = new THREE.Group();
    this.gateRightDoorPivot.position.set(2.2, 0, 0);

    const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(2.1, 4.2, 0.25), woodGateMat);
    rightDoor.position.set(-1.05, 2.2, 0);
    rightDoor.castShadow = true;
    this.gateRightDoorPivot.add(rightDoor);

    const rune2 = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.48, 8), runeMat);
    rune2.position.set(-1.05, 2.4, 0.15);
    this.gateRightDoorPivot.add(rune2);

    this.gateGroup.add(this.gateRightDoorPivot);

    this.scene.add(this.gateGroup);
    this.initLandmarkBeacon(1, 0, 1.2, 6, "Forest Gate");
  }

  // =========================================================================
  // MISSION 2 LANDMARK: River Filtration Station (coords: [-16, 0, -2])
  // =========================================================================
  initMission2RiverStation() {
    this.riverStationGroup = new THREE.Group();
    this.riverStationGroup.position.set(-16, 0, -2);

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.6,
      roughness: 0.4
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5c3c21,
      roughness: 0.8
    });

    // Waterwheel on river bank
    this.waterwheel = new THREE.Group();
    this.waterwheel.position.set(2.2, 1.2, 0);

    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.8, 8), metalMat);
    axle.rotation.z = Math.PI / 2;
    this.waterwheel.add(axle);

    // 6 Paddles
    for (let p = 0; p < 6; p++) {
      const pAngle = (p / 6) * Math.PI * 2;
      const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.9, 0.45), woodMat);
      paddle.rotation.x = pAngle;
      paddle.position.set(0, 0, 0);
      this.waterwheel.add(paddle);
    }
    this.riverStationGroup.add(this.waterwheel);

    // Filtration House Shed
    const shed = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.2, 3.5), woodMat);
    shed.position.set(-0.8, 1.6, 0);
    shed.castShadow = true;
    this.riverStationGroup.add(shed);

    // Shed Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.6, 4), metalMat);
    roof.position.set(-0.8, 3.9, 0);
    roof.rotation.y = Math.PI / 4;
    this.riverStationGroup.add(roof);

    this.scene.add(this.riverStationGroup);
    this.initLandmarkBeacon(2, -14, 1.2, -2, "Polluted Stream");
  }

  // =========================================================================
  // MISSION 3 LANDMARK: Wildlife Sanctuary Clearing (coords: [14, 0, 10])
  // =========================================================================
  initMission3Sanctuary() {
    this.sanctuaryGroup = new THREE.Group();
    this.sanctuaryGroup.position.set(14, 0, 10);

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x526055,
      roughness: 0.85
    });

    // Ancient Stone Dolmen / Sanctuary Circle
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const standingStone = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 2.6, 0.7),
        stoneMat
      );
      standingStone.position.set(Math.cos(angle) * 3.5, 1.3, Math.sin(angle) * 3.5);
      standingStone.castShadow = true;
      this.sanctuaryGroup.add(standingStone);
    }

    // Overhead lintel stone
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.5, 1.1), stoneMat);
    lintel.position.set(0, 2.8, 3.2);
    this.sanctuaryGroup.add(lintel);

    this.scene.add(this.sanctuaryGroup);
    this.initLandmarkBeacon(3, 14, 1.2, 10, "Wildlife Sanctuary");
  }

  // =========================================================================
  // MISSION 4 LANDMARK: Seedling Nursery (coords: [18, 0, -10])
  // =========================================================================
  initMission4Nursery() {
    this.nurseryGroup = new THREE.Group();
    this.nurseryGroup.position.set(18, 0, -10);

    // Barren clearing soil patch
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x4a3622, // Starts dry brown
      roughness: 0.95
    });
    this.nurserySoil = new THREE.Mesh(new THREE.CircleGeometry(6.5, 24), soilMat);
    this.nurserySoil.rotation.x = -Math.PI / 2;
    this.nurserySoil.position.y = 0.04;
    this.nurseryGroup.add(this.nurserySoil);

    // Sprout Sapling Container
    this.saplingContainer = new THREE.Group();
    this.nurseryGroup.add(this.saplingContainer);

    // Create 16 initial tiny sapling shoots
    const sproutMat = new THREE.MeshStandardMaterial({
      color: 0x74c69d,
      roughness: 0.6
    });
    for (let s = 0; s < 16; s++) {
      const angle = (s / 16) * Math.PI * 2;
      const dist = 1.2 + (s % 3) * 1.5;
      const shoot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.08, 0.5, 6),
        sproutMat
      );
      shoot.position.set(Math.cos(angle) * dist, 0.25, Math.sin(angle) * dist);
      this.saplingContainer.add(shoot);
      this.saplings.push(shoot);
    }

    this.scene.add(this.nurseryGroup);
    this.initLandmarkBeacon(4, 18, 1.2, -10, "Seedling Nursery");
  }

  // =========================================================================
  // MISSION 5 LANDMARK: Botanical Research Outpost (coords: [-14, 0, -18])
  // =========================================================================
  initMission5BotanicalOutpost() {
    this.outpostGroup = new THREE.Group();
    this.outpostGroup.position.set(-14, 0, -18);

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5a3d24,
      roughness: 0.85
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.7,
      roughness: 0.3
    });

    // Botanical Field Worktable
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.18, 1.8), woodMat);
    tableTop.position.set(0, 1.1, 0);
    this.outpostGroup.add(tableTop);

    // 4 Legs
    [[-1.6, -0.7], [1.6, -0.7], [-1.6, 0.7], [1.6, 0.7]].forEach(([tx, tz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 6), woodMat);
      leg.position.set(tx, 0.55, tz);
      this.outpostGroup.add(leg);
    });

    // Specimen Crates
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x826040, roughness: 0.9 });
    const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.9), crateMat);
    crate1.position.set(-0.8, 1.55, 0.2);
    this.outpostGroup.add(crate1);

    // Brass Field Telescope
    const telescope = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 1.4, 8), brassMat);
    telescope.rotation.x = Math.PI / 4;
    telescope.position.set(0.8, 1.8, 0);
    this.outpostGroup.add(telescope);

    // Holographic Scanner Beam (Visible when activated)
    const scanGeo = new THREE.ConeGeometry(1.4, 2.5, 16, 1, true);
    this.scanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide
    });
    this.scanCone = new THREE.Mesh(scanGeo, this.scanMat);
    this.scanCone.position.set(-0.8, 2.6, 0.2);
    this.scanCone.rotation.x = Math.PI;
    this.outpostGroup.add(this.scanCone);

    this.scene.add(this.outpostGroup);
    this.initLandmarkBeacon(5, -14, 1.2, -18, "Forest Inventory");
  }

  // =========================================================================
  // MISSION 6 LANDMARK: The Ancient Heart Tree (coords: [0, 0, -24])
  // =========================================================================
  initMission6HeartTree() {
    this.heartTreeGroup = new THREE.Group();
    this.heartTreeGroup.position.set(0, 0, -24);

    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x3d2714,
      roughness: 0.95
    });
    this.heartCanopyMat = new THREE.MeshStandardMaterial({
      color: 0x1f5c3a,
      roughness: 0.75
    });
    this.heartRuneMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x15803d,
      emissiveIntensity: 0.4
    });

    // Colossal Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 3.2, 14, 14),
      trunkMat
    );
    trunk.position.y = 7;
    trunk.castShadow = true;
    this.heartTreeGroup.add(trunk);

    // Massive Sprawling Roots
    for (let r = 0; r < 6; r++) {
      const angle = (r / 6) * Math.PI * 2;
      const root = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.9, 4.5, 8),
        trunkMat
      );
      root.rotation.z = Math.PI / 3.5;
      root.rotation.y = angle;
      root.position.set(Math.cos(angle) * 2.2, 1.2, Math.sin(angle) * 2.2);
      this.heartTreeGroup.add(root);
    }

    // Sacred Spiraling Carved Runes
    for (let ring = 0; ring < 3; ring++) {
      const runeBand = new THREE.Mesh(
        new THREE.TorusGeometry(2.1 - ring * 0.25, 0.08, 8, 24),
        this.heartRuneMat
      );
      runeBand.rotation.x = Math.PI / 2;
      runeBand.position.y = 3.5 + ring * 2.2;
      this.heartTreeGroup.add(runeBand);
    }

    // Colossal Canopy Domes
    const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(7.5, 2), this.heartCanopyMat);
    canopy1.position.y = 15;
    canopy1.castShadow = true;
    this.heartTreeGroup.add(canopy1);

    const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(5.5, 2), this.heartCanopyMat);
    canopy2.position.set(3, 17, -1);
    canopy2.castShadow = true;
    this.heartTreeGroup.add(canopy2);

    const canopy3 = new THREE.Mesh(new THREE.DodecahedronGeometry(5.2, 2), this.heartCanopyMat);
    canopy3.position.set(-3, 16.5, 1);
    canopy3.castShadow = true;
    this.heartTreeGroup.add(canopy3);

    this.scene.add(this.heartTreeGroup);
    this.initLandmarkBeacon(6, 0, 1.5, -24, "Eco Guardian");
  }

  // Landmark Beacon with pulsing ring and floating mission sphere
  initLandmarkBeacon(num, x, y, z, label) {
    if (!this.beacons) this.beacons = [];

    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Glowing base ring
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x52b788,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.1, 24), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    group.add(ring);

    // Floating Mission Core Orb
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.8
    });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), orbMat);
    orb.position.y = 1.6;
    group.add(orb);

    this.scene.add(group);
    this.beacons.push({
      num,
      group,
      orb,
      baseY: 1.6,
      coords: new THREE.Vector3(x, y, z),
      label
    });
  }

  // =========================================================================
  // DYNAMIC WORLD RESPONSES & RESTORATION TRANSFORMATIONS
  // =========================================================================

  openGate() {
    this.isGateOpen = true;
  }

  cleanStream() {
    this.isStreamClean = true;
    if (this.riverMat) {
      this.riverMat.color.setHex(0x38bdf8); // Translucent azure sparkling water
      this.riverMat.opacity = 0.75;
    }
  }

  sproutNursery() {
    this.isNurserySprouted = true;
    if (this.nurserySoil) {
      this.nurserySoil.material.color.setHex(0x2d6a4f); // Rich verdant green
    }
    // Scale up saplings into lush young trees
    this.saplings.forEach((s) => {
      s.scale.set(1.8, 3.2, 1.8);
      s.material.color.setHex(0x52b788);
    });
  }

  activateScanner() {
    this.isScannerActive = true;
    if (this.scanMat) {
      this.scanMat.opacity = 0.45;
    }
  }

  awakenHeartTree() {
    this.isHeartTreeAwakened = true;
    if (this.heartRuneMat) {
      this.heartRuneMat.color.setHex(0xfbbf24);
      this.heartRuneMat.emissive.setHex(0xf59e0b);
      this.heartRuneMat.emissiveIntensity = 1.4;
    }
    if (this.heartCanopyMat) {
      this.heartCanopyMat.color.setHex(0x4ade80);
    }
    // Golden warm continental pulse
    this.sunLight.color.setHex(0xfde047);
    this.sunLight.intensity = 4.2;
    this.ambientLight.color.setHex(0x40916c);
    this.ambientLight.intensity = 3.2;
  }

  setRestoration(percent) {
    this.restorationPercent = percent;
    if (percent >= 16) this.openGate();
    if (percent >= 33) this.cleanStream();
    if (percent >= 66) this.sproutNursery();
    if (percent >= 83) this.activateScanner();
    if (percent >= 100) this.awakenHeartTree();
  }

  // Main Animation Loop
  update(delta) {
    const time = performance.now() * 0.001;

    // 1. Animate Gate Doors opening smoothly
    if (this.isGateOpen && this.gateOpenAngle < Math.PI * 0.45) {
      this.gateOpenAngle += delta * 1.2;
      if (this.gateLeftDoorPivot) this.gateLeftDoorPivot.rotation.y = this.gateOpenAngle;
      if (this.gateRightDoorPivot) this.gateRightDoorPivot.rotation.y = -this.gateOpenAngle;
    }

    // 2. Animate Waterwheel Rotation
    if (this.waterwheel) {
      this.waterwheel.rotation.x += delta * (this.isStreamClean ? 2.2 : 0.6);
    }

    // 3. Floating Beacons
    if (this.beacons) {
      this.beacons.forEach((b) => {
        b.orb.position.y = b.baseY + Math.sin(time * 3 + b.num) * 0.15;
        b.orb.rotation.y += delta * 1.5;
      });
    }

    // 4. Fireflies drifting
    if (this.particleSystem) {
      const positions = this.particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.008;
      }
      this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Botanical Scanner Beam flicker
    if (this.isScannerActive && this.scanCone) {
      this.scanCone.rotation.y += delta * 2.0;
      this.scanMat.opacity = 0.35 + Math.sin(time * 8) * 0.1;
    }

    // 6. Heart Tree Rune Glow pulse
    if (this.isHeartTreeAwakened && this.heartRuneMat) {
      this.heartRuneMat.emissiveIntensity = 1.0 + Math.sin(time * 4) * 0.4;
    }
  }
}
