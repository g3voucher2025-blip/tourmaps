import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
  // Estilo para o link ativo (usando NavLink)
  const activeLinkStyle = {
    color: '#2563EB', // Um azul para destacar
    fontWeight: 'bold',
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Título do site */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          TourMaps
        </Link>

        {/* Links de Navegação */}
        <div className="flex items-center space-x-6">
          <NavLink 
            to="/" 
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Home
          </NavLink>
          <NavLink 
            to="/eventos" 
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Eventos
          </NavLink>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Cadastre-se
          </Link>
        </div>
      </nav>
    </header>
  );
}