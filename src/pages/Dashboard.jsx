import React from "react";
import { useAuth } from "../context/useAuth";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./dashboards/AdminDashboard";
import TuristaDashboard from "./dashboards/TuristaDashboard";
import EmpresaDashboard from "./dashboards/EmpresaDashboard";

export const Dashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  if (!userProfile) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  const renderDashboard = () => {
    switch (userProfile.role) {
      case "admin":
        return <AdminDashboard />;
      case "turista":
        return <TuristaDashboard />;
      case "empresa":
        return <EmpresaDashboard />;
      default:
        return <div>Perfil desconhecido</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TourMaps</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            Bem-vindo, {userProfile.name} ({userProfile.role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </nav>

      <div className="p-6">
        {renderDashboard()}
      </div>
    </div>
  );
};