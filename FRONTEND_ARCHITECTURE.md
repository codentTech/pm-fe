# Frontend Architecture & Standards

Production-ready multi-tenant SaaS frontend. Backend is finalized and stable.

> **See [CODE_PATTERNS.md](./CODE_PATTERNS.md)** for implementation patterns (hooks, components, pages, utils).

---

## 1. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 4 |
| State | Redux Toolkit + Redux Persist |
| Forms | react-hook-form + yup |
| Icons | Lucide React |
| Notifications | notistack (SnackbarProvider) |
| UI Base | MUI (minimal, for Button/Input wrappers) |

---

## 2. Global Design System

### Typography

Use semantic tokens from `globals.style.css`:

| Class | Usage |
|-------|-------|
| `.typography-h1` | Page titles |
| `.typography-h2` | Section headers |
| `.typography-h3` | Card titles, modal titles |
| `.typography-h4` | Subsection headers |
| `.typography-body` | Body text |
| `.typography-body-sm` | Secondary text |
| `.typography-label` | Form labels |
| `.typography-caption` | Metadata, hints |
| `.typography-button` | Button text |
| `.typography-table` | Table cells |

**Do not** use arbitrary `text-[Npx]` values.

### Spacing

- Use Tailwind spacing scale: `p-4`, `gap-4`, `space-y-4`, etc.
- Container: `.container` (max-w-7xl mx-auto px-4 sm:px-6 lg:px-8)
- Page header: `.page-header`

### Colors

| Token | Usage |
|-------|-------|
| `primary-50` … `primary-900` | Primary actions, links |
| `neutral-50` … `neutral-900` | Text, borders, backgrounds |
| `success-*`, `danger-*`, `warning-*`, `info-*` | Semantic states |

### Components

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`
- `.card`, `.card-header`, `.card-body`, `.card-footer`
- `.form-input`, `.form-label`, `.form-error`
- `.badge`, `.badge-success`, `.badge-danger`, etc.
- `.modal-overlay`, `.modal-content`, `.modal-header`, `.modal-body`, `.modal-footer`

### Layout

- `.form-wrapper`, `.form-container`, `.form-card` — Auth forms
- `.sidebar`, `.main-content` — Dashboard layout
- `.grid-responsive`, `.grid-responsive-2`, `.grid-responsive-4`

---

## 3. File & Folder Conventions

| Pattern | Convention |
|---------|------------|
| Folders | `kebab-case` |
| Components | `component-name.component.jsx` |
| Hooks | `use-feature-name.hook.js` |
| Services | `feature.service.js` |
| Slices | `feature.slice.js` |
| One component per file | Yes |

### Hook File Structure

Hooks follow a consistent order for readability:

1. **stats** — State variables (`useState`, `useSelector`, `useForm`, `useRef`, derived values)
2. **useEffect** — All `useEffect` hooks
3. **functions** — Event handlers and other functions

```js
export default function useExample() {
  // stats
  const [open, setOpen] = useState(false);
  const form = useForm({ ... });

  // useEffect
  useEffect(() => { ... }, []);

  // functions
  function handleSubmit() { ... }

  return { ... };
}
```

---

## 4. Existing Modules (Do Not Break)

### Auth

| Route | Component | Status |
|-------|-----------|--------|
| `/` | Home (landing) | OK |
| `/login` | Login | OK |
| `/sign-up` | SignUp | OK |
| `/auth/forgot-password` | ForgotPassword | OK |
| `/auth/reset-password` | ResetPassword | OK |
| `/auth/verify-email` | VerifyEmail | OK |
| `/dashboard` | Redirects to /projects | OK |

### App Shell (Private)

| Component | Role |
|-----------|------|
| `Private` | Wraps authenticated pages with sidebar + navbar |
| `AppSidebar` | Nav: Projects, Todo Tracker, KPI Tracker, Workspace, Account |
| `AppNavbar` | Breadcrumb, search, notifications, profile, invitations |

### Feature Modules

| Route | Component | Backend |
|-------|-----------|---------|
| `/projects` | BoardsList | Boards API |
| `/projects/[id]` | Board detail | Boards, Lists, Cards |
| `/boards` | Boards list (alias) | Boards API |
| `/boards/[id]` | Board detail | Boards, Lists, Cards |
| `/todos` | TodoTracker | TodoLists, TodoItems |
| `/kpis` | KpiTracker | Kpis |
| `/settings` | Settings hub | Links to Account, Workspace |
| `/settings/account` | UserSettings | Users API |
| `/settings/workspace` | WorkspaceSettings | Organizations, Invitations, Labels |

### Shared Components

| Component | Usage |
|-----------|-------|
| CustomButton | Primary, secondary, outline, danger, ghost |
| CustomInput | Input with react-hook-form |
| SimpleSelect | Dropdowns |
| TextArea | Multi-line text |
| Modal | Dialogs |
| ConfirmationModal | Confirm actions |
| NoResultFound | Empty states |
| Loadar | Loading state |

---

## 5. Backend API Coverage

| Backend Module | Frontend Service | Frontend Slice | UI |
|----------------|------------------|----------------|-----|
| Auth | auth.service | auth.slice | Login, SignUp, Forgot, Reset, Verify |
| Organizations | organizations.service | organizations.slice | Workspace, OrgSwitcher |
| Boards | boards.service | boards.slice | BoardsList, BoardDetail |
| Lists | lists.service | — | BoardDetail |
| Cards | cards.service | — | BoardDetail |
| Labels | labels.service | labels.slice | WorkspaceSettings |
| Invitations | invitations.service | invitations.slice | WorkspaceSettings, PendingInvitations |
| KPIs | kpis.service | kpis.slice | KpiTracker |
| TodoLists | todos.service | todos.slice | TodoTracker |
| Todos | — | — | TodoTracker |
| Notifications | notifications.service | notifications.slice | NotificationsCenter |
| Search | search.service | — | GlobalSearch |
| Users | users.service | — | UserSettings |
| Attachments | attachments.service | — | BoardDetail |
| Comments | comments.service | — | BoardDetail |
| Checklists | checklists.service | — | BoardDetail |

---

## 6. Implemented Modules

| Module | Status |
|--------|--------|
| Empty states | ✅ Boards, Todos, KPIs, invitations |
| Error boundaries | ✅ `error.jsx`, `global-error.jsx`, `ErrorBoundary` |
| Loading states | ✅ Skeleton loaders for boards, todos, KPIs |
| 404 / Not Found | ✅ Custom not-found page |
| Onboarding | ✅ Onboarding banner for first-time users |
| Responsive | ✅ Mobile sidebar with overlay, touch targets |
| Accessibility | ✅ Skip link, ARIA labels, focus rings |

### Pending

- **Dark mode** — Tailwind dark mode support (deferred)

---

## 7. Refactor Checklist (Consistency Only)

When touching existing modules:

- [ ] Replace `text-[Npx]` with `typography-*` classes
- [ ] Use `spacing-*` utilities instead of arbitrary values
- [ ] Use `btn-*`, `card-*`, `form-*` from design system
- [ ] Ensure `CustomButton`, `CustomInput` for forms
- [ ] Use `NAVBAR_TITLE` for page titles
- [ ] Use `Auth` + `AUTH.PRIVATE` or `AUTH.PUBLIC` for auth wrapping
- [ ] No mock data; all API calls via services

---

## 8. SaaS UX Patterns

- **Organization context** — Always show current workspace in sidebar
- **Invitations** — Pending invitations in navbar
- **Breadcrumbs** — Navbar breadcrumb for navigation
- **Global search** — Cmd+K / search icon
- **Notifications** — Bell icon with unread count
- **Profile** — User dropdown with Account, Workspace, Logout

---

## 9. Quick Reference

### Adding a New Page

```jsx
// app/feature/page.jsx
"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import FeatureComponent from "@/components/feature/feature.component";

export default function FeaturePage() {
  return (
    <Auth
      component={<FeatureComponent />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.FEATURE}
    />
  );
}
```

### Adding a New Component

```
components/feature-name/
  feature-name.component.jsx
  use-feature-name.hook.js
```

### API Call Pattern

```js
// provider/features/feature/feature.service.js
import api from "@/common/utils/api";

const getItems = async () => {
  const res = await api().get("/feature");
  return res.data;
};

export default { getItems };
```

---

*Last updated: Jan 2025*
