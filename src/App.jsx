import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Eventos from "./pages/Eventos";
import Login from "./pages/Login";
import Painel from "./pages/Painel";
import Register from "./pages/Register";
import RegisterTurista from "./pages/auth/RegisterTurista";
import RegisterEmpresa from "./pages/auth/RegisterEmpresa";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 2. Crie uma rota pai com o componente Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/painel" element={<Painel />} />

            {/* 2. Adicione a rota principal de registro */}
            <Route path="/register" element={<Register />} />

            {/* Rotas de Registro */}
            <Route path="/register/turista" element={<RegisterTurista />} />
            <Route path="/register/empresa" element={<RegisterEmpresa />} /> {/* 2. Adicione a rota */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}