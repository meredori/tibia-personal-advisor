# Tibia Personal Advisor Product Spec

## Vision
Tibia Personal Advisor is a personal planning companion that helps one player decide what to do in Tibia for each session, based on available time, goals, and preferred playstyle.

The product optimizes for sustainable progression over maximum theoretical efficiency. It should reduce decision fatigue, lower session setup friction, and keep recommendations safe, practical, and low pressure.

Core outcome:

"What should I do today that best fits my time, goals, and playstyle?"

## Intended User And Playstyle
Initial design target:

- Solo Monk player
- Victoris server
- Typical sessions: 30 to 120 minutes
- Safety-first mindset
- Low-risk hunting preference
- Prefers active gameplay over kiting
- Limited TC bankroll
- Long-term account progression focus

This target anchors defaults and recommendation priorities, while the system remains configurable for future users.

## What The App Is
- Advisory and planning tool
- Prioritization engine for session decisions
- Budget and progression planning assistant
- Checklist and reminder assistant
- Customizable activity dashboard

## What The App Is Not
- Gameplay bot or automation tool
- Client modification tool
- Input macro system
- Memory reading software
- Unattended gameplay controller

## Product Principles
- Personalization first: recommendations should reflect actual preferences, not generic metas.
- Low friction: reduce setup overhead and mental load before each session.
- Modular systems: major product capabilities should evolve independently.
- Advisory over automation: the player always performs in-game actions manually.

## Core Features
- Character profile management for goals, preferences, and constraints
- Structured activity knowledge base for hunts, tasks, quests, and routines
- Priority engine that scores and ranks what to do now
- Session planner that translates priorities into actionable steps
- Financial planner that separates operating vs progression spending
- Upgrade planner with affordability and buy/wait/farm guidance
- Reminder system for recurring maintenance tasks
- Event calendar awareness for time-limited opportunities
- Market intelligence for pricing and thresholds
- AI-assisted knowledge update proposals (approval-based)

## Product-Level Modules
These modules describe product capabilities, not implementation code:

1. Character Profile System
2. Activity Database
3. Priority Engine
4. Session Planner
5. Financial/Budget Planner
6. Upgrade Planner
7. Reminder System
8. Event Calendar System
9. Market Intelligence System
10. AI Knowledge Update Layer

## Recommendation Characteristics
Recommendations should present:

- Best current activity
- Backup option
- Safer option
- Profit-oriented option
- Progression-oriented option
- Confidence/freshness cues where data is uncertain

## Scope Boundaries For Planning
Current repository phase is documentation and planning foundation.

Explicitly out of scope in this phase:

- Application implementation
- Domain model implementation
- Service implementation
- UI implementation
- Database schema design
- Issue breakdown generation

## Success Criteria
The product succeeds when it consistently helps the player make better short-session choices with lower stress, while preserving safety-first behavior and long-term progress.
