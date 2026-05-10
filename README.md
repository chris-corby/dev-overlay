# dev-overlay

A collection of useful web components for checking visual layout in the browser.

- [`<dev-grid>`](#dev-grid-options) – a column overlay for checking alignment
- [`<dev-baseline>`](#dev-baseline-options) – a baseline ruler for measuring vertical rhythm
- [`<dev-spacer>`](#dev-spacer-options) – a draggable, resizable measurement box

To test them out, visit the **[live demo](https://chris-corby.github.io/dev-overlay)**.

![dev-overlay screenshot](docs/preview.avif)

## Installation

### Download

Either [download a release directly](https://github.com/chris-corby/dev-overlay/releases) or install it from [npm](https://www.npmjs.com):

```bash
npm install --save-dev @chris-corby/dev-overlay
```

### Register

#### 1) Auto Method

Fastest setup. Registers all three components under their default tag names. This can be done in JavaScript _or_ in HTML.

##### a) In JavaScript

```js
import "@chris-corby/dev-overlay/auto";
//  Direct import path would be: "[PATH]/dist/auto.js";
```

##### b) In HTML

```html
<script type="module" src="[PATH]/node_modules/@chris-corby/dev-overlay/dist/auto.js"></script>
<!-- Direct src would be: "[PATH]/dist/auto.js" -->
```

#### 2) Explicit Method

Use this if you want custom tag names (for example, to avoid collisions with another library) or want to tree-shake components you don’t use.

```js
import { DevBaseline, DevGrid, DevSpacer } from "@chris-corby/dev-overlay";
//  Direct import path would be: "[PATH]/dist/index.js";

//  Default Naming
customElements.define("dev-baseline", DevBaseline);
customElements.define("dev-grid", DevGrid);
customElements.define("dev-spacer", DevSpacer);

//  Custom Naming
customElements.define("my-project-grid-overlay", DevGrid);
// ...
```

### Render

Render the elements wherever you want them available.

```html
<dev-grid></dev-grid>
<dev-baseline></dev-baseline>
<dev-spacer></dev-spacer>
```

> [!TIP]
> Consider only registering the components in your dev environment – they’re likely not needed in production.

## Usage

Components are visible on the page when they have the `active` attribute. This is toggled with keyboard shortcuts. All shortcuts must start with `Ctrl + Shift` but the letter can be changed by setting the `trigger` attribute. Here are the defaults:

| Shortcut           | Action              |
| ------------------ | ------------------- |
| `Ctrl + Shift + G` | Toggle the grid     |
| `Ctrl + Shift + B` | Toggle the baseline |
| `Ctrl + Shift + S` | Toggle the spacer   |

The following grid element would be visible on load and triggered with `Ctrl + Shift + W`:

```html
<dev-grid active trigger="w"></dev-grid>
```

The `trigger` value is case-insensitive so `trigger="w"` and `trigger="W"` are equivalent.

## Customization

Elements can be customized to fit your project with either CSS custom properties or HTML attributes. If both are present, **attributes win**.

I (_Chris_) tend to prefer CSS custom properties as they play nicely with other project variables and media queries. For example, in the example below I already have my project grid defined and it changes responsively. I set up `<dev-grid>` to match:

```css
:root {
  --columns: 4;
  --margin: 1rem;

  --dev-grid-columns: var(--columns);
  --dev-grid-margin: var(--margin);
}

@media (min-width: 800px) {
  :root {
    --columns: 12;
    --margin: 1.5rem;
  }
}
```

> [!WARNING]
> **CSS Resets** – If your project uses an aggressive CSS reset (e.g. `all: unset`), exclude the overlay elements to prevent overriding their shadow-DOM host styles: `:not(dev-grid, dev-baseline, dev-spacer)`.

### `<dev-grid>` Options

| HTML Attribute | CSS Custom Property     | Type                | Default                    | Description                                               |
| -------------- | ----------------------- | ------------------- | -------------------------- | --------------------------------------------------------- |
| `active`       | _(attribute only)_      | boolean attribute   | off                        | Reveals the element                                       |
| `columns`      | `--dev-grid-columns`    | integer             | `12`                       | Number of grid columns                                    |
| `gap`          | `--dev-grid-gap`        | `<length>`          | `1rem`                     | Gap between columns                                       |
| `margin`       | `--dev-grid-margin`     | `<length>`          | `1rem`                     | Horizontal margin outside the grid container              |
| `max-width`    | `--dev-grid-max-width`  | `<length>`          | `100rem`                   | `max-width` of the grid container. It centers beyond this |
| `color`        | `--dev-grid-color`      | `<color>`           | `hsl(240 100% 50% / 0.25)` | Column fill color                                         |
| `blend-mode`   | `--dev-grid-blend-mode` | `<blend-mode>`      | `hard-light`               | `mix-blend-mode` of the grid to aid clarity               |
| `trigger`      | _(attribute only)_      | single letter (a–z) | `g`                        | Letter key used with `Ctrl + Shift`                       |
| `z-index`      | `--dev-grid-z-index`    | integer             | `10000`                    | `z-index` stacking order                                  |

### `<dev-baseline>` Options

| HTML Attribute | CSS Custom Property      | Type                | Default                  | Description                         |
| -------------- | ------------------------ | ------------------- | ------------------------ | ----------------------------------- |
| `active`       | _(attribute only)_       | boolean attribute   | off                      | Reveals the element                 |
| `spacing`      | `--dev-baseline-spacing` | `<length>`          | `1rem`                   | Gap between lines                   |
| `color`        | `--dev-baseline-color`   | `<color>`           | `hsl(0 100% 50% / 0.25)` | Line color                          |
| `trigger`      | _(attribute only)_       | single letter (a–z) | `b`                      | Letter key used with `Ctrl + Shift` |
| `z-index`      | `--dev-baseline-z-index` | integer             | `10001`                  | `z-index` stacking order            |

### `<dev-spacer>` Options

| HTML Attribute | CSS Custom Property      | Type                | Default                 | Description                         |
| -------------- | ------------------------ | ------------------- | ----------------------- | ----------------------------------- |
| `active`       | _(attribute only)_       | boolean attribute   | off                     | Reveals the element                 |
| `width`        | `--dev-spacer-width`     | `<length>`          | `2rem`                  | Initial spacer width                |
| `height`       | `--dev-spacer-height`    | `<length>`          | `2rem`                  | Initial spacer height               |
| `color`        | `--dev-spacer-color`     | `<color>`           | `hsl(0 100% 50% / 0.5)` | Spacer fill color                   |
| `font-size`    | `--dev-spacer-font-size` | `<length>`          | `10px`                  | Font size of the measurement label  |
| `trigger`      | _(attribute only)_       | single letter (a–z) | `s`                     | Letter key used with `Ctrl + Shift` |
| `z-index`      | `--dev-spacer-z-index`   | integer             | `10002`                 | `z-index` stacking order            |

#### Interactions

| Action                            | Effect                             |
| --------------------------------- | ---------------------------------- |
| Drag                              | Move the spacer                    |
| `Shift` + drag                    | Lock movement to the dominant axis |
| Arrow keys                        | Nudge by 1px                       |
| `Shift` + arrow                   | Nudge by 10px                      |
| `Alt` + arrow                     | Resize by 1px                      |
| `Alt` + `Shift` + arrow           | Resize by 10px                     |
| `Escape`                          | Reset position and size            |
| Double-click                      | Reset position and size            |
| Native bottom-right resize handle | Resize with the browser handle     |

#### Styling the Spacer Label

The spacer’s measurement label is exposed as a shadow part, so you can customise it further with your own rules. For example:

```css
dev-spacer::part(label) {
  background-color: blue;
}
```

## Browser Support

Any evergreen browser (Chrome, Edge, Firefox, Safari). No build step or polyfills needed.

## Development

```bash
git clone https://github.com/chris-corby/dev-overlay.git
cd dev-overlay
npm install
npm run dev
npm run build
npm run typecheck
```

## Contributing

Issues and pull requests welcome — see [GitHub Issues](https://github.com/chris-corby/dev-overlay/issues).

## License

[MIT](LICENSE) © Chris Corby
