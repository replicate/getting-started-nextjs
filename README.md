## Getting started with Next.js and Replicate

This is a [Next.js](https://nextjs.org/) template project that's preconfigured to work with Replicate's API.

It uses Next's newer [App Router](https://nextjs.org/docs/app) and [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components).

You can use this as a quick jumping-off point to build a web app using Replicate's API, or you can recreate this codebase from scratch by following the guide at [replicate.com/docs/get-started/nextjs](https://replicate.com/docs/get-started/nextjs)

## Noteworthy files

- [app/page.js](app/page.js) - The React frontend that renders the home page in the browser
- [app/api/predictions/routes.js](app/api/predictions/routes.js) - The backend API endpoint that calls Replicate's API to create a prediction
- [app/api/predictions/[id]/routes.js](pages/api/predictions/[id]/routes.js) - The backend API endpoint that calls Replicate's API to get the prediction result

## Usage

Install dependencies:

```console
npm install
```

Add your [Replicate API token](https://replicate.com/account#token) to `.env.local`:

```
REPLICATE_API_TOKEN=<your-token-here>
```

Run the development server:

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

For detailed instructions on how to create and use this template, see [replicate.com/docs/get-started/nextjs](https://replicate.com/docs/get-started/nextjs)

<img width="707" alt="iguana" src="https://github.com/replicate/getting-started-nextjs/assets/14149230/5d1933ec-a083-4de6-90e2-7552e33e4a85">
