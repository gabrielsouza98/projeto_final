# EventSync AI - Frontend

## 🚀 Como Iniciar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do frontend com:
```
VITE_API_URL=http://localhost:3000
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## ⚠️ IMPORTANTE

**Antes de usar o frontend, certifique-se de que o backend está rodando!**

Para iniciar o backend:
```bash
cd ../backend
npm run dev
```

O backend deve estar rodando em `http://localhost:3000`

## 🐛 Problemas Comuns

### Erro de Conexão
Se você ver erros de conexão:
1. Verifique se o backend está rodando (`cd backend && npm run dev`)
2. Verifique se a URL no `.env` está correta
3. Verifique o console do navegador para mais detalhes

### Não consigo criar eventos
- Certifique-se de que você está logado como **ORGANIZER**
- Para criar um usuário organizador, você precisa registrar com `role: 'ORGANIZER'` ou atualizar no banco de dados

### Não consigo me inscrever
- Verifique se o evento está com status `INSCRICOES_ABERTAS` ou `PUBLICADO`
- Verifique se você não está já inscrito
- Verifique se o backend está respondendo corretamente

## 📝 Funcionalidades

- ✅ Login e Registro
- ✅ Dashboard
- ✅ Listar Eventos
- ✅ Criar Eventos (Organizador)
- ✅ Inscrever-se em Eventos
- ✅ Ver Cartão Virtual com QR Code
- ✅ Gerenciar Inscrições (Organizador)
- ✅ Amizades
- ✅ Mensagens
- ✅ Avaliar Eventos
