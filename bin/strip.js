import strip from "../src/utils/strip.js";
import config from "../src/config.json" assert { type: "json" };

strip(config.folders.src, config.folders.dest);
