# BuiltWithShipSafe

Attribution badge component linking to ShipSafe.st, typically used in footers.

**Location:** `src/components/ui/BuiltWithShipSafe.tsx`

## Overview

The BuiltWithShipSafe component is an attribution badge that displays "Built with ShipSafe" text along with the ShipSafe logo. It links to the ShipSafe.st website and is commonly used in footer sections. This component helps give credit to the boilerplate while providing a link back to the main ShipSafe website.

**💡 Affiliate Link Opportunity:** This component is perfect for adding your ShipSafe affiliate link! Simply replace the default URL with your affiliate link to earn commissions when users click through. This provides a win-win: you get credit for using the boilerplate, and you can monetize the attribution badge.

## Quick Customization

This component is simple but customizable:
- **Link URL** - Currently links to `https://shipsafe.st` (replace with your affiliate link!)
- **Styling** - Badge-style design with hover effects
- **Logo** - Uses `/_shipsafe-logo-w.png` from public folder
- **Layout** - Text + Logo + Brand name layout

**💡 Pro Tip:** Replace the default URL with your ShipSafe affiliate link to monetize this attribution badge while giving credit to the boilerplate.

## Usage

```tsx
import BuiltWithShipSafe from "@/components/ui/BuiltWithShipSafe";

<BuiltWithShipSafe />
```

## Props

This component accepts no props. It's a simple presentational component.

## Examples

### Basic Usage

```tsx
import BuiltWithShipSafe from "@/components/ui/BuiltWithShipSafe";

// In footer
<BuiltWithShipSafe />
```

### Common Use Cases

```tsx
// Footer attribution
<footer>
  <div className="flex items-center justify-between">
    <p>© 2025 My App</p>
    <BuiltWithShipSafe />
  </div>
</footer>

// With custom spacing
<div className="mt-8">
  <BuiltWithShipSafe />
</div>
```

## Component Structure

```tsx
const BuiltWithShipSafe = () => {
  return (
    <Link href="https://shipsafe.st" target="_blank" rel="noopener noreferrer">
      {/* "Built with" text */}
      {/* ShipSafe logo icon */}
      {/* "ShipSafe" brand name */}
    </Link>
  );
};
```

**Elements:**
- **Text:** "Built with" (subtle gray text)
- **Logo:** Small ShipSafe logo icon (`/_shipsafe-logo-w.png`)
- **Brand name:** "ShipSafe" (bold text)
- **Link:** Opens `https://shipsafe.st` in new tab

## Styling Notes

- **Badge style:** Rounded border with subtle background (`bg-base-100/50`)
- **Hover effects:** Border and text color change on hover
- **Size:** Compact badge design
- **Layout:** Horizontal flex layout with gaps
- **Responsive:** Adapts to container size

## Customization

To customize the component, edit `BuiltWithShipSafe.tsx` directly:

```tsx
// Add your affiliate link (recommended!)
<Link href="https://shipsafe.st?ref=YOUR_AFFILIATE_ID">
// Or use your full affiliate URL
<Link href="https://your-affiliate-link.com">
```

**💡 Affiliate Link Setup:**
1. Get your ShipSafe affiliate link from the affiliate program
2. Replace the default URL in the component with your affiliate link
3. Earn commissions when users click through to ShipSafe.st
4. Keep the attribution while monetizing the badge

## Best Practices

1. **Footer placement** - Typically placed in footer sections
2. **Keep it for affiliate income** - Add your affiliate link to monetize the badge
3. **Consistent placement** - Use in consistent location across pages
4. **Respect attribution** - Keep attribution while earning commissions
5. **Styling** - Badge design ensures it's visible but not intrusive

**💡 Why Keep It:**
- Earn affiliate commissions when users click through
- Give credit to the boilerplate (good practice)
- Minimal visual impact, maximum value
- Easy to customize with your affiliate link

## Tips

- **Footer:** Usually placed in footer bottom right or center
- **Affiliate Link:** Add your affiliate link to earn commissions - don't remove it!
- **Customization:** Easy to modify if you want different text/logo
- **Accessibility:** Opens in new tab with proper `rel` attributes
- **Monetization:** This badge can generate passive income through affiliate commissions

## Learn More

- [Footer Component](../templates/footer) - Uses BuiltWithShipSafe
- [Logo Component](./logo) - Similar logo display component
- [UI Components Overview](../overview) - All available UI components
