const SIGNS = {
	aries: {
		name: 'Aries',
		symbol: '♈',
		archetype: 'The Closer',
		tagline: 'Decisive. Action-driven. First to move.',
		reading:
			"Mars accelerates your pipeline this week. A prospect you'd written off in March is set to re-engage — move first. Opportunity rewards the prepared, not the perfect.",
		luckyModule: 'Zoho CRM — Leads',
		powerColor: 'Zoho Red',
		beware: 'Endless threads in place of decisions',
	},
	taurus: {
		name: 'Taurus',
		symbol: '♉',
		archetype: 'The Ledger',
		tagline: 'Steady. Methodical. Built for the long quarter.',
		reading:
			"Venus rewards the reconciliation. Numbers that didn't square last quarter find their match this week. Don't skip the audit — disciplined books compound into clean forecasts.",
		luckyModule: 'Zoho Books',
		powerColor: 'Field Olive',
		beware: 'Quiet scope creep',
	},
	gemini: {
		name: 'Gemini',
		symbol: '♊',
		archetype: 'The Integrator',
		tagline: 'Connective. Communicative. Fluent across systems.',
		reading:
			"Mercury opens three new lanes at once. A handoff between two tools you've never bridged reclaims half a workday. Document the connection before you forget you built it.",
		luckyModule: 'Zoho Flow',
		powerColor: 'Zoho Yellow',
		beware: 'Half-finished automations',
	},
	cancer: {
		name: 'Cancer',
		symbol: '♋',
		archetype: 'The Helpdesk',
		tagline: 'Attentive. Supportive. The reason your team feels heard.',
		reading:
			"The Moon waxes empathetic. A teammate will ask for 'just a quick thing' — answer, but pair the answer with a doc. Your real leverage is teaching, not triage.",
		luckyModule: 'Zoho Desk',
		powerColor: 'Pearl Ivory',
		beware: 'Quiet burnout',
	},
	leo: {
		name: 'Leo',
		symbol: '♌',
		archetype: 'The Dashboard',
		tagline: "Visible. Confident. The team's clearest signal.",
		reading:
			"The Sun rises on your KPIs. A metric you've been quietly improving surfaces in a meeting you weren't expecting to attend. Have the chart ready.",
		luckyModule: 'Zoho Analytics',
		powerColor: 'Zoho Amber',
		beware: 'Vanity metrics',
	},
	virgo: {
		name: 'Virgo',
		symbol: '♍',
		archetype: 'The Workflow',
		tagline: 'Meticulous. Optimizing. Allergic to manual steps.',
		reading:
			"Mercury aligns your Deluge logic. The bug isn't in your code — it's in an input you assumed was clean. Write the validator now; you'll thank yourself by Thursday.",
		luckyModule: 'Zoho Creator',
		powerColor: 'Sage Olive',
		beware: 'Over-engineering',
	},
	libra: {
		name: 'Libra',
		symbol: '♎',
		archetype: 'The Mediator',
		tagline: 'Balanced. Diplomatic. The reason the project still ships.',
		reading:
			"Venus restores the project plan. Two stakeholders who disagreed in February will both quote your summary this week. Stay neutral — that is the leverage.",
		luckyModule: 'Zoho Projects',
		powerColor: 'Quartz Pink',
		beware: 'Decision paralysis',
	},
	scorpio: {
		name: 'Scorpio',
		symbol: '♏',
		archetype: 'The Pipeline',
		tagline: 'Focused. Strategic. Knows exactly what is in stage four.',
		reading:
			"Pluto stirs the bottom of your pipeline. A deal everyone forgot about advances two stages in a single week. Don't celebrate before the e-signature clears.",
		luckyModule: 'Zoho CRM — Deals',
		powerColor: 'Deep Plum',
		beware: 'Premature forecasts',
	},
	sagittarius: {
		name: 'Sagittarius',
		symbol: '♐',
		archetype: 'The Campaign',
		tagline: 'Bold. Broadcasting. Sharper instincts on subject lines.',
		reading:
			"Jupiter expands your open rate. The audience segment you nearly skipped is the one that converts. Send the bolder draft — your hesitation is the only A/B loser.",
		luckyModule: 'Zoho Campaigns',
		powerColor: 'Cobalt Indigo',
		beware: 'Audience fatigue',
	},
	capricorn: {
		name: 'Capricorn',
		symbol: '♑',
		archetype: 'The Roadmap',
		tagline: 'Ambitious. Structured. Already drafting next quarter.',
		reading:
			"Saturn solidifies your sprint. A long-term goal you set quietly last year is closer than the dashboard suggests. Mark the milestone — the next one starts Monday.",
		luckyModule: 'Zoho Sprints',
		powerColor: 'Forest Green',
		beware: 'Postponed rest',
	},
	aquarius: {
		name: 'Aquarius',
		symbol: '♒',
		archetype: 'The Innovator',
		tagline: 'Visionary. Inventive. Builds it before the brief lands.',
		reading:
			"Uranus electrifies your sandbox. A side project nobody understood will solve a real problem within thirty days. Demo it before someone else builds the lesser version.",
		luckyModule: 'Zoho Catalyst',
		powerColor: 'Zoho Cyan',
		beware: 'Scope-less experiments',
	},
	pisces: {
		name: 'Pisces',
		symbol: '♓',
		archetype: 'The Inbox',
		tagline: 'Intuitive. Empathic. Finds the one message that mattered.',
		reading:
			"Neptune softens your inbox. A reply you forgot to send is exactly what someone needs today — find it, send it, no apology required. Flow over hustle this week.",
		luckyModule: 'Zoho Mail',
		powerColor: 'Zoho Blue',
		beware: 'Overthinking the draft',
	},
};

const Q1 = {
	A: ['cancer', 'pisces', 'virgo'],
	B: ['leo', 'capricorn', 'scorpio'],
	C: ['gemini', 'libra', 'sagittarius'],
	D: ['aries', 'aquarius', 'taurus'],
};
const Q2 = {
	A: ['virgo', 'aquarius', 'capricorn'],
	B: ['aries', 'scorpio', 'sagittarius'],
	C: ['cancer', 'libra', 'pisces'],
	D: ['leo', 'taurus', 'gemini'],
};
const Q3 = {
	A: ['aries', 'leo', 'sagittarius'],
	B: ['pisces', 'libra', 'taurus'],
	C: ['virgo', 'capricorn', 'scorpio'],
	D: ['gemini', 'cancer', 'aquarius'],
};

/**
 * @param {import('./types/basicio').Context} context
 * @param {import('./types/basicio').BasicIO} basicIO
 */
module.exports = (context, basicIO) => {
	const q1 = String(basicIO.getArgument('q1') || '').toUpperCase();
	const q2 = String(basicIO.getArgument('q2') || '').toUpperCase();
	const q3 = String(basicIO.getArgument('q3') || '').toUpperCase();

	const scores = {};
	Object.keys(SIGNS).forEach((s) => {
		scores[s] = 0;
	});

	[Q1[q1], Q2[q2], Q3[q3]].forEach((group) => {
		if (group) group.forEach((s) => scores[s]++);
	});

	const max = Math.max(...Object.values(scores));
	const winners = Object.keys(scores).filter((s) => scores[s] === max);
	const key = winners[Math.floor(Math.random() * winners.length)];

	basicIO.write(JSON.stringify({ key, ...SIGNS[key] }));
	context.close();
};
