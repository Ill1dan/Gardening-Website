# 🔒 Security Guide

## 🚨 URGENT: If You've Leaked Credentials

If you've accidentally committed database credentials or API keys to GitHub, follow these steps **IMMEDIATELY**:

### 1. Rotate Credentials (DO THIS NOW!)

**MongoDB Atlas:**
1. Log into [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to "Database Access"
3. Find your database user and click "Edit"
4. Click "Edit Password" and generate a new one
5. Update your local `.env` file with the new password

**Other Services:**
- JWT_SECRET: Generate a new secret key
- Any API keys: Regenerate them in their respective services

### 2. Secure Your Database

**MongoDB Atlas Security Checklist:**
- [ ] Change database user password
- [ ] Restrict Network Access (remove `0.0.0.0/0`)
- [ ] Enable database auditing (if available)
- [ ] Review connection logs for suspicious activity
- [ ] Consider rotating cluster if heavily compromised

### 3. Clean Git History (If Needed)

If credentials were committed, you may need to clean git history:

```bash
# WARNING: This rewrites git history - coordinate with team first!
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# Force push (be very careful!)
git push origin --force --all
```

## 🛡️ Prevention Best Practices

### Environment Variables

**✅ DO:**
- Use `.env` files for secrets (already in `.gitignore`)
- Use placeholder values in documentation
- Use environment variables in production

**❌ DON'T:**
- Commit `.env` files
- Put real credentials in code or docs
- Use weak or default passwords

### Example .env File

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Authentication
JWT_SECRET=<generate-a-very-long-random-string>
JWT_EXPIRE=30d

# Environment
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

### MongoDB Atlas Security

1. **Network Access**:
   - Only allow your IP addresses
   - Use VPN if working remotely
   - Never use `0.0.0.0/0` in production

2. **Database Users**:
   - Use strong, unique passwords
   - Create separate users for different environments
   - Use least privilege principle

3. **Connection String**:
   - Always use environment variables
   - Never hardcode in source code
   - Use connection string templates in docs

### GitHub Repository Security

1. **Pre-commit Hooks**:
   ```bash
   # Install git-secrets
   npm install -g git-secrets
   
   # Setup for repository
   git secrets --install
   git secrets --register-aws
   ```

2. **Repository Settings**:
   - Enable secret scanning (GitHub Advanced Security)
   - Set up dependency alerts
   - Use branch protection rules

### Production Deployment

1. **Environment Variables**:
   - Set via hosting platform (Heroku, Vercel, etc.)
   - Never include in deployment files
   - Use secure key management services

2. **Database Security**:
   - Use connection pooling
   - Enable SSL/TLS connections
   - Regular security updates
   - Monitor access logs

## 🔍 Security Monitoring

### What to Monitor

- Unusual database connections
- Failed authentication attempts
- Unexpected API usage patterns
- Database query performance anomalies

### Tools

- MongoDB Atlas built-in monitoring
- Application performance monitoring (APM)
- Log aggregation services
- Security scanning tools

## 📞 Incident Response

If you suspect a security breach:

1. **Immediate Actions**:
   - Rotate all credentials
   - Check access logs
   - Monitor for unusual activity
   - Document the incident

2. **Investigation**:
   - Determine scope of exposure
   - Check for data exfiltration
   - Review all access logs
   - Assess impact on users

3. **Recovery**:
   - Implement additional security measures
   - Update security procedures
   - Notify stakeholders if required
   - Learn from the incident

## 📚 Additional Resources

- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Remember**: Security is an ongoing process, not a one-time setup. Regularly review and update your security practices!
