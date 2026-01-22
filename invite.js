// ✅ Vercel Edge Function pour générer les meta tags dynamiquement
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const ref = searchParams.get('ref');
  
  // Générer le HTML avec les meta tags personnalisés
  const title = username ? `ajoute-moi: @${username}` : 'Yakabi - Daily Photo Roulette';
  const description = username 
    ? `Rejoins ${username} sur Yakabi - Un jeu photo quotidien pour mieux connaître tes amis`
    : 'Un jeu photo quotidien pour mieux connaître tes amis';
  
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yakabi.app/invite?ref=${ref}&username=${username || ''}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://yakabi.app/images/logo.webp">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:site_name" content="Yakabi">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://yakabi.app/images/logo.webp">
  
  <meta name="apple-itunes-app" content="app-id=6744852802">
  
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }
    .logo {
      width: 100px;
      height: 100px;
      border-radius: 22.37%;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      margin-bottom: 20px;
    }
    h1 {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 10px 0;
    }
    p {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 30px 0;
    }
    .button {
      display: inline-block;
      padding: 16px 40px;
      font-size: 18px;
      font-weight: 700;
      color: white;
      background: #FF3B30;
      border: none;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 4px 16px rgba(255, 59, 48, 0.4);
    }
  </style>
</head>
<body>
  <img src="/images/logo.webp" alt="Yakabi Logo" class="logo">
  <h1>Yakabi</h1>
  <p>${username ? `ajoute-moi: @${username}` : 'Lien d\'invitation 🔗'}</p>
  <a href="yakabi://invite?ref=${ref}" class="button">Ouvrir l'app</a>
  <script>
    // Redirection automatique vers l'app ou App Store
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      window.location.href = 'yakabi://invite?ref=${ref}';
      setTimeout(() => {
        window.location.href = 'https://apps.apple.com/app/id6744852802';
      }, 2000);
    }
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
