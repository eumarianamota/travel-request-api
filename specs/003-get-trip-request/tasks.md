# Tasks: Get Trip Request

**Input**: Design documents from `/specs/003-get-trip-request/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include automated test tasks for every behavior change unless the feature specification explicitly justifies why tests are not being added.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared artifacts used by all get-by-id scenarios.

- [X] T001 [P] Add contract regression coverage for `GET /trip-requests/{id}` in `test/integration/trip-requests/get-trip-request.contract.spec.ts`
- [X] T002 [P] Extend shared HTTP helpers for lookup-by-id requests in `test/integration/trip-requests/test-http.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish cross-story contracts for repository lookup and standardized errors.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Add single-record lookup support to `TripRequestRepository` in `src/trip-requests/application/trip-request-repository.ts`
- [X] T004 [P] Add `TRIP_REQUEST_NOT_FOUND` application error support in `src/shared/domain/application-error.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View a Specific Travel Request (Priority: P1) 🎯 MVP

**Goal**: Return one persisted travel request by identifier in the standard success envelope.

**Independent Test**: Persist a travel request, request `GET /trip-requests/:id`, and verify that the response returns the complete travel-request object in the standard success envelope.

### Tests for User Story 1

- [X] T005 [P] [US1] Add success-path integration coverage in `test/integration/trip-requests/get-trip-request.success.spec.ts`
- [X] T006 [P] [US1] Add successful lookup use-case coverage in `test/unit/trip-requests/get-trip-request.spec.ts`

### Implementation for User Story 1

- [X] T007 [US1] Implement the get-by-id use case in `src/trip-requests/application/get-trip-request.ts`
- [X] T008 [US1] Implement single-record SQL lookup with existing row-to-domain mapping in `src/trip-requests/infra/sql-trip-request-repository.ts`
- [X] T009 [US1] Expose `GET /trip-requests/:id` in `src/trip-requests/infra/get-trip-request-controller.ts` and `src/trip-requests/infra/register-trip-request-routes.ts` without adding new authentication or authorization behavior

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Receive Clear Feedback When the Travel Request Does Not Exist (Priority: P2)

**Goal**: Return a standardized `404` error when the identifier is valid but no travel request exists.

**Independent Test**: Request `GET /trip-requests/:id` for a non-existent identifier and verify that the response is a standardized `404` not-found error.

### Tests for User Story 2

- [X] T010 [P] [US2] Add not-found integration coverage in `test/integration/trip-requests/get-trip-request.not-found.spec.ts`
- [X] T011 [P] [US2] Add missing-record use-case coverage in `test/unit/trip-requests/get-trip-request.spec.ts`

### Implementation for User Story 2

- [X] T012 [US2] Map absent repository results to `TRIP_REQUEST_NOT_FOUND` in `src/trip-requests/application/get-trip-request.ts`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Reject Invalid Identifier Input Consistently (Priority: P3)

**Goal**: Reject missing, non-numeric, and non-positive identifiers before persistence lookup while accepting leading-zero positive integers such as `001`.

**Independent Test**: Request `GET /trip-requests/:id` with an invalid identifier value and verify that the response is a standardized validation error, while `GET /trip-requests/001` is processed as identifier `1`.

### Tests for User Story 3

- [X] T013 [P] [US3] Add invalid-identifier and leading-zero integration coverage in `test/integration/trip-requests/get-trip-request.validation.spec.ts`
- [X] T014 [P] [US3] Add positive-integer parser coverage, including `001`, in `test/unit/trip-requests/get-trip-request-id.spec.ts`

### Implementation for User Story 3

- [X] T015 [US3] Implement positive-integer trip-request id parsing in `src/trip-requests/domain/trip-request-id.ts`
- [X] T016 [US3] Enforce identifier validation before repository lookup in `src/trip-requests/application/get-trip-request.ts` and `src/trip-requests/infra/get-trip-request-controller.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish failure coverage, documentation alignment, and repository-preferred validation.

- [X] T017 [P] Add unexpected-failure integration coverage in `test/integration/trip-requests/get-trip-request.internal-error.spec.ts`
- [X] T018 [P] Reconcile lookup examples and validation notes in `specs/003-get-trip-request/contracts/openapi.yaml` and `specs/003-get-trip-request/quickstart.md`
- [X] T019 Run the repository-preferred validation flow documented in `specs/003-get-trip-request/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-5)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) but depends on the get-by-id flow introduced in US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) but depends on the get-by-id flow introduced in US1

### Within Each User Story

- Tests for changed behavior should be written first when practical
- Repository and domain contracts come before controller wiring
- Story behavior should be independently validated before moving on

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003 and T004 can run in parallel
- T005 and T006 can run in parallel
- T010 and T011 can run in parallel
- T013 and T014 can run in parallel
- T017 and T018 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "Add success-path integration coverage in test/integration/trip-requests/get-trip-request.success.spec.ts"
Task: "Add successful lookup use-case coverage in test/unit/trip-requests/get-trip-request.spec.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch User Story 2 tests together:
Task: "Add not-found integration coverage in test/integration/trip-requests/get-trip-request.not-found.spec.ts"
Task: "Add missing-record use-case coverage in test/unit/trip-requests/get-trip-request.spec.ts"
```

---

## Parallel Example: User Story 3

```bash
# Launch User Story 3 tests together:
Task: "Add invalid-identifier and leading-zero integration coverage in test/integration/trip-requests/get-trip-request.validation.spec.ts"
Task: "Add positive-integer parser coverage, including 001, in test/unit/trip-requests/get-trip-request-id.spec.ts"
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
5. Finish with cross-cutting failure coverage and validation commands

### Suggested MVP Scope

- Phase 1
- Phase 2
- Phase 3 (User Story 1)
