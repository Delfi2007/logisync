// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title LogiSyncNFT
 * @dev ERC-1155 Multi-Token Standard for LogiSync Marketplace
 * @notice Supports both fungible and non-fungible tokens for digital products
 */
contract LogiSyncNFT {
    
    // State variables
    address public owner;
    uint256 public tokenIdCounter;
    uint256 public platformFeePercent; // Basis points (100 = 1%)
    
    // Structs
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
    
    // Mappings
    mapping(uint256 => Token) public tokens;
    mapping(uint256 => mapping(address => uint256)) public balances;
    mapping(address => mapping(address => bool)) public operatorApprovals;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256[]) public creatorTokens;
    mapping(uint256 => address[]) public tokenHolders;
    mapping(uint256 => mapping(address => uint256)) public holderIndex;
    
    // Events (ERC-1155 Standard)
    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );
    
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );
    
    event ApprovalForAll(
        address indexed account,
        address indexed operator,
        bool approved
    );
    
    event URI(string value, uint256 indexed id);
    
    // Custom Events
    event TokenMinted(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 supply,
        uint256 maxSupply,
        bool isFungible,
        uint256 timestamp
    );
    
    event TokenBurned(
        uint256 indexed tokenId,
        address indexed burner,
        uint256 amount,
        uint256 timestamp
    );
    
    event TokenListed(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 amount,
        uint256 pricePerToken,
        uint256 timestamp
    );
    
    event TokenPurchased(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed buyer,
        address seller,
        uint256 amount,
        uint256 totalPrice,
        uint256 timestamp
    );
    
    event ListingCancelled(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier tokenExists(uint256 _tokenId) {
        require(tokens[_tokenId].exists, "Token does not exist");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        tokenIdCounter = 0;
        platformFeePercent = 250; // 2.5% default fee
    }
    
    /**
     * @dev Mint new tokens (both fungible and non-fungible)
     * @param _to Recipient address
     * @param _supply Initial supply
     * @param _maxSupply Maximum supply (0 for unlimited)
     * @param _isFungible Whether token is fungible
     * @param _uri Token metadata URI
     * @param _royaltyPercent Creator royalty percentage in basis points
     * @return tokenId The ID of the minted token
     */
    function mint(
        address _to,
        uint256 _supply,
        uint256 _maxSupply,
        bool _isFungible,
        string memory _uri,
        uint256 _royaltyPercent
    ) external returns (uint256) {
        require(_to != address(0), "Cannot mint to zero address");
        require(_supply > 0, "Supply must be greater than 0");
        require(
            _maxSupply == 0 || _supply <= _maxSupply,
            "Supply exceeds max supply"
        );
        require(_royaltyPercent <= 1000, "Royalty cannot exceed 10%");
        
        tokenIdCounter++;
        uint256 newTokenId = tokenIdCounter;
        
        tokens[newTokenId] = Token({
            id: newTokenId,
            creator: msg.sender,
            supply: _supply,
            maxSupply: _maxSupply,
            isFungible: _isFungible,
            uri: _uri,
            royaltyPercent: _royaltyPercent,
            createdAt: block.timestamp,
            exists: true
        });
        
        balances[newTokenId][_to] = _supply;
        creatorTokens[msg.sender].push(newTokenId);
        
        _addTokenHolder(newTokenId, _to);
        
        emit TokenMinted(
            newTokenId,
            msg.sender,
            _supply,
            _maxSupply,
            _isFungible,
            block.timestamp
        );
        
        emit TransferSingle(msg.sender, address(0), _to, newTokenId, _supply);
        emit URI(_uri, newTokenId);
        
        return newTokenId;
    }
    
    /**
     * @dev Mint additional supply for existing fungible token
     * @param _tokenId Token ID
     * @param _to Recipient address
     * @param _amount Amount to mint
     */
    function mintAdditional(
        uint256 _tokenId,
        address _to,
        uint256 _amount
    ) external tokenExists(_tokenId) {
        Token storage token = tokens[_tokenId];
        
        require(msg.sender == token.creator, "Only creator can mint additional");
        require(token.isFungible, "Can only mint additional for fungible tokens");
        require(
            token.maxSupply == 0 || token.supply + _amount <= token.maxSupply,
            "Exceeds max supply"
        );
        
        token.supply += _amount;
        balances[_tokenId][_to] += _amount;
        
        _addTokenHolder(_tokenId, _to);
        
        emit TransferSingle(msg.sender, address(0), _to, _tokenId, _amount);
    }
    
    /**
     * @dev Safe transfer of single token type
     * @param _from Sender address
     * @param _to Recipient address
     * @param _id Token ID
     * @param _amount Amount to transfer
     */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _amount
    ) external tokenExists(_id) {
        require(_to != address(0), "Cannot transfer to zero address");
        require(
            _from == msg.sender || operatorApprovals[_from][msg.sender],
            "Not authorized"
        );
        require(balances[_id][_from] >= _amount, "Insufficient balance");
        
        balances[_id][_from] -= _amount;
        balances[_id][_to] += _amount;
        
        if (balances[_id][_from] == 0) {
            _removeTokenHolder(_id, _from);
        }
        _addTokenHolder(_id, _to);
        
        emit TransferSingle(msg.sender, _from, _to, _id, _amount);
    }
    
    /**
     * @dev Safe batch transfer of multiple token types
     * @param _from Sender address
     * @param _to Recipient address
     * @param _ids Array of token IDs
     * @param _amounts Array of amounts
     */
    function safeBatchTransferFrom(
        address _from,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _amounts
    ) external {
        require(_to != address(0), "Cannot transfer to zero address");
        require(_ids.length == _amounts.length, "IDs and amounts length mismatch");
        require(
            _from == msg.sender || operatorApprovals[_from][msg.sender],
            "Not authorized"
        );
        
        for (uint256 i = 0; i < _ids.length; i++) {
            uint256 id = _ids[i];
            uint256 amount = _amounts[i];
            
            require(tokens[id].exists, "Token does not exist");
            require(balances[id][_from] >= amount, "Insufficient balance");
            
            balances[id][_from] -= amount;
            balances[id][_to] += amount;
            
            if (balances[id][_from] == 0) {
                _removeTokenHolder(id, _from);
            }
            _addTokenHolder(id, _to);
        }
        
        emit TransferBatch(msg.sender, _from, _to, _ids, _amounts);
    }
    
    /**
     * @dev Get balance of account for a token
     * @param _account Account address
     * @param _id Token ID
     * @return Balance of the account
     */
    function balanceOf(
        address _account,
        uint256 _id
    ) external view tokenExists(_id) returns (uint256) {
        require(_account != address(0), "Cannot query zero address");
        return balances[_id][_account];
    }
    
    /**
     * @dev Get balances of multiple accounts for multiple tokens
     * @param _accounts Array of account addresses
     * @param _ids Array of token IDs
     * @return Array of balances
     */
    function balanceOfBatch(
        address[] memory _accounts,
        uint256[] memory _ids
    ) external view returns (uint256[] memory) {
        require(
            _accounts.length == _ids.length,
            "Accounts and IDs length mismatch"
        );
        
        uint256[] memory batchBalances = new uint256[](_accounts.length);
        
        for (uint256 i = 0; i < _accounts.length; i++) {
            require(tokens[_ids[i]].exists, "Token does not exist");
            batchBalances[i] = balances[_ids[i]][_accounts[i]];
        }
        
        return batchBalances;
    }
    
    /**
     * @dev Enable or disable approval for operator
     * @param _operator Operator address
     * @param _approved Approval status
     */
    function setApprovalForAll(address _operator, bool _approved) external {
        require(_operator != msg.sender, "Cannot approve yourself");
        operatorApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }
    
    /**
     * @dev Check if operator is approved for account
     * @param _account Account address
     * @param _operator Operator address
     * @return Approval status
     */
    function isApprovedForAll(
        address _account,
        address _operator
    ) external view returns (bool) {
        return operatorApprovals[_account][_operator];
    }
    
    /**
     * @dev Burn tokens
     * @param _tokenId Token ID
     * @param _amount Amount to burn
     */
    function burn(
        uint256 _tokenId,
        uint256 _amount
    ) external tokenExists(_tokenId) {
        require(balances[_tokenId][msg.sender] >= _amount, "Insufficient balance");
        
        balances[_tokenId][msg.sender] -= _amount;
        tokens[_tokenId].supply -= _amount;
        
        if (balances[_tokenId][msg.sender] == 0) {
            _removeTokenHolder(_tokenId, msg.sender);
        }
        
        emit TokenBurned(_tokenId, msg.sender, _amount, block.timestamp);
        emit TransferSingle(msg.sender, msg.sender, address(0), _tokenId, _amount);
    }
    
    /**
     * @dev List token for sale
     * @param _tokenId Token ID
     * @param _amount Amount to list
     * @param _pricePerToken Price per token in wei
     * @return listingId The ID of the listing
     */
    function listForSale(
        uint256 _tokenId,
        uint256 _amount,
        uint256 _pricePerToken
    ) external tokenExists(_tokenId) returns (uint256) {
        require(balances[_tokenId][msg.sender] >= _amount, "Insufficient balance");
        require(_pricePerToken > 0, "Price must be greater than 0");
        
        uint256 listingId = uint256(
            keccak256(abi.encodePacked(_tokenId, msg.sender, block.timestamp))
        );
        
        listings[listingId] = Listing({
            tokenId: _tokenId,
            seller: msg.sender,
            amount: _amount,
            pricePerToken: _pricePerToken,
            listedAt: block.timestamp,
            active: true
        });
        
        emit TokenListed(
            listingId,
            _tokenId,
            msg.sender,
            _amount,
            _pricePerToken,
            block.timestamp
        );
        
        return listingId;
    }
    
    /**
     * @dev Purchase listed token
     * @param _listingId Listing ID
     * @param _amount Amount to purchase
     */
    function purchase(
        uint256 _listingId,
        uint256 _amount
    ) external payable {
        Listing storage listing = listings[_listingId];
        
        require(listing.active, "Listing is not active");
        require(_amount <= listing.amount, "Amount exceeds listing");
        
        uint256 totalPrice = listing.pricePerToken * _amount;
        require(msg.value == totalPrice, "Incorrect payment amount");
        
        Token storage token = tokens[listing.tokenId];
        
        // Calculate fees
        uint256 platformFee = (totalPrice * platformFeePercent) / 10000;
        uint256 royalty = (totalPrice * token.royaltyPercent) / 10000;
        uint256 sellerAmount = totalPrice - platformFee - royalty;
        
        // Update balances
        balances[listing.tokenId][listing.seller] -= _amount;
        balances[listing.tokenId][msg.sender] += _amount;
        
        // Update listing
        listing.amount -= _amount;
        if (listing.amount == 0) {
            listing.active = false;
        }
        
        // Update holders
        if (balances[listing.tokenId][listing.seller] == 0) {
            _removeTokenHolder(listing.tokenId, listing.seller);
        }
        _addTokenHolder(listing.tokenId, msg.sender);
        
        // Transfer funds
        payable(listing.seller).transfer(sellerAmount);
        payable(token.creator).transfer(royalty);
        payable(owner).transfer(platformFee);
        
        emit TokenPurchased(
            _listingId,
            listing.tokenId,
            msg.sender,
            listing.seller,
            _amount,
            totalPrice,
            block.timestamp
        );
        
        emit TransferSingle(
            msg.sender,
            listing.seller,
            msg.sender,
            listing.tokenId,
            _amount
        );
    }
    
    /**
     * @dev Cancel listing
     * @param _listingId Listing ID
     */
    function cancelListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        
        require(listing.active, "Listing is not active");
        require(msg.sender == listing.seller, "Only seller can cancel");
        
        listing.active = false;
        
        emit ListingCancelled(
            _listingId,
            listing.tokenId,
            listing.seller,
            block.timestamp
        );
    }
    
    /**
     * @dev Get token metadata URI
     * @param _tokenId Token ID
     * @return Token URI
     */
    function uri(uint256 _tokenId) external view tokenExists(_tokenId) returns (string memory) {
        return tokens[_tokenId].uri;
    }
    
    /**
     * @dev Get token info
     * @param _tokenId Token ID
     * @return Token struct
     */
    function getTokenInfo(uint256 _tokenId) external view tokenExists(_tokenId) returns (Token memory) {
        return tokens[_tokenId];
    }
    
    /**
     * @dev Get tokens created by address
     * @param _creator Creator address
     * @return Array of token IDs
     */
    function getCreatorTokens(address _creator) external view returns (uint256[] memory) {
        return creatorTokens[_creator];
    }
    
    /**
     * @dev Get token holders
     * @param _tokenId Token ID
     * @return Array of holder addresses
     */
    function getTokenHolders(uint256 _tokenId) external view tokenExists(_tokenId) returns (address[] memory) {
        return tokenHolders[_tokenId];
    }
    
    /**
     * @dev Update platform fee
     * @param _newFeePercent New fee percentage in basis points
     */
    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = _newFeePercent;
    }
    
    /**
     * @dev Internal function to add token holder
     */
    function _addTokenHolder(uint256 _tokenId, address _holder) internal {
        if (holderIndex[_tokenId][_holder] == 0 && balances[_tokenId][_holder] > 0) {
            tokenHolders[_tokenId].push(_holder);
            holderIndex[_tokenId][_holder] = tokenHolders[_tokenId].length;
        }
    }
    
    /**
     * @dev Internal function to remove token holder
     */
    function _removeTokenHolder(uint256 _tokenId, address _holder) internal {
        uint256 index = holderIndex[_tokenId][_holder];
        if (index > 0) {
            uint256 lastIndex = tokenHolders[_tokenId].length - 1;
            address lastHolder = tokenHolders[_tokenId][lastIndex];
            
            tokenHolders[_tokenId][index - 1] = lastHolder;
            holderIndex[_tokenId][lastHolder] = index;
            
            tokenHolders[_tokenId].pop();
            delete holderIndex[_tokenId][_holder];
        }
    }
    
    /**
     * @dev Withdraw accumulated platform fees
     */
    function withdrawFees() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
