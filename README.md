# Spin & Win - RukaPay

A Next.js web application featuring a spinning wheel game with prize distribution and tracking.

## Features

- **Spinning Wheel**: Interactive wheel with 6 prize segments
- **Prize Distribution**: 
  - Cap: 30%
  - Notebook: 25%
  - Try Again: 25%
  - Pen: 10%
  - Umbrella: 9%
  - 100k: 1%
- **User Limits**: Maximum 2 spins per user
- **Prize Tracking**: Real-time tracking of all prizes won
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean white and dark blue theme with smooth animations

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. Click the "SPIN!" button to start the wheel
2. Watch the wheel spin and stop at your prize
3. View your result in the popup modal
4. Check the prize history to see all your wins
5. Each user can spin a maximum of 2 times

## API Endpoints

- `POST /api/spin`: Submit a spin request
- `GET /api/spin`: Get current prize statistics

## Technologies Used

- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Custom CSS animations

## Project Structure

```
├── app/
│   ├── api/spin/route.ts      # Spin API endpoint
│   ├── components/            # React components
│   │   ├── SpinningWheel.tsx
│   │   ├── ResultModal.tsx
│   │   └── PrizeHistory.tsx
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── package.json
├── tailwind.config.js
└── README.md
```

## Customization

You can easily customize:
- Prize names and colors in `app/page.tsx`
- Probability distribution in `app/api/spin/route.ts`
- Spin limit by modifying the API logic
- Styling in `app/globals.css` and Tailwind classes
