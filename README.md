# GolfBooks

## Project Status

- The project is currently in development using Next.js v15.5.2.
- The main page component is set up in `src/app/page.tsx`.
- Calendar functionality is being integrated, but there was a recent runtime error due to an undefined `date` variable, which has now been resolved.
- An issue was encountered when fetching styles from `https://ui.shadcn.com/r/styles/new-york-v4/calendar-20.json` due to a self-signed certificate in the certificate chain. This may affect UI styling until resolved.

## Next Steps

- Resolve external API/style fetch issues related to SSL certificates.
- Continue integrating calendar and booking features.
- Improve error handling and documentation.

## Known Issues

- SSL certificate error when fetching UI styles.
- Some UI features may be unavailable until the above issue is fixed.

## How to Run

- Install dependencies: `npm install`
- Start development server: `npm run dev`

## Contributing

Feel free to open issues or pull requests for bugs or feature suggestions.