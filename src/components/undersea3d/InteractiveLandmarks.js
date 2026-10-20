import * as THREE from "three";
import { ALL_UNDERSEA_SUBLEVELS } from "../../data/underseaCurriculum";

/**
 * 3D Interactive Landmarks & Terminal Stations
 * Positions and manages the 12 primary learning stations across Undersea Reef.
 * Features glowing holographic consoles, interactive proximity trigger rings,
 * and visual restoration feedback.
 */
export class LandmarkManager {
  constructor(scene) {
    this.scene = scene;
    this.landmarks = [];
    this.group = new THREE.Group();
    this.group.name = "UnderseaLandmarks";
    this.scene.add(this.group);

    this.initLandmarks();
  }

  initLandmarks() {
    // Pedestal materials
    this.baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3
    });

    this.activeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });

    this.restoredMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x10b981,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });

    this.lockedMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      emissive: 0x1e293b,
      emissiveIntensity: 0.1,
      roughness: 0.5
    });

    ALL_UNDERSEA_SUBLEVELS.forEach((sublevel) => {
      const station = this.createStation(sublevel);
      this.group.add(station.meshGroup);
      this.landmarks.push(station);
    });
  }

  createStation(sublevel) {
    const group = new THREE.Group();
    group.name = `Station_${sublevel.id}`;
    const [x, y, z] = sublevel.targetCoords;
    group.position.set(x, y - 1.2, z);

    // 1. Heavy seabed docking base
    const baseGeo = new THREE.CylinderGeometry(1.6, 2.0, 0.4, 16);
    const baseMesh = new THREE.Mesh(baseGeo, this.baseMat);
    group.add(baseMesh);

    // 2. Control console column
    const colGeo = new THREE.CylinderGeometry(0.5, 0.7, 1.4, 12);
    const colMesh = new THREE.Mesh(colGeo, this.baseMat);
    colMesh.position.y = 0.8;
    group.add(colMesh);

    // 3. Angled Holographic Terminal Screen
    const screenGeo = new THREE.BoxGeometry(1.2, 0.7, 0.15);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.6, 0.3);
    screenMesh.rotation.x = -0.4;
    group.add(screenMesh);

    // 4. Overhead Floating Holographic Beacon Icon
    const beaconGeo = new THREE.OctahedronGeometry(0.45, 0);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      metalness: 0.2,
      roughness: 0.1
    });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.y = 2.8;
    group.add(beaconMesh);

    // 5. Ground Interaction Proximity Ring
    const ringGeo = new THREE.RingGeometry(3.5, 3.8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.05;
    group.add(ringMesh);

    // 6. Station localized point light
    const stationLight = new THREE.PointLight(0x38bdf8, 2.0, 10);
    stationLight.position.y = 2.0;
    group.add(stationLight);

    return {
      id: sublevel.id,
      num: sublevel.num,
      sublevel: sublevel,
      meshGroup: group,
      beaconMesh: beaconMesh,
      ringMesh: ringMesh,
      screenMesh: screenMesh,
      stationLight: stationLight,
      worldPosition: new THREE.Vector3(x, y, z),
      status: "locked" // "locked" | "active" | "restored"
    };
  }

  updateStatus(completedSublevelNums = [], currentSublevelNum = 1) {
    this.landmarks.forEach((station) => {
      const isCompleted = completedSublevelNums.includes(station.num);
      const isCurrent = station.num === currentSublevelNum;

      if (isCompleted) {
        station.status = "restored";
        station.beaconMesh.material.color.set(0x10b981); // Emerald Green
        station.beaconMesh.material.emissive.set(0x059669);
        station.screenMesh.material.color.set(0x10b981);
        station.ringMesh.material.color.set(0x10b981);
        station.stationLight.color.set(0x10b981);
      } else if (isCurrent) {
        station.status = "active";
        station.beaconMesh.material.color.set(0x0ea5e9); // Vibrant Cyan
        station.beaconMesh.material.emissive.set(0x0284c7);
        station.screenMesh.material.color.set(0x38bdf8);
        station.ringMesh.material.color.set(0x0284c7);
        station.stationLight.color.set(0x38bdf8);
      } else {
        station.status = "locked";
        station.beaconMesh.material.color.set(0x64748b); // Muted Slate
        station.beaconMesh.material.emissive.set(0x334155);
        station.screenMesh.material.color.set(0x475569);
        station.ringMesh.material.color.set(0x334155);
        station.stationLight.color.set(0x475569);
      }
    });
  }

  // Check which landmark the diver is closest to
  getProximityLandmark(diverPos, threshold = 4.8) {
    for (const lm of this.landmarks) {
      const dist = lm.worldPosition.distanceTo(diverPos);
      if (dist <= threshold) {
        return { landmark: lm, distance: dist };
      }
    }
    return null;
  }

  update(delta) {
    const time = Date.now() * 0.001;

    this.landmarks.forEach((lm) => {
      // Rotating floating holographic beacon
      if (lm.beaconMesh) {
        lm.beaconMesh.rotation.y += delta * 1.5;
        lm.beaconMesh.position.y = 2.8 + Math.sin(time * 2 + lm.num) * 0.15;
      }

      // Pulsing interaction ring
      if (lm.ringMesh) {
        const pulse = 0.5 + Math.sin(time * 3 + lm.num) * 0.25;
        lm.ringMesh.material.opacity = pulse;
      }
    });
  }
}
