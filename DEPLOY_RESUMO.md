# 🚀 Deploy Rápido - EventSync AI

## 📋 Checklist Rápido

### 1️⃣ Banco de Dados (Supabase)
- [ ] Criar projeto no Supabase
- [ ] Copiar Connection String
- [ ] Executar migrações: `cd backend && npm run prisma:migrate`

### 2️⃣ Backend (Railway/Render)
- [ ] Criar projeto → Conectar GitHub
- [ ] Root: `backend/`
- [ ] Build: `npm install && npm run build`
- [ ] Start: `npm start`
- [ ] Variáveis:
  - `DATABASE_URL` (do Supabase)
  - `JWT_SECRET` (gerar: `openssl rand -base64 32`)
  - `NODE_ENV=production`
- [ ] Anotar URL do backend

### 3️⃣ Frontend (Vercel)
- [ ] Criar projeto → Conectar GitHub
- [ ] Root: `frontend/`
- [ ] Build: `npm run build`
- [ ] Output: `dist/`
- [ ] Variável: `VITE_API_URL=https://seu-backend.railway.app`
- [ ] Deploy

---

## 🔧 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="chave-secreta-32-caracteres-minimo"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://seu-backend.railway.app
```

---

## ✅ Testar Deploy

1. **Backend Health:**
   ```
   curl https://seu-backend.railway.app/health
   ```

2. **Frontend:**
   - Acesse a URL
   - Tente fazer login
   - Verifique DevTools → Network

---

## 🐛 Problemas Comuns

- **CORS Error:** Verificar se backend tem `cors()` configurado
- **Database Error:** Verificar `DATABASE_URL` e SSL
- **Frontend não conecta:** Verificar `VITE_API_URL`
- **Build falha:** Executar `npm install` localmente primeiro

---

## 📚 Guia Completo

Veja `DEPLOY.md` para instruções detalhadas.

