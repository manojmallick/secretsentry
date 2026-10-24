import { agentIgnoreTemplate, scanText, SECRET_PATTERNS, SENSITIVE_PATHS } from "./index.js";

export function runSecretSentryTests() {
  // Test 1: AWS Access Key detection
  const awsSample = "const AWS_KEY = 'AKIAIOSFODNN7EXAMPLE';";
  const awsFindings = scanText(awsSample);
  if (awsFindings.length !== 1 || awsFindings[0]?.name !== "AWS access key") {
    throw new Error(`AWS access key detection failed: ${JSON.stringify(awsFindings)}`);
  }

  // Test 2: GitHub PAT detection
  const ghSample = "github_token: ghp_1234567890abcdefghijklmnopqrstuvwxyz";
  const ghFindings = scanText(ghSample);
  if (ghFindings.length !== 1 || ghFindings[0]?.name !== "GitHub PAT") {
    throw new Error(`GitHub PAT detection failed: ${JSON.stringify(ghFindings)}`);
  }

  // Test 3: Slack token detection
  const slackSample = "SLACK_BOT_TOKEN=xoxb-1234567890-123456789012-abcdef123456";
  const slackFindings = scanText(slackSample);
  if (slackFindings.length !== 1 || slackFindings[0]?.name !== "Slack token") {
    throw new Error(`Slack token detection failed: ${JSON.stringify(slackFindings)}`);
  }

  // Test 4: Private Key block detection
  const keySample = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...\n-----END RSA PRIVATE KEY-----";
  const keyFindings = scanText(keySample);
  if (keyFindings.length !== 1 || keyFindings[0]?.name !== "Private key block") {
    throw new Error(`Private key block detection failed: ${JSON.stringify(keyFindings)}`);
  }

  // Test 5: Sensitive path detection (.env, credentials, id_rsa)
  const envPathFindings = scanText("DATABASE_URL=postgres://...", ".env.local");
  if (envPathFindings.length < 1 || !envPathFindings.some((f) => f.name === "Sensitive path")) {
    throw new Error(`Sensitive path detection failed for .env.local: ${JSON.stringify(envPathFindings)}`);
  }

  const certPathFindings = scanText("keys", "id_rsa");
  if (certPathFindings.length < 1 || !certPathFindings.some((f) => f.name === "Sensitive path")) {
    throw new Error(`Sensitive path detection failed for id_rsa: ${JSON.stringify(certPathFindings)}`);
  }

  // Test 6: Line number and excerpt tracking
  const multiLineCode = `import fs from 'fs';
// line 2
const token = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWX'; // line 3
console.log('done');`;
  const lineFindings = scanText(multiLineCode, "src/index.ts");
  const patFinding = lineFindings.find((f) => f.name === "GitHub PAT");
  if (!patFinding || patFinding.line !== 3) {
    throw new Error(`Line number tracking failed, expected line 3: ${JSON.stringify(patFinding)}`);
  }

  // Test 7: .agentignore template generation
  const ignoreTemplate = agentIgnoreTemplate();
  if (!ignoreTemplate.includes(".env") || !ignoreTemplate.includes(".agentignore")) {
    throw new Error(`.agentignore template generation failed: ${ignoreTemplate}`);
  }

  console.log("✓ All 7 SecretSentry unit tests passed!");
}

runSecretSentryTests();
