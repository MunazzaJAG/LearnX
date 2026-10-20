import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { UnderseaWorld } from "./UnderseaWorld";
import { DiverCharacter } from "./DiverCharacter";
import { SeaLifeManager } from "./SeaLife";
import { SubmarineProp } from "./SubmarineProp";
import { LandmarkManager } from "./InteractiveLandmarks";
import { underseaAudio } from "../../utils/underseaAudio";

export function UnderseaScene({
  currentSublevel,
  completedSublevelNums = [],
  restorationPercent = 0,
  diverCustomization,
  onProximityChange,
  onOpenTerminal,
  onTriggerSonar,
  lastExecutionSuccess,
  isCodeOpen
}) {
  const mountRef = useRef(null);

  // References to 3D entities
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const worldRef = useRef(null);
  const diverRef = useRef(null);
  const seaLifeRef = useRef(null);
  const submarineRef = useRef(null);
  const landmarksRef = useRef(null);

  // Input & Camera state
  const keysPressed = useRef({});
  const isMouseDown = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cameraAngle = useRef({ theta: Math.PI, phi: 0.32, distance: 5.2 });
  const diverPos = useRef(new THREE.Vector3(0, 0, 8)); // Start near Submarine Dock
  const diverYaw = useRef(0);
  const isBoosting = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Initialize 3D Systems
    const world = new UnderseaWorld(scene);
    worldRef.current = world;
    world.setRestoration(restorationPercent);

    const diver = new DiverCharacter(diverCustomization);
    diverRef.current = diver;
    diver.group.position.copy(diverPos.current);
    scene.add(diver.group);

    const seaLife = new SeaLifeManager(scene);
    seaLifeRef.current = seaLife;

    const submarine = new SubmarineProp();
    submarineRef.current = submarine;
    scene.add(submarine.group);

    const landmarks = new LandmarkManager(scene);
    landmarksRef.current = landmarks;
    landmarks.updateStatus(completedSublevelNums, currentSublevel?.num || 1);

    // Initial restoration state from saved progress (Level 1 Sublevels 1-6)
    if (completedSublevelNums.includes(1)) {
      submarine.setPower(true, 12);
      if (world.powerObservatoryLab) world.powerObservatoryLab();
    }
    if (completedSublevelNums.includes(3)) {
      world.openAbyssGate();
    }
    if (completedSublevelNums.includes(4)) {
      seaLife.herdJellyfish();
    }
    if (completedSublevelNums.includes(6)) {
      seaLife.setGuardianFriendly(true);
      world.restoreResearchHub();
    }

    // 3. Start ambient audio
    underseaAudio.startAmbient();

    // 4. Input Handlers
    const handleKeyDown = (e) => {
      keysPressed.current[e.code] = true;

      if (e.code === "KeyE") {
        onOpenTerminal();
      }
      if (e.code === "KeyQ") {
        handleSonarPulse();
      }
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        isBoosting.current = true;
        underseaAudio.playThrusterBoost();
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.code] = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        isBoosting.current = false;
      }
    };

    const handleMouseDown = (e) => {
      // Only drag if not clicking on UI buttons
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
      cameraAngle.current.phi = Math.max(0.1, Math.min(1.2, cameraAngle.current.phi + dy * 0.005));
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    const handleWheel = (e) => {
      if (e.target.tagName === "CANVAS") {
        cameraAngle.current.distance = Math.max(
          2.8,
          Math.min(9.5, cameraAngle.current.distance + e.deltaY * 0.005)
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel);

    // 5. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 6. Animation Loop
    let clock = new THREE.Clock();
    let animId = null;
    let bubbleCooldown = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      // Player Movement Kinematics
      let moveZ = 0;
      let moveX = 0;
      let moveY = 0;

      const keys = keysPressed.current;
      if (keys["KeyW"] || keys["ArrowUp"]) moveZ += 1;
      if (keys["KeyS"] || keys["ArrowDown"]) moveZ -= 1;
      if (keys["KeyA"] || keys["ArrowLeft"]) moveX -= 1;
      if (keys["KeyD"] || keys["ArrowRight"]) moveX += 1;
      if (keys["Space"]) moveY += 1;
      if (keys["KeyC"]) moveY -= 1;

      const isMoving = moveZ !== 0 || moveX !== 0 || moveY !== 0;
      const boostMultiplier = isBoosting.current ? 2.2 : 1.0;
      const baseSpeed = 7.5 * boostMultiplier * delta;

      if (isMoving) {
        // Calculate forward direction from camera's horizontal angle
        const forward = new THREE.Vector3(
          -Math.sin(cameraAngle.current.theta),
          0,
          -Math.cos(cameraAngle.current.theta)
        ).normalize();

        const right = new THREE.Vector3(
          Math.cos(cameraAngle.current.theta),
          0,
          -Math.sin(cameraAngle.current.theta)
        ).normalize();

        const moveDir = new THREE.Vector3();
        moveDir.addScaledVector(forward, moveZ);
        moveDir.addScaledVector(right, moveX);
        moveDir.y = moveY;
        moveDir.normalize();

        diverPos.current.addScaledVector(moveDir, baseSpeed);

        // Clamping boundaries
        diverPos.current.x = Math.max(-65, Math.min(65, diverPos.current.x));
        diverPos.current.z = Math.max(-75, Math.min(55, diverPos.current.z));
        diverPos.current.y = Math.max(-1.0, Math.min(10.0, diverPos.current.y));

        // Smoothly rotate diver towards movement direction
        const targetAngle = Math.atan2(moveDir.x, moveDir.z);
        diverYaw.current = THREE.MathUtils.lerp(diverYaw.current, targetAngle, delta * 8);

        // Tank bubble exhaust
        bubbleCooldown += delta;
        if (bubbleCooldown > (isBoosting.current ? 0.3 : 0.8)) {
          bubbleCooldown = 0;
          underseaAudio.playBubble();
        }
      }

      // Update Diver 3D Transform
      diver.group.position.copy(diverPos.current);
      diver.group.rotation.y = diverYaw.current;
      diver.update(delta, isMoving, isBoosting.current);

      // Third-person Orbit Camera Calculation
      const dist = isCodeOpen ? cameraAngle.current.distance * 0.85 : cameraAngle.current.distance;
      const phi = cameraAngle.current.phi;
      const theta = cameraAngle.current.theta;

      const camX = diverPos.current.x + dist * Math.sin(theta) * Math.cos(phi);
      const camY = diverPos.current.y + dist * Math.sin(phi) + 1.1;
      const camZ = diverPos.current.z + dist * Math.cos(theta) * Math.cos(phi);

      camera.position.set(camX, Math.max(-0.5, camY), camZ);
      camera.lookAt(
        diverPos.current.x,
        diverPos.current.y + 0.75,
        diverPos.current.z
      );

      // Update World, SeaLife, Submarine, Landmarks
      world.update(delta);
      seaLife.update(delta);
      submarine.update(delta);
      landmarks.update(delta);

      // Proximity check with stations
      const nearest = landmarks.getProximityLandmark(diverPos.current, 5.0);
      onProximityChange(nearest ? nearest.landmark : null);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);

      underseaAudio.stopAmbient();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update customization dynamically
  useEffect(() => {
    if (diverRef.current && diverCustomization) {
      diverRef.current.updateCustomization(diverCustomization);
    }
  }, [diverCustomization]);

  // Update landmark statuses when sublevel completes
  useEffect(() => {
    if (landmarksRef.current) {
      landmarksRef.current.updateStatus(completedSublevelNums, currentSublevel?.num || 1);
    }
  }, [completedSublevelNums, currentSublevel]);

  // Update restoration percent in world
  useEffect(() => {
    if (worldRef.current) {
      worldRef.current.setRestoration(restorationPercent);
    }
  }, [restorationPercent]);

  // Position diver smoothly in front of active landmark when advancing sublevels
  useEffect(() => {
    if (currentSublevel?.targetCoords && diverRef.current) {
      const [tx, ty, tz] = currentSublevel.targetCoords;
      const targetVec = new THREE.Vector3(tx, Math.max(0, ty + 1.2), tz + 5.5);
      if (diverPos.current.distanceTo(targetVec) > 20) {
        diverPos.current.copy(targetVec);
        diverRef.current.group.position.copy(targetVec);
      }
    }
  }, [currentSublevel?.num]);

  // Handle in-world execution reactions
  useEffect(() => {
    if (!lastExecutionSuccess) return;

    const num = lastExecutionSuccess.sublevelNum;
    const diver = diverRef.current;
    const submarine = submarineRef.current;
    const world = worldRef.current;
    const seaLife = seaLifeRef.current;

    // Diver celebratory backflip
    if (diver) {
      diver.triggerCelebration();
    }

    // Task-specific in-world reactions for Level 1 (6 Sublevels)
    if (num === 1) {
      // 1. Current Control: Power Reef Station Delta & fire suit thrusters
      if (diver) diver.triggerCelebration();
      if (submarine) submarine.setPower(true, 16);
      if (world && world.powerObservatoryLab) world.powerObservatoryLab();
      underseaAudio.playThrusterBoost();
    } else if (num === 2 && diver) {
      // 2. Coral Rescue: Diver fires restorative biocatalyst beam
      diver.triggerRepairBeam(3.5);
      underseaAudio.playRepairBeam();
    } else if (num === 3 && world) {
      // 3. The Abyss Gate: Hydraulic pins release and ancient gate slides open
      world.openAbyssGate();
      underseaAudio.playHydraulicMove();
    } else if (num === 4 && seaLife) {
      // 4. Jellyfish Herding: Swarm guided into glowing sanctuary
      seaLife.herdJellyfish();
      underseaAudio.playSonarPing();
    } else if (num === 5 && diver) {
      // 5. Pearl Scanner: Wrist scanner pulses and recovers pearls
      diver.triggerSonarWave();
      underseaAudio.playSonarPing();
    } else if (num === 6) {
      // 6. The Reef Guardian: Guardian turns friendly and central hub fully restores
      if (seaLife) seaLife.setGuardianFriendly(true);
      if (world) world.restoreResearchHub();
      underseaAudio.playGrandFanfare();
    }
  }, [lastExecutionSuccess]);

  const handleSonarPulse = () => {
    if (diverRef.current) {
      diverRef.current.triggerSonarWave();
    }
    underseaAudio.playSonarPing();
    if (onTriggerSonar) onTriggerSonar();
  };

  return <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />;
}
