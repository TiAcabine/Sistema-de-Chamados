// API do GitHub para persistência de dados
class GitHubDataManager {
    constructor() {
        this.baseUrl = 'https://api.github.com';
        this.initialized = false;
    }

    // Inicializar conexão com GitHub
    async initialize() {
        if (this.initialized) return true;

        // Verificar se as configurações estão definidas
        if (GITHUB_CONFIG.owner === 'TiAcabine' || GITHUB_CONFIG.repo === 'Sistema-de-Chamado') {
            if (!setupRepository()) {
                throw new Error('Configuração do repositório cancelada');
            }
        }

        // Verificar se o token está configurado
        if (!getGitHubToken()) {
            throw new Error('Token do GitHub não configurado');
        }

        this.initialized = true;
        return true;
    }

    // Fazer requisição para a API do GitHub
    async makeRequest(endpoint, method = 'GET', data = null) {
        const token = getGitHubToken();
        if (!token) {
            throw new Error('Token do GitHub não encontrado');
        }

        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Token do GitHub inválido ou expirado');
            } else if (response.status === 404) {
                throw new Error('Repositório ou arquivo não encontrado');
            }
            throw new Error(`Erro na API do GitHub: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    // Obter conteúdo de um arquivo
    async getFile(filePath) {
        try {
            const endpoint = `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
            const response = await this.makeRequest(endpoint);
            
            // Decodificar conteúdo base64
            const content = atob(response.content);
            return {
                content: JSON.parse(content),
                sha: response.sha
            };
        } catch (error) {
            if (error.message.includes('404')) {
                // Arquivo não existe, retornar dados vazios
                return {
                    content: null,
                    sha: null
                };
            }
            throw error;
        }
    }

    // Salvar arquivo no repositório
    async saveFile(filePath, content, sha = null) {
        const endpoint = `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
        
        const data = {
            message: `Atualizar dados: ${filePath}`,
            content: btoa(JSON.stringify(content, null, 2)),
            branch: GITHUB_CONFIG.branch
        };

        if (sha) {
            data.sha = sha;
        }

        return await this.makeRequest(endpoint, 'PUT', data);
    }

    // Carregar dados atuais
    async loadCurrentData() {
        try {
            await this.initialize();
            const result = await this.getFile(GITHUB_CONFIG.files.currentData);
            return result.content || [];
        } catch (error) {
            console.error('Erro ao carregar dados atuais:', error);
            showNotification('Erro ao carregar dados do GitHub. Usando dados locais.', 'error');
            return [];
        }
    }

    // Salvar dados atuais
    async saveCurrentData(chamados) {
        try {
            await this.initialize();
            
            // Obter SHA atual do arquivo
            const currentFile = await this.getFile(GITHUB_CONFIG.files.currentData);
            
            await this.saveFile(GITHUB_CONFIG.files.currentData, chamados, currentFile.sha);
            showNotification('Dados salvos no GitHub com sucesso!', 'success');
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            showNotification(`Erro ao salvar no GitHub: ${error.message}`, 'error');
            return false;
        }
    }

    // Carregar dados arquivados
    async loadArchivedData() {
        try {
            await this.initialize();
            const result = await this.getFile(GITHUB_CONFIG.files.archivedData);
            return result.content || {};
        } catch (error) {
            console.error('Erro ao carregar dados arquivados:', error);
            return {};
        }
    }

    // Salvar dados arquivados
    async saveArchivedData(archivedData) {
        try {
            await this.initialize();
            
            // Obter SHA atual do arquivo
            const currentFile = await this.getFile(GITHUB_CONFIG.files.archivedData);
            
            await this.saveFile(GITHUB_CONFIG.files.archivedData, archivedData, currentFile.sha);
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados arquivados:', error);
            return false;
        }
    }

    // Verificar se o repositório está configurado corretamente
    async testConnection() {
        try {
            await this.initialize();
            const endpoint = `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`;
            await this.makeRequest(endpoint);
            return true;
        } catch (error) {
            console.error('Erro na conexão:', error);
            return false;
        }
    }
}

// Instância global do gerenciador
const githubManager = new GitHubDataManager();

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação se não existir
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(notification);
    }

    // Definir cor baseada no tipo
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    notification.style.transform = 'translateX(0)';

    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
    }, 5000);
}
