Prioritized Interactivity Backlog

P0 — Replace log parsing with structured combat events
- Goal: Eliminate regex parsing for combat; drive UI from typed events.
- Deliverables:
  - `CombatEvent` interface and `combatEvents$` in GameLoopService or a mediator.
  - Map existing rule/policy outputs to CombatEvent emissions.
  - Unit tests for event emission on affect/consume outcomes.
- Acceptance: Floating numbers and sounds triggered via events (no regex).

P1 — CombatFeed service to fan-out events
- Goal: Centralize reactions (numbers, sounds, highlights).
- Deliverables:
  - `CombatFeedService` with `emit`, `combatEvents$`, and `handle` helpers.
  - Wire GamePage to forward structured events to CombatFeed.
- Acceptance: Damage/heal numbers, sounds, and highlight flash fired from CombatFeed.

P2 — Per-actor visual cues
- Goal: Improve clarity on who was affected.
- Deliverables:
  - Quick border flash on target card by effect type.
  - Minor offsets for damage/heal numbers relative to target card.
- Acceptance: Visual flash appears and fades; numbers anchor correctly.

P3 — Mini-bars and status chips on interactive cards
- Goal: Show HP/EP/AP snapshots and status effects.
- Deliverables:
  - Optional inputs on `InteractiveWidgetComponent` for live stats/effects.
  - `status-chip` and `cooldown-badge` components.
- Acceptance: When provided, cards render mini-bars and chips; OnPush components.

P4 — Critical, miss, dodge feedback
- Goal: Enrich combat feel.
- Deliverables:
  - Critical variant (bigger, brief shake) for floating numbers.
  - "Miss" / "Dodge" overlay animations and subtle sounds.
- Acceptance: Variants visible based on `CombatEvent.outcome`.

P5 — Audio expansion per effect type
- Goal: Map effect types to distinctive sounds.
- Deliverables:
  - Extend SoundService map for KINETIC/FIRE/ACID/PROFANE/SACRED.
- Acceptance: Sound varies with effect type; sensible fallbacks.

P6 — Combat timeline panel (optional)
- Goal: Structured, scannable recent events.
- Deliverables:
  - Compact panel listing recent events with icons and amounts.
- Acceptance: New panel toggled in layout; links highlight involved cards.

