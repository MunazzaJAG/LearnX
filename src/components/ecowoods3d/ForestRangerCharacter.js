import * as THREE from "three";

/**
 * LearnX — Forest Ranger / Explorer 3D Avatar
 * Stylized third-person character with procedural mesh hierarchy:
 * - Explorer brimmed hat & visor
 * - Forest ranger tunic & field backpack
 * - Walking/running articulated limb swing animations
 */
export class ForestRangerCharacter {
  constructor() {
    this.group = new THREE.Group();
    this.walkCycle = 0;

    // Materials
    this.vestMat = new THREE.MeshStandardMaterial({
      color: 0x1f543d, // Deep forest green vest
      roughness: 0.65,
      metalness: 0.1
    });
    this.shirtMat = new THREE.MeshStandardMaterial({
      color: 0xedf4ee, // Soft cream ranger shirt
      roughness: 0.7
    });
    this.skinMat = new THREE.MeshStandardMaterial({
      color: 0xf5cfb3, // Warm skin tone
      roughness: 0.8
    });
    this.hatMat = new THREE.MeshStandardMaterial({
      color: 0x6e4727, // Leather brown brimmed hat
      roughness: 0.75
    });
    this.pantsMat = new THREE.MeshStandardMaterial({
      color: 0x3d352e, // Khaki dark brown trousers
      roughness: 0.8
    });
    this.packMat = new THREE.MeshStandardMaterial({
      color: 0xc87d32, // Terracotta canvas explorer backpack
      roughness: 0.7
    });

    this.initBody();
  }

  initBody() {
    // 1. Torso
    this.torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.32, 0.9, 12),
      this.vestMat
    );
    this.torso.position.y = 1.25;
    this.torso.castShadow = true;
    this.group.add(this.torso);

    // Explorer Backpack on back
    const backpack = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.55, 0.3),
      this.packMat
    );
    backpack.position.set(0, 1.3, -0.28);
    backpack.castShadow = true;
    this.group.add(backpack);

    // Bedroll on top of backpack
    const bedroll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.54, 8),
      this.shirtMat
    );
    bedroll.rotation.z = Math.PI / 2;
    bedroll.position.set(0, 1.62, -0.28);
    this.group.add(bedroll);

    // 2. Head & Ranger Hat
    this.head = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 14),
      this.skinMat
    );
    this.head.position.y = 1.95;
    this.head.castShadow = true;
    this.group.add(this.head);

    // Brimmed Ranger Hat
    const hatCrown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.23, 0.25, 0.28, 14),
      this.hatMat
    );
    hatCrown.position.set(0, 2.14, 0);
    this.group.add(hatCrown);

    const hatBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.04, 16),
      this.hatMat
    );
    hatBrim.position.set(0, 2.02, 0);
    this.group.add(hatBrim);

    // 3. Left Arm Pivot
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(-0.46, 1.6, 0);
    const leftArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.09, 0.65, 8),
      this.shirtMat
    );
    leftArm.position.y = -0.32;
    this.leftArmPivot.add(leftArm);
    this.group.add(this.leftArmPivot);

    // 4. Right Arm Pivot
    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(0.46, 1.6, 0);
    const rightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.09, 0.65, 8),
      this.shirtMat
    );
    rightArm.position.y = -0.32;
    this.rightArmPivot.add(rightArm);
    this.group.add(this.rightArmPivot);

    // 5. Left Leg Pivot
    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.position.set(-0.2, 0.8, 0);
    const leftLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.1, 0.8, 8),
      this.pantsMat
    );
    leftLeg.position.y = -0.4;
    this.leftLegPivot.add(leftLeg);
    this.group.add(this.leftLegPivot);

    // 6. Right Leg Pivot
    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.position.set(0.2, 0.8, 0);
    const rightLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.1, 0.8, 8),
      this.pantsMat
    );
    rightLeg.position.y = -0.4;
    this.rightLegPivot.add(rightLeg);
    this.group.add(this.rightLegPivot);
  }

  update(delta, isMoving = false, speed = 1) {
    if (isMoving) {
      this.walkCycle += delta * 10 * speed;
      const angle = Math.sin(this.walkCycle) * 0.65;

      this.leftLegPivot.rotation.x = angle;
      this.rightLegPivot.rotation.x = -angle;

      this.leftArmPivot.rotation.x = -angle * 0.7;
      this.rightArmPivot.rotation.x = angle * 0.7;

      // Gentle vertical bobbing when walking
      this.group.position.y = Math.abs(Math.sin(this.walkCycle * 2)) * 0.08;
    } else {
      // Smoothly return limbs to idle pose
      this.leftLegPivot.rotation.x *= 0.85;
      this.rightLegPivot.rotation.x *= 0.85;
      this.leftArmPivot.rotation.x *= 0.85;
      this.rightArmPivot.rotation.x *= 0.85;
      this.group.position.y = 0;
    }
  }

  setRotation(yaw) {
    this.group.rotation.y = yaw;
  }
}
