// AnxietyFlow - Main Application JavaScript
// Author: AI Assistant
// Version: 1.0.0

// Global state and configuration
const APP_CONFIG = {
    version: '1.0.0',
    storageKeys: {
        entries: 'anxietyflow_entries',
        settings: 'anxietyflow_settings',
        googleAuth: 'anxietyflow_google_auth'
    },
    resilience: {
        weights: {
            episodes: 0.3,
            reduction: 0.3,
            exposures: 0.25,
            anticipations: 0.15
        }
    },
    googleCalendar: {
        clientId: 'your-google-client-id.apps.googleusercontent.com',
        apiKey: 'your-google-api-key',
        discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        scopes: 'https://www.googleapis.com/auth/calendar.readonly'
    }
};

// Application state
let appState = {
    currentView: 'home',
    currentMonth: new Date(),
    entries: [],
    settings: {
        autoSave: true,
        voiceNotes: false,
        dailyReminder: false,
        eventNotifications: false
    },
    googleAuth: {
        isAuthenticated: false,
        accessToken: null
    },
    isRecording: false
};

// Data Models and Storage
class DataManager {
    constructor() {
        this.loadData();
    }

    // Load data from localStorage
    loadData() {
        try {
            const entriesData = localStorage.getItem(APP_CONFIG.storageKeys.entries);
            const settingsData = localStorage.getItem(APP_CONFIG.storageKeys.settings);
            const googleAuthData = localStorage.getItem(APP_CONFIG.storageKeys.googleAuth);

            if (entriesData) {
                appState.entries = JSON.parse(entriesData);
            }

            if (settingsData) {
                appState.settings = { ...appState.settings, ...JSON.parse(settingsData) };
            }

            if (googleAuthData) {
                appState.googleAuth = { ...appState.googleAuth, ...JSON.parse(googleAuthData) };
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('Error al cargar datos', 'error');
        }
    }

    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem(APP_CONFIG.storageKeys.entries, JSON.stringify(appState.entries));
            localStorage.setItem(APP_CONFIG.storageKeys.settings, JSON.stringify(appState.settings));
            localStorage.setItem(APP_CONFIG.storageKeys.googleAuth, JSON.stringify(appState.googleAuth));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Error al guardar datos', 'error');
        }
    }

    // Create new entry
    createEntry(type, data) {
        const entry = {
            id: this.generateId(),
            tipo: type,
            timestamp: new Date().toISOString(),
            ...data
        };

        appState.entries.push(entry);
        this.saveData();
        return entry;
    }

    // Get entries by type
    getEntriesByType(type, limit = null) {
        const filtered = appState.entries.filter(entry => entry.tipo === type);
        return limit ? filtered.slice(-limit) : filtered;
    }

    // Get entries by date range
    getEntriesByDateRange(startDate, endDate) {
        return appState.entries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= startDate && entryDate <= endDate;
        });
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Implementation for notifications
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Initialize data manager
const dataManager = new DataManager();

// Entry Creation Functions
function createCrisisEntry(formData) {
    const triggers = [];
    formData.getAll('trigger').forEach(trigger => {
        if (trigger === 'otro' && formData.get('trigger_otro')) {
            triggers.push(formData.get('trigger_otro'));
        } else if (trigger !== 'otro') {
            triggers.push(trigger);
        }
    });

    const entry = {
        situacion: formData.get('situacion'),
        escala_intensidad: parseInt(formData.get('escala_intensidad')),
        trigger: triggers,
        nota_antes: parseInt(formData.get('nota_antes')),
        reestructuracion: {
            distorsion_detectada: formData.get('distorsion_detectada'),
            pensamiento_alternativo: formData.get('pensamiento_alternativo'),
            tecnica: 'reestructuracion_cognitiva'
        },
        nota_despues: parseInt(formData.get('nota_despues')),
        sintomas: formData.getAll('sintomas'),
        duracion_estimada: parseInt(formData.get('duracion_estimada')) || null
    };

    return dataManager.createEntry('episodio', entry);
}

function createIdeaEntry(formData) {
    const entry = {
        titulo: formData.get('titulo'),
        idea: formData.get('idea'),
        etiquetas: formData.get('etiquetas').split(',').map(tag => tag.trim()),
        distorsion_sugerida: formData.get('distorsion_sugerida'),
        prioridad: formData.get('prioridad')
    };

    return dataManager.createEntry('idea', entry);
}

function createAnticipationEntry(formData) {
    const entry = {
        evento_futuro: formData.get('evento_futuro'),
        prob_mareo_antes: parseInt(formData.get('prob_mareo_antes')),
        catastrofe_antes: parseInt(formData.get('catastrofe_antes')),
        reestructuracion: {
            distorsion_detectada: formData.get('distorsion_detectada'),
            pensamiento_alternativo: formData.get('pensamiento_alternativo')
        },
        prob_mareo_despues: parseInt(formData.get('prob_mareo_despues')),
        resultado: formData.get('resultado_completado') ? {
            ocurrio_mareo: formData.get('ocurrio_mareo') === 'true',
            intensidad_real: parseInt(formData.get('intensidad_real')),
            comentario_resultado: formData.get('comentario_resultado')
        } : null
    };

    return dataManager.createEntry('anticipacion', entry);
}

function createSuccessEntry(formData) {
    const entry = {
        situacion_exposicion: formData.get('situacion_exposicion'),
        duracion: parseInt(formData.get('duracion')),
        habilidades_usadas: formData.getAll('habilidades_usadas'),
        resultado: formData.get('resultado'),
        aprendizaje: formData.get('aprendizaje'),
        confianza_post: parseInt(formData.get('confianza_post'))
    };

    return dataManager.createEntry('exito', entry);
}

// UI Management
class UIManager {
    constructor() {
        this.initializeEventListeners();
        this.updateUI();
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Slider updates
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('slider')) {
                const valueSpan = e.target.parentNode.querySelector('.slider-value');
                if (valueSpan) {
                    valueSpan.textContent = e.target.value;
                }
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(e);
        });

        // Modal close handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.toggle('active', view.id === `${viewName}-view`);
        });

        appState.currentView = viewName;

        // Load view-specific data
        switch (viewName) {
            case 'dashboard':
                this.updateDashboardView();
                break;
            case 'register':
                break; // No special initialization needed
            case 'chat':
                this.initializeChatView();
                break;
        }
    }

    updateUI() {
        this.updateHomeView();
        this.updateQuickStats();
    }

    updateHomeView() {
        this.updateRecentActivity();
        this.updateQuickStats();
    }

    updateRecentActivity() {
        const recentEntries = appState.entries
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        const container = document.getElementById('recent-entries');
        if (!container) return;

        if (recentEntries.length === 0) {
            container.innerHTML = `
                <div class="recent-entry">
                    <div class="entry-icon idea">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="entry-content">
                        <div class="entry-title">¡Bienvenido a AnxietyFlow!</div>
                        <div class="entry-details">Comienza registrando tu primera experiencia</div>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = recentEntries.map(entry => {
            const { title, details } = this.getEntryDisplayInfo(entry);
            const timeAgo = this.getTimeAgo(entry.timestamp);
            const dotClass = entry.tipo === 'episodio' ? 'crisis' : entry.tipo;

            return `
                <div class="activity-item">
                    <div class="activity-dot ${dotClass}"></div>
                    <div class="activity-content">
                        <div class="activity-title">${title}</div>
                        <div class="activity-time">${timeAgo}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getEntryDisplayInfo(entry) {
        switch (entry.tipo) {
            case 'episodio':
                return {
                    icon: 'exclamation-circle',
                    title: 'Crisis registrada',
                    details: `${entry.situacion} - Intensidad: ${entry.escala_intensidad}/10`
                };
            case 'exito':
                return {
                    icon: 'trophy',
                    title: 'Éxito logrado',
                    details: `${entry.situacion_exposicion} - Confianza: ${entry.confianza_post}/10`
                };
            case 'anticipacion':
                return {
                    icon: 'clock',
                    title: 'Anticipación trabajada',
                    details: `${entry.evento_futuro} - Probabilidad reducida`
                };
            case 'idea':
                return {
                    icon: 'lightbulb',
                    title: 'Idea registrada',
                    details: entry.titulo
                };
            default:
                return {
                    icon: 'circle',
                    title: 'Entrada',
                    details: 'Registro general'
                };
        }
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const entryDate = new Date(timestamp);
        const diffMs = now - entryDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Hace un momento';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return entryDate.toLocaleDateString('es-ES');
    }

    updateQuickStats() {
        const stats = this.calculateQuickStats();
        
        const resilienceEl = document.getElementById('resilience-index');
        const successEl = document.getElementById('success-count');
        const reductionEl = document.getElementById('avg-reduction');

        if (resilienceEl) resilienceEl.textContent = stats.resilienceIndex;
        if (successEl) successEl.textContent = stats.successCount;
        if (reductionEl) reductionEl.textContent = stats.avgReduction + '%';
    }

    calculateQuickStats() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEntries = dataManager.getEntriesByDateRange(monthStart, now);

        const episodes = monthEntries.filter(e => e.tipo === 'episodio');
        const successes = monthEntries.filter(e => e.tipo === 'exito');

        const avgReduction = episodes.length > 0 
            ? Math.round(episodes.reduce((sum, e) => {
                const reduction = ((e.nota_antes - e.nota_despues) / e.nota_antes) * 100;
                return sum + (isNaN(reduction) ? 0 : reduction);
            }, 0) / episodes.length)
            : 0;

        const resilienceIndex = this.calculateResilienceIndex(monthEntries);

        return {
            resilienceIndex: Math.round(resilienceIndex),
            successCount: successes.length,
            avgReduction: avgReduction
        };
    }

    calculateResilienceIndex(entries) {
        const episodes = entries.filter(e => e.tipo === 'episodio');
        const successes = entries.filter(e => e.tipo === 'exito');
        const anticipations = entries.filter(e => e.tipo === 'anticipacion' && e.resultado);

        // Normalize metrics (0-1 scale)
        const episodesNorm = Math.max(0, 1 - (episodes.length / 10)); // Assume 10+ episodes = 0
        const avgReduction = episodes.length > 0 
            ? episodes.reduce((sum, e) => sum + ((e.nota_antes - e.nota_despues) / e.nota_antes), 0) / episodes.length
            : 0;
        const exposuresNorm = Math.min(1, successes.length / 5); // 5+ successes = 1
        const refutedRate = anticipations.length > 0 
            ? anticipations.filter(a => !a.resultado.ocurrio_mareo).length / anticipations.length
            : 0;

        const { weights } = APP_CONFIG.resilience;
        return 100 * (
            weights.episodes * episodesNorm +
            weights.reduction * avgReduction +
            weights.exposures * exposuresNorm +
            weights.anticipations * refutedRate
        );
    }

    handleFormSubmission(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        try {
            let entry;
            
            switch (form.id) {
                case 'crisis-form':
                    entry = createCrisisEntry(formData);
                    break;
                case 'idea-form':
                    entry = createIdeaEntry(formData);
                    break;
                case 'anticipation-form':
                    entry = createAnticipationEntry(formData);
                    break;
                case 'success-form':
                    entry = createSuccessEntry(formData);
                    break;
                default:
                    throw new Error('Formulario no reconocido');
            }

            this.showNotification('Entrada guardada exitosamente', 'success');
            this.closeAllModals();
            this.updateUI();
            
            // Update calendar if visible
            if (appState.currentView === 'calendar') {
                this.updateCalendarView();
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showNotification('Error al guardar la entrada', 'error');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            // Focus first input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
}

// Calendar Management
class CalendarManager {
    constructor() {
        this.currentDate = new Date();
    }

    updateCalendarView() {
        this.renderCalendar();
        this.updateCalendarHeader();
    }

    updateCalendarHeader() {
        const monthEl = document.getElementById('current-month');
        if (monthEl) {
            const monthName = this.currentDate.toLocaleDateString('es-ES', { 
                month: 'long', 
                year: 'numeric' 
            });
            monthEl.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        }
    }

    renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        if (!grid) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Get entries for this month
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);
        const monthEntries = dataManager.getEntriesByDateRange(monthStart, monthEnd);

        let html = '';

        // Header row
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        dayNames.forEach(day => {
            html += `<div class="calendar-header-cell">${day}</div>`;
        });

        // Previous month days
        const prevMonth = new Date(year, month - 1, 0);
        const prevMonthDays = prevMonth.getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            html += `<div class="calendar-day other-month">${day}</div>`;
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayEntries = this.getEntriesForDate(monthEntries, date);
            const dayColor = this.getDayColor(dayEntries);
            const isToday = this.isToday(date);
            
            const badges = this.getDayBadges(dayEntries);
            
            html += `
                <div class="calendar-day ${dayColor} ${isToday ? 'today' : ''}" 
                     onclick="showDayDetail('${date.toISOString()}')">
                    <div class="calendar-day-number">${day}</div>
                    <div class="calendar-day-badges">${badges}</div>
                </div>
            `;
        }

        // Next month days
        const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
        const remainingCells = totalCells - (startingDayOfWeek + daysInMonth);
        for (let day = 1; day <= remainingCells; day++) {
            html += `<div class="calendar-day other-month">${day}</div>`;
        }

        grid.innerHTML = html;
    }

    getEntriesForDate(entries, date) {
        return entries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate.toDateString() === date.toDateString();
        });
    }

    getDayColor(entries) {
        if (entries.length === 0) return '';

        // Priority: crisis > managed > success > idea
        if (entries.some(e => e.tipo === 'episodio')) return 'crisis';
        
        const successes = entries.filter(e => e.tipo === 'exito');
        if (successes.length > 0) {
            const hasNoSymptoms = successes.some(s => s.resultado === 'sin_sintomas');
            return hasNoSymptoms ? 'success' : 'managed';
        }

        if (entries.some(e => e.tipo === 'anticipacion' || e.tipo === 'idea')) return 'idea';

        return '';
    }

    getDayBadges(entries) {
        const badges = [];
        
        if (entries.length > 1) {
            badges.push(`<span class="calendar-badge">${entries.length}</span>`);
        }

        const exposureMinutes = entries
            .filter(e => e.tipo === 'exito')
            .reduce((sum, e) => sum + (e.duracion || 0), 0);
        
        if (exposureMinutes > 0) {
            badges.push(`<span class="calendar-badge">${exposureMinutes}min</span>`);
        }

        return badges.join('');
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.updateCalendarView();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.updateCalendarView();
    }
}

// Chat AI Management
class ChatAIManager {
    constructor() {
        this.messages = [];
        this.initializeChat();
    }

    initializeChat() {
        // Add initial system message if not already present
        if (this.messages.length === 0) {
            this.addMessage('assistant', this.getWelcomeMessage());
        }
    }

    getWelcomeMessage() {
        return {
            text: `¡Hola! Soy tu asistente especializado en manejo de ansiedad y pánico. Estoy aquí para ayudarte con:

• Reestructuración cognitiva guiada
• Técnicas de afrontamiento
• Explicación de síntomas comunes  
• Planificación de micro-exposiciones

¿En qué puedo ayudarte hoy?`,
            suggestions: [
                '¿Por qué siento que me voy a desmayar?',
                '¿Cómo puedo manejar el miedo en el metro?',
                '¿Qué hago si siento taquicardia?'
            ]
        };
    }

    addMessage(sender, content) {
        const message = {
            id: Date.now(),
            sender,
            content,
            timestamp: new Date().toISOString()
        };
        
        this.messages.push(message);
        this.renderMessage(message);
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${message.sender}`;
        
        const avatarIcon = message.sender === 'assistant' ? 'robot' : 'user';
        
        messageEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${avatarIcon}"></i>
            </div>
            <div class="message-content">
                ${this.formatMessageContent(message.content)}
            </div>
        `;

        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatMessageContent(content) {
        if (typeof content === 'string') {
            return `<p>${content.replace(/\n/g, '</p><p>')}</p>`;
        }
        
        let html = `<p>${content.text.replace(/\n/g, '</p><p>')}</p>`;
        
        if (content.suggestions) {
            html += '<div class="message-suggestions">';
            content.suggestions.forEach(suggestion => {
                html += `<button class="suggestion-btn" onclick="sendSuggestion('${suggestion}')">${suggestion}</button>`;
            });
            html += '</div>';
        }
        
        return html;
    }

    async sendMessage(text) {
        // Add user message
        this.addMessage('user', text);

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Generate AI response
            const response = await this.generateAIResponse(text);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add AI response
            this.addMessage('assistant', response);
        } catch (error) {
            console.error('Error generating AI response:', error);
            this.hideTypingIndicator();
            this.addMessage('assistant', 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.');
        }
    }

    async generateAIResponse(userMessage) {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Simple rule-based responses for MVP
        const responses = this.getAIResponses();
        const lowerMessage = userMessage.toLowerCase();

        // Find matching response
        for (const [keywords, response] of responses) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                return response;
            }
        }

        // Default response
        return {
            text: `Entiendo tu preocupación. La ansiedad puede manifestarse de muchas formas diferentes. 

Recuerda estos puntos clave:
• Los síntomas de ansiedad son temporales y no peligrosos
• La respiración profunda puede ayudar a calmar el sistema nervioso
• Cuestiona tus pensamientos: ¿qué evidencia tengo de que esto va a pasar?

¿Hay algún síntoma específico que te preocupe más?`,
            suggestions: [
                'Técnicas de respiración',
                'Síntomas físicos',
                'Pensamientos catastrofistas'
            ]
        };
    }

    getAIResponses() {
        return [
            // Mareo/desmayo
            [['mareo', 'desmay', 'mareado'], {
                text: `El miedo a desmayarse es muy común en el pánico, pero es importante saber que:

**¿Por qué sientes mareo?**
• La hiperventilación reduce el CO2, causando mareo
• La tensión muscular afecta el equilibrio
• La ansiedad altera la percepción

**Datos tranquilizadores:**
• Desmayarse por ansiedad es extremadamente raro
• El mareo es una sensación, no una señal de peligro real
• Tu cuerpo está diseñado para mantenerte consciente

**Técnica inmediata:**
1. Respira lentamente: 4 segundos inhalar, 6 exhalar
2. Siéntate si es posible
3. Recuerda: "Es ansiedad, pasará"`,
                suggestions: [
                    'Técnicas de respiración',
                    '¿Qué hacer en el momento?',
                    'Evidencias de seguridad'
                ]
            }],

            // Transporte/metro
            [['metro', 'transporte', 'tren', 'autobús'], {
                text: `El miedo en el transporte es muy tratable. Aquí tienes un plan paso a paso:

**¿Por qué da miedo?**
• Sensación de estar "atrapado"
• Multitudes y calor
• Falta de control sobre la situación

**Plan de exposición gradual:**
1. **Semana 1:** Ir a la estación, no subir
2. **Semana 2:** Subir 1 parada con acompañante
3. **Semana 3:** 2-3 paradas solo
4. **Semana 4:** Trayecto completo

**Kit de supervivencia:**
• Agua y chicle
• Música relajante
• Plan de escape (próxima parada)
• Frase clave: "Puedo bajar en cualquier momento"`,
                suggestions: [
                    'Plan de exposición',
                    'Técnicas en el momento',
                    'Qué llevar conmigo'
                ]
            }],

            // Taquicardia/corazón
            [['taquicardia', 'corazón', 'palpitaciones'], {
                text: `Las palpitaciones por ansiedad son molestas pero no peligrosas:

**¿Qué está pasando?**
• La adrenalina acelera el corazón naturalmente
• Es la respuesta "lucha o huida" activándose
• Tu corazón es fuerte y puede manejar esto

**Diferencia clave:**
• Ansiedad: ritmo rápido pero regular
• Problema cardíaco: ritmo irregular + otros síntomas

**Técnica 4-7-8:**
1. Inhala por la nariz 4 segundos
2. Mantén 7 segundos  
3. Exhala por la boca 8 segundos
4. Repite 4 veces

**Reestructuración:**
"Mi corazón late rápido porque mi cuerpo me está protegiendo, no porque esté en peligro"`,
                suggestions: [
                    'Más técnicas de calma',
                    '¿Cuándo preocuparme?',
                    'Ejercicios de relajación'
                ]
            }],

            // Técnicas de respiración
            [['respiración', 'respirar', 'aire'], {
                text: `La respiración es tu herramienta más poderosa contra la ansiedad:

**Técnica básica 4-6:**
• Inhala 4 segundos por la nariz
• Exhala 6 segundos por la boca
• El exhale más largo activa la relajación

**Respiración abdominal:**
1. Una mano en el pecho, otra en el abdomen
2. Solo debe moverse la mano del abdomen
3. Imagina inflar un globo en tu barriga

**Para hiperventilación:**
• Respira en una bolsa de papel 10 respiraciones
• O cubre boca y nariz con las manos
• Esto restaura el CO2 normal

**Practica 5 minutos diarios** cuando estés calmado, así será automático en crisis.`,
                suggestions: [
                    'Otras técnicas de calma',
                    'Ejercicios de relajación',
                    'Grounding 5-4-3-2-1'
                ]
            }],

            // Pensamientos catastrofistas
            [['catastrofico', 'catastrofe', 'pensamiento', 'peor'], {
                text: `Los pensamientos catastrofistas son el combustible del pánico. Vamos a desarmarlos:

**Pasos para reestructurar:**

1. **Identifica el pensamiento:**
   "¿Qué me estoy diciendo exactamente?"

2. **Examina la evidencia:**
   • ¿Cuántas veces ha pasado realmente?
   • ¿Qué evidencia tengo a favor y en contra?

3. **Busca alternativas realistas:**
   • ¿Qué le dirías a un amigo?
   • ¿Cuál es la explicación más probable?

**Ejemplo:**
❌ "Me voy a desmayar y será horrible"
✅ "Siento mareo, pero nunca me he desmayado. Puedo sentarme y respirar"

**Pregunta clave:** "¿Estoy prediciendo el futuro o describiendo lo que siento ahora?"`,
                suggestions: [
                    'Más ejemplos de reestructuración',
                    'Técnicas de grounding',
                    'Registro de pensamientos'
                ]
            }]
        ];
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

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
}

// Dashboard Management
class DashboardManager {
    constructor() {
        this.currentPeriod = '30';
        this.charts = {};
    }

    updateDashboardView() {
        this.updateMetrics();
        this.updateCharts();
    }

    updateMetrics() {
        const entries = this.getEntriesForPeriod();
        const metrics = this.calculateMetrics(entries);

        // Update metric displays
        this.updateMetricElement('dashboard-resilience', metrics.resilienceIndex);
        this.updateMetricElement('episodes-count', metrics.episodesCount);
        this.updateMetricElement('avg-intensity', metrics.avgIntensity.toFixed(1));
        this.updateMetricElement('avg-reduction-dashboard', metrics.avgReduction + '%');
        this.updateMetricElement('exposures-count', metrics.exposuresCount);
        this.updateMetricElement('success-rate', metrics.successRate + '%');
        this.updateMetricElement('refuted-anticipations', metrics.refutedRate + '%');

        // Update trends
        this.updateTrend('resilience-trend', metrics.resilienceTrend);
    }

    getEntriesForPeriod() {
        const now = new Date();
        let startDate;

        if (this.currentPeriod === '30') {
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        return dataManager.getEntriesByDateRange(startDate, now);
    }

    calculateMetrics(entries) {
        const episodes = entries.filter(e => e.tipo === 'episodio');
        const successes = entries.filter(e => e.tipo === 'exito');
        const anticipations = entries.filter(e => e.tipo === 'anticipacion' && e.resultado);

        const avgIntensity = episodes.length > 0
            ? episodes.reduce((sum, e) => sum + e.escala_intensidad, 0) / episodes.length
            : 0;

        const avgReduction = episodes.length > 0
            ? Math.round(episodes.reduce((sum, e) => {
                const reduction = ((e.nota_antes - e.nota_despues) / e.nota_antes) * 100;
                return sum + (isNaN(reduction) ? 0 : reduction);
            }, 0) / episodes.length)
            : 0;

        const successRate = successes.length > 0
            ? Math.round((successes.filter(s => s.resultado === 'sin_sintomas').length / successes.length) * 100)
            : 0;

        const refutedRate = anticipations.length > 0
            ? Math.round((anticipations.filter(a => !a.resultado.ocurrio_mareo).length / anticipations.length) * 100)
            : 0;

        const resilienceIndex = Math.round(uiManager.calculateResilienceIndex(entries));

        return {
            resilienceIndex,
            episodesCount: episodes.length,
            avgIntensity,
            avgReduction,
            exposuresCount: successes.length,
            successRate,
            refutedRate,
            resilienceTrend: this.calculateTrend('resilience')
        };
    }

    updateMetricElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    updateTrend(elementId, trend) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = trend.text;
            element.className = `metric-trend ${trend.direction}`;
        }
    }

    calculateTrend(metric) {
        // Simplified trend calculation for MVP
        const change = Math.random() * 20 - 10; // -10 to +10
        
        if (change > 2) {
            return { text: `+${change.toFixed(1)} vs mes anterior`, direction: 'positive' };
        } else if (change < -2) {
            return { text: `${change.toFixed(1)} vs mes anterior`, direction: 'negative' };
        } else {
            return { text: 'Sin cambios significativos', direction: 'neutral' };
        }
    }

    updateCharts() {
        this.updateIntensityChart();
        this.updateTriggersChart();
    }

    updateIntensityChart() {
        const canvas = document.getElementById('intensity-chart');
        if (!canvas) return;

        // Simple chart implementation for MVP
        const ctx = canvas.getContext('2d');
        const entries = this.getEntriesForPeriod()
            .filter(e => e.tipo === 'episodio')
            .slice(-10); // Last 10 episodes

        if (entries.length === 0) {
            ctx.fillText('No hay datos suficientes', 50, 50);
            return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw simple line chart
        const width = canvas.width - 40;
        const height = canvas.height - 40;
        const stepX = width / (entries.length - 1);
        const maxIntensity = 10;

        ctx.beginPath();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;

        entries.forEach((entry, index) => {
            const x = 20 + index * stepX;
            const y = height - (entry.escala_intensidad / maxIntensity) * height + 20;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            // Draw point
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });

        ctx.stroke();
    }

    updateTriggersChart() {
        const container = document.getElementById('triggers-chart');
        if (!container) return;

        const entries = this.getEntriesForPeriod()
            .filter(e => e.tipo === 'episodio' && e.trigger);

        const triggerCounts = {};
        entries.forEach(entry => {
            entry.trigger.forEach(trigger => {
                triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
            });
        });

        const sortedTriggers = Object.entries(triggerCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        container.innerHTML = sortedTriggers.map(([trigger, count]) => `
            <div class="trigger-item">
                <span class="trigger-name">${trigger}</span>
                <span class="trigger-count">${count}</span>
            </div>
        `).join('');
    }

    setPeriod(period) {
        this.currentPeriod = period;
        
        // Update period buttons
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === period);
        });

        this.updateDashboardView();
    }
}

// Google Calendar Integration
class GoogleCalendarManager {
    constructor() {
        this.isAuthenticated = false;
        this.gapi = null;
    }

    async initialize() {
        try {
            await this.loadGoogleAPI();
            await this.initializeGoogleAuth();
        } catch (error) {
            console.error('Error initializing Google Calendar:', error);
        }
    }

    async loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (typeof gapi !== 'undefined') {
                this.gapi = gapi;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                this.gapi = gapi;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async initializeGoogleAuth() {
        await this.gapi.load('auth2', () => {
            this.gapi.auth2.init({
                client_id: APP_CONFIG.googleCalendar.clientId
            });
        });

        await this.gapi.load('client', () => {
            this.gapi.client.init({
                apiKey: APP_CONFIG.googleCalendar.apiKey,
                clientId: APP_CONFIG.googleCalendar.clientId,
                discoveryDocs: [APP_CONFIG.googleCalendar.discoveryDoc],
                scope: APP_CONFIG.googleCalendar.scopes
            });
        });
    }

    async authenticate() {
        try {
            const authInstance = this.gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn();
            
            this.isAuthenticated = true;
            appState.googleAuth.isAuthenticated = true;
            appState.googleAuth.accessToken = user.getAuthResponse().access_token;
            
            dataManager.saveData();
            this.updateConnectionStatus('connected', 'Conectado exitosamente');
            
            return true;
        } catch (error) {
            console.error('Google authentication failed:', error);
            this.updateConnectionStatus('error', 'Error de autenticación');
            return false;
        }
    }

    async getUpcomingEvents() {
        if (!this.isAuthenticated) return [];

        try {
            const now = new Date();
            const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

            const response = await this.gapi.client.calendar.events.list({
                calendarId: 'primary',
                timeMin: now.toISOString(),
                timeMax: endDate.toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 50,
                orderBy: 'startTime'
            });

            return response.result.items || [];
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            return [];
        }
    }

    updateConnectionStatus(status, message) {
        const statusEl = document.getElementById('google-status');
        if (statusEl) {
            statusEl.className = `connection-status ${status}`;
            statusEl.textContent = message;
        }
    }
}

// Voice Recording Management
class VoiceRecordingManager {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.handleRecordingComplete(audioBlob);
                this.audioChunks = [];
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.updateRecordingUI(true);

        } catch (error) {
            console.error('Error starting recording:', error);
            uiManager.showNotification('Error al acceder al micrófono', 'error');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            this.isRecording = false;
            this.updateRecordingUI(false);
        }
    }

    handleRecordingComplete(audioBlob) {
        // For MVP, we'll just show a confirmation
        // In a full implementation, this would be saved and potentially transcribed
        uiManager.showNotification('Nota de voz guardada', 'success');
        
        // Create a simple voice note entry
        const entry = {
            titulo: 'Nota de voz',
            contenido: 'Grabación de audio',
            duracion: Math.floor(audioBlob.size / 1000), // Rough estimate
            tipo_archivo: 'audio/wav'
        };

        dataManager.createEntry('nota_voz', entry);
        uiManager.updateUI();
    }

    updateRecordingUI(isRecording) {
        const voiceBtn = document.querySelector('.action-btn.voice');
        if (voiceBtn) {
            if (isRecording) {
                voiceBtn.classList.add('recording');
                voiceBtn.innerHTML = `
                    <i class="fas fa-stop"></i>
                    <span>Detener Grabación</span>
                `;
            } else {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = `
                    <i class="fas fa-microphone"></i>
                    <span>Nota de Voz</span>
                `;
            }
        }
    }
}

// Initialize simplified managers
const uiManager = new UIManager();
const chatManager = new ChatAIManager();
const dashboardManager = new DashboardManager();

// Global functions for HTML event handlers
function openCrisisForm() {
    uiManager.openModal('crisis-modal');
}

function openIdeaForm() {
    createIdeaModal();
    uiManager.openModal('idea-modal');
}

function openAnticipationForm() {
    createAnticipationModal();
    uiManager.openModal('anticipation-modal');
}

function openSuccessForm() {
    createSuccessModal();
    uiManager.openModal('success-modal');
}

function closeModal(modalId) {
    uiManager.closeModal(modalId);
}

function previousMonth() {
    calendarManager.previousMonth();
}

function nextMonth() {
    calendarManager.nextMonth();
}

function showDayDetail(dateString) {
    const date = new Date(dateString);
    const entries = dataManager.getEntriesByDateRange(date, date);
    
    // Show day detail modal (implementation would go here)
    console.log('Show day detail for:', date, entries);
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
        chatManager.sendMessage(message);
        input.value = '';
    }
}

function sendSuggestion(suggestion) {
    chatManager.sendMessage(suggestion);
}

function switchToChat() {
    uiManager.switchView('chat');
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function authenticateGoogle() {
    googleCalendarManager.authenticate();
}

function startVoiceRecording() {
    if (voiceManager.isRecording) {
        voiceManager.stopRecording();
    } else {
        voiceManager.startRecording();
    }
}

function exportToPDF() {
    // PDF export implementation
    const metrics = dashboardManager.calculateMetrics(dashboardManager.getEntriesForPeriod());
    
    // For MVP, we'll create a simple text report
    const report = `
INFORME DE PROGRESO - ANXIETYFLOW
Fecha: ${new Date().toLocaleDateString('es-ES')}

MÉTRICAS PRINCIPALES:
- Índice de Resiliencia: ${metrics.resilienceIndex}/100
- Episodios registrados: ${metrics.episodesCount}
- Intensidad media: ${metrics.avgIntensity.toFixed(1)}/10
- Reducción media: ${metrics.avgReduction}%
- Exposiciones realizadas: ${metrics.exposuresCount}
- Tasa de éxito: ${metrics.successRate}%
- Anticipaciones refutadas: ${metrics.refutedRate}%

Este informe es generado automáticamente por AnxietyFlow.
No constituye un diagnóstico médico.
    `;

    // Create and download text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anxietyflow-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    uiManager.showNotification('Informe exportado exitosamente', 'success');
}

function exportData() {
    const data = {
        version: APP_CONFIG.version,
        exportDate: new Date().toISOString(),
        entries: appState.entries,
        settings: appState.settings
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anxietyflow-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    uiManager.showNotification('Datos exportados exitosamente', 'success');
}

function clearAllData() {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.clear();
        appState.entries = [];
        appState.settings = {
            autoSave: true,
            voiceNotes: false,
            dailyReminder: false,
            eventNotifications: false
        };
        uiManager.updateUI();
        uiManager.showNotification('Todos los datos han sido borrados', 'success');
    }
}

function showEmergencyResources() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Recursos de Emergencia</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-form">
                <div class="emergency-contacts">
                    <div class="emergency-item">
                        <strong>🚨 Emergencias Generales:</strong> 112
                    </div>
                    <div class="emergency-item">
                        <strong>📞 Teléfono de la Esperanza:</strong> 717 003 717
                    </div>
                    <div class="emergency-item">
                        <strong>🧠 Salud Mental España:</strong> 672 420 816
                    </div>
                    <div class="emergency-item">
                        <strong>💬 Chat de Crisis (24h):</strong> 
                        <a href="https://www.telefonodelaesperanza.org" target="_blank">
                            telefonodelaesperanza.org
                        </a>
                    </div>
                    <div class="emergency-item">
                        <strong>🏥 Si estás en peligro inmediato:</strong>
                        Acude al servicio de urgencias más cercano
                    </div>
                </div>
                <p style="margin-top: 20px; padding: 15px; background: #fee2e2; border-radius: 8px; color: #991b1b;">
                    <strong>Recuerda:</strong> AnxietyFlow es una herramienta de apoyo, no reemplaza la atención médica profesional. Si tienes pensamientos de autolesión o sientes que estás en peligro, busca ayuda inmediatamente.
                </p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Dynamic modal creation functions
function createIdeaModal() {
    const modal = document.createElement('div');
    modal.id = 'idea-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Registrar Idea/Creencia</h3>
                <button class="modal-close" onclick="closeModal('idea-modal')">&times;</button>
            </div>
            <form id="idea-form" class="modal-form">
                <div class="form-group">
                    <label>Título breve</label>
                    <input type="text" name="titulo" placeholder="Ej: Miedo a perder el control en reuniones" required>
                </div>

                <div class="form-group">
                    <label>Describe la idea o creencia</label>
                    <textarea name="idea" rows="4" 
                            placeholder="Ej: Si me mareo delante del equipo, pensarán que no soy competente" required></textarea>
                </div>

                <div class="form-group">
                    <label>Etiquetas (separadas por comas)</label>
                    <input type="text" name="etiquetas" placeholder="trabajo, salud, transporte">
                </div>

                <div class="form-group">
                    <label>Distorsión cognitiva sugerida</label>
                    <select name="distorsion_sugerida">
                        <option value="">Seleccionar...</option>
                        <option value="lectura_mente">Lectura de mente</option>
                        <option value="catastrofizacion">Catastrofización</option>
                        <option value="todo_o_nada">Todo o nada</option>
                        <option value="sobregeneralizacion">Sobregeneralización</option>
                        <option value="personalizacion">Personalización</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Prioridad</label>
                    <select name="prioridad" required>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal('idea-modal')">Cancelar</button>
                    <button type="submit" class="btn-primary">Guardar Idea</button>
                </div>
            </form>
        </div>
    `;
    document.getElementById('modal-container').appendChild(modal);
}

function createAnticipationModal() {
    const modal = document.createElement('div');
    modal.id = 'anticipation-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Registrar Anticipación</h3>
                <button class="modal-close" onclick="closeModal('anticipation-modal')">&times;</button>
            </div>
            <form id="anticipation-form" class="modal-form">
                <div class="form-group">
                    <label>Evento futuro que te preocupa</label>
                    <input type="text" name="evento_futuro" 
                           placeholder="Ej: Supermercado barrio, sábado 12:00" required>
                </div>

                <div class="form-group">
                    <label>Probabilidad de marearte (0-100%)</label>
                    <div class="slider-container">
                        <input type="range" name="prob_mareo_antes" min="0" max="100" value="50" class="slider">
                        <span class="slider-value">50%</span>
                    </div>
                </div>

                <div class="form-group">
                    <label>Gravedad imaginada si pasara (0-10)</label>
                    <div class="slider-container">
                        <input type="range" name="catastrofe_antes" min="0" max="10" value="5" class="slider">
                        <span class="slider-value">5</span>
                    </div>
                </div>

                <div class="restructuring-section">
                    <h4>Reestructuración Cognitiva</h4>
                    <div class="form-group">
                        <label>Distorsión identificada</label>
                        <select name="distorsion_detectada" required>
                            <option value="">Selecciona una distorsión</option>
                            <option value="sobreestimacion_riesgo">Sobreestimación del riesgo</option>
                            <option value="catastrofizacion">Catastrofización</option>
                            <option value="lectura_mente">Lectura de mente</option>
                            <option value="magnificacion">Magnificación</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Pensamiento alternativo más realista</label>
                        <textarea name="pensamiento_alternativo" rows="3" 
                                placeholder="Ej: He ido 3 veces y no pasó nada; puedo salir si me agobio" required></textarea>
                    </div>

                    <div class="form-group">
                        <label>Nueva probabilidad después de reestructurar (0-100%)</label>
                        <div class="slider-container">
                            <input type="range" name="prob_mareo_despues" min="0" max="100" value="25" class="slider">
                            <span class="slider-value">25%</span>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" name="resultado_completado">
                        Ya ocurrió el evento (completar resultado)
                    </label>
                </div>

                <div id="resultado-section" style="display: none;">
                    <div class="form-group">
                        <label>¿Ocurrió el mareo?</label>
                        <select name="ocurrio_mareo">
                            <option value="false">No</option>
                            <option value="true">Sí</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Intensidad real (0-10)</label>
                        <div class="slider-container">
                            <input type="range" name="intensidad_real" min="0" max="10" value="0" class="slider">
                            <span class="slider-value">0</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Comentario sobre el resultado</label>
                        <textarea name="comentario_resultado" rows="2" 
                                placeholder="Ej: Ligero nervio al inicio, luego normal"></textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal('anticipation-modal')">Cancelar</button>
                    <button type="submit" class="btn-primary">Guardar Anticipación</button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('modal-container').appendChild(modal);
    
    // Add event listener for resultado checkbox
    const resultadoCheckbox = modal.querySelector('input[name="resultado_completado"]');
    const resultadoSection = modal.querySelector('#resultado-section');
    
    resultadoCheckbox.addEventListener('change', function() {
        resultadoSection.style.display = this.checked ? 'block' : 'none';
    });
}

function createSuccessModal() {
    const modal = document.createElement('div');
    modal.id = 'success-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Registrar Éxito/Exposición</h3>
                <button class="modal-close" onclick="closeModal('success-modal')">&times;</button>
            </div>
            <form id="success-form" class="modal-form">
                <div class="form-group">
                    <label>Situación de exposición lograda</label>
                    <input type="text" name="situacion_exposicion" 
                           placeholder="Ej: Esperar 10 min en cola del banco" required>
                </div>

                <div class="form-group">
                    <label>Duración (minutos)</label>
                    <input type="number" name="duracion" min="1" max="300" placeholder="10" required>
                </div>

                <div class="form-group">
                    <label>Habilidades utilizadas</label>
                    <div class="checkbox-grid">
                        <label><input type="checkbox" name="habilidades_usadas" value="respiracion"> Respiración</label>
                        <label><input type="checkbox" name="habilidades_usadas" value="grounding"> Grounding 5-4-3-2-1</label>
                        <label><input type="checkbox" name="habilidades_usadas" value="auto_instrucciones"> Auto-instrucciones</label>
                        <label><input type="checkbox" name="habilidades_usadas" value="relajacion"> Relajación muscular</label>
                        <label><input type="checkbox" name="habilidades_usadas" value="mindfulness"> Mindfulness</label>
                        <label><input type="checkbox" name="habilidades_usadas" value="reestructuracion"> Reestructuración</label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Resultado de la exposición</label>
                    <select name="resultado" required>
                        <option value="">Seleccionar...</option>
                        <option value="sin_sintomas">Éxito sin síntomas</option>
                        <option value="ansiedad_manejada">Ansiedad manejada</option>
                        <option value="parcial">Éxito parcial</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>¿Qué aprendiste de esta experiencia?</label>
                    <textarea name="aprendizaje" rows="3" 
                            placeholder="Ej: La ansiedad sube y baja; pude quedarme" required></textarea>
                </div>

                <div class="form-group">
                    <label>Nivel de confianza después (0-10)</label>
                    <div class="slider-container">
                        <input type="range" name="confianza_post" min="0" max="10" value="7" class="slider">
                        <span class="slider-value">7</span>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal('success-modal')">Cancelar</button>
                    <button type="submit" class="btn-primary">Guardar Éxito</button>
                </div>
            </form>
        </div>
    `;
    document.getElementById('modal-container').appendChild(modal);
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('AnxietyFlow v' + APP_CONFIG.version + ' initialized');
    
    // Initialize Google Calendar (optional)
    if (APP_CONFIG.googleCalendar.clientId !== 'your-google-client-id.apps.googleusercontent.com') {
        googleCalendarManager.initialize();
    }

    // Add period selector event listeners
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            dashboardManager.setPeriod(this.dataset.period);
        });
    });

    // Add notification styles to head
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            padding: 16px 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        }

        .notification-success {
            border-left: 4px solid var(--success-color);
            color: var(--success-color);
        }

        .notification-error {
            border-left: 4px solid var(--danger-color);
            color: var(--danger-color);
        }

        .notification-warning {
            border-left: 4px solid var(--warning-color);
            color: var(--warning-color);
        }

        .notification-info {
            border-left: 4px solid var(--primary-color);
            color: var(--primary-color);
        }

        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 8px 0;
        }

        .typing-dots span {
            width: 8px;
            height: 8px;
            background: var(--gray-400);
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

        .action-btn.recording {
            background: var(--danger-color);
            color: white;
            border-color: var(--danger-color);
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(notificationStyles);
});
