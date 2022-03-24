# Built with Docsmobile

This repo is built with [docsmobile][2]. Note we'll occasionally check for docsmobile updates and change our `package.json` to point to the latest [docsmobile][3] version.

## Setup

![Use a github template](template-example.png)

1. Run `cp .env-example .env` and add a Github token
2. Run `cp sources.json sources-dev.json` and optionally point to different sources (like a local version of another repo).
3. Run `yarn`
4. Run `yarn init-docs`
5. Run `yarn dev`
6. Visit http://localhost:3000

## Adding or removing content

Content currently comes from two places:

1. The docsmobile "docs system" are import
2. The `/content/` folder in this directory

To add your own content, you'll want to edit the `sources.json` files mentioned above. You have the choice of pointing to local files, or pulling directly from other repos.

## Custom pages

Custom pages can live in the `/pages/` directory. These can be TypeScript files that are super stylized. For example adding a file in `/pages/index.tsx` would replace the default homepage this starter site ships with.

## Hosting & deployment

TBD

## More docs

Your next steps with the platform as well as syntax guidance can be found at http://localhost:3000/docs/landing

[1]: https://github.com/organizations/elastic/repositories/new
[2]: https://github.com/elastic/docsmobile
[3]: https://github.com/elastic/docsmobile/blob/main/docsmobile/package.json
