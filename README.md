# cleanrules.github.io

Source of <https://cleanrules.github.io>, the website of
[cleanrules](https://github.com/cleanrules/cleanrules): an explainable rules engine with one
Rust core and bindings for Rust, C/C++, Python, JavaScript, Java/Scala and Go.

A static site with no build step: `index.html`, `404.html` and `assets/`
(styles, script, logo and the social preview image `og.png`). Syntax
highlighting uses Prism from cdnjs, and the fonts come from Google Fonts.

To preview it locally:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

GitHub Pages publishes the `main` branch (Settings → Pages → Deploy from a
branch → `main` / root). `.nojekyll` disables Jekyll processing.

The explanation outputs shown on the page are real output of the Python
reference implementation. The examples in other languages are an API preview
and may change.
