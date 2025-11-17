# GolfBooks

GolfBooks is currently under development with **Next.js v15.5.2**.

## Project Overview

- The main entry point is `src/app/page.tsx`.
- Calendar functionality is being added.
- A recent runtime error caused by an undefined `date` variable has been fixed.
- Fetching styles from `https://ui.shadcn.com/r/styles/new-york-v4/calendar-20.json` is currently impacted by a self-signed SSL certificate issue, which may affect UI appearance.

## Next Steps

- Address external style/API fetch issues related to SSL certificates.
- Further develop calendar and booking features.
- Enhance error handling and improve documentation.

## Known Issues

- SSL certificate error when fetching UI styles may prevent some UI features from displaying correctly.
- Some UI components or styling may be incomplete until the SSL issue is resolved.

## Getting Started

To run the project locally:

```bash
npm install
npm run dev
```

