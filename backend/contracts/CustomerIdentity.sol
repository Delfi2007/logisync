// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CustomerIdentity
 * @dev Self-Sovereign Identity (SSI) and Decentralized Identifier (DID) management
 * @notice Manages customer identities, verifiable credentials, and reputation
 */
contract CustomerIdentity {
    
    // State variables
    address public owner;
    uint256 public identityCount;
    uint256 public credentialCount;
    
    // Structs
    struct Identity {
        uint256 id;
        address owner;
        string did; // Decentralized Identifier (did:ethr:address)
        string profileHash; // IPFS hash of profile data
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
        string claimHash; // IPFS hash of credential claim
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
        uint256 averageRating; // Stored as rating * 100 (e.g., 450 = 4.5 stars)
    }
    
    // Mappings
    mapping(uint256 => Identity) public identities;
    mapping(address => uint256) public addressToIdentity;
    mapping(string => uint256) public didToIdentity;
    mapping(uint256 => VerifiableCredential[]) public identityCredentials;
    mapping(uint256 => Reputation) public identityReputation;
    mapping(address => bool) public trustedIssuers;
    mapping(uint256 => mapping(address => bool)) public delegatedAccess;
    
    // Events
    event IdentityCreated(
        uint256 indexed identityId,
        address indexed owner,
        string did,
        uint256 timestamp
    );
    
    event IdentityUpdated(
        uint256 indexed identityId,
        string profileHash,
        uint256 timestamp
    );
    
    event CredentialIssued(
        uint256 indexed credentialId,
        uint256 indexed identityId,
        address indexed issuer,
        string credentialType,
        uint256 timestamp
    );
    
    event CredentialRevoked(
        uint256 indexed credentialId,
        uint256 indexed identityId,
        uint256 timestamp
    );
    
    event ReputationUpdated(
        uint256 indexed identityId,
        uint256 newScore,
        uint256 timestamp
    );
    
    event TrustedIssuerAdded(
        address indexed issuer,
        uint256 timestamp
    );
    
    event TrustedIssuerRemoved(
        address indexed issuer,
        uint256 timestamp
    );
    
    event AccessDelegated(
        uint256 indexed identityId,
        address indexed delegate,
        uint256 timestamp
    );
    
    event AccessRevoked(
        uint256 indexed identityId,
        address indexed delegate,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier identityExists(uint256 _identityId) {
        require(_identityId > 0 && _identityId <= identityCount, "Identity does not exist");
        _;
    }
    
    modifier onlyIdentityOwnerOrDelegate(uint256 _identityId) {
        require(
            identities[_identityId].owner == msg.sender ||
            delegatedAccess[_identityId][msg.sender],
            "Not authorized"
        );
        _;
    }
    
    modifier onlyTrustedIssuer() {
        require(trustedIssuers[msg.sender], "Not a trusted issuer");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        identityCount = 0;
        credentialCount = 0;
        trustedIssuers[msg.sender] = true; // Owner is trusted issuer by default
    }
    
    /**
     * @dev Create a new Self-Sovereign Identity
     * @param _profileHash IPFS hash of profile data
     * @return identityId The ID of the created identity
     */
    function createIdentity(
        string memory _profileHash
    ) external returns (uint256) {
        require(addressToIdentity[msg.sender] == 0, "Identity already exists for this address");
        
        identityCount++;
        uint256 newIdentityId = identityCount;
        
        // Generate DID (did:ethr:address format)
        string memory did = string(
            abi.encodePacked("did:ethr:", _addressToString(msg.sender))
        );
        
        identities[newIdentityId] = Identity({
            id: newIdentityId,
            owner: msg.sender,
            did: did,
            profileHash: _profileHash,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            active: true,
            reputationScore: 1000, // Starting score
            verified: false
        });
        
        addressToIdentity[msg.sender] = newIdentityId;
        didToIdentity[did] = newIdentityId;
        
        // Initialize reputation
        identityReputation[newIdentityId] = Reputation({
            totalTransactions: 0,
            successfulTransactions: 0,
            disputes: 0,
            resolvedDisputes: 0,
            reviewCount: 0,
            averageRating: 0
        });
        
        emit IdentityCreated(newIdentityId, msg.sender, did, block.timestamp);
        
        return newIdentityId;
    }
    
    /**
     * @dev Update identity profile
     * @param _identityId Identity ID
     * @param _profileHash New IPFS hash of profile data
     */
    function updateIdentity(
        uint256 _identityId,
        string memory _profileHash
    ) external identityExists(_identityId) onlyIdentityOwnerOrDelegate(_identityId) {
        Identity storage identity = identities[_identityId];
        
        identity.profileHash = _profileHash;
        identity.updatedAt = block.timestamp;
        
        emit IdentityUpdated(_identityId, _profileHash, block.timestamp);
    }
    
    /**
     * @dev Issue a Verifiable Credential
     * @param _identityId Identity ID
     * @param _credentialType Type of credential (e.g., "ProofOfAddress", "KYC")
     * @param _claimHash IPFS hash of credential claim
     * @param _expiresAt Expiration timestamp
     * @param _proofType Proof type (e.g., "EcdsaSecp256k1Signature2019")
     * @param _signature Signature bytes
     * @return credentialId The ID of the issued credential
     */
    function issueCredential(
        uint256 _identityId,
        string memory _credentialType,
        string memory _claimHash,
        uint256 _expiresAt,
        string memory _proofType,
        bytes memory _signature
    ) external identityExists(_identityId) onlyTrustedIssuer returns (uint256) {
        require(_expiresAt > block.timestamp, "Expiration must be in future");
        
        credentialCount++;
        uint256 newCredentialId = credentialCount;
        
        VerifiableCredential memory newCredential = VerifiableCredential({
            id: newCredentialId,
            identityId: _identityId,
            credentialType: _credentialType,
            issuer: msg.sender,
            claimHash: _claimHash,
            issuedAt: block.timestamp,
            expiresAt: _expiresAt,
            revoked: false,
            proofType: _proofType,
            signature: _signature
        });
        
        identityCredentials[_identityId].push(newCredential);
        
        emit CredentialIssued(
            newCredentialId,
            _identityId,
            msg.sender,
            _credentialType,
            block.timestamp
        );
        
        return newCredentialId;
    }
    
    /**
     * @dev Revoke a Verifiable Credential
     * @param _identityId Identity ID
     * @param _credentialIndex Credential index in array
     */
    function revokeCredential(
        uint256 _identityId,
        uint256 _credentialIndex
    ) external identityExists(_identityId) {
        require(_credentialIndex < identityCredentials[_identityId].length, "Invalid credential index");
        
        VerifiableCredential storage credential = identityCredentials[_identityId][_credentialIndex];
        require(
            credential.issuer == msg.sender || msg.sender == owner,
            "Only issuer or owner can revoke"
        );
        require(!credential.revoked, "Credential already revoked");
        
        credential.revoked = true;
        
        emit CredentialRevoked(credential.id, _identityId, block.timestamp);
    }
    
    /**
     * @dev Verify identity (mark as verified by trusted issuer)
     * @param _identityId Identity ID
     */
    function verifyIdentity(
        uint256 _identityId
    ) external identityExists(_identityId) onlyTrustedIssuer {
        identities[_identityId].verified = true;
    }
    
    /**
     * @dev Update reputation score
     * @param _identityId Identity ID
     * @param _transactionSuccess Whether transaction was successful
     * @param _rating Rating (0-5 stars, stored as rating * 100)
     */
    function updateReputation(
        uint256 _identityId,
        bool _transactionSuccess,
        uint256 _rating
    ) external identityExists(_identityId) {
        require(_rating <= 500, "Rating cannot exceed 5.0 (500)");
        
        Reputation storage rep = identityReputation[_identityId];
        Identity storage identity = identities[_identityId];
        
        rep.totalTransactions++;
        if (_transactionSuccess) {
            rep.successfulTransactions++;
        }
        
        // Update average rating
        if (_rating > 0) {
            rep.averageRating = (rep.averageRating * rep.reviewCount + _rating) / (rep.reviewCount + 1);
            rep.reviewCount++;
        }
        
        // Calculate new reputation score (0-2000 range)
        uint256 successRate = (rep.successfulTransactions * 100) / rep.totalTransactions;
        uint256 disputeRate = rep.totalTransactions > 0 
            ? (rep.disputes * 100) / rep.totalTransactions 
            : 0;
        
        uint256 newScore = (successRate * 10) + (rep.averageRating * 2);
        
        if (disputeRate > 20) {
            newScore = newScore * (100 - disputeRate) / 100;
        }
        
        identity.reputationScore = newScore;
        
        emit ReputationUpdated(_identityId, newScore, block.timestamp);
    }
    
    /**
     * @dev Record a dispute
     * @param _identityId Identity ID
     */
    function recordDispute(
        uint256 _identityId
    ) external identityExists(_identityId) onlyOwner {
        Reputation storage rep = identityReputation[_identityId];
        rep.disputes++;
        
        // Reduce reputation score
        Identity storage identity = identities[_identityId];
        if (identity.reputationScore > 50) {
            identity.reputationScore -= 50;
        }
        
        emit ReputationUpdated(_identityId, identity.reputationScore, block.timestamp);
    }
    
    /**
     * @dev Resolve a dispute
     * @param _identityId Identity ID
     * @param _inFavor Whether dispute was resolved in favor of identity owner
     */
    function resolveDispute(
        uint256 _identityId,
        bool _inFavor
    ) external identityExists(_identityId) onlyOwner {
        Reputation storage rep = identityReputation[_identityId];
        rep.resolvedDisputes++;
        
        if (_inFavor) {
            // Restore some reputation
            Identity storage identity = identities[_identityId];
            identity.reputationScore += 30;
            emit ReputationUpdated(_identityId, identity.reputationScore, block.timestamp);
        }
    }
    
    /**
     * @dev Delegate access to identity
     * @param _identityId Identity ID
     * @param _delegate Delegate address
     */
    function delegateAccess(
        uint256 _identityId,
        address _delegate
    ) external identityExists(_identityId) onlyIdentityOwnerOrDelegate(_identityId) {
        require(_delegate != address(0), "Invalid delegate address");
        require(
            identities[_identityId].owner == msg.sender,
            "Only owner can delegate access"
        );
        
        delegatedAccess[_identityId][_delegate] = true;
        
        emit AccessDelegated(_identityId, _delegate, block.timestamp);
    }
    
    /**
     * @dev Revoke delegated access
     * @param _identityId Identity ID
     * @param _delegate Delegate address
     */
    function revokeAccess(
        uint256 _identityId,
        address _delegate
    ) external identityExists(_identityId) {
        require(
            identities[_identityId].owner == msg.sender,
            "Only owner can revoke access"
        );
        
        delegatedAccess[_identityId][_delegate] = false;
        
        emit AccessRevoked(_identityId, _delegate, block.timestamp);
    }
    
    /**
     * @dev Add trusted issuer
     * @param _issuer Issuer address
     */
    function addTrustedIssuer(address _issuer) external onlyOwner {
        require(_issuer != address(0), "Invalid issuer address");
        trustedIssuers[_issuer] = true;
        emit TrustedIssuerAdded(_issuer, block.timestamp);
    }
    
    /**
     * @dev Remove trusted issuer
     * @param _issuer Issuer address
     */
    function removeTrustedIssuer(address _issuer) external onlyOwner {
        trustedIssuers[_issuer] = false;
        emit TrustedIssuerRemoved(_issuer, block.timestamp);
    }
    
    /**
     * @dev Get identity by address
     * @param _address Address
     * @return Identity struct
     */
    function getIdentityByAddress(address _address) external view returns (Identity memory) {
        uint256 identityId = addressToIdentity[_address];
        require(identityId > 0, "Identity not found");
        return identities[identityId];
    }
    
    /**
     * @dev Get identity by DID
     * @param _did Decentralized Identifier
     * @return Identity struct
     */
    function getIdentityByDID(string memory _did) external view returns (Identity memory) {
        uint256 identityId = didToIdentity[_did];
        require(identityId > 0, "Identity not found");
        return identities[identityId];
    }
    
    /**
     * @dev Get credentials for identity
     * @param _identityId Identity ID
     * @return Array of VerifiableCredential structs
     */
    function getCredentials(
        uint256 _identityId
    ) external view identityExists(_identityId) returns (VerifiableCredential[] memory) {
        return identityCredentials[_identityId];
    }
    
    /**
     * @dev Get valid credentials (not expired, not revoked)
     * @param _identityId Identity ID
     * @return Array of VerifiableCredential structs
     */
    function getValidCredentials(
        uint256 _identityId
    ) external view identityExists(_identityId) returns (VerifiableCredential[] memory) {
        VerifiableCredential[] memory allCredentials = identityCredentials[_identityId];
        uint256 validCount = 0;
        
        // Count valid credentials
        for (uint256 i = 0; i < allCredentials.length; i++) {
            if (!allCredentials[i].revoked && allCredentials[i].expiresAt > block.timestamp) {
                validCount++;
            }
        }
        
        // Build array of valid credentials
        VerifiableCredential[] memory validCredentials = new VerifiableCredential[](validCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allCredentials.length; i++) {
            if (!allCredentials[i].revoked && allCredentials[i].expiresAt > block.timestamp) {
                validCredentials[index] = allCredentials[i];
                index++;
            }
        }
        
        return validCredentials;
    }
    
    /**
     * @dev Get reputation for identity
     * @param _identityId Identity ID
     * @return Reputation struct
     */
    function getReputation(
        uint256 _identityId
    ) external view identityExists(_identityId) returns (Reputation memory) {
        return identityReputation[_identityId];
    }
    
    /**
     * @dev Verify credential authenticity
     * @param _identityId Identity ID
     * @param _credentialIndex Credential index
     * @return Valid credential status
     */
    function verifyCredential(
        uint256 _identityId,
        uint256 _credentialIndex
    ) external view identityExists(_identityId) returns (bool) {
        require(_credentialIndex < identityCredentials[_identityId].length, "Invalid credential index");
        
        VerifiableCredential memory credential = identityCredentials[_identityId][_credentialIndex];
        
        return (
            !credential.revoked &&
            credential.expiresAt > block.timestamp &&
            trustedIssuers[credential.issuer]
        );
    }
    
    /**
     * @dev Deactivate identity
     * @param _identityId Identity ID
     */
    function deactivateIdentity(
        uint256 _identityId
    ) external identityExists(_identityId) onlyIdentityOwnerOrDelegate(_identityId) {
        require(
            identities[_identityId].owner == msg.sender,
            "Only owner can deactivate"
        );
        
        identities[_identityId].active = false;
    }
    
    /**
     * @dev Reactivate identity
     * @param _identityId Identity ID
     */
    function reactivateIdentity(
        uint256 _identityId
    ) external identityExists(_identityId) {
        require(
            identities[_identityId].owner == msg.sender,
            "Only owner can reactivate"
        );
        
        identities[_identityId].active = true;
    }
    
    /**
     * @dev Convert address to string
     */
    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
