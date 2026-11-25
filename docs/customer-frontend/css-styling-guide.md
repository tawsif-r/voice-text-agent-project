# VoiceNest — CSS Styling Guide

## 1. Overview

VoiceNest customer frontend uses CSS for its global design system, landing page, theme management, recording workspace, responsive layouts, and visual effects.

The styling system is currently organized into three CSS files:

```text
customer-frontend/
└── src/
    ├── index.css
    ├── App.css
    └── components/
        └── VoiceWorkspace.css
```

### CSS responsibilities

| File | Responsibility |
|---|---|
| `index.css` | Global styles, CSS variables, themes, reset, accessibility |
| `App.css` | Customer landing page, navigation, sections, cards, animations |
| `components/VoiceWorkspace.css` | Voice recording workspace and recording controls |

---

## 2. Global Design System

The global design system is defined in `index.css`.

It uses CSS custom properties (variables) to maintain consistent colors across the application.

### Default dark theme

Dark theme is the default.

| Variable | Value | Purpose |
|---|---|---|
| `--bg` | `#0b0d17` | Main background |
| `--surface` | `#131625` | Cards and surfaces |
| `--surface-hover` | `#1b2033` | Hover backgrounds |
| `--border` | `#292e45` | Borders and separators |
| `--text-primary` | `#f4f5ff` | Primary text |
| `--text-secondary` | `#a0a6c0` | Secondary text |
| `--accent` | `#a78bfa` | Primary accent |
| `--accent-secondary` | `#22d3ee` | Secondary accent |
| `--shadow` | `0 8px 30px rgba(0, 0, 0, 0.25)` | Default shadow |

### Light theme

Light theme overrides the same variables using:

```css
:root[data-theme="light"]
```

This allows components using global variables to adapt without maintaining separate stylesheets.

| Variable | Value |
|---|---|
| `--bg` | `#f5f6fc` |
| `--surface` | `#ffffff` |
| `--surface-hover` | `#eeeff8` |
| `--border` | `#e1e3ef` |
| `--text-primary` | `#17182b` |
| `--text-secondary` | `#686b83` |
| `--accent` | `#7952db` |
| `--accent-secondary` | `#0891b2` |

---

## 3. Typography

The global font stack is:

```css
font-family: Inter, system-ui, sans-serif;
```

The global stylesheet also enables:

- Antialiased font rendering.
- Optimized text rendering.
- Disabled synthetic font styles.

Headings use heavier font weights, generally between `750` and `800`.

Responsive heading sizes use CSS `clamp()` where appropriate.

Example:

```css
font-size: clamp(35px, 4.5vw, 55px);
```

---

## 4. Global Reset and Base Styles

`index.css` applies a universal reset:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

Other global rules include:

- Minimum viewport width of 320px.
- Smooth scrolling.
- Theme-aware body background and text colors.
- Consistent button typography.
- Visible keyboard focus outlines.
- Full-height root container.

The `#root` element provides the base application layout.

---

## 5. Theme Management

Theme state is managed in `customer-frontend/src/App.tsx`.

The application supports:

- Dark theme.
- Light theme.
- Theme persistence using `localStorage`.
- Automatic application of the selected theme through the root HTML element.

The saved key is:

```text
voicenest-theme
```

The selected theme is applied through:

```tsx
document.documentElement.dataset.theme = theme
```

The theme toggle is styled in `App.css` using the `.theme-toggle` class.

Components should use global theme variables instead of hard-coded colors wherever possible.

---

## 6. Landing Page Styling

The landing page styles are maintained in `App.css`.

### 6.1 Application shell

The `.app-shell` class provides:

- Full viewport height.
- Main background and text colors.
- Relative positioning.
- Overflow control.
- Theme transition.

### 6.2 Background particles

The `.particles-layer` and `.particle` classes create decorative floating particles.

The particles:

- Use the primary accent color.
- Are positioned independently.
- Have different animation delays.
- Do not interfere with pointer interaction.

The `float` keyframe controls their movement.

### 6.3 Header and navigation

Main navigation styling includes:

- `.landing-header`
- `.brand`
- `.brand-mark`
- `.brand-name`
- `.nav-links`
- `.header-actions`
- `.theme-toggle`
- `.nav-cta`

The header uses a flexible layout and theme-aware borders.

### 6.4 Hero section

The main landing hero uses:

- `.landing-hero`
- `.hero-content`
- `.hero-description`
- `.hero-actions`
- `.hero-note`
- `.hero-visual`

The hero visual contains a decorative assistant preview.

Its main styling classes include:

- `.preview-window`
- `.preview-topbar`
- `.preview-body`
- `.preview-orb`
- `.orb-core`
- `.orb-ring`
- `.waveform`
- `.floating-card`

### 6.5 Shared CTA buttons

Two reusable CTA classes are available:

| Class | Purpose |
|---|---|
| `.primary-cta` | Main gradient action button |
| `.secondary-cta` | Secondary outlined action button |

Both use consistent padding, alignment, typography, rounded corners, and hover transitions.

### 6.6 Content sections

The landing page contains several styled sections:

| Section | Main CSS classes |
|---|---|
| Trust strip | `.trust-strip`, `.trust-items` |
| Problem and solution | `.problem-grid`, `.problem-card`, `.solution-card` |
| Features | `.feature-grid`, `.feature-card` |
| How it works | `.how-section`, `.steps-grid`, `.step-card` |
| Demo preview | `.demo-window`, `.demo-content`, `.demo-panels` |
| FAQ | `.faq-section`, `.faq-item`, `.faq-question`, `.faq-answer` |
| Final CTA | `.final-cta`, `.final-cta-content` |
| Footer | `.landing-footer` |

The feature section uses a bento-style grid layout.

The `.feature-large` and `.feature-wide` classes allow selected cards to occupy multiple grid columns.

---

## 7. Voice Workspace Styling

The recording interface is maintained separately:

```text
customer-frontend/src/components/VoiceWorkspace.css
```

Its primary classes are:

| Class | Responsibility |
|---|---|
| `.voice-workspace` | Main workspace container |
| `.workspace-container` | Content width and alignment |
| `.workspace-header` | Workspace introduction |
| `.workspace-label` | Small section label |
| `.recording-card` | Main recording panel |
| `.recording-indicator` | Recording status |
| `.microphone-icon` | Microphone visual |
| `.recording-actions` | Recording action container |
| `.record-button` | Start recording button |
| `.stop-button` | Stop recording button |
| `.record-dot` | Recording indicator |
| `.audio-preview` | Audio playback preview |
| `.recording-error` | Error message styling |

The recording card uses:

- A translucent background.
- Rounded corners.
- Backdrop blur.
- A subtle border.
- A soft shadow.

The active recording indicator uses the `pulse` animation.

---

## 8. Animations and Visual Effects

The current CSS includes several animations.

| Animation | Purpose |
|---|---|
| `float` | Moves background particles |
| `logoPulse` | Subtle brand and orb scaling |
| `previewFloat` | Floating assistant preview |
| `waveMotion` | Decorative audio waveform movement |
| `ringPulse` | Expanding circular visual rings |
| `pulse` | Recording status indicator |

Animations should remain decorative and must not interfere with the recording workflow.

---

## 9. Responsive Design

The landing page uses three responsive breakpoints.

### 1000px

Adjusts:

- Hero spacing.
- Floating card positions.
- Navigation gaps.

### 760px

Adjusts:

- Header padding.
- Hides navigation links and navigation CTA.
- Changes hero to a single-column layout.
- Removes preview transformation and animation.
- Reduces section spacing.
- Changes feature grid to two columns.
- Changes steps grid to one column.

### 520px

Adjusts:

- Hero heading size.
- CTA buttons to vertical layout.
- Hides floating cards.
- Changes problem, feature, and demo grids to one column.
- Reduces section padding.
- Changes footer alignment.

### Voice Workspace breakpoint

`VoiceWorkspace.css` uses an additional breakpoint:

```css
@media (max-width: 600px)
```

It reduces workspace padding and recording card spacing and adjusts the workspace heading size.

---

## 10. Accessibility

The global stylesheet includes:

- Visible keyboard focus indicators through `:focus-visible`.
- Reduced-motion support.
- Minimum viewport width.
- Smooth scrolling with reduced-motion override.

Both `index.css` and `App.css` contain reduced-motion rules.

The global rule disables or minimizes animations and transitions when the operating system requests reduced motion.

---

## 11. Current Styling Inconsistencies

The following are observations about the current implementation, not completed fixes.

### 11.1 Workspace theme variables

`VoiceWorkspace.css` currently references:

```css
background: var(--background, #0b1020);
color: var(--text-color, #ffffff);
```

However, the global theme defines:

```css
--bg
--text-primary
```

It does not define `--background` or `--text-color`.

Consequently, the workspace uses fallback colors rather than fully following the global theme.

### 11.2 Hard-coded workspace colors

Several workspace colors are currently hard-coded, including:

- `#8b8cff`
- `#8985ff`
- `#a5abc0`
- `#ff5252`
- `#e64b61`

These should eventually be reviewed for consistency with the global design system.

### 11.3 Legacy or potentially unused styles

Some selectors in `App.css`, such as `.app-header`, `.main-content`, `.hero-section`, and `.hero-title`, do not match the corresponding class names in the currently inspected `App.tsx`.

They should be checked before removal.

Some demo preview selectors may also be unused by the current JSX structure.

Do not remove them without verifying their usage.

---

## 12. CSS Naming Conventions

Use descriptive class names that communicate the component or section they belong to.

Examples:

```css
.landing-hero
.recording-card
.workspace-header
.feature-card
.faq-question
```

Recommended conventions:

1. Use lowercase class names.
2. Separate words using hyphens.
3. Use component-specific prefixes where appropriate.
4. Keep shared styles in global stylesheets.
5. Keep component-specific styles beside their component.
6. Prefer CSS variables for reusable theme colors.
7. Avoid unnecessary duplicate declarations.
8. Keep responsive rules grouped by breakpoint.

---

## 13. Maintenance Guidelines

When modifying the customer frontend styles:

1. Check whether a global CSS variable already exists before introducing a new color.
2. Preserve both dark and light theme compatibility.
3. Keep `VoiceWorkspace.css` focused on recording workspace presentation.
4. Keep `App.css` focused on the landing page.
5. Put global resets and design tokens in `index.css`.
6. Test layouts at desktop, tablet, and mobile widths.
7. Verify reduced-motion behavior after introducing animations.
8. Check whether existing selectors are used before deleting them.

---

## 14. Current CSS Architecture Summary

```text
customer-frontend/src/
│
├── index.css
│   ├── Global typography
│   ├── Dark theme variables
│   ├── Light theme variables
│   ├── Global reset
│   └── Accessibility
│
├── App.css
│   ├── Application shell
│   ├── Background particles
│   ├── Navigation
│   ├── Hero section
│   ├── Assistant preview
│   ├── Landing page sections
│   ├── Animations
│   ├── Responsive layouts
│   └── Footer
│
└── components/
    └── VoiceWorkspace.css
        ├── Workspace layout
        ├── Recording card
        ├── Recording controls
        ├── Recording states
        ├── Audio preview
        └── Mobile layout
```

**Documentation status:** Describes the inspected CSS implementation. Styling inconsistencies and potentially unused selectors remain to be reviewed separately.
