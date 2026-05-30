# Layer Rollout and Unlock Criteria

## Purpose

This document maps the repository's implementation order across layers, defines what "Layer 1 complete enough to unlock Layer 2" means in repository terms, and clarifies which work types remain blocked until lower-layer contracts are in place.

For layer definitions and responsibilities, see [docs/ARCHITECTURE.md](ARCHITECTURE.md).
For task scheduling and parallel-safe rules, see [docs/AGENT_WORKFLOW.md](AGENT_WORKFLOW.md).
For the task gate that enforces these criteria, see `.github/workflows/task-gate.yml`.

---

## Layer Order

Layers must be built from the bottom up. Higher layers depend on contracts that lower layers define. Work should not begin on a layer until the unlock criteria for the layer below it are met.

Layer 0 is a project-management phase (repository scaffold) that precedes the seven architecture implementation layers. Layers 1–7 correspond to the architecture layers defined in [docs/ARCHITECTURE.md](ARCHITECTURE.md) in order.

| Layer | Name | Summary |
|---|---|---|
| Layer 0 | Repository Scaffold | Foundation docs, repository structure, task gate, and placeholder contracts |
| Layer 1 | Data Source Layer | Provider adapters, raw fetch, source metadata, and cache-aware behavior |
| Layer 2 | Normalization Layer | Convert provider payloads to shared shapes; attach confidence and freshness metadata |
| Layer 3 | Domain Model Layer | Canonical business entities and stable contracts |
| Layer 4 | Shared Services Layer | Cross-module orchestration, scoring, personalization, and provider routing |
| Layer 5 | Feature Modules Layer | Product features built on shared services and domain contracts |
| Layer 6 | Recommendation Layer | Ranked recommendation assembly from scored activities and constraints |
| Layer 7 | UI/Notification Layer | Presentation, manual inputs, user settings, and browser/PWA notifications |

---

## Currently Unlocked Layer

**Layer 0 — Repository Scaffold** is the only currently unlocked layer.

The task gate allows `status:ready` only on issues labeled with the current `UNLOCKED_LAYER_LABEL` value in `.github/workflows/task-gate.yml` (currently `layer:01-scaffold`). All other layer issues are automatically moved to `status:blocked`.

---

## Layer 0 Unlock Criteria

Layer 1 becomes available when all of the following are true for Layer 0:

- [ ] `README.md` is replaced with the repository guide (`docs/` links, product description, local commands, safety boundary statement)
- [ ] `docs/PRODUCT_SPEC.md` exists and describes the product vision, intended user, core features, and scope boundaries
- [ ] `docs/ARCHITECTURE.md` exists and defines all seven layers and their responsibilities
- [ ] `docs/AGENT_WORKFLOW.md` exists and defines the agent task model, impact levels, PR rules, and must-follow contract rules
- [ ] `docs/SAFETY_BOUNDARIES.md` exists and states the primary safety rule, forbidden behaviors, and allowed behaviors
- [ ] `docs/WORKFLOW.md` exists and documents the label model, task gate, required issue fields, required PR fields, and scope control rules
- [ ] `docs/LAYER_ROLLOUT.md` exists and defines the layer order and unlock criteria
- [ ] `.github/workflows/task-gate.yml` enforces the Layer 0 gate and blocks non-scaffold issues from reaching `status:ready`
- [ ] `.github/workflows/ci.yml` runs lint and tests on PRs targeting `main`
- [ ] `.github/ISSUE_TEMPLATE/agent-task.yml` captures all required issue fields
- [ ] `.github/pull_request_template.md` captures all required PR fields including the safety checklist
- [ ] All `layer:01-scaffold` issues with `status:ready` have been implemented and merged

---

## Layer 1 Unlock Criteria

Layer 2 becomes available when all of the following are true for Layer 1:

- [ ] At least one provider adapter exists with a defined interface (source identifier, last-updated timestamp, confidence level, freshness window, normalized output payload, error state)
- [ ] Provider families are stubbed or partially implemented (character, world, house, news/event, market/bazaar, manual input)
- [ ] Raw response retrieval and source metadata capture are in place
- [ ] Cache-aware fetch behavior is defined

### Initial Layer 1 Scope Decision

Future Layer 1 implementation issues should use the following default scope unless a later planning issue explicitly changes it:

- First public provider family: Character provider
- Initial public source preference: TibiaData first
- Initial public source deferrals: direct Tibia.com parsing is fallback/reference-only, and third-party market/bazaar sources are not part of the first public-provider iteration
- Initial freshness policy: no scheduled polling, on-demand refresh at most once every 15 minutes per character, 15-minute cache TTL on successful responses, and stale labeling after 60 minutes without a successful refresh

---

## Layer 2 Unlock Criteria

Layer 3 becomes available when all of the following are true for Layer 2:

- [ ] Source-specific payloads are converted to shared internal shapes
- [ ] Fallback and merge rules are defined
- [ ] Confidence, freshness, and source metadata are attached to all normalized outputs
- [ ] Consistent normalized output contracts are exposed and tested
- [ ] No feature module calls an external API directly

---

## Layer 3 Unlock Criteria

Layer 4 becomes available when all of the following are true for Layer 3:

- [ ] Domain entities (`Activity`, `Goal`, `Upgrade`, `CharacterState`, `BudgetBucket`, `DataPoint`) are defined as stable contracts
- [ ] Domain contracts are tested for interface stability
- [ ] No shared service or feature module depends on provider-specific payload shapes

---

## Layer 4 Unlock Criteria

Layer 5 becomes available when all of the following are true for Layer 4:

- [ ] Shared services exist for economy, scoring, personalization, events, and notifications
- [ ] Provider selection and fallback routing is implemented
- [ ] Confidence/freshness interpretation is handled in shared services, not in feature modules
- [ ] All shared service interfaces are tested

---

## Layer 5 Unlock Criteria

Layer 6 becomes available when all of the following are true for Layer 5:

- [ ] At least one feature module is fully implemented using shared services and domain contracts
- [ ] Manual/static fallback paths are preserved in all feature modules
- [ ] Feature module tests validate behavior and contracts

---

## Layer 6 Unlock Criteria

Layer 7 becomes available when all of the following are true for Layer 6:

- [ ] Recommendation output includes ranked options and rationale
- [ ] Low-confidence and stale input warnings are surfaced in recommendation output
- [ ] Recommendation behavior is tested

---

## Parallel-Safe Work Within a Layer

Within a given layer, tasks may run in parallel when they:

- Work in different modules without shared contract changes
- Depend only on stable, unchanged contracts
- Do not edit shared service internals or shared model schemas

Each issue specifies which other tasks it is parallel-safe with. Refer to the issue description before scheduling parallel work.

---

## Work That Remains Blocked

The following work types are blocked until the indicated layer is unlocked:

| Blocked Work | Unlocks At |
|---|---|
| Provider adapter implementation | Layer 1 |
| Normalization contract definitions | Layer 2 |
| Domain entity definitions | Layer 3 |
| Shared service implementation | Layer 4 |
| Feature module implementation | Layer 5 |
| Recommendation assembly | Layer 6 |
| UI and notification implementation | Layer 7 |
| Database schema design | Layer 3+ |
| External API integration | Layer 1+ |
| Application deployment configuration | Layer 5+ |
