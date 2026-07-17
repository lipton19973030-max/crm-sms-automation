const notion = require('./notion');
const { reminderTemplate } = require('./templates');
const { sendSms } = require('./sms');
const cfg = require('./config');

async function run() {
  // Берём клиентов, которым дольше всего не отправляли напоминание
  // (пустая дата уходит вперёд благодаря sorts с null-обработкой Notion API)
  const result = await notion.queryDatabase(cfg.CLIENTS_DB_ID, {
    filter: {
      property: cfg.CLIENTS_PHONE_PROP,
      phone_number: { is_not_empty: true },
    },
    sorts: [
      { property: cfg.CLIENTS_LAST_REMINDER_PROP, direction: 'ascending' },
    ],
    page_size: cfg.DAILY_REMINDER_COUNT,
  });

  console.log(`Клиентов для напоминания сегодня: ${result.results.length}`);

  const today = new Date().toISOString().split('T')[0];

  for (const client of result.results) {
    try {
      const phone = notion.getPhone(client, cfg.CLIENTS_PHONE_PROP);
      const name = notion.getTitle(client);

      if (!phone) continue;

      const text = reminderTemplate(name);
      await sendSms(phone, text);
      console.log(`Отправлено ${phone}: ${text}`);

      await notion.updatePage(client.id, {
        [cfg.CLIENTS_LAST_REMINDER_PROP]: { date: { start: today } },
      });
    } catch (err) {
      console.error(`Ошибка при обработке клиента ${client.id}:`, err.message);
    }
  }
}

run().catch((err) => {
  console.error('Скрипт завершился с ошибкой:', err);
  process.exit(1);
});
