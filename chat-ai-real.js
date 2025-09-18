// Real AI Chat Integration for AnxietyFlow
// Supports multiple AI providers: OpenAI, Anthropic, Google Gemini, Local LLMs

class RealAIChatManager {
    constructor() {
        this.apiConfig = {
            // OpenAI Configuration
            openai: {
                apiKey: '', // Set in settings
                baseURL: 'https://api.openai.com/v1',
                model: 'gpt-3.5-turbo',
                maxTokens: 500,
                temperature: 0.7
            },
            
            // Anthropic Claude Configuration
            anthropic: {
                apiKey: '', // Set in settings
                baseURL: 'https://api.anthropic.com/v1',
                model: 'claude-3-haiku-20240307',
                maxTokens: 500
            },
            
            // Google Gemini Configuration
            gemini: {
                apiKey: '', // Set in settings
                baseURL: 'https://generativelanguage.googleapis.com/v1beta',
                model: 'gemini-pro'
            },
            
            // Ollama (Local LLM) Configuration
            ollama: {
                baseURL: 'http://localhost:11434/api',
                model: 'llama2:7b-chat'
            }
        };
        
        this.currentProvider = 'openai'; // Default provider
        this.systemPrompt = this.buildSystemPrompt();
        this.conversationHistory = [];
        this.isTyping = false;
    }

    buildSystemPrompt() {
        return `Eres un asistente especializado en ayudar a personas con ansiedad y ataques de pánico. Tu papel es:

CONTEXTO Y PROPÓSITO:
- Proporcionar apoyo emocional inmediato y técnicas de afrontamiento
- Usar principios de Terapia Cognitivo-Conductual (TCC)
- Ayudar con reestructuración cognitiva y técnicas de grounding
- Ofrecer psicoeducación sobre ansiedad y pánico

DIRECTRICES DE COMUNICACIÓN:
1. Sé empático, calmado y comprensivo
2. Usa un lenguaje claro y accesible
3. Proporciona respuestas estructuradas en 3-5 pasos máximo
4. Incluye técnicas prácticas inmediatas
5. Valida las emociones del usuario

TÉCNICAS A USAR:
- Respiración 4-7-8 y respiración diafragmática
- Grounding 5-4-3-2-1
- Reestructuración cognitiva
- Técnicas de relajación muscular progresiva
- Mindfulness y atención plena

LIMITACIONES IMPORTANTES:
- NO proporciones diagnósticos médicos
- NO reemplaces atención médica profesional
- Si detectas riesgo inmediato, recomienda buscar ayuda profesional
- Incluye disclaimer cuando sea apropiado

ESTRUCTURA DE RESPUESTA:
1. Validación emocional
2. Explicación breve del síntoma/situación
3. Técnica práctica inmediata
4. Reestructuración cognitiva si aplica
5. Seguimiento/próximos pasos

Responde siempre en español y mantén un tono profesional pero cercano.`;
    }

    async sendMessage(userMessage, provider = null) {
        const selectedProvider = provider || this.currentProvider;
        
        try {
            this.isTyping = true;
            this.showTypingIndicator();

            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage,
                timestamp: new Date().toISOString()
            });

            let response;
            switch (selectedProvider) {
                case 'openai':
                    response = await this.sendToOpenAI(userMessage);
                    break;
                case 'anthropic':
                    response = await this.sendToAnthropic(userMessage);
                    break;
                case 'gemini':
                    response = await this.sendToGemini(userMessage);
                    break;
                case 'ollama':
                    response = await this.sendToOllama(userMessage);
                    break;
                default:
                    throw new Error(`Proveedor no soportado: ${selectedProvider}`);
            }

            // Add AI response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString()
            });

            this.hideTypingIndicator();
            return response;

        } catch (error) {
            console.error('Error sending message to AI:', error);
            this.hideTypingIndicator();
            return this.getErrorResponse(error);
        } finally {
            this.isTyping = false;
        }
    }

    async sendToOpenAI(message) {
        const config = this.apiConfig.openai;
        
        if (!config.apiKey) {
            throw new Error('API key de OpenAI no configurada');
        }

        const messages = [
            { role: 'system', content: this.systemPrompt },
            ...this.getRecentHistory(),
            { role: 'user', content: message }
        ];

        const response = await fetch(`${config.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.model,
                messages: messages,
                max_tokens: config.maxTokens,
                temperature: config.temperature,
                stream: false
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async sendToAnthropic(message) {
        const config = this.apiConfig.anthropic;
        
        if (!config.apiKey) {
            throw new Error('API key de Anthropic no configurada');
        }

        const messages = [
            ...this.getRecentHistory(),
            { role: 'user', content: message }
        ];

        const response = await fetch(`${config.baseURL}/messages`, {
            method: 'POST',
            headers: {
                'x-api-key': config.apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: config.model,
                max_tokens: config.maxTokens,
                system: this.systemPrompt,
                messages: messages
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Anthropic API Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async sendToGemini(message) {
        const config = this.apiConfig.gemini;
        
        if (!config.apiKey) {
            throw new Error('API key de Google Gemini no configurada');
        }

        const prompt = `${this.systemPrompt}\n\nConversación anterior:\n${this.getHistoryAsText()}\n\nUsuario: ${message}\n\nAsistente:`;

        const response = await fetch(`${config.baseURL}/models/${config.model}:generateContent?key=${config.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 500
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async sendToOllama(message) {
        const config = this.apiConfig.ollama;
        
        const prompt = `${this.systemPrompt}\n\nConversación anterior:\n${this.getHistoryAsText()}\n\nUsuario: ${message}\n\nAsistente:`;

        const response = await fetch(`${config.baseURL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.model,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    max_tokens: 500
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response;
    }

    getRecentHistory(maxMessages = 6) {
        // Return recent conversation history for context
        return this.conversationHistory
            .slice(-maxMessages)
            .filter(msg => msg.role !== 'system');
    }

    getHistoryAsText() {
        return this.getRecentHistory()
            .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
            .join('\n');
    }

    getErrorResponse(error) {
        const errorMessages = {
            'API key': 'Por favor, configura tu API key en la sección de ajustes.',
            'Network': 'Error de conexión. Verifica tu conexión a internet.',
            'Rate limit': 'Has alcanzado el límite de mensajes. Intenta de nuevo en unos minutos.',
            'Quota': 'Has excedido tu cuota de API. Verifica tu plan.',
            'default': 'Ha ocurrido un error inesperado. Intenta de nuevo.'
        };

        const errorType = Object.keys(errorMessages).find(key => 
            error.message.toLowerCase().includes(key.toLowerCase())
        ) || 'default';

        return {
            content: `❌ **Error de conexión con IA**

${errorMessages[errorType]}

**Mientras tanto, aquí tienes algunas técnicas que puedes usar:**

🫁 **Respiración 4-7-8:**
1. Inhala por la nariz 4 segundos
2. Mantén 7 segundos
3. Exhala por la boca 8 segundos
4. Repite 4 veces

🖐️ **Grounding 5-4-3-2-1:**
- 5 cosas que puedes VER
- 4 cosas que puedes TOCAR
- 3 cosas que puedes OÍR
- 2 cosas que puedes OLER
- 1 cosa que puedes SABOREAR

💭 **Recuerda:**
- Los síntomas de ansiedad son temporales
- No son peligrosos, aunque se sientan intensos
- Tienes las herramientas para manejar esto

Si necesitas ayuda inmediata, contacta a un profesional o llama al 112.`,
            isError: true
        };
    }

    // Configuration methods
    setProvider(provider) {
        if (this.apiConfig[provider]) {
            this.currentProvider = provider;
            return true;
        }
        return false;
    }

    setAPIKey(provider, apiKey) {
        if (this.apiConfig[provider]) {
            this.apiConfig[provider].apiKey = apiKey;
            // Save to localStorage
            localStorage.setItem(`anxietyflow_${provider}_api_key`, apiKey);
            return true;
        }
        return false;
    }

    loadAPIKeys() {
        Object.keys(this.apiConfig).forEach(provider => {
            const savedKey = localStorage.getItem(`anxietyflow_${provider}_api_key`);
            if (savedKey) {
                this.apiConfig[provider].apiKey = savedKey;
            }
        });
    }

    // Test connection
    async testConnection(provider = null) {
        const testProvider = provider || this.currentProvider;
        
        try {
            const response = await this.sendMessage('Hola, ¿puedes confirmar que estás funcionando?', testProvider);
            return { success: true, response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // UI Helper methods
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const existingIndicator = document.getElementById('typing-indicator');
        if (existingIndicator) return;

        const typingEl = document.createElement('div');
        typingEl.id = 'typing-indicator';
        typingEl.className = 'chat-message assistant';
        typingEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <small style="color: var(--gray-500); margin-top: 8px; display: block;">
                    Consultando con IA especializada...
                </small>
            </div>
        `;

        messagesContainer.appendChild(typingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    clearHistory() {
        this.conversationHistory = [];
    }

    exportConversation() {
        const conversation = {
            timestamp: new Date().toISOString(),
            provider: this.currentProvider,
            messages: this.conversationHistory
        };

        const blob = new Blob([JSON.stringify(conversation, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anxietyflow-conversation-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Integration with existing chat system
class EnhancedChatManager extends ChatAIManager {
    constructor() {
        super();
        this.realAI = new RealAIChatManager();
        this.useRealAI = false;
        this.initializeEnhancedChat();
    }

    initializeEnhancedChat() {
        // Load API keys
        this.realAI.loadAPIKeys();
        
        // Check if real AI is configured
        this.checkAIConfiguration();
        
        // Add AI provider selector to chat interface
        this.addProviderSelector();
    }

    async sendMessage(text) {
        if (this.useRealAI && this.isAIConfigured()) {
            try {
                // Use real AI
                const response = await this.realAI.sendMessage(text);
                
                // Add user message
                this.addMessage('user', text);
                
                // Add AI response
                if (response.isError) {
                    this.addMessage('assistant', response.content);
                } else {
                    this.addMessage('assistant', {
                        text: response,
                        isFromRealAI: true
                    });
                }
                
                return;
            } catch (error) {
                console.error('Real AI failed, falling back to rule-based:', error);
                // Fall back to rule-based system
            }
        }
        
        // Use original rule-based system
        await super.sendMessage(text);
    }

    isAIConfigured() {
        const provider = this.realAI.currentProvider;
        const config = this.realAI.apiConfig[provider];
        return config.apiKey || provider === 'ollama';
    }

    checkAIConfiguration() {
        if (this.isAIConfigured()) {
            this.showAIStatus('configured', '✅ IA Real Configurada');
            this.useRealAI = localStorage.getItem('anxietyflow_use_real_ai') === 'true';
        } else {
            this.showAIStatus('not-configured', '⚠️ IA Real No Configurada');
            this.useRealAI = false;
        }
    }

    addProviderSelector() {
        const chatHeader = document.querySelector('.chat-header');
        if (!chatHeader) return;

        const aiControls = document.createElement('div');
        aiControls.className = 'ai-controls';
        aiControls.innerHTML = `
            <div class="ai-toggle">
                <label class="toggle-switch">
                    <input type="checkbox" id="use-real-ai" ${this.useRealAI ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">Usar IA Real</span>
            </div>
            
            <div class="ai-provider-selector" ${this.useRealAI ? '' : 'style="display: none;"'}>
                <select id="ai-provider">
                    <option value="openai">OpenAI GPT</option>
                    <option value="anthropic">Claude (Anthropic)</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="ollama">Ollama (Local)</option>
                </select>
            </div>
            
            <div class="ai-status" id="ai-status"></div>
        `;

        chatHeader.appendChild(aiControls);

        // Add event listeners
        document.getElementById('use-real-ai').addEventListener('change', (e) => {
            this.useRealAI = e.target.checked;
            localStorage.setItem('anxietyflow_use_real_ai', this.useRealAI);
            document.querySelector('.ai-provider-selector').style.display = 
                this.useRealAI ? 'block' : 'none';
        });

        document.getElementById('ai-provider').addEventListener('change', (e) => {
            this.realAI.setProvider(e.target.value);
            this.checkAIConfiguration();
        });

        // Set current provider
        document.getElementById('ai-provider').value = this.realAI.currentProvider;
        this.checkAIConfiguration();
    }

    showAIStatus(status, message) {
        const statusEl = document.getElementById('ai-status');
        if (statusEl) {
            statusEl.className = `ai-status ${status}`;
            statusEl.textContent = message;
        }
    }

    formatMessageContent(content) {
        if (typeof content === 'object' && content.isFromRealAI) {
            return `
                <div class="ai-response">
                    ${this.formatText(content.text)}
                    <div class="ai-badge">
                        <i class="fas fa-brain"></i>
                        Respuesta de IA especializada
                    </div>
                </div>
            `;
        }
        
        return super.formatMessageContent(content);
    }

    formatText(text) {
        // Enhanced text formatting for AI responses
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/(\d+\..*?)(?=\n|\d+\.)/g, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    }
}

// CSS for AI controls
const aiControlsCSS = `
.ai-controls {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-top: var(--space-4);
    padding: var(--space-4);
    background: var(--gray-50);
    border-radius: var(--radius-lg);
    border: 1px solid var(--gray-200);
}

.ai-toggle {
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--gray-300);
    transition: .4s;
    border-radius: 24px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .toggle-slider {
    background-color: var(--primary-500);
}

input:checked + .toggle-slider:before {
    transform: translateX(26px);
}

.toggle-label {
    font-weight: 500;
    color: var(--gray-700);
}

.ai-provider-selector select {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-md);
    background: white;
}

.ai-status {
    font-size: var(--text-sm);
    font-weight: 500;
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
}

.ai-status.configured {
    background: #dcfce7;
    color: #166534;
}

.ai-status.not-configured {
    background: #fef3c7;
    color: #92400e;
}

.ai-response {
    position: relative;
}

.ai-badge {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-xs);
    color: var(--primary-600);
    background: var(--primary-50);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    margin-top: var(--space-2);
    border: 1px solid var(--primary-200);
}

.typing-dots {
    display: flex;
    gap: 4px;
    padding: 8px 0;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    background: var(--primary-400);
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = aiControlsCSS;
document.head.appendChild(style);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RealAIChatManager, EnhancedChatManager };
}
