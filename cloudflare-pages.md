# Cloudflare Workers Builds (Dashboard → Workers & Pages → jasilab-website → Settings → Builds)
#
# Production branch: main
# Build command:      npm run build
# Deploy command:     npx wrangler deploy
# Path (root):        /   (leave empty if repo root — do NOT put "dist" here)
#
# Output directory is set in wrangler.toml → [assets] directory = "./dist"
# Do NOT use pages_build_output_dir or `wrangler pages deploy` on Workers Builds.
#
# Deploy via GitHub:
#   1. Push this repo to GitHub (e.g. github.com/<org>/jasilab-website)
#   2. Cloudflare Dashboard → Create application → Pages → Connect to Git
#   3. Select repo, confirm settings above, deploy
#
# Deploy via CLI (optional):
#   npx wrangler pages deploy dist --project-name=jasilab-website
