# 🚀 Guia de Deploy - EventSync AI
## Passo a Passo Bem Explicado

Este guia vai te levar do zero até ter seu sistema funcionando em produção, **um passo de cada vez**.

---

## 📚 Índice

1. [O que você precisa ter](#o-que-voce-precisa-ter)
2. [Passo 1: Configurar o Banco de Dados (Supabase)](#passo-1-configurar-o-banco-de-dados-supabase)
3. [Passo 2: Preparar o Backend Localmente](#passo-2-preparar-o-backend-localmente)
4. [Passo 3: Fazer Deploy do Backend (Railway)](#passo-3-fazer-deploy-do-backend-railway)
5. [Passo 4: Preparar o Frontend](#passo-4-preparar-o-frontend)
6. [Passo 5: Fazer Deploy do Frontend (Vercel)](#passo-5-fazer-deploy-do-frontend-vercel)
7. [Passo 6: Testar Tudo](#passo-6-testar-tudo)
8. [Problemas e Soluções](#problemas-e-solucoes)

---

## O que você precisa ter

Antes de começar, certifique-se de ter:

- ✅ **Conta no GitHub** (com seu código do projeto)
- ✅ **Conta no Supabase** (vamos criar agora)
- ✅ **Conta no Railway** (vamos criar agora)
- ✅ **Conta no Vercel** (vamos criar agora)
- ✅ **Node.js instalado** no seu computador (versão 18 ou superior)

**Não tem alguma dessas contas?** Não se preocupe, vamos criar juntos! 😊

---

## Passo 1: Configurar o Banco de Dados (Supabase)

### O que é o Supabase?
O Supabase é um serviço que fornece um banco de dados PostgreSQL na nuvem. É como ter um servidor de banco de dados sem precisar configurar nada.

### 1.1 Criar conta no Supabase

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"** ou **"Sign up"**
3. Faça login com GitHub (mais fácil) ou crie uma conta
4. Confirme seu email se necessário

### 1.2 Criar um novo projeto

1. No painel do Supabase, clique em **"New Project"**
2. Preencha:
   - **Name**: `eventsync-ai` (ou qualquer nome)
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha a mais próxima (ex: South America)
3. Clique em **"Create new project"**
4. Aguarde 2-3 minutos enquanto o projeto é criado

### 1.3 Obter a Connection String

A Connection String é como um "endereço" para conectar seu backend ao banco de dados.

1. No painel do projeto, vá em **Settings** (ícone de engrenagem no canto inferior esquerdo)
2. Clique em **Database**
3. Role a página até encontrar **"Connection string"**
4. Clique na aba **"URI"**
5. Você verá algo como:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Copie essa string inteira**
7. **Substitua `[YOUR-PASSWORD]` pela senha que você criou**
8. **Adicione `?sslmode=require` no final**

**Exemplo final:**
```
postgresql://postgres:minhasenha123@db.abc123.supabase.co:5432/postgres?sslmode=require
```

**⚠️ IMPORTANTE:** Guarde essa string! Você vai usar ela no próximo passo.

### 1.4 Executar as migrações do banco

As migrações são como "receitas" que criam todas as tabelas do banco de dados.

1. Abra o terminal no seu computador
2. Navegue até a pasta do projeto:
   ```bash
   cd C:\Users\gabri\Downloads\projeto_final\backend
   ```
3. Instale as dependências (se ainda não instalou):
   ```bash
   npm install
   ```
4. Crie um arquivo `.env` na pasta `backend/`:
   - No Windows: clique com botão direito → Novo → Documento de Texto
   - Renomeie para `.env` (sem extensão)
   - Abra com um editor de texto (Bloco de Notas, VS Code, etc.)
5. Cole no arquivo `.env`:
   ```env
   DATABASE_URL="COLE_AQUI_A_CONNECTION_STRING_DO_SUPABASE"
   JWT_SECRET="gere-uma-chave-secreta-aleatoria-aqui-minimo-32-caracteres"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV=production
   ```
6. **Substitua `COLE_AQUI_A_CONNECTION_STRING_DO_SUPABASE`** pela string que você copiou
7. **Para o JWT_SECRET**, gere uma chave aleatória:
   - No terminal, execute: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   - Copie o resultado e cole no lugar de `gere-uma-chave-secreta-aleatoria-aqui-minimo-32-caracteres`
8. Salve o arquivo `.env`
9. No terminal, execute:
   ```bash
   npm run prisma:generate
   ```
10. Depois execute:
    ```bash
    npx prisma migrate deploy
    ```

**✅ Se tudo deu certo:** Você verá mensagens de sucesso e as tabelas serão criadas no Supabase!

**❌ Se deu erro:** Veja a seção [Problemas e Soluções](#problemas-e-solucoes) no final.

---

## Passo 2: Preparar o Backend Localmente

Antes de fazer deploy, vamos testar se tudo funciona localmente.

### 2.1 Compilar o código

O backend está em TypeScript, mas precisa ser compilado para JavaScript para rodar.

1. No terminal, ainda na pasta `backend/`:
   ```bash
   npm run build
   ```
2. Aguarde alguns segundos
3. Se tudo deu certo, você verá uma pasta `dist/` criada

### 2.2 Testar localmente

1. No terminal:
   ```bash
   npm start
   ```
2. Você deve ver mensagens como:
   ```
   🚀 Servidor rodando na porta 3000
   📡 Health check: http://localhost:3000/health
   ```
3. Abra o navegador e acesse: **http://localhost:3000/health**
4. Você deve ver uma mensagem JSON dizendo que está funcionando

**✅ Se funcionou:** Parabéns! Seu backend está pronto.

**❌ Se não funcionou:** Pare o servidor (Ctrl+C) e veja a seção [Problemas e Soluções](#problemas-e-solucoes).

---

## Passo 3: Fazer Deploy do Backend (Railway)

### O que é o Railway?
Railway é um serviço que hospeda seu backend na nuvem. É gratuito para começar e muito fácil de usar.

### 3.1 Criar conta no Railway

1. Acesse: **https://railway.app**
2. Clique em **"Login"** ou **"Start a New Project"**
3. Faça login com GitHub (recomendado)
4. Autorize o Railway a acessar seus repositórios

### 3.2 Criar um novo projeto

1. No painel do Railway, clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Se aparecer uma lista de repositórios, selecione o repositório do EventSync AI
4. Se não aparecer, clique em **"Configure GitHub App"** e autorize

### 3.3 Configurar o backend

1. Após conectar o repositório, o Railway vai tentar detectar automaticamente
2. Clique no serviço que foi criado (ou crie um novo clicando em **"+ New"** → **"GitHub Repo"**)
3. Na aba **"Settings"**, configure:

   **Root Directory:**
   - Clique em **"Root Directory"**
   - Digite: `backend`
   - Isso diz ao Railway onde está o código do backend

   **Build Command:**
   - Clique em **"Build Command"**
   - Digite: `npm install && npm run build`
   - Isso instala dependências e compila o código

   **Start Command:**
   - Clique em **"Start Command"**
   - Digite: `npm start`
   - Isso inicia o servidor

### 3.4 Adicionar variáveis de ambiente

As variáveis de ambiente são configurações secretas que o backend precisa.

1. Na aba **"Variables"**, clique em **"+ New Variable"**
2. Adicione cada uma dessas variáveis (clique em **"+ New Variable"** para cada):

   **Variável 1:**
   - **Name:** `DATABASE_URL`
   - **Value:** Cole a Connection String do Supabase (a mesma do arquivo `.env`)

   **Variável 2:**
   - **Name:** `JWT_SECRET`
   - **Value:** Cole a mesma chave que você usou no `.env`

   **Variável 3:**
   - **Name:** `NODE_ENV`
   - **Value:** `production`

   **Variável 4:**
   - **Name:** `JWT_EXPIRES_IN`
   - **Value:** `7d`

3. **NÃO precisa adicionar `PORT`** - o Railway define automaticamente

### 3.5 Fazer o deploy

1. Após adicionar as variáveis, o Railway vai fazer deploy automaticamente
2. Você pode acompanhar o progresso na aba **"Deployments"**
3. Aguarde alguns minutos
4. Quando terminar, você verá uma URL tipo: `https://backend-production-xxxx.up.railway.app`

### 3.6 Testar o backend em produção

1. Copie a URL que o Railway gerou
2. Abra no navegador e adicione `/health` no final:
   ```
   https://sua-url.railway.app/health
   ```
3. Você deve ver a mesma mensagem JSON de antes

**✅ Se funcionou:** Anote essa URL! Você vai precisar dela no próximo passo.

**❌ Se não funcionou:** Veja os logs na aba **"Deployments"** → clique no último deploy → veja os erros.

---

## Passo 4: Preparar o Frontend

Agora vamos preparar o frontend para conectar ao backend que acabamos de fazer deploy.

### 4.1 Criar arquivo de configuração

1. Na pasta `frontend/`, crie um arquivo `.env` (mesmo processo do backend)
2. Abra o arquivo e cole:
   ```env
   VITE_API_URL=https://SUA-URL-DO-RAILWAY.railway.app
   ```
3. **Substitua `SUA-URL-DO-RAILWAY.railway.app`** pela URL real do backend (a que você anotou)
4. **IMPORTANTE:** Sem barra `/` no final!
5. Salve o arquivo

### 4.2 Testar build localmente (opcional)

1. No terminal, vá para a pasta frontend:
   ```bash
   cd C:\Users\gabri\Downloads\projeto_final\frontend
   ```
2. Instale dependências (se ainda não instalou):
   ```bash
   npm install
   ```
3. Compile o projeto:
   ```bash
   npm run build
   ```
4. Teste localmente:
   ```bash
   npm run preview
   ```
5. Acesse: **http://localhost:4173**
6. Tente fazer login (vai dar erro porque não tem backend local, mas serve para testar se compilou)

---

## Passo 5: Fazer Deploy do Frontend (Vercel)

### O que é o Vercel?
Vercel é especializado em hospedar aplicações React/Vite. É gratuito e muito rápido.

### 5.1 Criar conta no Vercel

1. Acesse: **https://vercel.com**
2. Clique em **"Sign Up"**
3. Faça login com GitHub (recomendado)
4. Autorize o Vercel a acessar seus repositórios

### 5.2 Importar o projeto

1. No painel do Vercel, clique em **"Add New..."** → **"Project"**
2. Selecione o repositório do EventSync AI
3. Clique em **"Import"**

### 5.3 Configurar o projeto

1. Na tela de configuração, você verá várias opções:

   **Framework Preset:**
   - Deixe como **"Vite"** (já deve estar selecionado)

   **Root Directory:**
   - Clique e digite: `frontend`
   - Isso diz ao Vercel onde está o código do frontend

   **Build Command:**
   - Deve estar: `npm run build`
   - Se não estiver, digite: `npm run build`

   **Output Directory:**
   - Deve estar: `dist`
   - Se não estiver, digite: `dist`

   **Install Command:**
   - Deixe como: `npm install`

### 5.4 Adicionar variável de ambiente

1. Role a página até encontrar **"Environment Variables"**
2. Clique em **"+ Add"** ou **"Add Environment Variable"**
3. Adicione:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://SUA-URL-DO-RAILWAY.railway.app` (a mesma URL do backend)
4. **IMPORTANTE:** Sem barra `/` no final!
5. Clique em **"Save"**

### 5.5 Fazer o deploy

1. Clique em **"Deploy"**
2. Aguarde alguns minutos
3. O Vercel vai compilar e fazer deploy automaticamente
4. Quando terminar, você verá uma URL tipo: `https://seu-projeto.vercel.app`

### 5.6 Testar o frontend

1. Acesse a URL que o Vercel gerou
2. Você deve ver a tela de login do EventSync AI
3. Tente fazer login (se tiver uma conta) ou criar uma nova conta

**✅ Se funcionou:** Parabéns! Seu sistema está no ar! 🎉

**❌ Se não funcionou:** Veja a seção [Problemas e Soluções](#problemas-e-solucoes).

---

## Passo 6: Testar Tudo

Agora vamos testar se tudo está funcionando corretamente.

### 6.1 Testar Backend

1. Acesse: `https://sua-url-backend.railway.app/health`
2. Deve retornar JSON com `"status": "ok"`

### 6.2 Testar Frontend

1. Acesse a URL do Vercel
2. Tente fazer:
   - [ ] Criar uma conta
   - [ ] Fazer login
   - [ ] Criar um evento (se for organizador)
   - [ ] Inscrever-se em um evento
   - [ ] Ver suas inscrições

### 6.3 Verificar conexão Frontend → Backend

1. No frontend, abra o DevTools (F12)
2. Vá na aba **"Network"** (Rede)
3. Faça uma ação (ex: fazer login)
4. Você deve ver requisições sendo feitas para a URL do Railway
5. Se aparecer erro de CORS, veja [Problemas e Soluções](#problemas-e-solucoes)

---

## Problemas e Soluções

### ❌ Erro: "DATABASE_URL não está definida"

**O que significa:** O backend não encontrou a variável de ambiente.

**Solução:**
1. No Railway, vá em **Variables**
2. Verifique se `DATABASE_URL` está lá
3. Se não estiver, adicione
4. Clique em **"Redeploy"** para reiniciar

---

### ❌ Erro: "CORS policy" no navegador

**O que significa:** O backend está bloqueando requisições do frontend.

**Solução:**
1. O backend já tem CORS configurado, mas se ainda der erro:
2. No código do backend (`backend/src/index.ts`), verifique se tem:
   ```typescript
   app.use(cors());
   ```
3. Se não tiver, adicione essa linha
4. Faça commit e push para o GitHub
5. O Railway vai fazer deploy automaticamente

---

### ❌ Frontend não conecta ao backend

**O que significa:** O frontend não está conseguindo fazer requisições.

**Solução:**
1. Verifique se `VITE_API_URL` está configurada no Vercel
2. Verifique se a URL está correta (sem barra no final)
3. Verifique se o backend está rodando (teste `/health`)
4. No DevTools → Console, veja se há erros
5. No DevTools → Network, veja se as requisições estão indo para a URL certa

---

### ❌ Build do frontend falha

**O que significa:** O Vercel não conseguiu compilar o código.

**Solução:**
1. Teste localmente primeiro:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Se der erro local, corrija antes de fazer deploy
3. Verifique se todas as dependências estão no `package.json`
4. Veja os logs de erro no Vercel (aba "Deployments" → clique no deploy falho)

---

### ❌ Erro de conexão com banco de dados

**O que significa:** O backend não consegue conectar ao Supabase.

**Solução:**
1. Verifique se a `DATABASE_URL` está correta
2. Verifique se tem `?sslmode=require` no final
3. Verifique se a senha está correta (sem espaços extras)
4. No Supabase, verifique se o projeto está ativo
5. Teste a conexão localmente primeiro

---

### ❌ Migrações não funcionam

**O que significa:** As tabelas não foram criadas no banco.

**Solução:**
1. Certifique-se de estar na pasta `backend/`
2. Execute:
   ```bash
   npm run prisma:generate
   npx prisma migrate deploy
   ```
3. Se ainda der erro, tente:
   ```bash
   npx prisma db push
   ```
4. Verifique os logs de erro para ver o que está faltando

---

## ✅ Pronto!

Se você chegou até aqui e tudo está funcionando, **parabéns!** 🎉

Seu sistema EventSync AI está:
- ✅ Backend rodando em produção (Railway)
- ✅ Frontend acessível publicamente (Vercel)
- ✅ Banco de dados conectado (Supabase)
- ✅ Sistema completo funcionando!

**URLs finais:**
- Frontend: `https://seu-projeto.vercel.app`
- Backend: `https://sua-url.railway.app`
- Health Check: `https://sua-url.railway.app/health`

---

## 📞 Precisa de ajuda?

Se algo não funcionou:
1. Leia os logs de erro (Railway e Vercel mostram logs detalhados)
2. Teste localmente primeiro
3. Verifique se todas as variáveis de ambiente estão configuradas
4. Verifique se o banco de dados está acessível

**Boa sorte! 🚀**
