# 🧪 Alchemist's Cauldron

A browser puzzle game made for the [RS School qualifying stage](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/README.md).

**Deploy:** https://alenavp.github.io/alchemists-cauldron/

## The game

You are an alchemist with a cauldron, a shelf of ingredients and a ticking clock.

- Every round gives you a **recipe** with 3 target ranges: **Temperature**, **Density** and **Magic Power**.
- Every ingredient adds its own 3 numbers to the cauldron (some of them are negative).
- Mix ingredients until all 3 values are inside the target zones, then press **Brew**.
- A correct potion gives score and extra time. A wrong one costs a life.
- Ingredient stock is limited, so every portion matters.

**Goal:** brew as many potions as you can before the time, the lives or the ingredients run out, and get into the Top-10 leaderboard.

## How to play

1. Press **Start Game**. You get a random recipe and a shelf with a random stock of every ingredient (2–15 portions).
2. Click ingredient cards to add them to the cauldron. The counter **Ingredients: n / 4** shows how full it is; at the maximum the shelf is blocked.
3. Watch the 3 bars. The bright green zone is the recipe range, the faint zone around it is the allowed tolerance, the gold marker is the current value. A bar glows when its value is inside the recipe range.
4. Press **Brew**. Every value may miss its range by the tolerance (±8 on Medium).
   - Success: +200 points, +10 s (time never goes above 120 s by a bonus) and a new recipe.
   - Failure: −1 life.
   - In both cases the used ingredients are spent.
5. The game ends when the time reaches `00:00`, the lives run out, or the shelf and the cauldron are both empty (**Out of ingredients**).
6. If the score gets into the Top-10, enter a name (2–15 characters: letters, digits, space, `_`, `-`).

Controls: **Pause** next to the timer, **Help** and **Menu** (new game, leaderboard) at the bottom. The game pauses automatically when the browser tab is hidden.

## Implemented features

### Level 1 — Basic

- [x] Start screen: empty shelf and cauldron, score and time `0`, no lives, centered **Start Game**, Help and Menu
- [x] US 1.1 Shelf with 6 ingredients (SVG icons, 3 numbers, random stock badge), empty slots at stock 0, cauldron keeps the order, max 4
- [x] US 1.2 Three bars with negative values (0 in the center), smooth CSS transitions, target zone, marker, green glow
- [x] US 1.3 20 recipes, random pick by difficulty, ingredient counter with highlight at the maximum, Brew check with ±8
- [x] US 1.4 Timer from `Date.now()` timestamps, `MM:SS` + shrinking bar, red pulse below 15 s, lives, Game Over with the reason and **Play again**
- [x] US 1.5 Pause with blurred field, **Resume** / **Exit to Menu**, auto-pause on a hidden tab
- [x] US 1.6 Top-10 leaderboard in `localStorage`, name validation, `DD.MM.YYYY HH:MM`, clear with an in-app confirmation; broken data never crashes the game

### Rule decisions

- **Time bonus.** US 1.3 says "add 10 s up to 120 s", US 1.4 says "never above the start time". The game caps the bonus at 120 s (this satisfies both) and a success never takes time away: at 145 s a success keeps 145 s.
- **Leaderboard.** A result gets in when the score is above 0 and either the list has fewer than 10 entries or the score is higher than the 10th place (an equal score would rank below the earlier result).
- **Bar scales.** Temperature −100..100, Density −80..80 (0 in the center), Magic Power 0..100. Values outside the scale keep the marker at the edge, the exact number is shown above the bar.

## Task structure

| Stage          | Content                                                           | Branch      |
| -------------- | ----------------------------------------------------------------- | ----------- |
| Precondition 1 | Repository, tooling, folder structure, quality checks             | `story-pre` |
| Level 1        | One full playable game with the Medium rule set                   | `story-1`   |
| Level 2        | Difficulty selection, save and continue                           | `story-2`   |
| Level 3        | Drag & drop, tooltip, reactions, Pour Out, shortcuts and feedback | `story-3`   |

Each story branch is created from the previous one. Tasks are developed in feature branches and merged into the current story branch. The final story PR targets the previous story branch and stays unmerged for Cross-Check.

## Tech stack

- **TypeScript** (strict mode), no frameworks or runtime libraries
- **Vite** for development and production builds
- **SCSS** for styles (compiled to plain CSS at build time)
- **ESLint** + **Prettier** for code quality, **Husky** + **commitlint** for git hooks
- **GitHub Actions** for checks and deploy to GitHub Pages

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install        # installs dependencies and git hooks
npm run dev        # development server
npm run build      # type check + production build into dist/
npm run preview    # serve the production build
npm run lint       # ESLint
npm run format     # Prettier (write), format:check to only check
npm test           # unit tests for the game rules (Vitest)
```

## Project structure

```text
src/
  types/     shared TypeScript types
  data/      fixed game tables: ingredients, recipes, difficulty, reactions
  logic/     pure game rules (no DOM): sums, brew check, stock, timer
  state/     game state and actions
  storage/   localStorage helpers: save, leaderboard
  ui/        DOM rendering and event handlers
  styles/    SCSS: abstracts (tokens, mixins), base, components
```

Game rules never touch the DOM: `logic/` and `state/` can be tested without a browser, `ui/` only renders the state and forwards user actions. There is no `assets/` folder because all icons are emoji, inline SVG or CSS shapes.

## Git hooks

- `commit-msg` checks the message against the [RS School git convention](https://rs.school/docs/git-convention) (Conventional Commits).
- `pre-push` runs ESLint and the Prettier check and blocks the push if they fail.
