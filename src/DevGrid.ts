import { DevBase } from "./DevBase";

export class DevGrid extends DevBase {
  static observedAttributes: string[] = [
    "active",
    "columns",
    "gap",
    "margin",
    "max-width",
    "color",
    "blend-mode",
    "z-index",
  ];

  constructor() {
    super("g");
  }

  connectedCallback() {
    super.connectedCallback();

    this.#render();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null,
  ) {
    //  Keep active state in sync
    if (name === "active") {
      this.active = newValue !== null;
      return;
    }

    //  Reflect attributes into CSS custom properties
    if (newValue === null) {
      this.style.removeProperty(`--dev-grid-${name}`);
      return;
    }

    this.style.setProperty(`--dev-grid-${name}`, newValue);
  }

  #render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: none;
          position: fixed;
          inset: 0;
          z-index: var(--dev-grid-z-index, 10000);
          pointer-events: none;
          mix-blend-mode: var(--dev-grid-blend-mode, hard-light);
        }

        :host([active]) {
          display: block;
        }

        .inner {
          --columns: var(--dev-grid-columns, 12);
          --gap: var(--dev-grid-gap, 1rem);
          --color: var(--dev-grid-color, hsl(240 100% 50% / 0.25));

          --one-column: calc((100% - (var(--columns) - 1) * var(--gap)) / var(--columns));
          --space: calc((100% + var(--gap)) / var(--columns));

          width: 100%;
          height: 100%;
          max-width: var(--dev-grid-max-width, 100rem);
          margin-inline: auto;
          padding-inline: var(--dev-grid-margin, 1rem);
          box-sizing: border-box;

          background-image: repeating-linear-gradient(
            to right,
            var(--color) 0,
            var(--color) var(--one-column),
            transparent var(--one-column),
            transparent var(--space)
          );
          background-origin: content-box;
          background-clip: content-box;
          background-repeat: no-repeat;
        }
      </style>
      <div class="inner"></div>
    `;
  }
}
