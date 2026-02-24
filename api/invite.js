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


  function getDailyRandomDate() {
  const start = new Date(2015, 0, 1);
  const end = new Date(2026, 0, 1);

  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate();

  const random = Math.abs(Math.sin(seed)) * (end - start);
  const date = new Date(start.getTime() + random);

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

const randomDate = getDailyRandomDate();
  
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
  html, body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    background: linear-gradient(180deg, #000000 0%, #0d0d0d 50%, #000000 100%);
    color: white;
  }

  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 20px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 30px;
  }

  .logo {
    width: 64px;
    height: 64px;
    border-radius: 22.37%;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.25);
  }

  .app-name {
    font-size: 64px; /* même hauteur visuelle que le logo */
    font-weight: 700;
    line-height: 1;
    margin: 0;
  }

  .invite-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 14px;
  }

  .invite-subtitle {
    font-size: 16px;
    font-weight: 700;
    color: #9a9a9a;
    margin-bottom: 40px;
  }

.cta-text {
  font-size: 15px;
  font-weight: 600;
  color: #e5e5e5;
  margin-bottom: 22px;
}

  .button {
    display: inline-block;
    padding: 16px 50px;
    font-size: 18px;
    font-weight: 700;
    color: black;
    background: rgb(255, 204, 102);
    border: none;
    border-radius: 14px;
    text-decoration: none;
    box-shadow: 0 8px 25px rgba(255, 204, 102, 0.35);
  }
</style>
</head>
<body>


<div class="header">
  <img src="/images/logo.webp" alt="Yester Logo" class="logo">
  <h1 class="app-name">Yester</h1>
</div>

<p class="invite-text">
  ${username ? `@${username} t'as invité à partager ce que tu faisais le 12 juin 2017` : "Invitation"}
</p>

${username ? `
  <p class="cta-text">
    👇 Découvre ce que faisait @${username} ce jour-là 👇
  </p>
` : ""}

<a href="yakabi://invite?ref=${ref}" class="button">
  Découvrir
</a>

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
