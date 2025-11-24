# Testing Navigation Speed

## Quick Test Checklist

### ✅ Home Page Load
1. Open home page
2. Check DevTools → Network tab
3. Verify these routes are prefetched:
   - `/login/farmer`
   - `/login/retail`
   - `/login/transport`
4. Should happen within 100ms of page load

### ✅ Navigation Speed
1. Click "Continue" on any role card
2. Time from click to new page visible
3. Should be < 500ms
4. Progress bar should show briefly

### ✅ Mobile Performance
1. Open Chrome DevTools
2. Enable mobile emulation
3. Set throttling to "Fast 3G"
4. Test navigation
5. Should still feel instant

### ✅ Multiple Navigations
1. Navigate Home → Login
2. Go back
3. Navigate again
4. Should be even faster (cached)

## Detailed Performance Testing

### Using Chrome DevTools

#### 1. Network Tab
```
1. Open DevTools (F12)
2. Go to Network tab
3. Load home page
4. Look for prefetch requests:
   - Type: "prefetch"
   - Status: 200
   - Size: (from prefetch cache)
```

#### 2. Performance Tab
```
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Click a role card
5. Stop recording
6. Check metrics:
   - FCP (First Contentful Paint): < 300ms
   - TTI (Time to Interactive): < 500ms
   - Total time: < 600ms
```

#### 3. Lighthouse
```
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Navigation"
4. Run audit
5. Check scores:
   - Performance: > 90
   - Best Practices: > 90
   - Accessibility: > 90
```

### Using Browser Console

#### Measure Navigation Time
```javascript
// Add this to browser console
let startTime;
document.addEventListener('click', (e) => {
  if (e.target.closest('button')) {
    startTime = performance.now();
  }
});

window.addEventListener('load', () => {
  if (startTime) {
    const loadTime = performance.now() - startTime;
    console.log(`Navigation took: ${loadTime.toFixed(0)}ms`);
  }
});
```

#### Check Prefetched Routes
```javascript
// Check what's prefetched
performance.getEntriesByType('navigation').forEach(entry => {
  console.log('Route:', entry.name);
  console.log('Duration:', entry.duration);
});
```

## Expected Results

### Fast Network (WiFi)
- Home page load: 200-400ms
- Navigation: 150-300ms
- Total: 350-700ms

### Slow Network (3G)
- Home page load: 800-1200ms
- Navigation: 300-500ms (prefetched!)
- Total: 1100-1700ms

### Mobile Device
- Home page load: 300-600ms
- Navigation: 200-400ms
- Total: 500-1000ms

## Common Issues

### Issue: Navigation feels slow
**Check:**
- Network tab - are routes prefetched?
- Console - any errors?
- Middleware - is it blocking?

**Fix:**
- Verify prefetch list includes route
- Check NavigationProvider is loaded
- Disable middleware temporarily

### Issue: Progress bar doesn't show
**Check:**
- CSS loaded?
- Z-index conflicts?
- showLoadingState = true?

**Fix:**
- Import navigation-transitions.css
- Check z-index (should be 9999)
- Verify navigateFast options

### Issue: Routes not prefetching
**Check:**
- NavigationProvider in layout?
- Router available?
- Routes valid?

**Fix:**
- Add NavigationProvider to layout
- Check useRouter() works
- Verify route paths

## Comparison Testing

### Before vs After
```
Test the same flow twice:

BEFORE (old code):
1. Clear cache
2. Load home page
3. Click role card
4. Measure time

AFTER (new code):
1. Clear cache
2. Load home page
3. Click role card
4. Measure time

Expected: 60-70% faster
```

## Automated Testing

### Using Playwright
```typescript
import { test, expect } from '@playwright/test';

test('navigation speed', async ({ page }) => {
  await page.goto('/');
  
  // Wait for prefetch
  await page.waitForTimeout(200);
  
  // Measure navigation
  const start = Date.now();
  await page.click('button:has-text("Continue")');
  await page.waitForURL('/login/**');
  const duration = Date.now() - start;
  
  // Should be fast
  expect(duration).toBeLessThan(500);
});
```

### Using Cypress
```javascript
describe('Navigation Speed', () => {
  it('navigates quickly', () => {
    cy.visit('/');
    
    // Measure navigation
    const start = Date.now();
    cy.contains('Continue').click();
    cy.url().should('include', '/login');
    const duration = Date.now() - start;
    
    // Should be fast
    expect(duration).to.be.lessThan(500);
  });
});
```

## Real User Monitoring

### Track Navigation Timing
```typescript
// Add to layout or app component
useEffect(() => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        console.log('Navigation timing:', {
          duration: entry.duration,
          domContentLoaded: entry.domContentLoadedEventEnd,
          loadComplete: entry.loadEventEnd,
        });
        
        // Send to analytics
        // analytics.track('navigation', { duration: entry.duration });
      }
    }
  });
  
  observer.observe({ entryTypes: ['navigation'] });
  
  return () => observer.disconnect();
}, []);
```

## Success Criteria

### Must Have
✅ Navigation < 500ms on fast network
✅ Progress bar shows immediately
✅ No console errors
✅ All routes prefetched
✅ Works on mobile

### Nice to Have
✅ Navigation < 300ms on fast network
✅ Works on slow 3G
✅ Lighthouse score > 90
✅ No layout shift
✅ Smooth animations

## Reporting Issues

If navigation is slow:
1. Record video of the issue
2. Check DevTools Network tab
3. Check DevTools Console
4. Note device/browser/network
5. Share timing measurements
6. Include steps to reproduce
