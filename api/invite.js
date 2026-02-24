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
<meta property="og:site_name" content="Yester">

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
    background: linear-gradient(135deg, #0f0f1a 0%, #1c1c2e 50%, #12121c 100%);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 20px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .logo {
    width: 60px;
    height: 60px;
    border-radius: 22.37%;
    border: 2px solid white;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
  }

  .invite-text {
    font-size: 16px;
    font-weight: 500;
    color: white;
    margin: 12px 0 30px 0;
  }

  .button {
    display: inline-block;
    padding: 16px 40px;
    font-size: 18px;
    font-weight: 700;
    color: black;
    background: rgb(255, 204, 102);
    border: none;
    border-radius: 14px;
    text-decoration: none;
    box-shadow: 0 6px 20px rgba(255, 204, 102, 0.4);
  }
</style>
</head>
<body>


  <div class="header">
  <img src="/images/logo.webp" alt="Yester Logo" class="logo">
  <h1>Yester</h1>
</div>

<p class="invite-text">
  ${username ? `@${username} t'as invité(e) à jouer` : "Invitation 🔗"}
</p>

<a href="yakabi://invite?ref=${ref}" class="button">Rejoindre une partie</a>

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
