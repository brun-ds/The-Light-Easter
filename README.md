# THE LIGHT EATERS: Official Wiki

Plain HTML/CSS/JS wiki. No build step, no installs.

## Publish on GitHub Pages
1. Upload all files of this folder (they are all in the same folder) to the root of a repository.
2. Repository > Settings > Pages > "Deploy from a branch" > `main` / `(root)` > Save.
3. The site appears at `https://<user>.github.io/<repo>/`.

## Privacy
Anyone with the link can open the site, and in a public repository anyone can read every file.
Never commit private development notes, restricted lore or unconfirmed ideas to this repository.
Keep the Development Archive somewhere else (for example a separate private repository).

## Files
- `index.html`: page shell
- `style.css`: design
- `data.js`: ALL the content (categories, articles). Edit this to add articles.
- `app.js`: code (routing, pages, search). Normally you do not touch it.

## Add an article
Copy the example article in `data.js`, change the `id` (`category/slug`) and fill the fields.
Leave unknown fields as `Unknown`. Link to other articles with `[[category/slug|text]]`.
Delete the example (`placeholder: true`) once real content exists.
