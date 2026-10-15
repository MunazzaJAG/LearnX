export const LEVELS_DATA = [
  {
    level: 1,
    title: "FIRST DAY",
    subtitle: "print(), strings, and comments",
    chapter: "CHAPTER 01 · THE AWAKENING",
    biome: "Ocean Teal",
    biomeKey: "ocean",
    biomeName: "Undersea Reef",
    pythonDocTopic: "Built-in Functions (print), Strings (str) & Comments (#)",
    bloomsTaxonomy: "REMEMBER / UNDERSTAND / APPLY",
    story: "You arrive at the NEXA Ocean Research Hub. The terminal is blank. NOVA, your companion, asks you to send the first message to the system.",
    teach: "Python gives instructions to a computer. The print() function displays information on the screen. Text is written inside quotation marks. A comment begins with # and is ignored when Python runs the program.",
    codeTemplate: "# First message to NEXA\nprint(\"Welcome to NEXA\")\nprint(\"System Status: Online\")\n# This is a comment",
    challenge: "Restore communication with the NEXA Ocean Research Hub by sending your first Python messages.",
    expectedOutput: "Welcome to NEXA\nSystem Status: Online",
    hints: [
      "Hint 1: Use print(\"...\") to display text on the terminal screen.",
      "Hint 2: Enclose text in quotation marks, like \"Welcome to NEXA\".",
      "Hint 3: Lines starting with # are comments and will not appear in the terminal output."
    ],
    rewardXP: 50,
    badge: { id: "first_line", name: "First Line", icon: "🌊", description: "Make the terminal speak. Complete mission 1: first day." },
    novaTip: "Every line begins with curiosity. Let's light up this console.",
    subLevels: [
      {
        id: 1,
        title: "Predict the Transmission",
        type: "analyze",
        description: "Trace short Python snippets and predict the output before running."
      },
      {
        id: 2,
        title: "Repair the Broken Terminal",
        type: "apply",
        description: "Diagnose and fix syntax errors in a malfunctioning terminal script."
      },
      {
        id: 3,
        title: "Write Your First Transmission",
        type: "apply",
        description: "Compose custom Python statements with your explorer name and comments."
      },
      {
        id: 4,
        title: "Boss Battle: Restore NEXA",
        type: "create",
        description: "Write three print statements to revive the NEXA Ocean Research Hub."
      }
    ]
  },
  {
    level: 2,
    title: "IDENTITY",
    subtitle: "Variables and basic data types",
    chapter: "CHAPTER 01 · THE AWAKENING",
    biome: "Ocean Teal",
    biomeKey: "ocean",
    biomeName: "Undersea Reef",
    pythonDocTopic: "Built-in Types (str, int, float, bool) & Variable Assignment (=)",
    bloomsTaxonomy: "REMEMBER / UNDERSTAND / APPLY / CREATE",
    story: "The terminal is online, but NEXA cannot identify its explorer. Save your player details in variables to create an identity card.",
    teach: "Variables store data values in memory using the assignment operator =. Python recognizes strings (str), integers (int), decimals (float), and booleans (bool). Print stored values by passing variable names to print().",
    codeTemplate: "name = \"Alex\"\nage = 18\nxp = 50\nis_explorer = True\n\nprint(\"Name:\", name)\nprint(\"Age:\", age)\nprint(\"XP:\", xp)\nprint(\"Explorer:\", is_explorer)",
    challenge: "Save your player details in variables to create an identity card and display them with clear labels.",
    expectedOutput: "Name: Alex\nAge: 18\nXP: 50\nExplorer: True",
    hints: [
      "Hint 1: Use the '=' operator to store data, like name = \"Alex\".",
      "Hint 2: Text uses quotes (\"Alex\"), whole numbers don't (18), and booleans are True or False.",
      "Hint 3: Use print(\"Label:\", variable_name) to display formatted values."
    ],
    rewardXP: 50,
    badge: { id: "identity_found", name: "Identity Found", icon: "🆔", description: "Save player details in variables to create an identity card. Complete mission 2: identity." },
    novaTip: "Every developer has a story. Let's give yours a name and role in NEXA.",
    subLevels: [
      {
        id: 1,
        title: "Recover the Explorer Data",
        type: "analyze",
        description: "Inspect incomplete explorer data and predict variable assignments."
      },
      {
        id: 2,
        title: "Match the Data Type",
        type: "understand",
        description: "Classify sample Python values into str, int, float, and bool types."
      },
      {
        id: 3,
        title: "Build Your Identity Card",
        type: "apply",
        description: "Write Python code storing name, language, and starting XP."
      },
      {
        id: 4,
        title: "Boss Battle: Identity Found",
        type: "create",
        description: "Construct and test a full Explorer Identity Card with at least three variables."
      }
    ]
  },
  {
    level: 3,
    title: "SECURITY GATE",
    subtitle: "input() and int() type conversion",
    chapter: "CHAPTER 02 · LIVING ECOSYSTEM",
    biome: "Forest Green",
    biomeKey: "forest",
    biomeName: "Eco Woods",
    pythonDocTopic: "User Input (input) & Type Conversion (int)",
    bloomsTaxonomy: "UNDERSTAND / APPLY / CREATE",
    story: "You stand before the towering Ancient Gate of Eco Woods. Conduits run dark across the roots. To open the gate, the forest security mechanism requires interactive input and an integer clearance level.",
    teach: "The input() function prompts the user for text input and always returns a string. Use int() to convert numeric strings to integers for calculations and comparisons.",
    codeTemplate: "# Open the Ancient Gate\nname = input(\"Enter explorer name: \")\nlevel = int(input(\"Enter clearance level: \"))\nprint(\"Access Granted:\", name)\nprint(\"Security Level:\", level)",
    challenge: "Capture an explorer name with input() and clearance level with int(input()), then print verification lines.",
    expectedOutput: "Access Granted: Alex\nSecurity Level: 2",
    hints: [
      "Hint 1: Use name = input(\"Enter explorer name: \") to capture text.",
      "Hint 2: Wrap the numeric prompt in int(), like level = int(input(\"Enter clearance level: \")).",
      "Hint 3: Use print(\"Access Granted:\", name) and print(\"Security Level:\", level)."
    ],
    rewardXP: 60,
    badge: { id: "gate_opener", name: "Gate Opener", icon: "🚪", description: "Use input() and int() to open the ancient forest gate. Complete Mission 3: Security Gate." },
    novaTip: "Remember: input() always returns text! When numbers are needed for math or comparison, cast it with int().",
    subLevels: [
      {
        id: 1,
        title: "Activate the Forest Gate",
        type: "game",
        description: "Interactive terminal input that wakes the ancient gate conduits."
      },
      {
        id: 2,
        title: "Text or Number?",
        type: "understand",
        description: "Classify inputs into string (str) or integer (int) data types."
      },
      {
        id: 3,
        title: "Repair the Access Scanner",
        type: "analyze",
        description: "Diagnose and fix unconverted string input in calculation errors."
      },
      {
        id: 4,
        title: "Build Access Request",
        type: "apply",
        description: "Capture explorer name and increment numeric clearance with int()."
      },
      {
        id: 5,
        title: "Boss Battle: Open the Ancient Gate",
        type: "create",
        description: "Combine input() and int() to unlock the passage into the Living Forest."
      }
    ]
  },
  {
    level: 4,
    title: "USER TERMINAL",
    subtitle: "Branching logic with if, elif, and else",
    chapter: "CHAPTER 02 · LIVING ECOSYSTEM",
    biome: "Forest Green",
    biomeKey: "forest",
    biomeName: "Eco Woods",
    pythonDocTopic: "Conditional Statements (if, elif, else) & Comparison Operators (==, !=, <, >, <=, >=)",
    bloomsTaxonomy: "APPLY / ANALYZE / EVALUATE / CREATE",
    story: "Beyond the Security Gate lies the Ancient User Terminal of the Living Forest. The trail divides into three paths: Canopy Route, Undergrowth Trail, and Deep Grove. Use conditional logic to direct explorers based on their XP score.",
    teach: "Conditional statements execute code blocks only if conditions evaluate to True. Use if, elif, and else with comparison operators like ==, !=, <, >, <=, and >=. Remember the colon ':' and 4-space indentation.",
    codeTemplate: "# Direct the Explorer\nxp = 75\n\nif xp < 50:\n    print(\"Rank: Scout\")\nelif xp < 100:\n    print(\"Rank: Ranger\")\nelse:\n    print(\"Rank: Guardian\")",
    challenge: "Write a three-tier rank system with if, elif, and else that assigns Scout for XP < 50, Ranger for XP < 100, and Guardian for XP >= 100.",
    expectedOutput: "Rank: Ranger",
    hints: [
      "Hint 1: Use 'if xp < 50:' for the first tier.",
      "Hint 2: Use 'elif xp < 100:' for the middle tier (evaluates when xp >= 50).",
      "Hint 3: Use 'else:' for explorers with 100 XP or higher."
    ],
    rewardXP: 60,
    badge: { id: "logic_navigator", name: "Logic Navigator", icon: "🧭", description: "Use if, elif, and else to navigate forest routes. Complete Mission 4: User Terminal." },
    novaTip: "Python checks conditions from top to bottom. As soon as one matches, its block runs and the rest are bypassed.",
    subLevels: [
      {
        id: 1,
        title: "Choose the Forest Path",
        type: "game",
        description: "Select pathways based on clearance level and XP thresholds."
      },
      {
        id: 2,
        title: "Condition Detective",
        type: "understand",
        description: "Evaluate comparison expressions across edge cases to determine True/False."
      },
      {
        id: 3,
        title: "Repair Branching Terminal",
        type: "analyze",
        description: "Fix broken if/elif ordering, syntax errors, and missing colons."
      },
      {
        id: 4,
        title: "Build Three-Rank System",
        type: "apply",
        description: "Construct tiered logic and verify across edge test scores."
      },
      {
        id: 5,
        title: "Boss Battle: Restore Forest Routes",
        type: "create",
        description: "Complete full multi-branch terminal script tested against boundary cases (0, 49, 50, 99, 100, 100+)."
      }
    ]
  },
  {
    level: 5,
    title: "AUTOMATION",
    subtitle: "Automate repeating tasks",
    chapter: "CHAPTER 03 · THE ANCIENT ARCHIVE",
    biome: "Sand Gold",
    biomeKey: "canyon",
    biomeName: "Canyon Vault",
    pythonDocTopic: "Control Flow (for statements) & built-in range() function",
    bloomsTaxonomy: "APPLY",
    story: "You enter the Canyon Vault. Thousands of corrupted backup logs need scanning. Manual checking is impossible.",
    teach: "A `for` loop iterates over a sequence. `range(start, stop)` generates a sequence of numbers from start up to (but not including) stop. For example, `range(1, 6)` generates 1, 2, 3, 4, 5.",
    codeTemplate: "for i in range(1, 6):\n    print(\"Scanning file\", i)",
    challenge: "Write a for loop using range() to print 'Scanning file 1' through 'Scanning file 5'.",
    expectedOutput: "Scanning file 1\nScanning file 2\nScanning file 3\nScanning file 4\nScanning file 5",
    hints: [
      "Hint 1: range(1, 6) generates numbers 1 through 5.",
      "Hint 2: Loop structure: for i in range(1, 6):",
      "Hint 3: print(\"Scanning file\", i)"
    ],
    rewardXP: 125,
    badge: { id: "loop_pioneer", name: "Loop Pioneer", icon: "🔁", description: "Automate repeating tasks. Complete mission 5: automation." },
    novaTip: "Computers never tire of repeating steps. A loop transforms 100 lines into 2.",
    subLevels: [
      {
        id: 1,
        title: "Vault Excavator Loop Runner",
        type: "game",
        description: "Program a robotic rover to navigate canyon tracks using loop commands."
      },
      {
        id: 2,
        title: "Batch File Scanner",
        type: "code",
        description: "Use for and range to scan archived files in sequence."
      },
      {
        id: 3,
        title: "Accumulator Calculation",
        type: "mastery",
        description: "Sum energy values across all scanned archive sectors."
      }
    ]
  },
  {
    level: 6,
    title: "DATA RECOVERY",
    subtitle: "Manage ordered data",
    chapter: "CHAPTER 03 · THE ANCIENT ARCHIVE",
    biome: "Sand Gold",
    biomeKey: "canyon",
    biomeName: "Canyon Vault",
    pythonDocTopic: "Data Structures (Lists, sequence indexing, list.append(), list.remove())",
    bloomsTaxonomy: "APPLY / ANALYZE",
    story: "Inside the Vault database, scattered employee records are stored in memory lists. You need to clean and update them.",
    teach: "Lists are mutable, ordered sequences enclosed in brackets `[]`. Indexing starts at `0`. Use `.append(item)` to add an element to the end and `.remove(item)` to delete items. Access elements using `list[index]`.",
    codeTemplate: "employees = [\"Aisha\", \"Rahul\", \"Zoya\"]\nemployees.append(\"Arjun\")\nprint(employees[0])\nprint(len(employees))",
    challenge: "Append 'Arjun' to the `employees` list, then print the first employee name and the total list count.",
    expectedOutput: "Aisha\n4",
    hints: [
      "Hint 1: Use list.append(\"Arjun\") to add to the end.",
      "Hint 2: Index zero employees[0] accesses the first element.",
      "Hint 3: Use print(employees[0]) and print(len(employees))."
    ],
    rewardXP: 150,
    badge: { id: "data_wrangler", name: "Data Wrangler", icon: "📊", description: "Manage ordered data. Complete mission 6: data recovery." },
    novaTip: "Data organized in lists unlocks true computing power. Indexing is your map.",
    subLevels: [
      {
        id: 1,
        title: "Memory Crystal Sorting",
        type: "game",
        description: "Arrange scrambled data crystals in proper zero-indexed memory slots."
      },
      {
        id: 2,
        title: "Roster List Mutation",
        type: "code",
        description: "Add new crew entries to the vault array using append and retrieve by index."
      },
      {
        id: 3,
        title: "Sub-array Slicing",
        type: "mastery",
        description: "Extract slices of the archive list for forensic telemetry."
      }
    ]
  },
  {
    level: 7,
    title: "CODE BUILDER",
    subtitle: "Modular reusable functions",
    chapter: "CHAPTER 04 · HIGH ALTITUDE UPTIME",
    biome: "Alpine Slate",
    biomeKey: "alpine",
    biomeName: "Mountain Pass",
    pythonDocTopic: "Defining Functions (def), Parameters, Arguments & Return Statements",
    bloomsTaxonomy: "APPLY / ANALYZE",
    story: "Reaching the Mountain Pass server, you find the codebase filled with redundant code. NOVA demands clean modularity.",
    teach: "Functions are defined with `def function_name(parameters):`. They encapsulate reusable logic and send results back using `return`. Call functions by providing arguments in parentheses: `result = function_name(arg)`.",
    codeTemplate: "def greet(name):\n    return \"Welcome \" + name\n\nmessage = greet(\"Alex\")\nprint(message)",
    challenge: "Define a function `greet(name)` that returns 'Welcome ' + name, then print the result for 'Alex'.",
    expectedOutput: "Welcome Alex",
    hints: [
      "Hint 1: Use 'def greet(name):' to declare the function.",
      "Hint 2: Use return statement inside the function.",
      "Hint 3: Call greet(\"Alex\") and print the result."
    ],
    rewardXP: 175,
    badge: { id: "code_builder", name: "Code Builder", icon: "🧩", description: "Modular reusable functions. Complete mission 7: code builder." },
    novaTip: "Write once, reuse everywhere. Functions are the building blocks of clean architecture.",
    subLevels: [
      {
        id: 1,
        title: "Relay Function Synthesizer",
        type: "game",
        description: "Connect altitude sensor pipelines through modular transformation blocks."
      },
      {
        id: 2,
        title: "Constructing Modular Logic",
        type: "code",
        description: "Define a clean function that takes parameters and returns greeting strings."
      },
      {
        id: 3,
        title: "Parameterized Altitude Math",
        type: "mastery",
        description: "Create numerical telemetry functions with default parameters."
      }
    ]
  },
  {
    level: 8,
    title: "ERROR DETECTOR",
    subtitle: "Handle system exceptions",
    chapter: "CHAPTER 04 · HIGH ALTITUDE UPTIME",
    biome: "Alpine Slate",
    biomeKey: "alpine",
    biomeName: "Mountain Pass",
    pythonDocTopic: "Errors and Exceptions (try, except blocks)",
    bloomsTaxonomy: "ANALYZE / EVALUATE",
    story: "Unstable subroutines keep crashing when bad data enters the Mountain node. Build exception shields to maintain uptime.",
    teach: "The `try` block lets you test code for errors. The `except` block catches and handles errors gracefully without crashing the whole application. You can catch specific exceptions like `ValueError` or `TypeError`.",
    codeTemplate: "try:\n    age = int(\"invalid_number\")\nexcept ValueError:\n    print(\"Invalid age input detected\")",
    challenge: "Wrap string parsing in a try-except block to catch ValueError and print 'Invalid age input detected'.",
    expectedOutput: "Invalid age input detected",
    hints: [
      "Hint 1: Put dangerous code inside 'try:'",
      "Hint 2: Catch specific errors with 'except ValueError:'",
      "Hint 3: Print error message inside the except block."
    ],
    rewardXP: 200,
    badge: { id: "debugger", name: "Debugger", icon: "🐛", description: "Handle system exceptions. Complete mission 8: error detector." },
    novaTip: "Bugs happen to every programmer. Graceful handling turns failures into resilient recoveries.",
    subLevels: [
      {
        id: 1,
        title: "Surge Shield Defense",
        type: "game",
        description: "Absorb voltage surges with try-catch circuit breakers before systems trip."
      },
      {
        id: 2,
        title: "Graceful Exception Trap",
        type: "code",
        description: "Catch ValueError parsing errors without letting the system crash."
      },
      {
        id: 3,
        title: "Division-by-Zero Guard",
        type: "mastery",
        description: "Handle ZeroDivisionError and provide safe default telemetry values."
      }
    ]
  },
  {
    level: 9,
    title: "GRID ARCHITECTURE",
    subtitle: "Map urban data with dictionaries",
    chapter: "CHAPTER 05 · URBAN INFRASTRUCTURE",
    biome: "Metro Coral",
    biomeKey: "city",
    biomeName: "Metro Grid",
    pythonDocTopic: "Mapping Types (dict, key-value pairs, get(), items())",
    bloomsTaxonomy: "APPLY / ANALYZE",
    story: "You arrive at Metro Grid. The municipal central computer needs organized key-value mappings to monitor power substations and traffic flow.",
    teach: "Dictionaries (`dict`) store data as key-value pairs inside curly braces `{}`. Keys must be unique strings or numbers. Access values with `dict[key]` or `dict.get(key)`. Add or update items using `dict[key] = value`.",
    codeTemplate: "# Metro sector database\ngrid = {\n    \"sector\": \"Downtown\",\n    \"power\": True,\n    \"units\": 42\n}\n\ngrid[\"status\"] = \"Operational\"\nprint(grid[\"sector\"])\nprint(grid[\"status\"])",
    challenge: "Build the sector dictionary, set grid['status'] = 'Operational', and print both grid['sector'] and grid['status'].",
    expectedOutput: "Downtown\nOperational",
    hints: [
      "Hint 1: Define key-value pairs using 'key': value syntax.",
      "Hint 2: Add new keys with grid['status'] = 'Operational'.",
      "Hint 3: Print each property on separate lines."
    ],
    rewardXP: 225,
    badge: { id: "system_architect", name: "System Architect", icon: "🏙️", description: "Map urban data with dictionaries. Complete mission 9: grid architecture." },
    novaTip: "Dictionaries are the blueprints of modern software. With keys, instant lookups take zero effort.",
    subLevels: [
      {
        id: 1,
        title: "Smart Grid Dispatcher",
        type: "game",
        description: "Switch power substations on and off across the Metro Grid network."
      },
      {
        id: 2,
        title: "Sector Dictionary Mapping",
        type: "code",
        description: "Store municipal sector attributes and update online operational status."
      },
      {
        id: 3,
        title: "Nested Municipal Lookups",
        type: "mastery",
        description: "Traverse nested dictionaries to retrieve sub-grid load metrics."
      }
    ]
  },
  {
    level: 10,
    title: "ALGORITHMIC ROUTING",
    subtitle: "Filter and transform city streams",
    chapter: "CHAPTER 05 · URBAN INFRASTRUCTURE",
    biome: "Metro Coral",
    biomeKey: "city",
    biomeName: "Metro Grid",
    pythonDocTopic: "List Comprehensions & Data Filtering ([x for x in list if ...])",
    bloomsTaxonomy: "ANALYZE / EVALUATE",
    story: "Traffic flow around Metro Grid has bottlenecked. The routing engine must filter high-congestion zones in real time using list comprehensions.",
    teach: "List comprehensions provide a concise way to create lists based on existing lists: `[expression for item in iterable if condition]`. They run faster and are much cleaner than traditional loops.",
    codeTemplate: "traffic_scores = [25, 80, 45, 95, 30, 88]\n# Filter congested sectors (score > 50)\ncongested = [score for score in traffic_scores if score > 50]\nprint(\"Congested sectors:\", len(congested))",
    challenge: "Filter traffic_scores to only include values greater than 50, then print 'Congested sectors: ' followed by the count.",
    expectedOutput: "Congested sectors: 3",
    hints: [
      "Hint 1: Use [score for score in traffic_scores if score > 50]",
      "Hint 2: Count items using len(congested)",
      "Hint 3: print(\"Congested sectors:\", len(congested))"
    ],
    rewardXP: 250,
    badge: { id: "algorithmic_master", name: "Algorithmic Master", icon: "🚦", description: "Filter and transform city streams. Complete mission 10: algorithmic routing." },
    novaTip: "Comprehensions are Python's superpower. Filtering and transforming happen in one elegant breath.",
    subLevels: [
      {
        id: 1,
        title: "Drone Corridor Routing",
        type: "game",
        description: "Clear flight corridors by filtering out high-turbulence waypoints."
      },
      {
        id: 2,
        title: "Congestion Filtering",
        type: "code",
        description: "Filter critical sector data points with a clean list comprehension."
      },
      {
        id: 3,
        title: "Data Transformation Pipeline",
        type: "mastery",
        description: "Double speed limits in cleared sectors using comprehension transforms."
      }
    ]
  },
  {
    level: 11,
    title: "QUANTUM SYNTHESIS",
    subtitle: "Architect Object-Oriented systems",
    chapter: "CHAPTER 06 · RESTORING CONSCIOUSNESS",
    biome: "Glacier Blue",
    biomeKey: "glacier",
    biomeName: "Frost Core",
    pythonDocTopic: "Classes and Objects (class, __init__, self, methods)",
    bloomsTaxonomy: "CREATE",
    story: "You descend into the subterranean Frost Core. Sub-zero cryogenic quantum modules require reusable Class blueprints to maintain stabilization.",
    teach: "Classes are blueprints for creating objects. Define a class with `class Name:`. The `__init__(self, ...)` constructor method initializes instance variables. Methods are functions defined inside a class that take `self` as their first parameter.",
    codeTemplate: "class QuantumCore:\n    def __init__(self, name, temp):\n        self.name = name\n        self.temp = temp\n        self.active = False\n\n    def boot(self):\n        self.active = True\n        return self.name + \" online at \" + str(self.temp) + \"K\"\n\ncore = QuantumCore(\"Alpha\", 4.2)\nprint(core.boot())",
    challenge: "Define the QuantumCore class with __init__ and boot() method, instantiate 'Alpha' at 4.2K, and print the boot message.",
    expectedOutput: "Alpha online at 4.2K",
    hints: [
      "Hint 1: Define 'class QuantumCore:' with constructor 'def __init__(self, name, temp):'.",
      "Hint 2: Inside boot(self), set self.active = True and return the status string.",
      "Hint 3: Call print(core.boot()) on your created instance."
    ],
    rewardXP: 275,
    badge: { id: "object_pioneer", name: "Object Pioneer", icon: "❄️", description: "Architect Object-Oriented systems. Complete mission 11: quantum synthesis." },
    novaTip: "Classes give life to modular thinking. Once you model the world in objects, any project is within reach.",
    subLevels: [
      {
        id: 1,
        title: "Quantum Reactor Assembly",
        type: "game",
        description: "Assemble containment magnetic rings and calibrate reactor core attributes."
      },
      {
        id: 2,
        title: "Constructing the Core Blueprint",
        type: "code",
        description: "Write the QuantumCore class with constructor and initialization methods."
      },
      {
        id: 3,
        title: "Dual Core Synchronization",
        type: "mastery",
        description: "Instantiate primary and backup cryogenic cores and synchronize their telemetry."
      }
    ]
  },
  {
    level: 12,
    title: "NEXA RESTORE CAPSTONE",
    subtitle: "Build the autonomous restoration engine",
    chapter: "CHAPTER 06 · RESTORING CONSCIOUSNESS",
    biome: "Glacier Blue",
    biomeKey: "glacier",
    biomeName: "Frost Core",
    pythonDocTopic: "Final Capstone Project: End-to-End Integrated Application Architecture",
    bloomsTaxonomy: "CREATE / SYNTHESIZE",
    story: "The final summit! NOVA stands before the central quantum pillar. All 6 biomes are waiting for the final master program. You will construct the NEXA Restoration Engine combining all concepts learned: variables, conditionals, loops, lists, dictionaries, functions, and classes to permanently restore NEXA!",
    teach: "Congratulations on reaching Level 12! Real-world software brings all Python tools together. In this capstone, you will construct a complete `NexaRestoration` class that aggregates biome sensors, loops over data streams, validates safety limits, and outputs the continental restoration diagnostic.",
    codeTemplate: "class NexaRestoration:\n    def __init__(self, explorer_name):\n        self.explorer = explorer_name\n        self.biomes = [\"Ocean\", \"Forest\", \"Canyon\", \"Alpine\", \"City\", \"Glacier\"]\n        self.telemetry = {}\n\n    def restore(self):\n        print(\"Restoration initiated by:\", self.explorer)\n        for b in self.biomes:\n            self.telemetry[b] = \"100% OK\"\n            print(\"Biome restored:\", b)\n        print(\"NEXA Continent fully back to life!\")\n\nsystem = NexaRestoration(\"Alex\")\nsystem.restore()",
    challenge: "Complete and execute the full NexaRestoration project. Restore all 6 biomes and output the final continental revival diagnostic.",
    expectedOutput: "Restoration initiated by: Alex\nBiome restored: Ocean\nBiome restored: Forest\nBiome restored: Canyon\nBiome restored: Alpine\nBiome restored: City\nBiome restored: Glacier\nNEXA Continent fully back to life!",
    hints: [
      "Hint 1: Instantiate NexaRestoration with explorer name 'Alex'.",
      "Hint 2: The restore() method loops through the 6 biomes and prints status for each.",
      "Hint 3: Ensure 'NEXA Continent fully back to life!' is printed as the final line."
    ],
    rewardXP: 500,
    badge: { id: "nexa_savior", name: "NEXA Savior Capstone", icon: "👑", description: "Build the autonomous restoration engine. Complete Level 12 Capstone Project!" },
    novaTip: "You did it, Explorer! From your first print statement to architecting a complete system. You are ready to build whatever you imagine.",
    subLevels: [
      {
        id: 1,
        title: "Continental Diagnostic Architecture",
        type: "game",
        description: "Engage the master quantum console and monitor all 6 biomes synchronizing."
      },
      {
        id: 2,
        title: "Capstone Restoration Engine",
        type: "code",
        description: "Assemble the complete multi-component Python class and run the restoration sequence."
      },
      {
        id: 3,
        title: "Explorer Graduation & Certification",
        type: "mastery",
        description: "Conduct final system diagnostic verification and receive developer credentials."
      }
    ]
  }
];

export const BIOMES = [
  {
    key: "all",
    name: "All biomes",
    color: "#2A6B53",
    tagColor: "bg-stone-100 text-stone-700",
    description: "Explore the full NEXA continent across all 6 ecosystems."
  },
  {
    key: "ocean",
    name: "Ocean",
    title: "Undersea Reef",
    color: "#2A9D8F",
    tagColor: "bg-[#E6F5F4] text-[#1E7268]",
    tagBg: "#E6F5F4",
    missions: [1, 2],
    description: "Submerged research dome where NEXA core communication was lost."
  },
  {
    key: "forest",
    name: "Forest",
    title: "Eco Woods",
    color: "#2D6A4F",
    tagColor: "bg-[#E8F5E9] text-[#1F543D]",
    tagBg: "#E8F5E9",
    missions: [3, 4],
    description: "Bioluminescent canopy sheltering environmental calibration sensors."
  },
  {
    key: "canyon",
    name: "Canyon",
    title: "Canyon Vault",
    color: "#C98B4B",
    tagColor: "bg-[#FEF8EE] text-[#915B25]",
    tagBg: "#FEF8EE",
    missions: [5, 6],
    description: "Sun-drenched sandstone vaults guarding long-forgotten data archives."
  },
  {
    key: "alpine",
    name: "Alpine",
    title: "Mountain Pass",
    color: "#5E6B7A",
    tagColor: "bg-[#EEF2F7] text-[#3D4754]",
    tagBg: "#EEF2F7",
    missions: [7, 8],
    description: "High-altitude relay stations exposed to severe weather and raw telemetry."
  },
  {
    key: "city",
    name: "City",
    title: "Metro Grid",
    color: "#DD6245",
    tagColor: "bg-[#FDF1ED] text-[#963720]",
    tagBg: "#FDF1ED",
    missions: [9, 10],
    description: "Automated urban metropolis with algorithmic traffic routing and municipal databases."
  },
  {
    key: "glacier",
    name: "Glacier",
    title: "Frost Core",
    color: "#3F819A",
    tagColor: "bg-[#EAF5F9] text-[#23586B]",
    tagBg: "#EAF5F9",
    missions: [11, 12],
    description: "Sub-zero quantum computer core holding the central NEXA consciousness and Capstone Project."
  }
];

export const BLOOM_LEVELS = [
  { key: "remember_understand", label: "Remember & understand", missions: "Missions 1–2", active: true },
  { key: "apply", label: "Apply your knowledge", missions: "Missions 3–6", active: true },
  { key: "analyze_evaluate", label: "Analyze & evaluate", missions: "Missions 7–10", active: true },
  { key: "create", label: "Create something new (Capstone)", missions: "Missions 11–12", active: true }
];
