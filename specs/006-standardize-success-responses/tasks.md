# Tasks: Standardize Success Responses

**Input**: Design documents from `/specs/006-standardize-success-responses/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include automated test tasks for every behavior change unless the
feature specification explicitly justifies why tests are not being added.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared contract artifacts and response helpers used by the standardization work.

- [x] T001 [P] Add contract regression coverage for the standardized success envelope in `test/integration/trip-requests/create-trip-request.contract.spec.ts`, `test/integration/trip-requests/list-trip-requests.contract.spec.ts`, `test/integration/trip-requests/get-trip-request.contract.spec.ts`, `test/integration/trip-requests/cancel-trip-request.contract.spec.ts`, and `test/integration/holidays/get-holidays.contract.spec.ts`
- [x] T002 [P] Document the shared success-envelope contract examples in `specs/006-standardize-success-responses/contracts/openapi.yaml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared success-response serialization guidance before story-specific controller updates.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Define shared success-response expectations in `specs/006-standardize-success-responses/data-model.md` and align validation scenarios in `specs/006-standardize-success-responses/quickstart.md`
- [x] T004 [P] Add shared success-response serialization helper in `src/shared/infra/http/success-response.ts` for reuse across controllers

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Receive Created Trip Requests Predictably (Priority: P1) 🎯 MVP

**Goal**: Ensure successful trip-request creation consistently returns `201` with `success: true` and the created trip request in `data`.

**Independent Test**: Send a valid `POST /trip-requests` request and verify that the API returns `201 Created` with the standardized success envelope and the created trip request payload in `data`.

### Tests for User Story 1

- [x] T005 [P] [US1] Add focused integration coverage for the create success envelope in `test/integration/trip-requests/create-trip-request.success.spec.ts`
- [x] T006 [P] [US1] Extend the create success contract assertions in `test/integration/trip-requests/create-trip-request.contract.spec.ts`

### Implementation for User Story 1

- [x] T007 [US1] Update successful create-response serialization in `src/trip-requests/infra/create-trip-request-controller.ts`
- [x] T008 [US1] Ensure create-flow success logging and serialization remain aligned in `src/trip-requests/infra/create-trip-request-controller.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Receive Collection Results Consistently (Priority: P2)

**Goal**: Ensure list-style operations return successful collections in the same `success/data` envelope.

**Independent Test**: Request `GET /trip-requests` and `GET /holidays/:year` successfully and verify that both responses return `success: true` with their collections placed directly in `data`.

### Tests for User Story 2

- [x] T009 [P] [US2] Add focused integration coverage for trip-request list success envelopes in `test/integration/trip-requests/list-trip-requests.spec.ts` and `test/integration/trip-requests/list-trip-requests.empty.spec.ts`
- [x] T010 [P] [US2] Add focused integration coverage for holiday list success envelopes in `test/integration/holidays/get-holidays.success.spec.ts` and `test/integration/holidays/get-holidays.cached.spec.ts`
- [x] T011 [P] [US2] Extend list-style success contract assertions in `test/integration/trip-requests/list-trip-requests.contract.spec.ts` and `test/integration/holidays/get-holidays.contract.spec.ts`

### Implementation for User Story 2

- [x] T012 [US2] Update trip-request list success serialization in `src/trip-requests/infra/list-trip-requests-controller.ts`
- [x] T013 [US2] Update holiday query success serialization in `src/holidays/infra/get-holidays-controller.ts`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Receive Single-Resource Results Consistently (Priority: P3)

**Goal**: Ensure successful get-by-id and cancel operations return one full trip request inside the standardized success envelope.

**Independent Test**: Request `GET /trip-requests/:id` and `PATCH /trip-requests/:id/cancel` successfully and verify that both responses return `success: true` with one full trip request object in `data`.

### Tests for User Story 3

- [x] T014 [P] [US3] Add focused integration coverage for get-by-id success envelopes in `test/integration/trip-requests/get-trip-request.success.spec.ts`
- [x] T015 [P] [US3] Add focused integration coverage for cancel success envelopes in `test/integration/trip-requests/cancel-trip-request.success.spec.ts`
- [x] T016 [P] [US3] Extend single-resource success contract assertions in `test/integration/trip-requests/get-trip-request.contract.spec.ts` and `test/integration/trip-requests/cancel-trip-request.contract.spec.ts`

### Implementation for User Story 3

- [x] T017 [US3] Update get-by-id success serialization in `src/trip-requests/infra/get-trip-request-controller.ts`
- [x] T018 [US3] Update cancel success serialization in `src/trip-requests/infra/cancel-trip-request-controller.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation alignment and run repository-preferred validation.

- [x] T019 [P] Reconcile success-envelope examples and response-shape notes in `specs/006-standardize-success-responses/contracts/openapi.yaml` and `specs/006-standardize-success-responses/quickstart.md`
- [x] T020 [P] Review shared HTTP helpers or controller serialization duplication for cleanup in `src/shared/infra/http/`, `src/trip-requests/infra/`, and `src/holidays/infra/`
- [ ] T021 Run the repository-preferred validation flow documented in `specs/006-standardize-success-responses/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-5)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) and depends on the shared success-envelope expectations established in US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) and depends on the shared success-envelope expectations established in US1

### Within Each User Story

- Tests for changed behavior should be written first when practical
- Contract assertions come before controller updates
- Controller serialization updates come before cleanup
- Story behavior should be independently validated before moving on

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003 and T004 can run in parallel
- T005 and T006 can run in parallel
- T009, T010, and T011 can run in parallel
- T014, T015, and T016 can run in parallel
- T019 and T020 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "Add focused integration coverage for the create success envelope in test/integration/trip-requests/create-trip-request.success.spec.ts"
Task: "Extend the create success contract assertions in test/integration/trip-requests/create-trip-request.contract.spec.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch User Story 2 tests together:
Task: "Add focused integration coverage for trip-request list success envelopes in test/integration/trip-requests/list-trip-requests.spec.ts and test/integration/trip-requests/list-trip-requests.empty.spec.ts"
Task: "Add focused integration coverage for holiday list success envelopes in test/integration/holidays/get-holidays.success.spec.ts and test/integration/holidays/get-holidays.cached.spec.ts"
Task: "Extend list-style success contract assertions in test/integration/trip-requests/list-trip-requests.contract.spec.ts and test/integration/holidays/get-holidays.contract.spec.ts"
```

---

## Parallel Example: User Story 3

```bash
# Launch User Story 3 tests together:
Task: "Add focused integration coverage for get-by-id success envelopes in test/integration/trip-requests/get-trip-request.success.spec.ts"
Task: "Add focused integration coverage for cancel success envelopes in test/integration/trip-requests/cancel-trip-request.success.spec.ts"
Task: "Extend single-resource success contract assertions in test/integration/trip-requests/get-trip-request.contract.spec.ts and test/integration/trip-requests/cancel-trip-request.contract.spec.ts"
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
5. Finish with cleanup, documentation alignment, and validation commands

### Suggested MVP Scope

- Phase 1
- Phase 2
- Phase 3 (User Story 1)
