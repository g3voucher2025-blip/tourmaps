import React from "react";

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">👥 Gerenciar Usuários</h2>
        <p className="text-gray-600">Visualize e gerencie todos os usuários do sistema</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">🏢 Gerenciar Empresas</h2>
        <p className="text-gray-600">Controle as empresas cadastradas</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">📊 Relatórios</h2>
        <p className="text-gray-600">Visualize estatísticas do sistema</p>
      </div>
    </div>
  );
};

export default AdminDashboard;