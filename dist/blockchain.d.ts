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
export declare class Blockchain {
    #private;
    private readonly difficulty;
    private prefixPow;
    constructor(difficulty?: number);
    private createGenesisBlock;
    private get lastBlock();
    get chain(): Block[];
    private hashLastBlock;
    createBlock(data: any): Block["payload"];
    mineBlock(block: Block["payload"]): {
        minedBlock: {
            payload: {
                sequence: number;
                timestamp: number;
                data: any;
                previousHash: string;
            };
            header: {
                nonce: number;
                hashBlock: string;
            };
        };
        minedHash: string;
        timeMined: number;
        hashSmall: string;
    };
    private verifyBlock;
    sendBlock(block: Block): Block[];
}
