# charles.md

> Drop this file in any project root. Claude Code will read it and produce UI that matches Charles's design system, aesthetic, and decision-making process exactly.

---

## Who This Is For

This is a personal design system document for Charles Shin — Lead Product Designer with ~7 years shipping crypto/fintech products. It encodes visual style, component philosophy, motion principles, and explicit anti-patterns. When building any UI in this project, treat this file as ground truth.

---

## Stack (Non-Negotiable)

| Layer | Library |
|---|---|
| Framework | React |
| Styling | Tailwind CSS |
| Components | shadcn/ui (Radix primitives under the hood) |
| Animation | Framer Motion |
| Icons | Phosphor Icons (`@phosphor-icons/react`) |
| Utility | `clsx` + `tailwind-merge` via `cn()` |

Never suggest replacing these. Never use Lucide, Heroicons, or other icon sets. Never use CSS-in-JS, styled-components, or Emotion.

---

## Pre-Build Protocol (Before Writing Any Code)

This is the single biggest lesson from studying how AI-generated UI goes wrong: **it skips the aesthetic decision and jumps straight to code.** The result is distributional convergence — Inter font, purple gradient on white, soft card shadows, predictable layout. It's statistically safe and visually invisible.

Before building any component or screen, answer these four questions first:

1. **What problem does this interface solve, and who uses it?** The answer should change every visual decision downstream.
2. **What's the tonal register?** Pick a clear position: utilitarian and dense, warm and approachable, minimal and precise, editorial, etc. Don't land in the middle — the middle is where generic lives.
3. **What's the one spatial idea?** Every good screen has a compositional thesis — a dominant element, a clear reading order, an asymmetry that creates tension. Name it before you build it.
4. **What would the wrong version look like?** Articulate the AI default for this specific UI, then do the opposite.

Only after answering these should code be written. Match implementation complexity to the chosen direction: a minimal, refined UI needs **more** craft per line of code, not less — precision in spacing, type weight, and hover states is what makes restraint feel intentional rather than lazy. A more expressive UI earns its complexity through coordinated motion and hierarchy, not decoration.

---

## Typography

### Font Stack

```css
/* Default — warmth, approachable, modern */
font-family: "SF Pro Rounded", -apple-system, BlinkMacSystemFont, sans-serif;

/* Alternative — more neutral/corporate contexts */
font-family: "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace — code, addresses, hashes, technical strings */
font-family: "SF Mono", ui-monospace, monospace;
```

SF Pro Rounded is the default everywhere. Switch to SF Pro only when a context explicitly calls for a more neutral register (e.g., dense data tables, technical dashboards). Use SF Mono for any code snippet, hash, wallet address, CLI output, or numeric string that needs tabular alignment.

### Type Scale

Use Tailwind's default type scale. Avoid custom font sizes unless absolutely necessary.

**Hierarchy rules:**
- Page titles: `text-2xl font-semibold` or `text-3xl font-semibold`
- Section headings: `text-lg font-medium` or `text-xl font-semibold`  
- Body: `text-sm` or `text-base` — never go below `text-xs` for readable content
- Labels, captions, helper text: `text-xs text-muted-foreground`
- Never use `font-bold` for UI labels — `font-medium` or `font-semibold` only
- Never change font weight on hover/selected states — it causes layout shift

---

## Color Philosophy

Light-first always. No dark mode unless explicitly requested.

**Neutral base + brand color system.** Colors are functional, not decorative. Every use of color should communicate something — status, hierarchy, interactivity, or brand.

**Palette approach:**
- Base: white/zinc/slate neutrals via Tailwind + shadcn tokens
- One primary brand accent per project, applied sparingly
- Use `text-muted-foreground` for secondary text, not custom grays
- Borders: `border` (default shadcn token) — never hand-roll border colors
- Destructive states: use shadcn's `destructive` token, not custom red

**Color anti-patterns:**
- Never use color purely for decoration (gradient backgrounds on cards "just because")
- Never use 3+ accent colors in the same UI
- Never use color to convey the only distinction — always pair with shape or label

---

## Spacing & Density

Balanced — comfortable but not wasteful. The goal is breathing room with purpose.

**Mental model:** Every gap should feel intentional. If you can remove 4px and nothing feels cramped, remove it. If something feels tight, add 4px before adding 8px.

**Defaults by context:**

| Context | Padding | Gap |
|---|---|---|
| Cards / panels | `p-4` or `p-5` | — |
| Form fields | `px-3 py-2` | `gap-1.5` (label → input) |
| Button (default) | `px-3 py-1.5` (sm), `px-4 py-2` (md) | — |
| Section spacing | `space-y-6` or `space-y-8` | — |
| List items | `py-2` or `py-2.5` | — |
| Page container | `max-w-2xl` or `max-w-3xl`, `mx-auto`, `px-4` | — |

**Density rules:**
- Never center a layout with `max-w-7xl` — that's too wide for most content
- Don't add padding to every nested element — let parents do the work
- Lists should feel like lists, not cards stacked vertically
- When in doubt, reduce rather than add

---

## Border Radius

This is where most AI-generated UI goes wrong. Restrain it.

```
Buttons: rounded-md (never rounded-full unless it's a pill/tag)
Cards: rounded-lg (never rounded-2xl or rounded-3xl)
Inputs: rounded-md
Modals: rounded-xl
Badges/tags: rounded-full or rounded-md — pick one per project, don't mix
Avatars: rounded-full
```

**Rule:** If everything is rounded, nothing feels considered. Reserve `rounded-xl` and above for containers, not interactive elements.

---

## Component Rules

### Buttons

- Default variant for primary actions: shadcn `Button` with `variant="default"`
- Secondary: `variant="outline"` or `variant="ghost"`
- Destructive: `variant="destructive"` — only for irreversible actions
- Always `<button>` semantically — never a `<div onClick>`
- Add `transform: scale(0.97)` on `:active` for tactile press feel
- Disable after submission to prevent duplicate requests
- Show keyboard shortcuts as tooltips on buttons that have them

```tsx
// Correct
<Button variant="default" size="sm">Save</Button>

// Wrong — don't hand-roll button styles
<div onClick={save} className="bg-black text-white px-4 py-2 rounded-md cursor-pointer">
  Save
</div>
```

### Cards

- Use `rounded-lg border bg-card text-card-foreground shadow-sm` — no excessive shadow
- Cards should not have `shadow-xl` or `shadow-2xl` by default
- Avoid borders AND shadows together — pick one as the separation method
- Don't put cards inside cards unless there's a clear hierarchy reason

### Inputs

- Font size must be `16px` minimum to prevent iOS zoom on focus
- Prefix/suffix icons: absolutely positioned, not siblings
- Labels always associated via `htmlFor` or wrapping
- `spellCheck={false}` and `autoComplete="off"` by default for most inputs
- Autofocus on modal open only if not a touch device

```tsx
const isTouch = 'ontouchstart' in window;
<Input autoFocus={!isTouch} />
```

### Forms

- Always wrap inputs in a `<form>` so Enter submits
- Support `Cmd+Enter` / `Ctrl+Enter` for textarea submission
- Prefill with known user data whenever possible
- Colocate error messages directly below the field that caused them
- Use shadcn `FormField` + `FormMessage` pattern

### Icons (Phosphor)

```tsx
import { ArrowRight, Warning, CheckCircle } from "@phosphor-icons/react";

// Default weight: regular
// Emphasis: bold or fill — not both in the same UI
// Size: match text scale (16 with sm text, 20 with base text)
<ArrowRight size={16} weight="regular" />
```

Every icon-only button needs an `aria-label`. No exceptions.

### Modals / Dialogs

- Use shadcn `Dialog` — Radix-based, accessible by default
- Autofocus first input on open (desktop only)
- Confirm before any destructive action — use a proper Dialog, not `window.confirm()`
- Modal + overlay: same easing, same duration

---

## Motion (Emil Kowalski Principles)

Motion should feel native, not performative. Product UI is fast and purposeful. Marketing pages can be more expressive.

### Easing Blueprint

```css
/* Elements entering or exiting → ease-out */
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);

/* Elements moving while on screen → ease-in-out */
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);

/* Hover / color transitions → ease */
transition: background-color 150ms ease;
```

### Duration Guidelines

| Element | Duration |
|---|---|
| Micro-interactions (hover, color) | 100–150ms |
| Dropdowns, tooltips | 150–200ms |
| Modals, drawers | 200–300ms |
| Page transitions | 300–400ms max |

**Frequency rule:** If a user will see this 100+ times a day, don't animate it. Raycast doesn't animate its menu toggle. Follow that instinct.

### Framer Motion Defaults

```tsx
// Enter/exit pattern
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 4 }}
  transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
/>

// Spring — for drag and playful interactions only
{ type: "spring", duration: 0.5, bounce: 0.15 }

// Reduced motion — always
const shouldReduceMotion = useReducedMotion();
initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
```

### The Golden Rules

1. Only animate `transform` and `opacity` — these run on the GPU and skip layout/paint
2. Never animate `height`, `width`, `padding`, or `margin` directly
3. Paired elements (modal + overlay, tooltip + arrow) must share the same easing and duration
4. Every animation needs `prefers-reduced-motion` support
5. Use `AnimatePresence` with `mode="wait"` for route transitions
6. Don't use `transition: all` — specify exact properties

---

## Layout

- `max-w-2xl` to `max-w-3xl` for content pages — never let text go full width
- Left-align content by default — centered layouts only for empty states and marketing heroes
- Use CSS Grid for two-dimensional layouts, Flexbox for one-dimensional
- Sidebar + main: prefer fixed sidebar width (`w-64` or `w-72`) + `flex-1` main
- Sticky headers: `sticky top-0 z-10 bg-background/80 backdrop-blur-sm`

**Spatial composition — the thing most AI UI skips:**
Every screen should have a compositional thesis — a dominant element that draws the eye first, a clear reading hierarchy, and intentional use of negative space. Asymmetry and visual tension are tools, not accidents. Don't arrange elements in a grid just because it's easy; arrange them based on importance and flow. Generous negative space OR controlled density — pick one and commit. The middle is mud.

---

## Anti-Patterns (Never Do These)

These are the things that make Charles immediately want to rewrite output:

**Radius crimes:**
- `rounded-2xl` or `rounded-3xl` on buttons or inputs
- `rounded-full` on rectangular cards
- Everything in the UI having the same radius value

**Shadow abuse:**
- `shadow-xl` or `shadow-2xl` on standard cards
- Shadows AND borders on the same element
- Inner shadows for no reason

**Layout crimes:**
- Content area `max-w-7xl` or wider — text lines become unreadable
- Everything centered, nothing left-aligned
- Padding applied at every nesting level instead of at the container

**Generic SaaS patterns:**
- Hero sections with a headline, subheadline, two CTA buttons, and a screenshot — rethink the structure
- Feature grids with icons and 3-word labels
- Pricing tables that look like every other pricing table
- `bg-gradient-to-br from-purple-500 to-blue-500` as a section background

**Color as decoration:**
- Gradient fills on cards just to add visual interest
- Colorful icon backgrounds (the `bg-blue-100 rounded-lg p-2` icon wrapper pattern)
- Using 3+ accent colors in the same view

**Typography mistakes:**
- `font-bold` on UI labels (use `font-medium` or `font-semibold`)
- All caps labels for everything
- Font weight changing on hover — causes layout shift
- Line length over ~70 characters for body text

**Motion mistakes:**
- `transition: all` — always specify properties
- Scroll-triggered fade-ups on every section
- Animations on frequently-used UI (tabs, nav items, toggles)
- No `prefers-reduced-motion` support

---

## Design Decision Framework

When Claude Code faces an ambiguous design decision, apply this hierarchy:

1. **Does shadcn already have this component?** Use it. Don't reinvent.
2. **Does the pattern exist in the project already?** Match it for consistency.
3. **Is this a product UI or a marketing surface?** Product = fast and minimal. Marketing = can be more expressive.
4. **Will the user see this 100+ times?** If yes, make it invisible — no animation, low visual weight.
5. **Is this the primary action?** One primary action per view. Everything else is secondary.
6. **Am I adding complexity or removing it?** Default to removing. Simplify until it breaks, then add back one thing.

---

## Accessibility (WCAG 2.1 AA — Non-Negotiable)

Think of this section as a rams-style severity triage. Issues are ranked CRITICAL → SERIOUS → MODERATE. Fix in that order.

### CRITICAL — Ship blockers

**Missing accessible names (WCAG 4.1.2)**
Every icon-only button needs `aria-label`. No exceptions. Claude Code must catch this automatically.
```tsx
// Wrong
<button><X /></button>

// Right
<button aria-label="Close dialog"><X /></button>
```

**Color contrast — text (WCAG 1.4.3)**
Normal text: 4.5:1 minimum. Large text (18px+ or 14px+ bold): 3:1 minimum. Never eyeball this — if shadcn tokens are used correctly, this is handled. The moment you hand-roll a color, verify contrast.

**Color as the only differentiator (WCAG 1.4.1)**
Never use color alone to communicate state, error, or category. Always pair color with an icon, label, or pattern. A red border on an error field must also have an error message.

**Form inputs without labels (WCAG 1.3.1)**
Every input must have an associated label via `htmlFor` or wrapping element. Placeholder text is not a label.

### SERIOUS — Fix before review

**Focus outline removed (WCAG 2.4.7)**
`outline-none` or `focus:outline-none` without a replacement focus style is a blocking accessibility failure.
```tsx
// Wrong — destroys keyboard navigation
className="focus:outline-none"

// Right — custom focus ring that matches the design
className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

**Keyboard navigation broken**
Tab order must follow visual reading order. Every interactive element must be reachable and operable by keyboard. Test this manually.

### MODERATE — Polish pass

**Missing `aria-live` for dynamic content**
Toast notifications, status updates, and async results need `role="status"` or `aria-live="polite"` to be announced by screen readers.

**`prefers-reduced-motion` not respected**
Every animation must have a reduced-motion alternative. No exceptions — including opacity transitions.

**iOS zoom on input focus**
Input font size must be ≥ 16px or iOS Safari will zoom the viewport on focus.

---

## Interactive States (All Required)

Every interactive element must have all of these implemented — not just hover:

| State | Required |
|---|---|
| Default | ✓ |
| Hover | ✓ — `@media (hover: hover)` only |
| Focus-visible | ✓ — never remove, always style |
| Active / pressed | ✓ — `scale(0.97)` on buttons |
| Disabled | ✓ — `opacity-50 cursor-not-allowed pointer-events-none` |
| Loading | ✓ — spinner or skeleton, button disabled |
| Error | ✓ — inline message below the field |
| Empty state | ✓ — don't leave blank space, write helpful copy |

AI-generated UI almost always skips active, error, and empty states. These are non-negotiable.

---

## File & Component Conventions

```
components/
  ui/           # shadcn components (don't modify these)
  [feature]/    # feature-specific components
    component.tsx
    component.test.tsx
    index.ts
```

- Compound components over prop-drilling
- `asChild` pattern (Radix Slot) for polymorphic elements
- Always `forwardRef` for components wrapping DOM elements
- Spread `...props` on the root element for arbitrary HTML attribute passthrough
- Variants via `cva()` — not boolean prop soup

```tsx
// Right
<Button variant="outline" size="sm">Cancel</Button>

// Wrong
<Button outline small secondary>Cancel</Button>
```

## Design Review Protocol

When reviewing any UI output (your own or Claude's), run a rams-style pass in this order:

**Pass 1 — CRITICAL (accessibility failures)**
- [ ] Any `<button>` or icon element missing an accessible name?
- [ ] Any `focus:outline-none` without `focus-visible:ring-*` replacement?
- [ ] Any `outline-none` class anywhere in the component?
- [ ] Color contrast verified for all text on non-white backgrounds?
- [ ] Color used as the ONLY differentiator for any state?
- [ ] Any form input missing an associated `<label>`?

**Pass 2 — SERIOUS (UX failures)**
- [ ] All interactive states implemented (hover, focus, active, disabled, loading, error, empty)?
- [ ] Keyboard navigation flows logically — tested with Tab key?
- [ ] Dynamic content (toasts, status) announced with `aria-live`?

**Pass 3 — MODERATE (polish)**
- [ ] `prefers-reduced-motion` applied to all animations?
- [ ] No layout shift on state changes (loading → content, number updates)?
- [ ] Error messages colocated with the field that caused them?
- [ ] Loading states prevent duplicate form submissions?

**Pass 4 — Aesthetic (Charles's taste)**
- [ ] Does this look like I made it, or does it look like an AI made it?
- [ ] Did the pre-build protocol get followed — is there a clear spatial thesis?
- [ ] Border radius consistent and restrained?
- [ ] No shadow + border on the same card?
- [ ] Content width ≤ `max-w-3xl`?
- [ ] Phosphor icons at consistent size and weight?
- [ ] SF Pro Rounded applied?

---

## Quick Checklist Before Shipping UI

**Accessibility (CRITICAL)**
- [ ] No icon buttons without `aria-label`
- [ ] No `outline-none` without `focus-visible:ring-*` replacement
- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text
- [ ] Color never the only differentiator for state
- [ ] All inputs have associated labels

**Interaction completeness**
- [ ] Hover, focus, active, disabled, loading, error, and empty states all implemented
- [ ] Forms submit on Enter; textareas on Cmd+Enter
- [ ] Submit button disabled during loading to prevent duplicate requests

**Layout & Typography**
- [ ] No layout shift on dynamic content (`font-variant-numeric: tabular-nums` for numbers)
- [ ] Content width ≤ `max-w-3xl`
- [ ] Input font size ≥ 16px
- [ ] SF Pro Rounded font stack applied

**Motion**
- [ ] All animations have `prefers-reduced-motion` support
- [ ] No `transition: all` — specific properties only
- [ ] Hover effects wrapped in `@media (hover: hover) and (pointer: fine)`

**Visual**
- [ ] No `shadow-xl` on standard cards
- [ ] Border radius consistent and intentional
- [ ] No border + shadow on same element
- [ ] Phosphor icons only — `regular` weight default
- [ ] Pre-build aesthetic direction followed — no generic AI defaults