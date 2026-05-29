# Layer Rollout and Unlock Criteria

## Purpose
This document translates the architecture into a practical implementation sequence. It defines what must be complete at each layer before the next layer's work becomes ready, and distinguishes parallel-safe work from coordination-required work.

## Layer Order
The architecture defines 7 layers in this order:

1. Data Source Layer
2. Normalization Layer
3. Domain Model Layer
4. Shared Services Layer
5. Feature Modules Layer
6. Recommendation Layer
7. UI/Notification Layer

Work should generally progress from lower contracts to higher feature behavior.

## Current Status
**Currently unlocked layer:** Layer 1 - Repository foundation / scaffold

**Active layer label:** `layer:01-scaffold`

This is a meta-layer for planning, documentation, and repository infrastructure. It sits below the 7 architecture layers and must establish the foundation before any application code work begins.

## Layer 1: Repository Foundation / Scaffold

### Scope
Repository planning, documentation, issue workflow, and development infrastructure.

### Unlock Criteria for Layer 2 (Data Source Layer)
Layer 2 work becomes ready when:

- [ ] Core architecture documentation is complete and reviewed
- [ ] Agent workflow rules are documented and enforced
- [ ] Product specification establishes scope boundaries
- [ ] Layer rollout sequence is documented (this document)
- [ ] Repository README provides clear guidance for contributors
- [ ] Issue workflow and task-gate behavior are defined
- [ ] Development environment setup is documented
- [ ] Safety boundaries are documented

### Parallel-Safe Work in Layer 1
Work in Layer 1 is generally parallel-safe when agents:

- Work on different documentation files
- Update separate sections of repository guides
- Create isolated planning documents
- Improve CI/workflow definitions independently

### Coordination-Required Work in Layer 1
Coordination is required for:

- Changes to architecture layer definitions
- Modifications to agent workflow rules
- Updates to product scope boundaries
- Changes to task-gate logic or layer labels

## Layer 2: Data Source Layer

### Dependencies
- Layer 1 complete (repository foundation established)

### Scope
Provider adapters for public APIs, websites, and manual input. Raw response retrieval, source metadata capture, and cache-aware fetch behavior.

### Unlock Criteria for Layer 3 (Normalization Layer)
Layer 3 work becomes ready when:

- [ ] Provider interface contracts are defined
- [ ] Source metadata shape is established
- [ ] Cache strategy interface is defined
- [ ] Error state contracts are defined
- [ ] At least one provider family has a defined contract (character, world, house, news, market, or manual input)

### Parallel-Safe Work in Layer 2
- Implementing different provider families (character, world, house, etc.)
- Adding new providers to an existing provider family
- Improving cache behavior within a single provider

### Coordination-Required Work in Layer 2
- Changing provider interface contracts
- Modifying source metadata shape
- Altering cache strategy interfaces
- Changing error state contracts

## Layer 3: Normalization Layer

### Dependencies
- Layer 2 (Data Source Layer) contracts defined

### Scope
Convert source-specific payloads to shared internal shapes. Apply fallback and merge rules. Attach confidence/freshness/source metadata.

### Unlock Criteria for Layer 4 (Domain Model Layer)
Layer 4 work becomes ready when:

- [ ] Normalization output shape contracts are defined
- [ ] Confidence metadata schema is established
- [ ] Freshness metadata schema is established
- [ ] Fallback and merge rule patterns are defined
- [ ] At least one provider family has a working normalizer

### Parallel-Safe Work in Layer 3
- Building normalizers for different provider families
- Improving merge rules for a specific data type
- Enhancing confidence calculations for isolated data sources

### Coordination-Required Work in Layer 3
- Changing normalized output contracts
- Modifying confidence/freshness metadata schemas
- Altering fallback/merge rule patterns
- Changing how multiple sources are combined

## Layer 4: Domain Model Layer

### Dependencies
- Layer 3 (Normalization Layer) contracts defined

### Scope
Define canonical business entities and contracts. Keep model semantics stable across features. Protect module contracts from provider churn.

### Unlock Criteria for Layer 5 (Shared Services Layer)
Layer 5 work becomes ready when:

- [ ] Core domain entities are defined (Activity, Goal, Upgrade, CharacterState, BudgetBucket, DataPoint)
- [ ] Entity relationships are documented
- [ ] Contract stability guarantees are established
- [ ] Model evolution rules are defined

### Parallel-Safe Work in Layer 4
- Defining separate domain entities with no shared dependencies
- Adding optional fields to existing entities (with defaults)
- Documenting entity usage patterns

### Coordination-Required Work in Layer 4
- Changing core entity contracts
- Modifying entity relationships
- Altering contract semantics
- Removing or renaming entity fields

## Layer 5: Shared Services Layer

### Dependencies
- Layer 4 (Domain Model Layer) core entities defined

### Scope
Cross-module business logic and orchestration. Provider selection and fallback routing. Confidence/freshness interpretation. Economy, scoring, personalization, events, and notifications.

### Unlock Criteria for Layer 6 (Feature Modules Layer)
Layer 6 work becomes ready when:

- [ ] Provider selection service interface is defined
- [ ] Confidence/freshness interpretation rules are established
- [ ] Core shared service contracts are defined (economy, scoring, events)
- [ ] Service-to-service dependency rules are documented

### Parallel-Safe Work in Layer 5
- Implementing new shared services with no dependencies on other services
- Enhancing existing services without changing contracts

### Coordination-Required Work in Layer 5
- Changing shared service contracts
- Modifying cross-service orchestration patterns
- Altering provider selection/fallback logic
- Changing confidence/freshness interpretation rules

## Layer 6: Feature Modules Layer

### Dependencies
- Layer 5 (Shared Services Layer) contracts defined
- Domain Model contracts stable

### Scope
Implement product features using shared services and domain contracts. Keep feature logic modular and independently evolvable.

### Unlock Criteria for Layer 7 (Recommendation Layer)
Layer 7 work becomes ready when:

- [ ] At least two feature modules are implemented
- [ ] Feature modules successfully consume shared services
- [ ] Feature module contracts are stable
- [ ] Feature module output shapes are defined

### Parallel-Safe Work in Layer 6
- Building different feature modules (Session Planner, Upgrade Planner, Budget Dashboard, Activity List, Reminders, Market Watch)
- Enhancing existing feature modules without changing their contracts

### Coordination-Required Work in Layer 6
- Changing feature module contracts
- Modifying how features consume shared services
- Altering feature output shapes

## Layer 7: Recommendation Layer

### Dependencies
- Layer 6 (Feature Modules Layer) with stable contracts

### Scope
Combine scored activities, constraints, and preferences into recommendations. Return ranked options and rationale. Surface uncertainty warnings from low-confidence data.

### Unlock Criteria for Layer 8 (UI/Notification Layer)
Layer 8 work becomes ready when:

- [ ] Recommendation ranking algorithm is defined
- [ ] Recommendation output contract is established
- [ ] Rationale generation rules are defined
- [ ] Uncertainty warning logic is implemented

### Parallel-Safe Work in Layer 7
- Improving ranking algorithms
- Enhancing rationale generation
- Adding new recommendation strategies

### Coordination-Required Work in Layer 7
- Changing recommendation output contracts
- Modifying core ranking behavior
- Altering how recommendations surface uncertainty

## Layer 8: UI/Notification Layer

### Dependencies
- Layer 7 (Recommendation Layer) with stable contracts

### Scope
Present recommendations, plans, reminders, and explanations. Collect manual inputs and user settings. Deliver optional browser/PWA notifications.

### Parallel-Safe Work in Layer 8
- Building different UI views for separate features
- Improving presentation of isolated components
- Adding new notification types

### Coordination-Required Work in Layer 8
- Changing how UI consumes recommendation contracts
- Modifying manual input collection patterns
- Altering notification delivery behavior

## Coordination Patterns

### When to Wait for Coordination
Wait for explicit coordination and review when changes touch:

- Any contract that crosses layer boundaries
- Shared services used by multiple modules
- Domain models referenced by multiple features
- Provider interfaces used by multiple normalizers
- Recommendation scoring behavior
- Cross-module state flow
- Data migration requirements

### When Parallel Work Is Safe
Parallel implementation is safe when:

- Working in different modules within the same layer
- Depending only on stable, unchanged contracts
- Avoiding shared service internals or shared model schemas
- Changes are additive and backward-compatible

## Impact Level Mapping

### Impact 1: Isolated Module Change
- Usually parallel-safe within the same layer
- Low downstream risk

### Impact 2: Module Logic Change
- Requires module tests and contract validation
- May need coordination if module contract changes

### Impact 3: Shared Service Change
- High risk
- Always requires coordination
- Needs dependent module validation

### Impact 4: Domain Model/Contract Change
- Very high risk
- Always requires coordination
- Needs coordinated updates and migration planning

### Impact 5: System Behavior Change
- Highest risk
- Always requires coordination and explicit approval
- Needs broad regression review

## Task Gate Enforcement
The task-gate workflow enforces layer unlocking:

- Currently, only issues labeled `layer:01-scaffold` may receive `status:ready`
- Issues for higher layers will be automatically blocked
- When Layer 1 unlock criteria are met, the task gate will be updated to unlock Layer 2
- This pattern continues for each subsequent layer

## Follow-Up Actions
Once Layer 1 criteria are satisfied:

1. Update task-gate.yml to unlock `layer:02-data-source`
2. Create the next batch of issues for Layer 2 only
3. Do not create issues for higher layers until their dependencies are met
4. Update this document's "Current Status" section as layers unlock

## References
- docs/ARCHITECTURE.md - Layer definitions and responsibilities
- docs/AGENT_WORKFLOW.md - Parallel-safe vs coordination-required rules
- docs/PRODUCT_SPEC.md - Product scope boundaries
- .github/workflows/task-gate.yml - Current layer enforcement logic
