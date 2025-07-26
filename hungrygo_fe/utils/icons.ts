import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { ComponentType } from 'react';

// Type for icon names - exclude non-icon properties
type ExcludedKeys = 'icons' | 'createLucideIcon' | 'createElement';
type IconKeysOnly = Exclude<keyof typeof LucideIcons, ExcludedKeys>;
export type IconName = IconKeysOnly;

// Get all available icon names
export const iconNames = Object.keys(LucideIcons)
  .filter(key => {
    // Filter out non-icon properties
    return !['icons', 'createLucideIcon', 'createElement'].includes(key);
  }) as IconName[];

// Function to get an icon component by name
export const getIcon = (name: IconName): ComponentType<LucideProps> => {
  // Type assertion to handle the complex Lucide icon types
  return LucideIcons[name] as unknown as ComponentType<LucideProps>;
};

// Function to check if an icon exists
export const iconExists = (name: string): name is IconName => {
  return name in LucideIcons && 
    !['icons', 'createLucideIcon', 'createElement'].includes(name);
};