const express = require('express');
const catalyst = require('zcatalyst-sdk-node');

const SIGN_KEYS = [
	'aries', 'taurus', 'gemini', 'cancer',
	'leo', 'virgo', 'libra', 'scorpio',
	'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const app = express();
app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
	res.setHeader('Access-Control-Max-Age', '86400');
	if (req.method === 'OPTIONS') return res.status(204).end();
	next();
});

const getSegment = (req) => catalyst.initialize(req).cache().segment();

const readCount = async (segment, sign) => {
	try {
		const v = await segment.getValue(sign);
		const n = Number.parseInt(v, 10);
		return Number.isFinite(n) ? n : 0;
	} catch {
		return 0;
	}
};

app.get('*', async (req, res) => {
	try {
		const segment = getSegment(req);
		const writeSign = req.query?.sign;

		if (writeSign) {
			if (!SIGN_KEYS.includes(writeSign)) {
				return res.status(400).json({ error: 'invalid sign' });
			}
			const next = (await readCount(segment, writeSign)) + 1;
			try {
				await segment.update(writeSign, String(next));
			} catch {
				await segment.put(writeSign, String(next));
			}
		}

		const counts = {};
		await Promise.all(SIGN_KEYS.map(async (sign) => {
			counts[sign] = await readCount(segment, sign);
		}));
		res.status(200).json({ counts });
	} catch (err) {
		console.error('match error:', err);
		res.status(500).json({ error: 'internal' });
	}
});

module.exports = app;
