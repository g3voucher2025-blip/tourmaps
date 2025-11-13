# 🏗️ ARQUITETURA DO PROJETO - TourMaps

## Estrutura de Pastas

```
tourmaps/
├── src/
│   ├── config/
│   │   └── firebase.jsx              ✅ Config Firebase com defensive validation
│   │
│   ├── context/
│   │   ├── AuthContext.jsx           ✅ Provider de autenticação global
│   │   ├── AuthContextDef.js         ✅ Definição do contexto
│   │   └── useAuth.js                ✅ Custom hook para useContext
│   │
│   ├── services/
│   │   ├── authService.jsx           ✅ Login, Register, Delete, Update profile
│   │   └── reviewService.jsx         ✅ CRUD de reviews com queries corretas
│   │
│   ├── Components/
│   │   ├── Layout.jsx                ✅ Wrapper com Navbar + Outlet
│   │   ├── MapView.jsx               ✅ Componente Leaflet
│   │   ├── NavBar.jsx                ✅ Navbar com auth state
│   │   ├── ProtectedRoute.jsx        ✅ Guard com role-based access
│   │   ├── ReviewForm.jsx            ✅ Form para avaliações
│   │   ├── ReviewList.jsx            ✅ Lista de avaliações
│   │
│   ├── pages/
│   │   ├── Home.jsx                  ✅ Landing com mapa + eventos próximos
│   │   ├── Eventos.jsx               ✅ Lista completa de eventos
│   │   ├── Painel.jsx                ✅ Admin panel para criar eventos (empresa)
│   │   ├── Perfil.jsx                ✅ Editar perfil + deletar conta
│   │   ├── Login.jsx                 ✅ Login com redirect inteligente
│   │   ├── Register.jsx              ✅ Seletor de tipo (turista/empresa)
│   │   ├── Unauthorized.jsx          ✅ 403 page amigável
│   │   ├── auth/
│   │   │   ├── RegisterTurista.jsx   ✅ Form registro turista
│   │   │   └── RegisterEmpresa.jsx   ✅ Form registro empresa
│   │   └── dashboards/               ❌ Não implementado (futuro)
│   │
│   ├── Data/
│   │   ├── events.json               ✅ Mock events (temp, Firestore real em prod)
│   │   └── places.json               ✅ Mock places (temp, Firestore real em prod)
│   │
│   ├── css/
│   │   └── style.css                 ✅ Estilos customizados (mapa, cards)
│   │
│   ├── App.jsx                       ✅ Routes config com ProtectedRoute
│   ├── main.jsx                      ✅ Entry point
│   └── index.css                     ✅ Global styles
│
├── public/                            (assets estáticos)
├── .env.local.example                 ✅ Template de env vars
├── .env.local                         ❌ (local, não commitado)
├── .gitignore                         ✅ Exclui .env.local, node_modules
├── vite.config.js                     ✅ Config Vite com React plugin
├── eslint.config.js                   ✅ ESLint rules
├── tailwind.config.js                 ✅ Tailwind customization
├── postcss.config.cjs                 ✅ PostCSS para Tailwind
├── package.json                       ✅ Dependencies e scripts
│
├── RELATORIO_FINAL.md                 📄 Este projeto (status detalhado)
├── TESTE_COMPLETO.md                  📄 Plano de testes
└── GUIA_TESTES.md                     📄 Guia prático de testes
```

---

## 🔄 Fluxo de Dados - Autenticação

```
┌─────────────────────────────────────────────┐
│ 1. Usuário abre aplicação                   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 2. AuthContext monta                        │
│    onAuthStateChanged listener ativa        │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   ┌─────────┐   ┌──────────┐
   │ User    │   │ No user  │
   │ logado  │   │ (logout) │
   └────┬────┘   └─────┬────┘
        │              │
        ▼              ▼
   ┌────────────────────────────┐
   │ Buscar em empresas OR users│
   │ Definir role                │
   └────┬───────────────────────┘
        │
        ▼
   ┌────────────────────────┐
   │ setCurrentUser({       │
   │   uid, role, email...  │
   │ })                     │
   └────┬───────────────────┘
        │
        ▼
   ┌────────────────────────┐
   │ setLoading(false)      │
   │ Renderizar children    │
   └────────────────────────┘
```

---

## 🛡️ Fluxo de Rotas - ProtectedRoute

```
User tenta acessar /painel
         │
         ▼
┌─────────────────────┐
│ ProtectedRoute      │
│ - loading?          │
└────────┬────────────┘
         │
    ┌────┴─────┐
    │YES→loading│ "Carregando..."
    │           │
    │NO         │
    └─────┬─────┘
          │
          ▼
┌──────────────────────┐
│ !currentUser?        │
├──────────────────────┤
│ YES → Navigate /login│
└──────────────────────┘
          │NO
          ▼
┌────────────────────────────┐
│ allowedRoles &&            │
│ !allowedRoles.includes(    │
│   userProfile?.role)       │
├────────────────────────────┤
│ YES → Navigate /unauthorized
└────────────────────────────┘
          │NO
          ▼
     ┌─────────┐
     │ Renderizar
     │ children
     └─────────┘
```

---

## 📱 Stack Tecnológico

| Camada | Tecnologia | Versão | Uso |
|--------|-----------|--------|-----|
| **Frontend** | React | 19.2.0 | UI components |
| | React Router | 7.9.5 | Client routing |
| | Vite | 7.2.2 | Build & dev server |
| | Tailwind CSS | 4.1.17 | Styling |
| | Leaflet | ~1.9 | Mapa interativo |
| **Backend** | Firebase Auth | - | Autenticação |
| | Firebase Firestore | - | Database |
| | ImgBB API | - | Image hosting |
| **Dev Tools** | ESLint | - | Linting |
| | PostCSS | - | CSS processing |
| | Node.js | 18+ | Runtime |

---

## 🔐 Modelo de Dados

### Collection: `users` (Turistas)
```json
{
  "uid": "turista123",
  "email": "joao@test.com",
  "displayName": "João Silva",
  "nome": "João",
  "sobrenome": "Silva",
  "dataNascimento": "1990-01-01",
  "createdAt": "2025-11-12T10:00:00Z"
}
```

### Collection: `empresas` (Empresas)
```json
{
  "uid": "empresa123",
  "email": "empresa@test.com",
  "displayName": "Restaurant XYZ",
  "nomeEmpresa": "Restaurant XYZ",
  "cnpj": "12345678000190",
  "descricao": "Restaurante com comida típica",
  "ratingsCount": 5,
  "ratingsSum": 22,
  "avgRating": 4.4,
  "createdAt": "2025-11-12T10:00:00Z"
}
```

### Collection: `eventos` (Eventos criados por empresas)
```json
{
  "id": "evento123",
  "titulo": "Festival Gastronômico",
  "descricao": "Comidas típicas e música ao vivo",
  "data": "2025-11-15T18:00:00",
  "localNome": "Praia Central",
  "imagemUrl": "https://imgbb.com/...",
  "empresaNome": "Restaurant XYZ",
  "createdBy": "empresa123",
  "createdAt": "2025-11-12T10:00:00Z"
}
```

### Collection: `reviews` (Avaliações de pontos turísticos)
```json
{
  "id": "ponto123_turista123",
  "placeId": "ponto123",
  "userId": "turista123",
  "userDisplayName": "João Silva",
  "rating": 4.5,
  "comment": "Lugar incrível!",
  "createdAt": "2025-11-12T10:00:00Z",
  "updatedAt": "2025-11-12T10:00:00Z"
}
```

---

## 🔌 Environment Variables (.env.local)

```bash
# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Image hosting
VITE_IMGBB_API_KEY=...
```

---

## 📊 Componentes Principais

### AuthContext.jsx
```javascript
// Fornece global user state
<AuthProvider>
  - currentUser: { uid, email, role, ...}
  - loading: boolean
  
useAuth() // hook para usar em qualquer componente
```

### ProtectedRoute.jsx
```javascript
// Guard para rotas privadas
<ProtectedRoute allowedRoles={['empresa']}>
  <Painel />
</ProtectedRoute>

// Se não autenticado → /login
// Se role inválido → /unauthorized
```

### Layout.jsx
```javascript
// Wrapper com Navbar
<Layout>
  <NavBar /> // navbar sempre visível
  <Outlet /> // páginas renderizam aqui
</Layout>
```

---

## 🎯 Rotas da Aplicação

| Rota | Componente | Auth | Role | Descrição |
|------|-----------|------|------|-----------|
| `/` | Home | Pública | - | Landing com mapa |
| `/eventos` | Eventos | Pública | - | Lista todos eventos |
| `/login` | Login | Pública | - | Autenticação |
| `/register` | Register | Pública | - | Seletor turista/empresa |
| `/register/turista` | RegisterTurista | Pública | - | Form turista |
| `/register/empresa` | RegisterEmpresa | Pública | - | Form empresa |
| `/perfil` | Perfil | Privada | turista\|empresa | Editar perfil |
| `/painel` | Painel | Privada | empresa | Admin eventos |
| `/unauthorized` | Unauthorized | Pública | - | Acesso negado |

---

## 🚀 Scripts Disponíveis

```bash
npm run dev      # Iniciar servidor desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview build local
npm run lint     # Executar ESLint
```

---

## 📈 Performance & Build

```
Build Output:
- 80 modules transformados
- HTML: 0.47 kB (gzip: 0.30 kB)
- CSS: 23.20 kB (gzip: 8.72 kB)
- JS: 759.95 kB (gzip: 232.90 kB)
- Build time: ~4.4s

Lint:
- 0 errors
- 0 warnings

Recomendações:
- Implementar code splitting para reduzir JS bundle
- Lazy load componentes de dashboard
- Usar dynamic imports para Home.jsx
```

---

## 🔄 CI/CD Pipeline (Recomendado)

```
Code Push → GitHub
    ↓
ESLint (npm run lint)
    ↓
Build (npm run build)
    ↓
Deploy to Firebase Hosting
    ↓
Site ao vivo
```

---

## 📚 Referências de Código

### Login com redirecionamento inteligente:
```javascript
const handleSubmit = async (e) => {
  await loginUser(email, password);
  setTimeout(() => {
    if (currentUser?.role === 'empresa') {
      navigate("/painel");
    } else {
      navigate("/");
    }
  }, 500);
};
```

### Criar evento com empresaNome:
```javascript
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
```

### Query com deletar cascade:
```javascript
const q = query(eventosRef, where("createdBy", "==", uid));
const querySnapshot = await getDocs(q);
const batch = writeBatch(db);
querySnapshot.forEach((doc) => {
  batch.delete(doc.ref);
});
await batch.commit();
```

---

**Última atualização**: 12/11/2025  
**Versão**: 1.0.0
