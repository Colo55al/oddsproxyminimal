export default async function handler(req, res) {
  const sport = req.query.sport || 'soccer_epl';
  const regions = req.query.regions || 'uk';
  const markets = req.query.markets || 'h2h';
  const oddsFormat = 'decimal';

  const API_KEY = process.env.THE_ODDS_API_KEY;
  if (!API_KEY) {
    res.status(500).json({ error: 'API key missing on server. Set THE_ODDS_API_KEY in Vercel env.' });
    return;
  }

  const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}&apiKey=${API_KEY}`;

  try {
    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      const text = await apiRes.text();
      res.status(apiRes.status).send(text);
      return;
    }
    const json = await apiRes.json();

    const filtered = json.map(ev => ({
      id: ev.id,
      commence_time: ev.commence_time,
      sport_title: ev.sport_title,
      home_team: ev.home_team,
      away_team: ev.away_team,
      bookmakers: ev.bookmakers
    }));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(filtered));
  } catch (err) {
    console.error('proxy error', err);
    res.status(500).json({ error: 'proxy error' });
  }
}
