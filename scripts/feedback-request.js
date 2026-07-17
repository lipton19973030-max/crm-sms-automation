const notion = require('./notion');
const { feedbackTemplate } = require('./templates');
const { sendSms } = require('./sms');
const cfg = require('./config');

async function run() {
  const todayStr = new Date().toISOString().split('T')[0]; // "2026-07-17"

  const result = await notion.queryDatabase(cfg.ORDERS_DB_ID, {
    filter: {
      and: [
        {
          property: cfg.ORDERS_STATUS_PROP,
          status: { equals: cfg.ORDERS_STATUS_DONE_VALUE },
        },
        {
          property: cfg.ORDERS_FEEDBACK_SENT_PROP,
          checkbox: { equals: false },
        },
        {
          property: cfg.ORDERS_DATE_PROP,
          date: { equals: todayStr },
        },
      ],
    },
  });

  console.log(`Найдено заказов для отправки отзыва: ${result.results.length}`);

  for (const order of result.results) {
    try {
      const clientIds = notion.getRelationIds(order, cfg.ORDERS_CLIENT_RELATION_PROP);
      if (clientIds.length === 0) {
        console.log(`Заказ ${order.id}: нет привязанного клиента, пропуск`);
        continue;
      }

      const client = await notion.getPage(clientIds[0]);
      const phone = notion.getPhone(client, cfg.CLIENTS_PHONE_PROP);
      const name = notion.getTitle(client);

      if (!phone) {
        console.log(`Клиент ${name || client.id}: нет телефона, пропуск`);
        continue;
      }

      const text = feedbackTemplate(name);
      await sendSms(phone, text);
      console.log(`Отправлено ${phone}: ${text}`);

      await notion.updatePage(order.id, {
        [cfg.ORDERS_FEEDBACK_SENT_PROP]: { checkbox: true },
      });
    } catch (err) {
      console.error(`Ошибка при обработке заказа ${order.id}:`, err.message);
    }
  }
}

run().catch((err) => {
  console.error('Скрипт завершился с ошибкой:', err);
  process.exit(1);
});