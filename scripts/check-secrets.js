#!/usr/bin/env node

/**
 * Pre-commit hook to check for potential secrets in staged files
 * Run: node scripts/check-secrets.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns that might indicate secrets
const SECRET_PATTERNS = [
  /mongodb\+srv:\/\/[^<][^:]+:[^@]+@/i,  // Real MongoDB Atlas connection
  /password\s*[:=]\s*[^<][^\s"']{8,}/i,   // Real passwords (not placeholders)
  /secret\s*[:=]\s*[^<][^\s"']{20,}/i,    // Real secrets (not placeholders)
  /key\s*[:=]\s*[^<][^\s"']{20,}/i,       // Real API keys (not placeholders)
  /token\s*[:=]\s*[^<][^\s"']{20,}/i,     // Real tokens (not placeholders)
  /aws_access_key_id\s*[:=]\s*AKIA[0-9A-Z]{16}/i, // AWS Access Keys
  /aws_secret_access_key\s*[:=]\s*[0-9a-zA-Z/+=]{40}/i, // AWS Secret Keys
];

// Files to check (staged files in git)
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return output.trim().split('\n').filter(file => file && fs.existsSync(file));
  } catch (error) {
    // If not in git repo or no staged files, check all relevant files
    return [];
  }
}

// Check file content for secrets
function checkFileForSecrets(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const violations = [];

    lines.forEach((line, index) => {
      SECRET_PATTERNS.forEach(pattern => {
        if (pattern.test(line)) {
          // Skip lines with obvious placeholders
          if (line.includes('<') && line.includes('>')) return;
          if (line.includes('your_') || line.includes('YOUR_')) return;
          if (line.includes('example') || line.includes('EXAMPLE')) return;
          if (line.includes('placeholder') || line.includes('PLACEHOLDER')) return;
          
          violations.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            pattern: pattern.source
          });
        }
      });
    });

    return violations;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

// Main function
function main() {
  console.log('🔍 Checking for potential secrets...');
  
  const stagedFiles = getStagedFiles();
  const filesToCheck = stagedFiles.length > 0 ? stagedFiles : [
    '.env',
    'env.example',
    '*.md',
    '*.js',
    '*.json',
    '*.yml',
    '*.yaml'
  ];

  let violations = [];

  // Check relevant file types
  const checkPatterns = ['.md', '.js', '.json', '.yml', '.yaml', '.env'];
  
  function checkDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        checkDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (checkPatterns.includes(ext) || item.startsWith('.env')) {
          const fileViolations = checkFileForSecrets(fullPath);
          violations = violations.concat(fileViolations);
        }
      }
    });
  }

  if (stagedFiles.length > 0) {
    stagedFiles.forEach(file => {
      const fileViolations = checkFileForSecrets(file);
      violations = violations.concat(fileViolations);
    });
  } else {
    checkDirectory('.');
  }

  // Report results
  if (violations.length > 0) {
    console.error('🚨 POTENTIAL SECRETS DETECTED:');
    console.error('=====================================');
    
    violations.forEach(violation => {
      console.error(`File: ${violation.file}:${violation.line}`);
      console.error(`Content: ${violation.content}`);
      console.error(`Pattern: ${violation.pattern}`);
      console.error('---');
    });
    
    console.error('\n❌ COMMIT BLOCKED - Potential secrets found!');
    console.error('\nTo fix:');
    console.error('1. Remove or replace real credentials with placeholders');
    console.error('2. Use environment variables for sensitive data');
    console.error('3. Add sensitive files to .gitignore');
    console.error('4. See SECURITY.md for best practices');
    
    process.exit(1);
  } else {
    console.log('✅ No potential secrets detected');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkFileForSecrets, SECRET_PATTERNS };
