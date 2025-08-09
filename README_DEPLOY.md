
# RouteGuard Body — Deploy Quickstart

This is a Vite + React single-page app built for static hosting.

## Run locally (optional)
1) Install Node LTS: https://nodejs.org
2) In a terminal:
   ```bash
   npm install
   npm run dev
   ```
3) Open http://localhost:5173

## Build
```bash
npm run build
```
The static files output to `dist/`

## Deploy (pick one)

### Netlify (drag & drop)
1) Build locally: `npm install && npm run build`
2) Go to https://app.netlify.com/drop and drag the `dist/` folder.

### Vercel (GitHub)
1) Create a new GitHub repo and upload this folder.
2) Go to https://vercel.com/new, import the repo, Framework: Vite/React (auto), Build command: `npm run build`, Output: `dist`
3) Click Deploy.

### Your own domain
- On Netlify or Vercel, add a custom domain in the project settings.
- Update your DNS (at your domain registrar) to point to the provider.
