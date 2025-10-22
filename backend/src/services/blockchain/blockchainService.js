/**
 * Blockchain Integration Service
 * Simulates Ethereum smart contract interactions for product tracking
 */

const crypto = require('crypto');

class BlockchainService {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.difficulty = 2;
    this.miningReward = 100;
    this.validators = new Set();
    
    // Initialize genesis block
    this.createGenesisBlock();
  }

  /**
   * Create the first block in the chain
   */
  createGenesisBlock() {
    const genesisBlock = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0',
      hash: this.calculateHash(0, Date.now(), [], '0', 0),
      nonce: 0,
      validator: 'system'
    };
    this.chain.push(genesisBlock);
  }

  /**
   * Calculate block hash (SHA-256)
   */
  calculateHash(index, timestamp, transactions, previousHash, nonce) {
    const data = index + timestamp + JSON.stringify(transactions) + previousHash + nonce;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Get the latest block
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Create a new transaction for product tracking
   */
  createTransaction(transaction) {
    const txData = {
      ...transaction,
      txHash: this.generateTransactionHash(transaction),
      timestamp: new Date().toISOString(),
      blockNumber: null,
      confirmations: 0,
      status: 'pending'
    };
    
    this.pendingTransactions.push(txData);
    return txData;
  }

  /**
   * Generate unique transaction hash
   */
  generateTransactionHash(transaction) {
    const data = JSON.stringify(transaction) + Date.now() + Math.random();
    return '0x' + crypto.createHash('sha256').update(data).digest('hex').substring(0, 64);
  }

  /**
   * Mine pending transactions into a new block
   */
  minePendingTransactions(validator) {
    const latestBlock = this.getLatestBlock();
    const newBlock = {
      index: latestBlock.index + 1,
      timestamp: Date.now(),
      transactions: [...this.pendingTransactions],
      previousHash: latestBlock.hash,
      nonce: 0,
      validator
    };

    // Proof of Work (simplified)
    while (newBlock.hash === undefined || 
           !newBlock.hash.substring(0, this.difficulty).match(/^0+$/)) {
      newBlock.nonce++;
      newBlock.hash = this.calculateHash(
        newBlock.index,
        newBlock.timestamp,
        newBlock.transactions,
        newBlock.previousHash,
        newBlock.nonce
      );
    }

    // Update transaction status
    this.pendingTransactions.forEach(tx => {
      tx.status = 'confirmed';
      tx.blockNumber = newBlock.index;
      tx.confirmations = 1;
    });

    this.chain.push(newBlock);
    this.pendingTransactions = [];
    
    return newBlock;
  }

  /**
   * Track product movement on blockchain
   */
  trackProductMovement(productData) {
    const transaction = {
      type: 'PRODUCT_MOVEMENT',
      productId: productData.product_id,
      productName: productData.product_name,
      productSku: productData.product_sku,
      movementType: productData.type,
      quantity: productData.quantity,
      previousStock: productData.previous_stock,
      newStock: productData.new_stock,
      referenceNumber: productData.reference_number,
      warehouse: productData.warehouse,
      notes: productData.notes,
      createdBy: productData.created_by
    };

    return this.createTransaction(transaction);
  }

  /**
   * Track order on blockchain
   */
  trackOrder(orderData) {
    const transaction = {
      type: 'ORDER_LIFECYCLE',
      orderId: orderData.order_id,
      orderNumber: orderData.order_number,
      customerId: orderData.customer_id,
      status: orderData.status,
      totalAmount: orderData.total_amount,
      paymentStatus: orderData.payment_status,
      items: orderData.items || []
    };

    return this.createTransaction(transaction);
  }

  /**
   * Create smart contract for escrow
   */
  createEscrowContract(orderData) {
    const contract = {
      type: 'ESCROW_CONTRACT',
      contractId: this.generateContractId(),
      orderId: orderData.order_id,
      buyer: orderData.customer_id,
      seller: orderData.seller_id || 'logisync',
      amount: orderData.total_amount,
      status: 'locked',
      releaseConditions: {
        deliveryConfirmed: false,
        qualityApproved: false,
        timeoutDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      createdAt: new Date().toISOString()
    };

    return this.createTransaction(contract);
  }

  /**
   * Release escrow payment
   */
  releaseEscrow(contractId, conditions) {
    const transaction = {
      type: 'ESCROW_RELEASE',
      contractId,
      conditions,
      releasedAt: new Date().toISOString()
    };

    return this.createTransaction(transaction);
  }

  /**
   * Generate unique contract ID
   */
  generateContractId() {
    return 'CONTRACT-' + crypto.randomBytes(16).toString('hex').toUpperCase();
  }

  /**
   * Verify blockchain integrity
   */
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Recalculate hash
      const calculatedHash = this.calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.transactions,
        currentBlock.previousHash,
        currentBlock.nonce
      );

      if (currentBlock.hash !== calculatedHash) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get transaction by hash
   */
  getTransaction(txHash) {
    for (const block of this.chain) {
      const tx = block.transactions.find(t => t.txHash === txHash);
      if (tx) {
        return {
          ...tx,
          block: block.index,
          blockHash: block.hash,
          confirmations: this.chain.length - block.index
        };
      }
    }
    return null;
  }

  /**
   * Get all transactions for a product
   */
  getProductHistory(productId) {
    const history = [];
    for (const block of this.chain) {
      const txs = block.transactions.filter(
        t => t.productId === productId && t.type === 'PRODUCT_MOVEMENT'
      );
      history.push(...txs.map(tx => ({
        ...tx,
        blockNumber: block.index,
        blockHash: block.hash
      })));
    }
    return history;
  }

  /**
   * Get blockchain statistics
   */
  getStats() {
    const totalTransactions = this.chain.reduce(
      (sum, block) => sum + block.transactions.length,
      0
    );

    return {
      totalBlocks: this.chain.length,
      totalTransactions,
      pendingTransactions: this.pendingTransactions.length,
      validators: this.validators.size,
      avgBlockTime: this.calculateAvgBlockTime(),
      isValid: this.isChainValid()
    };
  }

  /**
   * Calculate average block time
   */
  calculateAvgBlockTime() {
    if (this.chain.length < 2) return 0;
    
    const times = [];
    for (let i = 1; i < this.chain.length; i++) {
      times.push(this.chain[i].timestamp - this.chain[i - 1].timestamp);
    }
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    return (avg / 1000).toFixed(2); // Convert to seconds
  }

  /**
   * Add validator to network
   */
  addValidator(validatorAddress) {
    this.validators.add(validatorAddress);
  }
}

module.exports = new BlockchainService();
