// js/chatbot.js - LUX Chatbot Logic

(function () {
  // ─── DOM References ────────────────────────────────────────────────────────
  const trigger     = document.getElementById('chatbot-trigger');
  const panel       = document.getElementById('chatbot-panel');
  const closeBtn    = document.getElementById('chatbot-close');
  const messagesEl  = document.getElementById('chatbot-messages');
  const input       = document.getElementById('chatbot-input');
  const sendBtn     = document.getElementById('chatbot-send');

  // ─── State ─────────────────────────────────────────────────────────────────
  let isOpen        = false;
  let isLoading     = false;
  let history       = [];           // { role: 'user'|'assistant', content: '' }
  let hasGreeted    = false;

  // ─── Open / Close ──────────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    panel.classList.add('active');
    trigger.classList.add('chat-open');
    input.focus();

    if (!hasGreeted) {
      hasGreeted = true;
      setTimeout(() => {
        appendMessage(
          'assistant',
          "Oh look, a visitor. I'm **LUX**, Harra's AI assistant, and yes, I'm already judging you. Ask me about her skills, projects, or how to hire her. Or just say hi if you have nothing better to do. Try to make your questions semi-intelligent. 🙄"
        );
      }, 400);
    }
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('active');
    trigger.classList.remove('chat-open');
  }

  trigger.addEventListener('click', () => (isOpen ? closeChat() : openChat()));
  closeBtn.addEventListener('click', closeChat);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !panel.contains(e.target) && !trigger.contains(e.target)) {
      closeChat();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  // ─── Message Rendering ─────────────────────────────────────────────────────
  function appendMessage(role, content) {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-msg chat-msg--${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    // Simple markdown-lite: bold **text**, line breaks
    bubble.innerHTML = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);

    // Animate in
    requestAnimationFrame(() => {
      wrapper.style.opacity = '0';
      wrapper.style.transform = role === 'user' ? 'translateX(20px)' : 'translateX(-20px)';
      requestAnimationFrame(() => {
        wrapper.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateX(0)';
      });
    });

    scrollToBottom();
    return wrapper;
  }

  function showTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-msg chat-msg--assistant chat-typing';
    wrapper.id = 'typing-indicator';
    wrapper.innerHTML = `
      <div class="chat-bubble typing-dots">
        <span></span><span></span><span></span>
      </div>`;
    messagesEl.appendChild(wrapper);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  function scrollToBottom() {
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
  }

  // ─── Send Logic ────────────────────────────────────────────────────────────
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    // Append user message
    appendMessage('user', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    input.style.height = 'auto';

    // Lock UI
    isLoading = true;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="ri-loader-4-line chat-spin"></i>';

    showTypingIndicator();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      removeTypingIndicator();

      if (!res.ok) {
        let errMsg = 'API error';
        try {
          const errData = await res.json();
          errMsg = errData.error || errData.message || JSON.stringify(errData);
          if (errData.details) {
            errMsg += ` - ${errData.details}`;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await res.json();
      const reply = data.reply || "I'm not sure how to answer that — please try again!";

      appendMessage('assistant', reply);
      history.push({ role: 'assistant', content: reply });

    } catch (err) {
      if (history.length > 0 && history[history.length - 1].role === 'user') {
        history.pop();
      }
      removeTypingIndicator();
      appendMessage(
        'assistant',
        "Look, you either spammed me or hit my rate limit. Harra is currently on the free tier because she doesn’t have the budget for premium API credits. If you want me to keep answering your questions, go **hire her** or **give her a project** so she can afford to upgrade me. Until then, wait a minute or try again later. 🙄"
      );
      console.error('Chatbot error:', err);
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="ri-send-plane-fill"></i>';
    }
  }

  // ─── Input Events ──────────────────────────────────────────────────────────
  sendBtn.addEventListener('click', sendMessage);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  // ─── Suggested Questions ───────────────────────────────────────────────────
  document.querySelectorAll('.chat-suggestion').forEach((btn) => {
    btn.addEventListener('click', () => {
      input.value = btn.textContent;
      sendMessage();
    });
  });
})();
