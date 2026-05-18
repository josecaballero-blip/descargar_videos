# 🤖 Nova Downloader Bot

Nova Downloader Bot es un bot de Telegram **extremadamente completo, moderno, automatizado y potente** desarrollado en **TypeScript y Node.js** usando la librería **grammY**. 

Está diseñado bajo una arquitectura serverless-first, haciéndolo **100% compatible con despliegues en Vercel** y eliminando por completo los problemas comunes de caídas, falta de memoria o timeouts al descargar archivos multimedia.

---

## 🌟 Características Destacadas

*   **⚡ Descarga Directa por Stream (Cero Timeouts):** Para evitar los timeouts de Vercel (10-15s) y la subida lenta, el bot extrae y pasa el enlace directo de alta calidad a los servidores de Telegram, logrando descargas asíncronas instantáneas.
*   **🧠 Detección Inteligente de URLs:** Puedes enviar un bloque gigante de texto o un párrafo, y el bot extraerá y procesará automáticamente solo los links soportados.
*   **🖼️ TikTok Avanzado (Photo Mode & Slideshows):** Si un link de TikTok es un carrusel de fotos, el bot descarga **todas** las fotos, las envía en orden como un grupo de medios (`sendMediaGroup`), e incluye el audio de fondo original del post.
*   **📸 Instagram Premium (Carruseles & Reels):** Soporte total para Reels, posts de imágenes múltiples, historias y videos.
*   **🎵 Spotify Previews & Metadata:** Extrae metadatos ricos, imagen de portada y la pista de audio de vista previa oficial de 30s.
*   **🌐 Sistema Multiidioma Integrado:** Soporte completo en Español (`es`) e Inglés (`en`) configurable a través de `/settings`.
*   **⚙️ Panel de Preferencias:** Permite a cada usuario configurar su formato preferido (Video, Solo Audio MP3 o Archivo Documento) y su calidad favorita (Ultra HD, 1080p, 720p, 480p) mediante teclados inline interactivos.
*   **🛡️ Middleware Anti-Spam:** Sistema de control de spam con cooldown de 3s para proteger la salud de la API.
*   **📊 Analíticas y Estadísticas:** Panel administrativo e histórico público mediante `/stats`.

---

## 📱 Plataformas Soportadas

El bot es modular y escalable. Utiliza la robusta API de **Cobalt** junto con scrapers nativos altamente optimizados:

*   **TikTok** (Videos HD, Slideshows de fotos y audio de fondo)
*   **YouTube** (Shorts, Videos normales, Música MP3, miniaturas y metadatos)
*   **Instagram** (Reels, Posts de fotos múltiples, Carruseles de videos)
*   **Facebook** (Videos de watch y posts públicos)
*   **Twitter / X** (Videos e imágenes de posts)
*   **Pinterest** (Videos e imágenes de alta definición)
*   **Threads** (Videos y fotos)
*   **Vimeo** (Videos)
*   **Dailymotion** (Videos)
*   **Kwai** (Videos de la plataforma)
*   **Reddit** (Videos con audio integrado, GIFs y posts de fotos)
*   **Snapchat** (Historias públicas de usuarios)
*   **CapCut** (Videos de demostración de plantillas limpias sin marca de agua)
*   **Spotify** (Metadatos enriquecidos, cover art y preview de audio MP3)
*   **SoundCloud** (Pistas de audio)
*   **Twitch** (Clips de directos)
*   **Bilibili** (Videos)
*   **Tumblr** (Videos y fotos)
*   **LinkedIn** (Videos de publicaciones)
*   **Telegram** (Videos y fotos de posts públicos de canales `t.me/...`)
*   **Likee** (Videos)

---

## 📂 Estructura del Código

El proyecto sigue una estructura limpia, modular y fácil de mantener:

*   `src/index.ts`: Punto de entrada unificado. Arranca en modo **Long Polling** para desarrollo local o configura el endpoint **Webhook** para Vercel.
*   `src/bot.ts`: Instanciación y registro de middleware (sesión, anti-spam, comandos, callbacks, y mensajes).
*   `src/config/environment.ts`: Gestión y validación estricta de variables de entorno.
*   `src/services/`: Capa lógica de servicios de descargas y scrapers dedicados (`cobaltService.ts`, `pinterestService.ts`, `capcutService.ts`, `spotifyService.ts`, `snapchatService.ts`, `telegramService.ts`, `analyticsService.ts`).
*   `src/handlers/`: Controladores de interacción (`commandHandler.ts` para comandos, `callbackHandler.ts` para botones, `messageHandler.ts` para el procesamiento inteligente de links).
*   `src/middlewares/`: Funciones interceptoras globales (`antiSpam.ts`, `errorHandler.ts`, `i18n.ts`).
*   `src/utils/`: Utilidades del sistema (`urlExtractor.ts` para parsear URLs y `formatter.ts` para el diseño visual premium).

---

## 🛠️ Instalación y Configuración Local

### Prerrequisitos
*   Node.js (v18 o superior)
*   Un Token de Bot de Telegram (Obtenible de [@BotFather](https://t.me/BotFather))

### Paso 1: Clonar y Preparar Dependencias
En la carpeta del proyecto, ejecuta:
```bash
npm install
```

### Paso 2: Configurar las Variables de Entorno
Copia el archivo de plantilla `.env.example` y renómbralo a `.env`:
```bash
cp .env.example .env
```
Abre `.env` y rellena los datos necesarios:
*   `TELEGRAM_BOT_TOKEN`: Tu token de BotFather.
*   `NODE_ENV`: Establécelo en `development` para probar en local.
*   `COBALT_API_URL`: Dirección de la API de Cobalt. Por defecto, usa la instancia oficial `https://api.cobalt.tools`.
*   `PORT`: `3000` (puerto local).

### Paso 3: Arrancar en Modo Desarrollo (Polling)
Para ejecutar el bot localmente con reinicio automático al editar código:
```bash
npm run dev
```
El bot se encenderá usando Long Polling. Podrás interactuar con él inmediatamente en Telegram.

---

## 🚀 Despliegue en Vercel (Producción con Webhook)

Este bot está optimizado al 100% para ser alojado en Vercel Serverless.

### Paso 1: Configurar Variables en Vercel
En la consola de Vercel, agrega las siguientes variables de entorno para tu proyecto:
1.  `TELEGRAM_BOT_TOKEN` = `TU_TELEGRAM_BOT_TOKEN`
2.  `NODE_ENV` = `production`
3.  `COBALT_API_URL` = `https://api.cobalt.tools` (o tu instancia propia de Cobalt)
4.  `WEBHOOK_URL` = `https://tu-proyecto.vercel.app` (La URL que te asigne Vercel al desplegar)

### Paso 2: Desplegar el Bot
Puedes desplegar fácilmente conectando tu repositorio de GitHub a Vercel o usando la CLI de Vercel:
```bash
vercel --prod
```

### Paso 3: Registrar el Webhook en Telegram
Una vez desplegado en Vercel, debes notificar a Telegram la ruta del Webhook para que empiece a enviarle actualizaciones al bot. 
Realiza una petición GET a la siguiente URL en tu navegador (reemplazando con tu token y tu dominio de Vercel):

```text
https://api.telegram.org/bot<TU_TELEGRAM_BOT_TOKEN>/setWebhook?url=<TU_DOMINIO_VERCEL>/api/webhook
```

**Ejemplo:**
```text
https://api.telegram.org/bot123456:ABC-DefGHI/setWebhook?url=https://nova-downloader.vercel.app/api/webhook
```

Deberías recibir una respuesta de confirmación como esta:
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

¡Listo! Tu bot estará en línea las **24 horas, los 7 días de la semana** de manera totalmente gratuita, estable y robusta sin apagarse gracias a la arquitectura Serverless de Vercel.

---

## 🛠️ Comandos Disponibles en Telegram

*   `/start` - Inicia el bot, muestra la bienvenida y detecta idioma.
*   `/help` - Muestra la lista de comandos disponibles.
*   `/settings` - Abre el panel interactivo de configuración (calidad, formato e idioma).
*   `/quality` - Abre el menú rápido de selección de calidad.
*   `/formats` - Abre el menú rápido de selección de formato de descarga.
*   `/about` - Muestra detalles de desarrollo y versión técnica.
*   `/ping` - Mide la latencia de respuesta del servidor.
*   `/stats` - Muestra estadísticas de descargas totales y por plataforma.
*   `/donate` - Proporciona enlaces y carteras cripto de apoyo.
*   `/language` - Abre el menú rápido de cambio de idioma.

---

## 🤝 Créditos y Contribuciones
Este bot fue creado con fines prácticos y educativos para ofrecer el descargador multimedia de Telegram más potente del mercado.
Soporte modular: Añadir nuevas plataformas es tan simple como crear un scraper nuevo en `src/services` y mapear su regex en `src/utils/urlExtractor.ts`.
