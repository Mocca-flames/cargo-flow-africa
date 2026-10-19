@---
name: cloudflare-pages-push
description: Deploy a static website to Cloudflare Pages using Wrangler CLI direct upload. Use when asked to publish a repository, push a website live, or create a pages.dev URL.
---

# Cloudflare Pages Push Skill

## Goal

Deploy a static project to Cloudflare Pages and report the exact live URL.

## Operating rules

- Inspect the repository before deploying.
- Never assume the output directory. Check for `dist`, `build`, `public`, or root folder with `index.html`.
- Never print, commit, or place API tokens in source files.
- Do not claim deployment succeeded until the URL has been verified.
- Keep the project slug lowercase and hyphenated.

## Step 1 — Inspect the project

1. Confirm the repository root and current Git status.
2. Identify the output directory containing `index.html`:
   - Check for `dist/`, `build/`, `public/`, or root folder
   - Root folder is valid for plain static HTML/CSS/JS
3. Determine a suitable project name (hyphenated, lowercase).

## Step 2 — Deploy with Wrangler

1. Check existing Pages projects:

   ```bash
   npx wrangler pages project list
   ```

2. If the project doesn't exist, create it:

   ```bash
   npx wrangler pages project create <PROJECT_NAME> --production-branch main
   ```

3. Deploy the output directory:

   ```bash
   npx wrangler pages deploy <OUTPUT_DIRECTORY> --project-name=<PROJECT_NAME>
   ```

   For root folder deployment:
   ```bash
   npx wrangler pages deploy . --project-name=<PROJECT_NAME>
   ```

4. Capture the exact deployment URL from CLI output.

## Step 3 — GitHub Push

```bash
git add .
git commit -m "Deploy updates"
git push origin main
```

## Step 4 — Final report

Return:
1. Project/repository name
2. Exact production URL
3. Any remaining setup steps

Never report success if the deployment failed.
