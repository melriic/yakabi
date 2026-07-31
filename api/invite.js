// ✅ Vercel Edge Function — Invitation Landing Page V2
// Layout: Photo blur + @username le [date dorée] + accroche + CTA
// Images: /images/invite1.webp → invite4.webp (photos normales, blur CSS)

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || '';
  const ref = searchParams.get('ref') || '';
  const dateParam = searchParams.get('date') || ''; // Format: "DD/MM/YYYY"

  // ✅ Formater la date lisible (DD/MM/YYYY → "13 juillet 2019")
  // Si pas de date dans l'URL → fallback avec date aléatoire déterministe (basée sur ref)
  const effectiveDate = dateParam || generateFallbackDate(ref);
  const formattedDate = formatDate(effectiveDate);
  // ✅ Sélection déterministe du placeholder basée sur hash du ref (userId)
  const placeholderIndex = hashToIndex(ref, 4);
  const placeholderImage = `https://yester.fyi/images/invite${placeholderIndex + 1}.png`;

  // ✅ Meta tags dynamiques pour previews iMessage/WhatsApp
  const title = username ? `@${username} — le ${formattedDate}` : `Yester — le ${formattedDate}`;
  const description = username
    ? `@${username} a partagé ce qu'il faisait le ${formattedDate}. Et toi ?`
    : 'Découvre ce que tes amis faisaient ce jour-là';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yester.fyi/invite?ref=${ref}&username=${encodeURIComponent(username)}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${placeholderImage}">
  <meta property="og:image:width" content="600">
  <meta property="og:image:height" content="800">
  <meta property="og:site_name" content="Yester">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${placeholderImage}">

  <!-- App Store Smart Banner -->
  <meta name="apple-itunes-app" content="app-id=6759684119">

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      background: #000;
      color: white;
      overflow: hidden;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 32px 24px;
      max-width: 380px;
      width: 100%;
      gap: 24px;
    }

    /* ===== PHOTO PLACEHOLDER AVEC BLUR CSS ===== */
    .photo-wrap {
      width: 200px;
      height: 264px;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
    }

    .photo-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(10px) saturate(1.3) brightness(0.9);
      transform: scale(1.15);
    }

    .photo-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 100%);
      border-radius: 20px;
    }

    /* ===== @USERNAME LE [DATE] — une seule ligne ===== */
    .user-date-line {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      line-height: 1.4;
    }

    .user-date-line .date {
      color: rgb(255, 204, 102);
      font-weight: 800;
    }

    /* ===== TEXTE D'ACCROCHE ===== */
    .hook-text {
      font-size: 15px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.5;
      margin-top: -8px;
    }

    /* ===== CTA BUTTON ===== */
    .cta-button {
      display: inline-block;
      padding: 14px 36px;
      font-size: 16px;
      font-weight: 700;
      color: #000;
      background: #fff;
      border-radius: 999px;
      text-decoration: none;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }

    .cta-button:active {
      transform: scale(0.96);
      opacity: 0.9;
    }

    /* ===== BRANDING DISCRET ===== */
    .branding {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 11px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.2);
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-height: 600px) {
      .container { gap: 16px; padding: 20px 20px; }
      .photo-wrap { width: 160px; height: 210px; }
      .user-date-line { font-size: 16px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="photo-wrap">
      <img src="${placeholderImage}" alt="" aria-hidden="true" loading="eager">
    </div>

    ${username ? `
    <p class="user-date-line">
      @${escapeHtml(username)}<br>
      <span class="date">le ${formattedDate}</span>
    </p>
    <p class="hook-text">et toi, que faisais-tu ce jour-là ?</p>
    ` : `
    <p class="user-date-line">
      <span class="date">Le ${formattedDate}</span>
    </p>
    <p class="hook-text">découvre ce que tes amis faisaient ce jour-là</p>
    `}


    <a href="https://apps.apple.com/fr/app/yester/id6759684119" class="cta-button" id="ctaBtn">
      D\u00e9couvrir
    </a>
  </div>

  <span class="branding">Yester</span>

  <script>
    (function() {
      var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      var ref = '${ref}';

      if (isIOS && ref) {
        window.location.href = 'yester://invite?ref=' + encodeURIComponent(ref);
        setTimeout(function() {
          window.location.href = 'https://apps.apple.com/fr/app/yester/id6759684119';
        }, 2000);
      }
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}

// ===== HELPERS =====

function hashToIndex(str, max) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % max;
}

function formatDate(dateStr) {
  if (!dateStr) return 'un jour pass\u00e9';
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const months = [
    'janvier', 'f\u00e9vrier', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'ao\u00fbt', 'septembre', 'octobre', 'novembre', 'd\u00e9cembre'
  ];
  if (month < 0 || month > 11 || isNaN(day) || isNaN(year)) return dateStr;
  return `${day} ${months[month]} ${year}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}




/**
 * Fallback: générer une date aléatoire crédible quand &date= est absent
 * Déterministe basé sur le ref (userId) → même user = même date fallback
 * Plage: 01/01/2015 → 31/12/2023
 */
function generateFallbackDate(ref) {
  let seed = 0;
  const str = ref || 'yester';
  for (let i = 0; i < str.length; i++) {
    seed = ((seed << 5) - seed) + str.charCodeAt(i);
    seed = seed & seed;
  }

  // Mulberry32 PRNG
  seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  const random = ((t ^ (t >>> 14)) >>> 0) / 4294967296;

  // Plage: 2015-01-01 → 2023-12-31
  const minMs = new Date(2015, 0, 1).getTime();
  const maxMs = new Date(2023, 11, 31).getTime();
  const randomMs = minMs + random * (maxMs - minMs);
  const date = new Date(randomMs);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
