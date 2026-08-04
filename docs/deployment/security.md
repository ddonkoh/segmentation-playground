# Deployment Security Checklist

Complete security checklist for deploying ShipSafe to production, with verification steps and best practices.

## Overview

This checklist ensures your ShipSafe deployment follows security best practices. Review each item before going live and verify after deployment.

**Security Principles:**
- ✅ Defense in depth (multiple security layers)
- ✅ Least privilege (minimum required access)
- ✅ Fail secure (secure by default)
- ✅ Regular audits (continuous improvement)

## Pre-Deployment Security

### Environment Variables

- [ ] All sensitive keys use production values (not test/development)
- [ ] No test/development keys in production environment
- [ ] Keys are rotated and secure
- [ ] Private keys properly formatted (escaped newlines)
- [ ] All required variables are set
- [ ] No hardcoded secrets in code
- [ ] Environment variables stored securely (hosting platform secrets)

**Verification:**

```bash
# Check environment variables are set
# (In hosting platform dashboard)
- Verify all required variables present
- Check production keys are used
- Confirm no test keys in production
```

### Firebase Configuration

- [ ] Production Firebase project configured (separate from dev)
- [ ] Authorized domains include production domain
- [ ] Authorized domains include `*.vercel.app` (if using Vercel)
- [ ] Firestore security rules configured for production
- [ ] Service account key is production key
- [ ] Service account has minimum required permissions

**Verification Steps:**

1. **Check Authorized Domains:**
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Verify: `yourdomain.com`, `www.yourdomain.com` are listed

2. **Verify Security Rules:**
   ```javascript
   // firestore.rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Production rules should be restrictive
     }
   }
   ```

### Stripe Configuration

- [ ] Live mode enabled (not test mode)
- [ ] Webhook endpoint configured for production domain
- [ ] Production price IDs configured in environment variables
- [ ] Webhook signing secret updated
- [ ] Webhook events selected correctly
- [ ] Test keys not used in production

**Verification Steps:**

1. **Check Stripe Mode:**
   - Stripe Dashboard → Toggle should show "Live mode"

2. **Verify Webhook:**
   - Stripe Dashboard → Developers → Webhooks
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events selected: `checkout.session.completed`, `customer.subscription.*`, etc.

### Domain & HTTPS

- [ ] Custom domain configured
- [ ] HTTPS enabled and verified
- [ ] SSL certificate valid (automatic with most platforms)
- [ ] HTTP redirects to HTTPS
- [ ] Domain matches `config.ts` domainName
- [ ] DNS records configured correctly

**Verification:**

```bash
# Test HTTPS redirect
curl -I http://yourdomain.com
# Should redirect to https://yourdomain.com

# Test SSL certificate
openssl s_client -connect yourdomain.com:443
# Should show valid certificate
```

**Code Verification:**

```typescript
// middleware.ts automatically enforces HTTPS
export async function middleware(req: NextRequest) {
  // HTTPS enforcement (automatic in production)
  const httpsRedirect = enforceHttps(req);
  if (httpsRedirect) return httpsRedirect;
  // ...
}
```

### Security Headers

- [ ] Security headers verified in production
- [ ] HSTS header present and configured
- [ ] CSP header present (if customized)
- [ ] X-Frame-Options set to DENY
- [ ] X-Content-Type-Options set to nosniff

**Verification Tool:**

Use [securityheaders.com](https://securityheaders.com/) to verify headers:
1. Enter your domain
2. Review security score
3. Check all headers are present

**Code Verification:**

```typescript
// Security headers automatically applied
// src/lib/security/headers.ts
export function applySecurityHeaders(res: NextResponse, req: NextRequest) {
  res.headers.set("Content-Security-Policy", CSP);
  res.headers.set("Strict-Transport-Security", HSTS);
  res.headers.set("X-Frame-Options", "DENY");
  // ... all headers set automatically
}
```

## Post-Deployment Verification

### HTTPS & SSL

- [ ] HTTPS redirects working (HTTP → HTTPS)
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] HSTS header present

**Test:**
```bash
# Should redirect
curl -I http://yourdomain.com
# Should return HTTPS
curl -I https://yourdomain.com
```

### Security Headers

- [ ] All security headers present
- [ ] HSTS configured correctly
- [ ] CSP policy working
- [ ] No header warnings in browser console

**Test:**
```bash
curl -I https://yourdomain.com | grep -i security
```

### Authentication

- [ ] Authentication working correctly
- [ ] Protected routes require login
- [ ] Unauthenticated users redirected to /auth
- [ ] Sessions persist correctly
- [ ] Logout clears sessions

**Test Steps:**
1. Try accessing `/dashboard` without login
2. Should redirect to `/auth`
3. Sign up/login works
4. Protected routes accessible after login
5. Logout works and redirects correctly

### Payments

- [ ] Checkout redirects to Stripe
- [ ] Stripe checkout completes successfully
- [ ] Webhooks receiving events
- [ ] Subscription status updates correctly
- [ ] Billing portal accessible

**Test Steps:**
1. Click "Get Started" button
2. Complete test checkout (use Stripe test card)
3. Verify webhook event received
4. Check Firestore subscription document created
5. Verify user subscription status updated

### Webhooks

- [ ] Webhook endpoint receives events
- [ ] Webhook signature validation working
- [ ] Events processed correctly
- [ ] Errors logged appropriately

**Test:**
```bash
# Use Stripe CLI for testing
stripe listen --forward-to https://yourdomain.com/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Security Features

- [ ] Rate limiting working (test with rapid requests)
- [ ] API firewall blocking suspicious requests
- [ ] CSRF protection enabled on mutations
- [ ] Audit logging capturing events

**Test Rate Limiting:**
```bash
# Make 60 requests quickly
for i in {1..60}; do
  curl https://yourdomain.com/api/user/me
done
# Request 51+ should return 429
```

**Code Verification:**

```typescript
// All security layers automatically enabled
// middleware.ts
export async function middleware(req: NextRequest) {
  // 1. HTTPS enforcement ✅
  // 2. Rate limiting ✅
  // 3. API firewall ✅
  // 4. CSRF protection ✅
  // 5. Security headers ✅
  // 6. Audit logging ✅
  // 7. Authentication ✅
}
```

## Security Checklist Summary

### Critical (Must Have)

- [ ] **HTTPS enabled** - All traffic encrypted
- [ ] **Production keys** - No test keys in production
- [ ] **Environment variables** - All required variables set
- [ ] **Firebase authorized domains** - Production domain added
- [ ] **Stripe webhook** - Production URL configured
- [ ] **Security headers** - All headers present

### Important (Should Have)

- [ ] **Error tracking** - Sentry or similar configured
- [ ] **Monitoring** - Logs and metrics enabled
- [ ] **Backup strategy** - Firestore backups configured
- [ ] **Key rotation plan** - Regular rotation schedule
- [ ] **Access control** - Admin access restricted

### Recommended (Nice to Have)

- [ ] **Security scanning** - Regular vulnerability scans
- [ ] **Penetration testing** - Professional security audit
- [ ] **Compliance** - GDPR, SOC 2, etc. (if applicable)
- [ ] **Incident response plan** - Security incident procedures

## Ongoing Security

### Regular Maintenance

**Weekly:**
- [ ] Review error logs
- [ ] Check security audit logs
- [ ] Monitor rate limit violations

**Monthly:**
- [ ] Review security headers
- [ ] Check for dependency updates
- [ ] Review access logs
- [ ] Rotate keys if needed

**Quarterly:**
- [ ] Security audit
- [ ] Review and update security rules
- [ ] Test backup and recovery
- [ ] Update dependencies

### Key Rotation

**When to Rotate:**
- Every 90 days (recommended)
- After security incident
- When team member leaves
- When compromised (immediately)

**Rotation Process:**
1. Generate new keys
2. Update in hosting platform
3. Update in Firebase/Stripe
4. Test with new keys
5. Revoke old keys
6. Redeploy application

## Security Best Practices

### 1. Keep Dependencies Updated

```bash
# Regularly update dependencies
npm audit
npm audit fix

# Review security advisories
npm audit
```

### 2. Monitor Security Events

Review audit logs regularly:

```typescript
// Access audit logs
import { getAuditLogs } from "@/lib/security/audit";

const logs = getAuditLogs(100);
const securityEvents = logs.filter(
  log => log.type.includes("block") || log.type.includes("failed")
);
```

### 3. Use Security Scanning Tools

**Tools:**
- [Snyk](https://snyk.io/) - Dependency vulnerability scanning
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Package vulnerabilities

### 4. Follow Principle of Least Privilege

- ✅ Service accounts have minimum required permissions
- ✅ Admin access limited to necessary users
- ✅ Environment variables scoped appropriately

## Incident Response

### If Security Incident Occurs

1. **Immediately:**
   - Rotate all compromised keys
   - Revoke affected sessions
   - Enable enhanced monitoring

2. **Investigate:**
   - Review audit logs
   - Check error logs
   - Identify attack vector

3. **Mitigate:**
   - Block malicious IPs
   - Update security rules
   - Patch vulnerabilities

4. **Notify:**
   - Inform affected users (if applicable)
   - Document incident
   - Update security measures

## Learn More

- [Security Overview](../security/overview) - Complete security architecture
- [Environment Setup](./environment-setup) - Secure environment configuration
- [Security Headers](../security/security-headers) - HTTP security headers
- [API Security](../security/api-security) - API endpoint security
