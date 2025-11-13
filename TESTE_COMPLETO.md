# 📋 Plano de Testes Completo - TourMaps

Data: 12 de Novembro de 2025

## ✅ Revisão Técnica Concluída

### 1. Imports e Configuração Firebase
- [x] Config Firebase validada com env vars
- [x] Defensive validation implementada
- [x] Todos imports Firebase corretos

### 2. Correções Aplicadas
- [x] AuthService: `deleteEmpresaAccount` corrigida (campo `createdBy` em vez de `empresaUid`)
- [x] Login.jsx: Redirecionamento baseado em role (empresa → /painel, turista → /)
- [x] Painel.jsx: Adicionados campos `localNome` e `empresaNome` ao criar eventos
- [x] Eventos.jsx: Exibe empresa e local corretamente
- [x] Perfil.jsx: Form editing funcional com campos editáveis
- [x] Unauthorized.jsx: Página criada com mensagem amigável
- [x] Home.jsx: Links convertidos para React Router

## 🧪 Testes a Executar

### Fase 1: Autenticação
```
[ ] 1.1 - Registrar como Turista
      - Navegar para /register
      - Clicar em "Registre-se como Turista"
      - Preencher: Email, Senha, Nome, Sobrenome, Data Nascimento
      - Verificar redirecionamento para /login

[ ] 1.2 - Registrar como Empresa
      - Navegar para /register
      - Clicar em "Registre-se como Empresa"
      - Preencher: Email, Senha, CNPJ, Nome Empresa, Descrição
      - Verificar redirecionamento para /login

[ ] 1.3 - Login como Turista
      - Entrar com credenciais de turista
      - Verificar redirecionamento para HOME (/)
      - Verificar nome exibido no navbar

[ ] 1.4 - Login como Empresa
      - Entrar com credenciais de empresa
      - Verificar redirecionamento para /painel
      - Verificar nome da empresa no header

[ ] 1.5 - Credenciais Inválidas
      - Tentar login com email/senha errados
      - Verificar mensagem de erro: "Email ou senha incorretos"
```

### Fase 2: Navegação e Rotas
```
[ ] 2.1 - Rota Home (/)
      - Verificar mapa carregando
      - Verificar eventos próximos listados
      - Verificar pontos turísticos exibidos
      - Links de filtro funcionando

[ ] 2.2 - Rota Eventos (/eventos)
      - Verificar lista de todos eventos
      - Verificar campos: Título, Descrição, Data, Local, Empresa
      - Verificar fallback "Sem imagem"

[ ] 2.3 - Rota Perfil (/perfil)
      - Turista: Deve carregar
      - Empresa: Deve carregar
      - Sem login: Redirecionar para /login

[ ] 2.4 - Rota Painel (/painel)
      - Com login empresa: Deve carregar
      - Com login turista: Redirecionar para /unauthorized
      - Sem login: Redirecionar para /login

[ ] 2.5 - Rota Unauthorized (/unauthorized)
      - Mensagem clara exibida
      - Botões "Ir para Home" e "Voltar" funcionando
```

### Fase 3: Funcionalidade de Eventos
```
[ ] 3.1 - Criar Evento (Empresa)
      - Ir para /painel
      - Preencher: Título, Descrição, Local, Data, Imagem
      - Clicar "Adicionar Evento"
      - Verificar: mensagem de sucesso
      - Verificar: evento aparece na lista "Meus Eventos"

[ ] 3.2 - Validação de Evento
      - Tentar criar sem Título
      - Tentar criar sem Data
      - Tentar criar sem Imagem
      - Verificar mensagens de erro

[ ] 3.3 - Visualizar Evento Criado
      - Ir para /eventos
      - Verificar novo evento na lista com:
         - Título correto
         - Descrição
         - Local exato
         - Empresa correta
         - Data formatada (dd/mm/aaaa)

[ ] 3.4 - Exibição de Eventos em Home
      - Voltar para /
      - Verificar seção "Próximos eventos"
      - Verificar novo evento aparece
```

### Fase 4: Perfil do Usuário
```
[ ] 4.1 - Editar Perfil Turista
      - Ir para /perfil
      - Clicar "Editar Perfil"
      - Modificar: Nome, Sobrenome, Data Nascimento
      - Clicar "Salvar"
      - Verificar: mensagem sucesso + reload

[ ] 4.2 - Editar Perfil Empresa
      - Login como empresa
      - Ir para /perfil
      - Clicar "Editar Perfil"
      - Modificar: CNPJ, Nome Empresa, Descrição
      - Clicar "Salvar"
      - Verificar: mensagem sucesso + reload

[ ] 4.3 - Email Sempre Desabilitado
      - Verificar campo Email sempre com background cinzento
      - Verificar impossível editar email

[ ] 4.4 - Cancelar Edição
      - Ir para /perfil (empresa)
      - Clicar "Editar Perfil"
      - Fazer mudanças
      - Clicar "Cancelar"
      - Verificar: dados revertidos

[ ] 4.5 - Deletar Conta (Empresa Only)
      - Login como empresa
      - Ir para /perfil
      - Clicar "Editar Perfil"
      - Clicar "Excluir Conta Permanentemente"
      - Verificar modal de confirmação
      - Clicar "Sim, Excluir"
      - Verificar: logout automático e redirecionamento para /
```

### Fase 5: Dados JSON
```
[ ] 5.1 - events.json Validation
      - Todos eventos têm: id, titulo, descricao, data, localNome, empresaNome
      - Datas em formato YYYY-MM-DD
      - Verificar renderização correta em /eventos

[ ] 5.2 - places.json Validation
      - Verificar campos: id, nome, categoria, latitude, longitude, rating
      - Verificar mapa em / carrega marcadores
      - Verificar popups com informações corretas
```

### Fase 6: UI/UX e Responsividade
```
[ ] 6.1 - Desktop (1920x1080)
      - Navbar fixa no topo
      - Layout grid responsivo
      - Botões acessíveis
      - Scroll suave

[ ] 6.2 - Tablet (768x1024)
      - Menu responsivo
      - Cards em 2 colunas
      - Inputs têm padding adequado
      - Toque em botões funciona

[ ] 6.3 - Mobile (375x667)
      - Menu hamburger/colapsível
      - Cards em 1 coluna
      - Mapa carrega com zoom apropriado
      - Texto legível (min 16px)

[ ] 6.4 - Acessibilidade
      - Campos form com labels
      - Botões com aria-labels
      - Contraste de cores adequado
      - Tab navigation funciona
```

### Fase 7: Validação Técnica
```
[ ] 7.1 - Build
      - npm run build: ✓ (80 modules, sem erros)
      - npm run lint: ✓ (0 erros, 0 avisos)

[ ] 7.2 - Console Check
      - F12 → Console
      - Verificar: SEM erros vermelhos
      - Avisos Firebase aceitáveis

[ ] 7.3 - Network
      - F12 → Network
      - Requests para Firebase auth: 200 OK
      - Requests para Firestore query: 200 OK
      - Assets carregam corretamente

[ ] 7.4 - Performance
      - Lighthouse score > 80
      - LCP < 2.5s
      - FID < 100ms
```

## 📝 Notas de Implementação

### Fluxo de Autenticação:
1. **Turista registra** → stored em `collection(users)`
2. **Empresa registra** → stored em `collection(empresas)`
3. **onAuthStateChanged** detecta login → busca em empresas OU users
4. **Role definida** → 'empresa' ou 'turista'
5. **Redirect logic**:
   - Empresa login → `/painel`
   - Turista login → `/`
   - Sem role → `/unauthorized`

### Eventos:
- Criados apenas por empresas em `/painel`
- Campos: `titulo`, `descricao`, `data`, `localNome`, `imagemUrl`, `empresaNome`, `createdBy`
- Query: `orderBy("data", "desc")`
- Exibidos em `/eventos` e na seção de home

### Perfil:
- Turista: `nome`, `sobrenome`, `dataNascimento`
- Empresa: `cnpj`, `nomeEmpresa`, `descricao`
- Email sempre read-only
- Exclusão de conta: DELETE cascade de eventos

## 🔍 Checklist Pré-Deploy

- [x] Imports Firebase completos
- [x] ESLint: 0 erros
- [x] Build: Vite ✓
- [x] Firebase config com defensive validation
- [x] AuthContext carregando perfil correto
- [x] ProtectedRoute com redirecionamento correto
- [x] Eventos com empresaNome e localNome
- [x] Perfil form editável
- [x] Logout + redirect
- [ ] Testes manuais Fase 1-7 concluídos

---

**Status**: ✅ **PRONTO PARA TESTES** (11/12/2025)
