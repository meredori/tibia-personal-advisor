# Tibia Personal Advisor - System Specification v0.2

Project Goal: Create a modular personal assistant system specifically designed around a single player's Tibia playstyle, progression goals, available time, risk tolerance, and account priorities.

Primary focus:

- Reduce friction to playing Tibia
- Help answer "what should I do today?"
- Optimize for sustainable progression
- Avoid burnout and obligation gameplay
- Prioritize safety and convenience over theoretical max efficiency

Initial target user:

- Solo Monk player
- Victoris server
- Short sessions (30–120 min)
- Safety-first
- Low-risk hunting preference
- Prefers active gameplay over kiting
- Limited TC bankroll
- Long-term account progression focus

The system is NOT:

- A bot
- Gameplay automation
- Client modification
- Memory reading software
- Input automation

The system IS:

- An advisory/planning tool
- A prioritization engine
- A budgeting/planning assistant
- A customizable activity dashboard
- A lightweight progression planner

---

# Core Design Principles

## 0. Layered Architecture

The system should be built in layers so individual modules can be improved, replaced, or automated over time without rewriting the whole application.

High-level layers:

1. Data Source Layer
2. Normalization Layer
3. Domain Model Layer
4. Shared Services Layer
5. Feature Modules Layer
6. Recommendation Layer
7. UI/Notification Layer

The purpose of this structure is to allow a feature to start as manual/static data, then later become semi-automated or fully dynamic.

Example:

- Phase 1: house prices are manually entered
- Phase 2: house data is pulled from TibiaData/Tibia.com-derived sources
- Phase 3: market and rent assumptions are adjusted from historical observations

The feature module should not care where the data came from. It should ask the shared data service for "available houses" or "house budget estimate" and receive normalized data.

---

## 1. Personalization First

The tool should optimize for the player's actual preferences.

Example: A lower XP hunt may be recommended because:

- safer
- closer to depot
- lower setup time
- easier to stop mid-session
- less contested during peak hours

---

## 2. Low Friction

The tool should reduce mental load.

Goal:

- reduce decision fatigue
- reduce setup time
- reduce forgotten tasks
- reduce wasted travel

---

## 3. Modular Systems

Every major feature should operate independently.

This allows:

- easy iteration
- future expansion
- replacing modules later
- AI integration later

---

## 4. Advisory Over Automation

The system should:

- suggest
- prioritize
- remind
- estimate

The player manually performs actions.

---

# Data Availability / Integration Notes

The system should be designed around replaceable data providers because Tibia data availability varies by category.

## Known Useful Public/External Data Sources

### TibiaData API

TibiaData is a RESTful JSON API based on information from Tibia's official homepage. It includes useful categories such as characters, guilds, highscores, worlds, houses, and news. This makes it a strong candidate for character/world/house/news data providers. Source: TibiaData describes itself as a RESTful JSON API for Tibia.com-derived data and lists characters, guilds, highscores, worlds, houses, and news support.

### tibia.py

`tibia.py` is a Python library that fetches/parses Tibia.com data, including worlds, guilds, houses, highscores and kill statistics. It is useful if we want a backend worker written in Python, but the documentation notes 403/rate-limit risks when too many requests are made. This means caching and conservative polling are mandatory.

### Official Tibia.com Pages

Official pages are the source of truth, but should be accessed carefully and cached. The tool should avoid aggressive scraping.

### Third-Party Market/Bazaar Sites

Sites such as Exevo Pan and Hakaimarket provide useful market/bazaar-style data. These should be treated as optional third-party providers, not core dependencies. Their availability, data terms, and structure may change.

### Manual User Input

Manual input must remain a first-class provider for:

- current gold
- TC balance
- supplies
- imbuement timers
- prey options
- current unlock status
- market prices
- house ownership
- subjective hunt quality

Manual data is not a fallback; it is part of the core design.

---

# Data Provider Strategy

Each dynamic area should be abstracted behind a provider interface.

Example provider types:

- CharacterProvider
- WorldProvider
- HouseProvider
- NewsProvider
- BazaarProvider
- MarketPriceProvider
- EventProvider
- ActivityKnowledgeProvider

Each provider should expose:

- source name
- last updated timestamp
- confidence level
- freshness window
- normalized output
- error state

This allows modules to use the same data model whether the data came from:

- manual entry
- static JSON
- TibiaData
- Tibia.com parsing
- third-party source
- AI-assisted update

---

# Data Confidence Model

Every external or estimated data point should carry confidence metadata.

Example:

```json
{
  "value": 180000,
  "source": "manual_market_snapshot",
  "lastUpdated": "2026-05-26T19:00:00+10:00",
  "confidence": "medium",
  "freshness": "user-entered-today"
}
```

Confidence levels:

- high: current manual confirmation or trusted API
- medium: recent third-party or inferred value
- low: old guide, stale market value, estimated value
- unknown: no reliable source

Recommendations should visibly explain when they rely on low-confidence data.

---

# Static-to-Dynamic Upgrade Path

Each module should support four maturity levels.

## Level 0 - Static

Hardcoded or seed JSON.

Example: Lion's Rock is listed as level 45–60, low risk, short travel.

## Level 1 - Manual

User updates current values.

Example: User marks Lion's Rock as crowded or adds current market price.

## Level 2 - Assisted Dynamic

Backend fetches known public data and updates suggestions.

Example: World online population and house availability are fetched.

## Level 3 - AI-Assisted Dynamic

AI reviews new guides, patch notes, and news, then proposes activity-data updates for approval.

Example: AI flags that a Monk guide now recommends a safer level 80 hunt and asks whether to add it.

Important: AI should propose changes, not silently rewrite core priorities.

---

# Proposed High-Level Modules

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

---

# MODULE 1 - Character Profile System

Purpose: Store all information relevant to personalized recommendations.

Fields:

## Character Data

- name
- vocation
- level
- skills
- magic level
- world
- gold
- TC balance

## Account Assets

- owned house
- bed count
- keg setup
- prey slots
- charms
- major quest unlocks
- travel unlocks
- alternate characters

## Playstyle Preferences

- safety preference
- profit preference
- session length
- risk tolerance
- preferred hunt complexity
- tolerance for crowded spawns
- willingness to travel

## Progression Goals

- target level
- target gear
- house goal
- gold pouch goal
- prey slot goal
- upgrade priorities

---

# MODULE 2 - Activity Database

Purpose: Store all possible Tibia activities in a structured way.

Activities include:

- hunting spots
- boss rotations
- task systems
- quests
- access unlocks
- bestiary farming
- charm progression
- market flips
- daily/weekly activities
- event prep

Each activity contains:

## Core Metadata

- activity name
- category
- recommended level
- recommended vocation
- session length suitability

## Gameplay Data

- XP rating
- profit rating
- risk rating
- travel time
- spawn popularity
- setup complexity
- required quests/access

## Progression Data

- charm value
- task value
- unlock value
- long-term usefulness
- repeatability

## Personalization Data

- good for short sessions
- safe for distracted play
- good during peak hours
- suitable for solo Monk

---

# MODULE 3 - Priority Engine

Purpose: Determine the best current activities.

Inputs:

- available time
- current bankroll
- online server population
- active prey
- current goals
- event calendar
- unlocked content
- player preferences

Outputs:

- best current activity
- backup activity
- safe option
- profit option
- progression option

---

# Priority Scoring Example

priority score = (safety × 3)

- (goal relevance × 3)
- (time fit × 2)
- (travel convenience × 2)
- profit value
- prey synergy
- event bonus

* risk
* setup friction
* crowding likelihood

Weights should be configurable.

---

# MODULE 4 - Session Planner

Purpose: Generate actionable plans for current play session.

User Input: "How long will you play today?"

Options:

- 5 min
- 15 min
- 30 min
- 60 min
- 90 min
- 120+ min

Outputs:

## Example

90 minute session:

1. Check blessings
2. Check imbue timers
3. Main hunt: Lion's Rock
4. Backup hunt: Laguna Islands
5. Sell creature products after hunt
6. Deposit 20% into house fund

---

# MODULE 5 - Financial/Budget Planner

Purpose: Separate operational spending from progression goals.

Core Concept: The system should prevent accidental overspending.

---

# Financial Categories

## Operating Fund

For:

- potions
- blessings
- travel
- imbuements
- repairs

## Progression Fund

For:

- gear upgrades
- quests
- access unlocks
- charms

## Convenience Fund

For:

- house
- beds
- kegs
- gold pouch
- QoL systems

## Investment Fund

For:

- alternate character value
- resale improvements
- long-term account growth

---

# Budget Recommendation Logic

Example:

80k hunt profit:

- 50k operating/progression
- 15k house savings
- 10k reserve
- 5k market speculation

System should dynamically adjust percentages.

---

# MODULE 6 - Upgrade Planner

Purpose: Track upgrades and estimate acquisition strategy.

---

# Upgrade Types

- gear
- imbuements
- house
- beds
- prey slots
- charms
- gold pouch
- mounts/outfits (optional)

---

# Market Recommendation System

For each upgrade:

## Example

Zaoan Legs Current Market Price: 180k Suggested Buy Price: <=150k Recommendation:

- wait if over 150k
- farm if over 250k
- prioritize after imbues

---

# Farming Recommendation Logic

If: market price > threshold THEN:

- suggest farming creature products
- suggest alternative temporary gear
- delay purchase priority

---

# MODULE 7 - Reminder System

Purpose: Reduce forgotten maintenance tasks.

Examples:

- offline training reminder
- house rent reminder
- imbue expiration reminder
- event prep reminder
- prey refresh reminder

Notification style: non-invasive optional low-pressure

---

# MODULE 8 - Event Calendar System

Purpose: Track game-wide opportunities.

Events include:

- double XP/skill
- rapid respawn
- boosted creatures
- boosted bosses
- creature product trader
- seasonal events

Outputs:

- preparation reminders
- recommended activity shifts
- budget prep recommendations

---

# MODULE 9 - Market Intelligence System

Purpose: Track useful economic information.

Features:

- market price history
- average item value
- suggested buy thresholds
- suggested sell thresholds
- creature product profitability
- supply cost trends

Future possibilities:

- manual price tracking
- server-specific recommendations

---

# MODULE 10 - AI Knowledge Update Layer

Purpose: Keep recommendations updated over time without making the whole system dependent on AI.

AI responsibilities:

- summarize guides
- summarize patch notes
- detect meta shifts
- identify outdated recommendations
- propose activity database updates
- propose pricing heuristics
- explain why a priority changed

AI should NOT:

- control gameplay
- automate actions
- directly override user preferences
- silently replace user-approved strategy

AI outputs should be stored as proposed changes with:

- source URL/title
- date checked
- summary
- affected modules
- confidence rating
- user approval status

---

# Shared Services Layer

Shared services sit below feature modules and above raw data providers.

These services allow modules to change independently while still sharing common logic.

## Candidate Shared Services

### DataSourceService

Chooses which provider to use for a data type.

Example: Use manual market price if updated today; otherwise use third-party estimate; otherwise use static fallback.

### CacheService

Stores external API/scrape results to avoid rate limits and unnecessary calls.

### ConfidenceService

Calculates and exposes data reliability.

### CharacterStateService

Combines manual character data, public character data, and user goals into a single character state.

### EconomyService

Handles gold/TC value assumptions, budget buckets, price estimates, and upgrade affordability.

### ActivityScoringService

Calculates base activity scores before personalization.

### PersonalizationService

Applies Mitchell-specific preferences:

- safety first
- short sessions
- low travel
- low kiting
- low burnout
- low-risk solo play

### NotificationService

Handles browser/PWA notifications and reminder logic.

### EventService

Normalizes event calendar data and upcoming opportunity windows.

---

# Agent-Oriented Development Model

The layered architecture should also support safe AI-agent or multi-developer code automation.

Core idea:

- agents can work independently inside clearly isolated modules
- shared contracts protect neighboring modules
- higher-layer changes require more coordination
- shared-service changes have application-wide impact

---

# Agent Work Zones

## Safe Parallel Work

Agents can usually work in parallel when they are modifying separate modules within the same layer and only using stable interfaces.

Examples:

- one agent updates the Activity Database seed data
- one agent improves the Upgrade Planner UI
- one agent adds a new Reminder type
- one agent improves the Market Price form

These should not conflict if they respect shared interfaces.

---

## Coordination Required

Agents need coordination when working on:

- shared services
- domain models
- recommendation scoring
- data provider interfaces
- cross-module state
- database schema changes
- authentication/user profile logic

Reason: changes here can affect multiple modules at once.

---

## High-Risk Areas

These should require explicit review:

- Data model migrations
- Priority scoring algorithm changes
- Personalization weight changes
- Provider interface changes
- Budget allocation logic
- Notification scheduling rules
- AI auto-update behavior

---

# Agent Impact Levels

Every issue/task should be tagged with an impact level.

## Level 1 - Isolated Module Change

Low risk. Can usually be done independently.

Example: Add a new hunting activity card layout.

## Level 2 - Module Logic Change

Moderate risk. Requires module tests and contract checks.

Example: Change how Session Planner filters activities by time.

## Level 3 - Shared Service Change

High risk. Requires checking all dependent modules.

Example: Change EconomyService budget bucket calculations.

## Level 4 - Domain Model / Contract Change

Very high risk. Requires migration plan and coordinated updates.

Example: Change the Activity schema or Goal schema.

## Level 5 - System Behavior Change

Highest risk. Requires explicit approval.

Example: Change the global priority algorithm or AI update policy.

---

# Agent Contract Rules

Agents should follow these rules:

1. Do not bypass shared services.
2. Do not call external APIs directly from feature modules.
3. Do not silently change domain models.
4. Do not change scoring weights without noting user impact.
5. Do not introduce gameplay automation.
6. Keep manual fallback paths intact.
7. Preserve confidence/freshness metadata.
8. Add or update tests when touching shared logic.
9. Document assumptions in the affected module.
10. Prefer additive changes over breaking changes.

---

# Ownership Map

Suggested ownership boundaries:

## Data Source Layer

Responsible for:

- API clients
- scraping adapters
- manual input adapters
- caching raw responses

Agent risk: medium to high

## Normalization Layer

Responsible for:

- converting provider data into app models
- freshness/confidence tagging
- fallback handling

Agent risk: high

## Domain Model Layer

Responsible for:

- Activity
- Goal
- Upgrade
- CharacterState
- BudgetBucket
- DataPoint

Agent risk: very high

## Shared Services Layer

Responsible for:

- EconomyService
- CharacterStateService
- ActivityScoringService
- PersonalizationService
- NotificationService
- EventService

Agent risk: high

## Feature Modules Layer

Responsible for:

- Session Planner
- Upgrade Planner
- Budget Dashboard
- Activity List
- Reminder UI
- Market Watch

Agent risk: low to medium

## UI Layer

Responsible for:

- pages
- forms
- dashboards
- settings screens

Agent risk: low, unless changing shared state flows

---

# Contract-First Development

Before an agent modifies a shared layer, it should identify:

- affected models
- affected services
- affected modules
- expected user-visible behavior change
- required tests
- migration needs

Feature modules should depend on typed contracts rather than implementation details.

Example: Session Planner should request: `getRecommendedActivities(sessionContext)`

It should not know whether the underlying data came from:

- static JSON
- manual entry
- TibiaData
- AI proposal
- cached third-party source

---

# Agent Task Template

Each coding task should include:

```text
Task:
Layer:
Module:
Impact Level:
Depends On:
Can Run In Parallel With:
Must Not Touch:
Expected Output:
Tests Required:
User-Facing Change:
```

Example:

```text
Task: Add house goal savings widget
Layer: Feature Modules / UI
Module: Budget Dashboard
Impact Level: 1
Depends On: Goal model, EconomyService read methods
Can Run In Parallel With: Activity Database updates
Must Not Touch: EconomyService calculations, Goal schema
Expected Output: UI card showing target, saved amount, weekly contribution
Tests Required: render test, missing data fallback
User-Facing Change: shows progress toward house purchase
```

---

# Module Boundary Rule

Feature modules should not directly call external APIs.

Correct: Session Planner -> ActivityScoringService -> ActivityRepository -> DataSourceService -> Provider

Incorrect: Session Planner -> TibiaData API

This keeps the app modular and makes it easier to replace a manual/static system with a dynamic source later.

---

# Example Layered Flow

User clicks: "I have 60 minutes today"

1. UI sends session length to Session Planner
2. Session Planner requests current character state
3. CharacterStateService merges manual + public data
4. ActivityScoringService scores unlocked activities
5. PersonalizationService applies safety/travel preferences
6. EconomyService checks bankroll constraints
7. Recommendation Layer returns:
   - best activity
   - backup activity
   - preparation checklist
   - budget advice
   - confidence warnings

---

# Initial Data Models

## Activity

```json
{
  "id": "lions_rock",
  "name": "Lion's Rock",
  "category": "hunt",
  "levelRange": { "min": 45, "max": 80 },
  "vocations": ["monk"],
  "risk": "low-medium",
  "travelTimeMinutes": 5,
  "sessionFit": [30, 60, 90],
  "accessRequirements": ["lions_rock_access"],
  "profitProfile": "stable",
  "xpProfile": "good",
  "crowdingRisk": "medium",
  "preyTargets": ["lion", "roaring_lion"],
  "budgetNotes": ["bring supplies", "avoid boost until route learned"],
  "dataConfidence": "medium"
}
```

## Goal

```json
{
  "id": "small_house_with_beds",
  "name": "Small house with two beds",
  "category": "convenience",
  "priority": "high",
  "estimatedCostGold": { "min": 250000, "max": 1000000 },
  "benefits": ["faster daily loop", "monk offline training", "paladin offline training", "keg access"],
  "dependencies": [],
  "savingRule": { "type": "percentage", "value": 15 }
}
```

## Upgrade Rule

```json
{
  "itemId": "zaoans_legs",
  "name": "Zaoan Legs",
  "category": "gear",
  "suggestedBuyBelow": 150000,
  "waitAbove": 180000,
  "farmIfAbove": 250000,
  "temporaryAlternative": "current legs",
  "priority": "medium"
}
```

## DataPoint

```json
{
  "key": "zaoans_legs_market_price",
  "value": 180000,
  "source": "manual",
  "lastUpdated": "2026-05-26T19:00:00+10:00",
  "confidence": "high"
}
```

---

# Initial Technical Direction

Recommended stack:

Frontend:

- React
- Next.js
- Tailwind

Backend:

- Supabase or Firebase

Notifications:

- browser notifications
- optional mobile PWA support

Data Storage:

- modular JSON activity database

---

# MVP Roadmap

## Phase 1

- manual character profile
- activity database
- session planner
- simple recommendations

## Phase 2

- budgeting system
- upgrade tracking
- event calendar
- reminders

## Phase 3

- market intelligence
- AI updates
- personalized weighting system

## Phase 4

- advanced progression planning
- multi-character optimization
- long-term account value tracking

---

# Final Vision

A lightweight Tibia companion that answers:

"What should I do today that best fits my time, goals, and playstyle?"

while minimizing:

- friction
- burnout
- wasted gold
- unnecessary risk
- analysis paralysis

and maximizing:

- enjoyment
- sustainable progression
- account value
- efficient short sessions
- low-stress gameplay.

