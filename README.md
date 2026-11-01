# cleanrules.github.io

Source of <https://cleanrules.github.io>, the website of
[cleanrules](https://github.com/cleanrules/cleanrules): an explainable rules engine with one
Rust core and bindings for Rust, C/C++, Python, JavaScript, Java/Scala, Go and Erlang.

A static site with no build step. Pages:

| Page | Contents |
|---|---|
| `index.html` | overview, status at a glance, explanation demo, languages, roadmap, citation |
| `guide.html` | concepts: conditions as data, nodes, Kleene logic, reasons, strict mode, rules, hit policies, explanations, counterfactuals, summaries |
| `format.html` | the JSON format v1: values, conditions, rules, decisions read back and verified, limits, error codes, schemas |
| `benchmarks.html` | method, workload, core results and the zen-engine comparison, with caveats |
| `agents.html` | the planned AI-agent integration (phase O) |
| `compare.html` | how cleanrules relates to other tools, and a FAQ |
| `404.html` | not-found page |

`assets/` holds the shared styles (`style.css`), script (`main.js`: theme,
mobile menu, tabs, copy buttons), logo and the social preview image `og.png`.
Every page shares the same header, footer and design tokens. Syntax
highlighting uses Prism 1.29.0 from cdnjs, and the fonts come from Google Fonts.

To preview it locally:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

GitHub Pages publishes the `main` branch (Settings → Pages → Deploy from a
branch → `main` / root). `.nojekyll` disables Jekyll processing.

## Where the examples come from

- Windows marked **Rust core output** were produced by running the example
  through the Rust core (`crates/core`) and its own JSON writer; the worked
  explanation example equals conformance vector
  `explain/requirements/priority-example`.
- Text renderings of `explain()` and `summary()` marked **Python reference**
  are output of the Python v1 (`rulepy`, git tag `python-reference`); the
  core's text rendering arrives with the text DSL (task D.2).
- Benchmark figures are copied from `benchmarks/results/*.json` in the code
  repository.
- Code in other languages, and anything marked **design preview**, is an API
  preview and may change.
