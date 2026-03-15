# Store Lead Finder

A Next.js app that searches for local stores and brands using Google Places, checks whether they have a website, collects public business details, and exports the results to Excel.

## Features

- Search by keyword, city, and country
- Filter businesses that do not have a website
- Collect public details such as:
  - business name
  - address
  - phone number
  - website
  - Google Maps link
  - rating and review count
- Export results to `.xlsx`
- Ready for GitHub + Vercel deployment

## 1) Create your Google Places API key

Create a Google Cloud project and enable:
- Places API

Then create an API key and add it to `.env.local`:

```bash
GOOGLE_MAPS_API_KEY=your_google_places_api_key_here
```

## 2) Install dependencies

```bash
npm install
```

## 3) Run locally

```bash
npm run dev
```

Open `http://localhost:3000`

## 4) Deploy to Vercel

- Push the project to GitHub
- Import the repo into Vercel
- Add environment variable:
  - `GOOGLE_MAPS_API_KEY`
- Deploy

## Suggested outreach workflow

1. Search for `brand shops`, `fashion stores`, `perfume stores`, `shoe stores`, `electronics shops`, etc.
2. Filter only businesses without websites
3. Export to Excel
4. Call the businesses professionally
5. Offer a simple website package

## Notes

- This project depends on public business listing data returned by Google Places.
- Availability of phone numbers and websites varies by place.
- Always comply with platform terms and local regulations before using the data commercially.
