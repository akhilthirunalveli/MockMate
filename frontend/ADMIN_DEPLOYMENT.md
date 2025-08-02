# MockMate Admin App Deployment Guide

## Option 1: Deploy to Vercel (Recommended)

1. **Build the admin app first**:
```bash
npm run admin:build
```

2. **Create vercel.json in dist-admin folder** (already created for you):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/admin.html" }
  ]
}
```

3. **Deploy to Vercel**:
   - Create new Vercel project
   - Set root directory to `dist-admin`
   - Deploy the project
```

## Option 2: Deploy to Netlify

1. **Upload dist-admin folder to Netlify**
2. **Configure redirects in _redirects file**:
```
/*    /admin.html   200
```

## Option 3: Deploy to your existing server

1. **Upload dist-admin contents to your server**
2. **Configure nginx/apache to serve admin.html for all routes**

### Nginx Configuration:
```nginx
location /admin {
    try_files $uri $uri/ /admin.html;
}
```

### Apache Configuration:
```apache
RewriteEngine On
RewriteRule ^admin/.*$ /admin.html [L]
```

## Testing the Admin App

1. **Access the admin URL**: https://your-domain.com/admin.html
2. **Install the PWA**: Tap the "Install Admin App" button
3. **Use as native app**: App opens directly to admin dashboard

## Security Notes

- Admin app is completely separate from main app
- Can be deployed on different subdomain for security
- Consider adding additional authentication layers
- Use HTTPS for PWA installation to work properly
