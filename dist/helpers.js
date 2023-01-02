"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashValidated = exports.hash = void 0;
const crypto_1 = require("crypto");
const hash = (data) => (0, crypto_1.createHash)("sha256").update(JSON.stringify(data)).digest("hex");
exports.hash = hash;
const hashValidated = ({ hash, difficulty = 4, prefix = "0", }) => {
    const valid = prefix.repeat(difficulty);
    return hash.startsWith(valid);
};
exports.hashValidated = hashValidated;
//# sourceMappingURL=helpers.js.map