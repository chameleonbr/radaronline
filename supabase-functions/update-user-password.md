# Edge Function: update-user-password

## 📋 Instruções para criar no Supabase

1. Acesse o **Supabase Dashboard**
2. Vá em **Functions** > **Create new function**
3. Nome da função: `update-user-password`
4. Cole o código abaixo
5. Clique em **Deploy**

---

## 🔧 Código da Edge Function

```typescript
// supabase/functions/update-user-password/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.87.3';

// CORS Headers reutilizáveis
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Em produção, restrinja para seu domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  // Handle OPTIONS preflight para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Obter token de autorização
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autorização não fornecido' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Criar cliente Supabase com Admin API
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Configuração do Supabase não encontrada' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verificar se o usuário atual é admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: currentUser }, error: authError } = 
      await supabaseAdmin.auth.getUser(token);

    if (authError || !currentUser) {
      return new Response(
        JSON.stringify({ error: 'Não autenticado' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar se é admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Apenas administradores podem atualizar senhas' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parsear body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'JSON inválido' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { userId, password } = body;

    // ✅ Logs extras para debug
    console.log('[update-user-password] Requisição recebida:', { 
      userId, 
      adminId: currentUser.id,
      timestamp: new Date().toISOString()
    });

    // Validações
    if (!userId || !password) {
      return new Response(
        JSON.stringify({ error: 'userId e password são obrigatórios' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validar senha
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Senha deve ter no mínimo 6 caracteres' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Atualizar senha usando Admin API
    const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        password: password,
      }
    );

    if (updateError) {
      console.error('[update-user-password] Erro ao atualizar senha:', updateError);
      return new Response(
        JSON.stringify({ error: `Erro ao atualizar senha: ${updateError.message}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[update-user-password] Senha atualizada com sucesso:', { userId });

    // Retornar sucesso
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Senha atualizada com sucesso',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    // ✅ Logs extras para debug
    console.error('[update-user-password] Erro inesperado:', { 
      message: error.message, 
      stack: error.stack,
      userId: body?.userId 
    });
    return new Response(
      JSON.stringify({ error: `Erro inesperado: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
```

---

## ✅ Funcionalidades

- ✅ **CORS configurado** - Permite chamadas do frontend
- ✅ **Verificação de admin** - Apenas admins podem atualizar senhas
- ✅ **Validações** - Campos obrigatórios e senha mínima de 6 caracteres
- ✅ **Logs detalhados** - Facilita debug no Supabase Dashboard
- ✅ **Tratamento de erros** - Mensagens claras para o usuário
- ✅ **Segurança** - Usa Admin API apenas na Edge Function

---

## 🧪 Como testar

1. **Criar a função** no Supabase Dashboard (seguindo instruções acima)
2. **No app**: Editar um usuário e alterar a senha
3. **Verificar**: Tentar fazer login com a nova senha
4. **Logs**: Verificar logs no Supabase Dashboard > Functions > Logs

---

## 📝 Notas

- **CORS em produção**: Para maior segurança, altere `'*'` para seu domain específico
- **Timeout**: O frontend já tem timeout de 30s configurável via `VITE_API_TIMEOUT`
- **Logs**: Todos os logs aparecem no Supabase Dashboard > Functions > Logs

---

## 🔒 Segurança

- ✅ Apenas admins podem atualizar senhas
- ✅ Validação de token obrigatória
- ✅ Senha nunca exposta no frontend
- ✅ Admin API usado apenas na Edge Function (seguro)



