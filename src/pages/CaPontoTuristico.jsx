import React, { useState, useEffect } from "react";

const PlaceForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    categoria: "",
    cep: "",
    isRegistered: false,
    descricao: "",
    rating: "",
  });

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("places");
    if (saved) setPlaces(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.categoria || !formData.cep) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    const newPlace = {
      ...formData,
      id: parseInt(formData.id),
      rating: parseFloat(formData.rating) || 0,
    };

    const updatedPlaces = [...places, newPlace];
    setPlaces(updatedPlaces);
    localStorage.setItem("places", JSON.stringify(updatedPlaces));

    alert("Local cadastrado com sucesso!");

    setFormData({
      id: "",
      nome: "",
      categoria: "",
      cep: "",
      isRegistered: false,
      descricao: "",
      rating: "",
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Locais</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md"
      >
        <div className="mb-3">
          <label className="block font-semibold mb-1">ID</label>
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Categoria</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Ex: Restaurante, Cultura..."
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">CEP</label>
          <input
            type="text"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Ex: 12345-678"
            required
          />
        </div>

        <div className="mb-3 flex items-center gap-2">
          <input
            type="checkbox"
            name="isRegistered"
            checked={formData.isRegistered}
            onChange={handleChange}
          />
          <label className="font-semibold">Está Registrado?</label>
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Descrição</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows="3"
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Rating (0 a 5)</label>
          <input
            type="number"
            step="0.1"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            min="0"
            max="5"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Cadastrar
        </button>
      </form>

      {places.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-xl font-bold mb-2">Locais Cadastrados</h2>
          <ul className="bg-white shadow rounded-lg divide-y">
            {places.map((p) => (
              <li key={p.id} className="p-3">
                <strong>{p.nome}</strong> — {p.categoria} ({p.cep})  
                <br />
                ⭐ {p.rating} |{" "}
                {p.isRegistered ? "Registrado" : "Não registrado"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlaceForm;
