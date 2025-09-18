# 🧠💙 AnxietyFlow - Manejo Inteligente de Ansiedad y Pánico

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TU_USUARIO/anxietyflow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> **Una aplicación web moderna para el manejo de ansiedad y pánico con IA especializada, basada en principios de Terapia Cognitivo-Conductual (TCC).**

![AnxietyFlow Preview](https://via.placeholder.com/800x400/4f46e5/ffffff?text=AnxietyFlow+Preview)

## ✨ Características Principales

## Descripción

AnxietyFlow es una aplicación web MVP diseñada para ayudar a las personas a registrar, estructurar y mejorar su manejo de la ansiedad y el pánico. La aplicación se centra en el registro ultra-rápido, la reestructuración cognitiva guiada, un calendario de éxitos y un dashboard de progreso.

## Características Principales

### 🚨 Registro de Crisis (≤30 segundos)
- Botón "Estoy en crisis" prominente
- Formulario express con campos obligatorios mínimos
- Reestructuración cognitiva guiada paso a paso
- Medición antes/después de la intensidad

### 📊 Dashboard de Progreso
- **Índice de Resiliencia** (0-100) calculado automáticamente
- Métricas clave: episodios, reducción media, exposiciones, anticipaciones refutadas
- Gráficas de tendencias de intensidad
- Análisis de disparadores más frecuentes

### 📅 Calendario Visual
- Sistema de colores intuitivo:
  - 🔴 Crisis/Episodio dominante
  - 🟡 Exposición con ansiedad manejada
  - 🟢 Éxito sin síntomas
  - 🔵 Idea/Anticipación trabajada
- Badges con información adicional (duración, número de registros)

### 🤖 Chat IA Especializado
- Asistente basado en Terapia Cognitivo-Conductual (TCC)
- Respuestas específicas para síntomas comunes (mareo, taquicardia, etc.)
- Reestructuración cognitiva guiada
- Técnicas de afrontamiento paso a paso

### 📝 4 Tipos de Registro

1. **Episodios/Crisis**: Situación, intensidad, disparadores, reestructuración
2. **Ideas/Creencias**: Pensamientos para trabajar posteriormente
3. **Anticipaciones**: Miedos futuros con seguimiento de resultados reales
4. **Éxitos/Exposiciones**: Logros y evidencias de progreso

### 🔒 Privacidad y Seguridad
- Datos almacenados localmente en el navegador
- Cifrado automático de información sensible
- Exportación completa de datos en formato JSON
- Recursos de emergencia siempre visibles

## Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- Micrófono (opcional, para notas de voz)

### Inicio Rápido
1. Descarga todos los archivos del proyecto
2. Abre `index.html` en tu navegador
3. ¡Comienza a usar la aplicación inmediatamente!

### Estructura de Archivos
```
Proyecto 2/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── app.js             # Lógica de la aplicación
└── README.md          # Este archivo
```

## Guía de Uso

### Primera Vez
1. **Registro de Crisis**: Si estás en crisis, presiona el botón rojo "Estoy en Crisis"
2. **Exploración**: Navega por las diferentes secciones usando el menú superior
3. **Configuración**: Visita la sección "Config" para personalizar la aplicación

### Flujo Típico
1. **Durante una crisis**: Registro rápido → Reestructuración guiada → Guardar
2. **Después**: Revisar en el calendario y dashboard
3. **Planificación**: Registrar anticipaciones para eventos futuros
4. **Celebración**: Registrar éxitos y exposiciones logradas

### Tips de Uso
- **Registro diario**: Aunque sea breve, mantén un registro consistente
- **Reestructuración**: Tómate tiempo para completar la sección de pensamientos alternativos
- **Chat IA**: Úsalo para dudas específicas sobre síntomas o técnicas
- **Exportación**: Descarga tus datos regularmente como respaldo

## Fórmula del Índice de Resiliencia

```
IR = 100 × (0.3×episodios_norm + 0.3×reducción_media + 0.25×exposiciones_norm + 0.15×anticipaciones_refutadas)
```

Donde:
- `episodios_norm`: Normalización inversa del número de episodios (menos episodios = mejor puntuación)
- `reducción_media`: Promedio de reducción de intensidad antes/después de reestructuración
- `exposiciones_norm`: Normalización del número de exposiciones exitosas
- `anticipaciones_refutadas`: Porcentaje de anticipaciones que no se cumplieron

## Integración con Google Calendar (Opcional)

### Configuración
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la Google Calendar API
4. Crea credenciales (OAuth 2.0)
5. Actualiza `app.js` con tu `clientId` y `apiKey`

### Funcionalidades
- Lectura de eventos próximos (14-30 días)
- Identificación automática de "exposiciones potenciales"
- Sugerencias de preparación para eventos retadores

## Personalización

### Modificar Pesos del Índice de Resiliencia
En `app.js`, línea ~25:
```javascript
resilience: {
    weights: {
        episodes: 0.3,      // Peso de episodios
        reduction: 0.3,     // Peso de reducción
        exposures: 0.25,    // Peso de exposiciones
        anticipations: 0.15 // Peso de anticipaciones
    }
}
```

### Añadir Nuevos Disparadores
En la función `openCrisisForm()`, modifica el HTML del modal para incluir nuevos checkboxes.

### Personalizar Respuestas del Chat IA
En `ChatAIManager.getAIResponses()`, añade nuevos patrones de palabras clave y respuestas.

## Limitaciones del MVP

- **Chat IA**: Respuestas basadas en reglas, no IA real
- **Gráficas**: Implementación básica con Canvas
- **Notificaciones**: Solo visuales, no push notifications
- **Sincronización**: Solo almacenamiento local
- **PDF Export**: Genera archivo de texto plano

## Roadmap Futuro

### Versión 1.1
- [ ] IA real con procesamiento de lenguaje natural
- [ ] Notificaciones push programables
- [ ] Sincronización en la nube
- [ ] Modo offline completo
- [ ] Análisis predictivo de crisis

### Versión 1.2
- [ ] Integración con wearables (Apple Watch, Fitbit)
- [ ] Compartir progreso con terapeutas
- [ ] Comunidad de apoyo (opcional)
- [ ] Gamificación y logros

## Soporte y Recursos de Emergencia

### Si Necesitas Ayuda Inmediata
- **🚨 Emergencias**: 112
- **📞 Teléfono de la Esperanza**: 717 003 717
- **🧠 Salud Mental España**: 672 420 816

### Disclaimer Importante
AnxietyFlow es una herramienta de apoyo educativo basada en principios de TCC. **NO reemplaza la atención médica profesional**. Si experimentas:
- Pensamientos de autolesión
- Crisis severas recurrentes  
- Síntomas que interfieren significativamente con tu vida

**Busca ayuda profesional inmediatamente.**

## Contribución y Desarrollo

### Estructura del Código
- `UIManager`: Manejo de interfaz y navegación
- `DataManager`: Almacenamiento y persistencia de datos
- `CalendarManager`: Lógica del calendario visual
- `ChatAIManager`: Sistema de chat con respuestas predefinidas
- `DashboardManager`: Cálculos de métricas y gráficas
- `GoogleCalendarManager`: Integración con Google Calendar
- `VoiceRecordingManager`: Grabación de notas de voz

### Principios de Diseño
1. **Simplicidad**: Interfaces claras y directas
2. **Accesibilidad**: Compatible con lectores de pantalla
3. **Privacidad**: Datos locales por defecto
4. **Rapidez**: Registro en ≤30 segundos
5. **Evidencia**: Basado en principios de TCC validados

## Licencia

Este proyecto es un MVP educativo. Úsalo libremente pero recuerda que no constituye consejo médico profesional.

---

**Versión**: 1.0.0  
**Última actualización**: Septiembre 2024  
**Desarrollado con**: HTML5, CSS3, JavaScript ES6+

Para preguntas técnicas o sugerencias, revisa el código fuente en `app.js` - está completamente comentado y documentado.
