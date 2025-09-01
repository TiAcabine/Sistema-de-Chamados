// Configuração do GitHub para persistência de dados
const GITHUB_CONFIG = {
    // Substitua pelos seus dados do repositório
    owner: 'TiAcabine',  // Ex: 'gabrielgambini'
    repo: 'Sistema-de-Chamados',      // Ex: 'cadastro-chamados'
    branch: 'main',               // ou 'master' dependendo do seu repositório
    
    // Token de acesso pessoal do GitHub (será solicitado ao usuário)
    token: null,
    
    // Arquivos de dados
    files: {
        currentData: 'data/chamados-atual.json',
        archivedData: 'data/arquivo-chamados.json'
    }
};

// Função para configurar o token do GitHub
function setupGitHubToken() {
    const token = prompt(`Para salvar os dados no GitHub, você precisa de um token de acesso pessoal.

Como criar:
1. Vá para GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Clique em "Generate new token (classic)"
3. Dê um nome como "Sistema Chamados TI"
4. Selecione as permissões: "repo" (acesso completo ao repositório)
5. Clique em "Generate token"
6. Copie o token gerado

Cole seu token aqui:`);
    
    if (token && token.trim()) {
        GITHUB_CONFIG.token = token.trim();
        localStorage.setItem('github_token', token.trim());
        return true;
    }
    return false;
}

// Função para obter o token (do localStorage ou solicitar novo)
function getGitHubToken() {
    if (GITHUB_CONFIG.token) {
        return GITHUB_CONFIG.token;
    }
    
    // Tentar carregar do localStorage
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
        GITHUB_CONFIG.token = savedToken;
        return savedToken;
    }
    
    // Solicitar novo token
    return setupGitHubToken() ? GITHUB_CONFIG.token : null;
}

// Função para configurar o repositório
function setupRepository() {
    const owner = prompt('Digite seu nome de usuário do GitHub:', GITHUB_CONFIG.owner);
    const repo = prompt('Digite o nome do seu repositório:', GITHUB_CONFIG.repo);
    
    if (owner && repo) {
        GITHUB_CONFIG.owner = owner;
        GITHUB_CONFIG.repo = repo;
        localStorage.setItem('github_owner', owner);
        localStorage.setItem('github_repo', repo);
        return true;
    }
    return false;
}

// Carregar configurações salvas
function loadSavedConfig() {
    const savedOwner = localStorage.getItem('github_owner');
    const savedRepo = localStorage.getItem('github_repo');
    
    if (savedOwner) GITHUB_CONFIG.owner = savedOwner;
    if (savedRepo) GITHUB_CONFIG.repo = savedRepo;
}

// Inicializar configuração
loadSavedConfig();
