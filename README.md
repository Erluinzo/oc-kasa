# Kasa

Front end of Kasa, a website to rent flats and houses between private people. Built with Next.js (App Router) and TypeScript. It reads its data from the Kasa back end (Express.js API).

## Requirements

- Node.js 20.9 or newer
- npm

## Install

```bash
npm install
```

## Run

1. Start the back end ([Kasa API](https://github.com/OpenClassrooms-Student-Center/dev-react-P12)) on port 4000, in its own folder:

```bash
npm install
PORT=4000 npm start
```

2. Start the front end:

```bash
npm run dev
```

Then open http://localhost:3000.

The API address is `http://localhost:4000` by default. To use another one, set `API_URL` in a `.env.local` file:

```
API_URL=http://localhost:4000
```

## Tests

Unit tests use Vitest and Testing Library. Each test file sits next to its component (`components/Carousel.test.tsx`).

```bash
npm test
```

## Folders

- `app/`: pages and layouts (App Router)
- `components/`: reusable interface parts
- `lib/`: code that talks to the API and shared helpers
