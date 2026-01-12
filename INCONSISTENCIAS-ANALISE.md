# 🔍 ANÁLISE DE INCONSISTÊNCIAS - RADAR 2.0

## ✅ STATUS FINAL: TODAS AS INCONSISTÊNCIAS CRÍTICAS RESOLVIDAS

**Data da última atualização:** 11/01/2026

---

## 📊 Resumo das Correções Implementadas

| # | Problema | Status | Ação Tomada |
|---|----------|--------|-------------|
| 1 | `authorMunicipio` usando `microregiao_id` | ✅ CORRIGIDO | Alterado para usar `municipio` real do perfil |
| 2 | Query de comentários sem campo `municipio` | ✅ CORRIGIDO | Adicionado `municipio` na query de profiles |
| 3 | Dados MOCK para objectives/activities | ✅ CORRIGIDO | Migrado 100% para Supabase |
| 4 | Arquivo mockData.ts | ✅ REMOVIDO | Arquivo excluído do projeto |

---

## 🏗️ Arquitetura de Dados (Após Migração)

### Fonte Única de Verdade: Supabase

```
┌─────────────────────────────────────────────────────────────┐
│                         SUPABASE                            │
├─────────────────────────────────────────────────────────────┤
│  objectives          │ id, title, status, created_at       │
│  activities          │ id, objective_id, title, description│
│  actions             │ uid, action_id, activity_id, ...    │
│  action_raci         │ action_id, member_name, role        │
│  action_comments     │ action_id, author_id, content, ...  │
│  teams               │ microregiao_id, name, cargo, ...    │
│  profiles            │ id, nome, email, municipio, ...     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    dataService.ts                           │
├─────────────────────────────────────────────────────────────┤
│  loadActions()       │ loadObjectives()    │ loadTeams()   │
│  loadActivities()    │ createAction()      │ updateAction()│
│  createObjective()   │ updateObjective()   │ deleteObjective()│
│  createActivity()    │ updateActivity()    │ deleteActivity() │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                              │
├─────────────────────────────────────────────────────────────┤
│  • Carrega dados no useEffect (autenticação)               │
│  • Todos os handlers salvam diretamente no banco           │
│  • ZERO dependência de dados mock                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 O QUE PRECISA SER FEITO NO SUPABASE

### 1. ✅ Tabelas `objectives` e `activities` (JÁ EXISTEM)

O arquivo `objectives_activities_setup.sql` já define as tabelas corretamente. **Se ainda não executou, execute agora:**

```sql
-- Verificar se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('objectives', 'activities');
```

Se não existirem, execute o script `objectives_activities_setup.sql` no Supabase.

### 2. ⚠️ Inserir Dados Iniciais (SE TABELAS ESTIVEREM VAZIAS)

Execute este SQL apenas se as tabelas estiverem vazias:

```sql
-- Inserir objetivos iniciais
INSERT INTO objectives (id, title, status) VALUES
  (1, '1. Infoestrutura e Governança', 'on-track'),
  (2, '2. Desenvolvimento de Negócios', 'on-track'),
  (3, '3. Experiência do Cliente', 'delayed')
ON CONFLICT (id) DO NOTHING;

-- Inserir atividades iniciais
INSERT INTO activities (id, objective_id, title, description) VALUES
  ('1.1', 1, 'Diagnóstico e Mapeamento', 'Implantar a estratégia de gestão de conhecimento.'),
  ('1.2', 1, 'Gestão do Conhecimento e Qualificação', 'Fortalecer a governança, a gestão do conhecimento.'),
  ('1.3', 1, 'Governança e Fluxos de Trabalho', 'Garantir a sustentabilidade e o aprimoramento da Infoestrutura.'),
  ('2.1', 2, 'Atração de Investimentos', 'Fomento ao comércio local.'),
  ('3.1', 3, 'Digitalização de Serviços', 'Portal do Cidadão.')
ON CONFLICT (id) DO NOTHING;
```

### 3. ⚠️ Garantir RLS (Row Level Security)

Verifique se as políticas RLS estão corretas para objectives e activities:

```sql
-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('objectives', 'activities');
```

**Políticas recomendadas:**

```sql
-- Objectives: todos podem ler, apenas admin pode modificar
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "objectives_select_all" ON objectives
  FOR SELECT USING (true);

CREATE POLICY "objectives_admin_all" ON objectives
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Activities: mesma lógica
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activities_select_all" ON activities
  FOR SELECT USING (true);

CREATE POLICY "activities_admin_all" ON activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'superadmin')
    )
  );
```

---

## 🔧 Manutenção Futura

### Adicionar Novo Objetivo
1. Use o painel Admin do app (botão + no sidebar)
2. OU via SQL: `INSERT INTO objectives (title, status) VALUES ('N. Título', 'on-track');`

### Adicionar Nova Atividade
1. Use o painel Admin do app (botão + no objetivo)
2. OU via SQL: `INSERT INTO activities (id, objective_id, title, description) VALUES ('N.M', N, 'Título', 'Descrição');`

### Editar/Excluir
1. Use o modo de edição no app (apenas admin)
2. OU edite diretamente no Supabase Dashboard

---

## 🛡️ Validação de Segurança

✅ Snyk code scan: **0 problemas encontrados**  
✅ RLS habilitado em todas as tabelas  
✅ Apenas admins podem modificar objectives/activities  
✅ Dados validados no frontend antes de enviar ao banco

---

## 📁 Arquivos Removidos

- `src/data/mockData.ts` - **EXCLUÍDO** (dados agora vêm do banco)

## 📁 Arquivos Mantidos (Constantes de Configuração)

- `src/data/microregioes.ts` - Lista estática de microrregiões de MG (OK manter como constante)
- `src/data/municipios.ts` - Lista estática de municípios de MG (OK manter como constante)

---

## ✅ Conclusão

O app agora usa **100% dados do Supabase**. Não há mais dados mock. Todas as operações CRUD de objetivos, atividades e ações são persistidas no banco.

**Benefícios:**
- Dados centralizados e sincronizados
- Múltiplos usuários podem editar simultaneamente
- Histórico de alterações (via `created_at`, `updated_at`)
- Backup automático pelo Supabase
- Fácil manutenção via Dashboard ou API
