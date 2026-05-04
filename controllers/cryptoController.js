const axios = require("axios");
const Crypto = require("../models/Crypto");

async function fetchCoinGeckoMarkets() {
  const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 15,
      page: 1,
    },
  });

  return response.data;
}

exports.getAllCrypto = async (_req, res) => {
  try {
    const [marketCoins, customCoins] = await Promise.all([
      fetchCoinGeckoMarkets(),
      Crypto.find().sort({ createdAt: -1 }).lean(),
    ]);

    const normalizedCustomCoins = customCoins.map((coin) => ({
      id: coin._id.toString(),
      name: coin.name,
      symbol: coin.symbol.toLowerCase(),
      image: coin.image,
      current_price: coin.price,
      price_change_percentage_24h: coin.change24h,
      source: "custom",
      createdAt: coin.createdAt,
    }));

    return res.json([...normalizedCustomCoins, ...marketCoins]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching crypto data" });
  }
};

exports.getTopGainers = async (_req, res) => {
  try {
    const marketCoins = await fetchCoinGeckoMarkets();
    const sorted = marketCoins.sort(
      (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    );

    return res.json(sorted.slice(0, 10));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching gainers" });
  }
};

exports.getNewListings = async (_req, res) => {
  try {
    const latestCustomCoins = await Crypto.find().sort({ createdAt: -1 }).limit(10).lean();

    return res.json(
      latestCustomCoins.map((coin) => ({
        id: coin._id.toString(),
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        price: coin.price,
        change24h: coin.change24h,
        createdAt: coin.createdAt,
      }))
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching new coins" });
  }
};

exports.createCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;

    if (!name || !symbol || price === undefined || change24h === undefined) {
      return res.status(400).json({
        message: "name, symbol, price, and change24h are required",
      });
    }

    const newCoin = await Crypto.create({
      name: String(name).trim(),
      symbol: String(symbol).trim(),
      price: Number(price),
      image: image ? String(image).trim() : "",
      change24h: Number(change24h),
    });

    return res.status(201).json({
      message: "Cryptocurrency created successfully",
      crypto: newCoin,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating cryptocurrency" });
  }
};
