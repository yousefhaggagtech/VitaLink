This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy to Azure

This project is configured to export a static site (see `next.config.ts` -> `output: 'export'`). There are two common Azure options:

- Azure Static Web Apps (recommended for static exports):
	- Create a Static Web App in the Azure Portal and connect to your repository.
	- Set the build command to `npm ci && npm run build` and the app artifact location to `out`.

- Azure App Service (Linux or Windows):
	- This repo includes a `.deployment` file which will run `npm run build` during deployment and publish the `out` folder.
	- Alternatively, use the included `azure-pipelines.yml` for Azure DevOps pipelines which installs dependencies, runs the build, and publishes the `out` folder as an artifact.

CI (Azure DevOps):

1. Push to the `main` branch. The provided `azure-pipelines.yml` will run on `main` and publish the `out` artifact.
2. Use the pipeline artifact to deploy to your web app or static host.

Notes:
- If you prefer runtime server features, remove `output: 'export'` from `next.config.ts` and switch to a Node-based App Service deployment instead of static hosting.
- Ensure your Node version on Azure matches the project's requirements (Node 18+ recommended).
