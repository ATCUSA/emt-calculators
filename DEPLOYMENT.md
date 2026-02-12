# EMT Calculator Tools - Deployment Guide

## Cloudflare Pages Deployment

### Prerequisites
1. Cloudflare account
2. Git repository with the project code

### Deployment Steps

#### Option 1: Connect Git Repository (Recommended)
1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project" → "Connect to Git"
3. Select your repository
4. Configure build settings:
   - **Build command:** `pnpm install && pnpm build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (or the project folder)
   - **Node.js version:** `20` (set in Environment variables)

#### Option 2: Direct Upload
1. Build the project locally: `pnpm build`
2. Go to Cloudflare Dashboard → Pages
3. Click "Create a project" → "Upload assets"
4. Upload the `dist` folder

### Environment Variables
Set these in Cloudflare Pages → Settings → Environment variables:
- `NODE_VERSION`: `20`
- `PNPM_VERSION`: `10` (optional)

### Custom Domain (Optional)
1. Go to Pages → Custom domains
2. Add your domain
3. Update DNS records as instructed

### PWA Features
The app includes:
- ✅ Web App Manifest for install prompts
- ✅ Service Worker for offline functionality
- ✅ Responsive design for mobile devices
- ✅ Dark/light/auto theme support
- ✅ Cacheable static assets
- ✅ Security headers

### Offline Capabilities
Once installed as a PWA, the app works offline and includes:
- All calculator tools
- Theme preferences
- Previously viewed pages
- Static assets (CSS, JS, icons)

### Performance Features
- Static site generation for fast loading
- Aggressive caching of assets
- Optimized for mobile networks
- Progressive enhancement

## Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Future Enhancements
- Additional calculator tools (IV drip rates, GCS, etc.)
- Push notifications for updates
- Export calculation history
- Integration with medical databases
- Multi-language support