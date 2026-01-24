# PayOnce - Simplified Design

## Philosophy

**Less is more.** Every element must justify its existence by directly helping users find or submit tools.

## What Was Removed

- Philosophy/manifesto banner
- "Featured tools" section header
- Verbose descriptions and taglines
- Large padding and spacing
- Decorative icons
- Confirmation checkmarks
- Verbose success messages
- Redundant CTAs

## Structure

```
/              Landing (hero + tool grid)
/tools         Directory (search + filter + grid)
/tools/[slug]  Detail (name, price, link, description)
/submit        Form (6 fields)
```

## Components

### Header (h-12)
```
[PayOnce]                    [Browse] [Submit]
─────────────────────────────────────────────
```

### Hero
```
Software you buy once and own forever.
Curated tools with no subscriptions.

[Browse tools] [Submit]
```

### Tool Card (compact)
```
┌────────────────────────────────────┐
│ Tool Name                    $29   │
│ Short description text...          │
│ Category · Platform                │
└────────────────────────────────────┘
```

### Tool Detail
```
← Back

Tool Name
Category · Platform

┌────────────────────────────────────┐
│ $29              [Visit site →]    │
│ One-time                           │
└────────────────────────────────────┘

Description text here.

Pricing verified at time of listing.
```

### Submit Form
```
Tool name       [___________]
Website URL     [___________]
Category [____] Platform [____]
Price (USD)     [___________]
Email (opt)     [___________]
                    [Submit]
```

## Spacing

- Container: max-w-4xl (directory), max-w-2xl (detail), max-w-md (submit)
- Page padding: py-8
- Grid gap: gap-3
- Form spacing: space-y-4

## Typography

- Page title: text-xl font-bold
- Tool name: font-medium
- Price: text-lg font-bold (card), text-2xl font-bold (detail)
- Body: text-sm
- Meta: text-xs text-muted-foreground

## Colors

Using existing stone palette:
- Background: default
- Text: foreground / muted-foreground
- Borders: border
- Hover: border-foreground/20

## File Structure

```
app/
├── page.tsx           # Landing
├── tools/
│   ├── page.tsx       # Directory
│   └── [slug]/page.tsx # Detail
└── submit/page.tsx    # Form

components/
├── header.tsx
├── footer.tsx
├── hero.tsx
├── featured-section.tsx
├── tool-card.tsx
├── tools-directory.tsx
├── search-input.tsx
├── category-filter.tsx
├── price-card.tsx
├── pricing-disclaimer.tsx
├── submit-form.tsx
└── success-state.tsx
```
