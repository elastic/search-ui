# Docsmobile starter

This repo is a Github template to create a new repository that gives you everything you need to build a [docsmobile][2] site. Note that once installed it will be on you to occasionally check for docsmobile updates and change your `package.json` to point to the latest [docsmobile][3] version.

## Setup

![Use a github template](template-example.png)

1. [Create a new repo][1] using `docsmobile-starter` as a template.
2. Run `cp .env-example .env` and add a Github token
3. Run `cp sources.json sources-dev.json` and optionally point to different sources (like a local version of another repo).
4. Run `yarn`
5. Run `yarn init-docs`
6. Run `yarn dev`
7. Visit http://localhost:3000

## Adding or removing content

Content currently comes from two places:

1. The docsmobile "docs system" are import
2. The `/content/` folder in this directory

To add your own content, you'll want to edit the `sources.json` files mentioned above. You have the choice of pointing to local files, or pulling directly from other repos.

## Custom pages

Custom pages can live in the `/pages/` directory. These can be TypeScript files that are super stylized. For example adding a file in `/pages/index.tsx` would replace the default homepage this starter site ships with.

## Hosting & deployment

At a certain stage you'll want to host your site. Contact @goodroot (Kellen Person) who will prep setup for hosting with Vercel.

## More docs

Your next steps with the platform as well as syntax guidance can be found at http://localhost:3000/docs/landing

[1]: https://github.com/organizations/elastic/repositories/new
[2]: https://github.com/elastic/docsmobile
[3]: https://github.com/elastic/docsmobile/blob/main/docsmobile/package.json
