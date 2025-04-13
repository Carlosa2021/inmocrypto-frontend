// src/app/marketplace/page.tsx
import React from 'react';
import PropertyList from '@/components/properties/PropertyList';

export default function MarketplacePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">🏠 Marketplace Inmobiliario</h1>
      <p className="mt-4">Aquí aparecerán las propiedades listadas.</p>
      <PropertyList />
    </div>
  );
}
