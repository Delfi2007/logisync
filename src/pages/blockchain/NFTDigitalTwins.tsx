import { Hexagon, Shield, Zap, TrendingUp } from 'lucide-react';

const mockNFTs = [
  {
    id: '#8472',
    product: 'Laptop Pro 15"',
    serial: 'LAPTOP-PRO-15-SN847293',
    owner: '0x7a8f...8f9a',
    value: '0.15 ETH',
    attributes: { warranty: '3 years', certified: true, origin: 'Shenzhen Factory' }
  },
  {
    id: '#9183',
    product: 'Wireless Mouse Pro',
    serial: 'MOUSE-WL-42-SN991823',
    owner: '0x8b9c...9c0d',
    value: '0.03 ETH',
    attributes: { warranty: '2 years', certified: true, origin: 'Taiwan Facility' }
  }
];

export default function NFTDigitalTwins() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
          <Hexagon className="w-8 h-8 text-fuchsia-600" />
          NFT Digital Twins
        </h1>
        <p className="text-neutral-600 mt-2">ERC-721 tokens representing physical products with smart contract warranties</p>
      </div>

      <div className="card p-6 bg-gradient-to-r from-fuchsia-50 to-pink-50 border-2 border-fuchsia-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-fuchsia-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Hexagon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900">ERC-721 NFT Standard</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Each product minted as unique NFT with embedded metadata, warranty terms, and ownership history.
              Total NFTs minted: <span className="font-bold text-fuchsia-600">3,456</span>
            </p>
            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
              <span>Standard: ERC-721</span>
              <span>Marketplace: OpenSea</span>
              <span>Royalties: 2.5%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card p-6">
          <Shield className="w-8 h-8 text-fuchsia-600 mb-3" />
          <div className="text-3xl font-bold text-neutral-900">3,456</div>
          <div className="text-sm text-neutral-600 mt-1">Active NFTs</div>
        </div>
        <div className="card p-6">
          <Zap className="w-8 h-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-neutral-900">847</div>
          <div className="text-sm text-neutral-600 mt-1">Ownership Transfers</div>
        </div>
        <div className="card p-6">
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-neutral-900">12.4 ETH</div>
          <div className="text-sm text-neutral-600 mt-1">Trading Volume</div>
        </div>
        <div className="card p-6">
          <Hexagon className="w-8 h-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-neutral-900">100%</div>
          <div className="text-sm text-neutral-600 mt-1">Authenticity Verified</div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">NFT Gallery</h2>
        <div className="grid grid-cols-2 gap-6">
          {mockNFTs.map((nft) => (
            <div key={nft.id} className="border-2 border-fuchsia-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-fuchsia-100 to-purple-100 p-8 text-center">
                <div className="text-6xl mb-4">{nft.product.includes('Laptop') ? '💻' : '🖱️'}</div>
                <div className="font-mono text-sm text-neutral-600">{nft.serial}</div>
              </div>
              <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-neutral-900">{nft.product}</div>
                  <div className="text-sm font-mono text-fuchsia-600">{nft.id}</div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Owner:</span>
                    <span className="font-mono text-neutral-900">{nft.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Value:</span>
                    <span className="font-bold text-green-600">{nft.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Warranty:</span>
                    <span className="font-medium">{nft.attributes.warranty}</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors font-medium">
                  View on OpenSea
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 bg-gradient-to-br from-pink-50 to-fuchsia-50 border-2 border-pink-100">
        <h3 className="text-lg font-bold text-neutral-900 mb-3">NFT Benefits</h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-fuchsia-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Proof of Authenticity:</span> NFT proves genuine product - eliminates counterfeits</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Smart Contract Warranty:</span> Automated claims processing based on on-chain conditions</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
            <p><span className="font-medium">Resale Market:</span> Secondary market for certified pre-owned products with full history</p>
          </div>
        </div>
      </div>
    </div>
  );
}
