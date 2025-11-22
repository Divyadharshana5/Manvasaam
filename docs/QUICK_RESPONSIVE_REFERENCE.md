# Quick Responsive Reference

## Common Patterns (Copy & Paste)

### Page Container
```tsx
<div className="min-h-screen w-full overflow-x-hidden">
  <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
    {/* Your content */}
  </div>
</div>
```

### Page Header
```tsx
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
    <Button variant="outline" size="icon" asChild className="shrink-0">
      <Link href="/back">
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </Button>
    <div className="min-w-0 flex-1">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">Page Title</h1>
      <p className="text-sm text-muted-foreground line-clamp-2">Description</p>
    </div>
  </div>
  <Badge className="shrink-0">Status</Badge>
</div>
```

### Stats Grid
```tsx
<div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Metric</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">Value</div>
      <p className="text-xs text-muted-foreground">Description</p>
    </CardContent>
  </Card>
</div>
```

### Two Column Layout
```tsx
<div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
  {/* Main Content - 2/3 width */}
  <div className="md:col-span-2 space-y-4 md:space-y-6">
    {/* Content */}
  </div>
  
  {/* Sidebar - 1/3 width */}
  <div className="space-y-4 md:space-y-6">
    {/* Sidebar */}
  </div>
</div>
```

### Form Layout
```tsx
<form className="space-y-4">
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="field1" className="text-sm">Label</Label>
      <Input id="field1" className="text-sm" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="field2" className="text-sm">Label</Label>
      <Input id="field2" className="text-sm" />
    </div>
  </div>
  
  <div className="flex flex-col sm:flex-row gap-2">
    <Button type="submit" className="w-full sm:w-auto">Submit</Button>
    <Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button>
  </div>
</form>
```

### List Item
```tsx
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
  <div className="flex items-center gap-3 min-w-0 flex-1">
    <Icon className="h-5 w-5 shrink-0" />
    <div className="min-w-0 flex-1">
      <h3 className="font-semibold text-sm sm:text-base truncate">Title</h3>
      <p className="text-xs sm:text-sm text-muted-foreground truncate">Description</p>
    </div>
  </div>
  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
    <Badge className="text-xs">Status</Badge>
    <Button size="sm" className="w-full sm:w-auto">Action</Button>
  </div>
</div>
```

### Button Group
```tsx
<div className="flex flex-wrap gap-2">
  <Button className="flex-1 sm:flex-none min-w-[120px]">
    <Icon className="h-4 w-4 sm:mr-2" />
    <span className="hidden xs:inline">Full Text</span>
    <span className="xs:hidden">Short</span>
  </Button>
  <Button variant="outline" size="icon" className="shrink-0">
    <Icon className="h-4 w-4" />
  </Button>
</div>
```

### Tab Navigation
```tsx
<div className="flex flex-wrap gap-2 mb-4 md:mb-6">
  <Button
    variant={activeTab === "tab1" ? "default" : "outline"}
    size="sm"
    onClick={() => setActiveTab("tab1")}
    className="flex-1 sm:flex-none min-w-[80px]"
  >
    <Icon className="h-4 w-4 sm:mr-2" />
    <span className="hidden sm:inline">Tab 1</span>
  </Button>
  {/* More tabs */}
</div>
```

### Card with Actions
```tsx
<Card className="w-full">
  <CardHeader className="p-4 md:p-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <CardTitle className="text-lg sm:text-xl">Title</CardTitle>
      <Button size="sm" className="w-full sm:w-auto">Action</Button>
    </div>
  </CardHeader>
  <CardContent className="p-4 md:p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Data Table Wrapper
```tsx
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <div className="inline-block min-w-full align-middle">
    <table className="min-w-full divide-y">
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

### Modal/Dialog
```tsx
<Dialog>
  <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
    <DialogHeader>
      <DialogTitle className="text-lg sm:text-xl">Title</DialogTitle>
      <DialogDescription className="text-sm">Description</DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      {/* Content */}
    </div>
    <DialogFooter className="flex-col sm:flex-row gap-2">
      <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
      <Button className="w-full sm:w-auto">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Quick Tips

### Text Sizing
```tsx
// Headings
text-xl sm:text-2xl lg:text-3xl     // H1
text-lg sm:text-xl                   // H2
text-base sm:text-lg                 // H3

// Body
text-sm sm:text-base                 // Normal text
text-xs sm:text-sm                   // Small text
```

### Spacing
```tsx
// Gaps
gap-2 sm:gap-4 md:gap-6             // Between items
space-y-4 md:space-y-6              // Vertical stack

// Padding
p-4 md:p-6 lg:p-8                   // All sides
px-4 md:px-6                        // Horizontal
py-4 md:py-6                        // Vertical
```

### Widths
```tsx
w-full                              // Full width
w-full sm:w-auto                    // Full on mobile, auto on desktop
max-w-7xl mx-auto                   // Centered with max width
min-w-0                             // Allow shrinking (for truncate)
```

### Flex/Grid
```tsx
// Flex
flex flex-col sm:flex-row           // Stack on mobile, row on desktop
flex-1                              // Grow to fill space
shrink-0                            // Don't shrink

// Grid
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
```

### Visibility
```tsx
hidden sm:block                     // Hide on mobile
block sm:hidden                     // Show only on mobile
hidden sm:inline                    // Inline on desktop
```

### Common Combinations
```tsx
// Truncate text
truncate                            // Single line
line-clamp-2                        // Multiple lines

// Prevent overflow
overflow-x-hidden                   // Horizontal
overflow-y-auto                     // Vertical scroll

// Center content
mx-auto                             // Horizontal center
flex items-center justify-center    // Flex center
```

## Breakpoint Reference
```
xs:  475px   (Large phones)
sm:  640px   (Tablets)
md:  768px   (Small laptops)
lg:  1024px  (Desktops)
xl:  1280px  (Large desktops)
2xl: 1536px  (Ultra-wide)
```

## Performance Classes
```tsx
// GPU acceleration
will-change-transform
gpu-layer

// Lazy loading
loading="lazy"                      // Images

// Touch optimization
touch-target                        // 44x44px minimum
```
