# 🚀 GUIA RÁPIDO DE TESTES LOCAIS - TourMaps

## 1️⃣ Preparação do Ambiente

```bash
# Navegar para projeto
cd "c:\Users\Maik Rodrigues\Documents\T2\tourmaps"

# Instalar dependências (se necessário)
npm install

# Criar/validar .env.local com credenciais Firebase
# Copiar de .env.local.example e preencher:
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_IMGBB_API_KEY=...
```

## 2️⃣ Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Saída esperada:
```
  VITE v7.2.2  ready in XXXms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Abrir navegador em: **http://localhost:5173/**

## 3️⃣ Testes Rápidos (5 minutos)

### ✅ Teste 1: Home Page
- [ ] Página carrega sem erros (F12 → Console)
- [ ] Mapa carrega com marcadores
- [ ] Seção "Próximos eventos" visível
- [ ] Botões funcionam: Eventos, Cadastre-se, Login

### ✅ Teste 2: Registro
- [ ] Clicar "Cadastre-se"
- [ ] Selecionar "Registrar como Turista"
- [ ] Preencher form: 
  - Email: test.turista@test.com
  - Senha: TestPass123!
  - Nome: João
  - Sobrenome: Silva
  - Data Nascimento: 01/01/1990
- [ ] Clicar "Registrar"
- [ ] Redirecionar para /login
- [ ] Verificar mensagem de sucesso/erro

### ✅ Teste 3: Login
- [ ] Usar credenciais criadas acima
- [ ] Clicar "Entrar"
- [ ] Verificar redirecção para HOME (/)
- [ ] Verificar navbar mostra nome "João Silva"
- [ ] Verificar botão "Logout"

### ✅ Teste 4: Perfil
- [ ] Clicar nome no navbar → ir para /perfil
- [ ] Verificar dados do turista carregados
- [ ] Clicar "Editar Perfil"
- [ ] Verificar inputs ficam brancos (editáveis)
- [ ] Modificar "Sobrenome" para "Santos"
- [ ] Clicar "Salvar"
- [ ] Verificar mensagem "Perfil atualizado com sucesso!"
- [ ] Página recarrega

### ✅ Teste 5: Registrar Empresa
- [ ] Logout
- [ ] Ir para /register
- [ ] Selecionar "Registrar como Empresa"
- [ ] Preencher form:
  - Email: empresa.test@test.com
  - Senha: EmpPass123!
  - CNPJ: 12345678000190
  - Nome Empresa: Restaurant Test
  - Descrição: Restaurante de testes
- [ ] Clicar "Registrar"
- [ ] Ir para /login
- [ ] Entrar com email/senha empresa

### ✅ Teste 6: Painel Empresa
- [ ] Redirecionar automático para /painel
- [ ] Verificar mensagem "Bem-vindo(a), Restaurant Test!"
- [ ] Seção "Adicionar Novo Evento" visível
- [ ] Preencher form:
  - Título: Festival de Culinária
  - Descrição: Evento gastronômico
  - Local: Centro da Cidade
  - Data e Hora: (selecionar data futura)
  - Imagem: (selecionar arquivo)
- [ ] Clicar "Adicionar Evento"
- [ ] Verificar mensagem de sucesso
- [ ] Verificar evento aparece em "Meus Eventos Cadastrados"

### ✅ Teste 7: Verificar Evento em Página Pública
- [ ] Ir para /eventos
- [ ] Procurar novo evento criado
- [ ] Verificar exibição:
  - Título: Festival de Culinária
  - 🏢 Empresa: Restaurant Test
  - 📍 Local: Centro da Cidade
  - 📅 Data: formatada corretamente
  - Imagem: carregada ou fallback "Sem imagem"

### ✅ Teste 8: Verificar Console (F12)
Abrir DevTools (F12) → Console:
- [ ] SEM erros vermelhos críticos
- [ ] Avisos Firebase são normais (ex: "Unable to verify app")
- [ ] Network tab: requisições para Firebase retornam 200

### ✅ Teste 9: Editar Perfil Empresa
- [ ] Ir para /perfil
- [ ] Clicar "Editar Perfil"
- [ ] Modificar: "Descrição"
- [ ] Clicar "Salvar"
- [ ] Verificar sucesso

### ✅ Teste 10: Logout
- [ ] Clicar menu/botão "Logout"
- [ ] Redirecionar para /
- [ ] Verificar navbar não exibe nome
- [ ] Verificar botão "Login" visível

## 4️⃣ Testes Avançados (10 minutos)

### 🔐 Teste de Segurança
```
[ ] Tentar acessar /painel sem login
    → Deve redirecionar para /login

[ ] Login como turista, tentar /painel
    → Deve redirecionar para /unauthorized

[ ] Verificar email em /perfil não é editável
    → Background cinzento, sem input
```

### 📊 Teste de Responsividade
```
[ ] F12 → Ctrl+Shift+M (Toggle device toolbar)

Desktop (1920x1080):
  [ ] Navbar horizontal
  [ ] Eventos em grid 3 colunas
  [ ] Form em 1 coluna

Tablet (768x1024):
  [ ] Navbar adaptado
  [ ] Eventos em grid 2 colunas
  [ ] Form com padding

Mobile (375x667):
  [ ] Navbar empilhado
  [ ] Eventos em 1 coluna
  [ ] Texto legível
```

### 🐛 Teste de Erros
```
[ ] Tentar criar evento sem imagem
    → Mensagem: "Imagem obrigatória"

[ ] Tentar criar evento sem data
    → Mensagem de validação

[ ] Tentar login com email inválido
    → Mensagem: "Email ou senha incorretos"

[ ] Tentar registrar com email já existente
    → Mensagem de erro Firebase
```

## 5️⃣ Commands Úteis

```bash
# Lint (ESLint)
npm run lint

# Build (Vite)
npm run build

# Preview build
npm run preview

# Dev com debug
npm run dev -- --debug

# Limpar cache
rm -r node_modules
rm package-lock.json
npm install
```

## 6️⃣ Troubleshooting

### "Firebase config is missing..."
```bash
✓ Criar arquivo .env.local
✓ Copiar VITE_* vars do .env.local.example
✓ Preencher com credenciais reais
✓ Reiniciar servidor npm run dev
```

### "auth/invalid-api-key"
```bash
✓ Verificar VITE_FIREBASE_API_KEY em .env.local
✓ Verificar se Firebase project está ativo
✓ Regenerar chaves se necessário
```

### "Evento não aparece em /eventos"
```bash
✓ Verificar se foi criado (check Firestore Console)
✓ Verificar orderBy("data", "desc")
✓ Limpar cache: Ctrl+Shift+Delete
✓ Reload: Ctrl+Shift+R (hard refresh)
```

### "Imagem não carrega"
```bash
✓ Verificar VITE_IMGBB_API_KEY está em .env.local
✓ Verificar limite de API ImgBB (free tier: 1200 images/dia)
✓ Usar arquivo < 5MB
```

## 7️⃣ Checklist Final

Antes de deployer para produção:

- [ ] npm run lint = 0 errors
- [ ] npm run build = success (80 modules)
- [ ] .env.local com credenciais reais
- [ ] Todos 10 testes rápidos passam
- [ ] Console sem erros vermelhos
- [ ] Responsive em mobile/tablet/desktop
- [ ] Logout + login funciona
- [ ] Criar evento + visualizar funciona
- [ ] Perfil editar funciona
- [ ] Importações Firebase corretas

---

## 📞 Contato

Se encontrar bugs:
1. Criar issue com: erro + passos para reproduzir
2. Descrever resultado esperado vs real
3. Anexar screenshot/video se possível
4. Informar: navegador, OS, resolução

---

**Última atualização**: 12/11/2025  
**Versão**: 1.0.0  
**Status**: ✅ Pronto para testes
