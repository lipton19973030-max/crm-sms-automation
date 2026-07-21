async function sendSms(phone, text) {
  const params = new URLSearchParams({
    login: process.env.SMSC_LOGIN,
    psw: process.env.SMSC_PASSWORD,
    phones: phone,
    mes: text,
    fmt: '3',
    charset: 'utf-8'
  });

  const res = await fetch('https://smsc.ru/sys/send.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const data = await res.json();

  if (data.error_code) {
    throw new Error('SMSC error: ' + JSON.stringify(data));
  }
  return data;
}

module.exports = { sendSms };