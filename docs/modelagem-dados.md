# Modelagem de Dados - EventSync AI

## Entidades e Relacionamentos

### 1. Usuario
Representa um usuário do sistema (pode ser organizador e/ou participante).

**Campos:**
- `id` (UUID ou INT) - Identificador único
- `nome` (STRING) - Nome completo
- `email` (STRING, UNIQUE) - Email (usado para login)
- `senha_hash` (STRING) - Senha criptografada (bcrypt)
- `cidade` (STRING, OPCIONAL) - Cidade do usuário
- `foto_url` (STRING, OPCIONAL) - URL da foto de perfil
- `visibilidade_participacao` (BOOLEAN) - Se aparece na lista pública de participantes
- `rating_organizador` (FLOAT, DEFAULT 0.0) - Média de avaliações como organizador
- `role` (ENUM: 'user' | 'organizer') - Tipo de usuário (pode ser ambos)
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Relacionamentos:**
- Um usuário pode criar muitos eventos (1:N)
- Um usuário pode ter muitas inscrições (1:N)
- Um usuário pode enviar/receber muitas mensagens (1:N)
- Um usuário pode ter muitas avaliações (1:N)
- Um usuário pode ter muitas amizades (solicitante ou destinatário) (N:M)

---

### 2. Evento
Representa um evento criado por um organizador.

**Campos:**
- `id` (UUID ou INT) - Identificador único
- `organizador_id` (FOREIGN KEY -> Usuario.id) - Criador do evento
- `titulo` (STRING) - Título do evento
- `descricao` (TEXT) - Descrição completa
- `descricao_curta` (STRING) - Descrição resumida
- `local_endereco` (STRING, OPCIONAL) - Endereço físico
- `local_url` (STRING, OPCIONAL) - URL para evento online
- `data_inicio` (TIMESTAMP) - Data/hora de início
- `data_fim` (TIMESTAMP) - Data/hora de término
- `preco` (DECIMAL, DEFAULT 0.0) - Valor do evento
- `tipo` (ENUM: 'gratuito' | 'pago') - Tipo de pagamento
- `chave_pix` (STRING, OPCIONAL) - Chave PIX do organizador (se pago)
- `instrucoes_pagamento` (TEXT, OPCIONAL) - Instruções de pagamento
- `exige_aprovacao` (BOOLEAN) - Se requer aprovação manual
- `inscricao_abre` (TIMESTAMP, OPCIONAL) - Data de abertura de inscrições
- `inscricao_fecha` (TIMESTAMP, OPCIONAL) - Data de fechamento de inscrições
- `max_inscricoes` (INT, OPCIONAL) - Capacidade máxima
- `n_checkins_permitidos` (INT, DEFAULT 1) - Número máximo de check-ins por participante
- `status` (ENUM) - Estado do evento (ver estados abaixo)
- `banner_url` (STRING, OPCIONAL) - URL da imagem do banner
- `carga_horaria` (INT, OPCIONAL) - Carga horária em horas
- `link_certificado` (STRING, OPCIONAL) - Link para modelo de certificado
- `nota_media` (FLOAT, DEFAULT 0.0) - Média de avaliações
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Relacionamentos:**
- Um evento pertence a um organizador (N:1)
- Um evento tem muitas inscrições (1:N)
- Um evento tem muitos check-ins (1:N via Inscricao)
- Um evento tem muitas avaliações (1:N)
- Um evento tem muitos certificados (1:N)

---

### 3. Inscricao
Representa a inscrição de um participante em um evento.

**Campos:**
- `id` (UUID ou INT) - Identificador único
- `evento_id` (FOREIGN KEY -> Evento.id) - Evento relacionado
- `usuario_id` (FOREIGN KEY -> Usuario.id) - Participante
- `status` (ENUM) - Estado da inscrição (ver estados abaixo)
- `timestamp_inscricao` (TIMESTAMP) - Data/hora da inscrição
- `timestamp_pagamento` (TIMESTAMP, OPCIONAL) - Data/hora de confirmação de pagamento
- `n_checkins_realizados` (INT, DEFAULT 0) - Contador de check-ins
- `certificado_emitido` (BOOLEAN, DEFAULT false) - Se certificado foi gerado
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Relacionamentos:**
- Uma inscrição pertence a um evento (N:1)
- Uma inscrição pertence a um usuário (N:1)
- Uma inscrição tem muitos registros de check-in (1:N)

**Constraints:**
- UNIQUE(evento_id, usuario_id) - Um usuário só pode se inscrever uma vez por evento

---

### 4. CheckinRegistro
Registro individual de cada check-in realizado.

**Campos:**
- `id` (UUID ou INT) - Identificador único
- `inscricao_id` (FOREIGN KEY -> Inscricao.id) - Inscrição relacionada
- `timestamp` (TIMESTAMP) - Data/hora do check-in
- `metodo` (ENUM: 'manual' | 'qr') - Método usado para check-in
- `observacoes` (TEXT, OPCIONAL) - Observações do organizador
- `created_at` (TIMESTAMP) - Data de criação

**Relacionamentos:**
- Um check-in pertence a uma inscrição (N:1)

---

### 5. Amizade
Representa uma relação de amizade entre dois usuários.

**Campos:**
- `id` (UUID ou INT) - Identificador único
- `solicitante_id` (FOREIGN KEY -> Usuario.id) - Quem solicitou
- `destinatario_id` (FOREIGN KEY -> Usuario.id) - Quem recebeu
- `status` (ENUM: 'pendente' | 'aceita' | 'recusada' | 'bloqueada') - Estado da amizade
- `evento_id` (FOREIGN KEY -> Evento.id, OPCIONAL) - Evento onde se conheceram
- `timestamp` (TIMESTAMP) - Data/hora da solicitação
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Relacionamentos:**
- Uma amizade tem um solicitante (N:1)
- Uma amizade tem um destinatário (N:1)
- Uma amizade pode estar relacionada a um evento (N:1, OPCIONAL)

**Constraints:**
- UNIQUE(solicitante_id, destinatario_id) - Não pode ter duplicatas
- CHECK(solicitante_id != destinatario_id) - Não pode ser amigo de si mesmo

---

### 6. Mensagem
Mensagem avulsa entre dois amigos.

**Campos:**
- `id` (UUID ou INT) - Identificador único
- `remetente_id` (FOREIGN KEY -> Usuario.id) - Quem enviou
- `destinatario_id` (FOREIGN KEY -> Usuario.id) - Quem recebeu
- `tipo` (ENUM: 'texto' | 'imagem' | 'arquivo') - Tipo de mensagem
- `conteudo` (TEXT) - Conteúdo da mensagem
- `anexo_url` (STRING, OPCIONAL) - URL do anexo (se houver)
- `lida` (BOOLEAN, DEFAULT false) - Se foi lida
- `timestamp` (TIMESTAMP) - Data/hora do envio
- `created_at` (TIMESTAMP) - Data de criação

**Relacionamentos:**
- Uma mensagem tem um remetente (N:1)
- Uma mensagem tem um destinatário (N:1)

---

### 7. Avaliacao
Avaliação de um evento feita por um participante.

**Campos:**
- `id` (UUID ou INT) - Identificador único
- `evento_id` (FOREIGN KEY -> Evento.id) - Evento avaliado
- `usuario_id` (FOREIGN KEY -> Usuario.id) - Avaliador
- `nota` (INT, 1-5) - Nota de 1 a 5
- `comentario` (TEXT, OPCIONAL) - Comentário da avaliação
- `timestamp` (TIMESTAMP) - Data/hora da avaliação
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Relacionamentos:**
- Uma avaliação pertence a um evento (N:1)
- Uma avaliação pertence a um usuário (N:1)

**Constraints:**
- UNIQUE(evento_id, usuario_id) - Um usuário só pode avaliar uma vez por evento
- CHECK(nota >= 1 AND nota <= 5) - Nota entre 1 e 5

---

### 8. Certificado
Certificado gerado para um participante de um evento.

**Campos:**
- `id` (UUID ou INT) - Identificador único
- `evento_id` (FOREIGN KEY -> Evento.id) - Evento relacionado
- `usuario_id` (FOREIGN KEY -> Usuario.id) - Participante
- `url_pdf` (STRING) - URL do arquivo PDF
- `data_emissao` (TIMESTAMP) - Data de emissão
- `codigo_validacao` (STRING, UNIQUE) - Código único para validação
- `created_at` (TIMESTAMP) - Data de criação

**Relacionamentos:**
- Um certificado pertence a um evento (N:1)
- Um certificado pertence a um usuário (N:1)

**Constraints:**
- UNIQUE(evento_id, usuario_id) - Um usuário só pode ter um certificado por evento

---

### 9. Notificacao
Notificações in-app do sistema.

**Campos:**
- `id` (UUID ou INT) - Identificador único
- `usuario_id` (FOREIGN KEY -> Usuario.id) - Destinatário
- `tipo` (ENUM) - Tipo de notificação (ver tipos abaixo)
- `titulo` (STRING) - Título da notificação
- `mensagem` (TEXT) - Conteúdo da notificação
- `lida` (BOOLEAN, DEFAULT false) - Se foi lida
- `link` (STRING, OPCIONAL) - Link relacionado (ex: /events/123)
- `created_at` (TIMESTAMP) - Data de criação

**Relacionamentos:**
- Uma notificação pertence a um usuário (N:1)

---

## Estados e Enums

### Estados de Evento
- `rascunho` - Evento criado mas não publicado
- `publicado` - Evento publicado mas inscrições ainda não abertas
- `inscricoes_abertas` - Inscrições abertas
- `inscricoes_fechadas` - Inscrições fechadas
- `em_andamento` - Evento acontecendo
- `finalizado` - Evento finalizado
- `arquivado` - Evento arquivado

### Estados de Inscrição
- `pendente` - Aguardando aprovação (se exige_aprovacao = true)
- `aguardando_pagamento` - Aguardando confirmação de pagamento (se evento pago)
- `aprovada` - Inscrição aprovada/confirmada
- `recusada` - Inscrição recusada pelo organizador
- `cancelada` - Inscrição cancelada pelo participante ou organizador
- `confirmada` - Inscrição confirmada (aprovada + pagamento confirmado, se aplicável)

### Estados de Amizade
- `pendente` - Solicitação pendente
- `aceita` - Amizade aceita
- `recusada` - Solicitação recusada
- `bloqueada` - Amizade bloqueada

### Tipos de Mensagem
- `texto` - Mensagem de texto simples
- `imagem` - Mensagem com imagem
- `arquivo` - Mensagem com arquivo anexo

### Tipos de Notificação
- `inscricao_recebida` - Nova inscrição recebida (organizador)
- `inscricao_aprovada` - Inscrição aprovada (participante)
- `inscricao_recusada` - Inscrição recusada (participante)
- `pagamento_confirmado` - Pagamento confirmado (participante)
- `evento_proximo` - Lembrete de evento próximo
- `certificado_disponivel` - Certificado disponível
- `nova_mensagem` - Nova mensagem recebida
- `pedido_amizade` - Novo pedido de amizade
- `amizade_aceita` - Pedido de amizade aceito
- `evento_finalizado` - Evento finalizado (pode avaliar)

---

## Diagrama de Relacionamentos (Texto)

```
Usuario (1) ----< (N) Evento
Usuario (1) ----< (N) Inscricao
Usuario (1) ----< (N) Mensagem (remetente)
Usuario (1) ----< (N) Mensagem (destinatario)
Usuario (1) ----< (N) Avaliacao
Usuario (1) ----< (N) Certificado
Usuario (1) ----< (N) Notificacao
Usuario (1) ----< (N) Amizade (solicitante)
Usuario (1) ----< (N) Amizade (destinatario)

Evento (1) ----< (N) Inscricao
Evento (1) ----< (N) Avaliacao
Evento (1) ----< (N) Certificado
Evento (1) ----< (N) Amizade (opcional)

Inscricao (1) ----< (N) CheckinRegistro
```

---

## Regras de Negócio Importantes

1. **Inscrição Automática vs Manual:**
   - Se `exige_aprovacao = false`: status inicial = `aprovada` (ou `aguardando_pagamento` se pago)
   - Se `exige_aprovacao = true`: status inicial = `pendente`

2. **Evento Pago:**
   - Status inicial da inscrição = `aguardando_pagamento`
   - Após organizador confirmar pagamento: status = `confirmada`

3. **Check-in:**
   - Só pode fazer check-in se inscrição estiver `aprovada` ou `confirmada`
   - Respeitar `n_checkins_permitidos` do evento
   - Incrementar `n_checkins_realizados` na inscrição

4. **Amizade:**
   - Só pode solicitar se ambos estiverem inscritos no mesmo evento
   - Ambos devem ter inscrição `aprovada` ou `confirmada`
   - Verificar `visibilidade_participacao` do destinatário

5. **Avaliação:**
   - Só pode avaliar se:
     - Evento estiver `finalizado`
     - Participante tiver feito pelo menos 1 check-in
     - Não tiver avaliado antes

6. **Certificado:**
   - Critérios configuráveis pelo organizador
   - Geralmente: pelo menos 1 check-in realizado
   - Evento deve estar `finalizado` ou próximo

7. **Capacidade Máxima:**
   - Se `max_inscricoes` definido e alcançado:
     - Novas inscrições = `recusada` (ou fila de espera futura)

---

## Índices Recomendados

- `Usuario.email` (UNIQUE)
- `Evento.organizador_id`
- `Evento.status`
- `Inscricao.evento_id`
- `Inscricao.usuario_id`
- `Inscricao.status`
- `CheckinRegistro.inscricao_id`
- `Amizade.solicitante_id`
- `Amizade.destinatario_id`
- `Mensagem.destinatario_id`
- `Mensagem.lida`
- `Avaliacao.evento_id`
- `Notificacao.usuario_id`
- `Notificacao.lida`



