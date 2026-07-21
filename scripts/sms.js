async function sendSms(phone, text) {
  const url = new URL('https://smsc.ru/sys/send.php');
  url.searchParams.set('login', process.env.SMSC_LOGIN);
  url.searchParams.set('psw', process.env.SMSC_PASSWORD);
  url.searchParams.set('phones', phone);
  url.searchParams.set('mes', text);
  url.searchParams.set('fmt', '3');
  url.searchParams.set('charset', 'utf-8');

  const res = await fetch(url);
  const data = await res.json();

  if (data.error_code) {
    throw new Error(SMSC error: );
  }
  return data;
}

module.exports = { sendSms };
