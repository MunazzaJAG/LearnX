/**
 * LearnX — Wildwood Sanctuary Curriculum & Behavioral Validation Engine
 * 
 * 6 Progressive Missions for Level 1: Wildwood Sanctuary:
 * 1. Forest Inspection (Basic conditions: if, comparisons <, >, ==)
 * 2. Habitat Match (Multi-branch conditionals: if/elif/else)
 * 3. Rescue Requirements (Boolean logic & compound conditions: and, or)
 * 4. Feeding Time (Loops: for, range, repetition)
 * 5. Supply Inventory (Lists, indexing, len, collection summation)
 * 6. Sanctuary Recovery (Integrated conditions, loops, and lists)
 * 
 * STRICT PEDAGOGICAL POLICY:
 * Starter code NEVER includes prewritten answers. Students must write the logic themselves.
 */

import { runPythonCode, extractPythonScope } from "../utils/pythonRunner.js";

export const WILDWOOD_MISSIONS = [
  {
    id: "ww_m1",
    num: 1,
    title: "Forest Inspection",
    subtitle: "Basic conditions with if and comparisons",
    concept: "Conditionals (if / else) and comparison operators (<, >, ==)",
    habitatArea: "Intake Clinic",
    targetAnimal: "Rusty the Fox",
    story: "Rusty the Red Fox was found shivering near the outer brambles. Assess his vitals at the clinic to determine if he needs emergency care.",
    task: "Write an if/else statement: if health_score < 50, set status = 'needs_care', otherwise set status = 'healthy'.",
    lesson: `In Python, an **if statement** tests whether a condition is \`True\`. An optional **else block** runs when the condition is \`False\`.

\`\`\`python
temperature = 35

if temperature < 40:
    weather = "cold"
else:
    weather = "mild"
\`\`\`

- Comparisons compare two numbers: \`<\` (less than), \`>\` (greater than), \`==\` (equal to).
- Lines inside the \`if\` or \`else\` block must be **indented** by 4 spaces.

**Your Goal:**
Check \`health_score\`. If it is less than \`50\`, assign \`status = "needs_care"\`. Otherwise, assign \`status = "healthy"\`.`,
    starterCode: `# Mission 1: Forest Inspection
# -----------------------------------------------------------
# Rusty the Fox has arrived at the clinic.
# If health_score < 50:
#     Set status = "needs_care"
# Otherwise:
#     Set status = "healthy"
# -----------------------------------------------------------

animal_name = "Rusty the Fox"
health_score = 42

# TODO: Write your if/else statement below to set 'status':


print("Animal:", animal_name)
print("Health Status:", status)
`,
    hints: [
      "Hint 1: Start with 'if health_score < 50:' followed by an indented line.",
      "Hint 2: Inside the if-block, write: status = 'needs_care'",
      "Hint 3: On the next unindented line, write 'else:' and inside it: status = 'healthy'"
    ],
    rewardXP: 50,
    restorationDelta: 16,
    validate: async (result, scope, rawCode) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Define the variable 'status' using an if/else conditional statement." };
      }

      if (scope.status === undefined) {
        return {
          passed: false,
          message: "Variable 'status' was not defined. Make sure to assign status = 'needs_care' or status = 'healthy' in your condition!"
        };
      }

      if (scope.status !== "needs_care") {
        return {
          passed: false,
          message: `Expected status to be 'needs_care' because health_score (42) is less than 50, but got '${scope.status}'.`
        };
      }

      // Dynamic Anti-Cheating check: Test with health_score = 75 to verify condition isn't hardcoded
      const testCode = rawCode.replace(/health_score\s*=\s*\d+/, "health_score = 75");
      const dynamicResult = await runPythonCode(testCode);
      const dynamicScope = dynamicResult.scope || extractPythonScope(testCode);

      if (dynamicScope.status !== "healthy") {
        return {
          passed: false,
          message: "Your code must use a genuine 'if/else' condition. When tested with health_score = 75, status should become 'healthy'!"
        };
      }

      return {
        passed: true,
        message: "Rusty was gently examined, treated with fresh herbal salve, and wrapped in a warm fleece blanket! He rests peacefully in the clinic.",
        actionPayload: { animal: "fox", habitat: "clinic", status: "healthy" }
      };
    }
  },
  {
    id: "ww_m2",
    num: 2,
    title: "Habitat Match",
    subtitle: "Multi-branch decisions with if, elif, and else",
    concept: "Multi-branch decisions (if, elif, else)",
    habitatArea: "Mossy Burrow",
    targetAnimal: "Pip the Rabbit",
    story: "Pip the Forest Hare is waiting at the sanctuary gate. Guide her to the correct habitat based on her species so she settles in safely.",
    task: "Use if/elif/else to assign 'habitat': 'fox' -> 'woodland', 'rabbit' -> 'burrow', 'deer' -> 'meadow', and any other -> 'general_shelter'.",
    lesson: `When you have three or more possibilities, use **elif** (short for "else if"):

\`\`\`python
if species == "owl":
    habitat = "treetop"
elif species == "frog":
    habitat = "pond"
else:
    habitat = "ground"
\`\`\`

- \`if\` handles the first condition.
- \`elif\` handles subsequent conditions in order.
- \`else\` handles anything that did not match the conditions above.

**Your Goal:**
Set \`habitat\` based on \`animal_species\`:
- \`"fox"\` -> \`"woodland"\`
- \`"rabbit"\` -> \`"burrow"\`
- \`"deer"\` -> \`"meadow"\`
- any other -> \`"general_shelter"\``,
    starterCode: `# Mission 2: Habitat Match
# -----------------------------------------------------------
# Direct Pip to the correct habitat based on animal_species:
# - "fox"    -> "woodland"
# - "rabbit" -> "burrow"
# - "deer"   -> "meadow"
# - any other -> "general_shelter"
# -----------------------------------------------------------

animal_species = "rabbit"

# TODO: Write an if / elif / else structure to set 'habitat':


print("Species:", animal_species)
print("Assigned Habitat:", habitat)
`,
    hints: [
      "Hint 1: Start with 'if animal_species == \"fox\":' and set habitat = 'woodland'",
      "Hint 2: Add 'elif animal_species == \"rabbit\":' and set habitat = 'burrow'",
      "Hint 3: Add 'elif animal_species == \"deer\":' and finish with 'else: habitat = \"general_shelter\"'"
    ],
    rewardXP: 60,
    restorationDelta: 16,
    validate: async (result, scope, rawCode) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Define 'habitat' using an if / elif / else statement." };
      }

      if (!scope.habitat) {
        return {
          passed: false,
          message: "Variable 'habitat' was not defined. Make sure to assign habitat = 'burrow' when animal_species == 'rabbit'!"
        };
      }

      if (scope.habitat !== "burrow") {
        return {
          passed: false,
          message: `Expected habitat to be 'burrow' for a rabbit, but got '${scope.habitat}'.`
        };
      }

      // Dynamic validation across all branches
      const testFox = rawCode.replace(/animal_species\s*=\s*["'][^"']+["']/, 'animal_species = "fox"');
      const resFox = await runPythonCode(testFox);
      const scopeFox = resFox.scope || extractPythonScope(testFox);

      const testDeer = rawCode.replace(/animal_species\s*=\s*["'][^"']+["']/, 'animal_species = "deer"');
      const resDeer = await runPythonCode(testDeer);
      const scopeDeer = resDeer.scope || extractPythonScope(testDeer);

      if (scopeFox.habitat !== "woodland" || scopeDeer.habitat !== "meadow") {
        return {
          passed: false,
          message: "Make sure you include branches for 'fox' -> 'woodland' and 'deer' -> 'meadow' using elif!"
        };
      }

      return {
        passed: true,
        message: "Pip the Rabbit hops joyfully through the entrance tunnel into the Mossy Burrow! Fresh clover bedding is laid down.",
        actionPayload: { animal: "rabbit", habitat: "burrow", status: "assigned" }
      };
    }
  },
  {
    id: "ww_m3",
    num: 3,
    title: "Rescue Requirements",
    subtitle: "Compound conditions with and, or",
    concept: "Compound Boolean Logic (and, or, comparisons)",
    habitatArea: "Sunlit Meadow",
    targetAnimal: "Fern the Fawn",
    story: "Fern the young fawn wants to join the meadow herd. Sanctuary safety rules require her to be vaccinated and the pasture to have space.",
    task: "Use a compound 'and' condition: if is_vaccinated is True and current_occupants < max_capacity, set can_enter = True, else False.",
    lesson: `In Python, you can combine multiple conditions using the **and** operator:

\`\`\`python
is_sunny = True
has_key = True

if is_sunny and has_key:
    can_open_gate = True
else:
    can_open_gate = False
\`\`\`

- With **and**, BOTH conditions must be \`True\` for the \`if\` branch to run.
- If either condition is \`False\`, the \`else\` branch runs.

**Your Goal:**
Set \`can_enter = True\` if \`is_vaccinated\` is \`True\` AND \`current_occupants < max_capacity\`. Otherwise set \`can_enter = False\`.`,
    starterCode: `# Mission 3: Rescue Requirements
# -----------------------------------------------------------
# Fern the Fawn wants to enter the Sunlit Meadow.
# An animal can enter ONLY if:
# 1. is_vaccinated is True
# 2. current_occupants < max_capacity
# Set the boolean variable 'can_enter' to True or False.
# -----------------------------------------------------------

is_vaccinated = True
current_occupants = 3
max_capacity = 5

# TODO: Write a compound condition with 'and' to set can_enter:


print("Can Enter Meadow:", can_enter)
`,
    hints: [
      "Hint 1: Use 'if is_vaccinated == True and current_occupants < max_capacity:'",
      "Hint 2: Inside the if-block, write: can_enter = True",
      "Hint 3: On the else-block, write: can_enter = False"
    ],
    rewardXP: 70,
    restorationDelta: 17,
    validate: async (result, scope, rawCode) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Define 'can_enter' as True or False based on the compound condition." };
      }

      if (scope.can_enter === undefined) {
        return {
          passed: false,
          message: "Variable 'can_enter' was not found. Be sure to set can_enter = True or False!"
        };
      }

      if (scope.can_enter !== true) {
        return {
          passed: false,
          message: "Because is_vaccinated is True and current_occupants (3) is less than max_capacity (5), can_enter should be True!"
        };
      }

      // Dynamic test 1: Full capacity check (occupants = 5) -> should be False
      const testFull = rawCode.replace(/current_occupants\s*=\s*\d+/, "current_occupants = 5");
      const resFull = await runPythonCode(testFull);
      const scopeFull = resFull.scope || extractPythonScope(testFull);

      // Dynamic test 2: Unvaccinated check -> should be False
      const testUnvac = rawCode.replace(/is_vaccinated\s*=\s*True/, "is_vaccinated = False");
      const resUnvac = await runPythonCode(testUnvac);
      const scopeUnvac = resUnvac.scope || extractPythonScope(testUnvac);

      if (scopeFull.can_enter !== false) {
        return {
          passed: false,
          message: "Your condition must check current_occupants < max_capacity! When occupants reach max_capacity, can_enter must be False."
        };
      }

      if (scopeUnvac.can_enter !== false) {
        return {
          passed: false,
          message: "Your condition must check that is_vaccinated is True! Unvaccinated animals cannot enter."
        };
      }

      return {
        passed: true,
        message: "Fern passes inspection with flying colors! The wooden pasture turnstile opens, and she bounds into the clover field to join the herd.",
        actionPayload: { animal: "deer", habitat: "meadow", admitted: true }
      };
    }
  },
  {
    id: "ww_m4",
    num: 4,
    title: "Feeding Time",
    subtitle: "Repetition and counting with for loops",
    concept: "Loops (for, range, loop variable)",
    habitatArea: "Central Storehouse",
    targetAnimal: "Bramble the Hedgehog",
    story: "Dinner time has arrived for the sanctuary residents. Use a for loop to automate preparing food portions for all four animals.",
    task: "Write a for loop with range(1, total_animals + 1) that increments meals_prepared by 1 for each animal.",
    lesson: `A **for loop** lets Python repeat instructions multiple times automatically:

\`\`\`python
# Runs 3 times: count takes values 1, 2, 3
for count in range(1, 4):
    print("Serving meal #", count)
\`\`\`

- \`range(start, stop)\` starts at \`start\` and stops **before** reaching \`stop\`.
- To count from \`1\` to \`total_animals\`, use \`range(1, total_animals + 1)\`.
- Inside the loop, use \`meals_prepared = meals_prepared + 1\` (or \`meals_prepared += 1\`).

**Your Goal:**
Use a \`for\` loop over \`range(1, total_animals + 1)\` to increase \`meals_prepared\` by 1 on each repetition.`,
    starterCode: `# Mission 4: Feeding Time
# -----------------------------------------------------------
# Prepare meals for 4 hungry sanctuary animals.
# Use a for loop with range(1, total_animals + 1).
# Inside the loop, increment meals_prepared by 1.
# -----------------------------------------------------------

total_animals = 4
meals_prepared = 0

# TODO: Write your for loop below to prepare all meals:


print("Total Meals Prepared:", meals_prepared)
`,
    hints: [
      "Hint 1: Write 'for i in range(1, total_animals + 1):' or 'for i in range(total_animals):'",
      "Hint 2: Indent the next line and write: meals_prepared = meals_prepared + 1",
      "Hint 3: Make sure you do NOT reset meals_prepared inside the loop!"
    ],
    rewardXP: 75,
    restorationDelta: 17,
    validate: async (result, scope, rawCode) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Use a for loop to increment meals_prepared." };
      }

      if (typeof scope.meals_prepared !== "number") {
        return {
          passed: false,
          message: "Variable 'meals_prepared' must be a number incremented by your loop."
        };
      }

      if (scope.meals_prepared !== 4) {
        return {
          passed: false,
          message: `Expected meals_prepared to be 4 (for 4 animals), but got ${scope.meals_prepared}.`
        };
      }

      // Dynamic test: test with total_animals = 7 to verify genuine loop
      const testDynamic = rawCode.replace(/total_animals\s*=\s*\d+/, "total_animals = 7");
      const resDyn = await runPythonCode(testDynamic);
      const scopeDyn = resDyn.scope || extractPythonScope(testDynamic);

      if (scopeDyn.meals_prepared !== 7) {
        return {
          passed: false,
          message: "Make sure you used a genuine for loop with total_animals! When total_animals = 7, meals_prepared must equal 7."
        };
      }

      return {
        passed: true,
        message: "Fresh wooden bowls filled with blackberries, mealworms, and seeds are served at every habitat! Bramble the hedgehog crunches contentedly.",
        actionPayload: { fed: true, count: 4 }
      };
    }
  },
  {
    id: "ww_m5",
    num: 5,
    title: "Supply Inventory",
    subtitle: "Lists, indexing, len(), and collection processing",
    concept: "Lists, indexing [0], len(), and list iteration",
    habitatArea: "Resource Barn",
    targetAnimal: "Hoot the Barn Owl",
    animalSpecies: "owl",
    story: "Winter is coming, and Hoot the Barn Owl is auditing the food pantries. Inspect the supply crates and calculate the total food stockpile.",
    task: "Set first_crate = supplies[0], pantry_count = len(supplies), and use a loop to sum all values into total_supplies.",
    lesson: `A **list** stores multiple items in order inside square brackets \`[]\`:

\`\`\`python
supplies = [10, 25, 15]

# 1. Indexing (starts at 0!)
first_item = supplies[0]  # 10

# 2. Length
count = len(supplies)     # 3

# 3. Looping through items
total = 0
for amount in supplies:
    total = total + amount
\`\`\`

**Your Goal:**
1. Extract \`first_crate = supplies[0]\`.
2. Find \`pantry_count = len(supplies)\`.
3. Loop through \`supplies\` and add each amount into \`total_supplies\`.`,
    starterCode: `# Mission 5: Supply Inventory
# -----------------------------------------------------------
# The sanctuary holds berry baskets across 4 storage pantries:
# -----------------------------------------------------------

supplies = [15, 22, 18, 30]

# TODO 1: Access the first pantry supply using index 0:
first_crate = None

# TODO 2: Count how many pantries there are using len():
pantry_count = None

# TODO 3: Use a loop to sum all values in 'supplies' into total_supplies:
total_supplies = 0



print("First Pantry:", first_crate)
print("Pantry Count:", pantry_count)
print("Total Stockpile:", total_supplies)
`,
    hints: [
      "Hint 1: For TODO 1, write: first_crate = supplies[0]",
      "Hint 2: For TODO 2, write: pantry_count = len(supplies)",
      "Hint 3: For TODO 3, write 'for item in supplies:' and inside: total_supplies = total_supplies + item"
    ],
    rewardXP: 80,
    restorationDelta: 17,
    validate: async (result, scope, rawCode) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Define first_crate, pantry_count, and total_supplies." };
      }

      if (scope.first_crate !== 15) {
        return {
          passed: false,
          message: `Expected first_crate to be 15 (supplies[0]), but got ${scope.first_crate}.`
        };
      }

      if (scope.pantry_count !== 4) {
        return {
          passed: false,
          message: `Expected pantry_count to be 4 (len(supplies)), but got ${scope.pantry_count}.`
        };
      }

      if (scope.total_supplies !== 85) {
        return {
          passed: false,
          message: `Expected total_supplies to be 85 (15 + 22 + 18 + 30), but got ${scope.total_supplies}.`
        };
      }

      // Dynamic check with different supplies list
      const testDyn = rawCode.replace(/supplies\s*=\s*\[[^\]]+\]/, "supplies = [10, 20, 30]");
      const resDyn = await runPythonCode(testDyn);
      const scopeDyn = resDyn.scope || extractPythonScope(testDyn);

      if (scopeDyn.total_supplies !== 60 || scopeDyn.pantry_count !== 3 || scopeDyn.first_crate !== 10) {
        return {
          passed: false,
          message: "Make sure you used supplies[0], len(supplies), and a loop over supplies rather than hardcoding numbers!"
        };
      }

      return {
        passed: true,
        message: "Hoot clicks his beak in approval! The barn shelves are cleanly labeled, stacked with bushels of fresh berries, and 85 winter portions are safely cataloged.",
        actionPayload: { inventoryDone: true, total: 85 }
      };
    }
  },
  {
    id: "ww_m6",
    num: 6,
    title: "Sanctuary Recovery",
    subtitle: "Integrated conditions, loops, and lists",
    concept: "Integrated problem solving (lists, loops, and conditionals combined)",
    habitatArea: "Grand Sanctuary Plaza",
    targetAnimal: "All Wildwood Creatures",
    story: "The Wildlife Inspector has arrived to evaluate our four restored habitats. If at least 3 habitats score 80 or above, full recovery is granted!",
    task: "Loop through 'habitats' and increment passed_habitats for scores >= 80. Then if passed_habitats >= 3, set sanctuary_recovered = True, else False.",
    lesson: `In real software, you combine **lists**, **loops**, and **conditionals**:

\`\`\`python
scores = [70, 85, 90]
high_scores = 0

# Loop through list and test each item
for score in scores:
    if score >= 80:
        high_scores = high_scores + 1

# Check final outcome
if high_scores >= 2:
    status = "Approved"
else:
    status = "Pending"
\`\`\`

**Your Goal:**
Count how many ratings in \`habitats\` are \`>= 80\`. If that count is at least \`3\`, set \`sanctuary_recovered = True\`.`,
    starterCode: `# Mission 6: Sanctuary Recovery - Final Inspection
# -----------------------------------------------------------
# Habitat health ratings for Woodland, Burrow, Meadow, Pond:
habitats = [85, 92, 78, 95]
passed_habitats = 0

# TODO 1: Loop through each score in 'habitats'.
# If the score is >= 80, add 1 to passed_habitats:




# TODO 2: If passed_habitats is at least 3:
#     Set sanctuary_recovered = True
# Otherwise:
#     Set sanctuary_recovered = False
sanctuary_recovered = False



print("Habitats Passing:", passed_habitats)
print("Sanctuary Fully Recovered:", sanctuary_recovered)
`,
    hints: [
      "Hint 1: Write 'for score in habitats:' and indent an 'if score >= 80:' block inside.",
      "Hint 2: Inside that if block, write: passed_habitats = passed_habitats + 1",
      "Hint 3: After the loop (unindented), write 'if passed_habitats >= 3: sanctuary_recovered = True'"
    ],
    rewardXP: 100,
    restorationDelta: 17,
    validate: async (result, scope, rawCode) => {
      if (!result.isSuccess) {
        return { passed: false, message: result.error || "Syntax error in Python code." };
      }
      if (!scope || typeof scope !== "object") {
        return { passed: false, message: "Define passed_habitats and sanctuary_recovered." };
      }

      if (scope.passed_habitats !== 3) {
        return {
          passed: false,
          message: `Expected passed_habitats to be 3 (85, 92, and 95 are >= 80), but got ${scope.passed_habitats}.`
        };
      }

      if (scope.sanctuary_recovered !== true) {
        return {
          passed: false,
          message: "Expected sanctuary_recovered to be True because 3 habitats passed inspection!"
        };
      }

      // Dynamic test with failing habitat scores
      const testFail = rawCode.replace(/habitats\s*=\s*\[[^\]]+\]/, "habitats = [50, 60, 70, 95]");
      const resFail = await runPythonCode(testFail);
      const scopeFail = resFail.scope || extractPythonScope(testFail);

      if (scopeFail.passed_habitats !== 1 || scopeFail.sanctuary_recovered !== false) {
        return {
          passed: false,
          message: "Make sure you genuinely test each habitat and check passed_habitats >= 3! When only 1 habitat passes, sanctuary_recovered must be False."
        };
      }

      return {
        passed: true,
        message: "WILDWOOD SANCTUARY 100% RESTORED! Warm golden lanterns light the forest trails, flowers burst into bloom, healthy animals thrive in every habitat, and the portal to Level 2 (The Living Forest) awakens in full splendor!",
        actionPayload: { sanctuaryRestored: true, level1Complete: true }
      };
    }
  }
];

export const getWildwoodMissionByNum = (num) => {
  return WILDWOOD_MISSIONS.find((m) => m.num === Number(num)) || WILDWOOD_MISSIONS[0];
};
