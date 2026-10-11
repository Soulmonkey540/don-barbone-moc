// ==========================================
// DON BARBONE - JAVASCRIPT & IA CONCIERGE
// ==========================================

// Current Year for Footer
document.getElementById('anoAtual').textContent = new Date().getFullYear();

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      if (navLinks) navLinks.classList.remove('show');
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ==========================================
// CHATBOT & HUGGING FACE AI INTEGRATION
// ==========================================

const chatWindow = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const chatUserInput = document.getElementById('chatUserInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatIcon = document.getElementById('chatIcon');
const quickActions = document.getElementById('quickActions');
const chatSettingsPanel = document.getElementById('chatSettingsPanel');
const chatSettingsBtn = document.getElementById('chatSettingsBtn');
const chatStatusText = document.getElementById('chatStatusText');
const hfTokenInput = document.getElementById('hfTokenInput');
const hfModelSelect = document.getElementById('hfModelSelect');

// Configurações e Estado
let hfToken = localStorage.getItem('don_barbone_hf_token') || '';
let hfModel = localStorage.getItem('don_barbone_hf_model') || 'Qwen/Qwen2.5-7B-Instruct';

// Histórico de Conversação na Memória
let conversationHistory = [];

// Inicializa valores nos inputs de configuração
if (hfTokenInput && hfToken) hfTokenInput.value = hfToken;
if (hfModelSelect && hfModel) hfModelSelect.value = hfModel;
updateChatStatus();

// Prompt do Sistema refinado para a identidade Don Barbone
const DON_BARBONE_SYSTEM_PROMPT = `Você é o Concierge Virtual exclusivo da 'Don Barbone', uma renomada barbearia clássica e bar vintage localizada em Montes Claros - MG (Rua Raul Corrêa, 766 - Bairro Funcionários).

Personalidade e Diretrizes:
- Tom de voz: Cavalheiro, sofisticado, elegante, acolhedor e atencioso. Chame o cliente de "cavalheiro" ou "senhor".
- Seja direto, claro e cortês (respostas entre 2 a 4 frases, evitando textos excessivamente longos).
- Quando for oportuno, mencione que todo atendimento inclui como cortesia um chopp artesanal trincando ou um café premium expresso.
- Se o cliente perguntar sobre agendamento, indique os horários e recomende finalizar pelo WhatsApp da barbearia: (38) 99920-1096.

Informações Oficiais:
- Serviços & Tabela:
  • Corte Masculino Clássico / Degradê: R$ 60,00
  • Barboterapia com Toalha Quente & Navalha: R$ 50,00
  • Combo O Cavalheiro (Cabelo + Barba): R$ 95,00
  • Acabamento / Pezinho: R$ 30,00
  • Selagem / Alinhamento Capilar: a partir de R$ 90,00
- Horários de Funcionamento:
  • Segunda a Quinta: 09h às 20h
  • Sexta: 09h às 21h
  • Sábado: 09h às 19h
  • Domingo e Feriados: Fechado
- Endereço: Rua Raul Corrêa, 766 - Bairro Funcionários, Montes Claros - MG. (Próximo à praça, estacionamento facilitado na rua).
- Bar & Drinks: Chopp artesanal e café expresso cortesia para clientes em atendimento. Bar com cervejas artesanais e whiskies importados.
- Formas de Pagamento: Pix, Cartões de Débito e Crédito, Dinheiro.
- Telefone / WhatsApp: (38) 99920-1096 ou (38) 3016-1096.

Responda sempre em português do Brasil, de forma elegante e prestativa.`;

// Alterna exibição do Chat
function toggleChatbot() {
  chatWindow.classList.toggle('active');
  if (chatWindow.classList.contains('active')) {
    chatIcon.className = 'fa-solid fa-xmark';
    chatUserInput.focus();
  } else {
    chatIcon.className = 'fa-solid fa-comment-dots';
  }
}

// Alterna painel de configurações Hugging Face
function toggleChatSettings() {
  if (chatSettingsPanel.style.display === 'none' || !chatSettingsPanel.style.display) {
    chatSettingsPanel.style.display = 'flex';
    chatSettingsBtn.classList.add('active');
  } else {
    chatSettingsPanel.style.display = 'none';
    chatSettingsBtn.classList.remove('active');
  }
}

// Salva token e modelo no localStorage
function saveHfSettings() {
  const token = hfTokenInput.value.trim();
  const model = hfModelSelect.value;
  
  hfToken = token;
  hfModel = model;
  
  if (token) {
    localStorage.setItem('don_barbone_hf_token', token);
  } else {
    localStorage.removeItem('don_barbone_hf_token');
  }
  localStorage.setItem('don_barbone_hf_model', model);

  updateChatStatus();
  toggleChatSettings();

  const msg = token 
    ? '✨ <strong>IA Hugging Face ativada com sucesso!</strong> Agora você está conversando em tempo real com o modelo <em>' + model.split('/')[1] + '</em>.' 
    : 'ℹ️ Token removido. O Concierge retornou ao modo inteligente local.';
  addMessage('bot', msg);
}

// Atualiza status no cabeçalho
function updateChatStatus() {
  if (!chatStatusText) return;
  if (hfToken) {
    chatStatusText.className = 'ai-active';
    chatStatusText.innerHTML = '<i class="fa-solid fa-brain"></i> IA Hugging Face';
  } else {
    chatStatusText.className = '';
    chatStatusText.innerHTML = '<i class="fa-solid fa-circle"></i> Concierge Online';
  }
}

// Limpa histórico
function clearChatHistory() {
  conversationHistory = [];
  chatMessages.innerHTML = `
    <div class="chat-bubble bot">
      Saudações novamente, cavalheiro! 💈 Como posso servi-lo agora?
    </div>
    <div class="chat-quick-actions" id="quickActions">
      <button class="chat-btn" onclick="chatSelectOption('agendar')">Agendar Horário</button>
      <button class="chat-btn" onclick="chatSelectOption('precos')">Serviços & Preços</button>
      <button class="chat-btn" onclick="chatSelectOption('horarios')">Horários & Local</button>
      <button class="chat-btn" onclick="chatSelectOption('bar')">Bar & Chopp</button>
    </div>
  `;
}

// Formata texto com Markdown básico para HTML
function formatMarkdown(text) {
  if (!text) return '';
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
  return formatted;
}

// Adiciona bolha de mensagem ao chat
function addMessage(sender, htmlContent) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = htmlContent;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Indicador animado de digitação ("...")
let typingIndicatorElement = null;

function showTypingIndicator() {
  if (typingIndicatorElement) return;
  typingIndicatorElement = document.createElement('div');
  typingIndicatorElement.className = 'chat-typing-indicator';
  typingIndicatorElement.id = 'chatTypingIndicator';
  typingIndicatorElement.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(typingIndicatorElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  if (typingIndicatorElement) {
    typingIndicatorElement.remove();
    typingIndicatorElement = null;
  }
}

// Botões de Ação Rápida
function chatSelectOption(option) {
  const quickActionsEl = document.getElementById('quickActions');
  if (quickActionsEl) {
    quickActionsEl.style.display = 'none';
  }

  if (option === 'agendar') {
    addMessage('user', 'Gostaria de agendar um horário.');
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      addMessage('bot', 'Excelente decisão, cavalheiro. Para consultar a agenda em tempo real e reservar seu momento de cuidado e relaxamento, fale diretamente com nossa recepção:');
      addMessage('bot', '<a href="https://wa.me/5538999201096?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20os%20hor%C3%A1rios%20dispon%C3%ADveis%20na%20Don%20Barbone." target="_blank" class="chat-btn" style="margin-top:4px;"><i class="fa-brands fa-whatsapp"></i> Abrir WhatsApp da Recepção</a>');
    }, 600);
  } else if (option === 'precos') {
    addMessage('user', 'Quais são os serviços e valores disponíveis?');
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      addMessage('bot', '<strong>Cardápio de Serviços Don Barbone:</strong><br><br>' +
        '• <strong>Corte Masculino Clássico / Degradê:</strong> R$ 60<br>' +
        '• <strong>Barboterapia (Toalha Quente & Navalha):</strong> R$ 50<br>' +
        '• <strong>Combo O Cavalheiro (Corte + Barba):</strong> R$ 95<br>' +
        '• <strong>Acabamento / Pezinho:</strong> R$ 30<br>' +
        '• <strong>Selagem / Alinhamento:</strong> a partir de R$ 90<br><br>' +
        '<em>*Todos os atendimentos incluem cortesia de chopp artesanal trincando ou café premium.</em>');
      addMessage('bot', '<a href="https://wa.me/5538999201096?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20Combo%20ou%20Corte." target="_blank" class="chat-btn" style="margin-top:4px;"><i class="fa-brands fa-whatsapp"></i> Agendar Serviço</a>');
    }, 600);
  } else if (option === 'horarios') {
    addMessage('user', 'Onde vocês ficam e qual o horário de funcionamento?');
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      addMessage('bot', '<strong>Localização:</strong><br>Rua Raul Corrêa, 766 - Bairro Funcionários, Montes Claros - MG.<br><br>' +
        '<strong>Horários de Atendimento:</strong><br>' +
        '• Segunda a Quinta: 09h às 20h<br>' +
        '• Sexta: 09h às 21h<br>' +
        '• Sábado: 09h às 19h<br>' +
        '• Domingo: Fechado');
      addMessage('bot', '<a href="https://maps.google.com/?q=Rua+Raul+Correa+766+Montes+Claros" target="_blank" class="chat-btn" style="margin-top:4px;"><i class="fa-solid fa-map-location-dot"></i> Ver no Google Maps</a>');
    }, 600);
  } else if (option === 'bar') {
    addMessage('user', 'Como funciona a cortesia de chopp e o bar?');
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      addMessage('bot', 'Na Don Barbone acreditamos que cortar o cabelo ou alinhar a barba deve ser uma pausa prazerosa no seu dia.<br><br>' +
        'Ao sentar em nossa cadeira, você é recebido com uma <strong>cortesia exclusiva:</strong> um copo de <strong>chopp artesanal gelado</strong> ou um <strong>café espresso moído na hora</strong>.<br><br>' +
        'Nosso bar conta ainda com carta selecionada de cervejas e whiskies para apreciar.');
    }, 600);
  }
}

// Normaliza texto para facilitar casamento de palavras no Concierge local
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Motor de Resposta Local Inteligente (Zero-Token / Fallback)
function getLocalConciergeResponse(userText) {
  const norm = normalizeText(userText);

  // Agendamento
  if (norm.includes('agend') || norm.includes('marcar') || norm.includes('reserv') || norm.includes('vaga') || norm.includes('horario livre')) {
    return {
      text: 'Com certeza, cavalheiro! Nossa recepção cuida do agendamento com todo o conforto. Toque no botão abaixo para escolher o melhor horário para você:',
      button: {
        label: '<i class="fa-brands fa-whatsapp"></i> Agendar pelo WhatsApp',
        url: `https://wa.me/5538999201096?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20Don%20Barbone.`
      }
    };
  }

  // Preços e Serviços
  if (norm.includes('preco') || norm.includes('valor') || norm.includes('quanto') || norm.includes('servico') || norm.includes('tabela') || norm.includes('custa')) {
    return {
      text: '<strong>Nossos principais serviços e valores:</strong><br><br>' +
        '• <strong>Corte Masculino Clássico / Degradê:</strong> R$ 60<br>' +
        '• <strong>Barboterapia (Toalha Quente):</strong> R$ 50<br>' +
        '• <strong>Combo O Cavalheiro (Corte + Barba):</strong> R$ 95<br>' +
        '• <strong>Acabamento / Pezinho:</strong> R$ 30<br>' +
        '• <strong>Selagem / Tratamento:</strong> a partir de R$ 90<br><br>' +
        '<em>Todos com direito a chopp artesanal ou café expresso de cortesia.</em>',
      button: {
        label: '<i class="fa-brands fa-whatsapp"></i> Reservar um Horário',
        url: `https://wa.me/5538999201096?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20servi%C3%A7o.`
      }
    };
  }

  // Endereço e Local
  if (norm.includes('onde') || norm.includes('local') || norm.includes('endereco') || norm.includes('bairro') || norm.includes('como chegar') || norm.includes('rua') || norm.includes('estacionamento')) {
    return {
      text: 'Estamos situados na <strong>Rua Raul Corrêa, 766 - Bairro Funcionários</strong>, em Montes Claros - MG. Um local tranquilo, com estacionamento facilitado na rua.',
      button: {
        label: '<i class="fa-solid fa-location-dot"></i> Abrir no Google Maps',
        url: 'https://maps.google.com/?q=Rua+Raul+Correa+766+Montes+Claros'
      }
    };
  }

  // Horários de Atendimento
  if (norm.includes('horario') || norm.includes('que horas') || norm.includes('funciona') || norm.includes('abre') || norm.includes('fecha') || norm.includes('sabado') || norm.includes('domingo')) {
    return {
      text: '<strong>Nossos horários de atendimento:</strong><br><br>' +
        '• <strong>Segunda a Quinta:</strong> 09h às 20h<br>' +
        '• <strong>Sexta-feira:</strong> 09h às 21h<br>' +
        '• <strong>Sábado:</strong> 09h às 19h<br>' +
        '• <strong>Domingo:</strong> Fechado'
    };
  }

  // Bebidas, Chopp e Bar
  if (norm.includes('chopp') || norm.includes('cerveja') || norm.includes('bebida') || norm.includes('bar') || norm.includes('cafe') || norm.includes('drink') || norm.includes('whisky')) {
    return {
      text: 'Aqui a experiência é completa: você é sempre recebido com um <strong>chopp artesanal gelado</strong> ou um <strong>café espresso gourmet</strong> por conta da casa enquanto aguarda ou realiza seu atendimento!'
    };
  }

  // Pagamentos
  if (norm.includes('pagamento') || norm.includes('pagar') || norm.includes('cartao') || norm.includes('pix') || norm.includes('dinheiro') || norm.includes('debito') || norm.includes('credito')) {
    return {
      text: 'Aceitamos <strong>Pix</strong>, <strong>Cartões de Débito e Crédito</strong> (todas as principais bandeiras) e <strong>Dinheiro</strong>.'
    };
  }

  // Saudações
  if (norm.startsWith('ola') || norm.startsWith('oi') || norm.includes('boa tarde') || norm.includes('bom dia') || norm.includes('boa noite') || norm.includes('opa')) {
    return {
      text: 'Saudações, cavalheiro! É uma honra tê-lo conosco na Don Barbone. Em que posso auxiliá-lo nesta data? Deseja consultar serviços, valores ou agendar seu corte?'
    };
  }

  // Agradecimento
  if (norm.includes('obrigad') || norm.includes('valeu') || norm.includes('show') || norm.includes('perfeito') || norm.includes('otimo')) {
    return {
      text: 'O prazer é todo nosso, meu nobre. Estaremos sempre de portas abertas para lhe receber com o padrão que você merece!'
    };
  }

  // Fallback padrão amigável
  return {
    text: 'Entendido, cavalheiro. Para lhe dar uma resposta personalizada com a atenção que merece, fale diretamente com nossa recepção no WhatsApp:',
    button: {
      label: '<i class="fa-brands fa-whatsapp"></i> Conversar com a Recepção',
      url: `https://wa.me/5538999201096?text=Ol%C3%A1!%20${encodeURIComponent(userText)}`
    }
  };
}

// Chamada à API da Hugging Face via Router (compatível com CORS)
async function callHuggingFaceAPI(userMessage) {
  const token = hfToken.trim();
  const model = hfModel || 'Qwen/Qwen2.5-7B-Instruct';

  // Monta histórico de mensagens para dar contexto
  const messages = [
    { role: 'system', content: DON_BARBONE_SYSTEM_PROMPT },
    ...conversationHistory.slice(-6),
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://router.huggingface.co/hf-inference/v1/chat/completions', {
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

  if (!response.ok) {
    const errorDetails = await response.json().catch(() => ({}));
    const errorMsg = errorDetails.error?.message || errorDetails.message || `Status HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const replyContent = data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : null;

  if (!replyContent) {
    throw new Error('Resposta vazia da API Hugging Face.');
  }

  return replyContent.trim();
}

// Envio de Mensagem do Usuário
async function sendUserMessage() {
  const text = chatUserInput.value.trim();
  if (!text) return;

  const quickActionsEl = document.getElementById('quickActions');
  if (quickActionsEl) {
    quickActionsEl.style.display = 'none';
  }

  // Exibe mensagem do usuário
  addMessage('user', formatMarkdown(text));
  chatUserInput.value = '';

  // Bloqueia input momentaneamente
  chatUserInput.disabled = true;
  chatSendBtn.disabled = true;
  showTypingIndicator();

  // Se houver Hugging Face Token configurado, consulta a IA
  if (hfToken) {
    try {
      const aiReply = await callHuggingFaceAPI(text);
      hideTypingIndicator();

      // Atualiza histórico
      conversationHistory.push({ role: 'user', content: text });
      conversationHistory.push({ role: 'assistant', content: aiReply });

      addMessage('bot', formatMarkdown(aiReply));
    } catch (err) {
      console.warn('Erro ao consultar Hugging Face:', err);
      hideTypingIndicator();

      // Aviso suave e fallback para o concierge local
      addMessage('bot', `<small style="color:var(--accent-hover); display:block; margin-bottom:6px;"><i class="fa-solid fa-triangle-exclamation"></i> Resposta via Concierge Local (HF retornou: ${err.message})</small>`);
      
      const localResp = getLocalConciergeResponse(text);
      addMessage('bot', localResp.text);
      if (localResp.button) {
        addMessage('bot', `<a href="${localResp.button.url}" target="_blank" class="chat-btn" style="margin-top:4px;">${localResp.button.label}</a>`);
      }
    }
  } else {
    // Sem token: responde com o Concierge Local inteligente
    setTimeout(() => {
      hideTypingIndicator();
      const localResp = getLocalConciergeResponse(text);
      addMessage('bot', localResp.text);
      if (localResp.button) {
        addMessage('bot', `<a href="${localResp.button.url}" target="_blank" class="chat-btn" style="margin-top:4px;">${localResp.button.label}</a>`);
      }
    }, 550);
  }

  // Reabilita inputs
  chatUserInput.disabled = false;
  chatSendBtn.disabled = false;
  chatUserInput.focus();
}

function handleChatKey(e) {
  if (e.key === 'Enter') {
    sendUserMessage();
  }
}
