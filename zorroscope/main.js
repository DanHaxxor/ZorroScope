(() => {
    const SIGNS = {
        aries: { name: 'Aries', symbol: '♈', archetype: 'The Closer', tagline: 'Decisive. Action-driven. First to move.', reading: "Mars accelerates your pipeline this week. A prospect you'd written off in March is set to re-engage — move first. Opportunity rewards the prepared, not the perfect.", luckyModule: 'Zoho CRM — Leads', powerColor: 'Zoho Red', beware: 'Endless threads in place of decisions' },
        taurus: { name: 'Taurus', symbol: '♉', archetype: 'The Ledger', tagline: 'Steady. Methodical. Built for the long quarter.', reading: "Venus rewards the reconciliation. Numbers that didn't square last quarter find their match this week. Don't skip the audit — disciplined books compound into clean forecasts.", luckyModule: 'Zoho Books', powerColor: 'Field Olive', beware: 'Quiet scope creep' },
        gemini: { name: 'Gemini', symbol: '♊', archetype: 'The Integrator', tagline: 'Connective. Communicative. Fluent across systems.', reading: "Mercury opens three new lanes at once. A handoff between two tools you've never bridged reclaims half a workday. Document the connection before you forget you built it.", luckyModule: 'Zoho Flow', powerColor: 'Zoho Yellow', beware: 'Half-finished automations' },
        cancer: { name: 'Cancer', symbol: '♋', archetype: 'The Helpdesk', tagline: 'Attentive. Supportive. The reason your team feels heard.', reading: "The Moon waxes empathetic. A teammate will ask for 'just a quick thing' — answer, but pair the answer with a doc. Your real leverage is teaching, not triage.", luckyModule: 'Zoho Desk', powerColor: 'Pearl Ivory', beware: 'Quiet burnout' },
        leo: { name: 'Leo', symbol: '♌', archetype: 'The Dashboard', tagline: "Visible. Confident. The team's clearest signal.", reading: "The Sun rises on your KPIs. A metric you've been quietly improving surfaces in a meeting you weren't expecting to attend. Have the chart ready.", luckyModule: 'Zoho Analytics', powerColor: 'Zoho Amber', beware: 'Vanity metrics' },
        virgo: { name: 'Virgo', symbol: '♍', archetype: 'The Workflow', tagline: 'Meticulous. Optimizing. Allergic to manual steps.', reading: "Mercury aligns your Deluge logic. The bug isn't in your code — it's in an input you assumed was clean. Write the validator now; you'll thank yourself by Thursday.", luckyModule: 'Zoho Creator', powerColor: 'Sage Olive', beware: 'Over-engineering' },
        libra: { name: 'Libra', symbol: '♎', archetype: 'The Mediator', tagline: 'Balanced. Diplomatic. The reason the project still ships.', reading: "Venus restores the project plan. Two stakeholders who disagreed in February will both quote your summary this week. Stay neutral — that is the leverage.", luckyModule: 'Zoho Projects', powerColor: 'Quartz Pink', beware: 'Decision paralysis' },
        scorpio: { name: 'Scorpio', symbol: '♏', archetype: 'The Pipeline', tagline: 'Focused. Strategic. Knows exactly what is in stage four.', reading: "Pluto stirs the bottom of your pipeline. A deal everyone forgot about advances two stages in a single week. Don't celebrate before the e-signature clears.", luckyModule: 'Zoho CRM — Deals', powerColor: 'Deep Plum', beware: 'Premature forecasts' },
        sagittarius: { name: 'Sagittarius', symbol: '♐', archetype: 'The Campaign', tagline: 'Bold. Broadcasting. Sharper instincts on subject lines.', reading: "Jupiter expands your open rate. The audience segment you nearly skipped is the one that converts. Send the bolder draft — your hesitation is the only A/B loser.", luckyModule: 'Zoho Campaigns', powerColor: 'Cobalt Indigo', beware: 'Audience fatigue' },
        capricorn: { name: 'Capricorn', symbol: '♑', archetype: 'The Roadmap', tagline: 'Ambitious. Structured. Already drafting next quarter.', reading: "Saturn solidifies your sprint. A long-term goal you set quietly last year is closer than the dashboard suggests. Mark the milestone — the next one starts Monday.", luckyModule: 'Zoho Sprints', powerColor: 'Forest Green', beware: 'Postponed rest' },
        aquarius: { name: 'Aquarius', symbol: '♒', archetype: 'The Innovator', tagline: 'Visionary. Inventive. Builds it before the brief lands.', reading: "Uranus electrifies your sandbox. A side project nobody understood will solve a real problem within thirty days. Demo it before someone else builds the lesser version.", luckyModule: 'Zoho Catalyst', powerColor: 'Zoho Cyan', beware: 'Scope-less experiments' },
        pisces: { name: 'Pisces', symbol: '♓', archetype: 'The Inbox', tagline: 'Intuitive. Empathic. Finds the one message that mattered.', reading: "Neptune softens your inbox. A reply you forgot to send is exactly what someone needs today — find it, send it, no apology required. Flow over hustle this week.", luckyModule: 'Zoho Mail', powerColor: 'Zoho Blue', beware: 'Overthinking the draft' },
    };

    const Q1 = { A: ['cancer', 'pisces', 'virgo'], B: ['leo', 'capricorn', 'scorpio'], C: ['gemini', 'libra', 'sagittarius'], D: ['aries', 'aquarius', 'taurus'] };
    const Q2 = { A: ['virgo', 'aquarius', 'capricorn'], B: ['aries', 'scorpio', 'sagittarius'], C: ['cancer', 'libra', 'pisces'], D: ['leo', 'taurus', 'gemini'] };
    const Q3 = { A: ['aries', 'leo', 'sagittarius'], B: ['pisces', 'libra', 'taurus'], C: ['virgo', 'capricorn', 'scorpio'], D: ['gemini', 'cancer', 'aquarius'] };

    const SIGN_ORDER = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    const MATCH_URL = (() => {
        const host = globalThis.location?.hostname || '';
        if (host === 'localhost' || host.startsWith('127.') || host === '') {
            return '/server/match/';
        }
        const isDev = host.includes('development') || host.includes('.dev.');
        const base = isDev
            ? 'https://zorroscope-854436641.development.catalystserverless.com'
            : 'https://zorroscope-854436641.catalystserverless.com';
        return `${base}/server/match/`;
    })();

    const fetchAggregate = async (logSign) => {
        // Single GET: ?sign=<key> logs and returns updated counts; no param = read-only.
        // Using GET avoids the CORS preflight that Catalyst's gateway doesn't add headers to.
        try {
            const url = logSign ? `${MATCH_URL}?sign=${encodeURIComponent(logSign)}` : MATCH_URL;
            const res = await fetch(url, { method: 'GET' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const { counts } = await res.json();
            return counts || {};
        } catch (err) {
            console.warn('fetchAggregate failed:', err);
            return null;
        }
    };

    const computeSign = ({ q1, q2, q3 }) => {
        const scores = Object.fromEntries(Object.keys(SIGNS).map((s) => [s, 0]));
        [Q1[q1], Q2[q2], Q3[q3]].forEach((group) => {
            if (group) group.forEach((s) => { scores[s]++; });
        });
        const max = Math.max(...Object.values(scores));
        const winners = Object.keys(scores).filter((s) => scores[s] === max);
        const key = winners[Math.floor(Math.random() * winners.length)];
        return { key, ...SIGNS[key] };
    };

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
        await new Promise((r) => setTimeout(r, 1100));
        renderResult(computeSign(answers));
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

        // Log this result and refresh the population chart in one call
        renderChart(data.key);
    };

    const renderChart = async (highlightKey) => {
        const container = document.querySelector('[data-chart="population"]');
        if (!container) return;

        container.classList.add('is-loading');
        // Pass the key so the server logs this result and returns the post-increment counts
        const counts = await fetchAggregate(highlightKey);
        container.classList.remove('is-loading');

        if (!counts) {
            container.classList.add('is-empty');
            return;
        }

        // Server already incremented this user's sign and returned post-write counts; no local bump needed
        const total = SIGN_ORDER.reduce((sum, s) => sum + (counts[s] || 0), 0);
        if (total === 0) {
            container.classList.add('is-empty');
            return;
        }
        container.classList.remove('is-empty');

        // Sort by count desc, stable by SIGN_ORDER
        const ordered = SIGN_ORDER
            .map((s) => ({ key: s, count: counts[s] || 0 }))
            .sort((a, b) => b.count - a.count || SIGN_ORDER.indexOf(a.key) - SIGN_ORDER.indexOf(b.key));

        const max = ordered[0].count || 1;

        container.innerHTML = ordered.map(({ key, count }) => {
            const pct = Math.round((count / max) * 100);
            const share = total > 0 ? Math.round((count / total) * 100) : 0;
            const sign = SIGNS[key];
            const isYou = key === highlightKey;
            return `
                <div class="chart-row${isYou ? ' is-you' : ''}" data-sign="${key}">
                    <span class="chart-row__symbol" aria-hidden="true">${sign.symbol}</span>
                    <span class="chart-row__name">${sign.name}</span>
                    <span class="chart-row__bar"><span class="chart-row__fill" style="--w:${pct}%"></span></span>
                    <span class="chart-row__count">${share}%</span>
                </div>
            `;
        }).join('');
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
