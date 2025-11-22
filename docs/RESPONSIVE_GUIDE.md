# Responsive Design Guide

## Overview
This application is optimized for fast, responsive performance across all devices. All pages follow mobile-first design principles with progressive enhancement for larger screens.

## Breakpoints
```
xs:  475px  - Extra small devices (large phones)
sm:  640px  - Small devices (tablets)
md:  768px  - Medium devices (small laptops)
lg:  1024px - Large devices (desktops)
xl:  1280px - Extra large devices
2xl: 1536px - Ultra-wide screens
```

## Key Responsive Patterns

### 1. Container Widths
```tsx
// Use responsive containers with max-width
<div className="max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
  {children}
</div>
```

### 2. Grid Layouts
```tsx
// Mobile-first grid that adapts to screen size
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {items}
</div>
```

### 3. Flex Layouts
```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-4">
  {items}
</div>
```

### 4. Typography
```tsx
// Responsive text sizes
<h1 className="text-xl sm:text-2xl lg:text-3xl">Title</h1>
<p className="text-sm sm:text-base">Body text</p>
```

### 5. Spacing
```tsx
// Responsive spacing
<div className="space-y-4 md:space-y-6">
  <div className="p-4 md:p-6 lg:p-8">Content</div>
</div>
```

### 6. Buttons
```tsx
// Full width on mobile, auto on desktop
<Button className="w-full sm:w-auto">Action</Button>

// Hide text on small screens
<Button>
  <Icon className="h-4 w-4 sm:mr-2" />
  <span className="hidden sm:inline">Label</span>
</Button>
```

## Performance Optimizations

### 1. Viewport Configuration
```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#22c55e",
};
```

### 2. Prevent Horizontal Scroll
```css
body {
  overflow-x: hidden;
  width: 100%;
}
```

### 3. Touch Targets
All interactive elements have minimum 44x44px touch targets on mobile.

### 4. Font Size Prevention
Input fields use 16px minimum font size to prevent iOS zoom on focus.

## Utility Classes

### Responsive Utilities
- `.responsive-grid` - Auto-fit grid with minimum 300px columns
- `.responsive-flex` - Flex with wrap and gap
- `.responsive-padding` - Clamp-based responsive padding
- `.responsive-text` - Clamp-based responsive text
- `.responsive-heading` - Clamp-based responsive headings

### Visibility Classes
- `.hide-mobile` - Hidden on screens < 768px
- `.show-mobile` - Visible only on screens < 768px
- `.hide-tablet` - Hidden on screens 769px-1024px
- `.hide-desktop` - Hidden on screens > 1024px

### Mobile-Specific
- `.mobile-container` - Prevents horizontal overflow
- `.touch-target` - Ensures 44x44px minimum size
- `.gpu-layer` - GPU acceleration for smooth animations

## Best Practices

### 1. Always Test on Multiple Devices
- Mobile (320px - 767px)
- Tablet (768px - 1023px)
- Desktop (1024px+)

### 2. Use Truncation for Long Text
```tsx
<p className="truncate">Long text that might overflow</p>
<p className="line-clamp-2">Multi-line text with max 2 lines</p>
```

### 3. Responsive Images
```tsx
<img 
  src="/image.jpg" 
  alt="Description"
  className="w-full h-auto"
  loading="lazy"
/>
```

### 4. Flexible Components
```tsx
// Bad - Fixed widths
<div className="w-[500px]">Content</div>

// Good - Responsive widths
<div className="w-full max-w-lg">Content</div>
```

### 5. Stack Complex Layouts on Mobile
```tsx
<div className="flex flex-col lg:flex-row gap-4">
  <aside className="lg:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

## Component Examples

### Responsive Card
```tsx
<Card className="w-full">
  <CardHeader className="p-4 md:p-6">
    <CardTitle className="text-lg sm:text-xl">Title</CardTitle>
  </CardHeader>
  <CardContent className="p-4 md:p-6">
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
      {items}
    </div>
  </CardContent>
</Card>
```

### Responsive Form
```tsx
<form className="space-y-4">
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
    <div className="space-y-2">
      <Label className="text-sm">Field 1</Label>
      <Input className="text-sm" />
    </div>
    <div className="space-y-2">
      <Label className="text-sm">Field 2</Label>
      <Input className="text-sm" />
    </div>
  </div>
  <Button className="w-full sm:w-auto">Submit</Button>
</form>
```

### Responsive Table
```tsx
<div className="overflow-x-auto">
  <table className="w-full min-w-[600px]">
    <thead>
      <tr>
        <th className="text-xs sm:text-sm">Column 1</th>
        <th className="text-xs sm:text-sm">Column 2</th>
      </tr>
    </thead>
    <tbody>
      {rows}
    </tbody>
  </table>
</div>
```

## Performance Checklist

- [ ] No horizontal scroll on any screen size
- [ ] All text is readable (minimum 14px on mobile)
- [ ] Touch targets are at least 44x44px
- [ ] Images are optimized and lazy-loaded
- [ ] Forms don't trigger zoom on iOS
- [ ] Animations are smooth (60fps)
- [ ] Content loads progressively
- [ ] Critical CSS is inlined
- [ ] Fonts are optimized with font-display: swap

## Testing

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on various device presets
4. Check responsive breakpoints

### Real Device Testing
Test on actual devices when possible:
- iPhone SE (375px)
- iPhone 12/13 (390px)
- iPad (768px)
- Desktop (1920px)

## Common Issues & Solutions

### Issue: Horizontal Scroll
**Solution:** Add `overflow-x-hidden` to parent containers and use `max-w-full` on children.

### Issue: Text Overflow
**Solution:** Use `truncate`, `line-clamp-*`, or `break-words` classes.

### Issue: Small Touch Targets
**Solution:** Ensure minimum 44x44px with `min-h-[44px] min-w-[44px]`.

### Issue: Layout Shift
**Solution:** Define explicit widths/heights for images and use aspect-ratio.

### Issue: Slow Performance
**Solution:** Use `will-change`, GPU acceleration, and lazy loading.
