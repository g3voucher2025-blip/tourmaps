import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerEmpresa } from "../../services/authService";

export default function RegisterEmpresa() {
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    latitude: '',
    longitude: '',
    categoria: '',
    descricao: '',
    nomeResponsavel: '',
    password: '',
    confirmPassword: '',
    isRegistered: 'false',
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if(!formData.categoria){
        setError("Por favor, selecione uma categoria.");
        return;
    }
    
    setLoading(true);

    try {
      const { password, confirmPassword, ...additionalData } = formData;
      
      // Verify passwords match using destructured values
      if (password !== confirmPassword) {
        throw new Error("As senhas não coincidem");
      }
      
      additionalData.isRegistered = formData.isRegistered === 'true'; 
      additionalData.localizacao = {
          lat: parseFloat(formData.latitude || 0),
          long: parseFloat(formData.longitude || 0)
      };
      delete additionalData.latitude; 
      delete additionalData.longitude;

      await registerEmpresa(formData.email, password, additionalData);

      // --- INÍCIO DA ALTERAÇÃO ---
      // Redireciona imediatamente para a página inicial após o sucesso.
      navigate("/");
      // --- FIM DA ALTERAÇÃO ---

    } catch (err) {
      setLoading(false);
      if (err.code === "auth/email-already-in-use") {
        setError("Este email já está cadastrado.");
      } else if (err.code === "auth/invalid-email") {
        setError("O formato do email é inválido.");
      } else {
        setError(err.message || "Ocorreu um erro ao cadastrar.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-xl font-semibold text-center text-gray-600 mb-6">
          Cadastro de Empresa
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="nomeEmpresa" value={formData.nomeEmpresa} onChange={handleChange} placeholder="Nome da Empresa *" required className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ *" required className="w-full px-4 py-2 border rounded-lg" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" required className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" name="nomeResponsavel" value={formData.nomeResponsavel} onChange={handleChange} placeholder="Nome do Responsável *" required className="w-full px-4 py-2 border rounded-lg" />
          <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Telefone *" required className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" name="cep" value={formData.cep} onChange={handleChange} placeholder="CEP *" required className="w-full px-4 py-2 border rounded-lg" />
          
          <select name="categoria" value={formData.categoria} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg text-gray-500">
            <option value="" disabled>Selecione uma Categoria *</option>
            <option value="restaurante">Restaurante</option>
            <option value="hotel">Hotel</option>
            <option value="ponto_turistico">Ponto Turístico</option>
            <option value="agencia_viagem">Agência de Viagem</option>
            <option value="outro">Outro</option>
          </select>
          
          <div className="p-2 border border-gray-200 rounded-lg">
            <p className="block text-sm font-medium text-gray-700 mb-2">Já possui CADASTUR?</p>
            <div className="flex items-center gap-x-6">
              <label className="flex items-center gap-x-2">
                <input type="radio" name="isRegistered" value="true" checked={formData.isRegistered === 'true'} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600" />
                <span>Sim</span>
              </label>
              <label className="flex items-center gap-x-2">
                <input type="radio" name="isRegistered" value="false" checked={formData.isRegistered === 'false'} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600" />
                <span>Não</span>
              </label>
            </div>
          </div>
          
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Senha *" required className="w-full px-4 py-2 border rounded-lg" />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirme a Senha *" required className="w-full px-4 py-2 border rounded-lg" />
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
}