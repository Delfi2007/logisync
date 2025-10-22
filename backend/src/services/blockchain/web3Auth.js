/**
 * Web3 Authentication Service
 * MetaMask, WalletConnect, Sign-In with Ethereum (SIWE), Self-Sovereign Identity (SSI)
 */

const crypto = require('crypto');

class Web3AuthService {
  constructor() {
    this.nonces = new Map(); // address -> nonce
    this.sessions = new Map(); // sessionId -> user data
    this.didRegistry = new Map(); // Decentralized Identifier registry
  }

  /**
   * Generate authentication challenge (SIWE)
   * Sign-In with Ethereum standard
   */
  generateChallenge(address) {
    if (!this.isValidAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }

    const nonce = crypto.randomBytes(32).toString('hex');
    const issuedAt = new Date().toISOString();
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes
    
    // Store nonce
    this.nonces.set(address.toLowerCase(), {
      nonce,
      issuedAt,
      expirationTime
    });

    // SIWE message format
    const message = `LogiSync wants you to sign in with your Ethereum account:
${address}

Sign in to LogiSync Platform

URI: https://logisync.io
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${issuedAt}
Expiration Time: ${expirationTime}`;

    return {
      message,
      nonce,
      issuedAt,
      expirationTime,
      address: address.toLowerCase()
    };
  }

  /**
   * Verify signed message and create session
   */
  verifySignature(address, signature, message) {
    address = address.toLowerCase();
    
    // Get stored nonce
    const storedNonce = this.nonces.get(address);
    if (!storedNonce) {
      throw new Error('No challenge found for this address');
    }

    // Check expiration
    if (new Date() > new Date(storedNonce.expirationTime)) {
      this.nonces.delete(address);
      throw new Error('Challenge expired');
    }

    // Simulate signature verification (in production, use ethers.js or web3.js)
    const isValid = this.simulateSignatureVerification(message, signature, address);
    
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    // Clear nonce
    this.nonces.delete(address);

    // Create session
    const sessionId = crypto.randomBytes(32).toString('hex');
    const sessionData = {
      address,
      authenticated: true,
      method: 'siwe',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    this.sessions.set(sessionId, sessionData);

    return {
      success: true,
      sessionId,
      address,
      message: 'Successfully authenticated with Web3'
    };
  }

  /**
   * MetaMask connection
   */
  connectMetaMask(address, chainId) {
    if (!this.isValidAddress(address)) {
      throw new Error('Invalid address');
    }

    // Verify chain ID (1 = Mainnet, 5 = Goerli, etc.)
    const supportedChains = [1, 5, 137, 80001]; // Mainnet, Goerli, Polygon, Mumbai
    if (!supportedChains.includes(chainId)) {
      throw new Error('Unsupported chain');
    }

    const sessionId = crypto.randomBytes(32).toString('hex');
    this.sessions.set(sessionId, {
      address: address.toLowerCase(),
      method: 'metamask',
      chainId,
      authenticated: true,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      sessionId,
      address: address.toLowerCase(),
      chainId,
      network: this.getNetworkName(chainId)
    };
  }

  /**
   * WalletConnect integration
   */
  connectWalletConnect(uri, address) {
    if (!this.isValidAddress(address)) {
      throw new Error('Invalid address');
    }

    const sessionId = crypto.randomBytes(32).toString('hex');
    this.sessions.set(sessionId, {
      address: address.toLowerCase(),
      method: 'walletconnect',
      uri,
      authenticated: true,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      sessionId,
      address: address.toLowerCase(),
      connection_method: 'walletconnect',
      uri
    };
  }

  /**
   * Self-Sovereign Identity (SSI) - Create DID
   * Decentralized Identifiers
   */
  createDID(address, didDocument) {
    if (!this.isValidAddress(address)) {
      throw new Error('Invalid address');
    }

    const did = `did:ethr:${address.toLowerCase()}`;
    
    const document = {
      '@context': 'https://www.w3.org/ns/did/v1',
      id: did,
      controller: address.toLowerCase(),
      verificationMethod: [
        {
          id: `${did}#keys-1`,
          type: 'EcdsaSecp256k1VerificationKey2019',
          controller: did,
          publicKeyHex: this.derivePublicKey(address)
        }
      ],
      authentication: [`${did}#keys-1`],
      service: didDocument?.service || [],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };

    this.didRegistry.set(did, document);

    return {
      did,
      document,
      registered: true
    };
  }

  /**
   * Resolve DID Document
   */
  resolveDID(did) {
    const document = this.didRegistry.get(did);
    
    if (!document) {
      throw new Error('DID not found');
    }

    return {
      did,
      document,
      resolved: true
    };
  }

  /**
   * Issue Verifiable Credential
   */
  issueCredential(did, credentialData) {
    const document = this.didRegistry.get(did);
    if (!document) {
      throw new Error('DID not registered');
    }

    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.logisync.io/credentials/v1'
      ],
      id: `urn:uuid:${crypto.randomUUID()}`,
      type: ['VerifiableCredential', credentialData.type || 'CustomerCredential'],
      issuer: 'did:ethr:logisync',
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: did,
        ...credentialData.claims
      },
      proof: {
        type: 'EcdsaSecp256k1Signature2019',
        created: new Date().toISOString(),
        proofPurpose: 'assertionMethod',
        verificationMethod: 'did:ethr:logisync#keys-1',
        jws: this.generateProof(credentialData)
      }
    };

    return {
      credential,
      issued: true
    };
  }

  /**
   * Verify Verifiable Credential
   */
  verifyCredential(credential) {
    // Verify structure
    if (!credential['@context'] || !credential.credentialSubject || !credential.proof) {
      return { valid: false, reason: 'Invalid credential structure' };
    }

    // Verify proof (simplified)
    const isValid = this.verifyProof(credential.proof, credential.credentialSubject);
    
    // Check expiration if present
    if (credential.expirationDate) {
      if (new Date() > new Date(credential.expirationDate)) {
        return { valid: false, reason: 'Credential expired' };
      }
    }

    return {
      valid: isValid,
      subject: credential.credentialSubject.id,
      issuer: credential.issuer,
      issuedAt: credential.issuanceDate
    };
  }

  /**
   * Multi-sig authentication
   */
  createMultiSigAuth(addresses, threshold) {
    if (addresses.length < threshold) {
      throw new Error('Threshold cannot exceed number of addresses');
    }

    const multiSigId = crypto.randomBytes(16).toString('hex');
    const challenge = crypto.randomBytes(32).toString('hex');

    return {
      multiSigId,
      addresses: addresses.map(a => a.toLowerCase()),
      threshold,
      challenge,
      signatures: [],
      status: 'pending'
    };
  }

  /**
   * Add signature to multi-sig
   */
  addMultiSigSignature(multiSigId, address, signature, multiSigData) {
    if (!multiSigData.addresses.includes(address.toLowerCase())) {
      throw new Error('Address not part of multi-sig');
    }

    if (multiSigData.signatures.some(s => s.address === address)) {
      throw new Error('Address already signed');
    }

    multiSigData.signatures.push({
      address: address.toLowerCase(),
      signature,
      timestamp: new Date().toISOString()
    });

    const authenticated = multiSigData.signatures.length >= multiSigData.threshold;

    if (authenticated) {
      const sessionId = crypto.randomBytes(32).toString('hex');
      this.sessions.set(sessionId, {
        multiSigId,
        addresses: multiSigData.addresses,
        method: 'multisig',
        authenticated: true,
        createdAt: new Date().toISOString()
      });

      return {
        authenticated: true,
        sessionId,
        signatures: multiSigData.signatures.length,
        threshold: multiSigData.threshold
      };
    }

    return {
      authenticated: false,
      signatures: multiSigData.signatures.length,
      threshold: multiSigData.threshold,
      remaining: multiSigData.threshold - multiSigData.signatures.length
    };
  }

  /**
   * Verify session
   */
  verifySession(sessionId) {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { valid: false, reason: 'Session not found' };
    }

    // Check expiration
    if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
      this.sessions.delete(sessionId);
      return { valid: false, reason: 'Session expired' };
    }

    return {
      valid: true,
      session: {
        address: session.address,
        method: session.method,
        authenticated: session.authenticated,
        createdAt: session.createdAt
      }
    };
  }

  /**
   * Logout / Invalidate session
   */
  logout(sessionId) {
    const deleted = this.sessions.delete(sessionId);
    return {
      success: deleted,
      message: deleted ? 'Session invalidated' : 'Session not found'
    };
  }

  /**
   * Get user profile by address (blockchain-based)
   */
  getUserProfile(address) {
    address = address.toLowerCase();
    const did = `did:ethr:${address}`;
    
    // Check if DID exists
    const didDocument = this.didRegistry.get(did);

    return {
      address,
      did: didDocument ? did : null,
      has_did: !!didDocument,
      authentication_methods: this.getAuthMethods(address),
      active_sessions: this.getActiveSessions(address)
    };
  }

  // ============ Helper Methods ============

  isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  simulateSignatureVerification(message, signature, address) {
    // In production: use ethers.js verifyMessage
    // const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    // return recoveredAddress.toLowerCase() === address.toLowerCase();
    
    // Simplified simulation
    return signature && signature.length > 100;
  }

  getNetworkName(chainId) {
    const networks = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet'
    };
    return networks[chainId] || 'Unknown Network';
  }

  derivePublicKey(address) {
    // Simulate public key derivation
    return crypto.createHash('sha256').update(address).digest('hex');
  }

  generateProof(data) {
    // Simulate JWS (JSON Web Signature)
    const payload = JSON.stringify(data);
    const signature = crypto.createHash('sha256').update(payload).digest('base64');
    return `eyJhbGciOiJFUzI1NksifQ.${Buffer.from(payload).toString('base64')}.${signature}`;
  }

  verifyProof(proof, data) {
    // Simplified proof verification
    return proof.jws && proof.jws.length > 50;
  }

  getAuthMethods(address) {
    const methods = [];
    for (const [sessionId, session] of this.sessions) {
      if (session.address === address) {
        methods.push(session.method);
      }
    }
    return [...new Set(methods)];
  }

  getActiveSessions(address) {
    let count = 0;
    for (const [sessionId, session] of this.sessions) {
      if (session.address === address) {
        count++;
      }
    }
    return count;
  }
}

module.exports = new Web3AuthService();
