# Language-independent review method

Use this reference to plan substantive review. Adapt checks to observed technologies and scope; it is not a mandatory checklist of irrelevant vulnerability classes.

## Discover enough architecture to divide the work

Inventory manifests/build files, entry points, authentication and authorization controls, persistence, dependencies, jobs, secrets/configuration, and deployment boundaries. Identify generated/vendor code and decide coverage from scope rather than silently ignoring or exhaustively reading it. Detect languages from repository evidence; never assume all repos share a stack.

Read small, relevant slices. Use fast search and targeted file reads. Inventory results belong in architecture and discovery coverage, not a claim that code is security-reviewed.

Divide tasks by security property and bounded component or flow. For example: tenant isolation on invoice retrieval, webhook authenticity through a queue consumer, or identity propagation from gateway to internal service. Prioritize externally reachable paths, high-value assets, privilege boundaries, and sensitive data.

## Trace inputs, controls, and effects

For each relevant flow establish:
- Who can trigger it and with what privileges?
- Which input is attacker-controlled, including indirect inputs from storage, queues, callbacks, files, or another service?
- Which validation, authentication, authorization, tenant checks, encoding, isolation, or cryptographic verification actually run?
- What sensitive effect occurs, and under which runtime/configuration assumptions?
- Do error paths, alternate entry points, retries, concurrency, or defaults bypass controls?

Choose applicable checks: access control and tenant isolation; injection and unsafe parsing; file/path handling; SSRF and outbound requests; browser/session boundaries; deserialization and code execution; secret handling and cryptography; business-logic abuse and race conditions; sensitive-data leakage; dependency/build/deployment risks. Explain non-applicability briefly instead of applying stack-specific rules universally.

A dependency advisory needs an identifiable package/version and trustworthy advisory source. Distinguish a vulnerable version from demonstrated exploit reachability. If current advisory access is unavailable, document that limitation.

## Cross-repository investigation

Build explicit producer/consumer edges, then inspect both ends when available. Follow:
- Identity, roles, tenant IDs, and authorization decisions across gateways/services.
- Validation at public interfaces versus internal workers or alternate callers.
- Signing, replay protection, audience/issuer checks, and secret ownership.
- Shared schemas/library versions, serialization differences, and incompatible assumptions.
- Queue/event trust, retries/idempotency, data ownership, and confused-deputy paths.
- Infrastructure exposure, proxy/header trust, service credentials, and deployment defaults.

Record source paths on both sides and the revisions reviewed. If a related repo is missing, create a blocked cross-repo task with an explicit question and continue available local tasks. Never conclude an end-to-end control works based only on the caller or only on a frontend check.

## Verify and record

Treat automated tools as evidence sources. Record what ran, its version, configuration, exit code, target, and result. Use available appropriate tools; do not make successful installation or a specific scanner a prerequisite for source review.

Before executing repository code or a reproduction, inspect its effects and use permitted isolated resources. If execution is unavailable, source reasoning can support a confirmed finding when reachability and failure are established; label it source-confirmed and describe untested assumptions.

For potential issues, seek nearby controls and counterevidence before confirming. Record rejected hypotheses and their reasons. Avoid duplicates across endpoint variants or repos when one root cause explains them; retain all affected manifestations.

A reviewed_no_finding coverage row is limited to the recorded check and area. Conclude with supported findings and limitations, not a claim of exhaustive security.
