import * as THREE from "three";

/**
 * 3D Exploration Submarine
 * Interactive submarine that boots up and powers its propulsion in Sublevel 1.
 * Features counter-rotating propellers, illuminated cockpit, headlights, and path navigation.
 */
export class SubmarineProp {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = "Submarine";

    this.speed = 0;
    this.targetSpeed = 0;
    this.isOnline = false;
    this.propellerAngle = 0;
    this.dockedPos = new THREE.Vector3(0, -1.5, 6);
    this.group.position.copy(this.dockedPos);

    this.buildMesh();
  }

  buildMesh() {
    // Materials
    this.hullMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant maritime blue
      roughness: 0.3,
      metalness: 0.4
    });

    this.yellowMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // High-visibility submarine yellow accents
      roughness: 0.35,
      metalness: 0.2
    });

    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.8
    });

    this.darkMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3
    });

    // Main Submarine Hull (Elongated capsule/teardrop)
    const hullGeo = new THREE.CylinderGeometry(0.85, 0.75, 3.2, 20);
    hullGeo.rotateX(Math.PI / 2);
    const hullMesh = new THREE.Mesh(hullGeo, this.hullMat);
    hullMesh.castShadow = true;
    this.group.add(hullMesh);

    // Front Nose Cone
    const noseGeo = new THREE.SphereGeometry(0.85, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    noseGeo.rotateX(-Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeo, this.hullMat);
    noseMesh.position.set(0, 0, 1.6);
    this.group.add(noseMesh);

    // Observation Cockpit Bubble
    const bubbleGeo = new THREE.SphereGeometry(0.55, 18, 18);
    const bubbleMesh = new THREE.Mesh(bubbleGeo, this.glassMat);
    bubbleMesh.position.set(0, 0.35, 1.1);
    this.group.add(bubbleMesh);

    // Cockpit interior pilot console glow
    const consoleGeo = new THREE.BoxGeometry(0.3, 0.15, 0.2);
    const consoleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const consoleMesh = new THREE.Mesh(consoleGeo, consoleMat);
    consoleMesh.position.set(0, 0.25, 1.1);
    this.group.add(consoleMesh);

    // Top Conning Tower / Sail
    const towerGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.6, 16);
    const towerMesh = new THREE.Mesh(towerGeo, this.yellowMat);
    towerMesh.position.set(0, 0.9, -0.2);
    this.group.add(towerMesh);

    // Periscope / Sensor Mast
    const mastGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
    const mastMesh = new THREE.Mesh(mastGeo, this.darkMat);
    mastMesh.position.set(0, 1.3, -0.2);
    this.group.add(mastMesh);

    // Twin Side Ballast Pods
    const podGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.4, 14);
    podGeo.rotateX(Math.PI / 2);

    const podL = new THREE.Mesh(podGeo, this.yellowMat);
    podL.position.set(-0.95, -0.2, 0);
    const podR = new THREE.Mesh(podGeo, this.yellowMat);
    podR.position.set(0.95, -0.2, 0);
    this.group.add(podL, podR);

    // Rear Propulsion Housing
    const sternGeo = new THREE.ConeGeometry(0.75, 1.2, 16);
    sternGeo.rotateX(Math.PI / 2);
    const sternMesh = new THREE.Mesh(sternGeo, this.hullMat);
    sternMesh.position.set(0, 0, -2.1);
    this.group.add(sternMesh);

    // Dual Propellers
    this.propellerL = this.createPropeller();
    this.propellerL.position.set(-0.95, -0.2, -1.3);
    this.propellerR = this.createPropeller();
    this.propellerR.position.set(0.95, -0.2, -1.3);
    this.group.add(this.propellerL, this.propellerR);

    // Dual High-Intensity Headlights
    this.spotL = new THREE.SpotLight(0xa5f3fc, 0, 35, Math.PI / 4, 0.35, 1);
    this.spotL.position.set(-0.5, 0, 2.0);
    this.spotL.target.position.set(-0.5, -0.5, 12);

    this.spotR = new THREE.SpotLight(0xa5f3fc, 0, 35, Math.PI / 4, 0.35, 1);
    this.spotR.position.set(0.5, 0, 2.0);
    this.spotR.target.position.set(0.5, -0.5, 12);

    this.group.add(this.spotL, this.spotR);
    this.group.add(this.spotL.target, this.spotR.target);

    // Headlight Lens Discs
    const lensGeo = new THREE.CircleGeometry(0.12, 12);
    this.lensMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const lensL = new THREE.Mesh(lensGeo, this.lensMat);
    lensL.position.set(-0.5, 0, 2.02);
    const lensR = new THREE.Mesh(lensGeo, this.lensMat);
    lensR.position.set(0.5, 0, 2.02);
    this.group.add(lensL, lensR);
  }

  createPropeller() {
    const propGroup = new THREE.Group();
    const hubGeo = new THREE.SphereGeometry(0.08, 10, 10);
    const hub = new THREE.Mesh(hubGeo, this.darkMat);
    propGroup.add(hub);

    const bladeGeo = new THREE.BoxGeometry(0.35, 0.08, 0.02);
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(bladeGeo, this.yellowMat);
      blade.rotation.z = (i * Math.PI * 2) / 3;
      blade.rotation.x = 0.3; // Pitch
      propGroup.add(blade);
    }
    return propGroup;
  }

  setPower(online, cruiseSpeed = 10) {
    this.isOnline = online;
    this.targetSpeed = online ? cruiseSpeed : 0;
    this.spotL.intensity = online ? 4.5 : 0;
    this.spotR.intensity = online ? 4.5 : 0;
  }

  update(delta) {
    this.speed = THREE.MathUtils.lerp(this.speed, this.targetSpeed, delta * 2);

    // Spin propellers when active
    if (this.speed > 0.1) {
      this.propellerAngle += this.speed * delta * 4;
      this.propellerL.rotation.z = this.propellerAngle;
      this.propellerR.rotation.z = -this.propellerAngle;

      // Gentle sub cruising bob
      this.group.position.y = this.dockedPos.y + Math.sin(Date.now() * 0.002) * 0.15;
    } else {
      // Idle dock drift
      this.group.position.y = this.dockedPos.y + Math.sin(Date.now() * 0.001) * 0.05;
    }
  }
}
