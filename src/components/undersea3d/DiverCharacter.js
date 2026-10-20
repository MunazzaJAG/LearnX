import * as THREE from "three";

/**
 * 3D Humanoid Scuba Diver Character
 * Expressive, cute stylized human explorer in an articulated diving suit.
 * Features:
 * - Human anatomical proportions (head, expressive face, torso, arms with gloves, legs with boots, flippers)
 * - Transparent bubble helmet visor revealing animated eyes and headlamp spotlight
 * - Dual high-pressure oxygen cylinders with manifold and bubble exhaust
 * - Wrist-mounted holographic telemetry datapad on left forearm
 * - Handheld repair catalyst emitter on right hand
 * - Realistic swimming physics: flutter kick kinematics, buoyancy hover bob, banking into turns
 * - Visible physical equipment upgrades (Helmets, Jet Thruster Fins, Oxygen Tanks)
 * - In-world reaction animations (repair beam, sonar pulse, celebratory 360 backflip)
 */
export class DiverCharacter {
  constructor(customization = {}) {
    this.group = new THREE.Group();
    this.group.name = "DiverPlayer";
    this.group.scale.set(1.35, 1.35, 1.35);

    this.customization = {
      suitColor: customization.suitColor || "#1b8a7a", // Neoprene teal
      accentColor: customization.accentColor || "#52e3c2", // Luminous cyan trim
      visorColor: customization.visorColor || "#20d3d3",
      tankColor: customization.tankColor || "#e2e8f0",
      finsColor: customization.finsColor || "#0f766e",
      finType: customization.finType || "standard", // "standard" | "jet_thrusters" | "quantum"
      helmetType: customization.helmetType || "standard",
      ...customization
    };

    // Animation & Kinematics state
    this.swimTime = 0;
    this.blinkTimer = 0;
    this.isMoving = false;
    this.isBoosting = false;
    this.isCelebrating = false;
    this.celebrationProgress = 0;
    this.isRepairing = false;
    this.repairProgress = 0;
    this.sonarExpanding = false;
    this.sonarProgress = 0;

    this.buildHumanDiver();
  }

  buildHumanDiver() {
    const { suitColor, accentColor, visorColor, tankColor, finsColor } = this.customization;

    // Materials
    this.suitMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(suitColor),
      roughness: 0.4,
      metalness: 0.15
    });

    this.accentMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      roughness: 0.25,
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.35
    });

    this.visorMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(visorColor),
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      transparent: true,
      opacity: 0.82,
      ior: 1.45
    });

    this.tankMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tankColor),
      metalness: 0.75,
      roughness: 0.25
    });

    this.finsMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(finsColor),
      roughness: 0.35,
      metalness: 0.2
    });

    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#fed7aa"),
      roughness: 0.65
    });

    this.gloveMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6
    });

    // 1. Root Pelvis & Torso Group
    this.torso = new THREE.Group();
    this.group.add(this.torso);

    // Torso Wetsuit Body
    const chestGeo = new THREE.CylinderGeometry(0.32, 0.26, 0.75, 16);
    const chestMesh = new THREE.Mesh(chestGeo, this.suitMaterial);
    chestMesh.castShadow = true;
    this.torso.add(chestMesh);

    // Neoprene Accent Stripe across chest
    const stripeGeo = new THREE.BoxGeometry(0.48, 0.16, 0.46);
    const stripeMesh = new THREE.Mesh(stripeGeo, this.accentMaterial);
    stripeMesh.position.set(0, 0.12, 0.02);
    this.torso.add(stripeMesh);

    // 2. Head & Scuba Helmet Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.55, 0);
    this.torso.add(this.headGroup);

    // Stylized Cute Face inside helmet
    const faceGeo = new THREE.SphereGeometry(0.24, 18, 16);
    const faceMesh = new THREE.Mesh(faceGeo, this.skinMaterial);
    this.headGroup.add(faceMesh);

    // Expressive Eyes with Sparkles
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eyeGeo = new THREE.SphereGeometry(0.045, 12, 12);

    this.leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.leftEye.position.set(-0.08, 0.03, 0.22);
    this.rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.rightEye.position.set(0.08, 0.03, 0.22);
    this.headGroup.add(this.leftEye, this.rightEye);

    const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sparkleGeo = new THREE.SphereGeometry(0.016, 8, 8);
    const spL = new THREE.Mesh(sparkleGeo, sparkleMat);
    spL.position.set(-0.07, 0.045, 0.25);
    const spR = new THREE.Mesh(sparkleGeo, sparkleMat);
    spR.position.set(0.09, 0.045, 0.25);
    this.headGroup.add(spL, spR);

    // Transparent Bubble Helmet
    const helmetGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const helmetMesh = new THREE.Mesh(helmetGeo, this.visorMaterial);
    this.headGroup.add(helmetMesh);

    // Scuba Helmet Metallic Collar Rim
    const rimGeo = new THREE.TorusGeometry(0.32, 0.05, 12, 24);
    const rimMesh = new THREE.Mesh(rimGeo, this.tankMaterial);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -0.16;
    this.headGroup.add(rimMesh);

    // High-Intensity LED Headlamp
    const lampGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.14, 12);
    const lampMesh = new THREE.Mesh(lampGeo, this.accentMaterial);
    lampMesh.rotation.x = Math.PI / 2;
    lampMesh.position.set(0, 0.28, 0.22);
    this.headGroup.add(lampMesh);

    this.headLight = new THREE.SpotLight(0xa5f3fc, 2.8, 32, Math.PI / 4, 0.35, 1);
    this.headLight.position.set(0, 0.28, 0.28);
    this.headLight.target.position.set(0, 0.28, 6);
    this.headGroup.add(this.headLight);
    this.headGroup.add(this.headLight.target);

    // 3. Dual High-Pressure Oxygen Cylinders on Back
    this.tanksGroup = new THREE.Group();
    this.tanksGroup.position.set(0, 0.06, -0.32);
    this.torso.add(this.tanksGroup);

    const tankGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.65, 16);
    const tankL = new THREE.Mesh(tankGeo, this.tankMaterial);
    tankL.position.x = -0.14;
    const tankR = new THREE.Mesh(tankGeo, this.tankMaterial);
    tankR.position.x = 0.14;

    // Tank Caps & Regulator Manifold
    const capGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const capL = new THREE.Mesh(capGeo, this.accentMaterial);
    capL.position.set(-0.14, 0.32, 0);
    const capR = new THREE.Mesh(capGeo, this.accentMaterial);
    capR.position.set(0.14, 0.32, 0);

    const manifoldGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.36, 8);
    const manifold = new THREE.Mesh(manifoldGeo, this.tankMaterial);
    manifold.rotation.z = Math.PI / 2;
    manifold.position.set(0, 0.28, 0);

    this.tanksGroup.add(tankL, tankR, capL, capR, manifold);

    // 4. Left Arm (Articulated with Wrist Telemetry Datapad)
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.4, 0.25, 0);
    this.torso.add(this.leftArm);

    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.45, 12);
    const armMeshL = new THREE.Mesh(armGeo, this.suitMaterial);
    armMeshL.position.y = -0.2;
    this.leftArm.add(armMeshL);

    // Left Glove
    const gloveGeo = new THREE.SphereGeometry(0.09, 10, 10);
    const gloveL = new THREE.Mesh(gloveGeo, this.gloveMat);
    gloveL.position.set(0, -0.45, 0);
    this.leftArm.add(gloveL);

    // Wrist Holographic Telemetry Datapad
    const datapadGeo = new THREE.BoxGeometry(0.15, 0.12, 0.18);
    this.wristDatapad = new THREE.Mesh(datapadGeo, this.accentMaterial);
    this.wristDatapad.position.set(0, -0.36, 0.06);
    this.leftArm.add(this.wristDatapad);

    // 5. Right Arm (Articulated with Handheld Repair Catalyst Emitter)
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.4, 0.25, 0);
    this.torso.add(this.rightArm);

    const armMeshR = new THREE.Mesh(armGeo, this.suitMaterial);
    armMeshR.position.y = -0.2;
    this.rightArm.add(armMeshR);

    // Right Glove
    const gloveR = new THREE.Mesh(gloveGeo, this.gloveMat);
    gloveR.position.set(0, -0.45, 0);
    this.rightArm.add(gloveR);

    // Repair Beam Emitter Tool
    const toolGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.26, 12);
    this.repairTool = new THREE.Mesh(toolGeo, this.tankMaterial);
    this.repairTool.rotation.x = Math.PI / 2;
    this.repairTool.position.set(0, -0.45, 0.12);
    this.rightArm.add(this.repairTool);

    // Glowing Repair Beam Cylinder (hidden until repair triggered)
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.25, 8, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85
    });
    this.repairBeam = new THREE.Mesh(beamGeo, beamMat);
    this.repairBeam.rotation.x = Math.PI / 2;
    this.repairBeam.position.set(0, 0, 4);
    this.repairBeam.visible = false;
    this.repairTool.add(this.repairBeam);

    // 6. Left Leg, Boot & Flipper with Propulsion Thruster
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.18, -0.4, 0);
    this.torso.add(this.leftLeg);

    const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.55, 12);
    const legMeshL = new THREE.Mesh(legGeo, this.suitMaterial);
    legMeshL.position.y = -0.25;
    this.leftLeg.add(legMeshL);

    // Diving Boot
    const bootGeo = new THREE.BoxGeometry(0.14, 0.12, 0.22);
    const bootL = new THREE.Mesh(bootGeo, this.gloveMat);
    bootL.position.set(0, -0.52, 0.04);
    this.leftLeg.add(bootL);

    // Left Fin Blade
    const finGeo = new THREE.BoxGeometry(0.24, 0.03, 0.7);
    const finL = new THREE.Mesh(finGeo, this.finsMaterial);
    finL.position.set(0, -0.58, 0.26);
    finL.rotation.x = 0.22;
    this.leftLeg.add(finL);

    // Left Hydro-Jet Thruster Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.16, 8);
    nozzleGeo.rotateX(Math.PI / 2);
    const nozzleL = new THREE.Mesh(nozzleGeo, this.tankMaterial);
    nozzleL.position.set(0, -0.56, -0.06);
    this.leftLeg.add(nozzleL);

    // 7. Right Leg, Boot & Flipper with Propulsion Thruster
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.18, -0.4, 0);
    this.torso.add(this.rightLeg);

    const legMeshR = new THREE.Mesh(legGeo, this.suitMaterial);
    legMeshR.position.y = -0.25;
    this.rightLeg.add(legMeshR);

    // Diving Boot
    const bootR = new THREE.Mesh(bootGeo, this.gloveMat);
    bootR.position.set(0, -0.52, 0.04);
    this.rightLeg.add(bootR);

    // Right Fin Blade
    const finR = new THREE.Mesh(finGeo, this.finsMaterial);
    finR.position.set(0, -0.58, 0.26);
    finR.rotation.x = 0.22;
    this.rightLeg.add(finR);

    // Right Hydro-Jet Thruster Nozzle
    const nozzleR = new THREE.Mesh(nozzleGeo, this.tankMaterial);
    nozzleR.position.set(0, -0.56, -0.06);
    this.rightLeg.add(nozzleR);

    // 8. Sonar Expanding Ring Wave (for Q Sonar Pulse ability)
    const sonarGeo = new THREE.RingGeometry(0.3, 0.5, 32);
    const sonarMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.sonarRing = new THREE.Mesh(sonarGeo, sonarMat);
    this.sonarRing.rotation.x = -Math.PI / 2;
    this.sonarRing.position.y = 0.2;
    this.group.add(this.sonarRing);

    // Default neutral diving pitch
    this.torso.rotation.x = 0.35;
  }

  updateCustomization(config) {
    Object.assign(this.customization, config);
    if (config.suitColor) this.suitMaterial.color.set(config.suitColor);
    if (config.accentColor) {
      this.accentMaterial.color.set(config.accentColor);
      this.accentMaterial.emissive.set(config.accentColor);
    }
    if (config.visorColor) this.visorMaterial.color.set(config.visorColor);
    if (config.tankColor) this.tankMaterial.color.set(config.tankColor);
    if (config.finsColor) this.finsMaterial.color.set(config.finsColor);
  }

  triggerCelebration() {
    this.isCelebrating = true;
    this.celebrationProgress = 0;
  }

  triggerRepairBeam(duration = 2.5) {
    this.isRepairing = true;
    this.repairProgress = duration;
    this.repairBeam.visible = true;
  }

  triggerSonarWave() {
    this.sonarExpanding = true;
    this.sonarProgress = 0;
  }

  update(delta, isMoving, isBoosting = false) {
    this.isMoving = isMoving;
    this.isBoosting = isBoosting;
    this.swimTime += delta * (isBoosting ? 8.5 : isMoving ? 5.2 : 2.0);

    // Eye blinking animation
    this.blinkTimer += delta;
    if (this.blinkTimer > 3.5) {
      this.leftEye.scale.y = 0.1;
      this.rightEye.scale.y = 0.1;
      if (this.blinkTimer > 3.65) {
        this.leftEye.scale.y = 1.0;
        this.rightEye.scale.y = 1.0;
        this.blinkTimer = 0;
      }
    }

    // Kinematics and Animations
    if (this.isCelebrating) {
      // 360 Victory Backflip Spin
      this.celebrationProgress += delta * 3.8;
      this.torso.rotation.x = Math.sin(this.celebrationProgress) * Math.PI * 2;
      this.leftArm.rotation.z = Math.sin(this.celebrationProgress * 2) * 0.85 - 0.5;
      this.rightArm.rotation.z = -Math.sin(this.celebrationProgress * 2) * 0.85 + 0.5;

      if (this.celebrationProgress >= Math.PI * 2) {
        this.isCelebrating = false;
        this.torso.rotation.x = 0.35;
        this.leftArm.rotation.z = 0;
        this.rightArm.rotation.z = 0;
      }
    } else {
      if (isMoving) {
        // Forward swimming posture
        const targetPitch = isBoosting ? 1.0 : 0.8;
        this.torso.rotation.x = THREE.MathUtils.lerp(this.torso.rotation.x, targetPitch, delta * 5);

        // Sinusoidal flutter kick (alternating legs)
        const kickAngle = Math.sin(this.swimTime) * (isBoosting ? 0.7 : 0.45);
        this.leftLeg.rotation.x = kickAngle;
        this.rightLeg.rotation.x = -kickAngle;

        // Natural arm counter-stroke
        this.leftArm.rotation.x = -kickAngle * 0.5;
        this.rightArm.rotation.x = kickAngle * 0.5;

        // Torso gentle swimming roll
        this.torso.rotation.z = Math.sin(this.swimTime * 0.5) * 0.09;
      } else {
        // Idle floating buoyancy bob
        this.torso.rotation.x = THREE.MathUtils.lerp(this.torso.rotation.x, 0.22, delta * 3);
        this.torso.rotation.z = THREE.MathUtils.lerp(this.torso.rotation.z, 0, delta * 3);

        const idleBob = Math.sin(this.swimTime) * 0.14;
        this.leftLeg.rotation.x = idleBob;
        this.rightLeg.rotation.x = -idleBob * 0.75;

        // Gentle balancing arm movements
        this.leftArm.rotation.z = Math.sin(this.swimTime * 0.7) * 0.16;
        this.rightArm.rotation.z = -Math.sin(this.swimTime * 0.7) * 0.16;
      }
    }

    // Repair Beam Animation
    if (this.isRepairing) {
      this.repairProgress -= delta;
      this.rightArm.rotation.x = -1.25; // Point arm forward
      this.rightArm.rotation.y = -0.28;
      this.repairBeam.visible = true;
      const pulse = 0.8 + Math.sin(this.swimTime * 18) * 0.25;
      this.repairBeam.scale.set(pulse, 1, pulse);

      if (this.repairProgress <= 0) {
        this.isRepairing = false;
        this.repairBeam.visible = false;
      }
    }

    // Sonar Wave Animation
    if (this.sonarExpanding) {
      this.sonarProgress += delta * 2.2;
      const s = 1 + this.sonarProgress * 28;
      this.sonarRing.scale.set(s, s, s);
      this.sonarRing.material.opacity = Math.max(0, 1 - this.sonarProgress);
      if (this.sonarProgress >= 1.0) {
        this.sonarExpanding = false;
        this.sonarRing.material.opacity = 0;
      }
    }
  }
}
