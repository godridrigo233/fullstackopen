# Part 11 — CI/CD

[![Part 11 CI](https://github.com/godridrigo233/fullstackopen/actions/workflows/part11-ci.yml/badge.svg)](https://github.com/godridrigo233/fullstackopen/actions/workflows/part11-ci.yml)

This folder contains a small, runnable phonebook app and its continuous integration/deployment setup. It uses React and Vite for the UI, Express for the API, and Node's built-in test runner for HTTP integration tests. The API stores contacts in memory, so a restart resets the sample data.

## Run locally

Requires Node.js 24.

```sh
npm ci
npm run lint
npm test
npm run build
npm start
```

Open `http://localhost:3001`. For frontend development with Vite, run `npm run dev` in one terminal and `npm start` in another; Vite proxies API and health requests to port 3001.

## CI and deployment

The repository workflow at `.github/workflows/part11-ci.yml` runs on pushes, pull requests, manual dispatch, and weekly schedule. It calls the reusable `.github/workflows/part11-verify.yml` workflow to run lint, HTTP integration tests, and the production frontend build on Node 24. `/api/version` reports the package version. A commit message containing `[skip deploy]` still runs CI but skips deployment.

`../render.yaml` describes a Render web service with automatic Git deployments disabled. To deploy it:

1. In Render, create a Blueprint from this repository and deploy the `fullstackopen-part11` service.
2. In Render, create a deploy hook for the service. In GitHub, open **Settings → Secrets and variables → Actions** and add the hook URL as the `RENDER_DEPLOY_HOOK` secret.
3. Add the Actions variable `RENDER_DEPLOY_ENABLED` with value `true`; add `RENDER_APP_URL` with the deployed service's base URL to enable the weekly health check.

To keep `main` green, configure GitHub branch protection/rulesets for `main`: require pull requests, require the `verify` status check, and block direct pushes. These repository settings require owner access and cannot be committed as source files. Review workflow runs and enable GitHub notifications for failed actions as needed.

## Course exercise scope

The project covers the six current course chapters through exercise 22: a working sample app; workflow triggers and diagnostics; lint, tests, build, and HTTP-level end-to-end checks; Render deployment configuration and health endpoint; pull-request/main-only deployment conditions; and scheduled health checks. The production deployment and branch rules still need to be activated in the GitHub/Render accounts as described above. Exercise 23 (repository-specific submission) is beyond the requested stopping point.
