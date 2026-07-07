// Single global namespace for the whole app.
window.App = window.App || {};

App.data = {
  title: "AI Workflows vs. AI Agents",
  subtitle: "Lesson 4 \u00b7 A hands-on tour of the AI factory"
};

App.data.scenesCopy = {
  hook: {
    heading: "AI Workflows vs. AI Agents",
    sub: "Welcome to the AI factory. Let's meet two very different workers.",
    cta: "Start the tour"
  },
  workflow: {
    heading: "The Assembly Line",
    sub: "An AI workflow follows fixed, predefined steps \u2014 the same path every time.",
    stations: ["Read request", "Pick top-rated film", "Add popcorn", "Set 8:00 PM"],
    takeaway: "People (code) design the steps in advance. Predictable and reliable \u2014 but it can only do what it was wired to do."
  },
  agentIntro: {
    heading: "Meet the Robot",
    sub: "An AI agent isn't bolted to a line. It has a goal and figures out the steps itself.",
    speech: "Give me a goal and I'll decide what to do!"
  },
  anatomy: {
    heading: "What's inside the agent?",
    sub: "Click each part of the robot."
  },
  loop: {
    heading: "The Loop in Action",
    sub: "Watch the robot plan movie night: think \u2192 act \u2192 look \u2192 remember, until the goal is met."
  },
  compare: {
    heading: "Same Job, Two Workers",
    sub: "Then something unexpected happens..."
  },
  when: {
    heading: "So, Which Do You Use?",
    sub: "Match the worker to the job."
  }
};

App.data.robotParts = [
  { key: "brain",  emoji: "\ud83e\udde0", part: "Brain",    concept: "LLM",
    blurb: "Thinks, reasons, and decides what to do next.",
    movie: "Decides that a cozy comedy beats a horror film on a rainy night." },
  { key: "eyes",   emoji: "\ud83d\udc40", part: "Eyes",     concept: "Perception / Input",
    blurb: "Reads the situation, looks things up, and sees the result of its actions.",
    movie: "Checks what's actually streaming right now and reads today's weather." },
  { key: "hands",  emoji: "\u270b", part: "Hands",    concept: "Tools",
    blurb: "Takes real actions: search, run code, call an API, send a message.",
    movie: "Opens the streaming app and adds the film to the watch list." },
  { key: "memory", emoji: "\ud83c\udf92", part: "Backpack", concept: "Memory",
    blurb: "Remembers the goal, past steps, and what it has learned.",
    movie: "Remembers that Sam is vegetarian and hates jump-scares." },
  { key: "goal",   emoji: "\ud83c\udfaf", part: "Antenna",  concept: "Goal",
    blurb: "The objective it is trying to achieve.",
    movie: "\"Plan a movie night everyone will enjoy tonight.\"" },
  { key: "loop",   emoji: "\ud83e\uddbf", part: "Legs",     concept: "The Loop",
    blurb: "Keeps going: think \u2192 act \u2192 look \u2192 repeat, until the goal is met.",
    movie: "First pick isn't streaming? It loops back and chooses another." }
];

App.data.movieNight = {
  goal: "Plan a movie night everyone will enjoy tonight",
  // Ordered steps the agent takes; each references a robot part for highlighting.
  loopSteps: [
    { part: "goal",   think: "Goal received: plan a movie night everyone enjoys tonight.",
      act: "", observe: "" },
    { part: "eyes",   think: "First I should see what's available and what the vibe is.",
      act: "Tool: check_weather()", observe: "It's cold and rainy tonight." },
    { part: "memory", think: "What do I know about the group?",
      act: "Tool: recall_preferences()", observe: "Sam: vegetarian, dislikes horror. Alex: loves comedies." },
    { part: "eyes",   think: "Now check what's actually streaming.",
      act: "Tool: search_streaming()", observe: "Available: a cozy comedy, a documentary, and a horror film." },
    { part: "brain",  think: "Rainy + no-horror + loves-comedy \u2192 the cozy comedy fits best.",
      act: "", observe: "Chosen film: the cozy comedy." },
    { part: "hands",  think: "Lock it in and match a snack.",
      act: "Tool: add_to_watchlist() + suggest_snack()", observe: "Film queued. Snack: veggie popcorn (Sam-friendly)." },
    { part: "loop",   think: "Goal check: film + snack chosen, everyone considered. Done!",
      act: "", observe: "\u2705 Movie night is planned." }
  ],
  // What the fixed assembly line produces regardless of context:
  assemblyOutput: ["Top-rated film = latest horror blockbuster", "Snack = plain popcorn", "Time = 8:00 PM"],
  // The unexpected change used in the comparison scene:
  twist: "Surprise: it's a cold rainy night AND Sam (vegetarian, hates horror) is coming.",
  assemblyResult: "The line still outputs a horror film + plain popcorn. It can't react \u2014 the steps were fixed. \u26a0\ufe0f Jam.",
  agentResult: "The robot notices the weather and Sam's tastes, loops, and picks the cozy comedy + veggie popcorn. \ud83c\udf89"
};

App.data.whenToUse = {
  workflow: ["Steps are known and repeatable", "You need predictable, identical results", "Speed, low cost, easy to audit", "e.g. send the same weekly report"],
  agent:    ["The path isn't known up front", "Inputs change and need judgment", "The task needs tools + decisions in a loop", "e.g. research a topic and summarize it"]
};
