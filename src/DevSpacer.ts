import { DevBase } from "./DevBase";

interface DragState {
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  lockedAxis?: "x" | "y";
}

export class DevSpacer extends DevBase {
  #position = { x: 0, y: 0 };
  #size = { width: 0, height: 0 };
  #drag?: DragState;
  #resizeObserver?: ResizeObserver;

  #els: {
    label: HTMLDivElement | null;
    position: HTMLSpanElement | null;
    size: HTMLSpanElement | null;
  } = { label: null, position: null, size: null };

  //  Zone for the native resize handler in the bottom-right corner
  static readonly RESIZE_ZONE = 8;

  //  Threshold for locking the axis when dragging
  static readonly LOCK_THRESHOLD = 5;

  static observedAttributes: string[] = [
    "active",
    "width",
    "height",
    "font-size",
    "color",
    "z-index",
  ];

  constructor() {
    super("s");
  }

  connectedCallback() {
    super.connectedCallback();

    this.#render();
    this.#observeResize();

    this.addEventListener("mousedown", this.#handleMouseDown);
    this.addEventListener("dblclick", this.#reset);
    window.addEventListener("keydown", this.#handleArrowKeys);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener("mousedown", this.#handleMouseDown);
    this.removeEventListener("dblclick", this.#reset);
    window.removeEventListener("keydown", this.#handleArrowKeys);
    window.removeEventListener("mousemove", this.#handleMouseMove);
    window.removeEventListener("mouseup", this.#handleMouseUp);

    this.#resizeObserver?.disconnect();
    this.#drag = undefined;
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

    if (newValue === null) {
      this.style.removeProperty(`--dev-spacer-${name}`);
    } else {
      this.style.setProperty(`--dev-spacer-${name}`, newValue);
    }
  }

  set position({ x, y }: { x: number; y: number }) {
    //  Clamp the position to the window
    x = Math.max(0, Math.min(x, window.innerWidth - this.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - this.offsetHeight));

    if (this.#position.x === x && this.#position.y === y) return;

    this.#position = { x, y };

    this.#syncMeasurements();
  }

  set size({ width, height }: { width: number; height: number }) {
    //  Clamp the size to the window
    width = Math.max(0, Math.min(width, window.innerWidth));
    height = Math.max(0, Math.min(height, window.innerHeight));

    if (this.#size.width === width && this.#size.height === height) return;

    this.#size = { width, height };

    this.#syncMeasurements();
  }

  #syncMeasurements() {
    if (!this.active) return;

    const { x, y } = this.#position;
    const { width, height } = this.#size;

    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
    this.style.width = `${width}px`;
    this.style.height = `${height}px`;

    if (this.#els.position)
      this.#els.position.textContent = `X: ${x}\u2002Y: ${y}`;

    if (this.#els.size)
      this.#els.size.textContent = `${width} \u00d7 ${height}`;
  }

  #render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          anchor-name: --dev-spacer;

          display: none;

          position: fixed;
          z-index: var(--dev-spacer-z-index, 10002);
          top: 0;
          left: 0;
          width: var(--dev-spacer-width, 2rem);
          height: var(--dev-spacer-height, 2rem);

          background-color: var(--dev-spacer-color, hsl(0 100% 50% / 0.50));

          resize: both;
          overflow: auto;
          user-select: none;
          box-sizing: border-box;
        }

        :host([active]) {
          display: block;
        }

        /*
        Safari 26 requires an element that takes up the height for the label
        to be positioned correctly. It also needs cursor on here and not the
        :host for the resize cursor to show.
        */
        .safari-fill {
          height: 100%;
          cursor: move;
        }

        .label {
          position: fixed;
          position-anchor: --dev-spacer;
          position-area: top span-all;
          margin-block: 0.4em;
          position-try-fallbacks: flip-block;

          pointer-events: none;

          display: flex;
          flex-direction: column;

          padding-block: 0.2em;
          padding-inline: 0.6em;
          border-radius: 0.2em;

          font-family: monospace;
          font-size: var(--dev-spacer-font-size, 10px);
          line-height: 1.4;

          white-space: nowrap;
          color: light-dark(white, black);
          background: light-dark(hsl(0 0% 0% / 0.9), hsl(0 0% 100% / 0.9));
        }

        .position {
          opacity: 0.66;
        }
      </style>
      <div class="safari-fill" aria-hidden="true"></div>
      <div class="label" part="label" aria-hidden="true"><span class="position"></span><span class="size"></span></div>
    `;

    this.#els = {
      label: this.shadowRoot!.querySelector(".label"),
      position: this.shadowRoot!.querySelector(".position"),
      size: this.shadowRoot!.querySelector(".size"),
    };
  }

  #observeResize() {
    this.#resizeObserver = new ResizeObserver(() => {
      if (!this.active) return;

      this.size = { width: this.offsetWidth, height: this.offsetHeight };
      this.position = { x: this.offsetLeft, y: this.offsetTop };
    });
    this.#resizeObserver.observe(this);
  }

  #reset = () => {
    this.position = { x: 0, y: 0 };

    //  Remove width/height to go back to defaults
    this.style.width = "";
    this.style.height = "";
  };

  #handleMouseDown = (event: MouseEvent) => {
    if (!this.active) return;

    //  If this event is in the resize zone, skip
    const rect = this.getBoundingClientRect();
    const isInResizeCorner =
      rect.right - event.clientX < DevSpacer.RESIZE_ZONE &&
      rect.bottom - event.clientY < DevSpacer.RESIZE_ZONE;
    if (isInResizeCorner) return;

    event.preventDefault();

    this.#drag = {
      offsetX: event.clientX - this.offsetLeft,
      offsetY: event.clientY - this.offsetTop,
      startX: this.offsetLeft,
      startY: this.offsetTop,
      lockedAxis: undefined,
    };

    window.addEventListener("mousemove", this.#handleMouseMove);
    window.addEventListener("mouseup", this.#handleMouseUp);
  };

  #handleMouseMove = (event: MouseEvent) => {
    if (!this.#drag) return;

    //  Find the drag distance
    let x = event.clientX - this.#drag.offsetX;
    let y = event.clientY - this.#drag.offsetY;

    //  Lock the drag axis with the shift key
    if (event.shiftKey) {
      const dx = Math.abs(x - this.#drag.startX);
      const dy = Math.abs(y - this.#drag.startY);

      if (
        !this.#drag.lockedAxis &&
        (dx > DevSpacer.LOCK_THRESHOLD || dy > DevSpacer.LOCK_THRESHOLD)
      ) {
        this.#drag.lockedAxis = dx > dy ? "x" : "y";
      }

      if (this.#drag.lockedAxis === "x") y = this.#drag.startY;
      if (this.#drag.lockedAxis === "y") x = this.#drag.startX;
    } else {
      this.#drag.lockedAxis = undefined;
    }

    //  Update the position
    this.position = { x, y };
  };

  #handleMouseUp = () => {
    this.#drag = undefined;
    window.removeEventListener("mousemove", this.#handleMouseMove);
    window.removeEventListener("mouseup", this.#handleMouseUp);
  };

  #handleArrowKeys = (event: KeyboardEvent) => {
    if (!this.active) return;

    //  Esc to reset
    if (event.key === "Escape") {
      event.preventDefault();
      this.#reset();
      return;
    }

    //  Map arrow keys to x/y coordinates
    const arrows: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };

    const direction = arrows[event.key];
    if (!direction) return;

    event.preventDefault();

    //  Holding the shift key multiplies the movement by 10
    const step = event.shiftKey ? 10 : 1;
    const [dx, dy] = direction;

    //  Holding the alt key alters the width
    if (event.altKey) {
      this.size = {
        width: this.#size.width + dx * step,
        height: this.#size.height + dy * step,
      };
      return;
    }

    //  Otherwise, shift position
    this.position = {
      x: this.#position.x + dx * step,
      y: this.#position.y + dy * step,
    };
  };
}
