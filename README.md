# SExSI

A responsive, single-page website for **Sustaining Excellence with Super Intelligence**. All navigation stays on the main page.

The design uses the supplied navy and teal logos, a canvas constellation of two intertwined ribbons, Anime.js entrance and scroll animations, expandable focus areas, and a mobile navigation menu. The header explains the SExSI abbreviation with bold letters in the full name, and the constellation connects human insight, artificial intelligence, and excellence. Larger body text and labels, compact section spacing, and adaptive phone, tablet, and desktop layouts improve readability. A visible motion control and the system's reduced-motion preference support visitors who prefer a still experience. Content remains readable without JavaScript.

## Preview locally

No dependency installation is required to build or preview. Node.js is required for these commands:

```sh
node scripts/build.mjs
node scripts/preview.mjs
```

Open **http://127.0.0.1:4173**. The website needs no backend, external font service, or CDN.

Edit `index.html` for content, `styles.css` for design, and `script.js` for interactions. Run `node scripts/build.mjs` again after edits. Original logo files remain in `logos/`; optimized copies are in `assets/`.

## Publish with GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and deploys `dist/` whenever you push to `main`. Dependencies are already bundled locally, so the workflow does not need `npm install` or any custom secrets.

1. Create an empty GitHub repository, such as `sexsi`. A public repository works with GitHub Free; private repository support depends on your GitHub plan.
2. Push this project to that repository, including the hidden `.github` folder. From this project folder, use the following commands, replacing `YOUR-USERNAME` and the repository name. The example assumes a new local repository and an empty GitHub repository.

   ```sh
   git init
   git add .
   git commit -m "Create SExSI website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/sexsi.git
   git push -u origin main
   ```

3. In the repository, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
4. In the **Actions** tab, run **Deploy SExSI to GitHub Pages → Run workflow** if the initial push happened before Pages was enabled. Subsequent pushes deploy automatically.
5. In **Settings → Pages → Custom domain**, enter **sexsi.us** and save it before updating DNS.

The root `CNAME` file also contains `sexsi.us`, and the build copies it into `dist/`. GitHub Actions deployments require the domain to be configured in repository settings; the file alone does not configure it. `.nojekyll` is supplied for compatibility with direct static branch publishing.

See [GitHub's workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Connect SExSI.us

At your domain's DNS provider, replace the existing website records for the root domain with these GitHub Pages records. Keep unrelated email and verification records.

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-USERNAME.github.io |

Replace `YOUR-USERNAME` with your GitHub account or organization name. The `www` record excludes the repository name. Remove conflicting old root `A`, `AAAA`, or `CNAME` website records.

After GitHub's DNS check succeeds and a certificate becomes available, select **Enforce HTTPS** in **Settings → Pages**. DNS and HTTPS setup can take up to 24 hours. With both root and `www` configured, GitHub redirects `www.sexsi.us` to `sexsi.us`.

These values follow [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). The source files are ready; pushing to GitHub and changing domain records remain your deployment steps.

## Content and design references

The hero places a human symbol and “Human vision — Guiding the future” at the center of the animated constellation. Its statement, “Human Intelligence × Artificial Intelligence → Toward Super Intelligence,” expresses the brand's ambition. It deliberately avoids treating human–AI collaboration as an established equation for superintelligence, which conventionally refers to intelligence beyond human capabilities. See [IBM's explanation](https://www.ibm.com/think/topics/artificial-superintelligence) and the [OECD AI Principles on human agency and oversight](https://www.oecd.org/en/topics/ai-principles.html).

The mission was retrieved from [SExSI.us](http://sexsi.us/) on October 10, 2026. Its HTTPS endpoint returned a Cloudflare 522 response; the HTTP endpoint provided the existing Google Sites page. The focus questions and approach explanations are editorial elaborations of that mission, not claims of existing products or programs.

Design research included [EPIC](https://www.epic.net/en/), [Anime.js](https://animejs.com/), [Linear](https://linear.app/), and [Awwwards' Anime.js feature](https://www.awwwards.com/sites/anime-js). The design is original and uses the user's own branding.

Anime.js 4.5.0 is bundled locally under its MIT license in `assets/anime-LICENSE.txt`. Manrope is licensed under the SIL Open Font License, included in `assets/manrope-OFL.txt`.

## Verification

JavaScript syntax, static build, local HTTP serving, asset references, and internal navigation targets were checked. Interactive browser and screenshot verification require a browser environment that permits Chrome's child processes; the current Windows sandbox blocks these processes.
