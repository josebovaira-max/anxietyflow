# 🚀 Comandos para GitHub + Vercel - AnxietyFlow

## 📋 **INSTRUCCIONES PASO A PASO**

### **Para Windows (PowerShell/CMD):**

#### 1. **Abrir Terminal en la Carpeta del Proyecto**
```bash
# Navegar a la carpeta
cd "C:\Users\FEVER\Desktop\Proyecto 2"
```

#### 2. **Comandos Git (Copiar uno por uno):**
```bash
# Inicializar repositorio
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "🚀 Initial commit - AnxietyFlow v2.0 with AI integration"

# Configurar rama principal
git branch -M main
```

#### 3. **Crear Repositorio en GitHub:**
1. Ve a: https://github.com/new
2. **Repository name:** `anxietyflow`
3. **Description:** `Aplicación web para manejo de ansiedad y pánico con IA especializada`
4. **Public** (para Vercel gratis)
5. **NO marcar** "Add a README file"
6. Click **"Create repository"**

#### 4. **Conectar con GitHub (Reemplaza TU_USUARIO):**
```bash
# Reemplaza TU_USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/anxietyflow.git

# Subir archivos
git push -u origin main
```

---

### **Para Mac/Linux:**

#### 1. **Abrir Terminal y navegar:**
```bash
cd "/ruta/a/tu/Proyecto 2"
```

#### 2. **Usar el script automático:**
```bash
# Hacer ejecutable
chmod +x deploy-to-github.sh

# Ejecutar
./deploy-to-github.sh
```

**O ejecutar comandos manualmente como en Windows**

---

## 🌐 **DEPLOY EN VERCEL**

### **Método 1: Interfaz Web (Más Fácil)**

#### 1. **Ir a Vercel:**
- Ve a: https://vercel.com/new

#### 2. **Conectar GitHub:**
- Click **"Continue with GitHub"**
- Autorizar Vercel

#### 3. **Importar Repositorio:**
- Buscar **"anxietyflow"**
- Click **"Import"**

#### 4. **Deploy:**
- **Project Name:** `anxietyflow` (ya configurado)
- **Framework Preset:** Other
- **Root Directory:** `./` (por defecto)
- Click **"Deploy"**

#### 5. **¡Listo!**
- Tu app estará en: `https://anxietyflow.vercel.app`
- O un nombre similar que te asigne Vercel

---

### **Método 2: Vercel CLI**

#### 1. **Instalar Vercel CLI:**
```bash
npm install -g vercel
```

#### 2. **Login y Deploy:**
```bash
# En la carpeta del proyecto
vercel login

# Deploy
vercel --prod
```

---

## 🔧 **CONFIGURACIÓN POST-DEPLOY**

### **1. Dominio Personalizado (Opcional):**
1. En Vercel Dashboard → tu proyecto
2. **Settings** → **Domains**
3. **Add:** `tudominio.com`
4. Configurar DNS según instrucciones

### **2. Configurar IA (Importante):**
1. Ve a tu app: `https://tu-app.vercel.app/ai-config.html`
2. Configura al menos un proveedor de IA
3. **Recomendado:** Google Gemini (¡gratis!)

### **3. Analytics (Opcional):**
1. Vercel Dashboard → **Analytics**
2. **Enable** para ver métricas

---

## 🎯 **URLS DE TU APLICACIÓN**

Una vez deployado, tendrás:

- **🏠 App Principal:** `https://anxietyflow.vercel.app`
- **🤖 Config IA:** `https://anxietyflow.vercel.app/ai-config.html`
- **📊 GitHub Repo:** `https://github.com/TU_USUARIO/anxietyflow`

---

## 🔄 **WORKFLOW DE DESARROLLO**

### **Para futuras actualizaciones:**
```bash
# Hacer cambios en tu código
# Luego:

git add .
git commit -m "feat: nueva funcionalidad"
git push

# ¡Deploy automático en Vercel!
```

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error: "git no reconocido"**
- Instalar Git: https://git-scm.com/download/win

### **Error: "Permission denied"**
- Verificar usuario/contraseña de GitHub
- Usar token personal si tienes 2FA

### **Error: "Build failed en Vercel"**
- Verificar que `index.html` esté en la raíz
- Chequear logs en Vercel Dashboard

### **Error: "API no funciona"**
- Configurar APIs en: `tu-app.vercel.app/ai-config.html`
- Verificar CORS en configuración

---

## 📱 **TESTING**

### **Después del deploy, probar:**
- ✅ **Desktop:** Chrome, Firefox, Safari
- ✅ **Mobile:** iOS Safari, Android Chrome
- ✅ **Funcionalidades:** Registro de crisis, chat IA, calendario
- ✅ **Performance:** Lighthouse score >90

---

## 🎉 **¡FELICITACIONES!**

**Tu AnxietyFlow profesional estará online en ~5 minutos**

### **Próximos pasos:**
1. 🚀 **Ejecutar comandos** de GitHub
2. 🌐 **Deploy en Vercel**
3. 🤖 **Configurar IA** (Gemini recomendado)
4. 📱 **Testear en móvil**
5. 🎨 **Personalizar** según tu marca
6. 📢 **Compartir** con usuarios

---

**¿Necesitas ayuda con algún paso? ¡Pregúntame!** 💬
