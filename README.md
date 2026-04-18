
---

### What It Does

The app places the user inside a live UN committee alongside three AI delegate opponents and one AI Chair who presides over all proceedings. Countries are randomly assigned — the user and all three AI delegates each represent a different nation. The user then researches their country's position, writes a formal position paper under a countdown timer, argues their stance on the committee floor in a turn-based debate against AI opponents who respond dynamically in character, drafts a formal resolution, and is finally scored by the AI Chair across three independent dimensions. The Chair produces a ranked leaderboard with official MUN award titles and written feedback for every participant.

---

### Key Features

**Splash and Onboarding Screen** — The app opens with a bold hero screen displaying the MUNverse name, a description of the simulation, and five feature chips showing 20 Countries, 8 Committees, 3 AI Delegates, AI Chair, and Live Leaderboard. A large gold Start Simulation button and a secondary How It Works button anchor the screen. Stat counters at the bottom show 6 phases, 3 AI opponents, 1 Chair, and infinite replays.

**Timer Configuration** — Before launching, the user sets two independent timers: one for the Research Paper phase and one for the Resolution Drafting phase, both using dropdowns ranging from 5 to 45 minutes. A tip card explains that timers run in real time, work can be submitted early, and the debate phase is turn-based with no fixed timer. A Simulation Overview card summarises how countries, committees, agendas, and the AI Chair all work.

**Random Country and Committee Assignment** — After configuration the app reveals the randomly assigned committee and agenda topic inside a large purple hero card. Individual delegate cards show each participant's country flag, role label, country name, and a YOU or AI badge. A separate AI Chair card explains the Chair's role. A Country Briefing section displays the user's specific stance, past UN actions, position statement, potential allies, red lines, and committee in colour-coded info blocks.

**Research Phase with Live Timer** — A purple header shows the phase title and a live countdown in MM:SS format. A writing card shows the user's country and committee, a DRAFT status badge, and a full textarea with a structured placeholder covering Country Policy Stance, Past UN actions, Proposed solutions, and Supporting arguments. A live word counter sits bottom-left and a Submit Paper button bottom-right. A Writing Guide card lists five numbered steps. A Your Brief card shows agenda, stance, and red lines. A Scoring Criteria card tells the user exactly what the Chair evaluates — Understanding, Alignment, and Structure — with a 150-word minimum recommendation.

**Turn-Based Debate with AI Delegates** — A purple header shows Committee Debate Floor with a live Round X of 3 counter. A chat-style committee floor panel shows a LIVE indicator with the committee name and agenda. Speeches appear as bubbles with the speaker's avatar, name label, and message — the AI Chair opens by calling the session to order, naming the agenda, rounds, and first speaker. The user types their speech in an input field with a send button. A Speaker Order card lists all four delegates with country flags and agent labels, the active speaker highlighted. A Debate Rules card and a Score Tips card guide the user on procedure and scoring.

**Resolution Drafting Phase** — Mirrors the research phase. A writing card is labelled Draft Resolution and includes a full formal UN resolution placeholder with preambulatory clauses — Recalling, Noting with concern, Affirming — and operative clauses numbered from Calls upon through Requests. A word counter and Submit Resolution button sit below the textarea. A Key Phrases card shows the full vocabulary spectrum from soft to strong operative language. A Scoring card explains the Chair evaluates Logic, Feasibility, and Alignment.

**AI Chair Evaluation Loading Screen** — A purple card shows the scales of justice emoji, the text AI Chair is Evaluating, a cycling status label, and an animated gold progress bar while the AI processes all submissions.

**Results Screen** — A podium layout shows the top three delegates with flags, rank numbers, scores out of 90, and placement medals. A structured leaderboard table has columns for Rank, Delegate, Research score, Resolution score, and Total — each score as a pill badge. Individual award cards show Best Delegate, Outstanding Delegate, Honorable Mention, and Verbal Mention with medal emoji, country flag, name, and score. A Chair's Feedback section shows written AI feedback per delegate. A separate All Submitted Resolutions section displays every participant's filed resolution in full.

**Multi-Phase Stepper** — A persistent horizontal stepper runs across the top of every screen showing Assignment, Research, Debate, Resolution, and Evaluation as icon tabs with the active phase highlighted.

**8 Real UN Committees** — UNSC, UNGA, WHO, UNHRC, ECOSOC, UNICEF, DISEC, and UNEP, each with four agenda topics drawn from real-world diplomatic issues.

**20 Country Profiles** — Each country has a coded foreign policy stance, potential allies, and red lines that govern how the AI plays that delegation and informs the user's briefing.

**Watermark** — Made and designed by ikki appears on every screen.

---

### Screens in Order

1. Splash and Hero — app intro, feature chips, stat counters, start button
2. Timer Configuration — independent dropdowns for research and resolution timers, simulation overview card
3. Assignment — randomly assigned committee card, agenda topic, all four delegate cards with flags, AI Chair card, full country briefing with stance, allies, red lines, and committee
4. Research Phase — countdown timer, structured position paper textarea, live word count, writing guide, brief recap, scoring criteria
5. Debate Phase — live chat-style committee floor with LIVE badge, round counter, AI Chair opening statement, speech bubbles per delegate, speaker order list, debate rules, score tips
6. Resolution Drafting — countdown timer, formal resolution textarea with clause scaffolding, key phrases guide, scoring criteria
7. Evaluation Loading — animated gold progress bar, cycling status text, scales emoji on purple card
8. Results — animated podium with top 3, full leaderboard table with per-category pill scores, individual award cards per placement, Chair written feedback per delegate, all submitted resolutions displayed in full

---

### Languages

MUNverse uses exactly three languages. There is no Python, no backend, no server, and no database. The entire application runs in the browser.

**JavaScript (JSX)** is the primary language. It handles every React component, all simulation state, the phase routing logic, the countdown timer mechanics, the word counter, and all four Claude AI API calls. The API is called directly from the browser using the native fetch function — no server in between. All AI agent logic, prompt construction, response parsing, and fallback handling is written in JavaScript.

**CSS** handles all visual styling. This includes the design token system via CSS custom properties, the purple and cream colour palette, all card layouts, button styles, animated progress bars, keyframe animations, the phase stepper, responsive mobile layout, and all hover and active states.

**HTML** is a single index.html file that serves as the entry point. It contains the root div that React mounts into, the page title and meta tags, and the script tag that loads the application.

That is the complete stack. Three languages, fully client-side, no Python, no Node runtime, no Flask, no database, no authentication layer.

---

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 with JSX functional components |
| Bundler | Vite 5 |
| Styling | Plain CSS with CSS custom properties |
| Animations | CSS keyframes and animated progress bars |
| AI | Anthropic Claude API — claude-sonnet-4-20250514 |
| API calls | Native browser fetch — no backend |
| Fonts | Google Fonts |
| State | React useState and useRef hooks |
| Routing | Manual phase state machine — no router library |
| Deployment | Static SPA — no server required |

---

### AI Architecture

Four Claude API roles operate across the simulation. AI-1, AI-4, and AI-5 are delegate agents — each receives its country name, foreign policy stance, the current agenda, and the running debate transcript as context, then generates position papers, floor speeches, and draft resolutions fully in character. AI-2 is the Chair agent — called once after all phases are complete, it receives all four position papers, the full debate transcript, and all four draft resolutions, then returns a structured JSON response with numerical scores per category out of 30 each for a 90-point total, award assignments, and written feedback per delegate. A fallback handles any parsing failure gracefully without breaking the simulation.

---

### Design

The interface uses a warm purple and off-white cream palette — deep violet headers transitioning into light beige card areas. Gold is used exclusively for primary action buttons, countdown timers, award elements, and score highlights. Cards are white with soft rounded corners and subtle shadows. The persistent watermark *made and designed by ikki* appears on every screen in the bottom-right corner in small muted text.

---

*MUNverse — made and designed by ikki*
