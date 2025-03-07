
# Medical Multi-Agent

## Local Usage

```powershell
npm run dev
```

## Deployment to GitHub Pages

The project is configured to automatically deploy to GitHub Pages using GitHub Actions.

When you push to the main branch, the GitHub Action will:
1. Build the project
2. Deploy it to GitHub Pages

You can also manually trigger a deployment from the Actions tab in your GitHub repository.

```

4. We no longer need the Gemfile and Gemfile.lock since we're not using Jekyll:

<lov-delete file_path="Gemfile" />
<lov-delete file_path="Gemfile.lock" />

