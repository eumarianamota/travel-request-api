# Tasks: Query National Holidays

**Input**: Design documents from `/specs/005-query-national-holidays/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include automated test tasks for every behavior change unless the feature specification explicitly justifies why tests are not being added.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared artifacts used by all holiday-query scenarios.

- [x] T001 [P] Add contract regression coverage for `GET /holidays/{year}` in `test/integration/holidays/get-holidays.contract.spec.ts`
- [x] T002 [P] Extend shared HTTP helpers for holiday-year requests in `test/integration/trip-requests/test-http.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared year parsing and holiday-query orchestration contracts.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Add year parsing support for holiday queries in `src/holidays/domain/holiday-year.ts`
- [x] T004 [P] Add holiday query application contract in `src/holidays/application/get-holidays-by-year.ts`
- [x] T005 [P] Extend shared HTTP dependencies for holiday query wiring in `src/shared/infra/http/types.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View National Holidays for a Year (Priority: P1) 🎯 MVP

**Goal**: Return the holiday list for a valid year in the standard success envelope.

**Independent Test**: Request `GET /holidays/:year` for a year with available holiday data and verify that the response returns the expected list in the standard success envelope.

### Tests for User Story 1

- [x] T006 [P] [US1] Add success-path integration coverage for cached and synchronized year queries in `test/integration/holidays/get-holidays.success.spec.ts`
- [x] T007 [P] [US1] Add holiday query use-case coverage for local-first year resolution in `test/unit/holidays/get-holidays-by-year.spec.ts`

### Implementation for User Story 1

- [x] T008 [US1] Implement the holiday-year query use case in `src/holidays/application/get-holidays-by-year.ts`
- [x] T009 [US1] Expose `GET /holidays/:year` in `src/holidays/infra/get-holidays-controller.ts` and `src/shared/infra/http/register-routes.ts`
- [x] T010 [US1] Ensure application bootstrap wires holiday query dependencies through existing infrastructure in `src/main.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Reuse Previously Available Year Data (Priority: P2)

**Goal**: Reuse locally available holiday data for repeated requests to the same year.

**Independent Test**: Query `GET /holidays/:year` for a year already present locally and verify that the system returns the stored holiday list successfully without needing a fresh provider result.

### Tests for User Story 2

- [x] T011 [P] [US2] Add focused integration coverage for locally available year reuse in `test/integration/holidays/get-holidays.cached.spec.ts`
- [x] T012 [P] [US2] Add unit coverage for skipping the gateway when a year is already cached in `test/unit/holidays/get-holidays-by-year.spec.ts`

### Implementation for User Story 2

- [x] T013 [US2] Refine holiday query orchestration to prioritize repository results before provider synchronization in `src/holidays/application/get-holidays-by-year.ts`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Receive Clear Feedback When the Year Cannot Be Resolved (Priority: P3)

**Goal**: Reject invalid provided year input and map required-provider failures to standardized errors.

**Independent Test**: Query `GET /holidays/:year` with invalid provided year input and with a valid uncached year whose provider call fails, then verify standardized `400` and `502` error responses.

### Tests for User Story 3

- [x] T014 [P] [US3] Add invalid-year integration coverage in `test/integration/holidays/get-holidays.validation.spec.ts`
- [x] T015 [P] [US3] Add provider-unavailable integration coverage in `test/integration/holidays/get-holidays.unavailable.spec.ts`
- [x] T016 [P] [US3] Add year parsing and provider-failure use-case coverage in `test/unit/holidays/holiday-year.spec.ts` and `test/unit/holidays/get-holidays-by-year.spec.ts`

### Implementation for User Story 3

- [x] T017 [US3] Implement positive-integer year parsing and validation in `src/holidays/domain/holiday-year.ts`
- [x] T018 [US3] Map required provider failures through the holiday query use case and controller path in `src/holidays/application/get-holidays-by-year.ts` and `src/holidays/infra/get-holidays-controller.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation alignment and run the repository-preferred validation flow.

- [x] T019 [P] Reconcile holiday-query examples and validation notes in `specs/005-query-national-holidays/contracts/openapi.yaml` and `specs/005-query-national-holidays/quickstart.md`
- [x] T020 [P] Ensure holiday query observability aligns with repository expectations in `src/shared/infra/http/logger.ts` usage within `src/holidays/application/get-holidays-by-year.ts` and `src/holidays/infra/get-holidays-controller.ts`
- [ ] T021 Run the repository-preferred validation flow documented in `specs/005-query-national-holidays/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-5)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) but depends on the holiday query flow introduced in US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) but depends on the holiday query flow introduced in US1

### Within Each User Story

- Tests for changed behavior should be written first when practical
- Domain parsing contracts come before use-case orchestration
- Use-case orchestration comes before controller and route wiring
- Story behavior should be independently validated before moving on

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003, T004, and T005 can run in parallel
- T006 and T007 can run in parallel
- T011 and T012 can run in parallel
- T014, T015, and T016 can run in parallel
- T019 and T020 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "Add success-path integration coverage for cached and synchronized year queries in test/integration/holidays/get-holidays.success.spec.ts"
Task: "Add holiday query use-case coverage for local-first year resolution in test/unit/holidays/get-holidays-by-year.spec.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch User Story 2 tests together:
Task: "Add focused integration coverage for locally available year reuse in test/integration/holidays/get-holidays.cached.spec.ts"
Task: "Add unit coverage for skipping the gateway when a year is already cached in test/unit/holidays/get-holidays-by-year.spec.ts"
```

---

## Parallel Example: User Story 3

```bash
# Launch User Story 3 tests together:
Task: "Add invalid-year integration coverage in test/integration/holidays/get-holidays.validation.spec.ts"
Task: "Add provider-unavailable integration coverage in test/integration/holidays/get-holidays.unavailable.spec.ts"
Task: "Add year parsing and provider-failure use-case coverage in test/unit/holidays/holiday-year.spec.ts and test/unit/holidays/get-holidays-by-year.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → Test independently → Deploy/Demo
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Finish with documentation, observability, and validation commands

### Suggested MVP Scope

- Phase 1
- Phase 2
- Phase 3 (User Story 1)
