/** Offline secrets firewall heuristics for the agent era */

export const SECRET_PATTERNS: { name: string; re: RegExp }[] = [
  { name: "AWS access key", re: /AKIA[0-9A-Z]{16}/g },
  { name: "Generic API key assign", re: /(?:api[_-]?key|secret|token)\s*[:=]\s*['\"][^'\"]{12,}/gi },
  { name: "Private key block", re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { name: "GitHub PAT", re: /ghp_[A-Za-z0-9]{20,}/g },
  { name: "Slack token", re: /xox[baprs]-[A-Za-z0-9-]{10,}/g },
];

export const SENSITIVE_PATHS =
  /(^\.env|\.pem$|credentials|\.npmrc|id_rsa|secrets?\.)/i;

export interface Finding {
  path?: string;
  name: string;
  line?: number;
  excerpt: string;
}

export function scanText(text: string, path?: string): Finding[] {
  const findings: Finding[] = [];
  if (path && SENSITIVE_PATHS.test(path)) {
    findings.push({
      path,
      name: "Sensitive path",
      excerpt: path,
    });
  }
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    for (const p of SECRET_PATTERNS) {
      p.re.lastIndex = 0;
      if (p.re.test(line)) {
        findings.push({
          path,
          name: p.name,
          line: i + 1,
          excerpt: line.trim().slice(0, 120),
        });
      }
    }
  }
  return findings;
}

export function agentIgnoreTemplate(): string {
  return `# .agentignore — block agent/IDE tools from reading secrets
.env
.env.*
**/*.pem
**/credentials.json
**/id_rsa
**/.npmrc
**/secrets/**
`;
}
