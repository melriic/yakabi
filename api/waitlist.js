module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const email = body?.email;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  // Pays détecté automatiquement via Vercel
  const country = req.headers['x-vercel-ip-country'] || 'unknown';

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [3],
        updateEnabled: true,
        attributes: { COUNTRY: country },
      }),
    });

    const text = await response.text();
    console.log('Brevo status:', response.status, 'country:', country, 'body:', text);

    if (response.status === 201 || response.status === 204) {
      return res.status(200).json({ success: true });
    }

    let data = {};
    try { data = JSON.parse(text); } catch {}

    if (data.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true });
    }

    return res.status(500).json({ error: 'Erreur Brevo', detail: text });
  } catch (err) {
    console.error('Waitlist error:', err.message);
    return res.status(500).json({ error: 'Erreur serveur', detail: err.message });
  }
};

