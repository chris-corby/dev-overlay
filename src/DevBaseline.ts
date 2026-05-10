import { DevBase } from "./DevBase";

export class DevBaseline extends DevBase {
  static observedAttributes: string[] = [
    "active",
    "spacing",
    "color",
    "z-index",
  ];

  constructor() {
    super("b");
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
      this.style.removeProperty(`--dev-baseline-${name}`);
      return;
    }

    this.style.setProperty(`--dev-baseline-${name}`, newValue);
  }

  #render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: none;
          position: fixed;
          inset: 0;
          z-index: var(--dev-baseline-z-index, 10001);
          pointer-events: none;
          background-size:
            var(--dev-baseline-spacing, 1rem)
            var(--dev-baseline-spacing, 1rem);
          background-image: linear-gradient(
            to top,
            var(--dev-baseline-color, hsl(0 100% 50% / 0.25)) 1px,
            transparent 1px
          );
          background-repeat: repeat;
        }

        :host([active]) {
          display: block;
        }
      </style>
    `;
  }
}
