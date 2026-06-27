---

description: "Task list for list travel requests feature implementation"

---

# Tasks: List Trip Requests

**Input**: Design documents from `/specs/002-list-trip-requests/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include automated test tasks for every behavior change unless the
feature specification explicitly justifies why tests are not being added.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project layout at repository root using `src/` and `test/`
- Feature source code lives under `src/trip-requests/`
- Shared HTTP and error infrastructure lives under `src/shared/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare documentation and test locations for the listing slice

- [X] T001 Create the list-feature test files in `test/integration/trip-requests/` and `test/unit/trip-requests/` for listing coverage
- [X] T002 [P] Review and align the list-response contract examples in `specs/002-list-trip-requests/contracts/openapi.yaml` with implementation-ready field names

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared behavior that MUST be in place before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Extend the trip request repository contract with list-query behavior in `src/trip-requests/application/trip-request-repository.ts`
- [X] T004 [P] Introduce a reusable travel-request summary mapping for read flows in `src/trip-requests/domain/`
- [X] T005 [P] Add list-route registration support to the shared HTTP bootstrap in `src/shared/infra/http/register-routes.ts` and `src/shared/infra/http/create-app.ts`
- [X] T006 [P] Confirm standardized internal error mapping for read failures in `src/shared/domain/application-error.ts` and `src/shared/infra/http/error-middleware.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Registered Travel Requests (Priority: P1) 🎯 MVP

**Goal**: Return all registered travel requests in the standard success envelope ordered by descending `departureAt`

**Independent Test**: Persist multiple travel requests with different departure dates and verify that `GET /trip-requests` returns all of them ordered from the most recent to the oldest

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Add integration coverage for successful `GET /trip-requests` listing and descending `departureAt` ordering in `test/integration/trip-requests/list-trip-requests.spec.ts`
- [X] T008 [P] [US1] Add OpenAPI contract assertions for the list success response in `test/integration/trip-requests/list-trip-requests.contract.spec.ts`

### Implementation for User Story 1

- [X] T009 [P] [US1] Implement the list travel requests use case in `src/trip-requests/application/list-trip-requests.ts`
- [X] T010 [US1] Implement SQL list-query persistence ordered by `departureAt` descending in `src/trip-requests/infra/sql-trip-request-repository.ts`
- [X] T011 [US1] Implement the `GET /trip-requests` controller in `src/trip-requests/infra/list-trip-requests-controller.ts`
- [X] T012 [US1] Register the list route in `src/trip-requests/infra/register-trip-request-routes.ts` and wire it through `src/main.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Receive an Empty List When No Records Exist (Priority: P2)

**Goal**: Return `200 OK` with `success: true` and `data: []` when no travel requests are stored

**Independent Test**: Request `GET /trip-requests` against an empty dataset and verify that the response body is the standard success envelope with an empty array

### Tests for User Story 2 ⚠️

- [X] T013 [P] [US2] Add integration coverage for the empty-list response in `test/integration/trip-requests/list-trip-requests.empty.spec.ts`

### Implementation for User Story 2

- [X] T014 [US2] Ensure the list use case preserves successful empty responses in `src/trip-requests/application/list-trip-requests.ts`
- [X] T015 [US2] Ensure repository and controller serialization return `data: []` without special-case errors in `src/trip-requests/infra/sql-trip-request-repository.ts` and `src/trip-requests/infra/list-trip-requests-controller.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Receive Predictable Travel Request Details in the List (Priority: P3)

**Goal**: Preserve canonical UTC timestamps, observable statuses, and standard internal-error behavior in the list output

**Independent Test**: Request `GET /trip-requests` after storing records with mixed statuses, then verify full field coverage, canonical timestamps, and `500` mapping for unexpected failures

### Tests for User Story 3 ⚠️

- [X] T016 [P] [US3] Add integration coverage for canonical timestamps and mixed statuses in `test/integration/trip-requests/list-trip-requests.fields.spec.ts`
- [X] T017 [P] [US3] Add integration coverage for unexpected list failures returning `500` in `test/integration/trip-requests/list-trip-requests.internal-error.spec.ts`

### Implementation for User Story 3

- [X] T018 [P] [US3] Finalize travel-request summary serialization for list responses in `src/trip-requests/domain/` and `src/trip-requests/infra/sql-trip-request-repository.ts`
- [X] T019 [US3] Integrate standardized internal failure handling for list requests in `src/trip-requests/infra/list-trip-requests-controller.ts` and `src/shared/infra/http/error-middleware.ts`
- [X] T020 [US3] Add bootstrap coverage for list-route startup in `test/main.spec.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T021 [P] Document list-flow validation and usage details in `specs/002-list-trip-requests/quickstart.md` and `README.md`
- [X] T022 Align the list-flow contract details with the implemented behavior in `specs/002-list-trip-requests/contracts/openapi.yaml`
- [X] T023 Run quickstart validation and repository quality gates using `yarn type:check`, `yarn lint`, and `yarn test`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel if enough contributors are available
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on the same list flow but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on the list flow contract and error mapping from earlier phases

### Within Each User Story

- Tests for changed behavior MUST be written and fail before implementation when practical
- Domain or mapping rules before use cases
- Use cases before controllers and route wiring
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T002 can run in parallel with T001
- T004, T005, and T006 can run in parallel after T003 starts the shared list foundation
- T007 and T008 can run in parallel for User Story 1
- T016 and T017 can run in parallel for User Story 3
- T021 can run in parallel with T022 in the final phase

---

## Parallel Example: User Story 1

```bash
# Launch all User Story 1 tests together:
Task: "Add integration coverage for successful GET /trip-requests listing and descending departureAt ordering in test/integration/trip-requests/list-trip-requests.spec.ts"
Task: "Add OpenAPI contract assertions for the list success response in test/integration/trip-requests/list-trip-requests.contract.spec.ts"

# Launch independent User Story 1 implementation work together:
Task: "Implement the list travel requests use case in src/trip-requests/application/list-trip-requests.ts"
Task: "Implement SQL list-query persistence ordered by departureAt descending in src/trip-requests/infra/sql-trip-request-repository.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Demo the successful list flow if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP ready
3. Add User Story 2 → Test independently → Empty-state contract complete
4. Add User Story 3 → Test independently → Response-shape and failure mapping complete
5. Finish polish and full validation

### Parallel Team Strategy

With multiple contributors:

1. Complete Setup + Foundational together
2. Once Foundational is done:
   - Contributor A: User Story 1
   - Contributor B: User Story 2
   - Contributor C: User Story 3
3. Merge and validate stories incrementally

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps each task to a specific user story for traceability
- Each user story should be independently completable and testable
- Preserve response contracts, descending ordering, canonical timestamps, and required logging for the list flow
- Verify tests fail before implementing when practical
- Avoid vague tasks, same-file collisions without coordination, and scope creep into get-by-id or cancellation flows
