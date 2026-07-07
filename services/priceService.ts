export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

// Fetch SOL price from CoinGecko API
export async function getSOLPrice(): Promise<TokenPrice> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true',
    );

    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if(!data.solana?.usd){
      throw new Error('Invalid response');
    }
    return {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      price: data.solana.usd,
      change24h: data.solana.usd_24h_change,
    };
  } catch (error) {
    console.error('SOL price fetch failed:', error);
    return {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      price: 0,
      change24h: 0,
    };
  }
}

// Fetch top cryptocurrency prices (BTC, ETH, SOL)
export async function getTopTokenPrices(): Promise<TokenPrice[]> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();
    return [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        price: data.ethereum.usd,
        change24h: data.ethereum.usd_24h_change,
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        price: data.solana.usd,
        change24h: data.solana.usd_24h_change,
      },
    ];
  } catch (error) {
    console.error('Top prices fetch failed:', error);
    return [];
  }
}

// Fetch extended list of token prices for market screen
export async function getMarketPrices(): Promise<TokenPrice[]> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,polkadot&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();

    const tokens = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
      { id: 'solana', symbol: 'SOL', name: 'Solana' },
      { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
      { id: 'ripple', symbol: 'XRP', name: 'XRP' },
      { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
      { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
      { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
    ];

    return tokens.map((token) => ({
      ...token,
      price: data[token.id]?.usd ?? 0,
      change24h: data[token.id]?.usd_24h_change ?? 0,
    }));
  } catch (error) {
    console.error('Market prices fetch failed:', error);
    return [];
  }
}