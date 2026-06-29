# Tasks: Standardize Error Responses

**Input**: Design documents from `/specs/007-standardize-error-responses/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include automated test tasks for every behavior change unless the
feature specification explicitly justifies why tests are not being added.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared contract and regression points for the error-envelope standardization work.

- [x] T001 [P] Add contract regression coverage for the standardized error envelope in `test/integration/trip-requests/create-trip-request.contract.spec.ts`, `test/integration/trip-requests/list-trip-requests.contract.spec.ts`, `test/integration/trip-requests/get-trip-request.contract.spec.ts`, `test/integration/trip-requests/cancel-trip-request.contract.spec.ts`, and `test/integration/holidays/get-holidays.contract.spec.ts`
- [x] T002 [P] Document shared error-envelope examples and reusable schemas in `specs/007-standardize-error-responses/contracts/openapi.yaml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared error serialization and mapping guidance before story-specific flow updates.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Define shared error mapping expectations in `specs/007-standardize-error-responses/data-model.md` and align validation scenarios in `specs/007-standardize-error-responses/quickstart.md`
- [x] T004 [P] Consolidate shared error response typing and serialization boundaries in `src/shared/domain/application-error.ts` and `src/shared/infra/http/error-middleware.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Receive Validation Errors Predictably (Priority: P1) 🎯 MVP

**Goal**: Ensure invalid requests consistently return `400` with `success: false`, `error.code: VALIDATION_ERROR`, and the canonical message shape.

**Independent Test**: Send invalid requests to `POST /trip-requests`, `GET /trip-requests/:id`, `PATCH /trip-requests/:id/cancel`, and `GET /holidays/:year` and verify that each response returns the standardized error envelope with `VALIDATION_ERROR` and `400 Bad Request`.

### Tests for User Story 1

- [x] T005 [P] [US1] Add focused integration coverage for validation error envelopes in `test/integration/trip-requests/create-trip-request.validation.spec.ts` and `test/integration/trip-requests/get-trip-request.validation.spec.ts`
- [x] T006 [P] [US1] Add focused integration coverage for validation error envelopes in `test/integration/trip-requests/cancel-trip-request.validation.spec.ts` and `test/integration/holidays/get-holidays.validation.spec.ts`
- [x] T007 [P] [US1] Extend validation error contract assertions in `test/integration/trip-requests/create-trip-request.contract.spec.ts`, `test/integration/trip-requests/get-trip-request.contract.spec.ts`, `test/integration/trip-requests/cancel-trip-request.contract.spec.ts`, and `test/integration/holidays/get-holidays.contract.spec.ts`

### Implementation for User Story 1

- [x] T008 [US1] Ensure trip-request payload and identifier validation throws canonical `VALIDATION_ERROR` responses in `src/trip-requests/domain/trip-request.ts`, `src/trip-requests/domain/trip-request-id.ts`, `src/trip-requests/infra/create-trip-request-controller.ts`, `src/trip-requests/infra/get-trip-request-controller.ts`, and `src/trip-requests/infra/cancel-trip-request-controller.ts`
- [x] T009 [US1] Ensure holiday-year parsing and controller validation return canonical `VALIDATION_ERROR` responses in `src/holidays/domain/holiday-year.ts` and `src/holidays/infra/get-holidays-controller.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Receive Business and Not-Found Errors Consistently (Priority: P2)

**Goal**: Ensure not-found and business-rule failures return the same standardized error envelope with the documented domain-specific codes and `404`/`409` mappings.

**Independent Test**: Request a missing trip request, cancel a missing trip request, cancel an already canceled trip request, and create a trip request on a holiday date; then verify that each response uses the standardized error envelope with the documented code and HTTP status.

### Tests for User Story 2

- [x] T010 [P] [US2] Add focused integration coverage for not-found error envelopes in `test/integration/trip-requests/get-trip-request.not-found.spec.ts` and `test/integration/trip-requests/cancel-trip-request.not-found.spec.ts`
- [x] T011 [P] [US2] Add focused integration coverage for business-rule error envelopes in `test/integration/trip-requests/cancel-trip-request.conflict.spec.ts` and `test/integration/trip-requests/create-trip-request.holidays.spec.ts`
- [x] T012 [P] [US2] Extend business and not-found error contract assertions in `test/integration/trip-requests/create-trip-request.contract.spec.ts`, `test/integration/trip-requests/get-trip-request.contract.spec.ts`, and `test/integration/trip-requests/cancel-trip-request.contract.spec.ts`

### Implementation for User Story 2

- [x] T013 [US2] Ensure missing-trip-request and already-canceled failures preserve canonical code, message, and status mappings in `src/trip-requests/application/get-trip-request.ts`, `src/trip-requests/application/cancel-trip-request.ts`, and `src/shared/domain/application-error.ts`
- [x] T014 [US2] Ensure holiday business-rule failures preserve the canonical conflict error contract in `src/holidays/application/holiday-validation-service.ts`, `src/trip-requests/application/create-trip-request.ts`, and `src/shared/domain/application-error.ts`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Receive External and Unexpected Failures Predictably (Priority: P3)

**Goal**: Ensure provider-unavailability and unexpected internal failures return the standardized error envelope with the documented `502` and `500` mappings.

**Independent Test**: Trigger a required holiday-provider failure and an unexpected internal failure, then verify that both responses use the standardized error envelope with the documented code and HTTP status.

### Tests for User Story 3

- [x] T015 [P] [US3] Add focused integration coverage for provider-unavailable error envelopes in `test/integration/trip-requests/create-trip-request.holidays.spec.ts` and `test/integration/holidays/get-holidays.unavailable.spec.ts`
- [x] T016 [P] [US3] Add focused integration coverage for unexpected internal error envelopes in `test/integration/trip-requests/create-trip-request.internal-error.spec.ts`, `test/integration/trip-requests/list-trip-requests.internal-error.spec.ts`, `test/integration/trip-requests/get-trip-request.internal-error.spec.ts`, and `test/integration/trip-requests/cancel-trip-request.internal-error.spec.ts`
- [x] T017 [P] [US3] Extend provider and internal error contract assertions in `test/integration/trip-requests/create-trip-request.contract.spec.ts`, `test/integration/trip-requests/list-trip-requests.contract.spec.ts`, `test/integration/trip-requests/get-trip-request.contract.spec.ts`, `test/integration/trip-requests/cancel-trip-request.contract.spec.ts`, and `test/integration/holidays/get-holidays.contract.spec.ts`

### Implementation for User Story 3

- [x] T018 [US3] Ensure required holiday-provider failures surface canonical `HOLIDAYS_API_UNAVAILABLE` responses in `src/holidays/application/holiday-validation-service.ts`, `src/holidays/application/get-holidays-by-year.ts`, and `src/shared/domain/application-error.ts`
- [x] T019 [US3] Ensure unexpected failures are mapped once to canonical `INTERNAL_SERVER_ERROR` envelopes and logging in `src/shared/infra/http/error-middleware.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation alignment, cleanup, and repository-preferred validation.

- [x] T020 [P] Reconcile error-envelope examples and validation notes in `specs/007-standardize-error-responses/contracts/openapi.yaml` and `specs/007-standardize-error-responses/quickstart.md`
- [x] T021 [P] Extract any repeated error-response request helpers used by holiday error specs into `test/integration/trip-requests/test-http.ts` and update `test/integration/holidays/get-holidays.validation.spec.ts` and `test/integration/holidays/get-holidays.unavailable.spec.ts` to reuse them
- [ ] T022 Run the repository-preferred validation flow documented in `specs/007-standardize-error-responses/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-5)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) and depends on the shared error-envelope expectations established in US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) and depends on the shared error-envelope expectations established in US1

### Within Each User Story

- Tests for changed behavior should be written first when practical
- Contract assertions come before source-code adjustments
- Shared error mappings should be preserved before flow-specific cleanup
- Story behavior should be independently validated before moving on

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003 and T004 can run in parallel
- T005, T006, and T007 can run in parallel
- T010, T011, and T012 can run in parallel
- T015, T016, and T017 can run in parallel
- T020 and T021 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "Add focused integration coverage for validation error envelopes in test/integration/trip-requests/create-trip-request.validation.spec.ts and test/integration/trip-requests/get-trip-request.validation.spec.ts"
Task: "Add focused integration coverage for validation error envelopes in test/integration/trip-requests/cancel-trip-request.validation.spec.ts and test/integration/holidays/get-holidays.validation.spec.ts"
Task: "Extend validation error contract assertions in test/integration/trip-requests/create-trip-request.contract.spec.ts, test/integration/trip-requests/get-trip-request.contract.spec.ts, test/integration/trip-requests/cancel-trip-request.contract.spec.ts, and test/integration/holidays/get-holidays.contract.spec.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch User Story 2 tests together:
Task: "Add focused integration coverage for not-found error envelopes in test/integration/trip-requests/get-trip-request.not-found.spec.ts and test/integration/trip-requests/cancel-trip-request.not-found.spec.ts"
Task: "Add focused integration coverage for business-rule error envelopes in test/integration/trip-requests/cancel-trip-request.conflict.spec.ts and test/integration/trip-requests/create-trip-request.holidays.spec.ts"
Task: "Extend business and not-found error contract assertions in test/integration/trip-requests/create-trip-request.contract.spec.ts, test/integration/trip-requests/get-trip-request.contract.spec.ts, and test/integration/trip-requests/cancel-trip-request.contract.spec.ts"
```

---

## Parallel Example: User Story 3

```bash
# Launch User Story 3 tests together:
Task: "Add focused integration coverage for provider-unavailable error envelopes in test/integration/trip-requests/create-trip-request.holidays.spec.ts and test/integration/holidays/get-holidays.unavailable.spec.ts"
Task: "Add focused integration coverage for unexpected internal error envelopes in test/integration/trip-requests/create-trip-request.internal-error.spec.ts, test/integration/trip-requests/list-trip-requests.internal-error.spec.ts, test/integration/trip-requests/get-trip-request.internal-error.spec.ts, and test/integration/trip-requests/cancel-trip-request.internal-error.spec.ts"
Task: "Extend provider and internal error contract assertions in test/integration/trip-requests/create-trip-request.contract.spec.ts, test/integration/trip-requests/list-trip-requests.contract.spec.ts, test/integration/trip-requests/get-trip-request.contract.spec.ts, test/integration/trip-requests/cancel-trip-request.contract.spec.ts, and test/integration/holidays/get-holidays.contract.spec.ts"
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
