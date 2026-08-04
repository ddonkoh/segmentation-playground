# Deployment

Deploy ShipSafe to production.

## Overview

This section covers everything you need to deploy ShipSafe to production, from initial preparation to monitoring and maintenance.

**What's covered:**
- Deployment preparation
- Vercel deployment (recommended)
- Environment setup
- Security configuration
- Monitoring and maintenance

---

## Deployment Guides

### [Getting Started](./getting-started)

Initial deployment steps:

- Pre-deployment checklist
- Environment preparation
- Service configuration
- Testing before deployment
- Deployment process overview

**Start here** for your first deployment.

---

### [Vercel Deployment](./vercel)

Deploy to Vercel (recommended):

- Vercel account setup
- Connect repository
- Configure environment variables
- Deploy your app
- Custom domain setup
- Post-deployment verification

**Recommended** for Next.js applications.

---

### [Environment Setup](./environment-setup)

Configure production environment:

- Production environment variables
- Firebase production setup
- Stripe production setup
- Security best practices
- Environment variable management

**Essential** for production configuration.

---

### [Security Checklist](./security)

Production security configuration:

- Security verification steps
- HTTPS verification
- Security headers check
- Rate limiting verification
- Audit logging setup
- Security testing

**Critical** before going live.

---

### [Monitoring](./monitoring)

Monitor your deployment:

- Error tracking setup
- Performance monitoring
- Audit logging
- Analytics integration
- Alert configuration
- Maintenance practices

**Important** for production operations.

---

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Firebase configured for production
- [ ] Stripe configured for production
- [ ] Domain configured
- [ ] Security headers verified
- [ ] Error tracking set up
- [ ] Build succeeds locally
- [ ] Tests pass (if applicable)

### Deployment

- [ ] Deploy to staging first (recommended)
- [ ] Verify staging deployment
- [ ] Test all features
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Test production features

### Post-Deployment

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify security headers
- [ ] Test critical user flows
- [ ] Set up alerts
- [ ] Document deployment

---

## Deployment Platforms

### Vercel (Recommended)

**Why Vercel:**
- Zero-config Next.js deployment
- Automatic HTTPS
- Edge functions
- Built-in analytics
- Easy environment variable management

**See:** [Vercel Deployment Guide](./vercel)

### Other Platforms

ShipSafe can be deployed to:
- **Netlify** - Similar to Vercel
- **Railway** - Modern hosting platform
- **AWS** - Using Amplify or custom setup
- **Google Cloud** - Using Cloud Run
- **Self-hosted** - Using Docker

---

## Environment Configuration

### Required Variables

**Firebase:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_DATABASE_URL`

**Stripe:**
- `STRIPE_SECRET_KEY` (use `sk_live_` in production)
- `STRIPE_PUBLIC_KEY` (use `pk_live_` in production)
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PRO`

**Application:**
- `NEXT_PUBLIC_APP_URL` (production domain)
- `APP_DOMAIN` (production domain)

**See:** [Environment Setup](./environment-setup) for complete list

---

## Common Deployment Issues

### Build Fails

**Solutions:**
- Check build logs for errors
- Verify all environment variables are set
- Test build locally first
- Check Node.js version matches

### Environment Variables Not Loading

**Solutions:**
- Verify variables are set in platform
- Check variable names match exactly
- Redeploy after adding variables
- Verify variable format (especially private keys)

### Domain Not Working

**Solutions:**
- Verify DNS configuration
- Check domain is added to platform
- Verify SSL certificate is issued
- Wait for DNS propagation

---

## Post-Deployment

### Verification Steps

1. **Test critical flows:**
   - User signup/login
   - Payment checkout
   - Protected pages
   - API endpoints

2. **Check security:**
   - HTTPS is enabled
   - Security headers are set
   - Rate limiting works
   - CSRF protection works

3. **Monitor:**
   - Error logs
   - Performance metrics
   - User activity
   - Payment processing

---

## Related Documentation

- **[Environment Variables](../features/environment-variables)** - Complete env reference
- **[Security Documentation](../security/overview)** - Security configuration
- **[Monitoring](./monitoring)** - Production monitoring
- **[Troubleshooting](../extras/troubleshooting)** - Common issues

---

## Quick Reference

### Essential Deployment Steps

1. **[Getting Started](./getting-started)** - Prepare for deployment
2. **[Vercel Deployment](./vercel)** - Deploy to Vercel
3. **[Environment Setup](./environment-setup)** - Configure production
4. **[Security Checklist](./security)** - Verify security
5. **[Monitoring](./monitoring)** - Set up monitoring

### Deployment Commands

```bash
# Build locally
npm run build

# Test production build
npm start

# Deploy (Vercel)
vercel --prod
```

---

**Ready to deploy?** Start with [Getting Started](./getting-started)!
