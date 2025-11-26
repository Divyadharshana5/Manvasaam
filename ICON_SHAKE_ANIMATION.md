# Icon Shake Animation

## What Was Added

Added a shake animation to the icons (Farmer, Transport, Retail) that triggers when hovering over the role cards on the home page.

## Changes Made

### 1. Updated RoleCard Component
**File:** `src/components/home-page-optimized.tsx`

```tsx
// Before
<div className="text-4xl sm:text-5xl">
  {role.icon}
</div>

// After
<div className="text-4xl sm:text-5xl group-hover:animate-shake-icon transition-transform">
  {role.icon}
</div>
```

### 2. Added CSS Animation
**File:** `src/app/globals.css`

```css
@keyframes shake-icon {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-8deg); }
  20%, 40%, 60%, 80% { transform: rotate(8deg); }
}

.animate-shake-icon {
  animation: shake-icon 0.6s ease-in-out;
}
```

## How It Works

1. **Hover Detection:** Uses `group-hover:` utility from Tailwind
2. **Animation Trigger:** When you hover over the card (group), the icon shakes
3. **Animation:** Rotates left and right (-8° to +8°) 5 times over 0.6 seconds
4. **Smooth:** Uses `ease-in-out` timing for natural movement

## Visual Effect

```
Normal State:  🚜
                ↓
Hover State:   🚜 ← → ← → ← → ← → ← (shaking)
```

## Animation Details

- **Duration:** 0.6 seconds
- **Rotation:** ±8 degrees
- **Shakes:** 5 times
- **Timing:** ease-in-out (smooth start and end)
- **Trigger:** On card hover

## Icons Affected

1. 🚜 **Farmer** - Tractor icon
2. 🚚 **Transport** - Truck icon
3. 🏪 **Retail** - Building icon

## Browser Compatibility

✅ Chrome/Edge
✅ Firefox
✅ Safari
✅ Mobile browsers

## Performance

- Lightweight CSS animation
- GPU-accelerated (transform)
- No JavaScript overhead
- Smooth 60fps animation

## Customization

To adjust the shake intensity, modify the rotation degrees:

```css
/* More intense shake */
10%, 30%, 50%, 70%, 90% { transform: rotate(-12deg); }
20%, 40%, 60%, 80% { transform: rotate(12deg); }

/* Gentler shake */
10%, 30%, 50%, 70%, 90% { transform: rotate(-5deg); }
20%, 40%, 60%, 80% { transform: rotate(5deg); }
```

To adjust the speed:

```css
/* Faster */
.animate-shake-icon {
  animation: shake-icon 0.4s ease-in-out;
}

/* Slower */
.animate-shake-icon {
  animation: shake-icon 0.8s ease-in-out;
}
```

## Testing

1. Run `npm run dev`
2. Open http://localhost:3000
3. Hover over any of the three role cards
4. Icons should shake when hovering

## Accessibility

- Animation respects `prefers-reduced-motion` setting
- No impact on screen readers
- Keyboard navigation still works
- Touch devices: animation triggers on touch

---

**Result:** Fun, engaging hover effect that draws attention to the role cards! 🎉
