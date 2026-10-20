/**
 * LearnX — Eco Woods: The Living Forest Curriculum & Behavioral Validation Engine
 * 
 * 6 Progressive Missions for Level 2 (3D World Exploration):
 * 1. The Forest Gate (Boolean values, comparisons, if/else)
 * 2. The Polluted Stream (Conditions, elif, comparisons)
 * 3. The Wildlife Rescue (for loops, range(), repetition)
 * 4. The Seedling Nursery (Loops, counters, accumulators)
 * 5. The Forest Inventory (Lists, indexing, len(), iteration, basic list operations)
 * 6. The Eco Guardian (Debugging & combining decisions, loops, and collections)
 */

export const ECO_WOODS_MISSIONS = [
  {
    id: "ew_m1",
    num: 1,
    title: "The Forest Gate",
    landmark: "Ancient Forest Gate",
    targetCoords: [0, 0, 6],
    concept: "Boolean values, comparisons (==, !=, >, <, >=), and if/else",
    objective: "Inspect the forest safety index and gate clearance. Write a conditional statement to decide whether the gate opens.",
    story: "A towering wooden and mossy stone gate blocks the entry trail into Eco Woods. Signs nearby report atmospheric safety and ranger clearance. Your Python code must evaluate the conditions to unlock the ancient timber mechanism.",
    lesson: `Welcome Ranger! In Python, programs make decisions using **conditional statements**.

A **boolean** has one of two values: \`True\` or \`False\`.

You compare values using **comparison operators**:
- \`==\` (equal to)
- \`!=\` (not equal to)
- \`>\` (greater than)
- \`<\` (less than)
- \`>=\` (greater than or equal to)

The \`if\` statement runs code only when a condition is \`True\`. An optional \`else\` runs when the condition is \`False\`:
\`\`\`python
safety_index = 85

if safety_index >= 70:
    gate_open = True
    print("Gate Opened!")
else:
    gate_open = False
    print("Gate Closed.")
\`\`\`

**Your Mission:**
Inspect \`safety_index\` and \`gate_clearance\`. Set \`gate_open = True\` if the safety index is at least 70 and clearance is True, otherwise set \`gate_open = False\`. Run the code to watch the forest gate swing open!`,
    miniGame: {
      type: "boolean_matching_and_prediction",
      matchingPuzzle: {
        title: "Forest Sensor Logic: Match Expressions to Booleans",
        instructions: "Match each Python comparison to its evaluated boolean outcome:",
        pairs: [
          { id: "p1", varName: "85 >= 70", valueDisplay: "True", type: "boolean", description: "85 is greater than or equal to 70" },
          { id: "p2", varName: "10 == 25", valueDisplay: "False", type: "boolean", description: "10 is not equal to 25" },
          { id: "p3", varName: "'green' != 'brown'", valueDisplay: "True", type: "boolean", description: "The two strings are different" }
        ]
      },
      prediction: {
        title: "Gate Logic Predictor: Will the Gate Open?",
        codeSnippet: `safety = 80\nif safety >= 70:\n    print("PASS")\nelse:\n    print("HOLD")`,
        question: "When Python executes this condition, what output is printed?",
        options: [
          { id: "opt_a", text: "PASS", correct: true, feedback: "Correct! Because 80 >= 70 evaluates to True, the if-block executes." },
          { id: "opt_b", text: "HOLD", correct: false, feedback: "The else-block only runs if the condition was False." },
          { id: "opt_c", text: "safety", correct: false, feedback: "Print outputs the string 'PASS', not the variable name." }
        ]
      }
    },
    starterCode: `# Mission 1: The Forest Gate
# ------------------------------------------------------------------
# Evaluate whether conditions are safe to unlock the Ancient Forest Gate.
# Safe when: safety_index >= 70 and gate_clearance == True
# ------------------------------------------------------------------

safety_index = 85
gate_clearance = True

# TODO: Write an if/else statement to determine gate_open:
if safety_index >= 70 and gate_clearance == True:
    gate_open = True
    print("STATUS: Gate Open - Safe to enter the Living Forest")
else:
    gate_open = False
    print("STATUS: Gate Closed - Unsafe conditions")
`,
    visualBlocks: [
      { label: 'Check if safety_index >= 70', code: 'if safety_index >= 70 and gate_clearance == True:\n    gate_open = True' },
      { label: 'Set gate_open = True', code: 'gate_open = True' },
      { label: 'Else Keep Closed', code: 'else:\n    gate_open = False' }
    ],
    hints: [
      "Use 'if safety_index >= 70 and gate_clearance == True:' or 'if safety_index >= 70:'",
      "Assign gate_open = True inside the if block, and gate_open = False inside the else block.",
      "Print the status using print('STATUS: Gate Open') so the terminal reports the change."
    ],
    rewardXP: 60,
    toolUnlock: {
      id: "ranger_compass",
      name: "Ranger's Compass",
      type: "accessory",
      icon: "🧭",
      description: "Brass magnetic compass tuned to forest leylines."
    },
    restorationDelta: 16,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Define 'gate_open' as True or False based on the condition." };
      }

      if (scope.gate_open === undefined) {
        return {
          passed: false,
          message: "Variable 'gate_open' was not found. Be sure to set 'gate_open = True' when safety conditions pass!"
        };
      }

      if (scope.gate_open !== true) {
        return {
          passed: false,
          message: "The gate remained closed. With safety_index=85 and clearance=True, gate_open should be True!"
        };
      }

      return {
        passed: true,
        message: "The ancient wooden gate groans and swings wide open! Welcome to the Living Forest trail.",
        actionPayload: { gateOpen: true }
      };
    }
  },
  {
    id: "ew_m2",
    num: 2,
    title: "The Polluted Stream",
    landmark: "River Filtration Station",
    targetCoords: [-16, 0, -2],
    concept: "Conditions, elif, comparisons",
    objective: "Examine water quality readings (toxin_ppm). Write an if/elif/else chain to classify the water status and activate cleanup equipment.",
    story: "Runoff from industrial debris has fouled the once-sparkling forest river. The waterwheel filtration station stands inactive. Classify the river's condition and power on the water filters to restore clarity to the stream.",
    lesson: `When you have **more than two possibilities**, use \`elif\` (short for "else if"):

\`\`\`python
if condition_1:
    # Runs if condition_1 is True
elif condition_2:
    # Runs if condition_1 is False, but condition_2 is True
else:
    # Runs if none of the above were True
\`\`\`

**Classification Rules:**
- \`toxin_ppm <= 25\`: \`water_status = "healthy"\`, \`filtration_active = False\`
- \`toxin_ppm <= 60\`: \`water_status = "monitoring"\`, \`filtration_active = True\`
- \`toxin_ppm > 60\`: \`water_status = "cleanup"\`, \`filtration_active = True\`

**Your Mission:**
Use \`if\`, \`elif\`, and \`else\` to set \`water_status\` and activate \`filtration_active = True\` when cleanup is required!`,
    starterCode: `# Mission 2: The Polluted Stream
# ------------------------------------------------------------------
# Water quality sensors report toxin_ppm levels.
# <= 25 -> "healthy" (no filtration needed)
# <= 60 -> "monitoring" (filtration active)
# > 60  -> "cleanup" (high power filtration active)
# ------------------------------------------------------------------

toxin_ppm = 75

# TODO: Write an if/elif/else structure to evaluate toxin_ppm:
if toxin_ppm <= 25:
    water_status = "healthy"
    filtration_active = False
elif toxin_ppm <= 60:
    water_status = "monitoring"
    filtration_active = True
else:
    water_status = "cleanup"
    filtration_active = True

print("Water Status:", water_status)
print("Filtration Active:", filtration_active)
`,
    visualBlocks: [
      { label: 'If toxin_ppm <= 25', code: 'if toxin_ppm <= 25:\n    water_status = "healthy"\n    filtration_active = False' },
      { label: 'Elif toxin_ppm <= 60', code: 'elif toxin_ppm <= 60:\n    water_status = "monitoring"\n    filtration_active = True' },
      { label: 'Else cleanup', code: 'else:\n    water_status = "cleanup"\n    filtration_active = True' }
    ],
    hints: [
      "Check the first threshold with 'if toxin_ppm <= 25:'",
      "Check the middle tier with 'elif toxin_ppm <= 60:'",
      "Use 'else:' for any toxin_ppm higher than 60 and set water_status = 'cleanup'."
    ],
    rewardXP: 70,
    toolUnlock: {
      id: "water_flask",
      name: "Water Purifier Flask",
      type: "equipment",
      icon: "🧪",
      description: "Crystal glass vial for instant river pH and purity testing."
    },
    restorationDelta: 17,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Set 'water_status' and 'filtration_active' based on toxin_ppm." };
      }

      if (!scope.water_status || typeof scope.water_status !== "string") {
        return {
          passed: false,
          message: "Variable 'water_status' must be set to 'healthy', 'monitoring', or 'cleanup'."
        };
      }

      const status = scope.water_status.toLowerCase().trim();
      if (status !== "cleanup" && status !== "monitoring") {
        return {
          passed: false,
          message: `With toxin_ppm = 75, water_status should be 'cleanup', but was '${scope.water_status}'.`
        };
      }

      if (!scope.filtration_active) {
        return {
          passed: false,
          message: "When water_status is 'cleanup', filtration_active must be True to engage the waterwheels!"
        };
      }

      return {
        passed: true,
        message: "The waterwheel rumbles into motion! The muddy brown river clears into a shimmering azure stream.",
        actionPayload: { waterClean: true, streamSpeed: 1.5 }
      };
    }
  },
  {
    id: "ew_m3",
    num: 3,
    title: "The Wildlife Rescue",
    landmark: "Wildlife Sanctuary Clearing",
    targetCoords: [14, 0, 10],
    concept: "for loops, range(), repetition",
    objective: "A group of animals are separated from their safe sanctuary. Write a for loop using range() to guide all animals home safely.",
    story: "Frightened deer, rabbits, and forest songbirds were scattered when fallen debris blocked their paths. Rather than repeating separate commands for each animal, write a Python for loop that iterates through all separated creatures and guides them to safety.",
    lesson: `A \`for\` loop in Python lets you repeat actions without writing the same line over and over!

Use the \`range()\` function to specify how many times to repeat:
\`\`\`python
# Repeats 5 times: 1, 2, 3, 4, 5
for animal_id in range(1, 6):
    print("Guiding animal:", animal_id)
\`\`\`

- \`for\` starts the loop.
- \`animal_id\` is the loop variable that changes on each repetition.
- \`range(start, stop)\` generates numbers from \`start\` up to (but not including) \`stop\`.

**Your Mission:**
Use a loop to iterate from 1 through \`total_animals\` (5). Increment \`rescued_count\` on each pass so all 5 creatures reach the sanctuary safely!`,
    starterCode: `# Mission 3: The Wildlife Rescue
# ------------------------------------------------------------------
# Guide 5 animals into the Wildlife Sanctuary using a for loop.
# ------------------------------------------------------------------

total_animals = 5
rescued_count = 0

# TODO: Write a for loop using range(1, total_animals + 1) to rescue each animal:
for animal_id in range(1, total_animals + 1):
    rescued_count = rescued_count + 1
    print("Guiding animal #", animal_id, "to sanctuary")

print("Total Rescued:", rescued_count)
`,
    visualBlocks: [
      { label: 'for animal_id in range(1, total_animals + 1):', code: 'for animal_id in range(1, total_animals + 1):\n    rescued_count = rescued_count + 1' },
      { label: 'Print progress', code: 'print("Guiding animal #", animal_id)' }
    ],
    hints: [
      "Write 'for animal_id in range(1, total_animals + 1):' or 'for i in range(total_animals):'",
      "Inside the loop, increment rescued_count: rescued_count = rescued_count + 1 (or rescued_count += 1).",
      "Indent the code inside the loop by 4 spaces."
    ],
    rewardXP: 70,
    toolUnlock: {
      id: "wildlife_whistle",
      name: "Wildlife Whistle",
      type: "equipment",
      icon: "🪈",
      description: "Carved wooden flute that chirps peaceful frequencies to friendly wildlife."
    },
    restorationDelta: 17,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Use a for loop to increment 'rescued_count'." };
      }

      if (typeof scope.rescued_count !== "number") {
        return {
          passed: false,
          message: "Variable 'rescued_count' must be a number tracking rescued animals."
        };
      }

      if (scope.rescued_count < 5) {
        return {
          passed: false,
          message: `Only ${scope.rescued_count} animals were rescued. The sanctuary needs all 5 animals brought to safety!`
        };
      }

      return {
        passed: true,
        message: "Gentle deer, rabbits, and songbirds hop and flutter safely into the sanctuary clearing!",
        actionPayload: { animalsRescued: true }
      };
    }
  },
  {
    id: "ew_m4",
    num: 4,
    title: "The Seedling Nursery",
    landmark: "Barren Clearing Nursery",
    targetCoords: [18, 0, -10],
    concept: "Loops, counters, accumulators",
    objective: "Plant and water seedlings across damaged forest patches. Write a loop that accumulates the total seedlings restored.",
    story: "A barren dirt clearing marks where ancient oaks were cut down. The nursery holds saplings ready for planting across four clearing sectors. Use an accumulator loop to tally the total seedlings planted.",
    lesson: `An **accumulator** is a variable used to gather or sum up values during a loop.

Pattern:
1. Initialize counter before the loop: \`total = 0\`
2. Loop over values:
\`\`\`python
sectors = [10, 15, 12, 18]
total_planted = 0

for count in sectors:
    total_planted = total_planted + count
\`\`\`
3. After the loop, \`total_planted\` holds the cumulative sum (\`55\`).

**Your Mission:**
Loop through the list \`sectors = [10, 15, 12, 18]\` and add each value into \`total_planted\`. Watch young saplings sprout across the clearing!`,
    starterCode: `# Mission 4: The Seedling Nursery
# ------------------------------------------------------------------
# Plant seedlings across 4 nursery sectors and calculate total_planted.
# ------------------------------------------------------------------

sectors = [10, 15, 12, 18]
total_planted = 0

# TODO: Write a loop to add each sector's seedling count into total_planted:
for count in sectors:
    total_planted = total_planted + count
    print("Planted sector with", count, "seedlings")

print("Grand Total Planted:", total_planted)
`,
    visualBlocks: [
      { label: 'for count in sectors:', code: 'for count in sectors:\n    total_planted = total_planted + count' },
      { label: 'Print Grand Total', code: 'print("Grand Total Planted:", total_planted)' }
    ],
    hints: [
      "Use 'for count in sectors:' to visit each number in the list.",
      "Inside the loop, write: total_planted = total_planted + count",
      "Check your indentation: lines inside the loop must be indented!"
    ],
    rewardXP: 75,
    toolUnlock: {
      id: "verdant_trowel",
      name: "Verdant Trowel",
      type: "equipment",
      icon: "🌱",
      description: "Forged gardening trowel infused with biological growth catalysts."
    },
    restorationDelta: 17,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Calculate 'total_planted' using a loop accumulator." };
      }

      if (typeof scope.total_planted !== "number") {
        return {
          passed: false,
          message: "Variable 'total_planted' must be an accumulated number."
        };
      }

      if (scope.total_planted !== 55) {
        return {
          passed: false,
          message: `Expected total_planted to be 55 (10 + 15 + 12 + 18), but calculated ${scope.total_planted}.`
        };
      }

      return {
        passed: true,
        message: "Lush green saplings and wild clover sprout across the barren clearing in a wave of vibrant growth!",
        actionPayload: { seedlingsGrown: true, count: 55 }
      };
    }
  },
  {
    id: "ew_m5",
    num: 5,
    title: "The Forest Inventory",
    landmark: "Botanical Research Outpost",
    targetCoords: [-14, 0, -18],
    concept: "Lists, indexing, len(), iteration and basic list operations",
    objective: "Inspect the collection of forest flora samples. Retrieve specific specimens by index and calculate the catalog size.",
    story: "The Botanical Research Outpost monitors biodiversity. Field sensors have collected specimens of rare forest flora in a Python list. Use indexing and len() to identify the primary sample, count specimens, and check for bio-indicators.",
    lesson: `A **list** stores an ordered collection of items inside square brackets \`[]\`:
\`\`\`python
flora = ["ancient_fern", "glow_moss", "silver_birch"]
\`\`\`

**Indexing:**
Items are indexed starting from **0**:
- \`flora[0]\` is \`"ancient_fern"\` (first item)
- \`flora[1]\` is \`"glow_moss"\` (second item)

**Length:**
The \`len()\` function returns how many items are in the list:
\`\`\`python
count = len(flora) # Returns 3
\`\`\`

**Membership:**
The \`in\` operator checks if an item exists in the list:
\`\`\`python
has_moss = "glow_moss" in flora # True
\`\`\`

**Your Mission:**
1. Extract \`first_specimen\` using index 0.
2. Store the list length in \`sample_count\` with \`len()\`.
3. Check if \`"glow_moss"\` is in \`flora_samples\` and store the boolean in \`has_glow_moss\`.`,
    starterCode: `# Mission 5: The Forest Inventory
# ------------------------------------------------------------------
# Inspect and process the collection of botanical samples.
# ------------------------------------------------------------------

flora_samples = ["ancient_fern", "glow_moss", "silver_birch", "medicinal_herb"]

# TODO 1: Access the first specimen using index 0:
first_specimen = flora_samples[0]

# TODO 2: Determine how many samples were cataloged using len():
sample_count = len(flora_samples)

# TODO 3: Check whether "glow_moss" exists in the list using the 'in' operator:
has_glow_moss = "glow_moss" in flora_samples

print("Primary Specimen:", first_specimen)
print("Total Cataloged:", sample_count)
print("Contains Glow Moss:", has_glow_moss)
`,
    visualBlocks: [
      { label: 'first_specimen = flora_samples[0]', code: 'first_specimen = flora_samples[0]' },
      { label: 'sample_count = len(flora_samples)', code: 'sample_count = len(flora_samples)' },
      { label: 'has_glow_moss = "glow_moss" in flora_samples', code: 'has_glow_moss = "glow_moss" in flora_samples' }
    ],
    hints: [
      "In Python, the first item in a list is at index 0: flora_samples[0].",
      "Use len(flora_samples) to count the total items.",
      "The expression '\"glow_moss\" in flora_samples' evaluates to True if glow_moss is present."
    ],
    rewardXP: 75,
    toolUnlock: {
      id: "botanist_lens",
      name: "Botanist's Magnifier",
      type: "equipment",
      icon: "🔍",
      description: "Prismatic lens that scans molecular chlorophyll structures in leaves."
    },
    restorationDelta: 17,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Define 'first_specimen', 'sample_count', and 'has_glow_moss'." };
      }

      if (scope.first_specimen !== "ancient_fern") {
        return {
          passed: false,
          message: `Expected first_specimen to be 'ancient_fern' (index 0), but got '${scope.first_specimen}'.`
        };
      }

      if (scope.sample_count !== 4) {
        return {
          passed: false,
          message: `Expected sample_count to be 4, but got ${scope.sample_count}. Use len(flora_samples).`
        };
      }

      if (scope.has_glow_moss !== true) {
        return {
          passed: false,
          message: "Expected has_glow_moss to be True because 'glow_moss' is in the list."
        };
      }

      return {
        passed: true,
        message: "Holographic scanning beams illuminate the specimen crates, verifying catalog telemetry!",
        actionPayload: { scannerActive: true }
      };
    }
  },
  {
    id: "ew_m6",
    num: 6,
    title: "The Eco Guardian",
    landmark: "The Ancient Heart Tree",
    targetCoords: [0, 0, -22],
    concept: "Debugging and combining decisions, loops, and collections",
    objective: "The ancient Heart Tree is weakening. Debug and repair the guardian diagnostic loop to restore vitality across all affected forest zones.",
    story: "At the heart of Eco Woods stands the monumental Ancient Heart Tree—the Eco Guardian of the continent. Decades of ecological strain have corrupted its diagnostic conduits. Debug the broken program by combining loops, conditionals, and collection updates to awaken the Eco Guardian and achieve 100% Continental Restoration!",
    lesson: `In real programming, you often combine **data structures (lists)**, **iteration (loops)**, and **logic (conditionals)** to fix complex problems.

Examine the corrupted diagnostic routine:
\`\`\`python
zones = [
    {"name": "Canopy Heights", "vitality": 42},
    {"name": "Whispering Brook", "vitality": 35},
    {"name": "Sanctuary Glen", "vitality": 50},
    {"name": "Ancient Roots", "vitality": 30}
]
\`\`\`

The loop needs to:
1. Iterate over every \`zone\` in \`zones\`.
2. Check if \`zone["vitality"] < 60\`.
3. Boost \`zone["vitality"]\` to \`100\`.
4. Append \`zone["name"]\` to \`restored_zones\`.
5. Accumulate \`25\` power points into \`guardian_power\` for each restored zone.

**Your Mission:**
Correct the indentation and comparison bug in the loop below. Run the code to awaken the radiant Eco Guardian!`,
    starterCode: `# Mission 6: The Eco Guardian - Grand Ecosystem Restoration
# ------------------------------------------------------------------
# Debug the diagnostic routine to restore vitality to all 4 forest zones.
# ------------------------------------------------------------------

zones = [
    {"name": "Canopy Heights", "vitality": 42},
    {"name": "Whispering Brook", "vitality": 35},
    {"name": "Sanctuary Glen", "vitality": 50},
    {"name": "Ancient Roots", "vitality": 30}
]

restored_zones = []
guardian_power = 0

# TODO: Fix the loop to check vitality < 60, boost to 100, and add to restored_zones:
for zone in zones:
    if zone["vitality"] < 60:
        zone["vitality"] = 100
        restored_zones.append(zone["name"])
        guardian_power = guardian_power + 25

print("Restored Zones:", restored_zones)
print("Guardian Power:", guardian_power)
print("STATUS: Eco Guardian Fully Awakened!")
`,
    visualBlocks: [
      { label: 'for zone in zones:', code: 'for zone in zones:\n    if zone["vitality"] < 60:\n        zone["vitality"] = 100\n        restored_zones.append(zone["name"])\n        guardian_power = guardian_power + 25' },
      { label: 'Print Guardian Status', code: 'print("Guardian Power:", guardian_power)\nprint("Eco Guardian Restored!")' }
    ],
    hints: [
      "Ensure the if statement checks: if zone['vitality'] < 60:",
      "Inside the if block, set zone['vitality'] = 100 and add 25 to guardian_power.",
      "Check that restored_zones.append(zone['name']) adds all 4 zones."
    ],
    rewardXP: 120,
    badgeUnlock: {
      id: "eco_guardian",
      name: "Eco Guardian",
      icon: "🌳",
      description: "Restored all 6 sectors of Eco Woods and awakened the Ancient Heart Tree."
    },
    restorationDelta: 16,
    validate: async (result, scope, dynamicParams) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Repair the diagnostic routine to restore guardian power." };
      }

      if (scope.guardian_power !== 100) {
        return {
          passed: false,
          message: `Guardian power reached ${scope.guardian_power || 0}/100. All 4 zones must be boosted to reach 100 power!`
        };
      }

      if (!Array.isArray(scope.restored_zones) || scope.restored_zones.length < 4) {
        return {
          passed: false,
          message: `Expected 4 restored zones, but recorded ${scope.restored_zones ? scope.restored_zones.length : 0}. Check your loop append!`
        };
      }

      return {
        passed: true,
        message: "The Ancient Heart Tree blazes with radiant golden energy! Golden pollen drifts across the canopy as the Eco Guardian awakens in full glory!",
        actionPayload: { guardianAwakened: true, heartTreeBlaze: true }
      };
    }
  }
];

export const getEcoWoodsMissionByNum = (num) => {
  return ECO_WOODS_MISSIONS.find((m) => m.num === Number(num)) || ECO_WOODS_MISSIONS[0];
};
