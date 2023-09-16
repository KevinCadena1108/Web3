import {describe, test, expect, beforeAll, jest} from '@jest/globals'
import Block from '../src/lib/block'
import BlockInfo from '../src/lib/blockInfo'
import Transaction from '../src/lib/transaction'
import TransactionType from '../src/lib/transactionType'

jest.mock('../src/lib/transaction')

describe("Block tests", () => {

    const exampleDifficulty = 0
    const exampleMiner = "Allex"
    let Genesis : Block;

    beforeAll(() => {
        Genesis = new Block({
            transactions: [new Transaction({
                data: "Genesis block"
            } as Transaction)]
        }as Block);
    })

    test("should be valid", () => {
        const block = Block.fromBlockInfo({
            transactions: [new Transaction({
                data: "block 2"
            } as Transaction)],
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: Genesis.hash
        }as BlockInfo)
        block.mine(exampleDifficulty,exampleMiner)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })
    test("should create from blockInfo", () => {
        const block = new Block({
            index :1, 
            transactions: [new Transaction({
                data: "block 2"
            } as Transaction)],
            previousHash: Genesis.hash, 
} as Block);
        block.mine(exampleDifficulty,exampleMiner)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })
    test("should NOT be valid (fallbacks)", () => {
        const block = new Block();
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (previous hash)", () => {
        const block = new Block({
            index :1, 
            previousHash:  "abc", 
            transactions: [new Transaction({
                data: "block 2"
            } as Transaction)],
        } as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (timestamp)", () => {
        const block = new Block({
            index :1, previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                data: "block 2"
            } as Transaction)],
        } as Block);
        block.timestamp = -1;
        block.hash = block.getHash();
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (empty hash)", () => {
        const block = new Block({index :1, 
            previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                data: "block 2"
            } as Transaction)],
        } as Block);
        block.mine(exampleDifficulty,exampleMiner)
        block.hash = ""
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
    test("should NOT be valid (no mined)", () => {
        const block = new Block({index :1, 
            previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                data: "block 2"
            } as Transaction)],
        } as Block);

        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (data)", () => {
        const block = new Block({index :1, 
            previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                data: ""
            } as Transaction)],
        } as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index,exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
    
    test("should NOT be valid (index)", () => {
        const block = new Block({index :-1, 
            previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                data: "block 2"
            } as Transaction)],
        } as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index,exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid(2 fee)", () => {
        const block = Block.fromBlockInfo({
            transactions: [new Transaction({
                data: "fee1",
                type: TransactionType.FEE
            } as Transaction),
            new Transaction({
                data: "fee2",
                type: TransactionType.FEE
            } as Transaction)    
        ],
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: Genesis.hash
        }as BlockInfo)
        block.mine(exampleDifficulty,exampleMiner)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid(invalid tx)", () => {
        const block = Block.fromBlockInfo({
            transactions: [new Transaction()],
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: Genesis.hash
        }as BlockInfo)
        block.mine(exampleDifficulty,exampleMiner)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
})