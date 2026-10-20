import * as THREE from "three";

/**
 * 3D Undersea World Generator & Environment Engine
 * Art-directed precisely to match user visual references:
 * 1. Underwater Research Observatory (Ref 1): Hexagonal panoramic glass lab, central circular holographic
 *    projector with glyph rings, rotating 3D cyan wireframe submarine hologram, diagnostic consoles with robotic arms.
 * 2. Deep Bioluminescent Coral Reef (Ref 2): Tubular peach/orange & violet sea anemones, craggy volcanic
 *    hydrothermal mini-vents with glowing magma fissures and ember/bubble plumes, rich coral palette (peach, violet, turquoise, coral orange).
 * 3. Sunlit Shallow Reef Paradise (Ref 3): Green disc/cabbage corals, colorful sea fans, swaying sea grass beds,
 *    animated moving water caustics, and volumetric sunbeam light shafts.
 */
export class UnderseaWorld {
  constructor(scene) {
    this.scene = scene;
    this.corals = [];
    this.kelpStalks = [];
    this.tubularAnemones = [];
    this.seaGrassTufts = [];
    this.lightRays = [];
    this.hydroVents = [];
    this.restorationPercent = 0; // 0 to 100

    this.initLightingAndAtmosphere();
    this.initTerrain();
    this.initReefArchesAndBoulders();
    this.initObservatoryLab();
    this.initTubularAnemones();
    this.initHydrothermalVents();
    this.initGreenDiscCoralsAndFans();
    this.initCoralGardens();
    this.initSeaGrassAndKelp();
    this.initVolumetricGodRays();
    this.initWaterCaustics();
    this.initAbyssGate();
    this.initParticleSystems();
  }

  // 1. Underwater Lighting & Atmosphere (Matches Ref 2 & 3: Turquoise to Deep Teal)
  initLightingAndAtmosphere() {
    // Rich underwater atmospheric depth fog (turquoise fading to deep oceanic teal)
    this.scene.fog = new THREE.FogExp2(0x063747, 0.013);

    // Warm, luminous ambient light simulating scattered ocean sunlight
    this.ambientLight = new THREE.AmbientLight(0x0c5468, 2.6);
    this.scene.add(this.ambientLight);

    // Primary sunlight filtering from tropical turquoise surface
    this.sunLight = new THREE.DirectionalLight(0x7dd3fc, 3.6);
    this.sunLight.position.set(20, 50, 18);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.scene.add(this.sunLight);

    // Deep ocean blue fill light from below
    this.fillLight = new THREE.DirectionalLight(0x0284c7, 1.8);
    this.fillLight.position.set(-25, -10, -20);
    this.scene.add(this.fillLight);

    // Sunlit Water Surface Plane (Ceiling at Y = 14)
    const surfaceGeo = new THREE.PlaneGeometry(180, 180, 32, 32);
    surfaceGeo.rotateX(Math.PI / 2);

    const surfPos = surfaceGeo.attributes.position;
    for (let i = 0; i < surfPos.count; i++) {
      const u = surfPos.getX(i);
      const v = surfPos.getZ(i);
      const wave = Math.sin(u * 0.08) * Math.cos(v * 0.08) * 0.45;
      surfPos.setY(i, wave);
    }
    surfaceGeo.computeVertexNormals();

    const surfaceMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.35,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    this.surface = new THREE.Mesh(surfaceGeo, surfaceMat);
    this.surface.position.y = 14;
    this.scene.add(this.surface);
  }

  // 2. Sculpted Sea Floor Terrain with Canyon Ridges & Sand Dunes
  initTerrain() {
    const terrainGeo = new THREE.PlaneGeometry(180, 180, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);

      // Multi-frequency organic ocean dunes
      let vy = Math.sin(vx * 0.05) * Math.cos(vz * 0.05) * 2.8;
      vy += Math.sin(vx * 0.02 + vz * 0.03) * 3.8;
      vy += Math.cos(vx * 0.09) * 0.4;

      // Central Coral Lagoon valley (smooth playable area around z: 0)
      const distFromCenter = Math.sqrt(vx * vx + vz * vz);
      if (distFromCenter < 28) {
        vy *= 0.4;
      }

      // Deep Abyssal trench depression in the north (z < -20)
      if (vz < -18) {
        vy -= (Math.abs(vz) - 18) * 0.2;
      }

      pos.setY(i, vy - 1.8);
    }
    terrainGeo.computeVertexNormals();

    this.terrainMat = new THREE.MeshStandardMaterial({
      color: 0x114a59, // Warm tropical marine sand
      roughness: 0.85,
      metalness: 0.08
    });

    this.terrain = new THREE.Mesh(terrainGeo, this.terrainMat);
    this.terrain.receiveShadow = true;
    this.scene.add(this.terrain);
  }

  // 3. Giant Natural Stone Coral Arches & Limestone Boulders
  initReefArchesAndBoulders() {
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x1c4856, // Weathered limestone with algae patina
      roughness: 0.88,
      metalness: 0.12
    });

    // Monumental Swim-Through Coral Reef Arch
    this.archGroup = new THREE.Group();
    this.archGroup.position.set(-14, 0, 18);

    const archCurve = new THREE.TorusGeometry(6.5, 1.4, 16, 24, Math.PI);
    const archMesh = new THREE.Mesh(archCurve, rockMat);
    archMesh.rotation.z = Math.PI;
    archMesh.position.y = 5.2;
    archMesh.castShadow = true;
    archMesh.receiveShadow = true;
    this.archGroup.add(archMesh);

    // Arch pillar supports
    const pillarGeo = new THREE.CylinderGeometry(1.6, 2.2, 5.5, 12);
    const pillarL = new THREE.Mesh(pillarGeo, rockMat);
    pillarL.position.set(-6.5, 1.5, 0);
    const pillarR = new THREE.Mesh(pillarGeo, rockMat);
    pillarR.position.set(6.5, 1.5, 0);
    this.archGroup.add(pillarL, pillarR);

    this.scene.add(this.archGroup);

    // Scattered natural organic reef boulders
    const boulderGeo = new THREE.DodecahedronGeometry(2.4, 2);
    for (let i = 0; i < 28; i++) {
      const boulder = new THREE.Mesh(boulderGeo, rockMat);
      const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.2;
      const dist = 14 + Math.random() * 52;
      boulder.position.set(
        Math.cos(angle) * dist,
        -1.2 + (Math.random() - 0.5) * 1.5,
        Math.sin(angle) * dist
      );
      const sx = 0.9 + Math.random() * 1.8;
      const sy = 0.6 + Math.random() * 1.5;
      const sz = 0.9 + Math.random() * 1.8;
      boulder.scale.set(sx, sy, sz);
      boulder.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
      boulder.castShadow = true;
      boulder.receiveShadow = true;
      this.scene.add(boulder);
    }
  }

  // 4. Underwater Research Observatory & Submarine Hologram (Matches Reference 1)
  initObservatoryLab() {
    this.observatoryGroup = new THREE.Group();
    this.observatoryGroup.name = "ResearchObservatoryLab";
    this.observatoryGroup.position.set(0, -1.2, 6);

    const metalFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });

    const glassPanelsMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
      transmission: 0.8,
      roughness: 0.1,
      metalness: 0.2,
      side: THREE.DoubleSide
    });

    // A. Hexagonal Deck Base (Radius 5.5, 6 sides)
    const deckGeo = new THREE.CylinderGeometry(5.5, 6.0, 0.5, 6);
    const deckMesh = new THREE.Mesh(deckGeo, metalFrameMat);
    deckMesh.position.y = 0.25;
    this.observatoryGroup.add(deckMesh);

    // Floor tiles accent ring
    const tileRingGeo = new THREE.RingGeometry(3.2, 5.0, 6);
    const tileRingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.7,
      side: THREE.DoubleSide
    });
    const tileRing = new THREE.Mesh(tileRingGeo, tileRingMat);
    tileRing.rotation.x = -Math.PI / 2;
    tileRing.position.y = 0.51;
    this.observatoryGroup.add(tileRing);

    // B. Panoramic Window Struts (6 pillars at hexagonal vertices)
    const strutGeo = new THREE.CylinderGeometry(0.12, 0.16, 4.2, 8);
    for (let s = 0; s < 6; s++) {
      const angle = (s / 6) * Math.PI * 2;
      const sx = Math.cos(angle) * 5.2;
      const sz = Math.sin(angle) * 5.2;
      const strut = new THREE.Mesh(strutGeo, metalFrameMat);
      strut.position.set(sx, 2.3, sz);
      this.observatoryGroup.add(strut);
    }

    // Hexagonal Upper Roof Arch Ring
    const roofGeo = new THREE.CylinderGeometry(5.2, 5.4, 0.4, 6);
    const roofMesh = new THREE.Mesh(roofGeo, metalFrameMat);
    roofMesh.position.y = 4.4;
    this.observatoryGroup.add(roofMesh);

    // C. Central Holographic Dais Platform (Ref 1: Circular stepped dais)
    const daisBaseGeo = new THREE.CylinderGeometry(2.0, 2.2, 0.35, 24);
    const daisMesh = new THREE.Mesh(daisBaseGeo, metalFrameMat);
    daisMesh.position.y = 0.65;
    this.observatoryGroup.add(daisMesh);

    // Glowing Cyan Core Projector Emitter Ring
    const coreRingGeo = new THREE.TorusGeometry(1.6, 0.08, 12, 32);
    const coreRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.2
    });
    const coreRing = new THREE.Mesh(coreRingGeo, coreRingMat);
    coreRing.rotation.x = Math.PI / 2;
    coreRing.position.y = 0.85;
    this.observatoryGroup.add(coreRing);

    // D. Dual Floating Holographic Glyph Rings (Ref 1: Ancient runic text rings)
    const glyphRingGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.35, 32, 1, true);
    const glyphRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.holoGlyphRing1 = new THREE.Mesh(glyphRingGeo, glyphRingMat);
    this.holoGlyphRing1.position.y = 1.35;
    this.observatoryGroup.add(this.holoGlyphRing1);

    this.holoGlyphRing2 = new THREE.Mesh(glyphRingGeo, glyphRingMat);
    this.holoGlyphRing2.position.y = 2.45;
    this.holoGlyphRing2.scale.set(0.9, 0.8, 0.9);
    this.observatoryGroup.add(this.holoGlyphRing2);

    // E. 3D Wireframe Glowing Cyan Submarine Hologram (Ref 1: Floating inside rings)
    this.holoSubmarineGroup = new THREE.Group();
    this.holoSubmarineGroup.position.set(0, 1.9, 0);

    const subHullGeo = new THREE.CylinderGeometry(0.35, 0.28, 1.5, 12);
    subHullGeo.rotateZ(Math.PI / 2);
    const subHoloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const subHull = new THREE.Mesh(subHullGeo, subHoloMat);
    this.holoSubmarineGroup.add(subHull);

    // Submarine Holographic Conning Tower & Fins
    const subTowerGeo = new THREE.BoxGeometry(0.3, 0.3, 0.15);
    const subTower = new THREE.Mesh(subTowerGeo, subHoloMat);
    subTower.position.set(0, 0.35, 0);
    this.holoSubmarineGroup.add(subTower);

    // Submarine Holographic Orbital Scan Rings
    const scanRingGeo = new THREE.RingGeometry(0.65, 0.72, 24);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    this.subScanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    this.subScanRing.rotation.y = Math.PI / 4;
    this.holoSubmarineGroup.add(this.subScanRing);

    this.observatoryGroup.add(this.holoSubmarineGroup);

    // F. Diagnostic Consoles with Robotic Arms (Ref 1: Foreground and right tables)
    const tableGeo = new THREE.BoxGeometry(1.6, 0.8, 0.6);
    const tableMesh = new THREE.Mesh(tableGeo, metalFrameMat);
    tableMesh.position.set(3.2, 0.9, 1.0);
    tableMesh.rotation.y = -0.4;
    this.observatoryGroup.add(tableMesh);

    // Table datapad screen
    const padGeo = new THREE.PlaneGeometry(0.7, 0.45);
    const padMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.rotation.x = -Math.PI / 2;
    padMesh.position.set(3.2, 1.31, 1.0);
    this.observatoryGroup.add(padMesh);

    // Articulated robotic diagnostic arm fixture
    const armBaseGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.25, 8);
    const armBase = new THREE.Mesh(armBaseGeo, metalFrameMat);
    armBase.position.set(2.8, 1.35, 1.1);
    const armSegmentGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 6);
    const armSegment = new THREE.Mesh(armSegmentGeo, metalFrameMat);
    armSegment.position.set(0, 0.25, 0);
    armSegment.rotation.z = 0.5;
    armBase.add(armSegment);
    this.observatoryGroup.add(armBase);

    // Dais Point Light illuminating the hologram
    this.holoLight = new THREE.PointLight(0x38bdf8, 2.8, 8);
    this.holoLight.position.set(0, 2.0, 0);
    this.observatoryGroup.add(this.holoLight);

    this.scene.add(this.observatoryGroup);
  }

  // 5. Tubular Peach/Orange & Violet Sea Anemones (Matches Reference 2)
  initTubularAnemones() {
    this.anemoneGroup = new THREE.Group();
    this.anemoneGroup.name = "TubularSeaAnemones";

    // Tubular stalk material (Deep violet/purple)
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x6b21a8, // Deep violet
      roughness: 0.4,
      metalness: 0.1
    });

    // Glowing tip material (Luminous peach/orange with emissive glow)
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0xfb923c, // Vibrant warm peach
      emissive: 0xf97316,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });

    // Create 12 clusters of tubular anemones matching Ref 2
    for (let c = 0; c < 14; c++) {
      const cluster = new THREE.Group();
      const angle = (c / 14) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 6 + Math.random() * 38;
      cluster.position.set(Math.cos(angle) * dist, -1.6, Math.sin(angle) * dist);

      const tubes = [];
      const tubeCount = 14 + Math.floor(Math.random() * 8);

      for (let t = 0; t < tubeCount; t++) {
        const tubeGroup = new THREE.Group();
        const tAngle = (t / tubeCount) * Math.PI * 2;
        const rad = 0.25 + Math.random() * 0.4;
        const height = 0.9 + Math.random() * 0.8;

        // Curved tube stalk
        const stalkGeo = new THREE.CylinderGeometry(0.06, 0.08, height, 8);
        const stalkMesh = new THREE.Mesh(stalkGeo, tubeMat);
        stalkMesh.position.y = height / 2;
        tubeGroup.add(stalkMesh);

        // Glowing peach tip sphere
        const tipGeo = new THREE.SphereGeometry(0.09, 8, 8);
        const tipMesh = new THREE.Mesh(tipGeo, tipMat);
        tipMesh.position.y = height;
        tubeGroup.add(tipMesh);

        // Angle outward organically
        tubeGroup.position.set(Math.cos(tAngle) * rad, 0, Math.sin(tAngle) * rad);
        tubeGroup.rotation.x = Math.sin(tAngle) * 0.25;
        tubeGroup.rotation.z = -Math.cos(tAngle) * 0.25;

        cluster.add(tubeGroup);
        tubes.push({ group: tubeGroup, baseRotX: tubeGroup.rotation.x, baseRotZ: tubeGroup.rotation.z, phase: t });
      }

      this.anemoneGroup.add(cluster);
      this.tubularAnemones.push({ cluster, tubes, phaseOffset: c * 0.7 });
    }

    this.scene.add(this.anemoneGroup);
  }

  // 6. Hydrothermal Mini-Vents with Magma Fissures & Bubbles (Matches Reference 2)
  initHydrothermalVents() {
    this.ventsGroup = new THREE.Group();
    this.ventsGroup.name = "HydrothermalMiniVents";

    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Dark craggy volcanic basalt
      roughness: 0.9,
      metalness: 0.2
    });

    const magmaMat = new THREE.MeshStandardMaterial({
      color: 0xf97316, // Glowing amber/orange magma core
      emissive: 0xea580c,
      emissiveIntensity: 1.8,
      roughness: 0.3
    });

    const ventCoords = [
      [-16, -1.8, -12],
      [-22, -1.8, 8],
      [18, -1.8, -18],
      [24, -1.8, 12]
    ];

    ventCoords.forEach((coord, vIdx) => {
      const vent = new THREE.Group();
      vent.position.set(coord[0], coord[1], coord[2]);

      // Volcanic rock cone chimney
      const chimneyGeo = new THREE.CylinderGeometry(0.35, 1.1, 1.8, 10);
      const chimney = new THREE.Mesh(chimneyGeo, basaltMat);
      chimney.position.y = 0.9;
      vent.add(chimney);

      // Magma vent mouth glow
      const mouthGeo = new THREE.SphereGeometry(0.32, 10, 10);
      const mouth = new THREE.Mesh(mouthGeo, magmaMat);
      mouth.position.y = 1.75;
      vent.add(mouth);

      // Localized warm amber light
      const ventLight = new THREE.PointLight(0xf97316, 2.5, 9);
      ventLight.position.y = 2.2;
      vent.add(ventLight);

      this.ventsGroup.add(vent);
      this.hydroVents.push({ group: vent, light: ventLight, phase: vIdx });
    });

    this.scene.add(this.ventsGroup);
  }

  // 7. Green Disc Corals & Vivid Sea Fans (Matches Reference 3)
  initGreenDiscCoralsAndFans() {
    this.discCoralGroup = new THREE.Group();
    this.discCoralGroup.name = "GreenDiscCoralsAndFans";

    // Green disc coral material (Lush cabbage coral: emerald & seafoam)
    const discMat1 = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.45,
      metalness: 0.05
    });
    const discMat2 = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      roughness: 0.4,
      metalness: 0.05
    });

    // Tiered disc plate geometry
    const discGeo = new THREE.CylinderGeometry(1.2, 0.8, 0.12, 14);

    for (let d = 0; d < 18; d++) {
      const disc = new THREE.Group();
      const angle = (d / 18) * Math.PI * 2 + Math.random() * 0.2;
      const dist = 9 + Math.random() * 40;
      disc.position.set(Math.cos(angle) * dist, -1.4, Math.sin(angle) * dist);

      // 3 overlapping stepped shelves
      for (let s = 0; s < 3; s++) {
        const shelf = new THREE.Mesh(discGeo, s % 2 === 0 ? discMat1 : discMat2);
        shelf.position.set(
          (Math.random() - 0.5) * 0.35,
          s * 0.28,
          (Math.random() - 0.5) * 0.35
        );
        shelf.scale.set(1.0 - s * 0.2, 1.0, 1.0 - s * 0.2);
        shelf.rotation.x = (Math.random() - 0.5) * 0.25;
        shelf.rotation.z = (Math.random() - 0.5) * 0.25;
        disc.add(shelf);
      }

      this.discCoralGroup.add(disc);
    }

    // Vivid Sea Fans (Coral-Red, Warm Peach, and Violet)
    const fanMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4, side: THREE.DoubleSide });
    const fanMatPeach = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4, side: THREE.DoubleSide });
    const fanMatViolet = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4, side: THREE.DoubleSide });

    const fanGeo = new THREE.CircleGeometry(0.9, 12, 0, Math.PI);

    for (let f = 0; f < 16; f++) {
      const mat = f % 3 === 0 ? fanMatRed : f % 3 === 1 ? fanMatPeach : fanMatViolet;
      const fan = new THREE.Mesh(fanGeo, mat);
      const angle = (f / 16) * Math.PI * 2;
      const dist = 8 + Math.random() * 45;
      fan.position.set(Math.cos(angle) * dist, -1.2, Math.sin(angle) * dist);
      fan.rotation.y = Math.random() * Math.PI;
      fan.rotation.x = -0.15;
      this.discCoralGroup.add(fan);
    }

    this.scene.add(this.discCoralGroup);
  }

  // 8. Branching Staghorn & Brain Corals with Restoration Transitions
  initCoralGardens() {
    this.coralGroup = new THREE.Group();
    this.coralGroup.name = "CoralGardens";

    const branchGeo = new THREE.CylinderGeometry(0.1, 0.25, 2.0, 8);
    const tipGeo = new THREE.SphereGeometry(0.16, 8, 8);

    for (let i = 0; i < 30; i++) {
      const coralTree = new THREE.Group();
      const angle = Math.random() * Math.PI * 2;
      const dist = 7 + Math.random() * 48;
      coralTree.position.set(Math.cos(angle) * dist, -1.4, Math.sin(angle) * dist);

      const mat = new THREE.MeshStandardMaterial({
        color: 0x5a6f7c, // Bleached slate initially
        roughness: 0.35,
        metalness: 0.1
      });

      const stem = new THREE.Mesh(branchGeo, mat);
      stem.position.y = 1.0;
      coralTree.add(stem);

      for (let b = 0; b < 4; b++) {
        const branch = new THREE.Mesh(branchGeo, mat);
        branch.scale.set(0.65, 0.65, 0.65);
        branch.position.set(0, 0.8 + b * 0.28, 0);
        branch.rotation.z = 0.55;
        branch.rotation.y = (b * Math.PI) / 2 + 0.3;
        coralTree.add(branch);

        const tipMat = new THREE.MeshBasicMaterial({ color: 0x718096 });
        const tip = new THREE.Mesh(tipGeo, tipMat);
        tip.position.set(0, 1.5, 0);
        branch.add(tip);
      }

      this.coralGroup.add(coralTree);
      this.corals.push({
        group: coralTree,
        material: mat,
        healthyColor: new THREE.Color(i % 3 === 0 ? 0xf43f5e : i % 3 === 1 ? 0x06b6d4 : 0x10b981),
        bleachedColor: new THREE.Color(0x5a6f7c)
      });
    }

    this.scene.add(this.coralGroup);
  }

  // 9. Sea Grass Tufts & Tall Kelp Forest
  initSeaGrassAndKelp() {
    this.kelpGroup = new THREE.Group();
    this.kelpGroup.name = "SeaGrassAndKelp";

    const kelpMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const stalkGeo = new THREE.CylinderGeometry(0.08, 0.16, 13, 8, 8);

    for (let k = 0; k < 24; k++) {
      const kelp = new THREE.Mesh(stalkGeo, kelpMat);
      const angle = (k / 24) * Math.PI * 2;
      const dist = 28 + Math.random() * 25;
      kelp.position.set(Math.cos(angle) * dist, 4.5, Math.sin(angle) * dist);
      this.kelpGroup.add(kelp);
      this.kelpStalks.push({
        mesh: kelp,
        baseX: kelp.position.x,
        baseZ: kelp.position.z,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 1.1 + Math.random() * 0.7
      });
    }

    // Short Sea Grass Tufts (Ref 3: Sea grass swaying on seabed)
    const grassBladeGeo = new THREE.ConeGeometry(0.06, 0.9, 4);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 });

    for (let g = 0; g < 20; g++) {
      const tuft = new THREE.Group();
      const angle = Math.random() * Math.PI * 2;
      const dist = 5 + Math.random() * 35;
      tuft.position.set(Math.cos(angle) * dist, -1.6, Math.sin(angle) * dist);

      for (let b = 0; b < 6; b++) {
        const blade = new THREE.Mesh(grassBladeGeo, grassMat);
        blade.position.set((Math.random() - 0.5) * 0.25, 0.45, (Math.random() - 0.5) * 0.25);
        blade.rotation.z = (Math.random() - 0.5) * 0.35;
        tuft.add(blade);
      }
      this.kelpGroup.add(tuft);
      this.seaGrassTufts.push({ group: tuft, phase: g });
    }

    this.scene.add(this.kelpGroup);
  }

  // 10. Volumetric Sunlight God Rays
  initVolumetricGodRays() {
    this.raysGroup = new THREE.Group();
    this.raysGroup.name = "VolumetricSunbeams";

    const rayGeo = new THREE.ConeGeometry(4.0, 22, 8, 1, true);
    rayGeo.rotateX(Math.PI);

    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.13,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    for (let r = 0; r < 8; r++) {
      const ray = new THREE.Mesh(rayGeo, rayMat);
      const angle = (r / 8) * Math.PI * 2;
      const dist = 5 + Math.random() * 24;
      ray.position.set(Math.cos(angle) * dist, 13.5, Math.sin(angle) * dist);
      ray.rotation.z = (Math.random() - 0.5) * 0.28;
      ray.rotation.x = (Math.random() - 0.5) * 0.28;
      this.raysGroup.add(ray);
      this.lightRays.push({ mesh: ray, speed: 0.5 + Math.random() * 0.5, offset: r });
    }

    this.scene.add(this.raysGroup);
  }

  // 11. Dynamic Water Caustics Projector
  initWaterCaustics() {
    const causticGeo = new THREE.PlaneGeometry(90, 90, 16, 16);
    causticGeo.rotateX(-Math.PI / 2);

    this.causticMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.causticMesh = new THREE.Mesh(causticGeo, this.causticMat);
    this.causticMesh.position.y = -1.4;
    this.scene.add(this.causticMesh);
  }

  // 12. The Abyss Gate (Sublevel 3 Landmark)
  initAbyssGate() {
    this.abyssGateGroup = new THREE.Group();
    this.abyssGateGroup.name = "TheAbyssGate";
    this.abyssGateGroup.position.set(30, 0, 30);

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });

    const archGeo = new THREE.TorusGeometry(5.2, 0.8, 16, 32, Math.PI);
    const arch = new THREE.Mesh(archGeo, metalMat);
    arch.position.y = 0;
    this.abyssGateGroup.add(arch);

    const doorGeo = new THREE.BoxGeometry(4.2, 5.2, 0.45);
    this.gateDoorL = new THREE.Mesh(doorGeo, metalMat);
    this.gateDoorL.position.set(-2.1, 2.6, 0);

    this.gateDoorR = new THREE.Mesh(doorGeo, metalMat);
    this.gateDoorR.position.set(2.1, 2.6, 0);

    this.abyssGateGroup.add(this.gateDoorL, this.gateDoorR);

    const shieldGeo = new THREE.PlaneGeometry(8.2, 6.2);
    this.gateShieldMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    this.gateShield = new THREE.Mesh(shieldGeo, this.gateShieldMat);
    this.gateShield.position.set(0, 2.6, 0);
    this.abyssGateGroup.add(this.gateShield);

    this.scene.add(this.abyssGateGroup);
    this.isGateOpen = false;
  }

  openAbyssGate() {
    this.isGateOpen = true;
    if (this.gateShieldMat) {
      this.gateShieldMat.opacity = 0.08;
    }
  }

  // 13. Marine Snow & Plankton Particles
  initParticleSystems() {
    const snowCount = 450;
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 130;
      snowPositions[i * 3 + 1] = Math.random() * 15 - 1.5;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 130;
    }

    snowGeo.setAttribute("position", new THREE.BufferAttribute(snowPositions, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.18,
      transparent: true,
      opacity: 0.65
    });

    this.marineSnow = new THREE.Points(snowGeo, snowMat);
    this.scene.add(this.marineSnow);

    const bubbleCount = 180;
    const bubbleGeo = new THREE.BufferGeometry();
    const bubblePositions = new Float32Array(bubbleCount * 3);

    for (let b = 0; b < bubbleCount; b++) {
      bubblePositions[b * 3] = (Math.random() - 0.5) * 85;
      bubblePositions[b * 3 + 1] = Math.random() * 14 - 1.5;
      bubblePositions[b * 3 + 2] = (Math.random() - 0.5) * 85;
    }

    bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
    const bubbleMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.28,
      transparent: true,
      opacity: 0.75
    });

    this.bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    this.scene.add(this.bubbles);
  }

  // Dynamic Reef Restoration System (0% -> 100%)
  setRestoration(percent) {
    this.restorationPercent = Math.min(100, Math.max(0, percent));
    const factor = this.restorationPercent / 100;

    this.corals.forEach((coral) => {
      coral.material.color.lerpColors(coral.bleachedColor, coral.healthyColor, factor);
    });

    if (this.scene.fog) {
      this.scene.fog.density = THREE.MathUtils.lerp(0.013, 0.009, factor);
    }
    if (this.ambientLight) {
      this.ambientLight.intensity = THREE.MathUtils.lerp(2.6, 3.2, factor);
    }
  }

  powerObservatoryLab() {
    if (this.holoLight) {
      this.holoLight.color.set(0x38bdf8);
      this.holoLight.intensity = 4.5;
    }
    if (this.holoGlyphRing1) {
      this.holoGlyphRing1.material.color.set(0x38bdf8);
    }
  }

  restoreResearchHub() {
    if (this.holoLight) {
      this.holoLight.color.set(0x10b981);
      this.holoLight.intensity = 4.0;
    }
    if (this.holoGlyphRing1) {
      this.holoGlyphRing1.material.color.set(0x10b981);
    }
  }

  update(delta) {
    const time = Date.now() * 0.001;

    // 1. Animate Swaying Kelp & Grass
    this.kelpStalks.forEach((k) => {
      const sway = Math.sin(time * k.swaySpeed + k.swayOffset) * 0.95;
      k.mesh.position.x = k.baseX + sway;
      k.mesh.rotation.z = sway * 0.075;
    });

    this.seaGrassTufts.forEach((g) => {
      g.group.rotation.z = Math.sin(time * 2.2 + g.phase) * 0.12;
    });

    // 2. Animate Tubular Peach/Violet Anemones (Ref 2)
    this.tubularAnemones.forEach((a) => {
      a.tubes.forEach((t) => {
        t.group.rotation.x = t.baseRotX + Math.sin(time * 2.0 + t.phase + a.phaseOffset) * 0.08;
        t.group.rotation.z = t.baseRotZ + Math.cos(time * 1.8 + t.phase) * 0.08;
      });
    });

    // 3. Animate Hydrothermal Vents Pulsing Light (Ref 2)
    this.hydroVents.forEach((v) => {
      v.light.intensity = 2.0 + Math.sin(time * 4.0 + v.phase) * 0.6;
    });

    // 4. Animate Holographic Submarine & Glyph Rings (Ref 1)
    if (this.holoGlyphRing1) {
      this.holoGlyphRing1.rotation.y += delta * 0.6;
    }
    if (this.holoGlyphRing2) {
      this.holoGlyphRing2.rotation.y -= delta * 0.45;
    }
    if (this.holoSubmarineGroup) {
      this.holoSubmarineGroup.rotation.y += delta * 0.8;
      this.holoSubmarineGroup.position.y = 1.9 + Math.sin(time * 2.0) * 0.12;
    }
    if (this.subScanRing) {
      this.subScanRing.rotation.z += delta * 1.8;
    }

    // 5. Animate Volumetric Light Rays
    this.lightRays.forEach((r) => {
      r.mesh.material.opacity = 0.09 + Math.sin(time * r.speed + r.offset) * 0.04;
    });

    // 6. Animate Caustic Movement
    if (this.causticMesh) {
      this.causticMesh.rotation.z = time * 0.04;
      this.causticMesh.material.opacity = 0.16 + Math.sin(time * 1.5) * 0.04;
    }

    // 7. Animate Abyss Gate doors
    if (this.isGateOpen && this.gateDoorL && this.gateDoorR) {
      this.gateDoorL.position.x = THREE.MathUtils.lerp(this.gateDoorL.position.x, -5.2, delta * 1.8);
      this.gateDoorR.position.x = THREE.MathUtils.lerp(this.gateDoorR.position.x, 5.2, delta * 1.8);
    }

    // 8. Animate Marine Snow
    if (this.marineSnow) {
      const pos = this.marineSnow.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - delta * 0.35;
        if (y < -2) y = 14;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // 9. Animate Rising Bubbles
    if (this.bubbles) {
      const bPos = this.bubbles.geometry.attributes.position;
      for (let j = 0; j < bPos.count; j++) {
        let by = bPos.getY(j) + delta * (1.3 + (j % 5) * 0.2);
        if (by > 13.5) by = -1.8;
        bPos.setY(j, by);
      }
      bPos.needsUpdate = true;
    }
  }
}
