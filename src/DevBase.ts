export abstract class DevBase extends HTMLElement {
  #active: boolean = false;
  #defaultTriggerKey: string;

  constructor(defaultTriggerKey: string) {
    super();
    this.attachShadow({ mode: "open" });
    this.#active = this.hasAttribute("active");
    this.#defaultTriggerKey = defaultTriggerKey;
  }

  protected get active(): boolean {
    return this.#active;
  }

  protected set active(val: boolean) {
    this.#active = val;
  }

  connectedCallback() {
    window.addEventListener("keydown", this.#handleKeydown);
  }

  disconnectedCallback() {
    window.removeEventListener("keydown", this.#handleKeydown);
  }

  #handleKeydown = (event: KeyboardEvent) => {
    //  Ctrl + Shift must be pressed
    if (!event.ctrlKey || !event.shiftKey) return;

    const triggerKey = this.getAttribute("trigger") ?? this.#defaultTriggerKey;
    if (event.key.toLowerCase() !== triggerKey.toLowerCase()) return;

    event.preventDefault();
    this.toggleAttribute("active");
  };
}
