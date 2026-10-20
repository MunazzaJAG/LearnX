/**
 * LearnX — Undersea Reef Complete Curriculum & Behavioral Validation Engine
 * 
 * First Level Progression (6 Playable Sublevels):
 * 1. Current Control (Values, variables, assignment, data types, mini-submarine velocity)
 * 2. Coral Rescue (Strings, f-strings, restoration catalyst command formatting)
 * 3. The Abyss Gate (Comparisons, booleans, if/elif/else conditional access logic)
 * 4. Jellyfish Herding (for loops, range, iteration, coordinated creature steering)
 * 5. Pearl Scanner (Lists, indexing, collections, membership, filtering pearls)
 * 6. The Reef Guardian (Debugging, exception handling, functions, grand ecosystem restoration)
 */

export const UNDERSEA_LEVEL_1_SUBLEVELS = [
  {
    id: "l1_s1",
    num: 1,
    title: "Current Control",
    landmark: "Reef Station Delta",
    targetCoords: [0, 0, 5],
    concept: "Variables and Values (print, strings, integers, floats, assignment)",
    objective: "Restore power to Reef Station Delta by assigning the station name and power level in variables, then transmitting the status.",
    story: "Reef Station Delta is dark and dormant beneath the shallows. The main console needs Python instructions to assign its station identity and energize the power grid.",
    lesson: `Welcome Explorer! A **variable** is like a labeled container in computer memory that stores information.

You create a variable using the assignment operator \`=\`:
\`\`\`python
station_name = "Station Delta"
power_level = 85
\`\`\`
- The **variable name** is on the left.
- The **value** is on the right.

Python recognizes different kinds of values:
- **Strings** (text in quotes): \`"Station Delta"\`
- **Integers** (whole numbers): \`85\`
- **Floats** (decimals): \`92.5\`

The \`print()\` function displays what is stored inside your variables:
\`\`\`python
print("Station:", station_name)
print("Power:", power_level)
\`\`\`

**Your Mission:**
Use the matching puzzle and prediction module to inspect how variables work, then enter the code in the terminal to activate Reef Station Delta!`,
    miniGame: {
      type: "variable_matching_and_prediction",
      matchingPuzzle: {
        title: "Console Memory: Match Variables to Values",
        instructions: "Click a variable on the left, then click its corresponding value on the right to pair them into memory:",
        pairs: [
          { id: "p1", varName: "station_name", valueDisplay: '"Station Delta"', type: "string", description: "Text in quotes (string)" },
          { id: "p2", varName: "power_level", valueDisplay: "85", type: "integer", description: "Whole number (integer)" },
          { id: "p3", varName: "light_intensity", valueDisplay: "92.5", type: "float", description: "Decimal value (float)" }
        ]
      },
      prediction: {
        title: "Telemetry Predictor: What Will the Terminal Display?",
        codeSnippet: `station_name = "Station Delta"\npower_level = 85\nprint("ONLINE:", station_name, power_level)`,
        question: "When Python runs this code, what will appear on the terminal screen?",
        options: [
          { id: "opt_a", text: "ONLINE: Station Delta 85", correct: true, feedback: "Spot on! In Python, print() outputs the values stored inside variables separated by spaces." },
          { id: "opt_b", text: "station_name power_level", correct: false, feedback: "Remember: variable names represent their stored contents, not the literal variable name words." },
          { id: "opt_c", text: 'ONLINE: "station_name"', correct: false, feedback: "Quotes are only used to define string literals in code; print() outputs the actual stored value." }
        ]
      }
    },
    starterCode: `# Sublevel 1: Restore Power to Reef Station Delta
# ------------------------------------------------------------------
# In Python, variables store values using the '=' operator.
# Example: station_name = "Station Delta"
# ------------------------------------------------------------------

# TODO 1: Store your station's name in quotes:
station_name = "Station Delta"

# TODO 2: Assign power_level a number of at least 50 (e.g. 85) to energize the grid
power_level = 0

# TODO 3: Transmit telemetry using print() to power up the station
print("Station:", station_name)
print("Power:", power_level)
`,
    visualBlocks: [
      { label: 'Set station_name = "Station Delta"', code: 'station_name = "Station Delta"' },
      { label: 'Set power_level = 85', code: 'power_level = 85' },
      { label: 'Print Station Telemetry', code: 'print("Station:", station_name)\nprint("Power:", power_level)' }
    ],
    hints: [
      "Assign the power_level variable by writing: power_level = 85 (or any number >= 50).",
      "Ensure station_name is in quotes like: station_name = \"Station Delta\".",
      "Use print(\"Station:\", station_name) and print(\"Power:\", power_level) to send the activation signal."
    ],
    rewardXP: 60,
    equipmentUnlock: {
      id: "explorer_visor",
      name: "Explorer Visor",
      type: "helmet",
      icon: "🤿",
      description: "Pressurized diving mask with integrated telemetry HUD."
    },
    restorationDelta: 16,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "No variables detected. Define 'station_name' and 'power_level' and run again." };
      }

      const name = scope.station_name || scope.name;
      const power = scope.power_level !== undefined ? scope.power_level : (scope.thrust !== undefined ? scope.thrust : scope.power);

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return {
          passed: false,
          message: "Variable 'station_name' must be a text string in quotes, e.g.: station_name = \"Station Delta\""
        };
      }

      if (typeof power !== "number") {
        return {
          passed: false,
          message: "Variable 'power_level' must be a number (e.g. power_level = 85)."
        };
      }

      if (power < 50) {
        return {
          passed: false,
          message: `Power level is at ${power}%. The station grid requires at least 50% power to activate life-support lights. Increase power_level to at least 50!`
        };
      }

      const outputText = result.output || "";
      if (!outputText.toLowerCase().includes(name.toLowerCase())) {
        return {
          passed: false,
          message: `Make sure to print the station name using: print("Station:", station_name)`
        };
      }

      return {
        passed: true,
        message: `Reef Station Delta successfully powered! Grid energized at ${power}% by ${name}. Station floodlights activate and consoles come online!`,
        actionPayload: { stationPowered: true, stationName: name, power }
      };
    }
  },
  {
    id: "l1_s2",
    num: 2,
    title: "Coral Rescue",
    landmark: "Bleached Shallows Terminal",
    targetCoords: [-25, 0, 15],
    concept: "Strings, string concatenation, and f-string formatting (f\"...\")",
    objective: "Program the restoration terminal to parse researcher requests and generate formatted biocatalyst synthesis commands.",
    lesson: `Coral polyps require specific nutrient mixtures to recover from bleaching.
In Python, strings can be combined with \`+\` or formatted cleanly using **f-strings**:
\`\`\`python
species = "Acropora"
depth = 35
command = f"RESTORE: {species} @ {depth}m"
print(command)
\`\`\`
The terminal verifies that your command includes the species, nutrient catalyst, and depth before deploying the restorative beam.`,
    starterCode: `# Coral Rescue Terminal
# Mission: Synthesize a biocatalyst restoration command string!

species = "Staghorn"
depth = 35
catalyst = "Bio-Phyto-X"

# TODO: Create a variable named 'command' using an f-string or string concatenation.
# Format must include species, catalyst, and depth.
# Example: f"RESTORE: {species} [{catalyst}] @ {depth}m"
command = ""

# Print the final command to dispatch the restoration beam
print(command)
`,
    visualBlocks: [
      { label: 'Format Command with f-string', code: 'command = f"RESTORE: {species} [{catalyst}] @ {depth}m"' },
      { label: 'Print Command', code: 'print(command)' }
    ],
    hints: [
      "Use an f-string like f'RESTORE: {species} [{catalyst}] @ {depth}m' or concatenation with '+'.",
      "Ensure the command contains the species ('Staghorn'), catalyst ('Bio-Phyto-X'), and depth (35).",
      "Call print(command) so the terminal transmits the instructions to the repair emitter."
    ],
    rewardXP: 70,
    equipmentUnlock: {
      id: "wrist_scanner",
      name: "Bio-Scanner MK-I",
      type: "gadget",
      icon: "📡",
      description: "Wrist-mounted environmental analyzer capable of reading coral health frequencies."
    },
    restorationDelta: 16,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      const { species, depth, catalyst, command } = scope || {};
      const outputText = result.output || "";

      // Validate presence of required data in scope or output
      const hasSpecies = (typeof species === "string" && species.length > 0) || outputText.toLowerCase().includes("staghorn");
      const hasCatalyst = (typeof catalyst === "string" && catalyst.length > 0) || outputText.toLowerCase().includes("bio-phyto");
      const hasDepth = typeof depth === "number" || outputText.includes("35");

      if (!hasSpecies || !hasCatalyst || !hasDepth) {
        return { passed: false, message: "Please define species, catalyst, and depth variables." };
      }

      // Check that command or output is formatted with the details
      const cmdText = String(command || outputText);
      const isFormatted = cmdText.includes("RESTORE") || (cmdText.includes("Staghorn") && cmdText.includes("Bio-Phyto"));

      if (!isFormatted) {
        return { passed: false, message: "Format the command string to include species, catalyst, and depth (e.g. f'RESTORE: {species} [{catalyst}] @ {depth}m'), then print() it." };
      }

      return {
        passed: true,
        message: `Command verified: "${cmdText.trim()}". The restorative catalyst beam fires, reviving the bleached coral into vibrant magenta and cyan!`,
        actionPayload: { species, depth, catalyst }
      };
    }
  },
  {
    id: "l1_s3",
    num: 3,
    title: "The Abyss Gate",
    landmark: "Ancient Hydraulic Portal",
    targetCoords: [30, 0, 30],
    concept: "Comparison operators (>, <, ==, >=), Booleans, if / elif / else statements",
    objective: "Write conditional access logic to disengage the massive hydraulic portal locks based on real-time pressure and oxygen sensors.",
    lesson: `The Abyss Gate protects the deep ocean canyon. It will only open when safety conditions are met.
In Python, conditional statements use \`if\`, \`elif\`, and \`else\`:
\`\`\`python
if pressure_psi <= 110 and oxygen_pct >= 50:
    gate_status = "OPEN"
else:
    gate_status = "LOCKED"
\`\`\`
Comparison operators: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`.
Logical operators: \`and\`, \`or\`, \`not\`.`,
    starterCode: `# The Abyss Gate Access Control
# Live sensor readings from the portal telemetry:
pressure_psi = 95
oxygen_pct = 75
power_grid = 88

# Default gate state (Locked)
gate_status = "LOCKED"
status_code = 403

# TODO: Write an if statement to open the gate when:
# - pressure_psi is less than or equal to 110 AND
# - oxygen_pct is greater than or equal to 50 AND
# - power_grid is greater than or equal to 50
#
# If conditions are met:
#     Set gate_status = "OPEN"
#     Set status_code = 200

# Write your if-condition below:


print("Gate Status:", gate_status)
print("Status Code:", status_code)
`,
    visualBlocks: [
      { label: 'Check pressure, oxygen, and power', code: 'if pressure_psi <= 110 and oxygen_pct >= 50 and power_grid >= 50:\n    gate_status = "OPEN"\n    status_code = 200' },
      { label: 'Print Gate Status', code: 'print("Gate Status:", gate_status)' }
    ],
    hints: [
      "Use 'if pressure_psi <= 110 and oxygen_pct >= 50 and power_grid >= 50:' to check conditions.",
      "Set gate_status = 'OPEN' and status_code = 200 inside the if-block (indented 4 spaces).",
      "Print gate_status to trigger the hydraulic release mechanism."
    ],
    rewardXP: 80,
    equipmentUnlock: {
      id: "hydro_thrusters",
      name: "Hydro-Jet Boosters",
      type: "fins",
      icon: "🚀",
      description: "Dual compact waterjet turbines mounted to flippers, unlocking the Speed Boost ability."
    },
    restorationDelta: 16,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      const { gate_status } = scope || {};
      const outputText = result.output || "";

      if (gate_status !== "OPEN" && !outputText.includes("OPEN")) {
        return { passed: false, message: `Gate condition was not met. gate_status is '${gate_status}', expected 'OPEN'. Ensure your if condition evaluates to True.` };
      }
      return {
        passed: true,
        message: "Access granted! Heavy hydraulic lock pins disengage with a loud metallic clank. The Abyss Gate doors slide open with a massive burst of bubbles!",
        actionPayload: { gateOpen: true }
      };
    }
  },
  {
    id: "l1_s4",
    num: 4,
    title: "Jellyfish Herding",
    landmark: "Luminescent Sanctuary Cavern",
    targetCoords: [40, 0, -10],
    concept: "for loops, range(), iteration, repeated actions, and accumulator variables",
    objective: "Write a for-loop to pulse guidance frequencies across the entire jellyfish cluster and herd them safely into the sanctuary.",
    lesson: `Repetitive tasks are handled with **for loops** in Python.
The \`range(start, stop)\` function generates a sequence of numbers:
\`\`\`python
for j in range(1, 9):
    print(f"Guiding jellyfish #{j}")
\`\`\`
Use an accumulator variable like \`herded += 1\` inside the loop to track total progress.`,
    starterCode: `# Jellyfish Herding Protocol
# Emit acoustic guidance pulses to herd all 8 jellyfish into the sanctuary!

total_jellyfish = 8
herded_count = 0
base_frequency = 440  # Hz

print("Broadcasting acoustic guidance signals...")

# TODO: Write a for loop that iterates through all jellyfish from 1 to total_jellyfish (inclusive).
# Inside the loop:
#   1. Increment herded_count by 1
#   2. Compute current_freq = base_frequency + (j * 15)
#   3. Print a guidance status message
#
# Hint: use 'for j in range(1, total_jellyfish + 1):'


print("Total herded successfully:", herded_count)
`,
    visualBlocks: [
      { label: 'for j in range(1, total_jellyfish + 1):', code: 'for j in range(1, total_jellyfish + 1):\n    herded_count += 1\n    print(f"Jellyfish {j} guided into sanctuary")' },
      { label: 'Print Total Herded', code: 'print("Total herded:", herded_count)' }
    ],
    hints: [
      "A for loop is written as: for j in range(1, total_jellyfish + 1):",
      "Indent 4 spaces inside the loop and increment herded_count by 1 each iteration (herded_count += 1).",
      "Verify that herded_count equals total_jellyfish (8) at the end of the loop."
    ],
    rewardXP: 90,
    equipmentUnlock: {
      id: "biolum_suit",
      name: "Lumina-Weave Diving Suit",
      type: "suit",
      icon: "✨",
      description: "Wetsuit threaded with bioluminescent micro-filaments that attract deep-sea creatures."
    },
    restorationDelta: 16,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      const { total_jellyfish, herded_count } = scope || {};
      const total = typeof total_jellyfish === "number" ? total_jellyfish : 8;
      const count = typeof herded_count === "number"
        ? herded_count
        : (typeof scope?.herded === "number"
          ? scope.herded
          : (typeof scope?.count === "number" ? scope.count : null));
      const outputText = result.output || "";
      const matchesOutput = outputText.includes("8") && (outputText.toLowerCase().includes("jelly") || outputText.toLowerCase().includes("herd"));

      if (count === total || (count === null && matchesOutput)) {
        return {
          passed: true,
          message: `All ${total} glowing jellyfish guided into the sanctuary! The cavern walls sparkle with living bioluminescence.`,
          actionPayload: { herdedCount: total }
        };
      }
      return {
        passed: false,
        message: `Herded count is ${count ?? 0}, expected ${total}. Ensure your for loop runs 'for j in range(1, total_jellyfish + 1):' and increments herded_count += 1.`
      };
    }
  },
  {
    id: "l1_s5",
    num: 5,
    title: "Pearl Scanner",
    landmark: "Abyssal Pearl Trench",
    targetCoords: [-35, 0, -20],
    concept: "Lists, indexing (list[0]), iteration, membership testing ('in'), and .append()",
    objective: "Scan sea floor clusters to locate rare Black Pearls and catalog deep-sea relics.",
    lesson: `**Lists** store ordered collections of items inside square brackets \`[]\`:
\`\`\`python
treasures = ["sea_shell", "black_pearl", "sea_glass"]
first_item = treasures[0]
has_pearl = "black_pearl" in treasures
\`\`\`
Lists can grow with \`.append(new_item)\` and their length is given by \`len(treasures)\`.`,
    starterCode: `# Pearl Scanner Protocol
# Sea floor survey reading from abyssal trench:
scan_results = ["white_shell", "black_pearl", "sea_glass", "black_pearl", "old_anchor", "black_pearl"]

valuable_pearls = []

# TODO: Iterate over scan_results using a for loop.
# If an item equals "black_pearl", append it to the valuable_pearls list!
# Hint:
# for item in scan_results:
#     if item == "black_pearl":
#         valuable_pearls.append(item)


pearl_count = len(valuable_pearls)
first_detected = valuable_pearls[0] if len(valuable_pearls) > 0 else "None"

print("Valuable Pearls Found:", valuable_pearls)
print("Total Pearls:", pearl_count)
print("First item:", first_detected)
`,
    visualBlocks: [
      { label: 'Loop and append black_pearl', code: 'for item in scan_results:\n    if item == "black_pearl":\n        valuable_pearls.append(item)' },
      { label: 'Print Pearls Count', code: 'print("Found:", valuable_pearls)\nprint("Count:", len(valuable_pearls))' }
    ],
    hints: [
      "Use a list like valuable_pearls = [] to store the pearls.",
      "Use .append(item) inside an if-statement to add matched items to the list.",
      "len(valuable_pearls) gives the total number of pearls collected."
    ],
    rewardXP: 100,
    equipmentUnlock: {
      id: "pearl_detector",
      name: "Mineral Spectrograph",
      type: "gadget",
      icon: "💎",
      description: "Upgrades your HUD with real-time mineral detection and pearl highlights."
    },
    restorationDelta: 16,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      const { valuable_pearls, pearl_count } = scope || {};
      if (!Array.isArray(valuable_pearls)) {
        return { passed: false, message: "valuable_pearls must be a Python list." };
      }
      if (typeof pearl_count !== "number" || pearl_count < 2) {
        return { passed: false, message: `pearl_count is ${pearl_count || 0}. Use a for loop to scan scan_results and append all 'black_pearl' items into valuable_pearls.` };
      }
      return {
        passed: true,
        message: `Scanned and recovered ${pearl_count} rare black pearls from the trench bed! Pearls added to explorer inventory.`,
        actionPayload: { pearls: pearl_count }
      };
    }
  },
  {
    id: "l1_s6",
    num: 6,
    title: "Reef Guardian",
    landmark: "Lair of the Reef Guardian",
    targetCoords: [0, 0, -45],
    concept: "Debugging, exception handling (try / except ZeroDivisionError), functions, and master restoration",
    objective: "Diagnose and repair the malfunctioning ancient mechanical Reef Guardian whose core crashed due to an unhandled zero-division error.",
    lesson: `Even great code encounters unexpected runtime errors. Python handles them gracefully using \`try\` and \`except\`:
\`\`\`python
try:
    result = 1000 // signal
except ZeroDivisionError:
    result = 10
    print("Zero frequency safely handled!")
\`\`\`
Catching errors prevents your program (and the Guardian's robotic AI) from crashing!
Wrap the calculation in \`try/except\` and return the restored telemetry.`,
    starterCode: `# The Reef Guardian Diagnostics
# CRITICAL ALERT: The Guardian's neural processor crashes when encountering a 0-frequency pulse!
# Safely handle the ZeroDivisionError so the calibration loop completes.

telemetry_signals = [100, 50, 0, 75, 0, 90]
calibrated_signals = []

for raw_signal in telemetry_signals:
    # TODO: Wrap the calculation in a try / except ZeroDivisionError block!
    # When raw_signal is 0, division by zero raises ZeroDivisionError.
    # In the except block, append a safe fallback frequency (10) instead.
    
    # Current unhandled calculation (CRASHES on 0!):
    amplified = 1000 // raw_signal
    calibrated_signals.append(amplified)

guardian_repaired = len(calibrated_signals) == len(telemetry_signals)
print("Calibrated Signals:", calibrated_signals)
print("Guardian AI Restored:", guardian_repaired)
`,
    visualBlocks: [
      { label: 'try / except ZeroDivisionError', code: '    try:\n        amplified = 1000 // raw_signal\n        calibrated_signals.append(amplified)\n    except ZeroDivisionError:\n        calibrated_signals.append(10)' },
      { label: 'Verify guardian_repaired == True', code: 'guardian_repaired = len(calibrated_signals) == len(telemetry_signals)\nprint("Restored:", guardian_repaired)' }
    ],
    hints: [
      "Wrap the division inside a 'try:' block.",
      "Catch zeros with 'except ZeroDivisionError:' and append a safe fallback value (e.g. 10).",
      "calibrated_signals must have the same length as telemetry_signals (6 items)."
    ],
    rewardXP: 150,
    equipmentUnlock: {
      id: "guardian_core",
      name: "Guardian Matrix Crown",
      type: "helmet",
      icon: "👑",
      description: "Abyssal crowned diving helmet pulsing with benevolent Guardian energy."
    },
    badgeUnlock: {
      id: "reef_initiate",
      name: "Guardian of the Reef",
      icon: "🔱",
      description: "Mastered all six sublevels of Undersea Reef Level 1 and restored the ancient Guardian."
    },
    restorationDelta: 20,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      const { guardian_repaired, calibrated_signals, telemetry_signals } = scope || {};
      if (!Array.isArray(calibrated_signals) || !Array.isArray(telemetry_signals)) {
        return { passed: false, message: "calibrated_signals must be a list." };
      }
      if (calibrated_signals.length !== telemetry_signals.length) {
        return { passed: false, message: `calibrated_signals has ${calibrated_signals.length} items, expected ${telemetry_signals.length}.` };
      }
      if (guardian_repaired !== true) {
        return { passed: false, message: "guardian_repaired must evaluate to True." };
      }
      return {
        passed: true,
        message: "LEVEL 1 MASTERED! The Reef Guardian's optics shift from hostile crimson to serene turquoise, performing a magnificent loop. The entire Undersea Reef reaches 100% restoration!",
        actionPayload: { guardianFriendly: true, hubRestored: true }
      };
    }
  }
];

export const ALL_UNDERSEA_SUBLEVELS = UNDERSEA_LEVEL_1_SUBLEVELS;

export function getSublevelById(id) {
  return ALL_UNDERSEA_SUBLEVELS.find(s => s.id === id) || ALL_UNDERSEA_SUBLEVELS[0];
}

export function getSublevelByNum(num) {
  return ALL_UNDERSEA_SUBLEVELS.find(s => s.num === num) || ALL_UNDERSEA_SUBLEVELS[0];
}
