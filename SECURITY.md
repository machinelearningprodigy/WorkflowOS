# SECURITY.md

## Security Policy

### Reporting a Vulnerability

If you discover a security vulnerability in WorkflowOS, please report it to us immediately.

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, email us at: **security@workflowos.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

---

## Security Measures

### Data Protection

1. **Encryption at Rest**
   - All sensitive data (API keys, tokens, passwords) is encrypted using AES-256-GCM
   - Database connections use SSL/TLS
   - File storage uses server-side encryption

2. **Encryption in Transit**
   - All API requests use HTTPS
   - TLS 1.3 minimum
   - HSTS headers enforced

3. **Authentication**
   - Clerk for secure authentication
   - Multi-factor authentication supported
   - Session management with secure cookies
   - OAuth 2.0 for third-party integrations

4. **Authorization**
   - Role-based access control (RBAC)
   - Resource-level permissions
   - API key scoping

5. **Rate Limiting**
   - IP-based rate limiting
   - User-based rate limiting
   - API key rate limiting
   - DDoS protection

6. **Input Validation**
   - All inputs validated with Zod schemas
   - XSS prevention
   - SQL injection prevention (Prisma ORM)
   - CSRF protection

7. **Audit Logging**
   - All sensitive actions logged
   - Security events tracked
   - Immutable audit trail

8. **Webhook Security**
   - HMAC signature verification
   - Replay attack prevention
   - Secret rotation support

---

## Security Best Practices for Developers

### Code Security

- Never commit secrets or API keys
- Use environment variables for all sensitive data
- Validate and sanitize all user inputs
- Use parameterized queries (Prisma handles this)
- Implement proper error handling (don't leak sensitive info)

### API Security

- Always use the rate limiting middleware
- Implement proper authentication checks
- Validate request payloads with Zod
- Use HTTPS only
- Implement CORS properly

### Database Security

- Use Prisma for all database queries
- Never use raw SQL with user input
- Implement row-level security where needed
- Regular backups
- Encrypt sensitive columns

### Third-Party Integrations

- Encrypt all OAuth tokens before storage
- Implement token refresh logic
- Validate webhook signatures
- Use least-privilege principle for API scopes

---

## Security Checklist for Deployment

- [ ] All environment variables set correctly
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Database SSL enabled
- [ ] Secrets properly encrypted
- [ ] Audit logging enabled
- [ ] Monitoring and alerting configured
- [ ] Backup strategy in place
- [ ] Incident response plan documented

---

## Compliance

WorkflowOS is designed to be compliant with:

- **GDPR** - Data privacy and user rights
- **SOC 2** - Security and availability (roadmap)
- **PCI DSS** - Payment card data (via Stripe)

---

## Security Updates

We regularly update dependencies to patch security vulnerabilities.

To update dependencies:

```bash
npm audit
npm audit fix
```

---

## Contact

For security concerns: security@workflowos.com
For general support: support@workflowos.com
