import React from "react";

const EmpresaDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">🏢 Meu Perfil Empresa</h2>
        <p className="text-gray-600">Atualize dados da sua empresa</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">📍 Meus Estabelecimentos</h2>
        <p className="text-gray-600">Gerencie seus pontos turísticos</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">🎟️ Meus Vouchers</h2>
        <p className="text-gray-600">Crie e gerencie vouchers</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">📈 Meu Desempenho</h2>
        <p className="text-gray-600">Visualize estatísticas de vendas</p>
      </div>
    </div>
  );
};

export default EmpresaDashboard;