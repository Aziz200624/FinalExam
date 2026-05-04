const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '..', 'reports', 'artillery-report.json');
const outputPath = path.join(__dirname, '..', 'reports', 'artillery-summary.md');

if (!fs.existsSync(reportPath)) {
  console.error('Artillery JSON report not found. Run: npm run load:test');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const counters = report.aggregate?.counters || {};
const hist = report.aggregate?.summaries?.['http.response_time'] || {};

const requests = counters['http.requests'] || 0;
const responses = counters['http.responses'] || 0;
const failedUsers = counters['vusers.failed'] || 0;
const code5xx = Object.keys(counters)
  .filter((key) => /^http\.codes\.5\d\d$/.test(key))
  .reduce((sum, key) => sum + (counters[key] || 0), 0);
const errorRate = responses > 0 ? ((code5xx / responses) * 100).toFixed(2) : '0.00';
const throughput = report.aggregate?.rates?.['http.request_rate'] || 0;

const markdown = [
  '# Artillery Load Test Summary',
  '',
  `- Total requests: ${requests}`,
  `- Total responses: ${responses}`,
  `- 5xx responses: ${code5xx}`,
  `- Error rate: ${errorRate}%`,
  `- Throughput: ${throughput} req/s`,
  `- Response time p50: ${hist.p50 ?? 'n/a'} ms`,
  `- Response time p95: ${hist.p95 ?? 'n/a'} ms`,
  `- Response time p99: ${hist.p99 ?? 'n/a'} ms`,
  `- Failed virtual users: ${failedUsers}`,
  '',
  '## Notes',
  '- If error rate is high, verify database credentials and availability before final demo.',
  '- Re-run with a healthy DB connection to capture realistic throughput values.',
  '',
].join('\n');

fs.writeFileSync(outputPath, markdown, 'utf8');
console.log(`Summary saved to ${outputPath}`);
