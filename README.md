# Tibia Personal Advisor

A personal planning companion that helps a Tibia player decide what to do each session, based on available time, goals, and preferred playstyle.

> **Advisory only.** This tool suggests, prioritizes, estimates, and reminds. It does not automate gameplay, control the game client, or perform any in-game actions on the player's behalf. See [docs/SAFETY_BOUNDARIES.md](docs/SAFETY_BOUNDARIES.md) for the full safety policy.

## What It Is

Tibia Personal Advisor reduces decision fatigue and session-setup friction by answering one question:

> *"What should I do today that best fits my time, goals, and playstyle?"*

It is an advisory and planning tool — not a bot, macro system, or client modification. The player always performs every in-game action manually.

For the complete product vision, intended user profile, core features, and scope boundaries, see [docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md).

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Other available commands:

| Command | Description |
|---|---|
| `npm run build` | Compile a production build |
| `npm run start` | Start the production build locally |
| `npm run lint` | Run ESLint across the project |

## Further Reading

| Document | Purpose |
|---|---|
| [docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md) | Product vision, features, and scope |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layered architecture and data-flow design |
| [docs/AGENT_WORKFLOW.md](docs/AGENT_WORKFLOW.md) | How AI coding agents should work in this repository |
| [docs/SAFETY_BOUNDARIES.md](docs/SAFETY_BOUNDARIES.md) | Safety policy and automation boundaries |
