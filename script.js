// script.js
async function initApp() {
  const video = document.getElementById('video');
  const ui = video['ui'];
  const player = ui.getControls().getPlayer();

  // Mengambil data dari URL browser
  const urlParams = new URLSearchParams(window.location.search);
  const mpdUrl = urlParams.get('mpd'); // Mengambil ?mpd=
  const keyPair = urlParams.get('key'); // Mengambil &key=KID:KEY

  if (keyPair) {
    const [kid, key] = keyPair.split(':');
    player.configure({
      drm: {
        clearKeys: {
          [kid]: key
        }
      }
    });
  }

  if (mpdUrl) {
    try {
      await player.load(mpdUrl);
      console.log('Video berhasil dimuat!');
    } catch (e) {
      console.error('Gagal memuat MPD:', e);
    }
  } else {
    alert('Masukkan parameter MPD di URL! Contoh: ?mpd=URL_MPD&key=KID:KEY');
  }
}

document.addEventListener('shaka-ui-loaded', initApp);