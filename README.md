# Sistema de Chamados TI

Sistema completo para gerenciamento de chamados técnicos com persistência de dados no GitHub.

## 🚀 Configuração Inicial

### 1. Configurar o Repositório GitHub

1. **Edite o arquivo `config.js`**:
   ```javascript
   const GITHUB_CONFIG = {
       owner: 'SEU_USUARIO_GITHUB',    // Ex: 'gabrielgambini'
       repo: 'SEU_REPOSITORIO',        // Ex: 'cadastro-chamados'
       branch: 'main',
       // ...
   };
   ```

### 2. Criar Token de Acesso GitHub

1. Vá para [GitHub.com](https://github.com) → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Clique em **"Generate new token (classic)"**
3. Configure:
   - **Nome**: "Sistema Chamados TI"
   - **Permissões**: Marque **"repo"** (acesso completo ao repositório)
4. Clique em **"Generate token"**
5. **Copie o token** (você só verá uma vez!)

### 3. Configurar no Sistema

1. Abra o site do sistema
2. Clique no botão **"⚙️ Configurar GitHub"**
3. Cole seu token quando solicitado
4. O sistema testará a conexão automaticamente

## 📊 Funcionalidades

### ✅ Persistência de Dados
- **Automática**: Todos os chamados são salvos automaticamente no GitHub
- **Sincronização**: Dados sincronizados entre todos os usuários
- **Backup Local**: Funciona offline com localStorage como backup
- **Arquivo Mensal**: Dados são arquivados automaticamente a cada mês

### 🔄 Sincronização
- **Botão Sincronizar**: Força sincronização manual com GitHub
- **Detecção Online/Offline**: Sincroniza automaticamente quando volta online
- **Merge Inteligente**: Combina dados locais e remotos sem duplicatas

### 📁 Estrutura de Dados no GitHub

O sistema criará automaticamente:
```
data/
├── chamados-atual.json     # Chamados do mês atual
└── arquivo-chamados.json   # Histórico arquivado por mês
```

## 🛠️ Como Usar

1. **Novo Chamado**: Clique em "➕ Novo Chamado"
2. **Visualizar**: Use a aba "🔍 Chamados" para ver todos os registros
3. **Concluir**: Clique em "✅ Concluir" para finalizar um chamado
4. **Arquivo**: Use "📁 Ver Arquivo" para consultar meses anteriores

## 🔐 Segurança

- Token armazenado localmente no navegador
- Comunicação criptografada com GitHub API
- Dados privados no seu repositório GitHub

## 🌐 Acesso Compartilhado

Tanto você quanto seu gestor podem:
- Acessar o site via GitHub Pages
- Ver todos os chamados salvos
- Adicionar novos chamados
- Consultar histórico arquivado

## ⚠️ Importante

- **Primeira configuração**: Configure o GitHub na primeira vez que usar
- **Token seguro**: Nunca compartilhe seu token de acesso
- **Backup**: O sistema mantém backup local automático
- **Sincronização**: Use o botão "🔄 Sincronizar" se houver problemas
