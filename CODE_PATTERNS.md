# Code Patterns & Conventions

**Reference for AI and developers.** Follow these patterns strictly to maintain consistency.

---

## 0. UX Rules (Mandatory)

### Modal Usage
- **Modals are NOT for navigation.** Do not use modals for detail views, profile pages, settings, or read-heavy content.
- **Modals allowed only for:** Confirmations (delete, archive), small inline forms (rename, invite), warnings/alerts.
- **Detail views MUST have their own route**, be deep-linkable, and use page layouts.

### Navigation
- Project → `/projects/[id]`
- Card → `/projects/[id]/cards/[cardId]`
- KPI → `/kpis/[id]` (when implemented)
- Todo → `/todos/[id]` (when implemented)
- Profile → `/profile` (redirects to `/settings/account`)

### Focus & Interaction Styles
- **No blue/indigo focus.** Use `focus:outline-none` and soft neutral ring (`focus:ring-2 focus:ring-neutral-300`).
- All inputs, buttons, dropdowns MUST use `CustomInput`, `CustomButton`, `SimpleSelect` — no raw `<input>` or `<button>`.

---

## 1. Hook File Structure

Every hook file follows this exact order:

1. **stats** — State and derived values
2. **useEffect** — All `useEffect` hooks
3. **functions** — Event handlers and other functions

Use section comments to separate each block.

```js
export default function useExample() {
  // stats
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const form = useForm({ defaultValues: { ... } });
  const derivedValue = data?.find(...);

  // useEffect
  useEffect(() => {
    // ...
  }, []);

  useEffect(() => {
    // ...
  }, [dep]);

  // functions
  function handleSubmit() {
    // ...
  }

  function handleClose() {
    // ...
  }

  return { ... };
}
```

**Rules:**
- Use `function` declarations for handlers, not arrow functions
- Group all `useState`, `useSelector`, `useForm`, `useRef`, derived values under stats
- Group all `useEffect` hooks together
- No `enqueueSnackbar` in hooks — handled globally by api interceptors

---

## 2. Component Structure (Hook + Component)

Each feature component has two files:

| File | Purpose |
|------|---------|
| `use-feature-name.hook.js` | Logic, state, handlers |
| `feature-name.component.jsx` | JSX only, uses the hook |

**Component file:**
```jsx
export default function FeatureName() {
  const { ... } = useFeatureName();

  return (
    // JSX only — no logic, no useState, no useEffect
  );
}
```

**Component folder:**
```
feature-name/
  use-feature-name.hook.js
  feature-name.component.jsx
```

---

## 3. Page Structure (Thin Wrapper)

Pages are thin wrappers. Import the feature component and render it inside the layout.

**Auth pages:**
```jsx
export default function ForgotPasswordPage() {
  return <Auth component={<ForgotPassword />} type={AUTH.PUBLIC} />;
}
```

**Private pages (with navbar title):**
```jsx
export default function KpisPage() {
  return (
    <Auth
      component={<KpiTracker />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.KPIS}
    />
  );
}
```

**Pages with params:**
```jsx
export default function BoardDetailPage({ params }) {
  const { id } = use(params);
  return (
    <Auth
      component={<BoardDetail boardId={id} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.BOARD_DETAIL}
    />
  );
}
```

**Rules:**
- No inline logic in page files
- No `*Content` or similar wrapper components inside pages
- All logic lives in the feature component and its hook

---

## 4. Reusable Functions → Utils

**Do not** put reusable logic in hooks or components. Move to `common/utils/`.

| Type | Location | Example |
|------|----------|---------|
| Date formatting | `date.util.js` | `formatRelativeTime` |
| User helpers | `users.util.js` | `getDisplayUser` |
| Access token | `access-token.util.js` | `getAccessToken` |
| Generic | `generic.util.js` | `delay` |

**Create new util file when:**
- Function is pure logic (no React hooks)
- Function could be reused in multiple components
- Function is domain-specific (e.g. date, user, validation)

**Util file pattern:**
```js
/**
 * Brief description
 * @param {type} param
 * @returns {type}
 */
export function functionName(param) {
  // ...
}
```

---

## 5. Constants

Put shared constants in `common/constants/`.

| File | Contents |
|------|----------|
| `auth.constant.js` | `AUTH.PUBLIC`, `AUTH.PRIVATE`, etc. |
| `navbar-title.constant.js` | Page titles for navbar |
| `search-result-type.constant.js` | `TYPE_ICONS`, `TYPE_LABELS` |
| `notification-type.constant.js` | `NOTIFICATION_TYPE_ICONS`, `getNotificationUrl` |
| `workspace-role.constant.js` | `WORKSPACE_ROLE_OPTIONS`, `LABEL_COLORS` |

**Pattern:**
```js
export default {
  KEY: "value",
};

// or named exports
export const OPTIONS = [...];
export function getLabel(id) { ... }
```

---

## 6. Redux / API Pattern

**Success/error toasts:** Handled globally in `api.js` interceptors. Do **not** call `enqueueSnackbar` in components or hooks.

**Async actions:** Use Redux thunks with `successCallBack` for UI updates.

```js
dispatch(
  createInvitation({
    orgId,
    payload: { Email, Role },
    successCallBack: () => {
      setShowInviteForm(false);
      inviteForm.reset();
    },
  })
);
```

**Direct service calls** (when no thunk exists): Use `.then().catch().finally()`. Let api interceptors handle toasts; use `.catch()` only for local state (e.g. `setError`, `setResults`) when needed.

---

## 7. File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Component | `component-name.component.jsx` | `forgot-password.component.jsx` |
| Hook | `use-feature-name.hook.js` | `use-forgot-password.hook.js` |
| Util | `domain.util.js` | `date.util.js`, `users.util.js` |
| Constant | `domain.constant.js` | `auth.constant.js` |
| Slice | `feature.slice.js` | `auth.slice.js` |
| Service | `feature.service.js` | `auth.service.js` |

---

## 8. Import Order

1. React / Next
2. Third-party libs
3. Redux / provider
4. Components (`@/common/components`, `@/components`)
5. Utils (`@/common/utils`)
6. Constants (`@/common/constants`)
7. Provider / slices

---

## 9. Quick Checklist for New Features

- [ ] Hook: stats → useEffect → functions (with section comments)
- [ ] Component: JSX only, uses hook
- [ ] Page: Thin wrapper, renders component inside Auth
- [ ] Reusable logic: `common/utils/` or `common/constants/`
- [ ] No `enqueueSnackbar` in component/hook
- [ ] Use `function` declarations in hooks, not arrow functions
