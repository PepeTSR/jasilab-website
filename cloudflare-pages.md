# Cloudflare Pages build settings (Dashboard → Workers & Pages → jasilab-website → Settings → Builds)
#
# Production branch: main
# Framework preset:   Astro (or None)
# Build command:      npm run build
# Build output dir:   dist
# Root directory:     /
# Node.js version:    22  (from .node-version)
#
# Custom domains: jasilab.net, www.jasilab.net
#
# Deploy via GitHub:
#   1. Push this repo to GitHub (e.g. github.com/<org>/jasilab-website)
#   2. Cloudflare Dashboard → Create application → Pages → Connect to Git
#   3. Select repo, confirm settings above, deploy
#
# Deploy via CLI (optional):
#   npx wrangler pages deploy dist --project-name=jasilab-website
