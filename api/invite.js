// ✅ Vercel Edge Function — Invitation Landing Page V2
// Photos placeholder blurées + username + date de période + CTA

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || '';
  const ref = searchParams.get('ref') || '';
  const dateParam = searchParams.get('date') || ''; // Format: "13/07/2019"

  // ✅ Formater la date lisible (si passée en DD/MM/YYYY → "13 juillet 2019")
  const formattedDate = formatDate(dateParam);

  // ✅ Sélection déterministe du placeholder basée sur le hash du ref (userId)
  const placeholderIndex = hashToIndex(ref, 4); // 4 images: invite1.webp → invite4.webp
  const placeholderImage = `https://yester.fyi/images/invite${placeholderIndex + 1}.webp`;

  // Meta tags dynamiques
  const title = username ? `@${username} a partagé sur Yester` : 'Yester';
  const description = username
    ? `${username} a partagé ce qu'il faisait le ${formattedDate}. Et toi ?`
    : 'Découvre ce que toi et tes amis faisaient ce jour-là';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yester.fyi/invite?ref=${ref}&username=${username}">
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

  <!-- App Store -->
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
      gap: 20px;
    }

    /* Photo placeholder avec blur */
    .photo-wrap {
      width: 200px;
      height: 260px;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
    }

    .photo-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(18px) saturate(1.2);
      transform: scale(1.1); /* évite les bords blancs du blur */
    }

    /* Overlay subtil sur la photo */
    .photo-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.15);
      border-radius: 20px;
    }

    /* Username + texte d'action */
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .username {
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.3px;
    }

    .action-text {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.5);
    }

    /* Date mise en avant */
    .date-line {
      font-size: 16px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.5;
    }

    .date-highlight {
      color: rgb(255, 204, 102);
      font-weight: 800;
    }

    /* CTA Button */
    .cta-button {
      display: inline-block;
      margin-top: 8px;
      padding: 14px 32px;
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

    /* Branding discret en bas */
    .branding {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.25);
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="photo-wrap">
      <img src="${placeholderImage}" alt="" aria-hidden="true">
    </div>

    ${username ? `
    <div class="user-info">
      <span class="username">@${escapeHtml(username)}</span>
      <span class="action-text">a partagé un souvenir</span>
    </div>

    <p class="date-line">
      que faisais-tu le <span class="date-highlight">${formattedDate}</span> ?
    </p>
    ` : `
    <p class="date-line">
      Découvre ce que tes amis faisaient le <span class="date-highlight">${formattedDate}</span>
    </p>
    `}

    <a href="https://apps.apple.com/fr/app/yester/id6759684119" class="cta-button" id="ctaBtn">
      Découvrir
    </a>
  </div>

  <span class="branding">YESTER</span>

  <script>
    // Deep link vers l'app si installée, sinon App Store
    (function() {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const ref = '${ref}';

      if (isIOS && ref) {
        // Tenter d'ouvrir l'app via le scheme
        window.location.href = 'yester://invite?ref=' + ref;

        // Fallback App Store après 2s si l'app ne s'ouvre pas
        setTimeout(function() {
          window.location.href = 'https://apps.apple.com/fr/app/yester/id6759684119';
        }, 2000);
      }

      // Sur Android ou desktop, le bouton redirige vers l'App Store (déjà dans le href)
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

// ✅ Hash déterministe pour choisir le placeholder (même ref → même image)
function hashToIndex(str, max) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // 32-bit
  }
  return Math.abs(hash) % max;
}

// ✅ Formater DD/MM/YYYY → "13 juillet 2019"
function formatDate(dateStr) {
  if (!dateStr) return 'un jour passé';

  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  if (month < 0 || month > 11 || isNaN(day) || isNaN(year)) return dateStr;

  return `${day} ${months[month]} ${year}`;
}

// ✅ Échapper HTML pour éviter XSS
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '>').replace(/"/g, '"');
}

