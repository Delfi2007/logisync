/**
 * NFT Service - ERC-1155 Multi-Token Standard
 * Supports both fungible and non-fungible tokens on marketplace
 */

const crypto = require('crypto');
const blockchainService = require('./blockchainService');

class NFTService {
  constructor() {
    this.tokens = new Map(); // tokenId -> token data
    this.balances = new Map(); // address -> tokenId -> balance
    this.metadata = new Map(); // tokenId -> metadata URI
    this.operators = new Map(); // owner -> operator -> approved
    this.totalSupply = new Map(); // tokenId -> total supply
  }

  /**
   * Mint new NFT (ERC-1155)
   * Can create both fungible and non-fungible tokens
   */
  mintNFT(to, tokenData) {
    const tokenId = this.generateTokenId();
    const { amount = 1, uri, isFungible = false, royaltyPercentage = 2.5 } = tokenData;

    // Create token
    const token = {
      id: tokenId,
      creator: to,
      created_at: new Date().toISOString(),
      is_fungible: isFungible,
      total_supply: amount,
      royalty_percentage: royaltyPercentage,
      metadata: {
        name: tokenData.name,
        description: tokenData.description,
        image: tokenData.image,
        properties: tokenData.properties || {}
      }
    };

    this.tokens.set(tokenId, token);
    this.metadata.set(tokenId, uri);
    this.totalSupply.set(tokenId, amount);
    
    // Update balance
    this.updateBalance(to, tokenId, amount);

    // Record on blockchain
    const txHash = blockchainService.createTransaction({
      type: 'nft_mint',
      from: '0x0',
      to,
      token_id: tokenId,
      amount,
      timestamp: Date.now()
    });

    return {
      token_id: tokenId,
      transaction_hash: txHash,
      owner: to,
      amount,
      metadata: token.metadata,
      contract_standard: 'ERC-1155'
    };
  }

  /**
   * Transfer tokens (both fungible and non-fungible)
   */
  safeTransferFrom(from, to, tokenId, amount = 1, data = {}) {
    // Validate ownership
    const fromBalance = this.getBalance(from, tokenId);
    if (fromBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Update balances
    this.updateBalance(from, tokenId, -amount);
    this.updateBalance(to, tokenId, amount);

    // Calculate royalty
    const token = this.tokens.get(tokenId);
    const royaltyAmount = data.price ? (data.price * token.royalty_percentage / 100) : 0;

    // Record on blockchain
    const txHash = blockchainService.createTransaction({
      type: 'nft_transfer',
      from,
      to,
      token_id: tokenId,
      amount,
      price: data.price || 0,
      royalty_amount: royaltyAmount,
      royalty_recipient: token.creator,
      timestamp: Date.now()
    });

    return {
      transaction_hash: txHash,
      from,
      to,
      token_id: tokenId,
      amount,
      royalty_paid: royaltyAmount,
      status: 'completed'
    };
  }

  /**
   * Batch transfer multiple token types
   */
  safeBatchTransferFrom(from, to, tokenIds, amounts, data = {}) {
    if (tokenIds.length !== amounts.length) {
      throw new Error('TokenIds and amounts length mismatch');
    }

    const transfers = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const result = this.safeTransferFrom(from, to, tokenIds[i], amounts[i], data);
      transfers.push(result);
    }

    return {
      batch_transfer: true,
      transfers,
      total_tokens: tokenIds.length
    };
  }

  /**
   * Get token balance
   */
  balanceOf(account, tokenId) {
    return this.getBalance(account, tokenId);
  }

  /**
   * Get multiple token balances
   */
  balanceOfBatch(accounts, tokenIds) {
    if (accounts.length !== tokenIds.length) {
      throw new Error('Accounts and tokenIds length mismatch');
    }

    return accounts.map((account, i) => ({
      account,
      token_id: tokenIds[i],
      balance: this.getBalance(account, tokenIds[i])
    }));
  }

  /**
   * Approve operator to manage all tokens
   */
  setApprovalForAll(owner, operator, approved) {
    if (!this.operators.has(owner)) {
      this.operators.set(owner, new Map());
    }
    this.operators.get(owner).set(operator, approved);

    return {
      owner,
      operator,
      approved,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check if operator is approved
   */
  isApprovedForAll(owner, operator) {
    return this.operators.get(owner)?.get(operator) || false;
  }

  /**
   * Burn tokens
   */
  burn(account, tokenId, amount) {
    const balance = this.getBalance(account, tokenId);
    if (balance < amount) {
      throw new Error('Insufficient balance to burn');
    }

    this.updateBalance(account, tokenId, -amount);
    
    const currentSupply = this.totalSupply.get(tokenId);
    this.totalSupply.set(tokenId, currentSupply - amount);

    // Record on blockchain
    const txHash = blockchainService.createTransaction({
      type: 'nft_burn',
      from: account,
      to: '0x0',
      token_id: tokenId,
      amount,
      timestamp: Date.now()
    });

    return {
      transaction_hash: txHash,
      account,
      token_id: tokenId,
      amount_burned: amount,
      remaining_supply: this.totalSupply.get(tokenId)
    };
  }

  /**
   * Get token metadata URI
   */
  uri(tokenId) {
    return this.metadata.get(tokenId) || `https://api.logisync.io/metadata/${tokenId}`;
  }

  /**
   * Get complete token information
   */
  getTokenInfo(tokenId) {
    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error('Token not found');
    }

    return {
      token_id: tokenId,
      creator: token.creator,
      created_at: token.created_at,
      is_fungible: token.is_fungible,
      total_supply: this.totalSupply.get(tokenId),
      royalty_percentage: token.royalty_percentage,
      metadata: token.metadata,
      metadata_uri: this.uri(tokenId),
      contract_standard: 'ERC-1155'
    };
  }

  /**
   * Get all tokens owned by address
   */
  getOwnedTokens(address) {
    const owned = [];
    
    if (this.balances.has(address)) {
      const userBalances = this.balances.get(address);
      userBalances.forEach((balance, tokenId) => {
        if (balance > 0) {
          const token = this.tokens.get(tokenId);
          owned.push({
            token_id: tokenId,
            balance,
            metadata: token.metadata,
            is_fungible: token.is_fungible
          });
        }
      });
    }
    
    return owned;
  }

  /**
   * List token for sale on marketplace
   */
  listForSale(tokenId, seller, price, amount = 1) {
    const balance = this.getBalance(seller, tokenId);
    if (balance < amount) {
      throw new Error('Insufficient token balance');
    }

    const listing = {
      listing_id: this.generateListingId(),
      token_id: tokenId,
      seller,
      price,
      amount,
      listed_at: new Date().toISOString(),
      status: 'active'
    };

    // Record on blockchain
    const txHash = blockchainService.createTransaction({
      type: 'nft_list',
      seller,
      token_id: tokenId,
      price,
      amount,
      timestamp: Date.now()
    });

    return {
      ...listing,
      transaction_hash: txHash
    };
  }

  /**
   * Purchase listed token
   */
  purchase(listingId, buyer, listing) {
    const { token_id, seller, price, amount } = listing;

    // Transfer token
    const transfer = this.safeTransferFrom(seller, buyer, token_id, amount, { price });

    // Calculate fees
    const platformFee = price * 0.025; // 2.5% platform fee
    const sellerReceives = price - platformFee - transfer.royalty_paid;

    return {
      listing_id: listingId,
      transaction_hash: transfer.transaction_hash,
      buyer,
      seller,
      token_id,
      amount,
      price,
      platform_fee: platformFee,
      royalty_paid: transfer.royalty_paid,
      seller_receives: sellerReceives,
      status: 'completed'
    };
  }

  /**
   * Get token transaction history
   */
  getTokenHistory(tokenId) {
    const history = blockchainService.getTransactionHistory();
    return history.filter(tx => tx.token_id === tokenId)
      .map(tx => ({
        transaction_hash: tx.hash,
        type: tx.type,
        from: tx.from,
        to: tx.to,
        amount: tx.amount,
        price: tx.price,
        timestamp: new Date(tx.timestamp).toISOString()
      }));
  }

  // ============ Helper Methods ============

  generateTokenId() {
    return '0x' + crypto.randomBytes(32).toString('hex');
  }

  generateListingId() {
    return crypto.randomBytes(16).toString('hex');
  }

  getBalance(account, tokenId) {
    if (!this.balances.has(account)) {
      return 0;
    }
    return this.balances.get(account).get(tokenId) || 0;
  }

  updateBalance(account, tokenId, amount) {
    if (!this.balances.has(account)) {
      this.balances.set(account, new Map());
    }
    
    const currentBalance = this.getBalance(account, tokenId);
    const newBalance = currentBalance + amount;
    
    if (newBalance < 0) {
      throw new Error('Balance cannot be negative');
    }
    
    this.balances.get(account).set(tokenId, newBalance);
  }

  /**
   * Verify NFT authenticity
   */
  verifyAuthenticity(tokenId, expectedCreator) {
    const token = this.tokens.get(tokenId);
    if (!token) {
      return { valid: false, reason: 'Token does not exist' };
    }

    const blockchainHistory = this.getTokenHistory(tokenId);
    const firstMint = blockchainHistory.find(tx => tx.type === 'nft_mint');

    return {
      valid: token.creator === expectedCreator,
      token_id: tokenId,
      creator: token.creator,
      verified_on_chain: firstMint !== undefined,
      total_transactions: blockchainHistory.length
    };
  }
}

module.exports = new NFTService();
