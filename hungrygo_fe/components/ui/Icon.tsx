'use client';

import { LucideProps } from 'lucide-react';
import { ComponentType } from 'react';
import { useLucide } from '../providers/LucideProvider';
import { IconName, iconExists } from '@/utils/icons';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName | string;
  size?: number | string;
  className?: string;
}

export default function Icon({ name, size = 24, className = '', ...props }: IconProps) {
  const { icons, getIcon } = useLucide();
  
  // Check if the icon name is valid
  if (!iconExists(name as string)) {
    console.warn(`Icon "${name}" does not exist in Lucide icons`);
    return null;
  }
  
  // Get the icon component
  const IconComponent = 
    (icons[name as string] as ComponentType<LucideProps>) || 
    getIcon(name as IconName);
  
  return (
    <IconComponent
      size={size}
      className={className}
      {...props}
    />
  );
}