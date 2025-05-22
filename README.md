
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

## Connection to Backend

Ensure that the backend code for the `AI Hospital` project is operational.
Assume that the Flask application is hosted on localhost port 5000.

Utilize the ngrok tool to expose localhost port 5000 (http://127.0.0.1:5000) to the internet,
and then copy the generated URL into the src/config.js file.

After completing these steps, you can access the backend via https://snivallus.github.io/Multi-agent/.