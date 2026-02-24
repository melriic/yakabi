// ✅ Vercel Edge Function pour générer les meta tags dynamiquement
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const ref = searchParams.get('ref');
  
  // Générer le HTML avec les meta tags personnalisés
const title = username ? `@${username} t'invite sur Yester` : 'Yester';
  const description = username 
    ? `Rejoins ${username} sur Yester - Le réseau social du passé`
    : 'Le réseau social du passé';


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
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    background: linear-gradient(180deg, #000000 0%, #0d0d0d 50%, #000000 100%);
    color: white;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    text-align: center;
    padding: 40px 24px;
    max-width: 420px;
  }

  .logo {
    width: 72px;
    height: 72px;
    border-radius: 22.37%;
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.25);
    margin-bottom: 40px;
  }

  .invite-text {
    font-size: 18px;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    line-height: 1.5;
    margin-bottom: 30px;
  }

.highlight-date {
  color: rgb(255, 204, 102);
  font-weight: 700;
  letter-spacing: 0.5px;
}

  .cta-text {
    font-size: 15px;
    font-weight: 600;
    color: #e5e5e5;
    margin-bottom: 22px;
  }

.button {
  display: inline-block;
  padding: 14px 28px;
  font-size: 17px;
  font-weight: 700;
  color: black; /* texte noir */

  background: rgba(255, 204, 102, 0.5); /* fond 50% */
  border-radius: 999px;
  text-decoration: none;

  border: 3px solid rgb(255, 204, 102); /* stroke pleine */
  backdrop-filter: blur(10px);
}

</style>
</head>
<body>


<body>
  <div class="container">

    <img src="/images/logo.webp" alt="Yester Logo" class="logo">

    ${username ? `
      <p class="invite-text">
        @${username} t'a invité à partager<br>
        ce que tu faisais le 
        <span class="highlight-date">${randomDate}</span>
      </p>

      <p class="cta-text">
        👇 Découvre ce que faisait @${username} ce jour-là 👇
      </p>
    ` : ""}

    <a href="yakabi://invite?ref=${ref}" class="button">
      Découvrir sur Yester
    </a>

  </div>

  <script>
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
