import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">Acesso Negado</h1>
        <p className="text-gray-600 mb-6">
          Desculpe, você não tem permissão para acessar esta página. Verifique suas credenciais ou entre em contato com o administrador.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ir para Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
