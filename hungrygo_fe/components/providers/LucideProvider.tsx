'use client';

import { LucideProps } from 'lucide-react';
import { ComponentType, createContext, useContext } from 'react';
import * as LucideIcons from 'lucide-react';
import { IconName, getIcon as getIconUtil } from '@/utils/icons';

// Create a context for Lucide icons
type LucideContextType = {
  icons: Record<string, ComponentType<LucideProps>>;
  getIcon: (name: IconName) => ComponentType<LucideProps>;
};

const LucideContext = createContext<LucideContextType>({
  icons: {},
  getIcon: (name: IconName) => getIconUtil(name),
});

// Hook to use Lucide icons
export const useLucide = () => useContext(LucideContext);

export default function LucideProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Pre-load commonly used icons
  const icons: Record<string, ComponentType<LucideProps>> = {
    // Food related icons
    Pizza: LucideIcons.Pizza as unknown as ComponentType<LucideProps>,
    Coffee: LucideIcons.Coffee as unknown as ComponentType<LucideProps>,
    Utensils: LucideIcons.Utensils as unknown as ComponentType<LucideProps>,
    
    // Navigation icons
    Home: LucideIcons.Home as unknown as ComponentType<LucideProps>,
    Search: LucideIcons.Search as unknown as ComponentType<LucideProps>,
    ShoppingCart: LucideIcons.ShoppingCart as unknown as ComponentType<LucideProps>,
    User: LucideIcons.User as unknown as ComponentType<LucideProps>,
    Menu: LucideIcons.Menu as unknown as ComponentType<LucideProps>,
    
    // Action icons
    Plus: LucideIcons.Plus as unknown as ComponentType<LucideProps>,
    Minus: LucideIcons.Minus as unknown as ComponentType<LucideProps>,
    X: LucideIcons.X as unknown as ComponentType<LucideProps>,
    Check: LucideIcons.Check as unknown as ComponentType<LucideProps>,
    Heart: LucideIcons.Heart as unknown as ComponentType<LucideProps>,
    Star: LucideIcons.Star as unknown as ComponentType<LucideProps>,
    
    // Misc icons
    Clock: LucideIcons.Clock as unknown as ComponentType<LucideProps>,
    MapPin: LucideIcons.MapPin as unknown as ComponentType<LucideProps>,
    Phone: LucideIcons.Phone as unknown as ComponentType<LucideProps>,
    Mail: LucideIcons.Mail as unknown as ComponentType<LucideProps>,
  };

  return (
    <LucideContext.Provider value={{ icons, getIcon: getIconUtil }}>
      {children}
    </LucideContext.Provider>
  );
}