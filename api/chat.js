module.exports = async (req, res) => {
  // Permissões de CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Método não permitido. Utilize POST.' } });
  }

  // Token prioritário da variável de ambiente da Vercel (HF_TOKEN)
  const authHeader = req.headers.authorization || '';
  const clientToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const token = clientToken || process.env.HF_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: {
        message: 'Token HF_TOKEN não configurado nas variáveis de ambiente da Vercel.'
      }
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const { messages, model = 'Qwen/Qwen2.5-7B-Instruct' } = body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: { message: 'O parâmetro "messages" deve ser um array válido de mensagens.' }
    });
  }

  try {
    const hfResponse = await fetch('https://router.huggingface.co/hf-inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await hfResponse.json().catch(() => ({}));

    if (!hfResponse.ok) {
      const errorMsg = data.error?.message || data.message || `Erro da Hugging Face (Status ${hfResponse.status})`;
      return res.status(hfResponse.status).json({
        error: { message: errorMsg }
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: { message: `Falha na requisição ao Hugging Face: ${err.message}` }
    });
  }
};
