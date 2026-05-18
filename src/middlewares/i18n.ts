import { Context } from 'grammy';
import { UserSession } from '../types';

export const TRANSLATIONS = {
  es: {
    start: '🤖 *¡Bienvenido a Nova Downloader Bot!*\n\nEl bot de descargas multimedia más potente, rápido y automatizado de Telegram.\n\n📱 *Plataformas soportadas:* TikTok, YouTube, Instagram, Facebook, Twitter/X, Pinterest, Reddit, Twitch, SoundCloud, Spotify y más.\n\n✍️ *¿Cómo funciona?*\nSimplemente *envíame un link* o un texto que contenga uno o varios links de cualquier plataforma. Yo los extraeré y descargaré de forma automática en la *máxima calidad* sin marcas de agua.\n\nUsa /help para ver los comandos disponibles.',
    help: '🛠️ *Guía de Comandos de Nova Downloader Bot*\n\n/start - Inicia el bot y muestra información básica\n/help - Muestra este menú de ayuda\n/settings - Abre el panel de configuración personalizada\n/quality - Cambia tu preferencia de calidad de video\n/formats - Selecciona tu formato preferido\n/about - Información técnica del bot\n/ping - Comprueba el estado del servidor\n/stats - Estadísticas públicas de descargas\n/donate - Apoya el desarrollo del bot\n/language - Cambia el idioma del bot\n\n📌 *Consejo Premium:* Puedes enviarme un mensaje largo con texto y un link mezclados, ¡yo encontraré el link automáticamente!',
    about: 'ℹ️ *Acerca de Nova Downloader Bot*\n\n*Versión:* `1.0.0 (Premium Build)`\n*Arquitectura:* Node.js, TypeScript, grammY, Express\n*Optimización:* Despliegue en la nube Serverless (Vercel) con streaming directo por URL.\n\nDesarrollado para ser escalable, estable, libre de anuncios y extremadamente veloz.',
    ping: '🏓 *¡Pong!*\n\n*Estado:* Activo y Operativo 🟢\n*Latencia:* `{ms}ms`',
    donate: '☕ *Apoyar el Proyecto*\n\nEste bot es gratuito, rápido y sin anuncios molestos. Mantener los servidores y optimizar los scrapers requiere recursos.\n\nSi el bot te es de utilidad, puedes apoyar con una donación:\n\n*PayPal:* [Donar vía PayPal](https://paypal.me/jose)\n*Crypto (USDT-TRC20):* `TY2F7Xg5eQJ9y8R3mDkL7XqZ1bW3aB9cDs`\n\n¡Muchas gracias por tu generosidad! ❤️',
    language_select: '🌐 *Selecciona tu idioma / Select your language*',
    language_changed: '✅ Idioma cambiado a *Español* correctamente.',
    settings_title: '⚙️ *Panel de Configuración*\n\nPersonaliza cómo se procesan y envían tus descargas. Selecciona una opción en el menú inferior:',
    settings_quality: '🎞️ *Calidad de Video Preferida:* `{quality}`\n*(Siempre intentaremos descargar la máxima disponible)*',
    settings_format: '📂 *Formato de Salida Preferido:* `{format}`\n*Video:* Envía como video reproducible\n*Audio:* Convierte y envía como audio MP3\n*Documento:* Envía como archivo para evitar compresión',
    analyzing: '🔍 *Analizando enlace...* `{platform}`',
    downloading: '📥 *Descargando contenido...*\n\n`[⏳..........] 0%` • Obteniendo archivos',
    processing: '🚀 *Procesando y optimizando multimedia...*\n\n`[⏳⏳⏳⏳......] 50%` • Preparando envío',
    sending: '⚡ *Enviando a Telegram...*\n\n`[⏳⏳⏳⏳⏳⏳⏳..] 85%` • Transmitiendo',
    success: '✅ *¡Descarga completada!*',
    error_not_found: '❌ *No se encontró contenido multimedia*\n\nVerifica que el enlace sea público, no requiera inicio de sesión y esté activo.',
    error_timeout: '❌ *Tiempo de espera agotado*\n\nEl servidor de origen tardó demasiado en responder. Por favor, intenta de nuevo.',
    error_generic: '❌ *Error al procesar la descarga*\n\nOcurrió un inconveniente al descargar este contenido. Nuestro equipo ha sido notificado.',
    error_too_large: '⚠️ *El archivo es demasiado grande*\n\nTelegram limita el envío por URL a un máximo de 50MB. Intenta cambiar tu preferencia de calidad a 720p o 480p en /settings.',
    no_links: '⚠️ *No se detectaron enlaces válidos*\n\nPor favor, envía un mensaje que contenga un enlace de las plataformas soportadas.',
    anti_spam: '🛑 *¡Control de Spam!*\n\nPor favor, espera `{seconds}s` antes de enviar otro enlace para evitar saturar el sistema.',
    admin_only: '⚠️ Este comando solo está disponible para administradores.',
    stats_title: '📊 *Estadísticas de Nova Downloader Bot*\n\n*Descargas Totales:* `{total}`\n*Usuarios Activos:* `{users}`\n*Tiempo de Actividad:* `{uptime}`\n\n📈 *Descargas por Plataforma:*',
  },
  en: {
    start: '🤖 *Welcome to Nova Downloader Bot!*\n\nThe most powerful, fast, and automated media downloader bot on Telegram.\n\n📱 *Supported Platforms:* TikTok, YouTube, Instagram, Facebook, Twitter/X, Pinterest, Reddit, Twitch, SoundCloud, Spotify, and more.\n\n✍️ *How does it work?*\nSimply *send me a link* or text containing one or several links from any platform. I will automatically extract and download them in the *maximum quality* without watermarks.\n\nUse /help to view available commands.',
    help: '🛠️ *Nova Downloader Bot Command Guide*\n\n/start - Start the bot and show basic info\n/help - Show this help menu\n/settings - Open the custom settings panel\n/quality - Change your video quality preference\n/formats - Select your preferred file format\n/about - Technical details of the bot\n/ping - Check server status\n/stats - Public download statistics\n/donate - Support bot development\n/language - Change bot language\n\n📌 *Premium Tip:* You can send me a long message with mixed text and links, and I will extract the links automatically!',
    about: 'ℹ️ *About Nova Downloader Bot*\n\n*Version:* `1.0.0 (Premium Build)`\n*Architecture:* Node.js, TypeScript, grammY, Express\n*Optimization:* Serverless cloud deployment (Vercel) with direct URL streaming.\n\nDeveloped to be scalable, stable, ad-free, and extremely fast.',
    ping: '🏓 *Pong!*\n\n*Status:* Active & Operational 🟢\n*Latency:* `{ms}ms`',
    donate: '☕ *Support the Project*\n\nThis bot is free, fast, and without annoying ads. Maintaining servers and optimizing scrapers requires resources.\n\nIf the bot is useful to you, please consider donating:\n\n*PayPal:* [Donate via PayPal](https://paypal.me/jose)\n*Crypto (USDT-TRC20):* `TY2F7Xg5eQJ9y8R3mDkL7XqZ1bW3aB9cDs`\n\nThank you very much for your generosity! ❤️',
    language_select: '🌐 *Select your language / Selecciona tu idioma*',
    language_changed: '✅ Language changed to *English* successfully.',
    settings_title: '⚙️ *Settings Panel*\n\nCustomize how your downloads are processed and sent. Select an option from the menu below:',
    settings_quality: '🎞️ *Preferred Video Quality:* `{quality}`\n*(We will always try to download the maximum available)*',
    settings_format: '📂 *Preferred Output Format:* `{format}`\n*Video:* Send as a playable video file\n*Audio:* Convert and send as an MP3 audio\n*Document:* Send as an uncompressed file to avoid losing quality',
    analyzing: '🔍 *Analyzing link...* `{platform}`',
    downloading: '📥 *Downloading content...*\n\n`[⏳..........] 0%` • Fetching files',
    processing: '🚀 *Processing and optimizing media...*\n\n`[⏳⏳⏳⏳......] 50%` • Preparing delivery',
    sending: '⚡ *Sending to Telegram...*\n\n`[⏳⏳⏳⏳⏳⏳⏳..] 85%` • Broadcasting',
    success: '✅ *Download completed!*',
    error_not_found: '❌ *No media found at this link*\n\nMake sure the link is public, does not require login, and is active.',
    error_timeout: '❌ *Request timed out*\n\nThe source server took too long to respond. Please try again.',
    error_generic: '❌ *Failed to process download*\n\nAn error occurred while downloading this content. Our team has been notified.',
    error_too_large: '⚠️ *File is too large*\n\nTelegram limits URL sending to 50MB. Try changing your quality preference to 720p or 480p in /settings.',
    no_links: '⚠️ *No valid links detected*\n\nPlease send a message that contains a link from the supported platforms.',
    anti_spam: '🛑 *Spam Control!*\n\nPlease wait `{seconds}s` before sending another link to avoid flooding the system.',
    admin_only: '⚠️ This command is only available to administrators.',
    stats_title: '📊 *Nova Downloader Bot Statistics*\n\n*Total Downloads:* `{total}`\n*Active Users:* `{users}`\n*Uptime:* `{uptime}`\n\n📈 *Downloads by Platform:*',
  }
};

export type TranslationKey = keyof typeof TRANSLATIONS.es;

/**
 * Gets a localized string, interpolating variables if provided.
 */
export function getTranslation(lang: 'es' | 'en', key: TranslationKey, variables?: Record<string, string | number>): string {
  const translationsForLang = TRANSLATIONS[lang] || TRANSLATIONS.es;
  let text = translationsForLang[key] || TRANSLATIONS.es[key] || '';
  
  if (variables) {
    for (const [vKey, vValue] of Object.entries(variables)) {
      text = text.replace(new RegExp(`{${vKey}}`, 'g'), String(vValue));
    }
  }
  
  return text;
}
