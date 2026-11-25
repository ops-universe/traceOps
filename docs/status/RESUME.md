# Resume

Last verified main: 0b99bc9df1de798248ed0457ebf64b1e83e502e2
PR #4 merged. Branch feat/lifecycle-diagnostics adds manual lifecycle, diagnostics and CLI. Verify exact-head CI and reviews before merge. Reproduce: npm ci && npm test; node src/cli.mjs --help; website-react npm ci, npm audit --audit-level=high, npm run build. Next: optimize diagnostic lookup and harden async name handling; dashboard with local import and browser tests.
