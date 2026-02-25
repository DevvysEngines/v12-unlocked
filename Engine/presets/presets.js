import * as system_presets from "./internal/system_presets.js";
import * as mouse from "./internal/mouse.js";
import * as effect from "./internal/effect.js";
import * as linkHitboxToRenderer from "./internal/linkHitboxToRenderer.js";
import * as scripts from "./internal/scripts/script.js";


export let presets = {
    ...system_presets
    ,...mouse
    ,...effect
    ,...linkHitboxToRenderer
    ,...scripts
}