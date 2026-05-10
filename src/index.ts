import { DevBaseline } from "./DevBaseline";
import { DevGrid } from "./DevGrid";
import { DevSpacer } from "./DevSpacer";

export function defineDevOverlayElements() {
  if (!customElements.get("dev-grid")) {
    customElements.define("dev-grid", DevGrid);
  }

  if (!customElements.get("dev-spacer")) {
    customElements.define("dev-spacer", DevSpacer);
  }

  if (!customElements.get("dev-baseline")) {
    customElements.define("dev-baseline", DevBaseline);
  }
}

export { DevBaseline, DevGrid, DevSpacer };
