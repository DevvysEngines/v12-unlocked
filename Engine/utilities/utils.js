import * as math from "./internal/math.js";
import * as camera from "./internal/camera.js";
import * as paths from "./internal/paths.js";
import * as render from "./internal/render.js";

export const utils = {
    ...math,
    ...render,
    ...camera,
    ...paths
};
