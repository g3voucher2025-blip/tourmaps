import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function Eventos() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodosEventos = async () => {
            try {
                const q = query(collection(db, "eventos"), orderBy("data", "desc"));
                const querySnapshot = await getDocs(q);
                const listaEventos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEventos(listaEventos);
            } catch (err) {
                console.error("Erro ao buscar todos os eventos: ", err);
                setError("Não foi possível carregar os eventos. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchTodosEventos();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Próximos Eventos</h1>

            {loading && <p className="text-center text-lg">Carregando eventos...</p>}
            {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {eventos.length > 0 ? (
                        eventos.map(evento => (
                            <div key={evento.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-xl">
                                {evento.imagemUrl ? (
                                    <img src={evento.imagemUrl} alt={evento.titulo} className="w-full h-56 object-cover" />
                                ) : (
                                    <div className="w-full h-56 bg-gray-300 flex items-center justify-center text-gray-600">Sem imagem</div>
                                )}
                                <div className="p-5">
                                    <h2 className="font-bold text-xl mb-2 truncate">{evento.titulo}</h2>
                                    <p className="text-gray-700 text-base h-12 overflow-hidden">{evento.descricao}</p>
                                    
                                    {/* Exibir Empresa Responsável */}
                                    {evento.empresaNome && (
                                        <p className="text-sm text-blue-600 mt-3 font-semibold">
                                            🏢 Empresa: {evento.empresaNome}
                                        </p>
                                    )}
                                    
                                    {/* Exibir Endereço/Local */}
                                    {evento.localNome && (
                                        <p className="text-sm text-gray-600 mt-2 font-semibold">
                                            📍 Local: {evento.localNome}
                                        </p>
                                    )}
                                    
                                    <p className="text-sm text-gray-600 mt-3 font-semibold">
                                        📅 Data: {new Date(evento.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-xl text-gray-500">Nenhum evento encontrado no momento.</p>
                    )}
                </div>
            )}
        </div>
    );
}