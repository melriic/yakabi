<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="pageTitle">Profil Yakabi</title>
    <meta name="description" content="Rejoins-moi sur Yakabi - Daily Photo Roulette">
    
    <!-- Open Graph pour partage social (mis à jour dynamiquement) -->
    <meta property="og:title" content="Profil Yakabi" id="ogTitle">
    <meta property="og:description" content="Ajoute-moi sur Yakabi!" id="ogDescription">
    <meta property="og:type" content="profile">
    <meta property="og:url" content="https://yakabi.vercel.app/profile.html" id="ogUrl">
    <meta property="og:image" content="" id="ogImage">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            padding: 20px;
        }
        
        .container {
            text-align: center;
            max-width: 400px;
            width: 100%;
            animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .profile-image {
            width: 120px;
            height: 120px;
            margin: 0 auto 24px;
            border-radius: 30px;
            object-fit: cover;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .profile-image.loading {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
        }
        
        .app-name {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .name {
            font-size: 24px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 4px;
        }
        
        .username {
            font-size: 18px;
            color: #aaa;
            margin-bottom: 16px;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 32px;
            margin-bottom: 32px;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #fff;
        }
        
        .stat-label {
            font-size: 14px;
            color: #888;
            margin-top: 4px;
        }
        
        .subtitle {
            font-size: 16px;
            color: #888;
            margin-bottom: 24px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
        }
        
        .cta-button:active {
            transform: translateY(0);
        }
        
        .loading {
            margin-top: 24px;
            color: #888;
            font-size: 14px;
        }
        
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #444;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .error {
            color: #ff6b6b;
            margin-top: 16px;
            font-size: 14px;
        }
        
        .skeleton {
            background: linear-gradient(90deg, #2d2d2d 25%, #3d3d3d 50%, #2d2d2d 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 8px;
        }
        
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        .skeleton-text {
            height: 20px;
            margin: 8px auto;
        }
        
        .skeleton-stat {
            height: 16px;
            width: 40px;
            margin: 4px auto;
        }
        
        footer {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
        }
        
        footer a {
            color: #888;
            text-decoration: none;
            margin: 0 12px;
            font-size: 14px;
            transition: color 0.3s;
        }
        
        footer a:hover {
            color: #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Photo de profil -->
        <div class="profile-image loading" id="profileImage">🎲</div>
        
        <!-- Nom et username -->
        <h1 class="app-name">Yakabi</h1>
        <p class="name" id="nameDisplay">
            <span class="skeleton skeleton-text" style="width: 150px; display: inline-block;"></span>
        </p>
        <p class="username" id="usernameDisplay">
            <span class="skeleton skeleton-text" style="width: 100px; display: inline-block;"></span>
        </p>
        
        <!-- Stats -->
        <div class="stats" id="statsDisplay">
            <div class="stat">
                <div class="stat-value">
                    <span class="skeleton skeleton-stat"></span>
                </div>
                <div class="stat-label">Posts</div>
            </div>
            <div class="stat">
                <div class="stat-value">
                    <span class="skeleton skeleton-stat"></span>
                </div>
                <div class="stat-label">Abonné(es)</div>
            </div>
            <div class="stat">
                <div class="stat-value">
                    <span class="skeleton skeleton-stat"></span>
                </div>
                <div class="stat-label">Abonnements</div>
            </div>
        </div>
        
        <p class="subtitle">Daily Photo Roulette</p>
        
        <button class="cta-button" id="openButton" disabled style="opacity: 0.5;">
            Chargement...
        </button>
        
        <div class="loading" id="loadingText" style="display: none;">
            <span class="spinner"></span>
            Ouverture de l'app...
        </div>
        
        <p class="error" id="errorText" style="display: none;"></p>
    </div>
    
    <footer>
        <a href="index.html#home">Accueil</a>
        <a href="index.html#cgu">CGU</a>
        <a href="index.html#privacy">Confidentialité</a>
    </footer>
    
    <script>
        // ✅ SÉCURITÉ: Récupérer le USERNAME depuis l'URL (pas userId)
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('u');
        
        // ✅ Configuration
        const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_STORE_ID'; // TODO: Remplacer
        const DEEP_LINK_SCHEME = 'yakabi://profile/';
        const GRAPHQL_ENDPOINT = 'https://europe-west4-yakabi-d7e5e.cloudfunctions.net/graphql';
        
        // ✅ État du profil
        let profileData = null;
        
        // ✅ Charger les données du profil depuis GraphQL
        async function loadProfile() {
            if (!username) {
                showError('Aucun profil spécifié');
                return;
            }
            
            try {
                console.log('🔍 Chargement profil:', username);
                
                // ✅ Query GraphQL pour récupérer le profil par username
                const query = `
                    query GetUserByUsername($username: String!) {
                        getUserByUsername(username: $username) {
                            id
                            username
                            name
                            profileImageUrl
                            followersCount
                            followingCount
                        }
                    }
                `;
                
                const response = await fetch(GRAPHQL_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: { username: username }
                    })
                });
                
                const result = await response.json();
                
                if (result.errors) {
                    console.error('❌ Erreur GraphQL:', result.errors);
                    showError('Profil introuvable');
                    return;
                }
                
                profileData = result.data.getUserByUsername;
                
                if (!profileData) {
                    showError('Profil introuvable');
                    return;
                }
                
                console.log('✅ Profil chargé:', profileData);
                displayProfile(profileData);
                
            } catch (error) {
                console.error('❌ Erreur chargement profil:', error);
                showError('Erreur de chargement du profil');
            }
        }
        
        // ✅ Afficher les données du profil
        function displayProfile(profile) {
            // Photo de profil
            const profileImage = document.getElementById('profileImage');
            if (profile.profileImageUrl) {
                const img = document.createElement('img');
                img.src = profile.profileImageUrl;
                img.alt = profile.name;
                img.className = 'profile-image';
                img.onerror = () => {
                    // Fallback si image ne charge pas
                    profileImage.textContent = profile.name.charAt(0).toUpperCase();
                    profileImage.className = 'profile-image loading';
                };
                profileImage.replaceWith(img);
            } else {
                profileImage.textContent = profile.name.charAt(0).toUpperCase();
                profileImage.className = 'profile-image loading';
            }
            
            // Nom et username
            document.getElementById('nameDisplay').textContent = profile.name;
            document.getElementById('usernameDisplay').textContent = '@' + profile.username;
            
            // Stats
            document.getElementById('statsDisplay').innerHTML = `
                <div class="stat">
                    <div class="stat-value">${formatCount(0)}</div>
                    <div class="stat-label">Posts</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${formatCount(profile.followersCount || 0)}</div>
                    <div class="stat-label">Abonné(es)</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${formatCount(profile.followingCount || 0)}</div>
                    <div class="stat-label">Abonnements</div>
                </div>
            `;
            
            // Mettre à jour les meta tags pour partage social
            document.title = `@${profile.username} sur Yakabi`;
            document.getElementById('pageTitle').textContent = `@${profile.username} sur Yakabi`;
            document.getElementById('ogTitle').setAttribute('content', `@${profile.username} sur Yakabi`);
            document.getElementById('ogDescription').setAttribute('content', `Rejoins ${profile.name} sur Yakabi!`);
            document.getElementById('ogUrl').setAttribute('content', window.location.href);
            if (profile.profileImageUrl) {
                document.getElementById('ogImage').setAttribute('content', profile.profileImageUrl);
            }
            
            // Activer le bouton
            const button = document.getElementById('openButton');
            button.textContent = 'Ouvrir le profil dans Yakabi';
            button.disabled = false;
            button.style.opacity = '1';
        }
        
        // ✅ Formater les nombres (1000 → 1K)
        function formatCount(count) {
            if (count >= 1000000) {
                return (count / 1000000).toFixed(1) + 'M';
            } else if (count >= 1000) {
                return (count / 1000).toFixed(1) + 'K';
            }
            return count.toString();
        }
        
        // ✅ Fonction pour ouvrir l'app ou l'App Store
        function openProfile() {
            if (!username) {
                showError('Profil introuvable');
                return;
            }
            
            const deepLink = DEEP_LINK_SCHEME + username;
            const button = document.getElementById('openButton');
            const loading = document.getElementById('loadingText');
            
            // Afficher le loading
            button.style.display = 'none';
            loading.style.display = 'block';
            
            // ✅ PATTERN INDUSTRIE: Tentative d'ouverture deep link
            window.location.href = deepLink;
            
            // ✅ Fallback vers App Store après 2.5s si app non installée
            setTimeout(() => {
                window.location.href = APP_STORE_URL;
            }, 2500);
        }
        
        function showError(message) {
            const errorText = document.getElementById('errorText');
            errorText.textContent = message;
            errorText.style.display = 'block';
            
            const button = document.getElementById('openButton');
            button.textContent = 'Profil introuvable';
            button.disabled = true;
            button.style.opacity = '0.5';
        }
        
        // ✅ Attacher l'événement au bouton
        document.getElementById('openButton').addEventListener('click', openProfile);
        
        // ✅ Charger le profil au chargement de la page
        window.addEventListener('load', () => {
            loadProfile();
        });
    </script>
</body>
</html>
