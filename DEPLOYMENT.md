# 🚀 Guía de Deployment - AnxietyFlow

Esta guía te ayudará a subir tu aplicación AnxietyFlow a internet para que puedas acceder desde cualquier lugar y hacer mejoras continuas.

## 📋 Antes de Empezar

### Archivos necesarios:
- ✅ `index.html` - Página principal
- ✅ `styles.css` o `styles-modern.css` - Estilos (usa modern para mejor UI)
- ✅ `app.js` - Funcionalidad principal
- ✅ `chat-ai-real.js` - Chat con IA real (opcional)
- ✅ `ai-config.html` - Configuración de IA (opcional)
- ✅ `README.md` - Documentación

## 🌐 Opción 1: Netlify (RECOMENDADO - Más fácil)

### Ventajas:
- ✅ Completamente gratis
- ✅ Deploy automático desde GitHub
- ✅ HTTPS incluido
- ✅ Dominio personalizado gratis
- ✅ Formularios de contacto incluidos

### Pasos:

#### 1. Subir a GitHub
```bash
# En tu carpeta del proyecto
git init
git add .
git commit -m "Initial commit - AnxietyFlow MVP"

# Crear repositorio en GitHub.com (público o privado)
git remote add origin https://github.com/TU_USUARIO/anxietyflow.git
git push -u origin main
```

#### 2. Conectar con Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "Sign up" y conecta con GitHub
3. Clic en "New site from Git"
4. Selecciona tu repositorio `anxietyflow`
5. Configuración:
   - **Build command:** (dejar vacío)
   - **Publish directory:** (dejar vacío)
6. Clic en "Deploy site"

#### 3. Configurar dominio personalizado (opcional)
1. En tu panel de Netlify, ve a "Domain settings"
2. Clic en "Add custom domain"
3. Ingresa tu dominio (ej: `anxietyflow.tudominio.com`)
4. Sigue las instrucciones para configurar DNS

### URL final:
Tu app estará disponible en: `https://TU_NOMBRE.netlify.app`

---

## 🚀 Opción 2: Vercel (Excelente para JavaScript)

### Ventajas:
- ✅ Gratis para proyectos personales
- ✅ Deploy instantáneo
- ✅ Analytics incluido
- ✅ Perfecto para apps JavaScript

### Pasos:

#### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy directo
```bash
# En tu carpeta del proyecto
vercel

# Seguir las instrucciones:
# - Set up and deploy? Yes
# - Which scope? (tu cuenta)
# - Link to existing project? No
# - Project name? anxietyflow
# - Directory? ./
```

### URL final:
Tu app estará en: `https://anxietyflow.vercel.app`

---

## 🐙 Opción 3: GitHub Pages (Simple y gratis)

### Ventajas:
- ✅ Completamente gratis
- ✅ Integrado con GitHub
- ✅ Fácil de configurar

### Pasos:

#### 1. Subir a GitHub (si no lo has hecho)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/anxietyflow.git
git push -u origin main
```

#### 2. Activar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Clic en "Settings"
3. Scroll hasta "Pages"
4. En "Source" selecciona "Deploy from a branch"
5. Branch: `main`, Folder: `/ (root)`
6. Clic en "Save"

### URL final:
Tu app estará en: `https://TU_USUARIO.github.io/anxietyflow`

---

## 🔥 Opción 4: Firebase Hosting (Google)

### Ventajas:
- ✅ Gratis hasta 10GB
- ✅ CDN global de Google
- ✅ SSL automático
- ✅ Fácil integración con otros servicios de Google

### Pasos:

#### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Configurar proyecto
```bash
# En tu carpeta del proyecto
firebase login
firebase init hosting

# Configuración:
# - What do you want to use as your public directory? (presiona Enter)
# - Configure as single-page app? No
# - Set up automatic builds? No
```

#### 3. Deploy
```bash
firebase deploy
```

### URL final:
Tu app estará en: `https://TU_PROYECTO.web.app`

---

## 💻 Opción 5: Tu propio servidor (VPS)

### Recomendado para:
- Versión profesional
- Control total
- Integración con bases de datos

### Proveedores recomendados:
- **DigitalOcean** - $5/mes
- **Linode** - $5/mes  
- **Vultr** - $3.50/mes
- **Hostinger VPS** - €3.99/mes

### Configuración básica (Ubuntu):
```bash
# Conectar al servidor
ssh root@TU_IP

# Instalar nginx
apt update
apt install nginx

# Subir archivos a /var/www/html/
scp -r * root@TU_IP:/var/www/html/

# Configurar nginx
nano /etc/nginx/sites-available/default
# (configurar dominio y SSL)

# Reiniciar nginx
systemctl restart nginx
```

---

## 🔧 Configuración Adicional

### Para usar IA Real:

#### 1. Variables de entorno (si usas servidor)
```bash
# .env file
OPENAI_API_KEY=tu_clave_openai
ANTHROPIC_API_KEY=tu_clave_anthropic
GEMINI_API_KEY=tu_clave_gemini
```

#### 2. Configurar CORS (si tienes problemas de API)
En tu servidor, añadir headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Para Google Calendar:
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear nuevo proyecto
3. Habilitar Google Calendar API
4. Crear credenciales OAuth 2.0
5. Añadir tu dominio a "Authorized JavaScript origins"

---

## 📈 Mejoras Post-Deploy

### 1. Analytics
Añadir Google Analytics a `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. PWA (Progressive Web App)
Crear `manifest.json`:
```json
{
  "name": "AnxietyFlow",
  "short_name": "AnxietyFlow",
  "description": "Manejo de ansiedad y pánico",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 3. Service Worker (para funcionar offline)
Crear `sw.js`:
```javascript
const CACHE_NAME = 'anxietyflow-v1';
const urlsToCache = [
  '/',
  '/styles-modern.css',
  '/app.js',
  '/chat-ai-real.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
```

---

## 🛡️ Seguridad y Privacidad

### Headers de seguridad recomendados:
```
Content-Security-Policy: default-src 'self' https:; script-src 'self' 'unsafe-inline' https://apis.google.com https://www.google.com
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Para datos sensibles:
- Nunca hardcodees API keys en el código
- Usa variables de entorno en producción
- Implementa rate limiting para APIs
- Considera cifrado adicional para datos médicos

---

## 📱 Testing en Dispositivos

### Herramientas recomendadas:
- **BrowserStack** - Testing en múltiples dispositivos
- **Chrome DevTools** - Simular móviles
- **Lighthouse** - Auditoría de rendimiento
- **Wave** - Auditoría de accesibilidad

### Checklist antes de producción:
- [ ] Funciona en Chrome, Firefox, Safari, Edge
- [ ] Responsivo en móvil, tablet, desktop
- [ ] Carga rápida (< 3 segundos)
- [ ] Accesible con teclado
- [ ] Compatible con lectores de pantalla
- [ ] HTTPS habilitado
- [ ] API keys configuradas correctamente

---

## 🚨 Troubleshooting

### Problemas comunes:

#### "API key not working"
- Verifica que la key esté copiada completamente
- Chequea que tengas crédito en tu cuenta
- Verifica que el modelo seleccionado esté disponible

#### "CORS error"
- Usa un servidor real (no file://)
- Configura headers CORS correctamente
- Para desarrollo, usa `python -m http.server 8000`

#### "App not loading"
- Verifica que todos los archivos estén subidos
- Chequea la consola del navegador para errores
- Asegúrate que las rutas de archivos sean correctas

#### "Mobile not working well"
- Verifica que uses `styles-modern.css`
- Testa en dispositivos reales
- Ajusta viewport meta tag

---

## 📞 Soporte

Si tienes problemas con el deployment:

1. **Revisa los logs** de tu plataforma de hosting
2. **Abre las DevTools** del navegador (F12)
3. **Busca errores** en la consola
4. **Verifica archivos** que estén todos subidos

### Recursos útiles:
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Docs](https://firebase.google.com/docs/hosting)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

---

**¡Tu AnxietyFlow estará online en menos de 10 minutos! 🎉**
