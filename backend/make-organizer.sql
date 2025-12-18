-- Script SQL para tornar um usuário organizador
-- Execute este script no seu banco de dados PostgreSQL

-- Opção 1: Atualizar um usuário existente para ser organizador
-- Substitua 'seu@email.com' pelo email do usuário que você quer tornar organizador
UPDATE usuarios 
SET role = 'ORGANIZER' 
WHERE email = 'seu@email.com';

-- Opção 2: Ver todos os usuários e seus roles
SELECT id, nome, email, role FROM usuarios;

-- Opção 3: Criar um novo usuário organizador diretamente (senha: "organizador123")
-- Você precisará gerar o hash da senha primeiro usando bcrypt
-- Para facilitar, use a opção 1 ou registre normalmente e depois atualize o role




