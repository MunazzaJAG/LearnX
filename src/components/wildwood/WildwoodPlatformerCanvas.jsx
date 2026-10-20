import React, { useEffect, useRef, useState } from "react";
import { soundEngine } from "../../utils/audio";

/**
 * Cross-browser rounded rectangle helper.
 * Uses native ctx.roundRect when available, with a standard Canvas2D arcTo fallback.
 */
function drawRoundedRect(ctx, x, y, w, h, r = 6) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

/**
 * WildwoodPlatformerCanvas
 * A high-performance, delta-time 2D Canvas platformer for Wildwood Sanctuary.
 * Features:
 * - Parallax forest backdrop with fireflies and drifting leaves
 * - Smooth camera tracking with lerp
 * - Rigorous AABB physics, jump buffering, coyote time, variable jump height
 * - 6 distinct habitat zones with interactive animal mission stations
 * - Visible world changes upon mission completion (bridges, gates, elevators, lanterns, portal)
 * - Collectible golden acorns
 * - On-screen touch/mouse controls for mobile & laptops
 */
export function WildwoodPlatformerCanvas({
  completedMissions = [],
  activeMissionNum = 1,
  onOpenChallenge,
  onCollectAcorn,
  acornCount = 0,
  isPaused = false,
  onLevelComplete,
  restartTrigger = 0
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const prevStationNumRef = useRef(null);

  // Checkpoint restart listener
  useEffect(() => {
    if (restartTrigger > 0 && worldRef.current) {
      const p = worldRef.current.player;
      const checkpoints = {
        1: 100,
        2: 620,
        3: 1560,
        4: 2000,
        5: 2520,
        6: 2960
      };
      p.x = checkpoints[activeMissionNum] || 100;
      p.y = 550 - p.height;
      p.vx = 0;
      p.vy = 0;
      p.isGrounded = true;
      worldRef.current.camera.x = Math.max(0, p.x - 200);
    }
  }, [restartTrigger, activeMissionNum]);

  // Keyboard input state
  const keysRef = useRef({
    left: false,
    right: false,
    up: false,
    jump: false,
    down: false,
    interact: false
  });

  // Touch/On-screen controls state
  const touchControlsRef = useRef({
    left: false,
    right: false,
    jump: false,
    interact: false
  });

  // Level World State
  const worldRef = useRef({
    width: 3500,
    height: 720,
    gravity: 1250,
    player: {
      x: 100,
      y: 502, // 550 - 48 height (stands on ground platform)
      vx: 0,
      vy: 0,
      width: 32,
      height: 48,
      isGrounded: true,
      facing: 1, // 1 right, -1 left
      animTime: 0,
      jumpTimer: 0,
      coyoteTimer: 0,
      isJumping: false,
      squash: 1,
      stretch: 1
    },
    camera: {
      x: 0,
      y: 0
    },
    // Floating particles (leaves & fireflies)
    particles: Array.from({ length: 45 }, () => ({
      x: Math.random() * 3500,
      y: Math.random() * 700,
      vx: (Math.random() - 0.4) * 20,
      vy: Math.random() * 15 + 10,
      size: Math.random() * 3 + 2,
      phase: Math.random() * Math.PI * 2,
      type: Math.random() > 0.4 ? "leaf" : "firefly"
    })),
    // Collectible golden acorns
    acorns: [
      { id: 1, x: 220, y: 500, collected: false },
      { id: 2, x: 340, y: 440, collected: false },
      { id: 3, x: 530, y: 410, collected: false },
      { id: 4, x: 670, y: 490, collected: false },
      { id: 5, x: 790, y: 420, collected: false },
      { id: 6, x: 910, y: 350, collected: false },
      { id: 7, x: 1060, y: 430, collected: false },
      { id: 8, x: 1180, y: 380, collected: false },
      { id: 9, x: 1280, y: 310, collected: false },
      { id: 10, x: 1420, y: 490, collected: false },
      { id: 11, x: 1600, y: 420, collected: false },
      { id: 12, x: 1720, y: 350, collected: false },
      { id: 13, x: 1880, y: 480, collected: false },
      { id: 14, x: 2020, y: 410, collected: false },
      { id: 15, x: 2180, y: 490, collected: false },
      { id: 16, x: 2310, y: 420, collected: false },
      { id: 17, x: 2420, y: 320, collected: false },
      { id: 18, x: 2560, y: 260, collected: false },
      { id: 19, x: 2710, y: 390, collected: false },
      { id: 20, x: 2840, y: 460, collected: false },
      { id: 21, x: 2980, y: 420, collected: false },
      { id: 22, x: 3080, y: 480, collected: false },
      { id: 23, x: 3180, y: 440, collected: false },
      { id: 24, x: 3340, y: 470, collected: false },
    ],
    // Sparkle pop animations
    sparkles: [],
    // Elevator state
    elevatorY: 520,
    elevatorDir: -1,
    // Near station prompt
    nearStation: null
  });

  const [activeStationPrompt, setActiveStationPrompt] = useState(null);

  // Listen to keyboard events (disabled during pause or when coding modal is open)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture keys if typing in a modal or input, or if game is paused
      if (isPaused) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.right = true;
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
        keysRef.current.jump = true;
        e.preventDefault();
      }
      if (e.code === "KeyE" || e.code === "Enter") {
        keysRef.current.interact = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.right = false;
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") keysRef.current.jump = false;
      if (e.code === "KeyE" || e.code === "Enter") keysRef.current.interact = false;
    };

    if (isPaused) {
      keysRef.current.left = false;
      keysRef.current.right = false;
      keysRef.current.jump = false;
      keysRef.current.interact = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPaused]);

  // Main Delta-Time Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let lastTime = performance.now();

    // Resize handler
    const updateCanvasSize = () => {
      if (!canvas || !containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth || 1280;
      const h = containerRef.current.clientHeight || window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Game loop
    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // cap delta-time
      lastTime = currentTime;

      if (canvas.width === 0 || canvas.height === 0) {
        updateCanvasSize();
      }

      if (!isPaused) {
        updatePhysics(dt);
      }
      render(ctx, canvas);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [completedMissions, isPaused]);

  // Physics & World Updates
  const updatePhysics = (dt) => {
    const world = worldRef.current;
    const p = world.player;
    const isM1Done = completedMissions.includes(1);
    const isM2Done = completedMissions.includes(2);
    const isM3Done = completedMissions.includes(3);
    const isM4Done = completedMissions.includes(4);
    const isM5Done = completedMissions.includes(5);
    const isM6Done = completedMissions.includes(6);

    // Elevator platform animation (Zone 4)
    let elevatorDy = 0;
    if (isM4Done) {
      const prevElevatorY = world.elevatorY;
      world.elevatorY += world.elevatorDir * 55 * dt;
      if (world.elevatorY < 280) {
        world.elevatorY = 280;
        world.elevatorDir = 1;
      } else if (world.elevatorY > 530) {
        world.elevatorY = 530;
        world.elevatorDir = -1;
      }
      elevatorDy = world.elevatorY - prevElevatorY;
    }

    // Controls input calculation
    const moveLeft = keysRef.current.left || touchControlsRef.current.left;
    const moveRight = keysRef.current.right || touchControlsRef.current.right;
    const jumpReq = keysRef.current.jump || touchControlsRef.current.jump;
    const interactReq = keysRef.current.interact || touchControlsRef.current.interact;

    // Horizontal Movement
    const speed = 250;
    if (moveLeft) {
      p.vx = -speed;
      p.facing = -1;
      p.animTime += dt * 10;
    } else if (moveRight) {
      p.vx = speed;
      p.facing = 1;
      p.animTime += dt * 10;
    } else {
      p.vx *= Math.pow(0.001, dt); // quick friction stopping
      if (Math.abs(p.vx) < 5) p.vx = 0;
    }

    // Jump logic with coyote time & jump buffering
    if (p.isGrounded) {
      p.coyoteTimer = 0.12;
    } else {
      p.coyoteTimer -= dt;
    }

    if (jumpReq) {
      p.jumpTimer = 0.12;
    } else {
      p.jumpTimer -= dt;
    }

    if (p.jumpTimer > 0 && p.coyoteTimer > 0) {
      p.vy = -540;
      p.isGrounded = false;
      p.jumpTimer = 0;
      p.coyoteTimer = 0;
      p.isJumping = true;
      p.squash = 0.7;
      p.stretch = 1.3;
      soundEngine.playTone(380, 0.08, "triangle", 0.08);
    }

    // Variable jump height: release jump early to fall sooner
    if (!jumpReq && p.vy < -150) {
      p.vy += 800 * dt;
    }

    // Gravity
    p.vy += world.gravity * dt;
    if (p.vy > 800) p.vy = 800; // Terminal velocity

    // Squash & stretch recovery
    p.squash += (1 - p.squash) * 10 * dt;
    p.stretch += (1 - p.stretch) * 10 * dt;
    if (!Number.isFinite(p.squash) || p.squash <= 0.1) p.squash = 1;
    if (!Number.isFinite(p.stretch) || p.stretch <= 0.1) p.stretch = 1;
    p.squash = Math.max(0.6, Math.min(1.4, p.squash));
    p.stretch = Math.max(0.6, Math.min(1.4, p.stretch));

    // Carry player on moving elevator platform
    if (isM4Done && p.isGrounded && p.x + p.width > 2350 && p.x < 2460 && Math.abs(p.y + p.height - world.elevatorY) < 12) {
      p.y += elevatorDy;
    }

    // Integrate Position
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // World Platforms definition (h: 600 ensures ground extends deep below viewport)
    const platforms = [
      // Ground 1: Clinic Zone (x: 0 to 480)
      { x: 0, y: 550, w: 480, h: 600, color: "#1F4832" },

      // Bridge 1 (Clinic Trench): Appears when Mission 1 is solved!
      ...(isM1Done
        ? [{ x: 480, y: 550, w: 120, h: 24, color: "#92400E", isBridge: true }]
        : []),

      // Ground 2: Burrow Glade (x: 600 to 1100)
      { x: 600, y: 550, w: 500, h: 600, color: "#2B5E3C" },

      // High Burrow ledges
      { x: 740, y: 460, w: 140, h: 22, color: "#2B5E3C" },
      { x: 920, y: 390, w: 150, h: 22, color: "#2B5E3C" },

      // Mushroom Spring Pad (M2 solved): Bounces player up to high path
      ...(isM2Done
        ? [{ x: 1110, y: 540, w: 50, h: 20, isMushroom: true }]
        : [{ x: 1100, y: 550, w: 90, h: 600, color: "#244F35" }]),

      // Stepping stones over Meadow Stream
      { x: 1220, y: 450, w: 110, h: 20, color: "#3B724C" },
      { x: 1360, y: 380, w: 110, h: 20, color: "#3B724C" },

      // Ground 3: Sunlit Meadow (x: 1480 to 1980)
      { x: 1480, y: 550, w: 500, h: 600, color: "#478255" },

      // High Meadow Branch Platforms
      { x: 1650, y: 440, w: 130, h: 20, color: "#478255" },
      { x: 1810, y: 370, w: 120, h: 20, color: "#478255" },

      // Ground 4: Storehouse Glade (x: 1980 to 2420)
      { x: 1980, y: 550, w: 440, h: 600, color: "#28583B" },

      // Elevator Platform (M4 solved): Transports to canopy
      ...(isM4Done
        ? [{ x: 2360, y: world.elevatorY, w: 90, h: 18, color: "#F59E0B", isElevator: true }]
        : [{ x: 2360, y: 550, w: 90, h: 600, color: "#28583B" }]),

      // High Treetop Canopy over Willow Pond
      { x: 2460, y: 310, w: 180, h: 22, color: "#1C4834" },
      { x: 2680, y: 250, w: 160, h: 22, color: "#1C4834" },

      // Ground 5: Willow Pond Bank (x: 2500 to 2800)
      { x: 2500, y: 550, w: 300, h: 600, color: "#1C4834" },

      // Drawbridge (M5 solved): Lowers across the river
      ...(isM5Done
        ? [{ x: 2800, y: 550, w: 140, h: 24, color: "#B45309", isBridge: true }]
        : []),

      // Ground 6: Grand Sanctuary Plaza (x: 2940 to 3500)
      { x: 2940, y: 550, w: 560, h: 600, color: "#163E2B" },
      { x: 3080, y: 470, w: 140, h: 22, color: "#163E2B" }
    ];

    // Collisions with Platforms
    p.isGrounded = false;
    for (const plat of platforms) {
      if (
        p.x + p.width > plat.x &&
        p.x < plat.x + plat.w &&
        p.y + p.height >= plat.y &&
        p.y + p.height <= plat.y + 24 &&
        p.vy >= 0
      ) {
        p.y = plat.y - p.height;
        p.vy = 0;
        p.isGrounded = true;
        p.isJumping = false;

        // Mushroom bounce pad interaction!
        if (plat.isMushroom) {
          p.vy = -680;
          p.squash = 0.5;
          p.stretch = 1.5;
          soundEngine.playTone(580, 0.15, "sine", 0.15);
        }
      }
    }

    // Physical Barrier 1: Broken Clinic Bridge at x=475 (Blocks crossing until M1 is solved)
    if (!isM1Done) {
      const clinicBarrierX = 475;
      if (p.x + p.width > clinicBarrierX && p.x < clinicBarrierX + 25 && p.y + p.height > 480) {
        p.x = clinicBarrierX - p.width;
        p.vx = 0;
      }
    }

    // Physical Barrier 2: Meadow Turnstile Gate at x=1530 (Blocks crossing until M3 is solved)
    if (!isM3Done) {
      const gateX = 1530;
      if (p.x + p.width > gateX && p.x < gateX + 25 && p.y + p.height > 440) {
        p.x = gateX - p.width;
        p.vx = 0;
      }
    }

    // Physical Barrier 3: Willow River Drawbridge at x=2795 (Blocks crossing until M5 is solved)
    if (!isM5Done) {
      const riverBarrierX = 2795;
      if (p.x + p.width > riverBarrierX && p.x < riverBarrierX + 25 && p.y + p.height > 420) {
        p.x = riverBarrierX - p.width;
        p.vx = 0;
      }
    }

    // World Bounds
    if (p.x < 10) p.x = 10;
    if (p.x > world.width - p.width - 20) p.x = world.width - p.width - 20;

    // Falling into a trench or river: Safe respawn at zone checkpoint!
    if (p.y > 670) {
      const checkpoints = {
        1: 100,
        2: 620,
        3: 1560,
        4: 2000,
        5: 2520,
        6: 2960
      };
      p.x = checkpoints[activeMissionNum] || Math.max(80, p.x - 240);
      p.y = 550 - p.height;
      p.vy = 0;
      p.vx = 0;
      p.isGrounded = true;
      soundEngine.playTone(220, 0.2, "sawtooth", 0.08);
    }

    // Collectibles Collision (Acorns)
    for (const acorn of world.acorns) {
      if (!acorn.collected) {
        const dx = p.x + p.width / 2 - acorn.x;
        const dy = p.y + p.height / 2 - acorn.y;
        if (Math.hypot(dx, dy) < 28) {
          acorn.collected = true;
          onCollectAcorn?.();
          soundEngine.playTone(740, 0.1, "sine", 0.12);

          // Add sparkles
          for (let s = 0; s < 6; s++) {
            world.sparkles.push({
              x: acorn.x,
              y: acorn.y,
              vx: (Math.random() - 0.5) * 60,
              vy: (Math.random() - 0.5) * 60,
              life: 0.5
            });
          }
        }
      }
    }

    // Update Sparkles
    for (let i = world.sparkles.length - 1; i >= 0; i--) {
      const s = world.sparkles[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= dt;
      if (s.life <= 0) world.sparkles.splice(i, 1);
    }

    // Update Ambient Particles (Leaves & Fireflies)
    for (const pt of world.particles) {
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.phase += dt * 2;
      if (pt.y > 680) {
        pt.y = 10;
        pt.x = Math.random() * world.width;
      }
      if (pt.x < 0) pt.x = world.width;
      if (pt.x > world.width) pt.x = 0;
    }

    // Check Nearest Mission Station
    const stations = [
      { num: 1, x: 420, y: 550, name: "Rusty the Fox", habitat: "Intake Clinic", task: "Diagnose Vitals (if/else)", barrierDesc: "Extend Broken Bridge" },
      { num: 2, x: 960, y: 550, name: "Pip the Hare", habitat: "Mossy Burrow", task: "Assign Habitat (if/elif/else)", barrierDesc: "Sprout Spring Mushroom" },
      { num: 3, x: 1500, y: 550, name: "Fern the Fawn", habitat: "Sunlit Meadow", task: "Pasture Clearance (and)", barrierDesc: "Unlock Turnstile Gate" },
      { num: 4, x: 2120, y: 550, name: "Bramble the Hedgehog", habitat: "Storehouse", task: "Evening Feeding (for loop)", barrierDesc: "Power Canopy Elevator" },
      { num: 5, x: 2700, y: 550, name: "Hoot the Owl", habitat: "Willow Pond", task: "Pantry Stockpile (lists)", barrierDesc: "Lower River Drawbridge" },
      { num: 6, x: 3250, y: 550, name: "Ancient Portal", habitat: "Grand Plaza", task: "Final Sanctuary Audit", barrierDesc: "Activate Portal to Level 2" },
    ];

    let foundStation = null;
    for (const st of stations) {
      const distX = Math.abs(p.x + p.width / 2 - st.x);
      const distY = Math.abs(p.y + p.height / 2 - st.y);
      if (distX < 90 && distY < 160) {
        foundStation = st;
        break;
      }
    }

    world.nearStation = foundStation;
    if ((foundStation?.num || null) !== prevStationNumRef.current) {
      prevStationNumRef.current = foundStation?.num || null;
      setActiveStationPrompt(foundStation);
    }

    // If player pressed E / interact key near a station, open challenge!
    if (interactReq && foundStation) {
      keysRef.current.interact = false;
      touchControlsRef.current.interact = false;
      onOpenChallenge(foundStation.num);
    }

    // Portal Level 2 trigger when reached after M6
    if (isM6Done && p.x > 3240) {
      onLevelComplete?.();
    }

    // Camera Lerp with smooth horizontal & high canopy vertical tracking
    const cWidth = canvasRef.current ? canvasRef.current.width : 1280;
    const cHeight = canvasRef.current ? canvasRef.current.height : 720;

    // Horizontal tracking
    const targetCamX = p.x - cWidth * 0.42;
    const clampedCamX = Math.max(0, Math.min(world.width - cWidth, targetCamX));
    world.camera.x += (clampedCamX - world.camera.x) * 6 * dt;

    // Vertical tracking: Keep ground (y=550) positioned comfortably at ~70-74% of the viewport height
    const groundCamY = 550 - cHeight * 0.72;
    const playerCamY = p.y - cHeight * 0.60;
    const targetCamY = p.y < 420 ? Math.min(groundCamY, playerCamY) : groundCamY;
    world.camera.y += (targetCamY - (world.camera.y || 0)) * 6 * dt;
  };

  // Canvas Rendering Function
  const render = (ctx, canvas) => {
    const world = worldRef.current;
    const camX = world.camera.x;
    const p = world.player;
    const width = canvas.width;
    const height = canvas.height;

    const isM1Done = completedMissions.includes(1);
    const isM2Done = completedMissions.includes(2);
    const isM3Done = completedMissions.includes(3);
    const isM4Done = completedMissions.includes(4);
    const isM5Done = completedMissions.includes(5);
    const isM6Done = completedMissions.includes(6);

    ctx.clearRect(0, 0, width, height);

    // 1. Parallax Sky Gradient (Layer 0)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, "#081A12");
    skyGrad.addColorStop(0.6, "#123324");
    skyGrad.addColorStop(1, "#1B4731");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Distant mountain silhouettes (Layer 1: 0.1x parallax)
    ctx.save();
    ctx.fillStyle = "#0A2418";
    ctx.beginPath();
    for (let x = 0; x <= width; x += 120) {
      const worldX = x + camX * 0.1;
      const mY = height * 0.45 + Math.sin(worldX * 0.003) * 50 + Math.cos(worldX * 0.007) * 30;
      if (x === 0) ctx.moveTo(x, mY);
      else ctx.lineTo(x, mY);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();
    ctx.restore();

    // Mid-ground trees and misty hills (Layer 2: 0.35x parallax)
    ctx.save();
    ctx.fillStyle = "#103522";
    ctx.beginPath();
    for (let x = 0; x <= width; x += 80) {
      const worldX = x + camX * 0.35;
      const hY = height * 0.65 + Math.sin(worldX * 0.005) * 40;
      if (x === 0) ctx.moveTo(x, hY);
      else ctx.lineTo(x, hY);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    // Midground giant tree trunks
    for (let i = 0; i < 20; i++) {
      const trunkWorldX = 80 + i * 190;
      const screenX = trunkWorldX - camX * 0.35;
      if (screenX > -80 && screenX < width + 80) {
        ctx.fillStyle = "#0E2B1C";
        ctx.fillRect(screenX, height * 0.3, 34, height * 0.7);
        // Foliage blob
        ctx.fillStyle = "#143C27";
        ctx.beginPath();
        ctx.arc(screenX + 17, height * 0.3, 60, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // 2. Main Gameplay World (Layer 3: 1.0x scroll)
    const camY = world.camera.y || 0;
    ctx.save();
    ctx.translate(-camX, -camY);

    // River Water in Trenches (x: 480 to 600, x: 2800 to 2940)
    const waterGrad = ctx.createLinearGradient(0, 560, 0, 720);
    waterGrad.addColorStop(0, isM6Done ? "#38BDF8" : "#1B525B");
    waterGrad.addColorStop(1, "#0A262C");
    ctx.fillStyle = waterGrad;
    ctx.fillRect(480, 570, 120, 300);
    ctx.fillRect(2800, 570, 140, 300);

    // Water surface ripple animation
    const waveOffset = Math.sin(performance.now() * 0.003) * 3;
    ctx.fillStyle = isM6Done ? "rgba(224, 242, 254, 0.4)" : "rgba(82, 183, 136, 0.25)";
    ctx.fillRect(480, 568 + waveOffset, 120, 4);
    ctx.fillRect(2800, 568 + waveOffset, 140, 4);

    // Broken Bridge at Clinic Trench when Mission 1 is not solved
    if (!isM1Done) {
      // Broken jagged planks hanging into trench
      ctx.fillStyle = "#78350F";
      ctx.fillRect(475, 550, 25, 14);
      ctx.fillRect(490, 560, 10, 35);
      ctx.fillRect(590, 550, 15, 14);
      ctx.fillRect(585, 560, 10, 30);

      // Warning Barrier Post at x: 475
      ctx.fillStyle = "#B45309";
      ctx.fillRect(470, 470, 10, 80);
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(455, 480, 40, 16);
      ctx.fillStyle = "#78350F";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("BRIDGE OUT", 475, 492);

      // Warning sign text above
      ctx.fillStyle = "#FCA5A5";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("⚠️ Retracted: Diagnose Vitals at Clinic", 475, 460);
    }

    // Platforms rendering
    const renderPlatforms = [
      // Ground 1: Clinic Zone (h: 600 ensures deep ground coverage)
      { x: 0, y: 550, w: 480, h: 600, topColor: "#3E7C55", bodyColor: "#173A25", zoneName: "Intake Clinic" },
      // Bridge 1 (M1 solved): Sturdy wooden bridge across trench
      ...(isM1Done
        ? [{ x: 480, y: 550, w: 120, h: 22, topColor: "#CA8A04", bodyColor: "#78350F", isWood: true }]
        : []),
      // Ground 2: Burrow Glade
      { x: 600, y: 550, w: 500, h: 600, topColor: "#3E7C55", bodyColor: "#173A25", zoneName: "Mossy Burrow" },
      // Ledges in Burrow
      { x: 740, y: 460, w: 140, h: 22, topColor: "#4E8C65", bodyColor: "#1E4730" },
      { x: 920, y: 390, w: 150, h: 22, topColor: "#4E8C65", bodyColor: "#1E4730" },

      // Mushroom Spring Pad (M2 solved)
      ...(isM2Done
        ? [{ x: 1110, y: 540, w: 50, h: 20, isMushroom: true }]
        : [{ x: 1100, y: 550, w: 90, h: 600, topColor: "#2F5F40", bodyColor: "#132D1E" }]),

      // Stepping stones over Meadow Stream
      { x: 1220, y: 450, w: 110, h: 20, topColor: "#5B9670", bodyColor: "#224A32" },
      { x: 1360, y: 380, w: 110, h: 20, topColor: "#5B9670", bodyColor: "#224A32" },

      // Ground 3: Sunlit Meadow
      { x: 1480, y: 550, w: 500, h: 600, topColor: "#52B788", bodyColor: "#1E4730", zoneName: "Sunlit Meadow" },
      { x: 1650, y: 440, w: 130, h: 20, topColor: "#62C496", bodyColor: "#255338" },
      { x: 1810, y: 370, w: 120, h: 20, topColor: "#62C496", bodyColor: "#255338" },

      // Ground 4: Central Storehouse
      { x: 1980, y: 550, w: 440, h: 600, topColor: "#3E7C55", bodyColor: "#173A25", zoneName: "Central Storehouse" },

      // Elevator Platform (M4 solved): Transports to canopy
      ...(isM4Done
        ? [{ x: 2360, y: world.elevatorY, w: 90, h: 18, topColor: "#FBBF24", bodyColor: "#92400E", isWood: true, isElevatorPlat: true }]
        : [{ x: 2360, y: 550, w: 90, h: 600, topColor: "#3E7C55", bodyColor: "#173A25" }]),

      // High Treetop Canopy over Willow Pond
      { x: 2460, y: 310, w: 180, h: 22, topColor: "#3E7C55", bodyColor: "#173A25" },
      { x: 2680, y: 250, w: 160, h: 22, topColor: "#3E7C55", bodyColor: "#173A25" },

      // Ground 5: Willow Pond
      { x: 2500, y: 550, w: 300, h: 600, topColor: "#2F5F40", bodyColor: "#132D1E", zoneName: "Willow Pond" },

      // Drawbridge (M5 solved): Lowers flat across the river
      ...(isM5Done
        ? [{ x: 2800, y: 550, w: 140, h: 22, topColor: "#CA8A04", bodyColor: "#78350F", isWood: true }]
        : []),

      // Ground 6: Grand Sanctuary Plaza
      { x: 2940, y: 550, w: 560, h: 600, topColor: "#2A5B3E", bodyColor: "#102E1E", zoneName: "Grand Plaza & Portal" },
      { x: 3080, y: 470, w: 140, h: 22, topColor: "#3E7C55", bodyColor: "#173A25" }
    ];

    for (const plat of renderPlatforms) {
      if (plat.isMushroom) {
        // Red with white polka dots bouncy mushroom
        ctx.fillStyle = "#EF4444";
        ctx.beginPath();
        ctx.ellipse(plat.x + plat.w / 2, plat.y + 12, plat.w / 2, 14, 0, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(plat.x + plat.w / 2 - 12, plat.y + 4, 3, 0, Math.PI * 2);
        ctx.arc(plat.x + plat.w / 2 + 10, plat.y + 5, 3.5, 0, Math.PI * 2);
        ctx.arc(plat.x + plat.w / 2, plat.y + 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Stem
        ctx.fillStyle = "#E2E8F0";
        ctx.fillRect(plat.x + plat.w / 2 - 6, plat.y + 8, 12, 14);
      } else {
        // Solid or wooden platform
        ctx.fillStyle = plat.bodyColor;
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

        // Grass/moss top cap
        ctx.fillStyle = plat.topColor;
        ctx.fillRect(plat.x, plat.y, plat.w, 6);

        // Elevator cable lines when elevator is active
        if (plat.isElevatorPlat) {
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(plat.x + 10, 220);
          ctx.lineTo(plat.x + 10, plat.y);
          ctx.moveTo(plat.x + plat.w - 10, 220);
          ctx.lineTo(plat.x + plat.w - 10, plat.y);
          ctx.stroke();
        }

        // Optional zone sign on start of major ground segments
        if (plat.zoneName) {
          ctx.fillStyle = "rgba(10, 26, 18, 0.85)";
          ctx.fillRect(plat.x + 20, plat.y + 24, 150, 26);
          ctx.strokeStyle = "#52B788";
          ctx.lineWidth = 1;
          ctx.strokeRect(plat.x + 20, plat.y + 24, 150, 26);
          ctx.fillStyle = "#E8F8EE";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText(plat.zoneName, plat.x + 30, plat.y + 41);
        }
      }
    }

    // Dormant Mushroom bud when Mission 2 not solved
    if (!isM2Done) {
      ctx.fillStyle = "#8B5CF6";
      ctx.beginPath();
      ctx.arc(1135, 545, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#DDD6FE";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Dormant Sprout", 1135, 532);
    }

    // Turnstile Gate at Meadow (x: 1530): Closed if M3 not solved, Open if solved!
    if (!isM3Done) {
      ctx.fillStyle = "#B45309";
      ctx.fillRect(1530, 440, 16, 110);
      ctx.fillStyle = "#78350F";
      ctx.fillRect(1515, 450, 46, 12);
      ctx.fillRect(1515, 480, 46, 12);
      ctx.fillRect(1515, 510, 46, 12);
      // Lock icon badge
      ctx.fillStyle = "#D97706";
      ctx.beginPath();
      ctx.arc(1538, 470, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("🔒", 1533, 473);

      ctx.fillStyle = "#FCA5A5";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Meadow Gate Sealed", 1538, 430);
    } else {
      // Swung open turnstile with flowers!
      ctx.fillStyle = "#B45309";
      ctx.fillRect(1530, 440, 16, 110);
      ctx.fillStyle = "#CA8A04";
      ctx.fillRect(1530, 450, 40, 10);
      // Blooming meadow wildflowers
      for (let fx = 1550; fx < 1920; fx += 35) {
        ctx.fillStyle = fx % 2 === 0 ? "#FCD34D" : "#F472B6";
        ctx.beginPath();
        ctx.arc(fx, 546, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Raised Drawbridge at Willow River when Mission 5 not solved
    if (!isM5Done) {
      // Upright drawbridge plank blocking passage
      ctx.fillStyle = "#78350F";
      ctx.fillRect(2795, 430, 16, 120);
      ctx.fillStyle = "#B45309";
      ctx.fillRect(2790, 440, 26, 12);
      ctx.fillRect(2790, 480, 26, 12);
      ctx.fillRect(2790, 520, 26, 12);

      // Chains to winch tower
      ctx.strokeStyle = "#9CA3AF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(2795, 440);
      ctx.lineTo(2760, 400);
      ctx.stroke();

      ctx.fillStyle = "#FCA5A5";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Drawbridge Raised (Audit Pantry)", 2795, 418);
    } else {
      // Winter supply crates stacked neatly near bank
      ctx.fillStyle = "#B45309";
      ctx.fillRect(2740, 532, 18, 18);
      ctx.fillRect(2760, 532, 18, 18);
      ctx.fillRect(2750, 514, 18, 18);
      ctx.fillStyle = "#EF4444";
      ctx.beginPath();
      ctx.arc(2749, 541, 3, 0, Math.PI * 2);
      ctx.arc(2769, 541, 3, 0, Math.PI * 2);
      ctx.arc(2759, 523, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Objective Floating Indicator above current mission station
    const currentGoalStation = stations.find(s => s.num === activeMissionNum);
    if (currentGoalStation && !completedMissions.includes(activeMissionNum)) {
      const bobY = Math.sin(performance.now() * 0.006) * 6;
      ctx.save();
      ctx.translate(currentGoalStation.x, currentGoalStation.y - 75 + bobY);
      // Floating Diamond Badge
      ctx.fillStyle = "#22C55E";
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(12, -6);
      ctx.lineTo(0, 6);
      ctx.lineTo(-12, -6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#052E16";
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GOAL", 0, -4);

      // Pointer Arrow
      ctx.fillStyle = "#FDE047";
      ctx.beginPath();
      ctx.moveTo(-6, 9);
      ctx.lineTo(6, 9);
      ctx.lineTo(0, 16);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Collectibles (Golden Acorns)
    const bounceY = Math.sin(performance.now() * 0.005) * 5;
    for (const acorn of world.acorns) {
      if (!acorn.collected) {
        ctx.save();
        ctx.translate(acorn.x, acorn.y + bounceY);
        // Golden acorn body
        ctx.fillStyle = "#F59E0B";
        ctx.beginPath();
        ctx.ellipse(0, 4, 7, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cap
        ctx.fillStyle = "#78350F";
        ctx.beginPath();
        ctx.ellipse(0, -3, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Stem
        ctx.strokeStyle = "#78350F";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(2, -10);
        ctx.stroke();
        // Sparkle glint
        ctx.fillStyle = "#FEF3C7";
        ctx.beginPath();
        ctx.arc(-2, 1, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Sparkles
    for (const s of world.sparkles) {
      ctx.fillStyle = `rgba(254, 240, 138, ${s.life * 2})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ambient Particles (Leaves & Fireflies)
    for (const pt of world.particles) {
      if (pt.type === "leaf") {
        ctx.fillStyle = "#D97706";
        ctx.beginPath();
        ctx.ellipse(pt.x, pt.y, pt.size, pt.size * 0.5, pt.phase, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const glow = (Math.sin(pt.phase) + 1) * 0.5;
        ctx.fillStyle = `rgba(253, 224, 71, ${glow * 0.8})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ============================================================
    // DRAW ANIMAL MISSION STATIONS
    // ============================================================

    // Station 1: Rusty the Fox (x: 420)
    drawFoxStation(ctx, 420, 550, isM1Done);

    // Station 2: Pip the Hare (x: 960)
    drawRabbitStation(ctx, 960, 550, isM2Done);

    // Station 3: Fern the Fawn (x: 1500)
    drawDeerStation(ctx, 1500, 550, isM3Done);

    // Station 4: Bramble the Hedgehog (x: 2120)
    drawHedgehogStation(ctx, 2120, 550, isM4Done);

    // Station 5: Hoot the Owl (x: 2680)
    drawOwlStation(ctx, 2680, 250, isM5Done);

    // Station 6: Ancient Portal (x: 3250)
    drawAncientPortal(ctx, 3250, 550, isM6Done);

    // ============================================================
    // DRAW PLAYER CHARACTER WITH SQUASH & STRETCH
    // ============================================================
    ctx.save();
    const centerX = p.x + p.width / 2;
    const centerY = p.y + p.height / 2;
    ctx.translate(centerX, centerY);

    const safeFacing = p.facing === -1 ? -1 : 1;
    const safeSquash = Number.isFinite(p.squash) && p.squash > 0 ? p.squash : 1;
    const safeStretch = Number.isFinite(p.stretch) && p.stretch > 0 ? p.stretch : 1;
    ctx.scale(safeFacing * safeSquash, safeStretch);

    // 0. Soft shadow under player on platform
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.ellipse(0, 24, 15, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Running leg animation
    const isMoving = p.isGrounded && Math.abs(p.vx) > 10;
    const legOffset = isMoving ? Math.sin(p.animTime) * 6 : 0;

    // 2. Explorer Backpack on back
    ctx.fillStyle = "#B45309"; // Saddle brown pack
    drawRoundedRect(ctx, -18, -12, 8, 20, 3);
    ctx.fill();
    ctx.fillStyle = "#F59E0B"; // Bedroll on top
    drawRoundedRect(ctx, -19, -16, 9, 5, 2);
    ctx.fill();

    // 3. Legs & Trousers
    ctx.fillStyle = "#1E293B"; // Dark slate trousers
    drawRoundedRect(ctx, -10, 10, 8, 12 + legOffset, 2);
    ctx.fill();
    drawRoundedRect(ctx, 2, 10, 8, 12 - legOffset, 2);
    ctx.fill();

    // Boots with golden buckles
    ctx.fillStyle = "#78350F";
    drawRoundedRect(ctx, -11, 20 + legOffset, 10, 6, 2);
    ctx.fill();
    drawRoundedRect(ctx, 1, 20 - legOffset, 10, 6, 2);
    ctx.fill();
    ctx.fillStyle = "#FDE047";
    ctx.fillRect(-7, 21 + legOffset, 3, 2);
    ctx.fillRect(5, 21 - legOffset, 3, 2);

    // 4. Body: Vibrant Forest Ranger Explorer Tunic
    ctx.fillStyle = "#15803D"; // Vibrant Ranger Emerald Green
    drawRoundedRect(ctx, -13, -15, 26, 26, 6);
    ctx.fill();

    // Inner Cream Lapels
    ctx.fillStyle = "#F0FDF4";
    ctx.beginPath();
    ctx.moveTo(-4, -15);
    ctx.lineTo(0, -6);
    ctx.lineTo(4, -15);
    ctx.closePath();
    ctx.fill();

    // Leather Belt & Golden Buckle
    ctx.fillStyle = "#78350F";
    ctx.fillRect(-13, 5, 26, 5);
    ctx.fillStyle = "#FBBF24";
    ctx.fillRect(-3, 4.5, 6, 6);
    ctx.fillStyle = "#78350F";
    ctx.fillRect(-1.5, 6, 3, 3);

    // Golden Tunic Buttons
    ctx.fillStyle = "#FBBF24";
    ctx.beginPath();
    ctx.arc(0, -10, 1.8, 0, Math.PI * 2);
    ctx.arc(0, -4, 1.8, 0, Math.PI * 2);
    ctx.arc(0, 1, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 5. Scarf / Bandana: Bright Gold with Fluttering Tail
    ctx.fillStyle = "#F59E0B";
    drawRoundedRect(ctx, -9, -15, 18, 5, 2);
    ctx.fill();
    const scarfFlutter = isMoving ? Math.sin(p.animTime * 1.5) * 4 : 0;
    ctx.beginPath();
    ctx.moveTo(-9, -14);
    ctx.lineTo(-17, -10 + scarfFlutter);
    ctx.lineTo(-10, -9);
    ctx.closePath();
    ctx.fill();

    // 6. Head & Face (Warm Peach)
    ctx.fillStyle = "#FED7AA";
    ctx.beginPath();
    ctx.arc(0, -22, 11, 0, Math.PI * 2);
    ctx.fill();

    // Rosy Cheeks
    ctx.fillStyle = "rgba(248, 113, 113, 0.4)";
    ctx.beginPath();
    ctx.arc(5, -20, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes: White Sclera with Deep Pupils & Highlight
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(4, -22, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0F172A";
    ctx.beginPath();
    ctx.arc(5, -22, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(5.6, -22.6, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Smiling Mouth
    ctx.strokeStyle = "#9A3412";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(4, -18, 3, 0.2, Math.PI * 0.8);
    ctx.stroke();

    // 7. Ranger Explorer Hat
    // Brim
    ctx.fillStyle = "#1E3A2F";
    ctx.beginPath();
    ctx.ellipse(0, -28, 15, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Crown
    ctx.fillStyle = "#2D6A4F";
    drawRoundedRect(ctx, -10, -38, 20, 12, 4);
    ctx.fill();
    // Hat Ribbon & Badge
    ctx.fillStyle = "#52B788";
    ctx.fillRect(-10, -30, 20, 3.5);
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.arc(0, -28.5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // Restore scale before text to prevent mirrored text

    // 8. Player Identifier Indicator Pill above head ("ALEX")
    ctx.save();
    ctx.translate(centerX, centerY);
    const pillY = -42 + (p.isGrounded ? Math.sin(p.animTime * 0.8) * 1.5 : 0);
    ctx.fillStyle = "rgba(11, 36, 24, 0.85)";
    drawRoundedRect(ctx, -20, pillY - 14, 40, 15, 7.5);
    ctx.fill();
    ctx.strokeStyle = "#52B788";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, -20, pillY - 14, 40, 15, 7.5);
    ctx.stroke();

    ctx.fillStyle = "#86EFAC";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ALEX", 0, pillY - 6.5);

    // Little downward arrow
    ctx.fillStyle = "#52B788";
    ctx.beginPath();
    ctx.moveTo(-3, pillY + 1);
    ctx.lineTo(3, pillY + 1);
    ctx.lineTo(0, pillY + 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    ctx.restore(); // Exit camera space
  };

  // Helper drawing functions for animal stations
  const drawFoxStation = (ctx, x, y, isDone) => {
    ctx.save();
    ctx.translate(x, y);
    // Clinic Tent / Station Roof
    ctx.fillStyle = "#2D6A4F";
    ctx.beginPath();
    ctx.moveTo(-35, 0);
    ctx.lineTo(0, -60);
    ctx.lineTo(35, 0);
    ctx.closePath();
    ctx.fill();
    // Cross
    ctx.fillStyle = isDone ? "#52B788" : "#EF4444";
    ctx.fillRect(-3, -40, 6, 16);
    ctx.fillRect(-8, -35, 16, 6);

    // Fox Character
    ctx.fillStyle = "#E85D26";
    ctx.beginPath();
    ctx.arc(0, -14, 12, 0, Math.PI * 2);
    ctx.fill();
    // Ears
    ctx.fillStyle = "#E85D26";
    ctx.beginPath();
    ctx.moveTo(-10, -22);
    ctx.lineTo(-5, -34);
    ctx.lineTo(0, -24);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(10, -22);
    ctx.lineTo(5, -34);
    ctx.lineTo(0, -24);
    ctx.fill();
    // White muzzle
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(0, -10, 5, 0, Math.PI * 2);
    ctx.fill();
    // Status text
    ctx.fillStyle = isDone ? "#86EFAC" : "#FCA5A5";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(isDone ? "Rusty (Healed!)" : "Rusty (Vitals: 42)", 0, -68);
    ctx.restore();
  };

  const drawRabbitStation = (ctx, x, y, isDone) => {
    ctx.save();
    ctx.translate(x, y);
    // Burrow Mound Arch
    ctx.fillStyle = "#3E6B4A";
    ctx.beginPath();
    ctx.arc(0, 0, 36, Math.PI, 0);
    ctx.fill();
    // Burrow hole
    ctx.fillStyle = "#142B1D";
    ctx.beginPath();
    ctx.arc(0, 0, 18, Math.PI, 0);
    ctx.fill();
    // Rabbit Ears
    ctx.fillStyle = "#D3C5B4";
    ctx.beginPath();
    ctx.ellipse(-6, -26, 4, 12, -0.1, 0, Math.PI * 2);
    ctx.ellipse(6, -26, 4, 12, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(0, -14, 10, 0, Math.PI * 2);
    ctx.fill();
    // Status text
    ctx.fillStyle = isDone ? "#86EFAC" : "#FDE68A";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(isDone ? "Pip (Burrow Settled)" : "Pip (Awaiting Habitat)", 0, -42);
    ctx.restore();
  };

  const drawDeerStation = (ctx, x, y, isDone) => {
    ctx.save();
    ctx.translate(x, y);
    // Fawn character
    ctx.fillStyle = "#A86F3E";
    drawRoundedRect(ctx, -12, -28, 24, 20, 6);
    ctx.fill();
    // Head & spots
    ctx.beginPath();
    ctx.arc(10, -34, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(-4, -22, 2, 0, Math.PI * 2);
    ctx.arc(2, -24, 2, 0, Math.PI * 2);
    ctx.fill();
    // Status text
    ctx.fillStyle = isDone ? "#86EFAC" : "#FDE68A";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(isDone ? "Fern (In Meadow)" : "Fern (At Turnstile)", 0, -48);
    ctx.restore();
  };

  const drawHedgehogStation = (ctx, x, y, isDone) => {
    ctx.save();
    ctx.translate(x, y);
    // Hedgehog spikes
    ctx.fillStyle = "#78350F";
    ctx.beginPath();
    ctx.arc(0, -12, 14, Math.PI, 0);
    ctx.fill();
    // Food bowls if done
    if (isDone) {
      ctx.fillStyle = "#CA8A04";
      ctx.fillRect(-18, -4, 12, 4);
      ctx.fillRect(6, -4, 12, 4);
      ctx.fillStyle = "#EF4444";
      ctx.arc(-12, -5, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    // Status text
    ctx.fillStyle = isDone ? "#86EFAC" : "#FDE68A";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(isDone ? "Bramble (Fed!)" : "Bramble (Hungry)", 0, -28);
    ctx.restore();
  };

  const drawOwlStation = (ctx, x, y, isDone) => {
    ctx.save();
    ctx.translate(x, y);
    // Owl body & eyes
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.ellipse(0, -14, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    // White eye rings
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(-5, -18, 5, 0, Math.PI * 2);
    ctx.arc(5, -18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(-4, -18, 2, 0, Math.PI * 2);
    ctx.arc(4, -18, 2, 0, Math.PI * 2);
    ctx.fill();
    // Status text
    ctx.fillStyle = isDone ? "#86EFAC" : "#FDE68A";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(isDone ? "Hoot (Stockpile 85)" : "Hoot (Audit Crates)", 0, -36);
    ctx.restore();
  };

  const drawAncientPortal = (ctx, x, y, isDone) => {
    ctx.save();
    ctx.translate(x, y);
    // Stone Pillars
    ctx.fillStyle = "#4B5563";
    ctx.fillRect(-35, -120, 18, 120);
    ctx.fillRect(17, -120, 18, 120);
    // Arch header
    ctx.fillRect(-45, -135, 90, 20);

    if (isDone) {
      // Swirling celestial emerald portal!
      const time = performance.now() * 0.003;
      const portalGrad = ctx.createRadialGradient(0, -65, 5, 0, -65, 40);
      portalGrad.addColorStop(0, "#FDE047");
      portalGrad.addColorStop(0.4, "#22C55E");
      portalGrad.addColorStop(1, "rgba(5, 46, 22, 0)");
      ctx.fillStyle = portalGrad;
      ctx.beginPath();
      ctx.ellipse(0, -65, 30 + Math.sin(time) * 4, 48 + Math.cos(time) * 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#86EFAC";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PORTAL TO LEVEL 2 OPEN", 0, -145);
    } else {
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Ancient Forest Portal (Locked)", 0, -145);
    }
    ctx.restore();
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none bg-[#081710]">
      <canvas ref={canvasRef} className="w-full h-full block cursor-default" />

      {/* Floating Interaction Prompt when standing near animal station */}
      {activeStationPrompt && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-30 bg-[#0F2D1F]/95 border-2 border-[#52B788] rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-md flex items-center gap-3.5 text-white animate-scaleUp">
          <div className="w-9 h-9 rounded-xl bg-[#2D6A4F] border border-[#52B788] flex items-center justify-center font-bold text-xs">
            M{activeStationPrompt.num}
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-2">
              <span>{activeStationPrompt.name}</span>
              <span className="text-[10px] text-[#A7F3D0] font-mono">({activeStationPrompt.habitat})</span>
            </div>
            <div className="text-[11px] text-[#86EFAC] font-medium">
              {activeStationPrompt.task}
            </div>
          </div>
          <button
            onClick={() => onOpenChallenge(activeStationPrompt.num)}
            className="py-1.5 px-3.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#052E16] font-black text-xs shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer ml-1"
          >
            Press E or Click to Code
          </button>
        </div>
      )}

      {/* Touch / On-Screen Controls for mobile, tablets, laptops */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2.5">
        <button
          onMouseDown={() => (touchControlsRef.current.left = true)}
          onMouseUp={() => (touchControlsRef.current.left = false)}
          onTouchStart={() => (touchControlsRef.current.left = true)}
          onTouchEnd={() => (touchControlsRef.current.left = false)}
          className="w-13 h-13 rounded-2xl bg-[#0F2D1F]/80 border border-[#2D6A4F] text-white flex items-center justify-center text-lg active:bg-[#2D6A4F] shadow-lg touch-none"
        >
          ◀
        </button>
        <button
          onMouseDown={() => (touchControlsRef.current.right = true)}
          onMouseUp={() => (touchControlsRef.current.right = false)}
          onTouchStart={() => (touchControlsRef.current.right = true)}
          onTouchEnd={() => (touchControlsRef.current.right = false)}
          className="w-13 h-13 rounded-2xl bg-[#0F2D1F]/80 border border-[#2D6A4F] text-white flex items-center justify-center text-lg active:bg-[#2D6A4F] shadow-lg touch-none"
        >
          ▶
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2.5">
        <button
          onMouseDown={() => (touchControlsRef.current.jump = true)}
          onMouseUp={() => (touchControlsRef.current.jump = false)}
          onTouchStart={() => (touchControlsRef.current.jump = true)}
          onTouchEnd={() => (touchControlsRef.current.jump = false)}
          className="w-14 h-14 rounded-2xl bg-[#2D6A4F]/90 border-2 border-[#52B788] text-white font-bold text-xs flex items-center justify-center active:scale-95 shadow-lg touch-none"
        >
          JUMP
        </button>
        {activeStationPrompt && (
          <button
            onClick={() => onOpenChallenge(activeStationPrompt.num)}
            className="w-14 h-14 rounded-2xl bg-[#22C55E] text-[#052E16] font-black text-xs flex items-center justify-center active:scale-95 shadow-lg"
          >
            CODE
          </button>
        )}
      </div>
    </div>
  );
}
