# Synthetic enterprise scenarios

All workloads are deliberately fabricated, offline fixtures. No external calls, customer data, measured production latency or real deployment are represented.

| Scenario | Stakeholder need | Acceptance evidence |
| --- | --- | --- |
| Multi-agent coordinator | Identify concurrent worker execution and parent linkage | Two worker spans overlap under one root |
| RAG request | Distinguish retrieval and generation latency | Two retrieval spans plus one model span |
| Tool failure | Diagnose a failed call and subsequent retry | Timeout-classified span and repeated label |
| Performance investigation | Locate expensive operations without replay | Synthetic slow model ranks first by exclusive duration |

## Reproduce

From the repository root, run npm ci and npm test, then node examples/enterprise.mjs synthetic-traces.jsonl. Use a trusted local output directory. The program prints a deterministic JSON diagnostic report and writes bounded JSONL only when a path is supplied. Inspect with node src/cli.mjs inspect synthetic-traces.jsonl 33333333333333333333333333333333. No secrets, providers or credentials required.

## Integration and operations

Instrument approved static labels; avoid raw prompts, model outputs, credentials and customer identifiers. Use a local restricted directory for evidence. Treat imported files as untrusted, enforce size limits, and review any export before sharing. Collect latency and error rates from actual deployment only after explicit authorization and verify that retention and access controls meet stakeholder requirements.

## Evaluation and rollback

Fixture assertions establish deterministic parser and diagnostic behavior, not production performance. If an integration is unsuitable, remove instrumentation and retain or delete local evidence according to approved policy. Live provider interoperability and real deployment are not claimed.
