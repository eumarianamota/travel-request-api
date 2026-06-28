# Tasks: Cancel Trip Request

**Input**: Design documents from `/specs/004-cancel-trip-request/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include automated test tasks for every behavior change unless the feature specification explicitly justifies why tests are not being added.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared artifacts used by all cancellation scenarios.

- [ ] T001 [P] Add contract regression coverage for `PATCH /trip-requests/{id}/cancel` in `test/integration/trip-requests/cancel-trip-request.contract.spec.ts`
- [ ] T002 [P] Extend shared HTTP helpers for cancellation requests in `test/integration/trip-requests/test-http.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared contracts for logical status updates and standardized cancellation errors.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Add logical status update support to `TripRequestRepository` in `src/trip-requests/application/trip-request-repository.ts`
- [ ] T004 [P] Add `TRIP_REQUEST_ALREADY_CANCELED` application error support in `src/shared/domain/application-error.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Cancel an Existing Travel Request (Priority: P1) 🎯 MVP

**Goal**: Logically cancel a persisted travel request and return the updated object in the standard success envelope.

**Independent Test**: Persist a travel request with status `requested`, request `PATCH /trip-requests/:id/cancel`, and verify that the response returns the complete travel-request object with status `canceled` in the standard success envelope.

### Tests for User Story 1

- [ ] T005 [P] [US1] Add success-path integration coverage in `test/integration/trip-requests/cancel-trip-request.success.spec.ts`
- [ ] T006 [P] [US1] Add successful cancellation use-case coverage in `test/unit/trip-requests/cancel-trip-request.spec.ts`

### Implementation for User Story 1

- [ ] T007 [US1] Implement the cancel-trip-request use case in `src/trip-requests/application/cancel-trip-request.ts`
- [ ] T008 [US1] Implement logical status update lookup and persistence in `src/trip-requests/infra/sql-trip-request-repository.ts`
- [ ] T009 [US1] Expose `PATCH /trip-requests/:id/cancel` in `src/trip-requests/infra/cancel-trip-request-controller.ts` and `src/trip-requests/infra/register-trip-request-routes.ts` without adding new authentication or authorization behavior

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Receive Clear Feedback When the Travel Request Does Not Exist (Priority: P2)

**Goal**: Return a standardized `404` error when the identifier is valid but no travel request exists.

**Independent Test**: Request `PATCH /trip-requests/:id/cancel` for a non-existent identifier and verify that the response is a standardized `404` not-found error.

### Tests for User Story 2

- [ ] T010 [P] [US2] Add not-found integration coverage in `test/integration/trip-requests/cancel-trip-request.not-found.spec.ts`
- [ ] T011 [P] [US2] Add missing-record cancellation use-case coverage in `test/unit/trip-requests/cancel-trip-request.spec.ts`

### Implementation for User Story 2

- [ ] T012 [US2] Map absent repository results to `TRIP_REQUEST_NOT_FOUND` in `src/trip-requests/application/cancel-trip-request.ts`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Prevent Duplicate Cancellation (Priority: P3)

**Goal**: Reject repeated cancellation of a record already marked as `canceled` while preserving the stored state.

**Independent Test**: Persist a travel request already marked as `canceled`, request `PATCH /trip-requests/:id/cancel`, and verify that the response is a standardized `409 TRIP_REQUEST_ALREADY_CANCELED` error.

### Tests for User Story 3

- [ ] T013 [P] [US3] Add already-canceled integration coverage in `test/integration/trip-requests/cancel-trip-request.conflict.spec.ts`
- [ ] T014 [P] [US3] Add invalid-state cancellation use-case coverage in `test/unit/trip-requests/cancel-trip-request.spec.ts`

### Implementation for User Story 3

- [ ] T015 [US3] Enforce the `requested -> canceled` state transition in `src/trip-requests/application/cancel-trip-request.ts` and `src/trip-requests/domain/trip-request.ts`
- [ ] T016 [US3] Map repeated cancellation attempts to `TRIP_REQUEST_ALREADY_CANCELED` in `src/shared/domain/application-error.ts` and `src/trip-requests/infra/cancel-trip-request-controller.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish identifier validation coverage, failure coverage, and documentation alignment.

- [ ] T017 [P] Add invalid-identifier and leading-zero integration coverage in `test/integration/trip-requests/cancel-trip-request.validation.spec.ts` and parser coverage in `test/unit/trip-requests/cancel-trip-request-id.spec.ts`
- [ ] T018 [P] Add unexpected-failure integration coverage in `test/integration/trip-requests/cancel-trip-request.internal-error.spec.ts`
- [ ] T019 [P] Reconcile cancellation examples and validation notes in `specs/004-cancel-trip-request/contracts/openapi.yaml` and `specs/004-cancel-trip-request/quickstart.md`
- [ ] T020 Run the repository-preferred validation flow documented in `specs/004-cancel-trip-request/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-5)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) but depends on the cancel flow introduced in US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) but depends on the cancel flow introduced in US1

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
- T017, T018, and T019 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "Add success-path integration coverage in test/integration/trip-requests/cancel-trip-request.success.spec.ts"
Task: "Add successful cancellation use-case coverage in test/unit/trip-requests/cancel-trip-request.spec.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch User Story 2 tests together:
Task: "Add not-found integration coverage in test/integration/trip-requests/cancel-trip-request.not-found.spec.ts"
Task: "Add missing-record cancellation use-case coverage in test/unit/trip-requests/cancel-trip-request.spec.ts"
```

---

## Parallel Example: User Story 3

```bash
# Launch User Story 3 tests together:
Task: "Add already-canceled integration coverage in test/integration/trip-requests/cancel-trip-request.conflict.spec.ts"
Task: "Add invalid-state cancellation use-case coverage in test/unit/trip-requests/cancel-trip-request.spec.ts"
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
5. Finish with identifier/failure coverage and validation commands

### Suggested MVP Scope

- Phase 1
- Phase 2
- Phase 3 (User Story 1)
