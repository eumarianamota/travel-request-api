---

description: "Task list for create travel request feature implementation"
---

# Tasks: Create Travel Request

**Input**: Design documents from `/specs/001-create-trip-request/`

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
- Feature source code lives under `src/trip-requests/` and `src/holidays/`
- Shared infrastructure lives under `src/shared/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the runtime and project structure required by the feature

- [X] T001 Create the feature-oriented source directories in `src/shared/`, `src/trip-requests/`, `src/holidays/`, `test/unit/trip-requests/`, `test/unit/holidays/`, and `test/integration/trip-requests/`
- [X] T002 Add `express`, `pg`, and the required API runtime scripts in `package.json`
- [X] T003 [P] Extend environment configuration for database and holiday provider settings in `src/config/env.ts` and `src/types/env.d.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create PostgreSQL connection bootstrap in `src/shared/infra/db/database-connection.ts`
- [X] T005 [P] Create shared database client access helpers in `src/shared/infra/db/database-client.ts`
- [X] T006 [P] Create shared HTTP app bootstrap in `src/shared/infra/http/create-app.ts`
- [X] T007 [P] Create shared route registration in `src/shared/infra/http/register-routes.ts`
- [X] T008 [P] Create shared application error types in `src/shared/domain/application-error.ts`
- [X] T009 [P] Create shared HTTP error middleware in `src/shared/infra/http/error-middleware.ts`
- [X] T010 Create SQL schema setup for `trip_requests` and `holidays` in `src/shared/infra/db/schema.sql` and `src/shared/infra/db/run-schema.ts`
- [X] T011 Create trip request and holiday repository contracts in `src/trip-requests/application/trip-request-repository.ts` and `src/holidays/application/holiday-repository.ts`
- [X] T012 [P] Create holiday provider gateway contract in `src/holidays/application/holidays-gateway.ts`
- [X] T013 Create SQL trip request and holiday repository skeletons in `src/trip-requests/infra/sql-trip-request-repository.ts` and `src/holidays/infra/sql-holiday-repository.ts`
- [X] T014 [P] Create BrasilAPI gateway skeleton in `src/holidays/infra/brasil-api-holidays-gateway.ts`
- [X] T015 Configure structured logging for bootstrap, validation failures, holiday synchronization, and unexpected errors in `src/main.ts` and `src/shared/infra/http/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Register a Travel Request (Priority: P1) 🎯 MVP

**Goal**: Accept a valid create request, persist a new travel request, and return the standardized success response

**Independent Test**: Submit a valid `POST /trip-requests` request and verify a persisted response with generated fields, canonical UTC timestamps, and status `requested`

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T016 [P] [US1] Add unit tests for timestamp normalization and creation entity rules in `test/unit/trip-requests/create-trip-request.domain.spec.ts`
- [X] T017 [P] [US1] Add integration test for successful `POST /trip-requests` creation, asserting `201`, the success envelope, and canonical UTC timestamps in `test/integration/trip-requests/create-trip-request.success.spec.ts`

### Implementation for User Story 1

- [X] T018 [P] [US1] Create the travel request domain model and value rules in `src/trip-requests/domain/`
- [X] T019 [P] [US1] Create the holiday validation record model in `src/holidays/domain/`
- [X] T020 [US1] Implement the create travel request use case in `src/trip-requests/application/create-trip-request.ts`
- [X] T021 [US1] Implement travel request SQL persistence for creation in `src/trip-requests/infra/sql-trip-request-repository.ts`
- [X] T022 [US1] Implement `POST /trip-requests` controller and route wiring in `src/trip-requests/infra/` and `src/shared/infra/http/`
- [X] T023 [US1] Update `src/main.ts` to bootstrap the create route and shared infrastructure
- [X] T024 [US1] Add OpenAPI contract assertions for the successful create flow in `test/integration/trip-requests/create-trip-request.contract.spec.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Receive Clear Rejection for Invalid Input (Priority: P2)

**Goal**: Reject invalid creation attempts with standardized validation responses

**Independent Test**: Submit invalid create requests and verify `400 Bad Request` responses with the `VALIDATION_ERROR` contract

### Tests for User Story 2 ⚠️

- [X] T025 [P] [US2] Add unit tests for missing fields, blank text, equal origin/destination, invalid chronology, and invalid passenger count in `test/unit/trip-requests/create-trip-request.validation.spec.ts`
- [X] T026 [P] [US2] Add integration test coverage for `400 Bad Request` create failures in `test/integration/trip-requests/create-trip-request.validation.spec.ts`

### Implementation for User Story 2

- [X] T027 [US2] Implement create-request validation rules in `src/trip-requests/domain/`
- [X] T028 [US2] Implement validation error mapping and standardized `400` responses in `src/shared/domain/application-error.ts` and `src/shared/infra/http/error-middleware.ts`
- [X] T029 [US2] Integrate validation flow into the create travel request use case and controller in `src/trip-requests/application/create-trip-request.ts` and `src/trip-requests/infra/`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Enforce Holiday Validation Before Creation (Priority: P3)

**Goal**: Prevent creation on national holidays and fail safely when mandatory holiday data is unavailable

**Independent Test**: Submit create requests that hit holiday blocking, local holiday reuse, and upstream holiday-provider failure scenarios

### Tests for User Story 3 ⚠️

- [X] T030 [P] [US3] Add unit tests for local-first holiday validation behavior in `test/unit/holidays/holiday-validation.service.spec.ts`
- [X] T031 [P] [US3] Add integration tests for `409` holiday blocking and `502` provider failure in `test/integration/trip-requests/create-trip-request.holidays.spec.ts`

### Implementation for User Story 3

- [X] T032 [P] [US3] Implement holiday repository and provider gateway behavior in `src/holidays/infra/sql-holiday-repository.ts` and `src/holidays/infra/brasil-api-holidays-gateway.ts`
- [X] T033 [US3] Implement local-first holiday validation orchestration in `src/holidays/application/`
- [X] T034 [US3] Integrate holiday validation and standardized holiday error mapping into `src/trip-requests/application/create-trip-request.ts`
- [X] T035 [US3] Persist and reuse fetched holiday data in `src/holidays/infra/sql-holiday-repository.ts`
- [X] T036 [US3] Add unexpected internal failure mapping and `500 Internal Server Error` coverage in `src/shared/domain/application-error.ts`, `src/shared/infra/http/error-middleware.ts`, and `test/integration/trip-requests/create-trip-request.internal-error.spec.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T037 [P] Document setup and validation updates in `specs/001-create-trip-request/quickstart.md` and `docs/`
- [X] T038 Align OpenAPI details with the implemented create flow in `specs/001-create-trip-request/contracts/openapi.yaml`
- [X] T039 [P] Add targeted bootstrap coverage for environment and route startup in `test/main.spec.ts`
- [X] T040 Run quickstart validation and repository quality gates using `yarn type:check`, `yarn lint`, and `yarn test`

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on the same create flow but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on create-flow foundation and holiday abstractions from Phase 2

### Within Each User Story

- Tests for changed behavior MUST be written and fail before implementation when practical
- Domain rules before use cases
- Use cases before controllers and routes
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T003 can run in parallel with T001-T002
- T005, T006, T007, T008, T009, and T012 can run in parallel after T004 starts the shared infrastructure
- T016 and T017 can run in parallel for User Story 1
- T018 and T019 can run in parallel for User Story 1
- T025 and T026 can run in parallel for User Story 2
- T030 and T031 can run in parallel for User Story 3
- T037 and T039 can run in parallel in the final phase

---

## Parallel Example: User Story 1

```bash
# Launch all User Story 1 tests together:
Task: "Add unit tests for timestamp normalization and creation entity rules in test/unit/trip-requests/create-trip-request.domain.spec.ts"
Task: "Add integration test for successful POST /trip-requests creation in test/integration/trip-requests/create-trip-request.success.spec.ts"

# Launch all User Story 1 models together:
Task: "Create the travel request domain model and value rules in src/trip-requests/domain/"
Task: "Create the holiday validation record model in src/holidays/domain/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Demo the successful create flow if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP ready
3. Add User Story 2 → Test independently → Validation contract complete
4. Add User Story 3 → Test independently → Holiday rule complete
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
- Preserve response contracts, timestamp normalization, and required logging for all create-flow paths
- Verify tests fail before implementing when practical
- Avoid vague tasks, same-file collisions without coordination, and scope creep into list/get/cancel flows
