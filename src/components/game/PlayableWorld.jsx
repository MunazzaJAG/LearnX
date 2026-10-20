import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { soundEngine } from "../../utils/audio";

export function PlayableWorld({ onComplete, biomeKey = "ocean", levelTitle = "Undersea Reef 🌊", levelSubtitle = "Help restore the Python stars to awaken the portal!" }) {
  const gameContainer = useRef(null);
  const gameRef = useRef(null);
  const completionFired = useRef(false);

  const controlsRef = useRef({
    left: false,
    right: false,
    jump: false,
  });

  // Global window listeners so movement controls NEVER get stuck on blur, pointer cancel, or mouse release
  useEffect(() => {
    const handleGlobalRelease = () => {
      controlsRef.current.left = false;
      controlsRef.current.right = false;
      controlsRef.current.jump = false;
      const scene = gameRef.current?.scene.getScene("LearnXWorld");
      if (scene?.input?.keyboard) {
        scene.input.keyboard.resetKeys();
      }
    };

    window.addEventListener("pointerup", handleGlobalRelease);
    window.addEventListener("pointercancel", handleGlobalRelease);
    window.addEventListener("blur", handleGlobalRelease);
    window.addEventListener("mouseup", handleGlobalRelease);
    window.addEventListener("touchend", handleGlobalRelease);
    window.addEventListener("touchcancel", handleGlobalRelease);

    return () => {
      window.removeEventListener("pointerup", handleGlobalRelease);
      window.removeEventListener("pointercancel", handleGlobalRelease);
      window.removeEventListener("blur", handleGlobalRelease);
      window.removeEventListener("mouseup", handleGlobalRelease);
      window.removeEventListener("touchend", handleGlobalRelease);
      window.removeEventListener("touchcancel", handleGlobalRelease);
    };
  }, []);

  const [collected, setCollected] = useState(0);
  const [gameStatus, setGameStatus] = useState("Collect all 6 stars and reach the portal!");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questionFeedback, setQuestionFeedback] = useState("");

  const oceanQuestions = [
    {
      question: "What does print() do in Python?",
      options: ["Displays output", "Repeats a loop", "Creates a variable"],
      answer: "Displays output",
      explanation: "print() displays text or values on the screen.",
    },
    {
      question: 'What is the output of print("Hello")?',
      options: ["Hello", "print", "Error"],
      answer: "Hello",
      explanation: 'print("Hello") displays Hello on the screen.',
    },
    {
      question: "Which symbol assigns a value to a variable?",
      options: ["=", "==", "+"],
      answer: "=",
      explanation: "The = symbol assigns a value, such as score = 10.",
    },
    {
      question: "What is the value of score after score = 10?",
      options: ["10", '"score"', "0"],
      answer: "10",
      explanation: "The variable score stores the number 10.",
    },
    {
      question: "Which data type represents True or False?",
      options: ["Boolean", "String", "Integer"],
      answer: "Boolean",
      explanation: "Boolean values are True and False.",
    },
    {
      question: "Which keyword starts a condition in Python?",
      options: ["if", "print", "input"],
      answer: "if",
      explanation: "The if keyword lets Python make decisions.",
    },
  ];

  const forestQuestions = [
    {
      question: "Which function converts text input into an integer in Python?",
      options: ["int()", "str()", "float()"],
      answer: "int()",
      explanation: "int() converts text numbers like '10' into the integer 10.",
    },
    {
      question: "What does input() return in Python?",
      options: ["Always a string", "Always an integer", "Always a boolean"],
      answer: "Always a string",
      explanation: "input() pauses the program and always returns the user's typed response as a string.",
    },
    {
      question: "Which operator checks if two values are equal in Python?",
      options: ["==", "=", "!="],
      answer: "==",
      explanation: "The == operator tests equality, while = is used for variable assignment.",
    },
    {
      question: "What does the expression 85 >= 70 evaluate to?",
      options: ["True", "False", "None"],
      answer: "True",
      explanation: "85 is greater than or equal to 70, so it evaluates to True.",
    },
    {
      question: "Which keyword introduces an alternative branch in an if-statement?",
      options: ["elif", "while", "for"],
      answer: "elif",
      explanation: "elif (short for else if) tests an additional condition if the preceding if was False.",
    },
    {
      question: "What does range(5) generate when iterated in a loop?",
      options: ["0, 1, 2, 3, 4", "1, 2, 3, 4, 5", "5, 5, 5, 5, 5"],
      answer: "0, 1, 2, 3, 4",
      explanation: "range(5) produces numbers from 0 up to 4 (5 numbers in total).",
    },
  ];

  const pythonQuestions = biomeKey === "forest" ? forestQuestions : oceanQuestions;

  const handlePythonAnswer = (option) => {
    const scene = gameRef.current?.scene.getScene("LearnXWorld");

    if (!scene || !scene.pendingStar || !activeQuestion) return;

    if (option !== activeQuestion.answer) {
      soundEngine.playIncorrect();
      setQuestionFeedback(
        "Not quite! " + activeQuestion.explanation + " Try again."
      );
      return;
    }

    soundEngine.playHint();
    scene.pendingStar.destroy();
    scene.pendingStar = null;
    scene.questionOpen = false;
    scene.starsCollected += 1;

    setCollected(scene.starsCollected);
    setActiveQuestion(null);
    setQuestionFeedback("");

    if (scene.starsCollected === 6) {
      scene.updateMessage(
        "Amazing! All 6 Python questions solved. Reach the purple portal to unlock Level 2!"
      );
    } else {
      scene.updateMessage(
        `Correct! Python star earned: ${scene.starsCollected}/6.`
      );
    }

    scene.physics.resume();
  };

  useEffect(() => {
    if (!gameContainer.current) return;

    let game;

    class LearnXScene extends Phaser.Scene {
      constructor() {
        super("LearnXWorld");
        this.onLevelComplete = onComplete;
        this.starsCollected = 0;
        this.levelComplete = false;
        this.isRespawning = false;
        this.completionFired = completionFired;
      }

      create() {
        this.controlsRef = controlsRef;
        this.starsCollected = 0;
        this.levelComplete = false;
        this.isRespawning = false;
        this.questionOpen = false;
        this.pendingStar = null;
        setCollected(0);
        setGameStatus("Collect all 6 stars and reach the portal!");

        const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
        const WORLD_WIDTH = 1600;
        const WORLD_HEIGHT = 480;
        const TOTAL_STARS = 6;

        // Reset stuck inputs when game window loses focus
        this.game.events.on(Phaser.Core.Events.BLUR, () => {
          this.controlsRef.current.left = false;
          this.controlsRef.current.right = false;
          this.controlsRef.current.jump = false;
          if (this.input?.keyboard) {
            this.input.keyboard.resetKeys();
          }
        });

        // Left, right, and top collide with world bounds; bottom allows player to fall into trench for failure detection
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT + 150, true, true, true, false);
        this.physics.world.checkCollision.down = false;
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        const isForest = biomeKey === "forest";
        this.cameras.main.setBackgroundColor(isForest ? "#EBF5EE" : "#EAF7F0");

        // Soft hills / dunes
        const hills = this.add.graphics();
        hills.fillStyle(isForest ? 0xC8E6C9 : 0xD7EEDC, 1);
        hills.fillEllipse(250, 445, 650, 210);
        hills.fillStyle(isForest ? 0xA5D6A7 : 0xBDE3CF, 1);
        hills.fillEllipse(800, 460, 850, 200);
        hills.fillStyle(isForest ? 0x81C784 : 0xCDE9D7, 1);
        hills.fillEllipse(1390, 445, 650, 220);

        // Undersea hazard trench / river drop-off between platforms (x=480 to x=1120)
        const trench = this.add.graphics();
        trench.fillStyle(isForest ? 0x2D4A3E : 0x0C3B35, 0.4);
        trench.fillRect(480, 435, 640, 45);
        for (let tx = 510; tx < 1100; tx += 45) {
          trench.fillStyle(isForest ? 0x52B788 : 0x56CFE1, 0.6);
          trench.fillCircle(tx, 455, (tx % 3) + 2);
        }

        // Floating clouds / pollen bubbles
        for (let i = 0; i < 10; i++) {
          const x = 100 + i * 155;
          const y = 55 + (i % 3) * 35;
          const cloud = this.add.graphics();
          cloud.fillStyle(0xFFFFFF, 0.85);
          cloud.fillCircle(x, y, 18);
          cloud.fillCircle(x + 22, y - 10, 24);
          cloud.fillCircle(x + 48, y, 17);
        }

        // Draw cute player texture
        const character = this.add.graphics();
        character.fillStyle(0xFFFFFF, 1);
        character.fillRoundedRect(5, 4, 34, 42, 12);
        character.fillStyle(isForest ? 0x52B788 : 0x8BC9A5, 1);
        character.fillRoundedRect(7, 19, 30, 26, 9);
        character.fillStyle(0xF2C8A5, 1);
        character.fillCircle(22, 13, 12);
        character.fillStyle(0x394D43, 1);
        character.fillCircle(18, 12, 1.8);
        character.fillCircle(26, 12, 1.8);
        character.fillStyle(0xE98E88, 1);
        character.fillCircle(22, 17, 2);
        character.generateTexture("learnx-player", 44, 50);
        character.destroy();

        this.player = this.physics.add.sprite(90, 350, "learnx-player");
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(5);
        this.player.body.setSize(28, 44);
        this.player.body.setOffset(8, 5);
        this.player.body.setGravityY(800);

        // Platforms
        const platformData = [
          [240, 410, 480, 45],
          [330, 340, 145, 18],
          [520, 285, 145, 18],
          [715, 345, 150, 18],
          [925, 285, 155, 18],
          [1125, 340, 150, 18],
          [1360, 410, 480, 45]
        ];

        this.platforms = [];

        platformData.forEach(([x, y, width, height]) => {
          const platform = this.add.rectangle(
            x, y, width, height, isForest ? 0x40916C : 0x8BC9A5
          );
          platform.setStrokeStyle(2, isForest ? 0x2D6A4F : 0x6EAD8A);
          this.physics.add.existing(platform, true);
          this.platforms.push(platform);
          this.physics.add.collider(this.player, platform);
        });

        // Decorative flowers / coral sprouts
        for (let x = 40; x < WORLD_WIDTH; x += 115) {
          const flowerY = 390;
          this.add.circle(x, flowerY, 5, 0xF5A8B8);
          this.add.circle(x - 5, flowerY + 3, 4, 0xF9D98B);
          this.add.circle(x + 5, flowerY + 3, 4, 0xF9D98B);
        }

        // Collectible stars
        const starPositions = [
          [180, 350],
          [330, 290],
          [520, 235],
          [715, 295],
          [925, 235],
          [1125, 290]
        ];

        this.stars = starPositions.map(([x, y]) => {
          const star = this.add.star(x, y, 5, 9, 18, 0xF4C95D);
          star.setStrokeStyle(2, 0xE7AD3B);

          this.physics.add.existing(star);
          star.body.setAllowGravity(false);
          star.body.setImmovable(true);

          this.physics.add.overlap(this.player, star, () => {
            if (!star.active || this.questionOpen || this.levelComplete) return;

            this.questionOpen = true;
            this.pendingStar = star;
            this.player.setVelocity(0, 0);
            this.physics.pause();

            soundEngine.playClick();
            setQuestionFeedback("");
            setActiveQuestion(pythonQuestions[this.starsCollected]);
          });

          return star;
        });

        // Portal at the end
        this.portal = this.add.rectangle(
          1460, 360, 48, 82, 0xA78BFA
        );
        this.portal.setStrokeStyle(5, 0x8B70D5);
        this.add.circle(1460, 360, 14, 0xF7E7FF);
        this.physics.add.existing(this.portal, true);

        this.physics.add.overlap(this.player, this.portal, () => {
          if (this.levelComplete || this.completionFired.current) return;

          if (this.starsCollected >= TOTAL_STARS) {
            this.levelComplete = true;
            this.completionFired.current = true;
            this.player.setVelocity(0, 0);
            this.player.body.enable = false;
            soundEngine.playVictory();
            this.updateMessage("World restored! ✨ Level 1 complete! Unlocking Level 2...");
            if (this.onLevelComplete) this.onLevelComplete();
          } else {
            soundEngine.playIncorrect();
            this.updateMessage(
              `Collect ${TOTAL_STARS - this.starsCollected} more star(s) first!`
            );
          }
        });

        // Camera follows the player
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys("W,A,S,D");

        // Web Audio sync
        this.sound.context?.resume?.().catch?.(() => {});

        // In-game instructions HUD with crystal-clear DPR resolution
        this.add.text(18, 18, "UNDERSEA REEF · LEVEL 1", {
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          fontStyle: "bold",
          color: "#365B49",
          backgroundColor: "#FFFFFFE6",
          padding: { x: 12, y: 8 },
          resolution: dpr
        }).setScrollFactor(0).setDepth(10);

        this.add.text(18, 62, "Move: WASD / Arrows     Jump: SPACE / ↑ / W", {
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          color: "#426B57",
          backgroundColor: "#FFFFFFD9",
          padding: { x: 10, y: 6 },
          resolution: dpr
        }).setScrollFactor(0).setDepth(10);

        this.counterText = this.add.text(880, 18, "⭐ 0 / 6", {
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          fontStyle: "bold",
          color: "#76551A",
          backgroundColor: "#FFF5D8",
          padding: { x: 12, y: 8 },
          resolution: dpr
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(10);

        this.updateMessage = (message) => {
          setGameStatus(message);
          this.counterText.setText(`⭐ ${this.starsCollected} / ${TOTAL_STARS}`);
        };
      }

      update() {
        if (this.levelComplete || !this.player?.body) return;

        // Out of bounds fall detection (clean failure with smooth respawn & stars preserved)
        if (!this.isRespawning && this.player.y > 448) {
          this.isRespawning = true;
          this.player.setVelocity(0, 0);
          this.player.body.enable = false;
          soundEngine.playIncorrect();
          this.updateMessage("Watch your step! You fell into the undersea trench. Respawning...");

          this.tweens.add({
            targets: this.player,
            alpha: 0.2,
            duration: 200,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
              if (!this.player || !this.player.body) return;
              this.player.setPosition(90, 330);
              this.player.setVelocity(0, 0);
              this.player.setAlpha(1);
              this.player.body.enable = true;
              this.isRespawning = false;
              this.updateMessage(`Back on the reef! Stars gathered: ${this.starsCollected}/6.`);
            }
          });
          return;
        }

        const left =
          this.cursors.left.isDown ||
          this.keys.A.isDown ||
          this.controlsRef.current.left;

        const right =
          this.cursors.right.isDown ||
          this.keys.D.isDown ||
          this.controlsRef.current.right;

        const jumpPressed =
          Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
          Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
          Phaser.Input.Keyboard.JustDown(this.keys.W) ||
          this.controlsRef.current.jump;

        this.controlsRef.current.jump = false;
        const speed = 230;

        if (left) {
          this.player.setVelocityX(-speed);
          this.player.setFlipX(true);
        } else if (right) {
          this.player.setVelocityX(speed);
          this.player.setFlipX(false);
        } else {
          this.player.setVelocityX(0);
        }

        if (
          jumpPressed &&
          (this.player.body.blocked.down || this.player.body.touching.down)
        ) {
          this.player.setVelocityY(-440);
        }
      }
    }

    game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: 900,
      height: 480,
      resolution: Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2),
      render: {
        antialias: true,
        roundPixels: true,
        pixelArt: false
      },
      backgroundColor: "#EAF7F0",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      input: {
        keyboard: true,
        mouse: true,
        touch: true
      },
      scene: LearnXScene
    });
    gameRef.current = game;

    return () => {
      if (game) {
        gameRef.current = null;
        game.destroy(true);
        game = null;
      }
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {activeQuestion && (
        <div className="rounded-2xl border-2 border-[#10b981] bg-white p-5 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-widest text-[#10b981]">
              Python Learning Challenge · Star {collected + 1} of 6
            </p>
            <span className="text-xs font-bold text-[#556F61] bg-[#EBF5EE] px-3 py-1 rounded-full">
              Answer to collect star
            </span>
          </div>

          <h3 className="mt-2 text-xl font-black text-[#172E26]">
            {activeQuestion.question}
          </h3>

          <div className="mt-4 grid gap-3">
            {activeQuestion.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handlePythonAnswer(option)}
                className="rounded-xl border border-[#CFE5D4] bg-[#F7FCF8] p-3 text-left font-semibold text-[#172E26] hover:bg-[#E8F5EE] hover:border-[#2A6B53] transition-all cursor-pointer"
              >
                {option}
              </button>
            ))}
          </div>

          {questionFeedback && (
            <p className="mt-3 rounded-xl bg-[#FFF5D8] border border-[#F6E5B8] p-3 text-sm font-medium text-[#76551A] animate-shake">
              {questionFeedback}
            </p>
          )}
        </div>
      )}

      <div className="rounded-3xl border border-[#D8EBDD] bg-[#F7FCF8] p-4 sm:p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2A6B53]">
              LearnX · Level 1
            </p>
            <h2 className="text-2xl font-black text-[#172E26] mt-1">
              {levelTitle}
            </h2>
            <p className="text-sm text-[#5D7267] mt-1">
              {levelSubtitle}
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[#DEECE3] px-4 py-3 text-sm font-black text-[#2A6B53] shadow-sm">
            ⭐ {collected} / 6 Stars Collected
          </div>
        </div>

        <div
          ref={gameContainer}
          className="w-full overflow-hidden rounded-2xl border border-[#CFE5D4] bg-[#EAF7F0] shadow-inner flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>canvas]:rounded-2xl"
          style={{ minHeight: 340 }}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Move left"
              onPointerDown={(e) => {
                e.preventDefault();
                controlsRef.current.left = true;
              }}
              onPointerUp={() => {
                controlsRef.current.left = false;
              }}
              onPointerLeave={() => {
                controlsRef.current.left = false;
              }}
              onPointerCancel={() => {
                controlsRef.current.left = false;
              }}
              className="rounded-xl border border-[#CFE5D4] bg-white px-5 py-3 font-bold text-[#172E26] select-none hover:bg-[#F2F6F3] shadow-sm active:scale-95 transition-all cursor-pointer"
              style={{ touchAction: "none" }}
            >
              ◀ Left
            </button>

            <button
              type="button"
              aria-label="Move right"
              onPointerDown={(e) => {
                e.preventDefault();
                controlsRef.current.right = true;
              }}
              onPointerUp={() => {
                controlsRef.current.right = false;
              }}
              onPointerLeave={() => {
                controlsRef.current.right = false;
              }}
              onPointerCancel={() => {
                controlsRef.current.right = false;
              }}
              className="rounded-xl border border-[#CFE5D4] bg-white px-5 py-3 font-bold text-[#172E26] select-none hover:bg-[#F2F6F3] shadow-sm active:scale-95 transition-all cursor-pointer"
              style={{ touchAction: "none" }}
            >
              Right ▶
            </button>

            <button
              type="button"
              aria-label="Jump"
              onPointerDown={(e) => {
                e.preventDefault();
                controlsRef.current.jump = true;
              }}
              className="rounded-xl border border-[#2A6B53] bg-[#E8F5EE] hover:bg-[#D5EADB] px-6 py-3 font-black text-[#172E26] select-none shadow-sm active:scale-95 transition-all cursor-pointer"
              style={{ touchAction: "none" }}
            >
              JUMP ↑
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              controlsRef.current.left = false;
              controlsRef.current.right = false;
              controlsRef.current.jump = false;
              completionFired.current = false;
              setCollected(0);
              setActiveQuestion(null);
              setQuestionFeedback("");
              setGameStatus("Collect all 6 stars and reach the portal!");

              const scene = gameRef.current?.scene.getScene("LearnXWorld");

              if (scene?.scene.isActive()) {
                scene.scene.restart();
              }
            }}
            className="rounded-xl bg-[#2A6B53] hover:bg-[#205541] px-5 py-3 font-bold text-white shadow-soft transition-all cursor-pointer active:scale-95"
          >
            ↻ Restart Game
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-white border border-[#DEECE3] px-4 py-3 text-sm text-[#4A6458] shadow-sm">
          <span className="font-bold text-[#172E26]">Your mission: </span>
          {gameStatus}
        </div>

        <p className="text-xs text-[#789181] mt-3">
          Tip: Use keyboard WASD or Arrow Keys to move and SPACE to jump. Answer all 6 Python questions correctly to collect the stars and reach the purple portal to unlock Level 2.
        </p>
      </div>
    </div>
  );
}
