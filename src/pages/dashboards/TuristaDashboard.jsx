import React from "react";

const TuristaDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">🗺️ Explorar Destinos</h2>
        <p className="text-gray-600">Descubra novos lugares e roteiros turísticos</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">❤️ Meus Favoritos</h2>
        <p className="text-gray-600">Veja seus destinos salvos</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">📅 Minhas Reservas</h2>
        <p className="text-gray-600">Gerencie suas reservas e passeios</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">💳 Meus Vouchers</h2>
        <p className="text-gray-600">Visualize seus vouchers ativos</p>
      </div>
    </div>
  );
};

export default TuristaDashboard;