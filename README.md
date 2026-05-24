# whatcanidoto.help

`whatcanidoto.help` is a static Next.js app that helps people turn concern for a cause into one concrete next action.

The product is intentionally lightweight: no accounts, no database, no live nonprofit rankings, and no external recommendation API. It focuses on practical, trust-conscious action prompts that someone can use immediately.

## Features

- Cause search with curated starter causes
- Starter path for war and humanitarian crises, alongside climate, food, housing, health, education, civic, disaster, and community care topics
- Custom-cause fallback for topics outside the starter list
- Emotional-state intake that helps channel overwhelm, anger, urgency, or grief into appropriately sized actions
- Goal setting for learning, donating, volunteering, advocacy, skill help, or habit-building
- Filters for available capacity: time, money, skills, local presence, social reach, or uncertainty
- Effort filters for 10-minute, 1-hour, weekend, and ongoing actions
- Recommended “best next step” plus grouped action cards
- Trust and safety notes for donations, volunteering, crisis response, and sharing
- Paper and blueprint dark-mode visual themes

## Tech Stack

- [Next.js](https://nextjs.org/) App Router
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Validation

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Project Notes

- The app is currently static and client-side only.
- All starter cause and action data lives in the application code.
- The recommendations are action frameworks, not endorsements of specific organizations.
- The app uses US-first civic language where helpful, while keeping most actions broadly understandable.

## License

This project is licensed under the Mozilla Public License 2.0. See [LICENSE](LICENSE) for details.
