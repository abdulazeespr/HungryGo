# Lucide Icons Integration

This document explains how to use Lucide icons in the HungryGo frontend application.

## Overview

We've integrated [Lucide React](https://lucide.dev/docs/lucide-react) for icons in our application. Lucide provides a comprehensive set of beautifully designed icons that are perfect for our food delivery platform.

## Usage

### Basic Usage

You can use icons in your components by importing the `Icon` component:

```tsx
import Icon from '@/components/ui/Icon';

function MyComponent() {
  return (
    <div>
      <Icon name="Pizza" size={24} className="text-orange-500" />
      <span>Order Pizza</span>
    </div>
  );
}
```

### Available Props

The `Icon` component accepts the following props:

- `name`: The name of the icon (required)
- `size`: The size of the icon in pixels (default: 24)
- `className`: Additional CSS classes
- `color`: The color of the icon (can also be set via className)
- `strokeWidth`: The stroke width of the icon (default: 2)

Plus any other props that Lucide icons accept.

### Available Icons

You can use any icon from the Lucide library. Some commonly used icons are pre-loaded in our application:

#### Food Related
- Pizza
- Coffee
- Utensils

#### Navigation
- Home
- Search
- ShoppingCart
- User
- Menu

#### Actions
- Plus
- Minus
- X
- Check
- Heart
- Star

#### Miscellaneous
- Clock
- MapPin
- Phone
- Mail

For a complete list of available icons, visit the [Lucide website](https://lucide.dev/icons/).

## Advanced Usage

### Using the Hook

You can also use the `useLucide` hook to access icons directly:

```tsx
import { useLucide } from '@/components/providers/LucideProvider';

function MyComponent() {
  const { icons, getIcon } = useLucide();
  
  // Get a pre-loaded icon
  const PizzaIcon = icons.Pizza;
  
  // Or get any icon by name
  const BurgerIcon = getIcon('Burger');
  
  return (
    <div>
      <PizzaIcon size={24} className="text-orange-500" />
      <BurgerIcon size={24} className="text-brown-600" />
    </div>
  );
}
```

### Adding New Pre-loaded Icons

If you find yourself using certain icons frequently, you can add them to the pre-loaded icons list in the `LucideProvider.tsx` file.

## Troubleshooting

- If an icon doesn't appear, check that the name is correct and matches the Lucide icon name exactly.
- Icon names are case-sensitive and follow PascalCase naming convention.
- If you're getting a warning about an icon not existing, verify the icon name on the Lucide website.