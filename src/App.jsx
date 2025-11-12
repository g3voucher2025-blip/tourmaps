import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Eventos from "./pages/Eventos";
import Login from "./pages/Login";
import Painel from "./pages/Painel";
import RegisterTurista from "./pages/auth/RegisterTurista";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/turista" element={<RegisterTurista />} />
          <Route path="/painel" element={<Painel />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}