---
name: Vibe Development Standard
description: Single Source of Truth — Dev standards, architecture, UI guidelines & Angular → React Native transformation workflow for KTG PMS Mobile.
---

# Vibe Development Standard & Transformation Guide (KTG PMS)

> **Single Source of Truth** for all rules, architecture, and Angular→RN transformation.
> **Reference Module**: Always reference `src/features/PR`. Cross-reference Admin (`ktg_pms_admin`) for `whereCon`, API mapping, EnumData.

---

# PART A: DEVELOPMENT STANDARDS

## 1. Design Rules

| Rule | Detail |
|---|---|
| **Shadows** | FORBIDDEN. No `shadow`, `elevation`. Use `borderWidth: 1` + light bg |
| **Padding** | Horizontal for detail/container: **5**. Card internal: **10**. Never > 10 |
| **Colors** | Use `useTheme()`. FORBIDDEN to hardcode `#FFF`, `#000` |
| **Numbers** | `Number(val).toLocaleString("en-US")` for currency |
| **Dates** | `moment(date).format("DD/MM/YYYY")` |
| **Empty values** | `""` or `"---"` |
| **Gap > margin** | Prefer `gap` over `margin` |
| **Font sizes** | Label: 12-13, Body: 14, Title: 16, Header: 18 |
| **Collapse spacing** | `<Spacer size={10} />` between sections |
| **SearchBar** | Must have visible border, background `colors.card`. No shadow |

### Detail View Components
- Standard: `Collapse`, `ColumnInfo`, `Row`, `Table`
- Grid: 2 columns (`Row` with `gap={spacing.md}`). `full` for long fields, `last` for final field
- Table header: light yellow (`#FFF7A6D9`), font 13. Default 5 rows/page. Enable `horizontalScroll`

### Skeleton Patterns (Simplified)
All new features must use these simplified patterns to ensure consistent loading states.

#### 1. Item Skeleton (List View)
- Use `Card` with `globalStyle.item`.
- 1. **Status Tag Row**: `Row justify="space-between"` with 2 `Skeleton` (width=120, height=20, radius=20).
- 2. **Identifier Section**: `Row align="center"` with Icon `Skeleton` (width=28, height=20, radius=10) + Title `Skeleton` (width="100%").
- 3. **Consolidated Tag Cloud**: `View style={globalStyle.tagRow}` containing 6 `Skeleton` components with alternating widths (95% and 75%), all height=24, radius=20.
- 4. **Values Section**: Divider + `Row justify="space-between"` with 2 `Skeleton` (width=120, height=20, radius=20).

#### 2. Detail Skeleton (Detail View)
- **Tabs**: `tabsContainer` row with 3 `Skeleton` items for tab buttons.
- **Content**: `content` view with a list (`.map`) of simplified cards. Each card contains a single `Row` with a Title `Skeleton` (width=180) and a trailing Icon `Skeleton` (width=20).
- **Parity**: The number of items in the skeleton list should roughly match the expected content density (e.g., 3-8 items).

## 2. Architecture & Naming

- **PascalCase**: Module/File names (PRItem, PRDetail)
- **Feature**: `src/features/{{Module}}/` | **Service**: `src/services/{{module}}/`
- **Files**: Service: `{{module}}.service.ts` | Types: `{{module}}.type.ts` | Screens: `PascalCase.tsx`
- **Export**: Through `index.ts` only (Module, Components, Enums)

### Navigation (CRITICAL)
- **FORBIDDEN**: `useNavigation` hook import
- **FORBIDDEN**: `navigation.navigate()` or `navigation.goBack()` calls
- **REQUIRED**: Use helpers from `src/utils/navigate.ts` (`goXxx()`, `goXxxDetail(item)`, `goBack()`)
- **REQUIRED**: Define screen type in `navigation.type.ts`:

```typescript
// navigation.type.ts
[ROUTE_KEYS.XxxDetail]: { item: XxxItem };

// XxxDetail.tsx
type Props = NativeStackScreenProps<AppNavigatorParamList, typeof ROUTE_KEYS.XxxDetail>;
const XxxDetail = ({ route, navigation }: Props) => { ... };
```

## 3. Service & API

- **FORBIDDEN**: `any` for params/response — use typed interfaces
- **Tuple Response**: KTG API returns `[Data[], Number, Stats{}]`. Destructure in service
- **Direct Access**: `response.data` — NOT `response.data?.response`
- **Enum**: FORBIDDEN to hardcode status strings. MUST create `src/enums/[module].enum.ts`. MUST copy exact values from Admin `enumData.ts`
- **useEffect**: NEVER put functions in dependency array

## 4. Filter BottomSheet
- Use `gap` not `margin`/`Spacer`: Container `gap: 10`, Section `gap: 5`
- `HeaderSheet` and `FooterSheet` OUTSIDE `BottomSheetScrollView`
- **FILTER FIELD PARITY (MANDATORY)**: Count EVERY `<input>`, `<nz-select>`, `<nz-date-picker>` inside Admin table `<thead>`. Each one = one filter field in mobile FilterSheet. Do NOT copy another module's filter sheet blindly — always verify against THIS module's Admin HTML.
- **STATUS filter**: If Admin has a status `<nz-select>` in the table header → mobile MUST have a `SelectPicker` with the same enum options. Never comment it out or skip it.

---

# PART B: ANGULAR → REACT NATIVE TRANSFORMATION WORKFLOW

## STEP 0: ANALYZE ADMIN

### Files to read in `ktg_pms_admin`:
```
ktg_pms_admin/src/app/[module-name]/
├── [module-name].component.ts    ← LOGIC: whereCon, searchData(), approval
├── [module-name].component.html  ← UI: table columns, filters, buttons
├── [module-name]-detail/
│   ├── -detail.component.ts      ← API detail, tab logic
│   └── -detail.component.html    ← Tabs, form detail
└── shared/
    ├── [module-name].model.ts    ← Interface
    └── [module-name].service.ts  ← API endpoints
```

### 10 Required Notes (DO NOT CODE without these):

| # | Info | Find in | Example |
|---|---|---|---|
| 1 | Pagination endpoint | .service.ts | `/pr/pagination` |
| 2 | Detail endpoint | .service.ts | `/pr/find_detail` |
| 3 | Approve/reject API | .service.ts | `/pr/update_approved` |
| 4 | Where condition body | .component.ts → `whereCon` | `{ status, createdAt: [start,end] }` |
| 5 | Table columns | .html → `<p-table>` | `code, sapCode, status...` |
| 6 | Filter fields | .html → filter form | `status, dateRange, plant...` |
| 7 | Enum/Status mapping | .component.ts → `EnumData` | `PR_STATUS = { W_A: 'Chờ duyệt' }` |
| 8 | Dropdown API | .service.ts | `/plant/find` |
| 9 | Approval logic | .component.ts | `canApprove`, `status === 'PENDING'` |
| 10 | Detail tabs | -detail.html → `<mat-tab>` | Tab "Info", Tab "Items" |

## STEP 0.5: LOGIC EXTRACTION MAP (MANDATORY)

> **MOST IMPORTANT STEP TO PREVENT HALLUCINATION.**
> We only adapt UI for mobile. **Source data logic must match Admin 100%.**
> If AI can't cite the Admin line → AI is fabricating → STOP.

### Required: Logic Extraction Table

Before writing ANY mobile code, create this table:

| # | Logic Type | Admin Code (VERBATIM) | Admin File:Line | Mobile Code | Mobile File |
|---|---|---|---|---|---|
| 1 | Filter/Where | `this.dataSearch.status = enumData.xxx.code` | .component.ts:61 | `status: Status.XXX` | Screen.tsx |
| 2 | Button visibility | `data.status === xxx && data.canApprove` | .html:210 | Same condition with Enum | Item.tsx |
| 3 | Approve params | `{ id: data.id, ... }` | .component.ts:93 | Same params | Detail.tsx |

### Data Pipeline Tracing (MANDATORY):
```
1. API returns what? → .service.ts → endpoint + body
2. Component processes how? → .component.ts → map/transform/compute?
3. Template renders what? → .html → every {{ data.xxx }}, *ngIf, (click)
4. Compare with Mobile Type → all properties exist?
```

## STEP 1: DIRECTORY STRUCTURE

```
src/features/{{ModuleName}}/
├── index.ts
├── components/ (Item, ItemSkeleton, DetailSkeleton, DetailGeneral, DetailItems)
├── hooks/ (use{{ModuleName}}.ts)
├── screens/ ({{ModuleName}}.tsx, {{ModuleName}}Detail.tsx)
├── sheets/ (FilterSheet, ItemDetailSheet)
└── tabs/ (if needed)

src/services/{{moduleName}}/
├── {{moduleName}}.service.ts
└── {{moduleName}}.type.ts
```

## STEP 2: SERVICE LAYER

```typescript
// {{moduleName}}.service.ts
const ENDPOINTS = {
  PAGINATION: "/{{api}}/pagination",
  DETAIL: "/{{api}}/find_detail",
  APPROVE: "/{{api}}/update_approved",
  REJECT: "/{{api}}/update_reject_rule",
};

export const service = {
  getList: async (params: FilterParams) => {
    const { pageIndex = 1, pageSize = PAGE_SIZE, startDate, endDate, keyword, ...rest } = params;
    const where: any = { ...rest };
    if (startDate && endDate) where.createdAt = [startDate, endDate];
    if (keyword) where.uses = keyword; // Check what Admin maps keyword to
    // CLEAN: remove empty values (MANDATORY)
    Object.keys(where).forEach(k => {
      if (where[k] === "ALL" || where[k] === "" || where[k] == null) delete where[k];
    });
    return apiClient.post(ENDPOINTS.PAGINATION, { where, skip: (pageIndex-1)*pageSize, take: pageSize });
  },
  getDetail: async (id: string) => apiClient.post(ENDPOINTS.DETAIL, { id }),
  approve: async (data: any) => apiClient.post(ENDPOINTS.APPROVE, data),
  reject: async (data: any) => apiClient.post(ENDPOINTS.REJECT, data),
};
```

> **`where` condition is the MOST ERROR-PRONE part.** Copy EXACT keys from Admin `whereCon`.

## STEP 3: HOOKS (React Query)

```typescript
// Infinite list
export const useList = (filters: FilterParams) => useInfiniteQuery({
  queryKey: ["list", filters],
  queryFn: ({ pageParam = 1 }) => service.getList({ ...filters, pageIndex: pageParam }),
  getNextPageParam: (last, all) => {
    const total = last.data?.[1] || 0;
    const count = all.reduce((a, p) => a + (p.data?.[0]?.length || 0), 0);
    return count < total ? all.length + 1 : undefined;
  },
  initialPageParam: 1,
});

// Detail
export const useDetail = (id?: string) => useQuery({
  queryKey: ["detail", id], queryFn: () => service.getDetail(id!),
  enabled: !!id, select: (res: any) => res?.data,
});

// Mutations
export const useApprove = () => useMutation({ mutationFn: service.approve });
export const useReject = () => useMutation({ mutationFn: service.reject });
```

## STEP 4: ENUM (MANDATORY)

> **MUST open `ktg_pms_admin/src/app/core/enumData.ts`** and copy EXACT `.code` values.
> NEVER invent enum values. Admin uses `WAIT_APPROVE` → Mobile uses `WAIT_APPROVE`.
> **CENTRALIZATION**: All enums MUST be exported from `src/enums/index.ts`. Components MUST import from `~/enums`, NEVER directly from `[module].enum.ts`.

```typescript
export enum STATUS { WAIT_APPROVE = "WAIT_APPROVE", APPROVED = "APPROVED", CANCEL = "CANCEL" }

export const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor?: string }> = {
  [STATUS.WAIT_APPROVE]: { label: "Chờ duyệt", color: "#F59E0B", bgColor: "#FFFBEB" },
  [STATUS.APPROVED]: { label: "Đã duyệt", color: "#10B981", bgColor: "#F0FDF4" },
  [STATUS.CANCEL]: { label: "Từ chối", color: "#EF4444", bgColor: "#FEF2F2" },
};
```

**Use Enum EVERYWHERE** — filter state, button visibility, mutation params, Badge colors. NEVER hardcode strings.

## STEP 5: NAVIGATION

```typescript
// 1. route.ts: add key
// 2. navigation.type.ts: define params
// 3. navigate.ts: add helper (goXxx, goXxxDetail)
// 4. AppNavigator.tsx: register screen
```

## STEP 6-10: SCREENS & COMPONENTS

### List Screen Pattern:
`Linear` → `Header (showBack, showSearch)` → `Container` → `FlatList` with `RefreshControl`, skeleton loading, infinite scroll, empty state

### Item Card Pattern:
`Card shadow={false} padding={10}` → Badge row → Code + Icon → Tag cloud → Divider → Summary

### Detail Screen Pattern:
`Linear` → `Header` → `Tabs` (if multi-tab) → `Container` → Tab content → `ApprovalButton`

### Detail Content Pattern:
```typescript
<Collapse title="I. General Info" collapsible defaultExpanded>
  <Column gap={10} align="stretch">
    <Row full gap={10}>
      <ColumnInfo label="PMS Code" value={data.code} />
      <ColumnInfo label="SAP Code" value={data.sapCode} />
    </Row>
    <ColumnInfo label="Note" value={data.note} full last />
  </Column>
</Collapse>
```

### Table Pattern:
```typescript
<Collapse title="II. Items" collapsible containerStyle={{ paddingHorizontal: 0, paddingBottom: 0 }}>
  <Table horizontalScroll columns={[...]} columnWidths={[...]} rows={...} />
</Collapse>
```

### Filter Sheet Pattern:
`HeaderSheet` → `BottomSheetScrollView` → `Column gap={spacing.sm}` → fields → `FooterSheet`

---

## STEP 11: POST-TRANSFORM REVIEW (MANDATORY)

After coding, MUST re-open Admin files and diff with Mobile code.

### Logic Diff Report:
Create table comparing every logic point: filter where, display fields, button conditions, API params, navigation.

### Functional Checklist:
API data ✓ | Record count ✓ | Filters ✓ | Pull-to-refresh ✓ | Infinite scroll ✓ | Detail fields ✓ | Approve/Reject ✓ | Navigation ✓ | Skeleton ✓ | Empty state ✓ | Enum usage ✓ | Type coverage ✓

### Final Sign-Off (10 questions — ALL must be YES):
1. Re-opened Admin .html and verified every `{{ data.xxx }}`?
2. Re-opened Admin .ts and verified every condition?
3. Re-opened Admin enumData.ts and verified every enum?
4. Mobile Type has ALL properties Admin template accesses?
5. NO hardcoded status/type strings remain?
6. NO `navigation.navigate()` or `useNavigation()` remains?
7. ALL button visibility logic matches Admin `*ngIf`?
8. ALL API params match Admin handler?
9. Logic Diff Report all ✅?
10. Pre-Submit Gate all PASS?

→ ALL YES → ready to ship. ANY NO → fix first.

---

# PART C: COMMON ERRORS

## C1. List Screen Errors

| Error | Rule |
|---|---|
| API returns 0 records | Wrong `where` keys. Copy EXACT from Admin `searchData()` |
| Missing default conditions | Admin has hidden defaults (`isDeleted: false`). Copy all |
| Missing columns vs Admin | Count Admin `<p-table>` headers → Mobile must show ALL |
| Missing filters vs Admin | Count Admin `<thead>` inputs/selects → FilterSheet must have ALL. Never copy another module's filter blindly |
| Wrong keyword field | Check what Admin maps keyword to (`uses`, `name`, `code`...) |
| Badge colors wrong | Copy EXACT enum→color mapping from Admin |
| Skeleton mismatch | Skeleton MUST match Item layout (height, rows, structure) |

## C2. Detail Screen Errors

| Error | Rule |
|---|---|
| Using list data instead of detail API | MUST call detail API separately |
| Missing fields vs Admin | Count EVERY field in Admin detail HTML → Mobile must have all |
| No `Collapse` sections | MUST use `Collapse` with Roman numerals: I., II., III. |
| No `ColumnInfo` | MUST use for key-value pairs. Don't build custom Text+View |
| Wrong padding | `paddingHorizontal: 5` only. Never 10 for detail containers |
| Table column count mismatch | `columnWidths` count MUST equal `columns` count |

## C3. Logic Errors

| Error | Rule |
|---|---|
| Approve button missing | Check: enum value + status condition + role/permission |
| Detail crash | Use `?.` optional chaining for ALL nested access |
| Navigation params missing | Declare in `navigation.type.ts` AND pass correctly |
| useEffect infinite loop | NEVER put functions/objects in dependency array |
| Missing error handling | Mutations MUST have `onError` with `stopWaiting()` + toast |

---

# PART D: PRE-SUBMIT GATE (MANDATORY)

Before submitting, verify ALL:

### G1. Property Access — "NO FABRICATION"
- [ ] All `item.xxx` / `detail.xxx` exist in declared Type?
- [ ] Verified against Admin `.component.ts` / `.html`?
- [ ] Using `?.` for all nested access?

### G2. Enum — "NO HARDCODE"
- [ ] All status/type use Enum from `src/enums/`?
- [ ] NO hardcoded strings (`"WAIT_APPROVE"`, `"CANCEL"`...)?
- [ ] Enum values match Admin `enumData` exactly?

### G3. Navigation — "USE HELPERS"
- [ ] Using `navigate.ts` helpers (`goXxx()`, `goBack()`)?
- [ ] NO `navigation.navigate()` or `useNavigation()` anywhere?
- [ ] Params declared in `navigation.type.ts`?

### G4. Type Safety
- [ ] Types have ALL fields API returns?
- [ ] Permission flags (`canApprove`...) in Type?
- [ ] NO `any` for main params/response?

### G5. Logic Parity — "100% MATCH ADMIN"
- [ ] Every display condition matches Admin?
- [ ] Approve/Reject params + API correct?
- [ ] `where` condition matches Admin `searchData()` exactly?

### G6. Style — "FOLLOW VIBE"
- [ ] paddingHorizontal: **5** (detail), **10** (card)?
- [ ] NO shadow/elevation?
- [ ] Using `useTheme()` for colors?
- [ ] Using `gap` over `margin`?

> Code → Gate → FAIL any → Fix → Re-gate → ALL PASS → Submit.

---

# PART E: AI BEHAVIOR RULES (MANDATORY)

> **MOST CRITICAL SECTION.** Any AI reading this MUST comply. Violation = REJECT.

## E1. SCOPE — "Only do what's requested"
- FORBIDDEN: adding changes outside user's request scope
- FORBIDDEN: "improving", "optimizing", "beautifying" without request
- FORBIDDEN: adding props, icons, styles user didn't mention
- Found issues outside scope → REPORT to user, don't fix

## E2. EDITING — "Don't corrupt files"
- **MODIFY existing file**: FORBIDDEN `replace_file_content` with > 50 lines TargetContent
- **CREATE new file**: May write full content, but MUST split into small components
- MUST verify file after each edit (re-read to confirm no corruption)
- Edit failed → STOP, re-read file, retry smaller
- FORBIDDEN: fixing error A while creating error B

## E3. READING — "Read before acting"
- MUST read SKILL.md before any task
- MUST read target file before editing
- MUST reference PR module when unsure
- FORBIDDEN: guessing property names, component props, API responses

## E4. COMMUNICATION — "Ask before doing"
- Unsure about scope → ASK user
- Found multiple issues → LIST for user to choose, don't auto-fix
- Complex task → PRESENT plan first, wait for approval
- FORBIDDEN: assuming what user wants

## E5. PRE-EDIT CHECKLIST
Before every edit, ask yourself:
- [ ] Did user request this? (NO → STOP)
- [ ] Within scope? (NO → REPORT instead)
- [ ] Could this break existing imports/logic? (YES → verify carefully)
- [ ] TargetContent < 50 lines? (NO → split)
- [ ] Will file compile after this? (UNSURE → re-read after edit)

## E6. ERROR RECOVERY — "Fix root cause, not symptoms"
- TypeScript/Lint error → MUST re-read source file + SKILL.md BEFORE fixing
- FORBIDDEN: adding `as any`, `@ts-ignore`, or removing type checks to silence errors
- FORBIDDEN: guessing the fix — MUST trace error to root cause
- Fix failed twice → STOP, REPORT to user with error details

## E7. PROOF OF SOURCE — "Cite or stop"
- When mapping Admin → Mobile logic, MUST cite: `AdminFile:LineNumber`
- Cannot cite source → DO NOT write that code → ASK user
- Approval/visibility logic MUST include Admin condition as comment:
  `// Admin: xxx-detail.component.html:210 → *ngIf="data.canApprove"`

### File Reference:

| File | Purpose | Key Imports |
|---|---|---|
| `type.ts` | Interfaces | — |
| `service.ts` | API calls | `apiClient`, types |
| `enum.ts` | Status enums | — |
| `useXxx.ts` | React Query hooks | `@tanstack/react-query`, service |
| `Xxx.tsx` | List screen | `Linear`, `Header`, `Container`, `FlatList`, `Empty` |
| `XxxDetail.tsx` | Detail screen | `Linear`, `Header`, `Tabs`, `ApprovalButton` |
| `XxxItem.tsx` | Card component | `Card`, `Badge`, `Tag`, `Row`, `Text` |
| `XxxFilterSheet.tsx` | Filter | `BottomSheetScrollView`, `HeaderSheet`, `FooterSheet` |
| `XxxDetailGeneral.tsx` | Info section | `Collapse`, `Column`, `Row`, `ColumnInfo` |
| `XxxDetailItems.tsx` | Table section | `Collapse`, `Table` |
