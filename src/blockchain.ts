import { hash, hashValidated } from "./helpers";

export interface Block {
  header: {
    nonce: number;
    hashBlock: string;
  };
  payload: {
    sequence: number;
    timestamp: number;
    data: any;
    previousHash: string;
  };
}

export class Blockchain {
  #chain: Block[] = [];
  private prefixPow = "0";

  constructor(private readonly difficulty: number = 4) {
    this.#chain.push(this.createGenesisBlock());
  }

  private createGenesisBlock(): Block {
    const payload: Block["payload"] = {
      sequence: 0,
      timestamp: Number(new Date()),
      data: "Genesis block",
      previousHash: "",
    };

    return {
      header: {
        nonce: 0,
        hashBlock: hash(JSON.stringify(payload)),
      },
      payload,
    };
  }
  private get lastBlock(): Block {
    return this.#chain.at(-1);
  }

  public get chain(): Block[] {
    return this.#chain;
  }

  private hashLastBlock(): string {
    return this.lastBlock.header.hashBlock;
  }

  public createBlock(data): Block["payload"] {
    const newBlock: Block["payload"] = {
      sequence: this.lastBlock.payload.sequence + 1,
      timestamp: Number(new Date()),
      data,
      previousHash: this.hashLastBlock(),
    };

    console.log(`Block #${newBlock.sequence} created: ${JSON.stringify(newBlock, null, 2)}`);
    return newBlock;
  }

  public mineBlock(block: Block["payload"]) {
    let nonce = 0;
    const start = Number(new Date());

    while (true) {
      const hashBlock: string = hash(JSON.stringify(block));
      const hashPow: string = hash(hashBlock + nonce);

      if (
        hashValidated({
          hash: hashPow,
          difficulty: this.difficulty,
          prefix: this.prefixPow,
        })
      ) {
        const finish = Number(new Date());
        const hashSmall = hashBlock.slice(0, 12);
        const timeMined = (finish - start) / 1000;

        console.log(`Block #${block.sequence} mined on ${timeMined}s.
        Hash ${hashBlock} (${nonce} tries)`);

        return {
          minedBlock: {
            payload: { ...block },
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

  private verifyBlock(block: Block): boolean {
    const messageError = `Block #${block.payload.sequence} invalid.
    The hash is ${this.hashLastBlock()} and not ${block.payload.previousHash}`;

    if (block.payload.previousHash !== this.hashLastBlock()) {
      console.log(messageError);

      return false;
    }

    const hashToVerify = hash(hash(JSON.stringify(block.payload)) + block.header.nonce);
    if (!hashValidated({ hash: hashToVerify, difficulty: this.difficulty, prefix: this.prefixPow })) {
      console.log(messageError);
      return false;
    }

    return true;
  }

  public sendBlock(block: Block): Block[] {
    if (this.verifyBlock(block)) this.#chain.push(block);

    return this.#chain;
  }
}
