# First Playable Web Game Brief

> This summary and the accompanying system graph are the two primary development references. Build from both. If they conflict, preserve the learning goal and ask the student before changing the core design.

## 1. Project Identity
- Student / Team: CJ
- Project Title: CAT
- Domain: Raising multiple cats
- Tool / AI Agent: Codex / Claude Code

## 2. Design Summary
**Domain and real experience:** Raise multiple cats。

I've raised three cats, and each one has a completely different personality. Living with them, I realized 'raising cats' isn't one task, it's constantly balancing three different sets of needs at once.

**Novice misconception:** Beginners often misunderstand a cat's avoidance as the cat disliking them or being naturally distant, when the real issue is usually how they approach the cat :  direct eye contact, sudden movement, or forcing physical contact. The same cat that hides from one approach will often relax and come closer with a different one.

**Most important domain challenge:** The core challenge is judgment under limited time and attention, figuring out what each cat actually needs (food, play, space, affection) with incomplete information, since cats can't tell you directly, and then deciding how to divide limited time and resources fairly among three cats with different, sometimes conflicting needs.

Beginners often misread vomiting as always urgent and immediately switch the cat's food, when it's frequently just a hairball or eating too fast , an unnecessary food change can cause more stress. Beginners also often get night meowing wrong by immediately feeding the cat to make it stop, which actually trains the cat to meow louder and more often for food at night.

**Core learning shift:** Beginners think caring for cats means giving as much closeness and attention as possible; experts know it means reading each cat's individual signals and limited resources, and adjusting time, food, and space to fit three different, sometimes conflicting needs.

## 3. Core Player Learning Loop
**Observe:** The player needs to observe: each cat's appetite (how much and how fast they eat), litter box usage and frequency, activity level and play behavior, body language (tail position, ears, posture), proximity and reactions to the player and other cats, sleeping locations, and any signs of tension, hiding, or conflict between the cats.

**Judge:** The player needs to judge: whether the current approach to a cat is working or needs to be adjusted, whether one cat currently needs extra attention more than the others, whether time and resources should be split evenly across the three cats or shifted toward whichever needs it most, whether a cat's behavior is a genuine need or just a surface-level want, which situations are urgent and which can wait, and whether an action that solves the immediate problem might create a worse habit or outcome later.

**Act:** The player can feed a specific cat, refill or clean litter boxes, initiate play with a chosen cat, pet or approach a cat, give a cat space by staying away, separate cats during conflict, provide extra toys or resources, adjust feeding schedule or food type, and choose which cat to prioritize when multiple needs happen at once.

**Read feedback:** The cats' behavior changes visibly based on player choices: a well-cared-for cat approaches the player more often, purrs, or relaxes its body language, while a neglected or mishandled cat hides, avoids the player, or shows stress signals like flattened ears. Food bowls stay empty longer if feeding is delayed, litter boxes get dirtier without cleaning, and tension between cats increases (hissing, avoiding shared spaces) if their needs go unmet. A relationship or trust indicator can also rise or fall depending on how the player treats each cat.

**Adjust:** If a cat hides or avoids the player, give it space and approach more slowly next time. If a food bowl stays untouched, try a different food type rather than assuming something is wrong. If a cat meows persistently at night, check for unmet needs first rather than feeding it immediately, since feeding on demand can train the cat to meow more. If tension between cats increases, separate them and add more resources like extra litter boxes or toys. If a cat's trust indicator drops, reduce forced interaction and let the cat initiate contact instead.

**Ability improved through repetition:** "The player becomes better at reading each individual cat's personality and preferences, recognizing subtle behavioral signals before they become problems, judging whether a cat's reaction is normal or a sign of stress, and balancing attention and resources across multiple cats with different needs, instead of treating every cat the same way.

## 4. Data Model for the System Graph

### Environment Data
- The player needs to observe: each cat's appetite (how much and how fast they eat), litter box usage and frequency, activity level and play behavior, body language (tail position, ears, posture), proximity and reactions to the player and other cats, sleeping locations, and any signs of tension, hiding, or conflict between the cats.

### Player-Controlled Data
- The player can feed a specific cat, refill or clean litter boxes, initiate play with a chosen cat, pet or approach a cat, give a cat space by staying away, separate cats during conflict, provide extra toys or resources, adjust feeding schedule or food type, and choose which cat to prioritize when multiple needs happen at once.

### System-Calculated Results
- The cats' behavior changes visibly based on player choices: a well-cared-for cat approaches the player more often, purrs, or relaxes its body language, while a neglected or mishandled cat hides, avoids the player, or shows stress signals like flattened ears. Food bowls stay empty longer if feeding is delayed, litter boxes get dirtier without cleaning, and tension between cats increases (hissing, avoiding shared spaces) if their needs go unmet. A relationship or trust indicator can also rise or fall depending on how the player treats each cat.

### Feedback Translation
- Vocal sounds: come from the cat itself; tell the player whether a need is currently unmet (persistent meowing) or whether the current interaction is working well (purring). Appears as distinct sound effects — a repeated meow with a small exclamation icon for unmet needs, or a purring sound with a soft heart icon when the cat is content.
- Environment object states: come from food bowls, litter boxes, and toys/scratching posts; tell the player whether feeding, cleaning, or play needs have been neglected. Appears as a visibly full food bowl over time, a litter box icon changing color when it needs cleaning, and a scratching post showing little to no wear if the cat's energy hasn't been released.
- Body language and appearance: come from the cat's animation state and visual condition; tell the player the cat's overall emotional and physical wellbeing — relaxed versus stressed posture, glossy versus messy fur (a sign of neglected self-grooming from stress), and how close or distant cats choose to sit near each other. Appears as distinct idle animations, fur texture/shine changes, and spatial positioning between cats that the player can read without any UI text.

## 5. Challenge Space
**Challenge factors (affecting player-controlled data):** How the player approaches a cat (gentle vs. forced) ← that cat's personality/tolerance profile.
Which cat the player chooses to feed first ← each cat's current hunger level and how urgently they're meowing.
Whether the player cleans the litter box now or later ← how much time has passed and how dirty it currently is.
Whether the player intervenes in a conflict ← how close together the cats are and how long tension has been building.
How much time the player spends with one cat vs. another ← the total daily time budget and how many cats currently have unmet needs at once.

**Factors that force a new judgment:** Multiple cats needing attention at once, a cat whose personality is opposite to what the player expects, and unclear signals with no obvious cause force the player to judge under incomplete information instead of relying on a known rule.

**Perceivable vs inferred factors:** A cat's appetite and litter box cleanliness are directly visible; each cat's personal tolerance for closeness must be inferred from persistent trust changes.

**Challenge dimension table:** A cat's appetite and litter box cleanliness are directly visible; each cat's personal tolerance for closeness must be inferred from persistent trust changes.

**2-3 progressive challenge combinations:** One cat, clear need (single hungry cat meowing): learn to recognize a basic need signal and respond correctly by feeding.

Two cats, competing needs (one hungry, one wanting to play, at the same time): learn to prioritize and allocate limited time between two valid but different needs.

Multiple cats, one with mismatched approach + rising tension (a shy cat reacting badly to the player's usual approach while two other cats start showing tension toward each other): learn to infer an individual cat's hidden tolerance while simultaneously managing group-level conflict.

**Simple-to-complex sequence:** Yes: one cat with a clear need → two cats with competing needs → three cats with mismatched approach and rising tension, from single-factor to multi-factor.

**What failure teaches next:** Yes: persistent meowing means an unmet need was missed; a cat hiding or hissing means the approach didn't match its tolerance; rising tension between cats means intervention was delayed too long.

## 6. Visual & Camera
**Camera perspective:** Top-down, to see all three cats, their positions, and the shared living space at once.

**Why this perspective fits the learning shift:** Balancing three cats' needs requires seeing all three cats' positions and states at once; top-down puts them on one plane for comparison.

**2D / 2.5D / 3D:** 2.5D. A 3D house environment viewed from a fixed top-down angle keeps the space readable and simple to build, while still letting each cat's animation and body language be clearly visible.

**Visual style:** Hand-drawn style, warm and soft, prioritizing emotional readability in each cat's expression.

**Color tone:** bright / warm

**Sound:** Meowing signals an unmet need; purring signals contentment; a soft, relaxed ambient tone plays when all cats are calm.

## 7. AI Collaboration Boundary
**Student-owned decisions (AI must not change):** Core mechanic (read and respond to each cat's individual signals), core learning shift, success/fail conditions, core variables (hunger/trust/stress).

**AI-autonomous decisions:** HTML 
code structure, visual polish, sound implementation

**How to detect and pull back a generic game:** If the AI turns it into a generic 'click to feed all cats' game, I would notice it lost the individual-personality core and ask to restore the mismatched-approach mechanic where each cat needs a different response.

## 8. Rules, Boundaries, and Outcomes
**Important states:** States that describe a qualitative condition: relaxed / stressed (per cat), hungry / satisfied, hidden / visible (whether a cat is out in the open or hiding), calm / tense between cats, clean / dirty (litter box), fresh / stale (food bowl), trusting / wary (toward the player), and healthy / needs-attention (overall wellbeing flag).

**How player actions change the system:** Feeding a cat increases its hunger/satisfaction level and can raise trust if done consistently. Playing with a cat increases its energy/activity satisfaction and raises trust, while ignoring play requests over time increases stress. Petting or approaching a cat changes its trust level up or down depending on whether the approach matches its current comfort state (relaxed vs. wary). Cleaning the litter box resets its cleanliness state from dirty to clean. Giving a cat space (staying away) can shift its state from stressed/hiding back to calm/visible. Separating cats during conflict reduces the tension state between them, while ignoring conflict increases it. Neglecting any cat's needs over time gradually lowers its trust level and can shift its overall state from healthy to needs-attention.

**Success condition:** The player succeeds if, by the end of a set time period (e.g., a week in-game), all three cats maintain a healthy or trusting state — no cat drops into a chronically stressed, wary, or neglected state — while keeping food, water, and litter boxes adequately maintained, and preventing prolonged tension or conflict between the cats.

**Failure conditions:** The player fails if any cat's trust level drops to the lowest point and stays there (the cat becomes permanently withdrawn or fearful), if a cat's needs (food, water, litter) are neglected for too long and its wellbeing state drops to critical, if ongoing tension between cats escalates into repeated conflict without the player intervening, or if the player consistently favors one or two cats while letting another's trust and health continuously decline.

**Just-right ranges and thresholds:** Yes. The amount of closeness and interaction has a workable range: too little attention leaves a cat feeling neglected, lowering trust over time, but too much attention (constant petting, following, or forced holding) stresses the cat and lowers trust just as much. The right amount depends on each individual cat's tolerance, so there's no single 'more is always better' answer.

## 9. Feedback Priorities
**Immediate feedback:** Vocal sounds (meowing) should appear immediately, since they happen right when a need becomes unmet or right when the player's action succeeds — the cat reacts in real time, giving the player instant cause-and-effect feedback rather than a delayed signal.

**Feedback discovered over time:** A cat's fur condition and overall grooming should appear later, gradually, so players discover it through pattern recognition rather than a single action-reaction moment , a cat that has been under-attended or stressed over several in-game days will slowly show messier, less glossy fur, teaching the player that neglect compounds over time even if no single missed interaction seems to matter.

**Feedback that must be visual, spatial, audible, or state-based:** Meowing should be sound-based (audio cues), not a numeric hunger counter. A cat's emotional state should be shown through body language and animation (crouching, ears back, tail position ) not a mood percentage. Litter box and food bowl neglect should be shown through visual state changes (mess, fullness) rather than a cleanliness score. Fur condition and trust between the player and cat should be shown through appearance and animation (glossy vs. messy fur, whether the cat approaches or flees) rather than a trust number displayed on screen.

## 10. First Playable Version Scope
- Build a small desktop-browser game that validates one complete observe → judge → act → feedback → adjust loop.
- Use the accompanying system graph to implement 2-3 challenge presets when they are clearly defined. Each challenge should change system variables or relationships, not only visual decoration.
- Keep graphics simple and readable. Prioritize interaction, feedback, and learning over polish.
- Do not add realistic simulation, complex menus, accounts, online multiplayer, large asset pipelines, or unrelated features in the first version.
- Do not convert the project into a generic mini-game that only uses the domain as a theme.

## 11. Web Game Technical Dependencies and GitHub Pages

This project is published as a GitHub Pages site. The published site IS the exhibition. There is no ZIP packaging step and no separate offline build.

### GitHub Pages Publishing Rules
- The site is served from the repository root on the `main` branch, at `https://<username>.github.io/<repository-name>/`.
- Because GitHub Pages serves the site from a subpath, **every internal link and every asset path must be relative**. Root-absolute paths beginning with `/` will break on the published site even when they work locally.
- Store all required models, textures, audio, fonts, and libraries inside the repository. Do not load them from a CDN or another remote service.
- The repository is public. Never commit passwords, tokens, API keys, or personal information the student has not agreed to publish.
- After every push, the site republishes automatically. Verify the live URL, not only the local server.

### Choose the Lowest Necessary Dependency Track
1. **Track A - No build step:** Prefer HTML, CSS, plain JavaScript, and Canvas 2D for simple 2D games. This is the default choice and needs no extra configuration.
2. **Track B - Local vendored library:** For one small browser library, pin its version and store it under `assets/vendor/`.
3. **Track C - npm + build tool:** Use npm and Vite only for Three.js, multiple ES Modules, loaders, or other complex dependency graphs.

### Three.js and Vite Rules
- Three.js is allowed when 3D is important to the designed experience; do not replace meaningful 3D interaction only to avoid npm.
- Pin dependency versions in `package.json` and preserve `package-lock.json`.
- Configure Vite with a relative base such as `base: './'` so built assets work under the Pages subpath.
- Run `npm run build`, then copy the verified static output into the repository root so GitHub Pages serves it.
- Add a `.gitignore` that excludes `node_modules`. Never commit `node_modules`.
- Record dependency names, exact versions, licenses, build command, and output directory in `README.md`.

### Expected Repository Structure
```text
repository/
├── index.html                 # Project home: designer statement, system graph, play link
├── game.html                  # Playable game (or game/index.html)
├── process.html               # Human-AI development timeline
├── assets/                    # JS/CSS, system graph image, models, textures, audio, fonts
├── development-log/
│   └── agent-development-log.md
├── brief.md                   # This design and development specification
├── system-graph.png
├── ratings.csv                # Exported question-clarity ratings (teaching feedback)
├── README.md                  # How to run, controls, dependency track, main variables
└── source/                    # Track C only: src/, package.json, package-lock.json
```

## 12. Integrated Project Website Requirements
The website is the project space, not a final report and not a separate marketing page. It must exist from the first milestone and stay current as development progresses.

### Website From Day One
- Create the first version of `index.html` in the same pass as the first playable demo. Do not defer the website to the end of the project.
- The website is the exhibition surface: classmates and visitors will read it before or instead of playing, so it carries the designer statement, the system graph, and the play link.
- When the design changes, the website changes with it. A website that describes an older version of the game is worse than no website.

### Required Website Content
- **Game Idea:** project title, short concept, player goal, and core learning shift.
- **Domain Knowledge:** explain the real-world domain, novice misconception, expert judgment, and why this knowledge becomes playable.
- **System Design:** show the system graph and summarize environment data, player-controlled data, calculated results, feedback, success, failure, and challenge presets.
- **Development Process:** present a concise chronological timeline based on `agent-development-log.md`, including important changes, failures, tests, student decisions, and AI influence.
- **Play the Game:** the current playable version must be accessible from clear navigation and run directly in the website.

### Website Update Rules
- Create clear navigation among Home, Domain Knowledge / System Design, Development Process, and Play Game.
- Use only information supported by this brief, the system graph, the actual game, and the development log. Do not invent a smoother or more complete process.
- After every meaningful milestone, update the relevant website content and the development timeline.
- Keep the game idea and domain-learning explanation readable by classmates who have not seen the project before.
- Keep styling coherent across the informational pages and playable game, but prioritize clarity and function over decorative effects.
- Make the website usable on a typical student laptop. Mobile support is helpful but is not the first-version priority.
- Use relative links and asset paths. GitHub Pages serves the site from `https://<username>.github.io/<repository-name>/`, so root-absolute paths beginning with `/` will fail.
- Support a clean 1920×1080 exhibition view for display on an iMac. Important controls and text must fit without overlap.

## 13. Automatic Human-AI Development Log Protocol
In addition to building the website and game, maintain one Markdown file named `agent-development-log.md`. This file documents how the project develops through human-AI collaboration.

### Initialize the Log
At the beginning of development, create the file with:

```markdown
# Agent Development Log

- Project Title: CAT
- Student / Team: CJ
- Domain: Raising multiple cats
- Core Learning Shift: Beginners think caring for cats means giving as much closeness and attention as possible; experts know it means reading each cat's individual signals and limited resources, and adjusting time, food, and space to fit three different, sometimes conflicting needs.
- Current Game Idea: I've raised three cats, and each one has a completely different personality. Living with them, I realized 'raising cats' isn't one task, it's constantly balancing three different sets of needs at once. 
- AI Agent Used: Codex / Claude Code
- System Graph: add the image file or Canva link when available
- Development Period: add start and end dates
```

### Two Entry Types in One Timeline
Keep Raw Interaction Logs and Stage Reflections in chronological order in the same file. Do not separate them into two large sections.

#### A. Raw Interaction Log — Create Automatically
After every meaningful development interaction, append a short factual entry. A meaningful interaction includes implementation, debugging, code explanation that changes the project, mechanic or level changes, visual or audio changes, website updates, playtesting, or an AI suggestion that affects direction. Do not log casual clarification that produces no development change.

Use this format:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Interaction 01 — Raw Interaction Log

**Time:**
**Development Stage:**
**Current Goal:**

### Student Request
What the student asked the AI Agent to do.

### Agent Response Summary
What the Agent suggested, generated, explained, or changed.

### Development Action
What was actually implemented, modified, tested, or removed.

### Website Update
Which website section changed, or why no website update was needed.

### Files / Systems Changed
List files, mechanics, assets, data, UI, or challenge settings changed.

### Test and Immediate Result
What was tested and whether it worked, failed, partially worked, or remains uncertain.

### Student Decision / Follow-up
What the student accepted, rejected, modified, did not understand, or decided to try next.
```

#### B. Stage Reflection — Prompt the Student at Milestones
Do not fabricate student reflection. At a meaningful milestone—such as finishing the first playable loop, changing design direction, completing a challenge, or finishing a playtest stage—create a Reflection entry with factual fields, then explicitly ask the student to answer the Required Student Reflection.

Use this format:

```markdown
════════════════════════════════════
## Reflection 01 — Stage Reflection

**Time:**
**Covered Interactions:** Interaction 01–04
**Development Stage:**

### Goal of This Stage
### What Changed in the Playable Game and Website
### How AI Helped
### Student Decisions
### AI Influence on Design Direction
### Relationship to the Core Learning Shift
### Problems / Open Questions
### Next Step

### Required Student Reflection
Does the current game still help the player experience the intended domain-learning shift? What became stronger, weaker, or different? Which AI suggestion did you accept, reject, or change, and why?

> The AI Agent must ask the student to answer this section and must not answer it for them.
```

### Logging Rules
- Append new entries to the end of `agent-development-log.md` and continue Interaction and Reflection numbering.
- Be honest and specific. Record failures, partial results, misunderstandings, abandoned directions, and unresolved questions.
- Record when AI introduces a design direction, when the student rejects or modifies it, and when the student accepts code without fully understanding it.
- Separate factual development events from student reflection. Never invent student opinions or decisions.
- After milestone reflections, update the Development Process section of the website with a concise, truthful timeline summary.

## 14. GitHub Pages Exhibition

The exhibition is the published Pages site. No archive is packaged and nothing is uploaded to a shared drive.

### Enable GitHub Pages
1. Open the repository on GitHub.
2. `Settings` -> `Pages`.
3. Under Build and deployment, set Source to `Deploy from a branch`.
4. Branch: `main`, Folder: `/ (root)`. Save.
5. Wait a few minutes, then open `https://<username>.github.io/<repository-name>/`.

Every later push to `main` republishes the site automatically.

### Pre-Publish Audit
- Run the project through a local static HTTP server and test every navigation link, the playable game, controls, challenge selection, success, failure, and restart.
- Confirm every internal link and asset path is relative. Root-absolute paths are the most common cause of a Pages site that loads but shows nothing.
- Test the layout at 1920x1080 for exhibition display; text, controls, canvas, and navigation must not overlap.
- Confirm `node_modules`, caches, temporary files, passwords, tokens, and API keys are not committed.
- Push, then open the live Pages URL and repeat the navigation and gameplay test.

### What the Student Submits
- The GitHub Pages URL: the playable exhibition link.
- The repository URL.
- Nothing else. The repository is already public, so there is no upload step.

### Public Display
- The repository and the published site are public, because GitHub Pages requires a public repository on the free plan.
- Anything the student does not want published simply stays out of the repository.
- The student must confirm before publishing that `brief.md`, `ratings.csv`, and `development-log/agent-development-log.md` may be publicly visible.

## 15. Instructions for the AI Agent

1. **Index the workspace before planning anything.** List every file in the project folder, then read `brief.md` and `system-graph.png`. Report what you found: which files exist, what the brief specifies, and what is missing or contradictory. Do not write code before this step.
2. Restate the core learning shift, core loop, main variables, feedback mappings, and challenge presets in a short implementation plan.
3. Identify missing or contradictory information. Ask only questions that block the first playable version.
4. Propose the repository structure, then create the website skeleton (`index.html`, `game.html`, `process.html`, `assets/`) and initialize `development-log/agent-development-log.md`.
5. Implement the smallest complete game loop first, then add the defined challenge presets.
6. Keep variable names clear, and keep environment data, player-controlled data, and calculated results visibly separated in the code.
7. Add short comments only where a high-school student needs help understanding a rule.
8. **The first milestone must ship the playable demo and the first version of `index.html` together.** Never let the website fall behind the game, and never leave the site to the end of the project.
9. Start a local static server, test navigation and gameplay, and give the student the local URL and simple controls.
10. Automatically append a Raw Interaction Log after meaningful development work, and request student reflection at milestones.
11. After every milestone, update the website so its Development Process page matches the actual log.
12. Before the exhibition, run the pre-publish audit and confirm the live GitHub Pages URL works.

## 16. Acceptance Checklist
- [ ] The player can take a meaningful action within 30 seconds.
- [ ] Player actions visibly change system data or state.
- [ ] Important invisible data is translated into readable feedback.
- [ ] Success and failure conditions work and can be understood.
- [ ] A second attempt can improve because the player learned from feedback.
- [ ] Challenge presets differ through variables, relationships, information, or constraints.
- [ ] The game runs in a browser without a complex installation process.
- [ ] README.md identifies the dependency track and explains how to run, the controls, and the main variables.
- [ ] `index.html` existed from the first milestone and was kept current, not added at the end.
- [ ] The site clearly presents the game idea, domain knowledge, system design, development process, and playable game.
- [ ] `development-log/agent-development-log.md` contains chronological Interaction and Reflection entries.
- [ ] The Development Process page matches the actual log and does not hide failures or unfinished work.
- [ ] All internal links and assets use relative paths, because Pages serves from a subpath.
- [ ] The published GitHub Pages URL has been opened and tested at 1920x1080.
- [ ] No passwords, API keys, tokens, or `node_modules` are committed.
- [ ] The student has confirmed the brief, ratings, and development log may be publicly visible.
