// Current Year for Footer
document.getElementById('anoAtual').textContent = new Date().getFullYear();

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Chatbot functionality
const chatWindow = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const chatUserInput = document.getElementById('chatUserInput');
const chatIcon = document.getElementById('chatIcon');
const quickActions = document.getElementById('quickActions');

function toggleChatbot() {
  chatWindow.classList.toggle('active');
  if (chatWindow.classList.contains('active')) {
    chatIcon.className = 'fa-solid fa-xmark';
    chatUserInput.focus();
  } else {
    chatIcon.className = 'fa-solid fa-comment-dots';
  }
}

function addMessage(sender, text) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function chatSelectOption(option) {
  if (quickActions) {
    quickActions.style.display = 'none'; // Hide quick actions after selection
  }

  if (option === 'agendar') {
    addMessage('user', 'Gostaria de agendar um horário.');
    setTimeout(() => {
      addMessage('bot', 'Excelente escolha, cavalheiro. Clique abaixo para abrir nossa agenda diretamente com o concierge:');
      addMessage('bot', '<a href="https://wa.me/5538999201096?text=Ol%C3%A1!%20Gostaria%20de%20ver%20os%20hor%C3%A1rios%20livres." target="_blank" class="chat-btn" style="display:block; margin-top:10px;">Falar com a Recepção (WhatsApp)</a>');
    }, 500);
  } else if (option === 'precos') {
    addMessage('user', 'Pode me mostrar os serviços disponíveis?');
    setTimeout(() => {
      addMessage('bot', '<strong>Serviços Principais:</strong><br><br>• Corte Masculino Clássico<br>• Barboterapia com Toalha Quente<br>• Combo O Cavalheiro (Cabelo + Barba)<br><br><em>Todos incluem cortesia de chopp artesanal ou café premium.</em>');
    }, 500);
  } else if (option === 'horarios') {
    addMessage('user', 'Onde vocês ficam e qual o horário?');
    setTimeout(() => {
      addMessage('bot', '<strong>Endereço:</strong><br>Rua Raul Corrêa, 766 - Funcionários, Montes Claros.<br><br><strong>Horários:</strong><br>Seg a Qui: 09h-20h<br>Sex: 09h-21h<br>Sáb: 09h-19h');
    }, 500);
  }
}

function sendUserMessage() {
  const text = chatUserInput.value.trim();
  if (!text) return;
  
  if (quickActions) {
    quickActions.style.display = 'none';
  }

  addMessage('user', text);
  chatUserInput.value = '';

  setTimeout(() => {
    const lower = text.toLowerCase();
    if (lower.includes('preço') || lower.includes('valor') || lower.includes('serviço')) {
      chatSelectOption('precos');
    } else if (lower.includes('agendar') || lower.includes('corte') || lower.includes('barba')) {
      chatSelectOption('agendar');
    } else if (lower.includes('onde') || lower.includes('endereço') || lower.includes('horário')) {
      chatSelectOption('horarios');
    } else {
      addMessage('bot', 'Para lhe atender com a excelência que merece, por favor, contate nossa recepção diretamente:');
      addMessage('bot', `<a href="https://wa.me/5538999201096?text=Ol%C3%A1!%20${encodeURIComponent(text)}" target="_blank" class="chat-btn" style="display:block; margin-top:10px;">Falar via WhatsApp</a>`);
    }
  }, 600);
}

function handleChatKey(e) {
  if (e.key === 'Enter') {
    sendUserMessage();
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            // Close mobile menu if open
            navLinks.classList.remove('show');
            
            // Scroll to target
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
