# Flowdo landing site: build the v3 "Black + purple" design

I've attached a PDF with 7 artboards. It is the visual source of truth for this task. Build the whole landing page to match it, in this order, top to bottom:

1. Hero
2. Timeline strip
3. About
4. Task strip
5. Features
6. Download
7. Footer

Where the PDF and this text disagree, follow this text. The PDF is a still image, so all motion is described below.

## Project rules (don't break these)

- The project is React + Vite at `F:\My Projects\FlowDo`.
- **JSX/JS only, no TypeScript.**
- **Tailwind for styling.** The only CSS file is `src/index.css`. Put keyframes, `@theme` tokens and the few reusable effect classes there. No CSS modules and no extra stylesheets.
- GSAP is installed. Use it for entrance and scroll-reveal animations (`gsap` + `ScrollTrigger`). Pure looping decorations can be CSS keyframes.
- The Hero's 3D logo already works with React Three Fiber (`components/three/Logo3D.jsx` and `SceneCanvas.jsx`). **Keep it exactly as it is**: rotation, camera, tone mapping, the fade-up-on-load animation, the float, and the small mouse-follow position drift. Only restyle the content around it.
- The structure must stay extensible because I'll add more sections later:
  - one file per section in `src/sections/`, exported from `src/sections/index.js`
  - a section order array in `App.jsx`
  - shared bits in `src/components/ui/`
  - all copy and lists in `src/data/`
- Every animation must respect `prefers-reduced-motion`. Use the existing `usePrefersReducedMotion` hook. Under reduced motion, loops stop and content shows in its final state.
- Use the existing `useInView` hook (or ScrollTrigger) so looping animations and timers only run while their section is on screen.
- Accessibility:
  - real `<button>`s and `<a>`s
  - visible focus rings (2px `#A5B4FC` outline, 3px offset)
  - decorative images get `alt=""` and `aria-hidden`
  - marquee strips are `aria-hidden`
  - tap targets at least 44px
- Responsive from 360px wide up to 1440px. At ≤960px:
  - hide the 4 floating Hero mascots
  - stack two-column layouts
  - shrink strip heights by about 25%
  - no horizontal page scroll anywhere

## Assets (already in `public/`)

The mascot images are in `public/assets/mascot/`. Every file exists as `.webp` and `.png`. Use `<picture>` with the webp first and the png as fallback. All of them are 720px tall with transparent backgrounds.

| File | Pose | Used in |
|---|---|---|
| `flowdo-mascot-1-point` | pointing | Hero, top-right |
| `flowdo-mascot-2-checklist` | holding a checklist | Hero, top-left |
| `flowdo-mascot-3-typing` | typing on a laptop | Hero, bottom-left |
| `flowdo-mascot-4-stretch` | stretching | Hero, bottom-right |
| `flowdo-mascot-5-guide` | guide, pointing left | About |
| `flowdo-mascot-6-desk` | typing at a desk | Features |
| `flowdo-mascot-7-coffee` | hugging a coffee cup | Download |
| `flowdo-mascot-8-meditate` | meditating | About (Flowmodoro) |
| `flowdo-mascot-9-sleep` | asleep at a desk | Timeline strip |
| `flowdo-mascot-10-cheer` | jumping with a checkmark | Features (all done) |
| `flowdo-mascot-11-wave` | waving | Footer |
| `flowdo-mascot-12-peek` | peeking around a wall | Download, right edge |
| `flowdo-mascot-13-cart` | pushing a cart of task cards | Task strip |

For the footer, use the logo SVG that's already in the project, the same one as the navbar.

## Design tokens (add to `index.css` with `@theme`)

**Font:** Plus Jakarta Sans from Google Fonts, weights 400 / 500 / 600 / 700 / 800. Use it site-wide.

**Colors** (black + purple, matching the logo color #6366F1):

- base: `#050409`
- indigo:
  - 300 `#A5B4FC`
  - 200 `#C7D2FE`
  - 100 `#E0E7FF`
  - 400 `#818CF8`
  - 500 `#6366F1` (the brand color)
  - 600 `#4F46E5`
  - 700 `#4338CA`
- deep tints (for section gradients): `#1E1B6B`, `#0D0B2B`, `#13113F`, `#0B0A22`, `#13113D`, `#0A0920`, `#2B2899`
- text: white for headings, `#A3A9B8` for body text, `#8A90A0` for muted text
- break / success: green `#34D399` and `#6EE7B7`
- task-priority dots: urgent `#F43F5E`, high `#F59E0B`, normal `#3B82F6`, low `#8A90A0`
- app UI surfaces (inside mock app panels): `#101114` with a `#23242C` border

**Glass card:**

- 1px border `rgba(129,140,248,.22)`
- background `rgba(99,102,241,.07)`
- `backdrop-filter: blur(16px)`
- corner radius 24px

The **featured card** in About is stronger:

- border `rgba(129,140,248,.45)`
- a 6px outer glow ring `rgba(99,102,241,.08)`
- big shadow `0 30px 80px rgba(67,56,202,.22)`
- radius 28px

**Shared effects.** Make these reusable classes or components:

- **Aurora blobs:** 3 big blurred circles per section, `filter: blur(90px)`, indigo at 30–45% alpha. They drift slowly with transform loops of 18s, 22s and 26s. Wrap them in a `pointer-events-none` `overflow-hidden` layer.
- **Twinkle dots:** about 6 tiny 4px dots, `#C7D2FE` with a `#6366F1` glow. They fade and rise in a 5s loop, each with a different delay.
- **Shine text:** the brand words in headings (Do, Flowdo, "Then get it done.", "Then start focusing.") use a moving gradient. Gradient: `#818CF8 → #A5B4FC → #EEF0FF → #A5B4FC → #818CF8`, size 200%, `background-clip: text`, animating background-position over 6s, linear, looping.
- **Reveal:** headings and cards rise 36px and fade in over 1s with ease `cubic-bezier(.22,1,.36,1)`. Delays are staggered at 0.12s, 0.24s and 0.38s. Trigger with GSAP ScrollTrigger once, when 20% in view.
- **Fine tick ring:** `repeating-conic-gradient` lines masked into a thin ring. It's used in the Hero, the About dial and the Download section.

## Sections

### 1. Hero (update the existing `Hero.jsx`)

- **Size and background:** full viewport height, minimum 760px. Background `radial-gradient(90% 70% at 50% 45%, #1E1B6B, #0D0B2B 45%, #050409 80%)`, plus aurora blobs and twinkle dots.
- **Glow and ring behind the logo:**
  - A conic indigo glow, about 820px, blurred 110px, at 80% opacity, rotating once every 40s.
  - A dark vignette over it.
  - A fine tick ring about 510px wide, centered at 54% from the top.
- **Order from top to bottom:**
  - Title "Flow**Do**": the "Do" uses shine text. Size `clamp(64px, 11vw, 148px)`, weight 700, letter-spacing -0.055em, soft indigo text-shadow. Keep my existing GSAP HeroTitle animation.
  - The R3F logo, unchanged.
  - Tagline: "Pomodoro and Flowmodoro timer with your tasks built in. Free for Windows and Linux."
  - The download row (below).
- **Download row.** This is new, because there's now more than one way to download:
  - **Windows:** a white pill button, 56px tall, dark text, Windows icon, with a 6px indigo ring.
  - **Linux:** a glass pill button with a Tux icon, background `rgba(99,102,241,.14)` and border `rgba(165,180,252,.4)`.
  - **Web app:** a dashed-border pill, not clickable, with `aria-disabled`. It has a globe icon, the text "Web app" and a small "Soon" badge.
  - **Click behavior:** Windows and Linux smooth-scroll to `#download` *and* select that platform's tile there. Share that state through a small React context or a URL hash such as `#download?platform=linux`.
  - **Hover:** the buttons lift 2px.
  - **Line underneath:** "v0.5.3 · Installer, portable, AppImage or .deb · All download options ↓". The last part is a link to `#download`.
  - **Data:** take the version number and all download data from `src/data/downloads.js`. Update that file so it holds 3 platforms:
    - **Windows:** installer `.exe` (recommended) and portable `.exe`
    - **Linux:** AppImage (recommended) and `.deb`
    - **Web:** coming soon

    For now, every file URL points to `https://github.com/samanfooladi/Flowdo/releases/latest`.
- **Do not** write "open source" anywhere. The repo has no license yet.
- **The 4 floating mascots** are decorative and hidden at ≤960px. Each one bobs 18px up and down with a slight tilt, and each has its own duration and delay so they never move in sync.

  | Mascot | Position | Height | Loop |
  |---|---|---|---|
  | checklist | top-left (3%, 11%) | 300px | 6s |
  | point | top-right (3%, 9%) | 300px | 6.8s |
  | typing | bottom-left (11%, 5%) | 220px | 7.4s |
  | stretch | bottom-right (12%, 5%) | 270px | 5.6s |

  All four get the drop-shadow `0 18px 30px rgba(67,56,202,.35)`.

### 2. Timeline strip (new, `TimelineStrip.jsx`)

- **Size:** 260px tall, background `#050409`, `aria-hidden`.
- **Belt:** a horizontal belt that scrolls left forever (seamless: render the list twice and translate -50%, one loop every 46s). It's built from blocks where 1 minute = 16px. Each block has:
  - a 44px band of tick marks (2px lines every 16px, fading downward)
  - a 10px rounded bar
  - an uppercase 13px label
- **The cycle, in order:**

  | Block | Length | Bar color | Label color |
  |---|---|---|---|
  | "Pomodoro · Focus 25:00" | 25 min | `#6366F1` | `#C7D2FE` |
  | "Break" | 5 min | `#34D399` | `#6EE7B7` |
  | "Focus 25:00" | 25 min | indigo | indigo |
  | "Break" | 5 min | green | green |
  | "Flowmodoro · Focus 48:00 ↑" | 48 min | gradient `#4338CA → #818CF8 → #C7D2FE` | `#E0E7FF` |
  | "Earned 9:36" | 10 min | green | green |
  | "Focus 25:00" | 25 min | indigo | indigo |
  | "Long break" | 15 min | green | green |

  On the "Long break" block, the **sleeping mascot** (92px tall) sits on top of the bar and moves with the belt.
- **Fixed parts:** the edges fade to `#050409` (18% on each side). A fixed white playhead line, 2px wide with an indigo glow, sits in the center, with a white "NOW" pill on top of it.

### 3. About (`About.jsx`, `id="about"`)

- **Background:** a vertical gradient `#050409 → #0B0A22 → #13113D → #050409`, plus aurora blobs, a faint top hairline and a radial glow on the right.
- **Title and intro:**
  - Title: "What is **Flowdo**?" with "Flowdo" in shine text, size `clamp(44px, 5.6vw, 76px)`.
  - Intro: "A focus timer and a to-do list in one desktop app. Pick a task, start the timer, and every minute you focus is logged against it."
- **Featured card** (left side, about 600px) with a mode toggle:
  - **Header:** "TWO WAYS TO FOCUS" on the left, and a segmented control on the right with Pomodoro and Flowmodoro. The active option is a white pill with dark text. Use `aria-pressed`.
  - **Dial:** 200px, a segmented `conic-gradient` ring 18px thick with a 2.5° gap between segments, an inner fine tick ring, and big centered time text.
    - Pomodoro: 4 × (25 focus + 5 break), and the last break is 15 min. Center: "25:00" over "round 1 of 4".
    - Flowmodoro: 50 focus + 10 break. Center: "50:00" over "+10 min break" in green.
    - Animate the dial change smoothly over 0.4s.
  - **Text next to the dial:** the mode title, a description, and 3 stat chips.
    - **Pomodoro:**
      - Description: "Fixed rounds with a steady rhythm. Focus for 25 minutes, take a 5-minute break, and after every fourth round take a longer one. Every length can be changed."
      - Stats: Focus 25m · Break 5m · Long break 15m. Break values are green.
    - **Flowmodoro:**
      - Description: "No clock to beat. The timer counts up while you focus, and when you stop, your break is a fifth of the time you put in."
      - Stats: Break ÷ 5 · Shortest 1m · Longest 30m.
- **Mascot** (right side, about 340px, slightly overlapping the card):
  - Pomodoro: the **guide mascot**, 560px tall, bobbing gently over a 6.4s loop.
  - Flowmodoro: it **crossfades (0.45s)** into the **meditating mascot**, 440px tall, which floats 14px up and down over 4s.
  - There's a blurred indigo shadow ellipse under it.
- **Fact cards:** 3 glass cards in a grid, each with a 44px icon tile.
  - "Your data stays on your computer": "No account needed. Export or import everything as JSON whenever you like."
  - "Accurate, even through sleep": "The timer runs on real clock time, so minimizing or a sleeping laptop never breaks a session."
  - "One shared history": "Pomodoro and Flowmodoro sessions land in the same history, even the ones you stop early."

### 4. Task strip (new, `TaskStrip.jsx`)

- **Size:** 240px tall, `#050409`, `aria-hidden`.
- **Two rows** of app-style task pills. Both scroll **to the right** (row 1 every 50s, row 2 every 58s), seamlessly. Each pill has:
  - a `#101114` background and 16px radius
  - a round checkbox
  - the title
  - a small priority dot

  Done tasks have a filled indigo checkbox with a check, gray struck-through text and a `#23242C` border. Open tasks have a ring in their priority color and an indigo border at 40% opacity.
- **Tasks** (`d` = done, `o` = open):
  - Row 1: Journal your workflow (low, d) · Plan today's top 3 (high, o) · Finish the landing page (urgent, d) · Reply to emails (normal, o) · Read 20 pages (low, d) · Review the PR (normal, o)
  - Row 2: Study for physics (high, o) · Push to origin (normal, d) · Stretch for 5 minutes (low, o) · Update the resume (high, d) · Prepare slides (urgent, o) · Water the plants (low, d)
- **Cart mascot:** fixed at the left (4%), 220px tall, above a solid `#050409` fade that covers the left 15–26%. It looks like the pills roll out of his cart. He does a small push wobble: 3–6px side to side over 1.4s.

### 5. Features (`Features.jsx`, `id="features"`)

Build this from the PDF.

- **Title and intro:**
  - Title: "Organize the work. **Then get it done.**" with the second sentence in shine text.
  - Intro: "Group tasks into projects, break big ones into steps, set deadlines and priorities. Then pick one and start the timer."
- **Mock app panel** (left). It's `role="img"` with a descriptive aria-label, and contains:
  - a projects list: Launch week 5 (selected), College 2, Personal 3
  - a header with "Launch week" and "N open"
  - an "Add a task…" row
  - 5 task rows, each with a checkbox, title, due date, an optional subtask count, and priority:

    | Task | Due | Subtasks | Priority |
    |---|---|---|---|
    | Journal your workflow | Today | none | Low |
    | Plan today's top 3 | Today | none | High |
    | Finish the landing page hero | Today | 2/3 | Urgent |
    | Reply to client emails | Tomorrow | none | Normal |
    | Read 20 pages | Mon, Nov 9 | none | Low |

  - a progress bar with "X of 5 done"
- **Auto-tick loop:** it runs only while the section is in view. Every 1.4s, the next task gets ticked:
  - the check fills in, the text goes gray and struck-through
  - subtasks "2/3" become "3/3"
  - the progress bar grows over 0.6s
  - the next open task is highlighted with an indigo tint and border plus a left accent bar
  - "Today" due dates on open tasks are red `#FCA5A5`

  After all 5 are ticked it holds for 2 steps, then resets. Under reduced motion, show 2 tasks done and don't animate.
- **Mascot** (right, max 440px):
  - While ticking: the **desk mascot**, with a gentle 6px "typing" bob over 3.6s.
  - **When all 5 are done:**
    - The desk mascot crossfades (0.5s) into the **cheer mascot**, which pops up from 24px below and 0.9 scale with a slight overshoot (`cubic-bezier(.34,1.56,.64,1)`).
    - The label changes to "All done!".
    - On reset, it goes back to the desk mascot.
- **Below:** 4 glass feature cards. Each has a small app-UI preview, a title and one line of text.
  - **Projects:** colored project list. "Group your tasks by project, each with its own color, so work, study and personal stuff never mix."
  - **Subtasks:** a parent task with 2 checked and 1 open step. "Break a big task into small steps and tick them off as you go."
  - **Deadlines:** a date field plus Today / Tomorrow chips. "Give tasks a due date in one click. Today and Upcoming show you what's next."
  - **Priority:** a 2×2 grid of Urgent / High / Normal / Low. "Mark what's urgent, high, normal or low, and the color follows the task everywhere."

### 6. Download (`Download.jsx`, `id="download"`)

- **Background:** `radial-gradient(80% 70% at 50% 60%, #2B2899, #13113F 45%, #050409 85%)`, aurora blobs (one is a faint pink accent, `rgba(236,72,153,.18)`), a dot-grid texture masked to the center, and an indigo glow.
- **Title and intro:**
  - Title: "Grab a coffee. **Then start focusing.**" with the second line in shine text, size `clamp(48px, 6.4vw, 92px)`, weight 800.
  - Intro: "Flowdo is free on Windows and Linux, with a web app on the way. Pick your platform to see the downloads."
- **Coffee mascot:** 330px tall, centered, breathing (5px over 4s), with 3 small steam puffs rising from the cup. Behind it, a fine tick ring about 360px wide rotates once every 80s. The mascot overlaps the top of the tiles by 22px.
- **Tiles:** 3 platform tiles in a row (stacked on mobile), each with an icon tile, a badge, a name, a sub-line and a CTA with a chevron.
  - **Windows:** "Most popular". "Windows 10 and 11. Installer or portable." CTA: "Choose a version".
  - **Web app:** "Coming soon". "Use Flowdo in your browser, nothing to install." CTA: "Learn more".
  - **Linux:** "x64". "AppImage for most distros, or a .deb package." CTA: "Choose a version".
  - **Selected tile:** gradient `#6366F1 → #4338CA`, a 6px ring and a big shadow.
  - **Hover:** the tile lifts 4px.
  - Windows is selected by default, unless the Hero button chose Linux.
  - **What clicking does:** clicking a tile selects it. The PDF shows only the tiles. Under the tiles, add a simple, compact row of version buttons for the selected platform:
    - Windows: Installer `.exe` (recommended, white button) and Portable `.exe` (glass button)
    - Linux: AppImage (recommended) and `.deb`
    - Web app: the text "The web app is on its way. Watch the GitHub releases."

    Keep this row minimal so the section still looks like the PDF.
- **Line at the bottom:** "Latest version v0.5.3 · See all releases on GitHub", with a link.
- **Peeking mascot:** an easter egg at the **right edge** of the section, at 30% from the top, 300px tall, `aria-hidden`. The image's right edge is the wall, so it must sit **flush** with the section's right edge (`right: 0`, section `overflow: hidden`, no gap). It slides in from off-screen over a 9s loop: hidden for 0–12%, sliding in until 24%, staying until 70%, sliding out by 82%, then hidden.

### 7. Footer (`Footer.jsx`)

- **Background:** a gradient `#050409 → #0A0920`, with faint aurora blobs and dots.
- **Layout:** a 1px top border in `rgba(129,140,248,.22)`, max width 1120px.
- **Left side:** the logo (32px tall) and "A focus timer and a to-do list in one desktop app. Pomodoro or Flowmodoro, your choice."
- **Right side:** two link columns.
  - **Product:** About (`#about`), Features (`#features`), Download (`#download`)
  - **Project:** GitHub `https://github.com/samanfooladi/Flowdo`, All releases `…/releases`, Report an issue `…/issues`
- **Bottom line:** "© 2026 Flowdo · See you in your next focus session."
- **Waving mascot:** 190px tall, positioned absolutely inside the footer container at `right: 165px; bottom: -36px`. It gently sways (rotates -3°) over 3.2s, with the pivot at the bottom center.

## When you're done

1. Run the dev server and check every section at 1440, 1024, 768 and 375px wide against the PDF. Fix any overflow, overlap or horizontal scroll.
2. Test the interactions:
   - the About mode toggle
   - the Features tick loop and the cheer swap
   - Hero Windows/Linux → scroll + tile selected
   - selecting Download tiles
   - reduced motion
3. Tell me which files you created or changed, and anything you couldn't match from the PDF.
