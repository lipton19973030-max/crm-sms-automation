async function sendSms(phone, text) {
  const url = new URL('https://sms.ru/sms/send');
  url.searchParams.set('api_id', process.env.SMS_RU_API_ID);
  url.searchParams.set('to', phone);
  url.searchParams.set('msg', text);
  url.searchParams.set('json', '1');

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK') {
    throw new Error(`SMS.ru error: ${JSON.stringify(data)}`);
  }
  return data;
}

module.exports = { sendSms };
