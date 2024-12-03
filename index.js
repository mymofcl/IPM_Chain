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

        // console.log("Block Mined :: " + this.hash);
    }
}

// Creating Blockchain
class Blockchain {
    constructor() {
        this.difficulty = 3;

        if (IPM_Chain.chain.length == 0) {
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
        return newBlock;
    }
}

// creating Blockchain Object
const moimo = new Blockchain();

// Management Storage
class management {
    constructor() {}
    makeFileHash(data) {
        const hash = crypto
            .createHash("sha256")
            .update(data)
            .digest("hex")
            .toString();

        return hash;
    }

    issue_IPM(data) {
        const localHash = this.makeFileHash(data);
        var i = 0,
            j = 0;
        var flagHash = false;
        var flagLedger = false;
        while (i < Hashes.hash.length) {
            if (localHash == Hashes.hash[i]) {
                flagHash = true;
            }
            i++;
        }

        while (j < Ledger.ledger.length) {
            if (localHash == Ledger.ledger[j]) {
                flagLedger = true;
            }
            j++;
        }
        if (flagHash === false && flagLedger === false) {
            Hashes.hash.push(localHash);
            fs.writeFileSync("./temp.json", JSON.stringify(Hashes));
        } else {
            console.log(
                "\nThis Certificate is already exist in the blockchain or Local Storage.\nTry Another Certificate\nThank You\n\n\n"
            );
        }
    }
    createBlock() {
        var limitHash = Hashes.hash.length;
        var limitLedger = Ledger.ledger.length;
        var maxLimit = limitHash + limitLedger;
        var flag = false;
        var data = [];

        for (var i = 0; i < limitHash; i++) {
            data.push(Hashes.hash[i]);
        }
        for (var i = 0; i < limitHash; i++) {
            Hashes.hash.pop();
        }
        fs.writeFileSync("./temp.json", JSON.stringify(Hashes));

        for (var m = 0; m < limitHash; m++) {
            for (var n = 0; n < limitLedger; n++) {
                if (data[m] == Ledger.ledger[n]) {
                    flag = true;
                }
            }
        }

        if (flag === false) {
            for (var i = 0; i < limitHash; i++) {
                Ledger.ledger.push(data[i]);
            }

            fs.writeFileSync("./ledger.json", JSON.stringify(Ledger));

            IPM_Chain.chain.push(
                moimo.addBlock(
                    new Block(IPM_Chain.chain.length, Date.now(), data)
                )
            );
            fs.writeFileSync("./blockchain.json", JSON.stringify(IPM_Chain));
        }
    }
    verify_IPM(data) {
        const localHash = this.makeFileHash(data);
        var i = 0,
            j = 0;
        var flagHash = false;
        var flagLedger = false;
        while (i < Hashes.hash.length) {
            if (localHash == Hashes.hash[i]) {
                flagHash = true;
            }
            i++;
        }
        while (j < Ledger.ledger.length) {
            if (localHash == Ledger.ledger[j]) {
                flagLedger = true;
            }
            j++;
        }
        if (flagHash === true || flagLedger === true) {
            console.log("\nThis Candidate is Valid\n");
        } else {
            console.log("\nThis Candidate is Invalid\n");
        }
    }
}

//Management Object
const mng = new management();

const hashMaker = fs.readFileSync(
    `./Certificate/1-validCertificate/VC:2-1--103--Sumon.jpg`
);

// mng.issue_IPM(hashMaker);
// mng.createBlock();
// mng.verify_IPM(hashMaker);    `

console.log(IPM_Chain);
