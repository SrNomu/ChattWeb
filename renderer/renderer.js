// Controles da janela
const minBtn = document.getElementById('min-btn');
const maxBtn = document.getElementById('max-btn');
const closeBtn = document.getElementById('close-btn');

minBtn?.addEventListener('click', () => window.api.send('window-control', 'minimize'));
maxBtn?.addEventListener('click', () => window.api.send('window-control', 'maximize'));
closeBtn?.addEventListener('click', () => window.api.send('window-control', 'close'));

// Alternar entre serviços
window.switchView = (service) => {
  window.api.send('switch-view', service);
  updateActiveIcon(service);
};

// Atualizar destaque do ícone ativo
function updateActiveIcon(activeService) {
  const wrappers = document.querySelectorAll('#sidebar .icon-wrapper');
  wrappers.forEach(w => w.classList.remove('active'));
  const wrapper = Array.from(wrappers).find(w => (w.getAttribute('onclick') || '').includes(activeService));
  if (wrapper) wrapper.classList.add('active');
}

// Inicializa o primeiro ícone ativo
document.addEventListener('DOMContentLoaded', () => updateActiveIcon('whatsapp1'));

// Função para enviar notificações do sistema (som será nativo do WhatsApp Web)
function notify(title, message) {
  window.api.send('show-notification', title, message);
}

// Exemplo de uso:
// notify('Nova Mensagem', 'Você recebeu uma mensagem!');
