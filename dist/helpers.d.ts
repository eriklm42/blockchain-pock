import { BinaryLike } from "crypto";
export declare const hash: (data: BinaryLike) => string;
export declare const hashValidated: ({ hash, difficulty, prefix, }: {
    hash: string;
    difficulty?: number;
    prefix?: string;
}) => boolean;
