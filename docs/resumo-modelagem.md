# Resumo da Modelagem - EventSync AI

## 📊 9 Entidades Principais

1. **Usuario** - Usuários do sistema (organizadores e participantes)
2. **Evento** - Eventos criados pelos organizadores
3. **Inscricao** - Inscrições de participantes em eventos
4. **CheckinRegistro** - Registros de cada check-in realizado
5. **Amizade** - Relações de amizade entre usuários
6. **Mensagem** - Mensagens avulsas entre amigos
7. **Avaliacao** - Avaliações de eventos pelos participantes
8. **Certificado** - Certificados gerados em PDF
9. **Notificacao** - Notificações in-app do sistema

## 🔄 Estados Principais

### Evento
- `rascunho` → `publicado` → `inscricoes_abertas` → `em_andamento` → `finalizado` → `arquivado`

### Inscrição
- `pendente` → `aprovada` → (check-in) → (avaliação/certificado)
- `aguardando_pagamento` → `confirmada` → (check-in) → (avaliação/certificado)

### Amizade
- `pendente` → `aceita` ou `recusada`

## 🔗 Relacionamentos Chave

- **1 Usuário** pode criar **N Eventos**
- **1 Evento** pode ter **N Inscrições**
- **1 Inscrição** pode ter **N Check-ins**
- **1 Usuário** pode ter **N Amizades** (como solicitante ou destinatário)
- **1 Usuário** pode enviar/receber **N Mensagens**
- **1 Evento** pode ter **N Avaliações**
- **1 Evento** pode gerar **N Certificados**

## ✅ Regras Importantes

1. Inscrição automática → status `aprovada` imediatamente
2. Inscrição manual → status `pendente`, precisa aprovação
3. Evento pago → status `aguardando_pagamento`, precisa confirmação
4. Check-in só se inscrição `aprovada` ou `confirmada`
5. Amizade só se ambos inscritos no mesmo evento
6. Avaliação só após evento finalizado e com check-in
7. Certificado geralmente exige check-in realizado



