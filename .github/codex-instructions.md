# Codex Review Instructions

Review priorities:
1. Scope control
2. Architecture boundaries
3. Meaningful tests
4. Safety boundaries
5. No gameplay automation
6. Manual/static fallback preservation
7. Clear PR explanation

Flag serious issues only:
- out-of-scope changes
- broken architecture boundaries
- unsafe automation
- missing meaningful tests where behavior changed
- direct API calls from feature modules
- hidden domain model changes
- unclear migration behavior
- removed manual/static fallback behavior

Do not nitpick style if CI/lint already covers it.