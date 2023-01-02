import { Blockchain } from "./blockchain";

const difficulty = Number(process.argv[2] || 4);
const blockchain = new Blockchain(difficulty);

const numberBlocks = Number(process.argv[3] || 10);
let chain = blockchain.chain;

for (let i = 0; i < numberBlocks; i++) {
  const block = blockchain.createBlock(`Block ${i}`);
  const mineInfo = blockchain.mineBlock(block);
  chain = blockchain.sendBlock(mineInfo.minedBlock);
}

console.log(chain);
