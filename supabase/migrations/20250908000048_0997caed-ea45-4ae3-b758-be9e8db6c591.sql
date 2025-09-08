-- Inserir usuário admin padrão para teste
-- Primeiro, criar o usuário auth (isso simularia um usuário já registrado)
-- Na prática, você criará o admin através do painel do Supabase Auth

-- Inserir um perfil admin de exemplo (você pode usar isso como referência)
-- Substitua o UUID abaixo pelo ID de um usuário real criado no Supabase Auth
-- Este é apenas um exemplo de como os dados ficariam organizados

-- Exemplo de como seria um perfil admin:
-- INSERT INTO public.profiles (user_id, full_name, email)
-- VALUES ('UUID-DO-USUARIO-ADMIN', 'Administrador do Sistema', 'admin@escola.com');

-- Exemplo de como seria a role do admin:
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('UUID-DO-USUARIO-ADMIN', 'admin');

-- Para criar um admin real, acesse:
-- 1. Supabase Dashboard > Authentication > Users
-- 2. Crie um novo usuário manualmente
-- 3. Copie o UUID do usuário
-- 4. Execute as consultas acima substituindo UUID-DO-USUARIO-ADMIN pelo UUID real
-- 5. Ou altere a role de um usuário existente de 'student' para 'admin'

-- Função auxiliar para promover usuário a admin (use com cuidado!)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(_user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_uuid UUID;
    result_text TEXT;
BEGIN
    -- Buscar o UUID do usuário pelo email
    SELECT au.id INTO user_uuid
    FROM auth.users au
    WHERE au.email = _user_email;
    
    IF user_uuid IS NULL THEN
        RETURN 'Usuário não encontrado com o email: ' || _user_email;
    END IF;
    
    -- Verificar se já é admin
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_uuid AND role = 'admin') THEN
        RETURN 'Usuário já é administrador';
    END IF;
    
    -- Adicionar role de admin (mantém a role de student também se existir)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_uuid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN 'Usuário promovido a administrador com sucesso!';
END;
$$;