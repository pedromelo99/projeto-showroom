# 🚗 AutoShow Platform - Frontend

Sistema completo de showroom de carros desenvolvido com Vue.js 3, Nuxt.js 3 e Vuetify 3.

## 📋 Visão Geral

O AutoShow Platform é uma solução moderna e escalável para concessionárias de carros, oferecendo:

- **Interface pública** para clientes navegarem e pesquisarem carros
- **Painel administrativo** completo para gestão de estoque e leads
- **Sistema de autenticação** com diferentes níveis de acesso
- **Design responsivo** otimizado para todos os dispositivos
- **Arquitetura escalável** preparada para crescimento

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Vue.js 3** - Framework JavaScript reativo
- **Nuxt.js 3** - Framework full-stack para Vue.js
- **Vuetify 3** - Biblioteca de componentes Material Design
- **Pinia** - Gerenciamento de estado
- **TypeScript** - Tipagem estática (opcional)

### Backend (Planejado)
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Multer** - Upload de arquivos

### Deploy
- **Vercel** - Frontend (SSR/SSG)
- **Railway** - Backend
- **Supabase** - Banco de dados
- **AWS S3** - Armazenamento de imagens

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/autoshow-platform.git
cd autoshow-platform/frontend
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# API Configuration
API_BASE_URL=http://localhost:3001/api

# App Configuration
NUXT_PUBLIC_APP_NAME=AutoShow
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Execute o projeto**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📁 Estrutura do Projeto

```
frontend/
├── assets/
│   └── css/
│       └── main.css              # Estilos customizados
├── components/
│   ├── common/
│   │   ├── AppHeader.vue         # Cabeçalho da aplicação
│   │   └── AppFooter.vue         # Rodapé da aplicação
│   └── cars/
│       ├── CarCard.vue           # Card de carro
│       ├── CarGallery.vue        # Galeria de imagens
│       └── CarFilters.vue        # Filtros de busca
├── layouts/
│   ├── default.vue               # Layout público
│   └── admin.vue                 # Layout administrativo
├── middleware/
│   └── auth.js                   # Middleware de autenticação
├── pages/
│   ├── index.vue                 # Página inicial
│   ├── cars/
│   │   ├── index.vue             # Listagem de carros
│   │   └── [id].vue              # Detalhes do carro
│   ├── auth/
│   │   ├── login.vue             # Login
│   │   └── register.vue          # Cadastro
│   └── admin/
│       ├── index.vue             # Dashboard admin
│       └── cars/
│           └── index.vue         # Gerenciar carros
├── plugins/
│   └── vuetify.js                # Configuração do Vuetify
├── store/
│   ├── auth.js                   # Store de autenticação
│   ├── cars.js                   # Store de carros
│   └── leads.js                  # Store de leads
├── app.vue                       # Componente raiz
├── nuxt.config.ts                # Configuração do Nuxt
└── package.json                  # Dependências
```

## 🎨 Funcionalidades

### Públicas
- ✅ **Homepage** com carros em destaque
- ✅ **Listagem de carros** com filtros avançados
- ✅ **Página de detalhes** com galeria de imagens
- ✅ **Sistema de busca** por marca, modelo, preço, etc.
- ✅ **Filtros dinâmicos** (combustível, câmbio, tipo, etc.)
- ✅ **Design responsivo** para mobile e desktop
- ✅ **SEO otimizado** com meta tags dinâmicas

### Administrativas
- ✅ **Dashboard** com estatísticas e métricas
- ✅ **CRUD de carros** (criar, editar, excluir)
- ✅ **Upload de imagens** para carros
- ✅ **Gerenciamento de leads** e contatos
- ✅ **Sistema de autenticação** com níveis de acesso
- ✅ **Interface administrativa** intuitiva

### Técnicas
- ✅ **Gerenciamento de estado** com Pinia
- ✅ **Roteamento** com Nuxt Router
- ✅ **Middleware** de autenticação
- ✅ **Componentes reutilizáveis**
- ✅ **TypeScript** (opcional)
- ✅ **PWA** ready

## 🔧 Configuração Avançada

### Personalização do Tema

Edite `plugins/vuetify.js` para personalizar cores e tema:

```javascript
theme: {
  themes: {
    light: {
      colors: {
        primary: '#1e3c72',    // Azul principal
        secondary: '#2a5298',  // Azul secundário
        accent: '#ffd700',     // Dourado
        // ... outras cores
      }
    }
  }
}
```

### Configuração de API

Configure a URL da API em `nuxt.config.ts`:

```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.API_BASE_URL || 'http://localhost:3001/api'
  }
}
```

### Middleware Personalizado

Crie novos middlewares em `middleware/`:

```javascript
// middleware/custom.js
export default defineNuxtRouteMiddleware((to) => {
  // Sua lógica aqui
})
```

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:

- **xs**: < 600px (mobile)
- **sm**: 600px - 960px (tablet)
- **md**: 960px - 1264px (desktop pequeno)
- **lg**: 1264px - 1904px (desktop)
- **xl**: > 1904px (desktop grande)

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify

1. Build do projeto: `npm run generate`
2. Upload da pasta `dist/` para Netlify
3. Configure redirects para SPA

### Servidor Próprio

1. Build: `npm run build`
2. Execute: `npm run preview`
3. Configure proxy reverso (Nginx/Apache)

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📊 Performance

### Métricas Otimizadas
- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Otimizações Implementadas
- ✅ **Lazy loading** de imagens
- ✅ **Code splitting** automático
- ✅ **Tree shaking** de dependências
- ✅ **Minificação** de CSS/JS
- ✅ **Compressão gzip**
- ✅ **Cache headers** otimizados

## 🔒 Segurança

### Implementações
- ✅ **Autenticação JWT** segura
- ✅ **Validação** de formulários
- ✅ **Sanitização** de inputs
- ✅ **CORS** configurado
- ✅ **Rate limiting** (backend)
- ✅ **HTTPS** obrigatório

## 📈 Monitoramento

### Analytics
- **Google Analytics** integrado
- **Error tracking** com Sentry
- **Performance monitoring**
- **User behavior** tracking

### Logs
- **Console logs** em desenvolvimento
- **Structured logging** em produção
- **Error reporting** automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Documentação**: [Wiki do projeto](wiki)
- **Issues**: [GitHub Issues](issues)
- **Email**: suporte@autoshow.com.br
- **Discord**: [Servidor da comunidade](discord)

## 🗺️ Roadmap

### Próximas Funcionalidades
- [ ] **Chat em tempo real** com vendedores
- [ ] **Integração WhatsApp** para contato
- [ ] **Sistema de favoritos** para usuários
- [ ] **Notificações push** para novos carros
- [ ] **Integração CRM** avançada
- [ ] **Relatórios** detalhados
- [ ] **API GraphQL** (opcional)
- [ ] **App mobile** nativo

### Melhorias Técnicas
- [ ] **Testes automatizados** completos
- [ ] **CI/CD** pipeline
- [ ] **Docker** containerização
- [ ] **Kubernetes** para escalabilidade
- [ ] **Microserviços** architecture
- [ ] **Event sourcing** para auditoria

---

**Desenvolvido com ❤️ pela equipe AutoShow**
