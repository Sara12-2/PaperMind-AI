---
tags: [papermind, frontend, nextjs]
---

# Frontend

Next.js 16 (App Router) + React 19, living in `frontend/`. Plain CSS, no
component library, no CSS framework. See [[Architecture]] for how it talks to
the backend, and [[API Reference]] for the two calls it makes
(`services/api.js`: `uploadPDF()` and `askQuestion()` — the only two `fetch`
calls in the whole app).

## Structure

```
app/
  layout.js     root layout — theme-init script, ErrorBoundary, ThemeProvider, ToastProvider
  page.js       main page — composes Sidebar / ChatArea / InputBar, owns sidebarOpen state
  globals.css   design tokens (CSS custom properties) + every component's styles

components/
  Sidebar.jsx        logo, upload zone, document list — also the mobile drawer
  UploadZone.jsx      drag/drop + click-to-upload, client-side type/size validation
  DocItem.jsx         one document row (select / remove)
  ChatArea.jsx        message list, auto-scroll, typing indicator
  MessageBubble.jsx   one message, expandable sources toggle
  SourceCard.jsx       one retrieved excerpt (page badge + text)
  WelcomeScreen.jsx    empty-state instructions
  InputBar.jsx         textarea (auto-resize) + send button
  Icons.jsx            every inline SVG icon used in the app — no emoji, anywhere
  ErrorBoundary.jsx    class component, catches render crashes, shows a reload screen

context/
  ToastContext.jsx    toast notification provider/hook
  ThemeContext.jsx    light/dark theme provider/hook

hooks/
  useDocuments.js      upload/select/remove document state + client-side validation
  useChat.js           message state, sends questions, scoped to the active document
```

## Theming

See [[Overview#Tech stack at a glance]] for the summary; this is the detail.

Everything is CSS custom properties defined once in `app/globals.css`:

```css
:root { --bg: #0D1117; --surface: #161B22; /* ...dark values, the default... */ }
:root[data-theme="light"] { --bg: #FFFFFF; --surface: #F6F8FA; /* ...overrides... */ }
```

`ThemeContext.jsx` toggles by setting `data-theme` on `<html>` and persisting
the choice to `localStorage` (`papermind-theme` key). The toggle button lives
in the topbar (`page.js`), rendering `IconSun`/`IconMoon` from `Icons.jsx`
depending on current theme.

**Avoiding a flash of the wrong theme on load:** `app/layout.js` injects a
small synchronous `<script>` in `<head>` that reads `localStorage` (falling
back to `prefers-color-scheme`) and sets `data-theme` on `<html>` *before*
React hydrates. Since the server has no way to know the user's stored
preference, the server-rendered HTML and the post-script client HTML
legitimately differ on that one attribute — `<html suppressHydrationWarning>`
tells React that specific, expected mismatch is fine rather than logging a
hydration warning every load.

## Responsive layout

Single breakpoint at `900px` (see `globals.css`, `@media (max-width: 900px)`):

- `.sidebar` switches from a static flex child to a `position: fixed`
  off-canvas drawer, hidden by default (`transform: translateX(-100%)`),
  slid in via `.sidebar.open { transform: translateX(0); }`
- `.menu-toggle` (hamburger, `IconMenu`) becomes visible in the topbar,
  hidden entirely above the breakpoint
- A `.sidebar-backdrop` overlay appears behind the open drawer; clicking it
  closes the drawer
- Selecting a document while the drawer is open also closes it
  (`Sidebar.jsx`'s `selectDoc` calls `onClose` after `switchDoc`) — pure
  mobile UX polish, no effect on desktop
- A second, narrower breakpoint at `480px` tightens padding/font-sizes and
  hides a couple of low-priority elements (`.topbar-badge`, `.input-hint`)

State for the drawer (`sidebarOpen`) lives in `app/page.js`, passed down to
`Sidebar` as `isOpen`/`onClose`.

## Animations

All defined in `globals.css`:

- `fade-up` — messages, the welcome screen, and expanded source lists ease in
  on mount
- `item-in` — new document rows slide in from the left
- `toast-in` — toast notifications slide up + fade in
- A shared transition rule (`background-color`, `color`, `border-color`,
  `box-shadow`, `opacity`, all `0.2s ease`) is applied to every themed surface
  element, so switching light/dark cross-fades instead of snapping
- Icon buttons (`send-btn`, `theme-toggle`, `menu-toggle`, `doc-item-del`) get
  a small `scale(0.92)` press-down on `:active` for tactile feedback

## Toast notifications

`ToastContext.jsx` — a simple provider holding a `toasts` array, `showToast(message, type)`
adds one and auto-dismisses after 4 seconds, `dismissToast(id)` removes it
early on click. Currently used by `useDocuments.js` for upload validation
(wrong file type, over the 25MB limit) and upload success/failure — see
[[RAG Pipeline]] for what triggers a failure server-side.

## Related notes

[[Architecture]] · [[API Reference]] · [[Overview]]
