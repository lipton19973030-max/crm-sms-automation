// Настройки под вашу CRM. Если переименуете поля в Notion — поправьте здесь.

module.exports = {
  // ID баз данных Notion (из URL страницы базы данных)
  ORDERS_DB_ID: 'd1c01890-eebd-4659-b52a-085ae09e43ed',
  CLIENTS_DB_ID: '561c3254-4b71-43df-86a3-d37889917d9a',

  // Названия свойств в базе "Заказы"
  ORDERS_STATUS_PROP: 'Статус заказа',
  ORDERS_STATUS_DONE_VALUE: 'Выполнено',
  ORDERS_CLIENT_RELATION_PROP: 'Клиент',
  ORDERS_FEEDBACK_SENT_PROP: 'Отзыв запрошен',

  // Названия свойств в базе "Клиенты"
  CLIENTS_PHONE_PROP: 'Телефон',
  CLIENTS_LAST_REMINDER_PROP: 'Дата последнего напоминания',

  // Сколько клиентов брать в ежедневную рассылку
  DAILY_REMINDER_COUNT: 5,

  // Модель Claude для генерации текста SMS
  CLAUDE_MODEL: 'claude-haiku-4-5-20251001',
};
