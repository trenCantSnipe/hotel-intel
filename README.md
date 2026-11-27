# 🏨 HotelIntel: Market Research Bot

Enter a city and HotelIntel finds hotels and resorts there, then sizes up each one as a sales lead: contact details, how good their website is, and **whether they already have a chatbot**. I built it to find hotels that would benefit from an AI concierge (see [ConciergeAI](https://github.com/trenCantSnipe/ConciergeAI)).

## Features

- Location-based discovery of hotels using Gemini with **Google Search grounding**
- Per-property extraction: name, phone, email, website
- Website-quality and chatbot-presence scoring
- Sortable results table with **CSV export** for outreach

## Tech stack

React 19 · TypeScript · Vite · Gemini 2.5 Flash · Google Search grounding

## Run locally

```bash
git clone https://github.com/trenCantSnipe/hotel-intel.git && cd hotel-intel
npm install
echo "GEMINI_API_KEY=your_key_here" > .env.local
npm run dev
```

Get a free key at [Google AI Studio](https://aistudio.google.com/apikey). The key stays in `.env.local`, which is git-ignored.
