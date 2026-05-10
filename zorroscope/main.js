(() => {
    const MATCH_URL = (() => {
        const host = globalThis.location?.hostname || '';
        if (host === 'localhost' || host.startsWith('127.') || host === '') {
            return '/server/match/';
        }
        const isDev = host.includes('development') || host.includes('.dev.');
        const base = isDev
            ? 'https://zorroscope-854436641.development.catalystserverless.com'
            : 'https://zorroscope-854436641.catalystserverless.com';
        return `${base}/server/match/execute`;
    })();

    const screens = document.querySelectorAll('[data-screen]');
    const answers = { q1: null, q2: null, q3: null };
    let lastResult = null;

    const show = (name) => {
        screens.forEach((el) => {
            el.classList.toggle('is-active', el.dataset.screen === name);
        });
        document.body.dataset.screen = name;
        if (name !== 'result') {
            document.body.classList.remove('is-result-revealed');
        }
    };

    const reset = () => {
        answers.q1 = null;
        answers.q2 = null;
        answers.q3 = null;
        document.querySelectorAll('.option.is-selected').forEach((el) => {
            el.classList.remove('is-selected');
        });
        delete document.body.dataset.sign;
        document.body.classList.remove('is-result-revealed');
        lastResult = null;
        show('intro');
    };

    const fetchScope = async () => {
        show('loading');
        const params = new URLSearchParams(answers);

        // Ensure loading state shows for at least a beat — feels more "cosmic"
        const minDelay = new Promise((r) => setTimeout(r, 1100));

        try {
            const fetchPromise = fetch(`${MATCH_URL}?${params.toString()}`, {
                method: 'GET',
                headers: { Accept: 'application/json, text/plain' },
            });
            const [res] = await Promise.all([fetchPromise, minDelay]);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const data = JSON.parse(text);
            renderResult(data);
        } catch (err) {
            console.error('ZorroScope fetch failed:', err);
            show('error');
        }
    };

    const renderResult = (data) => {
        lastResult = data;

        const fields = ['symbol', 'archetype', 'name', 'tagline', 'reading', 'luckyModule', 'powerColor', 'beware'];
        fields.forEach((key) => {
            const el = document.querySelector(`[data-result="${key}"]`);
            if (el) el.textContent = data[key] || '';
        });

        // Per-sign theming
        if (data.key) {
            document.body.dataset.sign = String(data.key).toLowerCase();
        }

        // Try to color the swatch from the powerColor name (best-effort, falls back to gold via CSS)
        const swatch = document.querySelector('.meta__swatch');
        if (swatch && data.powerColor) {
            const guess = colorFromName(data.powerColor);
            if (guess) swatch.style.background = guess;
        }

        show('result');
        // Trigger reveal animation on next frame
        requestAnimationFrame(() => {
            document.body.classList.add('is-result-revealed');
        });
    };

    // Best-effort color name extraction for the meta swatch.
    // Looks at the last word of e.g. "Spotlight Gold" → "gold".
    const COLOR_MAP = {
        gold:      '#ffd700',
        cyan:      '#00d4ff',
        yellow:    '#fcdb1f',
        red:       '#e42527',
        orange:    '#f9b21d',
        amber:     '#ffbf00',
        plum:      '#8e4585',
        purple:    '#a44bd9',
        violet:    '#8a4fff',
        indigo:    '#4a3aff',
        blue:      '#2196f3',
        navy:      '#1a2a5e',
        teal:      '#00b5a0',
        green:     '#5fbf66',
        emerald:   '#2ecc71',
        olive:     '#7d8c63',
        lime:      '#c4e63b',
        pink:      '#f5b8c8',
        rose:      '#ff6b9d',
        magenta:   '#d63384',
        coral:     '#ff7a55',
        crimson:   '#c91a4d',
        scarlet:   '#ff2400',
        bronze:    '#cd7f32',
        copper:    '#b87333',
        silver:    '#c0c8d0',
        platinum:  '#e5e4e2',
        ivory:     '#f4ecd6',
        cream:     '#f1e6c8',
        beige:     '#d4c8a3',
        white:     '#ffffff',
        black:     '#1b1b1b',
        charcoal:  '#36393e',
        graphite:  '#41464b',
    };

    const colorFromName = (name) => {
        if (!name) return null;
        const tokens = String(name).toLowerCase().split(/[\s,/-]+/).filter(Boolean);
        for (let i = tokens.length - 1; i >= 0; i--) {
            if (COLOR_MAP[tokens[i]]) return COLOR_MAP[tokens[i]];
        }
        return null;
    };

    // Web Share with safe fallback to clipboard
    const share = async () => {
        if (!lastResult) return;
        const { name, archetype, tagline } = lastResult;
        const shareText = `My ZorroScope: ${name} — ${archetype}. ${tagline || ''}`.trim();
        const shareData = {
            title: 'ZorroScope',
            text: shareText,
            url: globalThis.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }
        } catch (err) {
            if (err?.name === 'AbortError') return;
        }
        try {
            await navigator.clipboard.writeText(`${shareText} ${globalThis.location.href}`);
            flashShareToast('Copied to clipboard');
        } catch {
            flashShareToast('Sharing not available');
        }
    };

    const flashShareToast = (msg) => {
        const btn = document.querySelector('[data-action="share"] .btn__label');
        if (!btn) return;
        const original = btn.textContent;
        btn.textContent = msg;
        setTimeout(() => { btn.textContent = original; }, 1600);
    };

    // Cosmic poof — particle burst at the press point
    const prefersReducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const poof = (x, y) => {
        if (prefersReducedMotion) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'poof';
        wrapper.style.left = `${x}px`;
        wrapper.style.top = `${y}px`;

        const COUNT = 14;
        for (let i = 0; i < COUNT; i++) {
            const p = document.createElement('span');
            p.className = 'poof__particle';
            const angle = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
            const dist = 30 + Math.random() * 38;
            const size = 4 + Math.random() * 6;
            p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
            p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.animationDelay = `${Math.random() * 60}ms`;
            p.style.animationDuration = `${500 + Math.random() * 260}ms`;
            wrapper.appendChild(p);
        }

        document.body.appendChild(wrapper);
        setTimeout(() => wrapper.remove(), 950);
    };

    document.addEventListener('pointerdown', (e) => {
        const target = e.target.closest('.btn, .option');
        if (!target) return;
        poof(e.clientX, e.clientY);
    });

    // Click routing
    document.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]');
        if (action) {
            const kind = action.dataset.action;
            if (kind === 'start')   show('q1');
            if (kind === 'restart') reset();
            if (kind === 'share')   share();
            return;
        }

        const option = e.target.closest('.option');
        if (option && !option.classList.contains('is-selected')) {
            const q = option.dataset.q;
            const value = option.dataset.value;
            answers[q] = value;

            // Clear any previously selected sibling and apply new selection
            option.parentElement.querySelectorAll('.option.is-selected').forEach((el) => el.classList.remove('is-selected'));
            option.classList.add('is-selected');

            const nextScreen = { q1: 'q2', q2: 'q3' };
            const next = nextScreen[q];
            if (next) {
                setTimeout(() => show(next), 260);
            } else {
                setTimeout(fetchScope, 260);
            }
        }
    });

    // Mouse-position glow on options
    document.addEventListener('pointermove', (e) => {
        const option = e.target.closest('.option');
        if (!option) return;
        const rect = option.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        option.style.setProperty('--mx', `${mx}%`);
        option.style.setProperty('--my', `${my}%`);
    });

    // Keyboard: Esc restarts from result/error
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const screen = document.body.dataset.screen;
            if (screen === 'result' || screen === 'error') reset();
        }
    });

    // Initial state
    show('intro');
})();
