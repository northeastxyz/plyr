<script>

async function init() {

    const video = document.getElementById('video');

    const ui = video['ui'];

    const player = ui.getControls().getPlayer();

    const params = new URLSearchParams(window.location.search);

    // Support:
    // ?mpd=
    // ?m3u8=
    // ?flv=
    // ?key=KID:KEY

    const mpdUrl = params.get('mpd');
    const hlsUrl = params.get('m3u8');
    const flvUrl = params.get('flv');
    const keyPair = params.get('key');

    // =========================
    // CLEARKEY DRM
    // =========================

    if (keyPair && keyPair.includes(':')) {

        const [kid, key] = keyPair.split(':');

        player.configure({
            drm: {
                clearKeys: {
                    [kid]: key
                }
            }
        });
    }

    // =========================
    // DASH (.mpd)
    // =========================

    if (mpdUrl) {

        try {

            await player.load(mpdUrl);

            console.log('DASH berhasil dimuat!');

        } catch (e) {

            console.error('Gagal memuat DASH:', e);

        }

        return;
    }

    // =========================
    // HLS (.m3u8)
    // =========================

    if (hlsUrl) {

        try {

            await player.load(hlsUrl);

            console.log('HLS berhasil dimuat!');

        } catch (e) {

            console.error('Gagal memuat HLS:', e);

        }

        return;
    }

    // =========================
    // FLV
    // =========================

    if (flvUrl) {

        if (typeof flvjs === 'undefined') {

            console.error('flv.js belum dimuat');

            return;
        }

        if (!flvjs.isSupported()) {

            console.error('Browser tidak support FLV');

            return;
        }

        try {

            // Hentikan Shaka attach video
            await player.destroy();

            const flvPlayer = flvjs.createPlayer({

                type: 'flv',

                url: flvUrl,

                isLive: true,

                cors: true,

                hasAudio: true,

                hasVideo: true

            }, {

                enableWorker: true,

                enableStashBuffer: false,

                lazyLoad: false,

                stashInitialSize: 128,

                autoCleanupSourceBuffer: true

            });

            flvPlayer.attachMediaElement(video);

            flvPlayer.load();

            flvPlayer.play().catch(() => {});

            console.log('FLV berhasil dimuat!');

            flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail, errInfo) => {

                console.error(
                    'FLV Error:',
                    errType,
                    errDetail,
                    errInfo
                );

            });

        } catch (e) {

            console.error('Gagal memuat FLV:', e);

        }

        return;
    }

    console.error('Tidak ada source ditemukan');

}

// Jalankan setelah Shaka UI siap
document.addEventListener('shaka-ui-loaded', init);

</script>