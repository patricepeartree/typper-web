const path = require("path");

const ALIASES = [
    { key: "@custom-hooks", path: "./src/custom-hooks/" },
    { key: "@assets", path: "./src/assets/" },
    { key: "@game", path: "./src/game/" }
];

module.exports = function override(config, env) {
    ALIASES.forEach((alias) => {
        config.resolve.alias[alias.key] = path.resolve(__dirname, alias.path);
    });
    return config;
}
