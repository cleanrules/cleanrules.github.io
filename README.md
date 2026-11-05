# cleanrules.github.io

Source of <https://cleanrules.github.io>, the website of
[cleanrules](https://github.com/cleanrules/cleanrules): an explainable rules engine with one
Rust core and bindings for Rust, C/C++, Python, JavaScript, Java/Scala, Go and Erlang.

A static site with no build step. Pages:

| Page | Contents |
|---|---|
| `index.html` | overview, start here, status, explanation demo, languages, roadmap, citation, author |
| `manual/` | the manual: 17 chapters (introduction, installation, quick start, conditions, rules and actions, hit policies, evaluating data, explanations, summaries, errors, JSON, Python pitfalls, performance, and the Python, Rust, JavaScript and C++ API references) |
| `examples/` | eight worked examples, each in Python, Rust, TypeScript, JSON, C and C++, with previews of four planned languages |
| `guide.html` | concepts: conditions as data, nodes, Kleene logic, reasons, strict mode, rules, hit policies, explanations, counterfactuals, summaries |
| `format.html` | the JSON format v1: values, conditions, rules, decisions read back and verified, limits, error codes, schemas |
| `benchmarks.html` | method, workload, core results and the zen-engine comparison, with caveats |
| `agents.html` | the planned AI-agent integration (phase O) |
| `compare.html` | how cleanrules relates to other tools, and a FAQ |
| `about.html` | the author, principles, citation and sources |
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
- Text renderings of `explain()` and `summary()` marked **real output** were
  printed by the Python binding: the core writes the same text in every
  language.
- Benchmark figures are copied from `benchmarks/results/*.json` in the code
  repository.
- Python code on the manual and example pages was run with the Python binding
  built from the code repository, cell by cell, and its output pasted as printed.
  Rust programs were compiled against `crates/core` and run, and C programs
  against the C ABI (`crates/ffi`, its header and static library), next to the
  example's JSON rule set.
- TypeScript programs (the overview, every worked example, the errors chapter
  and the JavaScript API page) were run with Node 26 on the JavaScript binding
  built from the repository (`bindings/js`, commit `01ea4a4`), as TypeScript
  (Node strips the types; `tsc` checked them), on the native addon; the
  WebAssembly build printed the same. Their output is pasted as printed.
- C++ programs were compiled as C++17 against `cleanrules.hpp` and the C
  library, built and installed with CMake from `bindings/cpp` at the same
  commit and found with `find_package(cleanrules)`, and run; their output is
  pasted as printed. They write the rules in the rule syntax.
- For each worked example, the Python rules, the Rust rules and the JSON rule set
  were checked to be the same document, and Python's decision, explanation and
  summary documents equal the core's. The TypeScript rule set (through `dumps`)
  and the C++ rule set (through `write()`) were checked to be that document
  too, and their decision, explanation (JSON and text) and summary to equal the
  core's.
- Code in Java, Scala, Go and Erlang, and anything marked **design preview**,
  is an API preview of a binding that does not exist yet.
