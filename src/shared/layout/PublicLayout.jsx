import React from 'react';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="public-wrapper">
      {/* Any global public elements like a Header or Background go here */}
      
      <main>
        {/* THIS IS THE MISSING PIECE */}
        <Outlet /> 
      </main>

      {/* Global Footer */}
    </div>
  );
}