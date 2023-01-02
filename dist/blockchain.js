"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Blockchain_chain;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const helpers_1 = require("./helpers");
class Blockchain {
    constructor(difficulty = 4) {
        this.difficulty = difficulty;
        _Blockchain_chain.set(this, []);
        this.prefixPow = "0";
        __classPrivateFieldGet(this, _Blockchain_chain, "f").push(this.createGenesisBlock());
    }
    createGenesisBlock() {
        const payload = {
            sequence: 0,
            timestamp: Number(new Date()),
            data: "Genesis block",
            previousHash: "",
        };
        return {
            header: {
                nonce: 0,
                hashBlock: (0, helpers_1.hash)(JSON.stringify(payload)),
            },
            payload,
        };
    }
    get lastBlock() {
        return __classPrivateFieldGet(this, _Blockchain_chain, "f").at(-1);
    }
    get chain() {
        return __classPrivateFieldGet(this, _Blockchain_chain, "f");
    }
    hashLastBlock() {
        return this.lastBlock.header.hashBlock;
    }
    createBlock(data) {
        const newBlock = {
            sequence: this.lastBlock.payload.sequence + 1,
            timestamp: Number(new Date()),
            data,
            previousHash: this.hashLastBlock() + 1,
        };
        console.log(`Block #${newBlock.sequence} created: ${JSON.stringify(newBlock, null, 2)}`);
        return newBlock;
    }
    mineBlock(block) {
        let nonce = 0;
        const start = Number(new Date());
        while (true) {
            const hashBlock = (0, helpers_1.hash)(JSON.stringify(block));
            const hashPow = (0, helpers_1.hash)(hashBlock + nonce);
            if ((0, helpers_1.hashValidated)({
                hash: hashPow,
                difficulty: this.difficulty,
                prefix: this.prefixPow,
            })) {
                const finish = Number(new Date());
                const hashSmall = hashBlock.slice(0, 12);
                const timeMined = (finish - start) / 1000;
                console.log(`Block #${block.sequence} mined on ${timeMined}s.
        Hash ${hashBlock} (${nonce} tries)`);
                return {
                    minedBlock: {
                        payload: Object.assign({}, block),
                        header: {
                            nonce,
                            hashBlock,
                        },
                    },
                    minedHash: hashPow,
                    timeMined,
                    hashSmall,
                };
            }
            nonce++;
        }
    }
    verifyBlock(block) {
        const messageError = `Block #${block.payload.sequence} invalid.
    The hash is ${this.hashLastBlock()} and not ${block.payload.previousHash}`;
        if (block.payload.previousHash !== this.hashLastBlock()) {
            console.log(messageError);
            return false;
        }
        const hashToVerify = (0, helpers_1.hash)((0, helpers_1.hash)(JSON.stringify(block.payload)) + block.header.nonce);
        if (!(0, helpers_1.hashValidated)({ hash: hashToVerify, difficulty: this.difficulty, prefix: this.prefixPow })) {
            console.log(messageError);
            return false;
        }
        return true;
    }
    sendBlock(block) {
        if (this.verifyBlock(block))
            __classPrivateFieldGet(this, _Blockchain_chain, "f").push(block);
        return __classPrivateFieldGet(this, _Blockchain_chain, "f");
    }
}
exports.Blockchain = Blockchain;
_Blockchain_chain = new WeakMap();
//# sourceMappingURL=blockchain.js.map