const SHA256 = require("crypto-js/sha256");
const crypto = require("crypto");
const fs = require("fs");

const Hashes = require("./temp.json");
const Ledger = require("./ledger.json");
const IPM_Chain = require("./blockchain.json");

// Creating Block
class Block {
    constructor(blockNumber, timestamp, data, prevHash = "") {
        this.blockNumber = blockNumber;
        this.nonce = 0;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(
            this.prevHash +
                this.timestamp +
                JSON.stringify(this.data) +
                this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !==
            Array(difficulty + 1).join("0")
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

// Creating Blockchain
class Blockchain {
    constructor() {
        this.difficulty = 3;

        if (IPM_Chain.chain.length === 0) {
            IPM_Chain.chain.push(this.createGenesisBlock());
            fs.writeFileSync("./blockchain.json", JSON.stringify(IPM_Chain));
        }
    }

    createGenesisBlock() {
        return new Block(0, "12/11/2024", "Genesis Block mined by Yasin", "0");
    }

    addBlock(newBlock) {
        newBlock.prevHash = IPM_Chain.chain[IPM_Chain.chain.length - 1].hash;
        newBlock.mineBlock(this.difficulty);
        IPM_Chain.chain.push(newBlock);
        fs.writeFileSync("./blockchain.json", JSON.stringify(IPM_Chain));
    }
}

// Creating Blockchain Object
const moimo = new Blockchain();

// Management Storage
class Management {
    constructor() {}

    makeFileHash(data) {
        return crypto
            .createHash("sha256")
            .update(data)
            .digest("hex");
    }

    issueIPM(data) {
        const localHash = this.makeFileHash(data);
        if (!Hashes.hash.includes(localHash) && !Ledger.ledger.includes(localHash)) {
            Hashes.hash.push(localHash);
            fs.writeFileSync("./temp.json", JSON.stringify(Hashes));
        } else {
            console.log("\nThis Certificate is already in the blockchain or Local Storage.\nTry another certificate.\nThank you.\n");
        }
    }

    createBlock() {
        const data = [...Hashes.hash];
        Hashes.hash = [];
        fs.writeFileSync("./temp.json", JSON.stringify(Hashes));

        const alreadyInLedger = data.some(hash => Ledger.ledger.includes(hash));
        if (!alreadyInLedger) {
            Ledger.ledger.push(...data);
            fs.writeFileSync("./ledger.json", JSON.stringify(Ledger));
            moimo.addBlock(new Block(IPM_Chain.chain.length, Date.now(), data));
        }
    }

    verifyIPM(data) {
        const localHash = this.makeFileHash(data);
        if (Hashes.hash.includes(localHash) || Ledger.ledger.includes(localHash)) {
            console.log("\nThis Candidate is Valid\n");
        } else {
            console.log("\nThis Candidate is Invalid\n");
        }
    }
}

// Management Object
const mng = new Management();

const hashMaker = fs.readFileSync(`./Certificate/1-validCertificate/VC:2-1--103--Sumon.jpg`);

// mng.issueIPM(hashMaker);
// mng.createBlock();
// mng.verifyIPM(hashMaker);

console.log(IPM_Chain);
