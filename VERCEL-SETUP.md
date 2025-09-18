# 🚀 Configuración para Vercel - AnxietyFlow

## 📋 Pasos para Deploy en Vercel

### **Opción 1: Deploy Automático (Recomendado)**

#### 1. **Subir a GitHub**
```bash
# Ejecutar el script de deploy (Windows)
deploy-to-github.bat

# O para Mac/Linux
chmod +x deploy-to-github.sh
./deploy-to-github.sh
```

#### 2. **Conectar con Vercel**
1. Ve a [vercel.com/new](https://vercel.com/new)
2. **Sign up** con tu cuenta de GitHub
3. **Import Git Repository**
4. Busca y selecciona `anxietyflow`
5. **Deploy** (¡sin configuración adicional!)

#### 3. **¡Listo!**
- Tu app estará en: `https://anxietyflow.vercel.app`
- Deploy automático en cada push a GitHub

---

### **Opción 2: Deploy Manual con Vercel CLI**

#### 1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

#### 2. **Login y Deploy**
```bash
# En la carpeta del proyecto
vercel login
vercel --prod
```

---

## ⚙️ Configuración Optimizada

### **Archivos de Configuración Incluidos:**

#### **`vercel.json`** - Configuración principal
```json
{
  "version": 2,
  "name": "anxietyflow",
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com..."
        }
      ]
    }
  ]
}
```

#### **`package.json`** - Información del proyecto
- Nombre: `anxietyflow`
- Versión: `2.0.0`
- Scripts de desarrollo incluidos

---

## 🔧 Configuración Post-Deploy

### **1. Dominio Personalizado (Opcional)**
1. En tu dashboard de Vercel
2. Ve a tu proyecto `anxietyflow`
3. **Settings** → **Domains**
4. **Add Domain**: `tudominio.com`
5. Configura DNS según instrucciones

### **2. Variables de Entorno (Para IA)**
1. **Settings** → **Environment Variables**
2. Añadir (opcional, solo si usas server-side):
   ```
   OPENAI_API_KEY=tu_clave_openai
   ANTHROPIC_API_KEY=tu_clave_anthropic
   GEMINI_API_KEY=tu_clave_gemini
   ```

### **3. Analytics (Opcional)**
1. **Settings** → **Analytics**
2. **Enable Vercel Analytics**
3. Ver métricas de rendimiento en tiempo real

---

## 📊 Optimizaciones para Vercel

### **Características Incluidas:**

#### **🚀 Performance**
- **Static Site Generation** optimizado
- **CDN global** automático
- **Compresión Gzip/Brotli** habilitada
- **Headers de cache** optimizados

#### **🔒 Security**
- **HTTPS** automático
- **Security headers** configurados
- **CSP (Content Security Policy)** optimizado para APIs de IA
- **XSS Protection** habilitado

#### **📱 PWA Ready**
- **Service Worker** compatible
- **Manifest** preparado para PWA
- **Offline functionality** lista para implementar

---

## 🎯 URLs y Estructura

### **URLs de tu aplicación:**
- **Principal:** `https://anxietyflow.vercel.app`
- **Configuración IA:** `https://anxietyflow.vercel.app/ai-config.html`
- **API Status:** Todas las APIs funcionarán desde el frontend

### **Estructura de archivos optimizada:**
```
anxietyflow/
├── index.html              # Página principal
├── styles-modern.css       # Estilos modernos
├── app.js                  # Funcionalidad principal
├── chat-ai-real.js         # Sistema de IA
├── ai-config.html          # Panel de configuración
├── vercel.json            # Configuración de Vercel
├── package.json           # Info del proyecto
└── README.md              # Documentación
```

---

## 🔄 Workflow de Desarrollo

### **Desarrollo Local:**
```bash
# Servidor local
python -m http.server 8000
# O
npm run dev

# Abrir: http://localhost:8000
```

### **Deploy a Producción:**
```bash
# Commit cambios
git add .
git commit -m "feat: nueva funcionalidad"
git push

# ¡Deploy automático en Vercel!
```

---

## 🐛 Troubleshooting

### **Problemas Comunes:**

#### **"Build Failed"**
- Verifica que `index.html` esté en la raíz
- Chequea que no haya errores de sintaxis
- Revisa los logs en Vercel Dashboard

#### **"API Not Working"**
- Las APIs de IA se ejecutan desde el frontend
- Verifica CORS en la configuración de API
- Chequea las API keys en el panel de configuración

#### **"Styles Not Loading"**
- Verifica que uses `styles-modern.css`
- Chequea las rutas en `index.html`
- Confirma que el archivo esté subido a GitHub

#### **"Mobile Not Responsive"**
- Asegúrate de usar `styles-modern.css`
- Verifica el viewport meta tag
- Testa en dispositivos reales

---

## 📈 Métricas y Monitoring

### **Vercel Analytics (Incluido):**
- **Page Views** en tiempo real
- **Performance Score** (Web Vitals)
- **Top Pages** y rutas
- **Device/Browser** breakdown

### **Lighthouse Score Esperado:**
- **Performance:** 95+ 
- **Accessibility:** 95+
- **Best Practices:** 100
- **SEO:** 90+

---

## 🎉 ¡Tu AnxietyFlow en Vercel!

### **Ventajas de Vercel:**
- ✅ **Deploy en 30 segundos**
- ✅ **CDN global** automático
- ✅ **HTTPS** incluido
- ✅ **Analytics** gratis
- ✅ **Dominio personalizado** gratis
- ✅ **Git integration** automática

### **Próximos pasos:**
1. 🚀 **Deploy** usando los scripts
2. 🎨 **Personalizar** colores y contenido
3. 🤖 **Configurar IA** en el panel
4. 📱 **Testear** en dispositivos móviles
5. 🌐 **Compartir** tu app con usuarios

---

**¡Tu aplicación profesional de salud mental estará online en menos de 5 minutos!** 🎊
