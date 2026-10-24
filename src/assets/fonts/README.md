The site uses a self-hosted variable Noto Sans SC font (weights 100–900),
distributed under the SIL Open Font License in `public/fonts/OFL-NotoSansSC.txt`.

This WOFF2 contains the site's current characters, Latin letters, and punctuation.
After adding Chinese content, regenerate it with:

```sh
python -m pip install 'fonttools[woff]'
python scripts/subset-font.py
```

Missing characters retain the system sans-serif fallback. The production build
requires no Python tooling or external font service.
