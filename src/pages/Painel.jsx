import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from 'firebase/firestore';

// --- Componente para o formulário de evento ---
const FormularioEvento = ({ empresaId, empresaNome }) => {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [data, setData] = useState('');
    const [localNome, setLocalNome] = useState('');
    const [imagem, setImagem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImagem(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!titulo || !data || !imagem) {
            setError('Título, Data e Imagem do evento são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', imagem);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error?.message || 'Falha no upload da imagem.');
            }
            
            const imagemUrl = result.data.url;

            await addDoc(collection(db, 'eventos'), {
                titulo,
                descricao,
                data,
                localNome,
                imagemUrl,
                empresaNome: empresaNome || 'Empresa',
                createdBy: empresaId,
                createdAt: serverTimestamp()
            });

            setSuccess('Evento adicionado com sucesso! Você pode adicionar outro.');
            setTitulo('');
            setDescricao('');
            setData('');
            setLocalNome('');
            setImagem(null);
            e.target.reset();

        } catch (err) {
            setError(err.message || 'Erro ao adicionar o evento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">Adicionar Novo Evento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                
                <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título do Evento" className="w-full px-4 py-2 border rounded-lg" required />
                <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição do Evento" className="w-full px-4 py-2 border rounded-lg"></textarea>
                <input type="text" value={localNome} onChange={e => setLocalNome(e.target.value)} placeholder="Local do Evento" className="w-full px-4 py-2 border rounded-lg" />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora do Evento</label>
                    <input type="datetime-local" value={data} onChange={e => setData(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Evento</label>
                    <input type="file" onChange={handleImageChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                </div>
                
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Adicionando...' : 'Adicionar Evento'}
                </button>
            </form>
        </div>
    );
};

// --- Componente principal do Painel ---
export default function Painel() {
    const { currentUser, loading: authLoading } = useAuth();
    const [meusEventos, setMeusEventos] = useState([]);
    const [loadingEventos, setLoadingEventos] = useState(true);

    useEffect(() => {
        const fetchEventos = async () => {
            if (!authLoading && currentUser) {
                try {
                    const q = query(collection(db, "eventos"), where("createdBy", "==", currentUser.uid), orderBy("data", "desc"));
                    const querySnapshot = await getDocs(q);
                    const eventosDaEmpresa = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMeusEventos(eventosDaEmpresa);
                } catch (error) {
                    console.error("Erro ao buscar eventos do painel: ", error);
                } finally {
                    setLoadingEventos(false);
                }
            } else if (!authLoading) {
                setLoadingEventos(false);
            }
        };

        fetchEventos();
    }, [currentUser, authLoading]);

    if (authLoading) {
        return <div className="text-center p-10">Carregando dados do usuário...</div>;
    }

    if (!currentUser) {
        return <div className="text-center p-10">Usuário não encontrado. Por favor, faça login.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Painel da Empresa</h1>
            <p className="text-lg mb-6">Bem-vindo(a), {currentUser.displayName || currentUser.email}!</p>
            
            <FormularioEvento empresaId={currentUser.uid} empresaNome={currentUser.nomeEmpresa || currentUser.displayName} />

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Meus Eventos Cadastrados</h2>
                {loadingEventos ? (
                    <p>Carregando seus eventos...</p>
                ) : meusEventos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {meusEventos.map(evento => (
                            <div key={evento.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
                                <img src={evento.imagemUrl} alt={evento.titulo} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h4 className="font-bold text-lg truncate">{evento.titulo}</h4>
                                    <p className="text-gray-600 text-sm mt-1 h-10 overflow-hidden">{evento.descricao}</p>
                                    <p className="text-sm text-gray-500 mt-2 font-medium">Data: {new Date(evento.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Você ainda não cadastrou nenhum evento.</p>
                )}
            </div>
        </div>
    );
}