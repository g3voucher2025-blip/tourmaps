import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bem-vindo ao TourMaps
        </h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-8">
          Como você deseja se cadastrar?
        </h2>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          {/* Botão Turista (à esquerda) */}
          <Link 
            to="/register/turista" 
            className="w-full sm:w-auto flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 text-center"
          >
            Sou Turista
          </Link>

          {/* Botão Empresa (à direita) */}
          <Link 
            to="/register/empresa" 
            className="w-full sm:w-auto flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1 text-center"
          >
            Sou Empresa
          </Link>
        </div>
      </div>
    </div>
  );
}