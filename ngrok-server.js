import ngrok from 'ngrok';

(async () => {
  try {
    const url = await ngrok.connect({
      addr: 5000,       // your local server port
      authtoken: '',    // optional if you have a PayFast account
    });
    console.log('Public URL for PayFast webhook:', url);
  } catch (err) {
    console.error('Ngrok error:', err);
  }
})();
