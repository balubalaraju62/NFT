require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");

const app = express();
app.use(express.json());

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const abi = require("./abi.json");

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  wallet
);

app.post("/mint", async (req, res) => {
  try {
    const { walletAddress } = req.body;

    const price = await contract.mintPrice();

    const tx = await contract.mint(walletAddress, {
      value: price,
    });

    const receipt = await tx.wait();

    const event = receipt.events.find(e => e.event === "Transfer");
    const tokenId = event.args.tokenId.toString();

    res.json({
      success: true,
      txHash: tx.hash,
      tokenId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/price", async (req, res) => {
  try {
    const price = await contract.mintPrice();

    res.json({
      mintPrice: price.toString(),
      mintPriceInEth: ethers.utils.formatEther(price)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/supply", async (req, res) => {
  try {
    const total = await contract.totalSupply();
    const max = await contract.maxSupply();

    res.json({
      totalSupply: total.toString(),
      maxSupply: max.toString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/owner", async (req, res) => {
  try {
    const owner = await contract.owner();

    res.json({
      owner
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));