const axios = require('axios');

// Replace with your SteamID64
const steamId = '76561198073279717';

// Replace with the AppID of the game (e.g., 730 for CS:GO)
const appId = 753;
// const appId = 238460;
// Context ID (usually '2' for most games)
const contextId = 6;
// const contextId = 2;

// Function to fetch the user's Steam inventory
async function fetchInventory(steamId, appId, contextId) {
  const inventoryUrl = `https://steamcommunity.com/inventory/${steamId}/${appId}/${contextId}?l=english&count=5000`;

  try {
    const response = await axios.get(inventoryUrl);
    const data = response.data;

    if (data.success) {
      return data.descriptions;
    } else {
      throw new Error('Failed to fetch inventory.');
    }
  } catch (error) {
    console.error('Error fetching inventory:', error.message);
    return null;
  }
}

// Function to generate the multi-sell URL
function generateMultiSellUrl(appId, contextId, sellableItems) {
  const baseUrl = 'https://steamcommunity.com/market/multisell';
  const url = new URL(baseUrl);
  url.searchParams.append('appid', appId);
  url.searchParams.append('contextid', contextId);

  sellableItems.forEach(item => {
    url.searchParams.append('items[]', item.market_hash_name);
  });

  return url.toString();
}

// Main function to execute the script
(async () => {
  const inventory = await fetchInventory(steamId, appId, contextId);

  if (inventory) {
    // Filter sellable (marketable) items
    const sellableItems = Object.values(inventory).filter(item => item.marketable);

    if (sellableItems.length > 0) {
      const multiSellUrl = generateMultiSellUrl(appId, contextId, sellableItems);
      console.log(multiSellUrl);
    } else {
      console.log('No sellable items found in your inventory.');
    }
  }
})();
