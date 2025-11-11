import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Eventos from "./pages/Eventos";
import Login from "./pages/Login";
import Painel from "./pages/Painel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/painel" element={<Painel />} />
      </Routes>
    </BrowserRouter>
  );
}
