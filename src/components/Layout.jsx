import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function Layout() {
  return (
    <div>
      <NavBar />
      <main>
        {/* O Outlet renderiza o componente da rota filha correspondente */}
        <Outlet />
      </main>
    </div>
  );
}