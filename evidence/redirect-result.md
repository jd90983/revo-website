# Redirect verification — 2026-10-14 UTC

Project prj_1aJWEMaSRTrCX7tghbM2EvaXAcU4, team_7gc3tgUz67O0vAhxaQBJsFY0 (group-u).

Before: Vercel project domain revoapp.ai had redirect www.revoapp.ai, redirectStatusCode null. Public HTTPS returned 307. Repository vercel.json already had permanent:true. This was a domain configuration issue.

Applied PATCH /v9/projects/{project}/domains/revoapp.ai with explicit redirect www.revoapp.ai and redirectStatusCode 308. First narrow PATCH omitted redirect; API cleared the destination, so immediately repeated with explicit destination. Final read returned the intended www target and 308. No deployment, DNS, credentials, or access changes.

Twelve public GET traces confirmed: HTTPS apex -> 308 -> HTTPS www -> 200; HTTPS www -> 200; HTTP www -> 308 -> HTTPS www -> 200. Paths and queries preserved. HTTP apex -> 308 -> HTTPS apex -> 308 -> HTTPS www -> 200: two platform redirects remain, no loop. Removing the HTTP protocol hop is outside the minimal domain-status patch and was not claimed.

Rollback: use same scoped PATCH with evidence/redirect-rollback-payload.json, which restores explicit www target and null status (previous implicit 307). Verify public headers after rollback. Permanent redirects may persist in client caches.

Official API reference: https://vercel.com/docs/rest-api/projects/update-a-project-domain
