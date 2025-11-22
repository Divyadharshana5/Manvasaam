# Migration Guide: Making Pages Responsive

This guide helps you update existing pages to be fully responsive.

## Step-by-Step Process

### Step 1: Update Page Container

**Before:**
```tsx
<div className="p-8">
  {/* content */}
</div>
```

**After:**
```tsx
<div className="min-h-screen w-full overflow-x-hidden">
  <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
    {/* content */}
  </div>
</div>
```

### Step 2: Update Page Header

**Before:**
```tsx
<div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold">Title</h1>
  <Button>Action</Button>
</div>
```

**After:**
```tsx
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
    <Button variant="outline" size="icon" asChild className="shrink-0">
      <Link href="/back"><ArrowLeft className="h-4 w-4" /></Link>
    </Button>
    <div className="min-w-0 flex-1">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">Title</h1>
      <p className="text-sm text-muted-foreground line-clamp-2">Description</p>
    </div>
  </div>
  <Button className="w-full sm:w-auto">Action</Button>
</div>
```

### Step 3: Update Grid Layouts

**Before:**
```tsx
<div className="grid grid-cols-4 gap-6">
  {items}
</div>
```

**After:**
```tsx
<div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
  {items}
</div>
```

### Step 4: Update Cards

**Before:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

**After:**
```tsx
<Card className="w-full">
  <CardHeader className="p-4 md:p-6">
    <CardTitle className="text-lg sm:text-xl">Title</CardTitle>
  </CardHeader>
  <CardContent className="p-4 md:p-6">
    {/* content */}
  </CardContent>
</Card>
```

### Step 5: Update Forms

**Before:**
```tsx
<div className="grid grid-cols-2 gap-4">
  <Input />
  <Input />
</div>
<Button>Submit</Button>
```

**After:**
```tsx
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
  <div className="space-y-2">
    <Label className="text-sm">Label</Label>
    <Input className="text-sm" />
  </div>
  <div className="space-y-2">
    <Label className="text-sm">Label</Label>
    <Input className="text-sm" />
  </div>
</div>
<Button className="w-full sm:w-auto">Submit</Button>
```

### Step 6: Update Lists

**Before:**
```tsx
<div className="flex items-center justify-between p-4 border">
  <div>
    <h3>Title</h3>
    <p>Description</p>
  </div>
  <Button>Action</Button>
</div>
```

**After:**
```tsx
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
  <div className="min-w-0 flex-1">
    <h3 className="font-semibold text-sm sm:text-base truncate">Title</h3>
    <p className="text-xs sm:text-sm text-muted-foreground truncate">Description</p>
  </div>
  <Button size="sm" className="w-full sm:w-auto">Action</Button>
</div>
```

### Step 7: Update Button Groups

**Before:**
```tsx
<div className="flex gap-2">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```

**After:**
```tsx
<div className="flex flex-wrap gap-2">
  <Button className="flex-1 sm:flex-none min-w-[120px]">
    <Icon className="h-4 w-4 sm:mr-2" />
    <span className="hidden xs:inline">Action 1</span>
    <span className="xs:hidden">Act 1</span>
  </Button>
  <Button variant="outline" className="flex-1 sm:flex-none">Action 2</Button>
</div>
```

### Step 8: Update Tables

**Before:**
```tsx
<table>
  <thead>
    <tr><th>Column</th></tr>
  </thead>
  <tbody>
    <tr><td>Data</td></tr>
  </tbody>
</table>
```

**After:**
```tsx
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <div className="inline-block min-w-full align-middle">
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-3 py-2 text-left text-xs sm:text-sm">Column</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-3 py-2 text-xs sm:text-sm">Data</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## Common Patterns

### Pattern 1: Responsive Spacing
```tsx
// Replace fixed spacing with responsive
gap-6          → gap-3 sm:gap-4 md:gap-6
p-8            → p-4 md:p-6 lg:p-8
space-y-6      → space-y-4 md:space-y-6
```

### Pattern 2: Responsive Text
```tsx
// Replace fixed text sizes with responsive
text-3xl       → text-xl sm:text-2xl lg:text-3xl
text-base      → text-sm sm:text-base
font-bold      → font-semibold text-sm sm:text-base sm:font-bold
```

### Pattern 3: Responsive Widths
```tsx
// Replace fixed widths with responsive
w-64           → w-full sm:w-64
max-w-5xl      → max-w-7xl
min-w-32       → min-w-[120px]
```

### Pattern 4: Flex Direction
```tsx
// Stack on mobile, row on desktop
flex           → flex flex-col sm:flex-row
```

### Pattern 5: Grid Columns
```tsx
// Progressive column increase
grid-cols-4    → grid-cols-1 xs:grid-cols-2 lg:grid-cols-4
grid-cols-3    → grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
grid-cols-2    → grid-cols-1 sm:grid-cols-2
```

## Checklist for Each Page

- [ ] Page container has overflow-x-hidden
- [ ] Max-width is set (usually max-w-7xl)
- [ ] Padding is responsive (p-4 md:p-6 lg:p-8)
- [ ] Header stacks on mobile
- [ ] Title truncates if too long
- [ ] Grids adapt to screen size
- [ ] Forms stack on mobile
- [ ] Buttons are full-width on mobile (where appropriate)
- [ ] Text sizes are responsive
- [ ] Spacing is responsive
- [ ] Tables scroll horizontally on mobile
- [ ] Images are responsive
- [ ] No horizontal scroll on any screen size
- [ ] Touch targets are at least 44x44px
- [ ] Input fields don't trigger zoom on iOS

## Testing Each Page

### 1. Visual Testing
```bash
# Open in browser
npm run dev

# Test at these widths:
# - 375px (iPhone SE)
# - 390px (iPhone 12/13)
# - 768px (iPad)
# - 1024px (Desktop)
# - 1920px (Large Desktop)
```

### 2. Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on various device presets
4. Check for horizontal scroll
5. Verify touch target sizes

### 3. Real Device Testing
Test on actual devices when possible:
- Small phone (< 375px)
- Large phone (390px - 430px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## Common Issues & Fixes

### Issue: Horizontal Scroll
**Fix:**
```tsx
// Add to parent container
className="overflow-x-hidden w-full"

// Ensure children don't overflow
className="max-w-full"
```

### Issue: Text Overflow
**Fix:**
```tsx
// Single line
className="truncate"

// Multiple lines
className="line-clamp-2"

// Break long words
className="break-words"
```

### Issue: Small Touch Targets
**Fix:**
```tsx
// Ensure minimum size
className="min-h-[44px] min-w-[44px]"
```

### Issue: Layout Breaks on Mobile
**Fix:**
```tsx
// Stack instead of row
className="flex flex-col sm:flex-row"

// Reduce columns
className="grid-cols-1 sm:grid-cols-2"
```

### Issue: Buttons Too Small on Mobile
**Fix:**
```tsx
// Full width on mobile
className="w-full sm:w-auto"

// Larger padding
className="px-6 py-3"
```

## Performance Considerations

### 1. Lazy Load Images
```tsx
<img loading="lazy" src="..." alt="..." />
```

### 2. Use Appropriate Image Sizes
```tsx
// Mobile
<img src="image-small.jpg" className="sm:hidden" />
// Desktop
<img src="image-large.jpg" className="hidden sm:block" />
```

### 3. Minimize Layout Shifts
```tsx
// Set explicit dimensions
<img width={400} height={300} src="..." />

// Use aspect-ratio
className="aspect-video"
```

### 4. Optimize Animations
```tsx
// Use GPU acceleration
className="will-change-transform"

// Reduce motion for accessibility
@media (prefers-reduced-motion: reduce) {
  animation: none;
}
```

## Resources

- [Responsive Guide](./RESPONSIVE_GUIDE.md)
- [Quick Reference](./QUICK_RESPONSIVE_REFERENCE.md)
- [Example Pages](../src/app/dashboard/)

## Need Help?

1. Check existing responsive pages for examples
2. Use the Quick Reference for copy-paste patterns
3. Test on multiple devices before committing
4. Ask for code review if unsure
