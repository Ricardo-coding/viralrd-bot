# 🤖 ViralRD WhatsApp Bot

## Archivos del proyecto
- `index.js` — El bot completo
- `package.json` — Dependencias
- `vercel.json` — Configuración para Vercel

---

## 📋 PASOS PARA DEPLOYAR

### 1. Subir a GitHub
- Crea un repositorio nuevo en GitHub llamado `viralrd-bot`
- Sube estos 3 archivos

### 2. Deployar en Vercel
- Ve a vercel.com
- New Project → Import desde GitHub
- Selecciona el repo `viralrd-bot`
- Deploy

### 3. Agregar variables de entorno en Vercel
En Settings → Environment Variables agrega:
- `ZAPI_INSTANCE` = (tu Instance ID de Z-API)
- `ZAPI_TOKEN` = (tu Token de Z-API)

### 4. Configurar Webhook en Z-API
- En Z-API ve a tu instancia
- Webhook URL = `https://tu-proyecto.vercel.app/webhook`

### 5. Escanear QR en Z-API
- Conecta tu WhatsApp escaneando el QR
- ¡Listo!

---

## 🔧 Personalizar precios
Edita los precios en `index.js` en la sección `MENSAJES`.
