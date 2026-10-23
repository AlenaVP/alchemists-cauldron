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
