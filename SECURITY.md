# Security Policy

## Supported Versions

The supported security scope for `pomo` is the current default branch, `master`. Older commits, tags, branches, forks, demos, and generated artifacts are not actively supported unless the repository explicitly marks them as maintained.

Project summary: A Pomodoro Electron App

## Reporting a Vulnerability

Please report suspected vulnerabilities through GitHub's private vulnerability reporting or by opening a draft GitHub Security Advisory for `garethpaul/pomo` when that option is available. If GitHub does not show a private reporting option for this repository, contact the repository owner through GitHub and avoid posting exploit details publicly until the issue can be assessed.

Do not open a public issue that includes exploit code, secrets, personal data, or detailed reproduction steps for an unpatched vulnerability.

## What to Include

Helpful reports include:

- the affected file, endpoint, permission, dependency, or workflow
- a concise impact statement explaining what an attacker could do
- reproduction steps using test data and accounts you control
- the branch, commit SHA, platform version, device, runtime, or dependency versions used
- logs, screenshots, or proof-of-concept snippets that demonstrate impact without exposing private data

## Project Security Posture

- This repository appears to be a Node.js or JavaScript project. The active security scope is the code and documentation on the default branch.
- Review found authentication, token, or session-related code paths; changes in those areas should receive security-focused review before merge.
- Review found external API integrations or credential-adjacent configuration; changes in those areas should receive security-focused review before merge.
- Review found network clients, sockets, web APIs, or service endpoints; changes in those areas should receive security-focused review before merge.
- Review found mobile permission or privacy-sensitive data handling; changes in those areas should receive security-focused review before merge.
- Review found file, document, data, or media parsing flows; changes in those areas should receive security-focused review before merge.
- Review found shell execution, subprocess, or dynamic evaluation surfaces; changes in those areas should receive security-focused review before merge.
- Review found secret-like configuration names that require careful review before use; changes in those areas should receive security-focused review before merge.
- Dependency manifests detected: package.json. Dependency updates should preserve lockfiles when present and avoid introducing packages without a clear maintenance reason.

## Service and API Notes

For web services, APIs, sockets, or scraping workflows, prioritize reports involving authentication bypass, authorization errors, injection, server-side request forgery, unsafe deserialization, credential leakage, data exposure, or denial-of-service conditions. Use test accounts and minimal proof-of-concept traffic only.

Pomo should remain local-first: do not add hidden remote script loads,
network-backed timer state, analytics, or external navigation without explicit
user action. Run `npm run contracts` before changing renderer script loading or
external-link behavior.
The maintained desktop baseline is Electron 42.4.0 on Node 22.12 or newer with
an exact package lock and zero known npm audit findings.
External links should only open explicit http/https URLs after user clicks.
The main process must repeat that URL validation, reject credential-bearing
URLs, deny renderer navigation/window creation, and expose no generic shell or
IPC primitive to the renderer.
BrowserWindow must retain context isolation, sandboxing, and disabled Node
integration. The self-contained preload bridge is limited to close and
validated external-link commands. It rejects non-string external URL values
before IPC, while the main process remains responsible for complete URL and
protocol validation. Privileged IPC is bound to the application window's
current main frame, so child, missing-frame, and unrelated senders cannot reuse
those handlers. An external launch failure must resolve to `false` inside the
main process without logging the URL or platform exception. The renderer CSP
must keep remote connections and scripts disabled.
The static `npm run build` gate also runs local-only desktop contracts, and the
Makefile wrappers should keep lint, test, build, verify, and check commands
available for repository automation.
GitHub Actions runs `make check` for pushes and pull requests so syntax,
renderer wiring, local-only, and notification icon guardrails stay enforced
before merge.

Renderer local asset references should stay relative and point to checked-in
CSS, JavaScript, image, and audio files. This keeps packaging failures and
surprise remote fallbacks out of the desktop app.
The desktop notification icon should also stay relative and checked in, so
notifications do not fetch remote artwork.
Timer durations should stay positive integers so malformed local state cannot
produce broken countdown behavior.
Paused timer state is converted back to numeric seconds before restarting so
zero-padded display strings cannot inflate the local countdown.
Hosted validation uses credential-free, read-only repository access, pinned
actions, exact lockfile installation, dependency auditing, Node 22/24 pure
gates, and a bounded Ubuntu 24.04 Electron smoke launch.

## Dependency and Supply Chain Security

Dependency updates should come from trusted package managers and must keep
`package.json` and `package-lock.json` synchronized. Use `npm ci`, run `npm
audit`, and do not restore floating Electron or menubar ranges. Do not commit
credentials, private keys, tokens, generated secrets, or machine-local
configuration. If a vulnerability depends on a compromised package,
typosquatting risk, insecure transitive dependency, or unsafe build step,
include the package name, affected version, and the path through which it is
used.

## Safe Research Guidelines

Good-faith research is welcome when it stays within these boundaries:

- use only accounts, devices, data, and infrastructure that you own or have explicit permission to test
- avoid destructive actions, persistence, spam, phishing, social engineering, or denial-of-service testing
- minimize access to personal data and stop testing immediately if private data is exposed
- do not exfiltrate secrets or third-party data; report the minimum evidence needed to verify impact
- keep vulnerability details confidential until the maintainer has assessed the report

## Maintainer Response

The maintainer will review complete reports as availability allows, prioritize issues by exploitability and impact, and coordinate a fix or mitigation when the affected code is still maintained. For sample, archived, or educational repositories, the likely remediation may be documentation, dependency updates, or clearly marking unsupported code rather than a production-style patch release.
