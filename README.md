# GlobeTrotter Frontend

Hackathon-ready React + Vite frontend for the GlobeTrotter travel planning problem.

## Run

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally http://localhost:5173.

## Demo Login

Any email/password works in this mock frontend. The prefilled account is:

demo@globetrotter.app
123456

## Java Spring Boot integration

Set:

VITE_API_URL=http://localhost:8080/api

The Axios service is already prepared in `src/services/api.js`.

## Main demo flow

Login → Dashboard → Plan New Trip → Add Destinations → Add Activities → Itinerary → Budget → Complete → Share
