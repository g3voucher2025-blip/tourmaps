import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { logoutUser } from '../services/authService';

export default function NavBar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const activeLinkStyle = {
    color: '#2563EB',
    fontWeight: 'bold',
  };

  const getShortName = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.split(' ');
    return nameParts.slice(0, 2).join(' ');
  };

  // --- LÓGICA DE EXIBIÇÃO SIMPLIFICADA (NOVA) ---
  const displayName = currentUser
    ? getShortName(currentUser.displayName) || currentUser.email
    : '';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          TourMaps
        </Link>

        <div className="flex items-center space-x-6">
          <NavLink to="/" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-600 hover:text-blue-600 transition">
            Home
          </NavLink>
          <NavLink to="/eventos" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-600 hover:text-blue-600 transition">
            Eventos
          </NavLink>
          {currentUser?.role === 'empresa' && (
            <NavLink to="/painel" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-600 hover:text-blue-600 transition">
              Meu Painel
            </NavLink>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span className="text-gray-700">
                Olá, <Link to="/perfil" className="font-semibold hover:text-blue-600">{displayName}</Link>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}