# LogiSync Smart Contracts Documentation

## Overview

This directory contains production-ready Solidity smart contracts for the LogiSync platform. These contracts provide on-chain functionality for supply chain tracking, escrow payments, NFT marketplace, IoT device management, customer identity, and audit logging.

**Solidity Version:** ^0.8.19  
**License:** MIT  
**Network Compatibility:** Ethereum, Polygon, BSC, Arbitrum, Optimism

---

## Table of Contents

1. [Contracts Overview](#contracts-overview)
2. [Contract Details](#contract-details)
3. [Deployment Guide](#deployment-guide)
4. [Integration with Backend](#integration-with-backend)
5. [Security Considerations](#security-considerations)
6. [Testing](#testing)
7. [Gas Optimization](#gas-optimization)

---

## Contracts Overview

| Contract | Purpose | Key Features | Lines of Code |
|----------|---------|--------------|---------------|
| **SupplyChainTracking.sol** | Immutable product movement tracking | Product registration, movement recording, warehouse authorization, authenticity verification | 300+ |
| **OrderEscrow.sol** | Secure payment escrow for orders | Automated fund release, dispute resolution, delivery confirmation, platform fees | 400+ |
| **LogiSyncNFT.sol** | ERC-1155 NFT marketplace | Multi-token standard, fungible/non-fungible tokens, royalties, listing/purchase | 600+ |
| **IoTDeviceRegistry.sol** | IoT device and sensor data registry | Device registration, batch sensor recording, alerts, data integrity verification | 450+ |
| **CustomerIdentity.sol** | Self-Sovereign Identity (SSI) & DID | Decentralized identifiers, verifiable credentials, reputation management, W3C standards | 550+ |
| **AuditLog.sol** | Immutable audit trail | Event logging, suspicious activity detection, integrity verification | 200+ |

**Total:** 2,500+ lines of production-ready Solidity code

---

## Contract Details

### 1. SupplyChainTracking.sol

**Purpose:** Provides immutable tracking of products across the entire supply chain from manufacturer to end customer.

**Key Features:**
- **Product Registration:** Register products with SKU, name, manufacturer, and manufacturing date
- **Movement Recording:** Track every product transfer with from/to addresses, locations, quantity, and notes
- **Status Management:** Lifecycle states (Manufactured → InTransit → InWarehouse → Delivered → Recalled)
- **Warehouse Authorization:** Authorize/deauthorize warehouse addresses for specific actions
- **Authenticity Verification:** Verify product authenticity by checking manufacturer on-chain
- **Movement History:** Complete audit trail of all product movements

**Data Structures:**
```solidity
struct Product {
    uint256 id;
    string sku;
    string name;
    address manufacturer;
    uint256 manufacturedDate;
    bool exists;
    ProductStatus status;
}

struct Movement {
    uint256 id;
    uint256 productId;
    address from;
    address to;
    string fromLocation;
    string toLocation;
    uint256 timestamp;
    uint256 quantity;
    MovementType movementType;
    string notes;
}

enum ProductStatus { Manufactured, InTransit, InWarehouse, Delivered, Recalled }
enum MovementType { Manufacture, Transfer, Sale, Return, Disposal }
```

**Key Functions:**
- `registerProduct()` - Register new product
- `recordMovement()` - Track product movement
- `updateProductStatus()` - Change product status
- `setWarehouseAuthorization()` - Authorize warehouse addresses
- `getProductMovementHistory()` - Retrieve complete movement trail
- `verifyProductAuthenticity()` - Verify manufacturer

**Events:**
- `ProductRegistered` - New product registered
- `ProductMoved` - Product transferred
- `ProductStatusChanged` - Status updated
- `WarehouseAuthorized` - Warehouse authorized/deauthorized

---

### 2. OrderEscrow.sol

**Purpose:** Secure escrow smart contract for order payments with automated fund release and dispute resolution.

**Key Features:**
- **Escrow Creation:** Create escrow for orders with buyer/seller/amount
- **Fund Locking:** Buyer deposits funds into escrow contract
- **Status Tracking:** Track order status (Created → Funded → InTransit → Delivered → Released)
- **Delivery Confirmation:** Seller provides delivery proof (IPFS hash or tracking)
- **Automated Release:** Auto-release funds after 7-day confirmation period
- **Dispute Resolution:** Raise and resolve disputes with owner arbitration
- **Platform Fees:** Configurable platform fee (default 2.5%)
- **Refund Mechanism:** Refund buyer before delivery or in case of cancellation

**Data Structures:**
```solidity
struct Escrow {
    uint256 id;
    uint256 orderId;
    address buyer;
    address seller;
    uint256 amount;
    uint256 createdAt;
    uint256 releasedAt;
    EscrowStatus status;
    string deliveryProof;
    bool disputeRaised;
    address disputeWinner;
}

enum EscrowStatus { Created, Funded, InTransit, Delivered, Released, Refunded, Disputed, Resolved }
```

**Key Functions:**
- `createEscrow()` - Create new escrow for order
- `fundEscrow()` - Buyer deposits funds (payable)
- `markInTransit()` - Seller marks order shipped
- `confirmDelivery()` - Seller provides delivery proof
- `releaseFunds()` - Release funds to seller (buyer or owner)
- `autoReleaseFunds()` - Auto-release after 7 days
- `refundBuyer()` - Refund buyer (owner only)
- `raiseDispute()` - Buyer or seller raises dispute
- `resolveDispute()` - Owner resolves dispute

**Events:**
- `EscrowCreated` - New escrow created
- `EscrowFunded` - Funds deposited
- `EscrowReleased` - Funds released to seller
- `EscrowRefunded` - Funds refunded to buyer
- `DeliveryConfirmed` - Delivery proof submitted
- `DisputeRaised` - Dispute initiated
- `DisputeResolved` - Dispute resolved

**Integration Note:** Integrates with `SupplyChainTracking.sol` for supply chain visibility.

---

### 3. LogiSyncNFT.sol

**Purpose:** ERC-1155 multi-token standard implementation for LogiSync marketplace supporting both fungible and non-fungible tokens.

**Key Features:**
- **ERC-1155 Compliance:** Full standard implementation (fungible + non-fungible)
- **Token Minting:** Mint new tokens with supply limits, royalties, and metadata URI
- **Additional Minting:** Mint additional supply for fungible tokens
- **Safe Transfers:** Single and batch transfer with authorization checks
- **Balance Queries:** Check balances for single or multiple accounts/tokens
- **Operator Approval:** Approve operators to manage tokens
- **Token Burning:** Burn tokens to reduce supply
- **Marketplace Integration:** List tokens for sale, purchase with royalties
- **Creator Royalties:** Configurable royalty percentage (up to 10%)
- **Platform Fees:** Configurable platform fee (default 2.5%)

**Data Structures:**
```solidity
struct Token {
    uint256 id;
    address creator;
    uint256 supply;
    uint256 maxSupply;
    bool isFungible;
    string uri;
    uint256 royaltyPercent; // Basis points (100 = 1%)
    uint256 createdAt;
    bool exists;
}

struct Listing {
    uint256 tokenId;
    address seller;
    uint256 amount;
    uint256 pricePerToken;
    uint256 listedAt;
    bool active;
}
```

**Key Functions:**
- `mint()` - Mint new tokens (fungible or non-fungible)
- `mintAdditional()` - Mint additional supply for fungible tokens
- `safeTransferFrom()` - Transfer single token type
- `safeBatchTransferFrom()` - Transfer multiple token types
- `balanceOf()` - Get balance for account/token
- `balanceOfBatch()` - Get balances for multiple accounts/tokens
- `setApprovalForAll()` - Approve operator
- `burn()` - Burn tokens
- `listForSale()` - List token for sale
- `purchase()` - Purchase listed token (payable)
- `cancelListing()` - Cancel listing

**ERC-1155 Events:**
- `TransferSingle` - Single token transfer
- `TransferBatch` - Batch token transfer
- `ApprovalForAll` - Operator approval changed
- `URI` - Token metadata URI

**Custom Events:**
- `TokenMinted` - New token created
- `TokenBurned` - Token burned
- `TokenListed` - Token listed for sale
- `TokenPurchased` - Token purchased

**Royalty Distribution:**
When a token is purchased:
1. Platform fee (2.5% default) → Platform owner
2. Creator royalty (configurable) → Token creator
3. Remaining amount → Seller

---

### 4. IoTDeviceRegistry.sol

**Purpose:** Blockchain registry for IoT devices with sensor data recording and integrity verification.

**Key Features:**
- **Device Registration:** Register IoT devices with type, location, and metadata
- **Sensor Data Recording:** Record sensor readings with cryptographic hash
- **Batch Recording:** Record multiple sensor readings in single transaction
- **Data Integrity:** SHA-256 hash verification for sensor data
- **Device Alerts:** Trigger and resolve alerts (temperature, humidity, offline, etc.)
- **User Authorization:** Multi-user access control for devices
- **Status Management:** Active/inactive device status
- **Latest Data Queries:** Retrieve most recent sensor readings

**Data Structures:**
```solidity
struct Device {
    uint256 id;
    string deviceId;
    string deviceType;
    address registeredBy;
    uint256 registeredAt;
    bool active;
    string location;
    string metadata;
    uint256 lastUpdateTime;
}

struct SensorData {
    uint256 id;
    uint256 deviceId;
    string sensorType;
    string value;
    string unit;
    uint256 timestamp;
    bytes32 dataHash;
    bool verified;
}

struct DeviceAlert {
    uint256 deviceId;
    string alertType;
    string message;
    uint256 timestamp;
    bool resolved;
}
```

**Key Functions:**
- `registerDevice()` - Register new IoT device
- `recordSensorData()` - Record single sensor reading
- `batchRecordSensorData()` - Record multiple readings
- `updateDeviceStatus()` - Change device active status
- `triggerAlert()` - Create device alert
- `resolveAlert()` - Resolve alert
- `authorizeUser()` - Grant user access to device
- `revokeUser()` - Revoke user access
- `getDeviceSensorData()` - Get all sensor data
- `getLatestSensorData()` - Get recent readings
- `verifySensorDataIntegrity()` - Verify data hash

**Events:**
- `DeviceRegistered` - New device registered
- `SensorDataRecorded` - Sensor data recorded with hash
- `DeviceStatusChanged` - Device status updated
- `AlertTriggered` - Alert created
- `AlertResolved` - Alert resolved
- `UserAuthorized` - User granted access
- `UserRevoked` - User access revoked

---

### 5. CustomerIdentity.sol

**Purpose:** Self-Sovereign Identity (SSI) and Decentralized Identifier (DID) management with W3C standards compliance.

**Key Features:**
- **Self-Sovereign Identity:** Users control their own identity data
- **DID Creation:** Generate DIDs in `did:ethr:address` format
- **Verifiable Credentials:** Issue W3C-compliant credentials with proof signatures
- **Credential Types:** KYC, ProofOfAddress, ProofOfPurchase, etc.
- **Reputation System:** Track transactions, disputes, reviews, ratings
- **Trusted Issuers:** Whitelist trusted credential issuers
- **Delegation:** Delegate identity access to other addresses
- **Credential Revocation:** Revoke credentials by issuer or owner
- **Expiration Management:** Automatic credential expiration checking

**Data Structures:**
```solidity
struct Identity {
    uint256 id;
    address owner;
    string did; // did:ethr:address
    string profileHash; // IPFS hash
    uint256 createdAt;
    uint256 updatedAt;
    bool active;
    uint256 reputationScore;
    bool verified;
}

struct VerifiableCredential {
    uint256 id;
    uint256 identityId;
    string credentialType;
    address issuer;
    string claimHash; // IPFS hash
    uint256 issuedAt;
    uint256 expiresAt;
    bool revoked;
    string proofType; // e.g., "EcdsaSecp256k1Signature2019"
    bytes signature;
}

struct Reputation {
    uint256 totalTransactions;
    uint256 successfulTransactions;
    uint256 disputes;
    uint256 resolvedDisputes;
    uint256 reviewCount;
    uint256 averageRating; // Stored as rating * 100 (450 = 4.5 stars)
}
```

**Key Functions:**
- `createIdentity()` - Create SSI with DID
- `updateIdentity()` - Update profile hash
- `issueCredential()` - Issue W3C verifiable credential
- `revokeCredential()` - Revoke credential
- `verifyIdentity()` - Mark identity as verified
- `updateReputation()` - Update reputation score and rating
- `recordDispute()` - Record dispute (reduces reputation)
- `resolveDispute()` - Resolve dispute (may restore reputation)
- `delegateAccess()` - Delegate identity access
- `revokeAccess()` - Revoke delegated access
- `getValidCredentials()` - Get non-expired, non-revoked credentials
- `verifyCredential()` - Verify credential authenticity

**Events:**
- `IdentityCreated` - New identity created
- `IdentityUpdated` - Profile updated
- `CredentialIssued` - Credential issued
- `CredentialRevoked` - Credential revoked
- `ReputationUpdated` - Reputation score changed
- `TrustedIssuerAdded` - Issuer whitelisted
- `TrustedIssuerRemoved` - Issuer removed
- `AccessDelegated` - Access delegated
- `AccessRevoked` - Access revoked

**Reputation Calculation:**
```
Reputation Score = (SuccessRate * 10) + (AverageRating * 2)
If DisputeRate > 20%: Score *= (100 - DisputeRate) / 100
```

**DID Format:** `did:ethr:0x1234567890abcdef...`

---

### 6. AuditLog.sol

**Purpose:** Immutable blockchain audit trail for all system events with cryptographic integrity and suspicious activity detection.

**Key Features:**
- **Immutable Logging:** All logs permanently stored on-chain
- **Cryptographic Integrity:** SHA-256 hash for each log entry
- **Actor Tracking:** Track all actions by address
- **Event Type Filtering:** Filter logs by event type
- **Resource Filtering:** Filter logs by resource accessed
- **Suspicious Activity Detection:** Detect high-frequency access patterns (>5 actions/minute)
- **Integrity Verification:** Verify log data has not been tampered with
- **Recent Log Queries:** Retrieve most recent audit logs

**Data Structures:**
```solidity
struct LogEntry {
    uint256 id;
    address actor;
    string eventType;
    string resource;
    string action;
    string details; // JSON string
    uint256 timestamp;
    bytes32 dataHash;
    string ipAddress;
    string userAgent;
}

enum EventType {
    UserLogin,
    UserLogout,
    DataAccess,
    DataModification,
    SystemConfiguration,
    SecurityEvent,
    Transaction,
    APICall
}
```

**Key Functions:**
- `recordLog()` - Record new audit log entry
- `getLog()` - Get log by ID
- `getLogsByActor()` - Get all logs for address
- `getLogsByEventType()` - Get logs by event type
- `getLogsByResource()` - Get logs by resource
- `getRecentLogs()` - Get N most recent logs
- `verifyLogIntegrity()` - Verify log hash integrity

**Events:**
- `LogRecorded` - New log entry created
- `SuspiciousActivityDetected` - Suspicious pattern detected

**Suspicious Activity Detection:**
- Triggers alert if >5 actions from same address within 1 minute
- Useful for detecting brute force attacks, data scraping, or bot activity

---

## Deployment Guide

### Prerequisites

1. **Install Hardhat or Truffle:**
   ```bash
   npm install --save-dev hardhat
   # OR
   npm install -g truffle
   ```

2. **Install Web3.js or Ethers.js:**
   ```bash
   npm install web3
   # OR
   npm install ethers
   ```

3. **Configure Network:**
   Create `hardhat.config.js` or `truffle-config.js` with network settings.

### Hardhat Deployment

**1. Create deployment script: `scripts/deploy-contracts.js`**

```javascript
const hre = require("hardhat");

async function main() {
  // Deploy SupplyChainTracking
  const SupplyChainTracking = await hre.ethers.getContractFactory("SupplyChainTracking");
  const supplyChain = await SupplyChainTracking.deploy();
  await supplyChain.deployed();
  console.log("SupplyChainTracking deployed to:", supplyChain.address);

  // Deploy OrderEscrow (requires SupplyChainTracking address)
  const OrderEscrow = await hre.ethers.getContractFactory("OrderEscrow");
  const orderEscrow = await OrderEscrow.deploy(supplyChain.address);
  await orderEscrow.deployed();
  console.log("OrderEscrow deployed to:", orderEscrow.address);

  // Deploy LogiSyncNFT
  const LogiSyncNFT = await hre.ethers.getContractFactory("LogiSyncNFT");
  const nft = await LogiSyncNFT.deploy();
  await nft.deployed();
  console.log("LogiSyncNFT deployed to:", nft.address);

  // Deploy IoTDeviceRegistry
  const IoTDeviceRegistry = await hre.ethers.getContractFactory("IoTDeviceRegistry");
  const iot = await IoTDeviceRegistry.deploy();
  await iot.deployed();
  console.log("IoTDeviceRegistry deployed to:", iot.address);

  // Deploy CustomerIdentity
  const CustomerIdentity = await hre.ethers.getContractFactory("CustomerIdentity");
  const identity = await CustomerIdentity.deploy();
  await identity.deployed();
  console.log("CustomerIdentity deployed to:", identity.address);

  // Deploy AuditLog
  const AuditLog = await hre.ethers.getContractFactory("AuditLog");
  const auditLog = await AuditLog.deploy();
  await auditLog.deployed();
  console.log("AuditLog deployed to:", auditLog.address);

  // Save deployed addresses
  const fs = require('fs');
  const addresses = {
    SupplyChainTracking: supplyChain.address,
    OrderEscrow: orderEscrow.address,
    LogiSyncNFT: nft.address,
    IoTDeviceRegistry: iot.address,
    CustomerIdentity: identity.address,
    AuditLog: auditLog.address
  };
  fs.writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
  console.log("Addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**2. Deploy to network:**
```bash
# Deploy to localhost
npx hardhat run scripts/deploy-contracts.js --network localhost

# Deploy to testnet (Goerli, Mumbai, etc.)
npx hardhat run scripts/deploy-contracts.js --network goerli

# Deploy to mainnet
npx hardhat run scripts/deploy-contracts.js --network mainnet
```

### Truffle Deployment

**1. Create migration: `migrations/2_deploy_contracts.js`**

```javascript
const SupplyChainTracking = artifacts.require("SupplyChainTracking");
const OrderEscrow = artifacts.require("OrderEscrow");
const LogiSyncNFT = artifacts.require("LogiSyncNFT");
const IoTDeviceRegistry = artifacts.require("IoTDeviceRegistry");
const CustomerIdentity = artifacts.require("CustomerIdentity");
const AuditLog = artifacts.require("AuditLog");

module.exports = async function (deployer) {
  // Deploy SupplyChainTracking
  await deployer.deploy(SupplyChainTracking);
  const supplyChain = await SupplyChainTracking.deployed();

  // Deploy OrderEscrow with SupplyChainTracking address
  await deployer.deploy(OrderEscrow, supplyChain.address);

  // Deploy LogiSyncNFT
  await deployer.deploy(LogiSyncNFT);

  // Deploy IoTDeviceRegistry
  await deployer.deploy(IoTDeviceRegistry);

  // Deploy CustomerIdentity
  await deployer.deploy(CustomerIdentity);

  // Deploy AuditLog
  await deployer.deploy(AuditLog);

  console.log("All contracts deployed successfully!");
};
```

**2. Deploy:**
```bash
truffle migrate --network development
truffle migrate --network goerli
truffle migrate --network mainnet
```

---

## Integration with Backend

### 1. Install Dependencies

```bash
npm install web3 ethers
```

### 2. Create Contract Service

**`backend/src/services/contracts/contractService.js`**

```javascript
const { ethers } = require('ethers');
const fs = require('fs');

class ContractService {
  constructor() {
    // Connect to Ethereum node
    this.provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

    // Load deployed addresses
    const addresses = JSON.parse(fs.readFileSync('deployed-addresses.json', 'utf8'));

    // Load contract ABIs (compile first)
    const supplyChainABI = require('../../artifacts/contracts/SupplyChainTracking.sol/SupplyChainTracking.json').abi;
    const escrowABI = require('../../artifacts/contracts/OrderEscrow.sol/OrderEscrow.json').abi;
    const nftABI = require('../../artifacts/contracts/LogiSyncNFT.sol/LogiSyncNFT.json').abi;
    const iotABI = require('../../artifacts/contracts/IoTDeviceRegistry.sol/IoTDeviceRegistry.json').abi;
    const identityABI = require('../../artifacts/contracts/CustomerIdentity.sol/CustomerIdentity.json').abi;
    const auditLogABI = require('../../artifacts/contracts/AuditLog.sol/AuditLog.json').abi;

    // Initialize contract instances
    this.supplyChain = new ethers.Contract(addresses.SupplyChainTracking, supplyChainABI, this.wallet);
    this.orderEscrow = new ethers.Contract(addresses.OrderEscrow, escrowABI, this.wallet);
    this.nft = new ethers.Contract(addresses.LogiSyncNFT, nftABI, this.wallet);
    this.iot = new ethers.Contract(addresses.IoTDeviceRegistry, iotABI, this.wallet);
    this.identity = new ethers.Contract(addresses.CustomerIdentity, identityABI, this.wallet);
    this.auditLog = new ethers.Contract(addresses.AuditLog, auditLogABI, this.wallet);
  }

  // Supply Chain
  async registerProduct(sku, name, manufacturer) {
    const tx = await this.supplyChain.registerProduct(sku, name, manufacturer);
    const receipt = await tx.wait();
    return receipt;
  }

  async trackProductMovement(productId, from, to, fromLocation, toLocation, quantity, movementType, notes) {
    const tx = await this.supplyChain.recordMovement(
      productId, from, to, fromLocation, toLocation, quantity, movementType, notes
    );
    const receipt = await tx.wait();
    return receipt;
  }

  // Order Escrow
  async createEscrow(orderId, buyer, seller, amount) {
    const tx = await this.orderEscrow.createEscrow(orderId, buyer, seller, ethers.utils.parseEther(amount.toString()));
    const receipt = await tx.wait();
    return receipt;
  }

  async fundEscrow(escrowId, amount) {
    const tx = await this.orderEscrow.fundEscrow(escrowId, { value: ethers.utils.parseEther(amount.toString()) });
    const receipt = await tx.wait();
    return receipt;
  }

  // NFT Marketplace
  async mintNFT(to, supply, maxSupply, isFungible, uri, royaltyPercent) {
    const tx = await this.nft.mint(to, supply, maxSupply, isFungible, uri, royaltyPercent);
    const receipt = await tx.wait();
    return receipt;
  }

  async listNFTForSale(tokenId, amount, pricePerToken) {
    const tx = await this.nft.listForSale(tokenId, amount, ethers.utils.parseEther(pricePerToken.toString()));
    const receipt = await tx.wait();
    return receipt;
  }

  // IoT Devices
  async registerDevice(deviceId, deviceType, location, metadata) {
    const tx = await this.iot.registerDevice(deviceId, deviceType, location, metadata);
    const receipt = await tx.wait();
    return receipt;
  }

  async recordSensorData(deviceId, sensorType, value, unit) {
    const tx = await this.iot.recordSensorData(deviceId, sensorType, value, unit);
    const receipt = await tx.wait();
    return receipt;
  }

  // Customer Identity
  async createIdentity(profileHash) {
    const tx = await this.identity.createIdentity(profileHash);
    const receipt = await tx.wait();
    return receipt;
  }

  async issueCredential(identityId, credentialType, claimHash, expiresAt, proofType, signature) {
    const tx = await this.identity.issueCredential(
      identityId, credentialType, claimHash, expiresAt, proofType, signature
    );
    const receipt = await tx.wait();
    return receipt;
  }

  // Audit Log
  async recordAuditLog(eventType, resource, action, details, ipAddress, userAgent) {
    const tx = await this.auditLog.recordLog(eventType, resource, action, details, ipAddress, userAgent);
    const receipt = await tx.wait();
    return receipt;
  }
}

module.exports = new ContractService();
```

### 3. Use in Controllers

```javascript
const contractService = require('../services/contracts/contractService');

// Example: Register product on blockchain
async function createProduct(req, res) {
  const { sku, name, manufacturer } = req.body;
  
  try {
    // Register on blockchain
    const receipt = await contractService.registerProduct(sku, name, manufacturer);
    
    // Save to database with transaction hash
    const product = await Product.create({
      sku,
      name,
      manufacturer,
      blockchainTxHash: receipt.transactionHash
    });
    
    res.json({ success: true, product, receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Security Considerations

### Access Control
- All contracts implement `onlyOwner` modifier for privileged functions
- `onlyAuthorized` modifiers for warehouse/device access
- `onlyIdentityOwnerOrDelegate` for identity management
- `onlyTrustedIssuer` for credential issuance

### Reentrancy Protection
- Follow checks-effects-interactions pattern
- State updates before external calls
- Use `transfer()` instead of `call()` for ETH transfers

### Integer Overflow/Underflow
- Solidity 0.8.19+ has built-in overflow checks
- No need for SafeMath library

### Front-Running Prevention
- Use commit-reveal schemes for sensitive operations
- Consider private transaction pools (Flashbots)

### Gas Limit Considerations
- Avoid unbounded loops
- Use pagination for large arrays
- Consider gas costs in batch operations

### Upgradability
- Current contracts are non-upgradeable
- Consider using OpenZeppelin's proxy patterns for upgradeability:
  - Transparent Proxy
  - UUPS (Universal Upgradeable Proxy Standard)

### Auditing Recommendations
1. Run static analysis tools (Slither, Mythril)
2. Conduct formal verification
3. Hire professional audit firms (ConsenSys Diligence, Trail of Bits, OpenZeppelin)
4. Implement bug bounty program

---

## Testing

### Unit Tests (Hardhat)

**`test/SupplyChainTracking.test.js`**

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChainTracking", function () {
  let supplyChain;
  let owner, manufacturer, warehouse, customer;

  beforeEach(async function () {
    [owner, manufacturer, warehouse, customer] = await ethers.getSigners();
    
    const SupplyChainTracking = await ethers.getContractFactory("SupplyChainTracking");
    supplyChain = await SupplyChainTracking.deploy();
    await supplyChain.deployed();
  });

  describe("Product Registration", function () {
    it("Should register a new product", async function () {
      await supplyChain.connect(manufacturer).registerProduct(
        "SKU001",
        "Laptop",
        manufacturer.address
      );
      
      const product = await supplyChain.getProduct(1);
      expect(product.sku).to.equal("SKU001");
      expect(product.name).to.equal("Laptop");
      expect(product.manufacturer).to.equal(manufacturer.address);
    });

    it("Should not allow duplicate SKU", async function () {
      await supplyChain.connect(manufacturer).registerProduct("SKU001", "Laptop", manufacturer.address);
      
      await expect(
        supplyChain.connect(manufacturer).registerProduct("SKU001", "Desktop", manufacturer.address)
      ).to.be.revertedWith("Product with this SKU already exists");
    });
  });

  describe("Product Movement", function () {
    beforeEach(async function () {
      await supplyChain.connect(manufacturer).registerProduct("SKU001", "Laptop", manufacturer.address);
      await supplyChain.setWarehouseAuthorization(warehouse.address, true);
    });

    it("Should record product movement", async function () {
      await supplyChain.connect(warehouse).recordMovement(
        1,
        manufacturer.address,
        warehouse.address,
        "Factory A",
        "Warehouse B",
        100,
        1, // Transfer
        "Initial shipment"
      );
      
      const movements = await supplyChain.getProductMovementHistory(1);
      expect(movements.length).to.equal(1);
      expect(movements[0].quantity).to.equal(100);
    });
  });
});
```

**Run tests:**
```bash
npx hardhat test
npx hardhat coverage
```

---

## Gas Optimization

### Optimization Techniques Used

1. **Storage Optimization:**
   - Pack structs to use fewer storage slots
   - Use `uint256` for counters (cheaper than smaller uints)
   - Store hashes instead of full data

2. **Function Optimization:**
   - Use `calldata` instead of `memory` for external functions
   - Cache storage variables in memory
   - Short-circuit conditions

3. **Loop Optimization:**
   - Avoid unbounded loops
   - Cache array length
   - Use `unchecked` blocks where safe (Solidity 0.8+)

4. **Event Optimization:**
   - Use indexed parameters for filtering
   - Emit events after all state changes

5. **Mapping vs Arrays:**
   - Use mappings for O(1) lookups
   - Arrays only when iteration needed

### Gas Costs (Approximate)

| Operation | Gas Cost |
|-----------|----------|
| Register Product | ~80,000 |
| Record Movement | ~60,000 |
| Create Escrow | ~100,000 |
| Fund Escrow | ~50,000 |
| Mint NFT | ~150,000 |
| List NFT | ~70,000 |
| Purchase NFT | ~120,000 |
| Register Device | ~90,000 |
| Record Sensor Data | ~55,000 |
| Create Identity | ~110,000 |
| Issue Credential | ~85,000 |
| Record Audit Log | ~65,000 |

---

## License

MIT License - See LICENSE file for details

---

## Support

For issues, questions, or contributions:
- GitHub Issues: [LogiSync Contracts](https://github.com/Delfi2007/log-sync)
- Documentation: See individual contract NatSpec comments
- Contact: support@logisync.com

---

**Last Updated:** 2024
**Solidity Version:** ^0.8.19
**Total Contracts:** 6
**Total Lines:** 2,500+
