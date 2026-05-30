# Tibia Personal Advisor Architecture

## Purpose
This project uses a layered architecture so each capability can evolve from static/manual inputs to dynamic providers without breaking feature behavior.

Feature modules consume stable contracts and shared services. They should not depend on provider-specific details.

## Layered Architecture

### 1) Data Source Layer
Responsibilities:

- Provider adapters for public APIs, websites, and manual input
- Raw response retrieval
- Source metadata capture
- Cache-aware fetch behavior

Examples of provider families:

- Character provider
- World provider
- House provider
- News/event provider
- Market/bazaar provider
- Manual input provider

Initial Layer 1 public-provider decision:

- The first public provider family is the Character provider.
- Prefer TibiaData for the first public adapter because it offers Tibia.com-derived character data through a simpler JSON surface.
- Do not make direct Tibia.com page parsing the first implementation target; keep it as a later fallback/reference option if TibiaData is insufficient.
- Defer house, world, news/event, and market/bazaar public providers until the initial character-provider contract is in place.

Initial freshness guardrails for the first public provider:

- No scheduled background polling in the first iteration; refresh on demand only.
- Revalidate a given character at most once every 15 minutes.
- Treat successful public character responses as fresh for 15 minutes (not fresh after that).
- Mark public character data as stale after 60 minutes without a successful refresh so manual/static fallbacks remain the safe default.

### 2) Normalization Layer
Responsibilities:

- Convert source-specific payloads to shared internal shapes
- Apply fallback and merge rules
- Attach confidence/freshness/source metadata
- Expose consistent normalized outputs

### 3) Domain Model Layer
Responsibilities:

- Define canonical business entities and contracts
- Keep model semantics stable across features
- Protect module contracts from provider churn

Examples:

- Activity
- Goal
- Upgrade
- CharacterState
- BudgetBucket
- DataPoint

### 4) Shared Services Layer
Responsibilities:

- Cross-module business logic and orchestration
- Provider selection and fallback routing
- Confidence/freshness interpretation
- Economy, scoring, personalization, events, and notifications

Shared services are reusable system infrastructure and must remain contract-first.

### 5) Feature Modules Layer
Responsibilities:

- Implement product features using shared services and domain contracts
- Keep feature logic modular and independently evolvable

Examples:

- Session Planner
- Upgrade Planner
- Budget Dashboard
- Activity List
- Reminder flows
- Market Watch flows

### 6) Recommendation Layer
Responsibilities:

- Combine scored activities, constraints, and preferences into recommendations
- Return ranked options and rationale
- Surface uncertainty warnings from low-confidence data

### 7) UI/Notification Layer
Responsibilities:

- Present recommendations, plans, reminders, and explanations
- Collect manual inputs and user settings
- Deliver optional browser/PWA notifications

## Static/Manual To Dynamic Upgrade Paths
Each feature should support maturity levels without changing feature contracts:

- Level 0: Static (seed/static values)
- Level 1: Manual (user-entered current values)
- Level 2: Assisted Dynamic (public source refresh)
- Level 3: AI-Assisted Dynamic (proposal workflow with user approval)

This prevents rewrites when data quality improves over time.

## Provider Abstraction
Providers should be hidden behind interfaces so features ask for domain data, not source-specific payloads.

Provider contract expectations:

- Source identifier
- Last-updated timestamp
- Confidence level
- Freshness window
- Normalized output payload
- Error state

Benefit: feature code remains unchanged whether data came from manual entry, static data, API data, or approved AI proposals.

## Confidence And Freshness Metadata
All external or estimated data points should carry metadata used in recommendations and UI messaging.

Suggested fields:

- source
- lastUpdated
- confidence (high/medium/low/unknown)
- freshness descriptor/window

Behavioral requirement:

- Recommendation output must visibly indicate low-confidence or stale inputs.

## Why Feature Modules Must Not Call External APIs Directly
Direct API calls from feature modules are disallowed because they:

- Break replacement and fallback flexibility
- Duplicate network/caching logic
- Bypass confidence/freshness handling
- Increase cross-module coupling and regressions
- Make static/manual fallback preservation harder

Correct flow:

Feature Module -> Shared Service -> Data Source Service -> Provider -> Normalization -> Domain Contract

Incorrect flow:

Feature Module -> External API

## Example End-To-End Flow
When a user asks for a 60-minute plan:

1. UI submits session context.
2. Session Planner requests character and activity context from shared services.
3. Shared services merge manual and public data through normalized contracts.
4. Scoring/personalization applies safety, travel, bankroll, and goal factors.
5. Recommendation layer returns ranked options plus confidence notes.
6. UI presents the plan and optional reminders.
