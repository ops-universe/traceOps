# Metrics

Use summarize(traces, {pricing}) from src/metrics.mjs. Latencies use nearest-rank percentiles, span and root latency are separate. Error rates use all supplied spans/traces as denominators; empty rates are null. Usage counts only explicitly supplied token counts. Do not report missing tokens as measured zero; see reportedSpans and missingSpans. Optional uniform inputPerMillion/outputPerMillion rates must be supplied by the caller in a consistent currency. Estimates are partial and do not represent billed amounts. No provider calls.
