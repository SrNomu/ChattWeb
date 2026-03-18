const { Notification } = require('electron');
const path = require('path');

function sendSystemNotification(title, message) {
  // Cria notificação visual sem som
  const notification = new Notification({
    title: title, // título padrão caso não seja informado
    body: message,
    icon: path.join(__dirname, '../ChattWeb.ico'), // ícone personalizado
    silent: true // garante que o sistema não toque som
  });

  notification.show();
}

module.exports = { sendSystemNotification };
