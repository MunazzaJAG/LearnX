import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EcoWoodsWorld } from "./EcoWoodsWorld";
import { ForestRangerCharacter } from "./ForestRangerCharacter";
import { ForestWildlifeManager } from "./ForestWildlife";
import { ecoWoodsAudio } from "../../utils/ecoWoodsAudio";

export function EcoWoodsScene({
  currentMission,
  completedMissionNums = [],
  restorationPercent = 0,
  onProximityChange,
  onOpenTerminal,
  lastExecutionSuccess,
  isCodeOpen,
  targetMissionNum = null
}) {
  const mountRef = useRef(null);

  // References to 3D entities
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const worldRef = useRef(null);
  const rangerRef = useRef(null);
  const wildlifeRef = useRef(null);

  // Input & Camera state
  const keysPressed = useRef({});
  const isMouseDown = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cameraAngle = useRef({ theta: Math.PI, phi: 0.35, distance: 7.0 });
  const rangerPos = useRef(new THREE.Vector3(0, 0, 11)); // Start at entrance before Forest Gate
  const rangerYaw = useRef(0);
  const isSprinting = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = Math.max(container.clientWidth || window.innerWidth || 800, 320);
    const height = Math.max(container.clientHeight || window.innerHeight || 600, 240);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Initialize World, Character, and Wildlife Systems
    const world = new EcoWoodsWorld(scene);
    worldRef.current = world;
    world.setRestoration(restorationPercent);

    const ranger = new ForestRangerCharacter();
    rangerRef.current = ranger;
    ranger.group.position.copy(rangerPos.current);
    scene.add(ranger.group);

    const wildlife = new ForestWildlifeManager(scene);
    wildlifeRef.current = wildlife;

    // Apply initial completed states
    if (completedMissionNums.includes(1)) world.openGate();
    if (completedMissionNums.includes(2)) world.cleanStream();
    if (completedMissionNums.includes(4)) world.sproutNursery();
    if (completedMissionNums.includes(5)) world.activateScanner();
    if (completedMissionNums.includes(6)) world.awakenHeartTree();

    // 3. Start ambient forest audio
    ecoWoodsAudio.startAmbient();

    // 4. Input Handlers
    const handleKeyDown = (e) => {
      // Don't capture keys if typing inside code editor or inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      keysPressed.current[e.code] = true;

      if (e.code === "KeyE") {
        onOpenTerminal();
      }
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        isSprinting.current = true;
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.code] = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        isSprinting.current = false;
      }
    };

    const handleMouseDown = (e) => {
      if (e.target.tagName === "CANVAS") {
        isMouseDown.current = true;
        mousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e) => {
      if (!isMouseDown.current) return;
      const dx = e.clientX - mousePos.current.x;
      const dy = e.clientY - mousePos.current.y;
      mousePos.current = { x: e.clientX, y: e.clientY };

      cameraAngle.current.theta -= dx * 0.006;
      cameraAngle.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2.2, cameraAngle.current.phi + dy * 0.006)
      );
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    const handleWheel = (e) => {
      if (e.target.tagName === "CANVAS") {
        cameraAngle.current.distance = Math.max(
          4.0,
          Math.min(12.0, cameraAngle.current.distance + e.deltaY * 0.005)
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel, { passive: true });

    // 5. Animation Loop
    let animationFrameId;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Handle Character Movement
      let moveX = 0;
      let moveZ = 0;

      if (keysPressed.current["KeyW"] || keysPressed.current["ArrowUp"]) moveZ -= 1;
      if (keysPressed.current["KeyS"] || keysPressed.current["ArrowDown"]) moveZ += 1;
      if (keysPressed.current["KeyA"] || keysPressed.current["ArrowLeft"]) moveX -= 1;
      if (keysPressed.current["KeyD"] || keysPressed.current["ArrowRight"]) moveX += 1;

      const isMoving = moveX !== 0 || moveZ !== 0;
      const speed = (isSprinting.current ? 9.5 : 5.5) * delta;

      if (isMoving) {
        // Compute forward and right direction vectors relative to camera azimuth
        const forward = new THREE.Vector3(
          Math.sin(cameraAngle.current.theta),
          0,
          Math.cos(cameraAngle.current.theta)
        ).normalize();

        const right = new THREE.Vector3(
          -forward.z,
          0,
          forward.x
        );

        const moveDir = new THREE.Vector3()
          .addScaledVector(forward, -moveZ)
          .addScaledVector(right, moveX)
          .normalize();

        rangerPos.current.addScaledVector(moveDir, speed);

        // Constrain to forest world bounds
        rangerPos.current.x = Math.max(-36, Math.min(36, rangerPos.current.x));
        rangerPos.current.z = Math.max(-34, Math.min(18, rangerPos.current.z));

        rangerYaw.current = Math.atan2(moveDir.x, moveDir.z);
        ranger.setRotation(rangerYaw.current);
      }

      ranger.group.position.x = rangerPos.current.x;
      ranger.group.position.z = rangerPos.current.z;
      ranger.update(delta, isMoving, isSprinting.current ? 1.6 : 1.0);

      // Third-person camera follow
      const targetCamX =
        rangerPos.current.x +
        Math.sin(cameraAngle.current.theta) *
          Math.cos(cameraAngle.current.phi) *
          cameraAngle.current.distance;
      const targetCamY =
        Math.sin(cameraAngle.current.phi) * cameraAngle.current.distance + 2.2;
      const targetCamZ =
        rangerPos.current.z +
        Math.cos(cameraAngle.current.theta) *
          Math.cos(cameraAngle.current.phi) *
          cameraAngle.current.distance;

      camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.12);
      camera.lookAt(rangerPos.current.x, 1.8, rangerPos.current.z);

      // Proximity Detection with 6 Landmarks
      if (world.beacons) {
        let closestBeacon = null;
        let minDistance = 4.2;

        for (const beacon of world.beacons) {
          const dist = rangerPos.current.distanceTo(beacon.coords);
          if (dist < minDistance) {
            minDistance = dist;
            closestBeacon = {
              num: beacon.num,
              label: beacon.label,
              coords: [beacon.coords.x, beacon.coords.y, beacon.coords.z],
              distance: dist
            };
          }
        }
        onProximityChange(closestBeacon);
      }

      // Update World and Wildlife Animations
      world.update(delta);
      wildlife.update(delta);

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = Math.max(container.clientWidth || window.innerWidth || 800, 320);
      const newH = Math.max(container.clientHeight || window.innerHeight || 600, 240);
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      ecoWoodsAudio.stopAmbient();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // React to targetMissionNum navigation (e.g. user clicks a mission in HUD)
  useEffect(() => {
    if (!targetMissionNum || !worldRef.current) return;
    const landmarkBeacon = worldRef.current.beacons?.find(
      (b) => b.num === targetMissionNum
    );
    if (landmarkBeacon) {
      // Teleport ranger right next to the landmark
      rangerPos.current.set(
        landmarkBeacon.coords.x,
        0,
        landmarkBeacon.coords.z + 2.8
      );
      if (rangerRef.current) {
        rangerRef.current.group.position.copy(rangerPos.current);
        rangerRef.current.setRotation(Math.PI);
      }
      cameraAngle.current.theta = Math.PI;
    }
  }, [targetMissionNum]);

  // React to successful mission code execution in the 3D world
  useEffect(() => {
    if (!lastExecutionSuccess || !worldRef.current) return;
    const { missionNum } = lastExecutionSuccess;

    if (missionNum === 1) {
      worldRef.current.openGate();
      ecoWoodsAudio.playGateOpen();
    } else if (missionNum === 2) {
      worldRef.current.cleanStream();
      ecoWoodsAudio.playStreamClean();
    } else if (missionNum === 3) {
      ecoWoodsAudio.playAnimalCall();
    } else if (missionNum === 4) {
      worldRef.current.sproutNursery();
      ecoWoodsAudio.playSeedlingGrow();
    } else if (missionNum === 5) {
      worldRef.current.activateScanner();
      ecoWoodsAudio.playScannerBeep();
    } else if (missionNum === 6) {
      worldRef.current.awakenHeartTree();
      ecoWoodsAudio.playGuardianAwaken();
    }
  }, [lastExecutionSuccess]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full min-h-screen overflow-hidden cursor-grab active:cursor-grabbing"
    />
  );
}
