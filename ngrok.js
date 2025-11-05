import ngrok from 'ngrok';

(async () => {
    const url = await ngrok.connect(5000);  // simple, no name, no config
    console.log('Tunnel URL:', url);
})();
