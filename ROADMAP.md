# Roadmap

1. Foundation — merged and verified
2. Core tracing — merged and verified
3. Instrumentation — merged; privacy and timing acceptance passed
4. Metrics — merged and verified
5. Storage — merged; retention acceptance passed
6. Diagnostics and CLI — merged and verified
7. Dashboard — merged; Chromium acceptance passed
8. Synthetic scenarios — merged and verified
9. Developer Preview, public release and promotional website — deferred by maintainer.

Engineering acceptance for the documented local-first scope passed on main 5627c7c4608824bc8b3eaea07e9e7ab3c3ae0feb, CI 45522142449: 27 core tests, 2 browser tests, locked installs and zero reported dependency vulnerabilities. See docs/status/IMPLEMENTATION-STATUS.md for boundaries. Keep CI gates active for subsequent changes.

## Wave 1 final evidence — 2026-11-27

Exact authenticated main: df434bdf8920845cbd3890108330f76acdff1cac. Latest push-triggered [Core CI 45835216736](https://github.com/ops-universe/traceOps/actions/runs/45835216736) succeeded: test job 139962167009 (27 passed, 0 failed, 0 skipped), browser-acceptance job 139962166921 (2 passed), website-build job 139962166757 (success). Actual logs confirm locked npm ci installs and zero reported vulnerabilities in core, website and browser runner audits. Earlier exact-main Core CI 45664460463 and Pages 45664461000 succeeded; static Pages hosting is not product-runtime deployment. Authenticated comparison against 5627c7c4 confirms only documentation/static site infrastructure changed, not core runtime or tests. All eight functional phases retain scoped acceptance; no new implementation gap identified in reviewed evidence. Preserve existing privacy, explicit retention, trusted-directory, synthetic-only, OTLP, accessibility and production limitations. PR #18 requires fresh exact-head CI and supervisor review before merge; no release or deployment requested.
