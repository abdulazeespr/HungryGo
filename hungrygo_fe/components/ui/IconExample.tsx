'use client';

import Icon from './Icon';

export default function IconExample() {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Lucide Icons Example</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center">
          <Icon name="Pizza" size={32} className="text-orange-500" />
          <span className="mt-2 text-sm">Pizza</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Icon name="Coffee" size={32} className="text-brown-600" />
          <span className="mt-2 text-sm">Coffee</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Icon name="ShoppingCart" size={32} className="text-blue-500" />
          <span className="mt-2 text-sm">Cart</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Icon name="Heart" size={32} className="text-red-500" />
          <span className="mt-2 text-sm">Favorites</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Icon name="MapPin" size={32} className="text-green-500" />
          <span className="mt-2 text-sm">Location</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Icon name="Clock" size={32} className="text-purple-500" />
          <span className="mt-2 text-sm">Delivery Time</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Icon name="Star" size={32} className="text-yellow-500" />
          <span className="mt-2 text-sm">Rating</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Icon name="User" size={32} className="text-gray-700" />
          <span className="mt-2 text-sm">Profile</span>
        </div>
      </div>
    </div>
  );
}