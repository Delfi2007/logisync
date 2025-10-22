// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SupplyChainTracking.sol";

/**
 * @title OrderEscrow
 * @dev Smart contract for automated escrow and payment release for orders
 * @notice Handles secure transactions with conditional payment release
 */
contract OrderEscrow {
    
    // State variables
    address public owner;
    uint256 public escrowCount;
    uint256 public platformFeePercent; // Basis points (100 = 1%)
    
    SupplyChainTracking public supplyChainContract;
    
    // Structs
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
    
    enum EscrowStatus {
        Created,
        Funded,
        InTransit,
        Delivered,
        Released,
        Refunded,
        Disputed,
        Resolved
    }
    
    // Mappings
    mapping(uint256 => Escrow) public escrows;
    mapping(uint256 => uint256) public orderToEscrow; // orderId => escrowId
    mapping(address => uint256[]) public buyerEscrows;
    mapping(address => uint256[]) public sellerEscrows;
    
    // Events
    event EscrowCreated(
        uint256 indexed escrowId,
        uint256 indexed orderId,
        address indexed buyer,
        address seller,
        uint256 amount,
        uint256 timestamp
    );
    
    event EscrowFunded(
        uint256 indexed escrowId,
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );
    
    event EscrowReleased(
        uint256 indexed escrowId,
        address indexed seller,
        uint256 amount,
        uint256 platformFee,
        uint256 timestamp
    );
    
    event EscrowRefunded(
        uint256 indexed escrowId,
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );
    
    event DeliveryConfirmed(
        uint256 indexed escrowId,
        string deliveryProof,
        uint256 timestamp
    );
    
    event DisputeRaised(
        uint256 indexed escrowId,
        address indexed raiser,
        uint256 timestamp
    );
    
    event DisputeResolved(
        uint256 indexed escrowId,
        address indexed winner,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier escrowExists(uint256 _escrowId) {
        require(_escrowId > 0 && _escrowId <= escrowCount, "Escrow does not exist");
        _;
    }
    
    modifier onlyBuyer(uint256 _escrowId) {
        require(msg.sender == escrows[_escrowId].buyer, "Only buyer can call this");
        _;
    }
    
    modifier onlySeller(uint256 _escrowId) {
        require(msg.sender == escrows[_escrowId].seller, "Only seller can call this");
        _;
    }
    
    // Constructor
    constructor(address _supplyChainContract) {
        owner = msg.sender;
        escrowCount = 0;
        platformFeePercent = 250; // 2.5% default fee
        supplyChainContract = SupplyChainTracking(_supplyChainContract);
    }
    
    /**
     * @dev Create a new escrow for an order
     * @param _orderId Order ID
     * @param _buyer Buyer address
     * @param _seller Seller address
     * @param _amount Escrow amount in wei
     * @return escrowId The ID of the created escrow
     */
    function createEscrow(
        uint256 _orderId,
        address _buyer,
        address _seller,
        uint256 _amount
    ) external returns (uint256) {
        require(_buyer != address(0), "Invalid buyer address");
        require(_seller != address(0), "Invalid seller address");
        require(_amount > 0, "Amount must be greater than 0");
        require(orderToEscrow[_orderId] == 0, "Escrow already exists for this order");
        
        escrowCount++;
        uint256 newEscrowId = escrowCount;
        
        escrows[newEscrowId] = Escrow({
            id: newEscrowId,
            orderId: _orderId,
            buyer: _buyer,
            seller: _seller,
            amount: _amount,
            createdAt: block.timestamp,
            releasedAt: 0,
            status: EscrowStatus.Created,
            deliveryProof: "",
            disputeRaised: false,
            disputeWinner: address(0)
        });
        
        orderToEscrow[_orderId] = newEscrowId;
        buyerEscrows[_buyer].push(newEscrowId);
        sellerEscrows[_seller].push(newEscrowId);
        
        emit EscrowCreated(
            newEscrowId,
            _orderId,
            _buyer,
            _seller,
            _amount,
            block.timestamp
        );
        
        return newEscrowId;
    }
    
    /**
     * @dev Fund the escrow (buyer deposits funds)
     * @param _escrowId Escrow ID
     */
    function fundEscrow(
        uint256 _escrowId
    ) external payable escrowExists(_escrowId) onlyBuyer(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        
        require(escrow.status == EscrowStatus.Created, "Escrow already funded");
        require(msg.value == escrow.amount, "Incorrect amount sent");
        
        escrow.status = EscrowStatus.Funded;
        
        emit EscrowFunded(_escrowId, msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @dev Mark order as in transit
     * @param _escrowId Escrow ID
     */
    function markInTransit(
        uint256 _escrowId
    ) external escrowExists(_escrowId) onlySeller(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        
        require(escrow.status == EscrowStatus.Funded, "Escrow must be funded first");
        
        escrow.status = EscrowStatus.InTransit;
    }
    
    /**
     * @dev Confirm delivery with proof
     * @param _escrowId Escrow ID
     * @param _deliveryProof Delivery proof hash (IPFS hash or tracking number)
     */
    function confirmDelivery(
        uint256 _escrowId,
        string memory _deliveryProof
    ) external escrowExists(_escrowId) onlySeller(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        
        require(
            escrow.status == EscrowStatus.InTransit,
            "Order must be in transit"
        );
        
        escrow.status = EscrowStatus.Delivered;
        escrow.deliveryProof = _deliveryProof;
        
        emit DeliveryConfirmed(_escrowId, _deliveryProof, block.timestamp);
    }
    
    /**
     * @dev Release funds to seller (can be called by buyer or automatically after delivery)
     * @param _escrowId Escrow ID
     */
    function releaseFunds(
        uint256 _escrowId
    ) external escrowExists(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        
        require(
            msg.sender == escrow.buyer || msg.sender == owner,
            "Only buyer or owner can release funds"
        );
        require(
            escrow.status == EscrowStatus.Delivered ||
            escrow.status == EscrowStatus.InTransit,
            "Invalid status for release"
        );
        require(!escrow.disputeRaised, "Cannot release during dispute");
        
        uint256 platformFee = (escrow.amount * platformFeePercent) / 10000;
        uint256 sellerAmount = escrow.amount - platformFee;
        
        escrow.status = EscrowStatus.Released;
        escrow.releasedAt = block.timestamp;
        
        // Transfer funds
        payable(escrow.seller).transfer(sellerAmount);
        payable(owner).transfer(platformFee);
        
        emit EscrowReleased(
            _escrowId,
            escrow.seller,
            sellerAmount,
            platformFee,
            block.timestamp
        );
    }
    
    /**
     * @dev Auto-release funds after delivery confirmation period (e.g., 7 days)
     * @param _escrowId Escrow ID
     */
    function autoReleaseFunds(
        uint256 _escrowId
    ) external escrowExists(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        
        require(
            escrow.status == EscrowStatus.Delivered,
            "Delivery must be confirmed"
        );
        require(
            block.timestamp >= escrow.createdAt + 7 days,
            "Auto-release period not reached"
        );
        require(!escrow.disputeRaised, "Cannot release during dispute");
        
        uint256 platformFee = (escrow.amount * platformFeePercent) / 10000;
        uint256 sellerAmount = escrow.amount - platformFee;
        
        escrow.status = EscrowStatus.Released;
        escrow.releasedAt = block.timestamp;
        
        // Transfer funds
        payable(escrow.seller).transfer(sellerAmount);
        payable(owner).transfer(platformFee);
        
        emit EscrowReleased(
            _escrowId,
            escrow.seller,
            sellerAmount,
            platformFee,
            block.timestamp
        );
    }
    
    /**
     * @dev Refund buyer (only before delivery or in case of cancellation)
     * @param _escrowId Escrow ID
     */
    function refundBuyer(
        uint256 _escrowId
    ) external escrowExists(_escrowId) onlyOwner {
        Escrow storage escrow = escrows[_escrowId];
        
        require(
            escrow.status == EscrowStatus.Funded ||
            escrow.status == EscrowStatus.Created,
            "Cannot refund at this stage"
        );
        
        escrow.status = EscrowStatus.Refunded;
        
        payable(escrow.buyer).transfer(escrow.amount);
        
        emit EscrowRefunded(_escrowId, escrow.buyer, escrow.amount, block.timestamp);
    }
    
    /**
     * @dev Raise a dispute
     * @param _escrowId Escrow ID
     */
    function raiseDispute(
        uint256 _escrowId
    ) external escrowExists(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        
        require(
            msg.sender == escrow.buyer || msg.sender == escrow.seller,
            "Only buyer or seller can raise dispute"
        );
        require(
            escrow.status == EscrowStatus.InTransit ||
            escrow.status == EscrowStatus.Delivered,
            "Invalid status for dispute"
        );
        require(!escrow.disputeRaised, "Dispute already raised");
        
        escrow.disputeRaised = true;
        escrow.status = EscrowStatus.Disputed;
        
        emit DisputeRaised(_escrowId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Resolve dispute (owner only)
     * @param _escrowId Escrow ID
     * @param _winner Winner address (buyer or seller)
     */
    function resolveDispute(
        uint256 _escrowId,
        address _winner
    ) external escrowExists(_escrowId) onlyOwner {
        Escrow storage escrow = escrows[_escrowId];
        
        require(escrow.status == EscrowStatus.Disputed, "No active dispute");
        require(
            _winner == escrow.buyer || _winner == escrow.seller,
            "Winner must be buyer or seller"
        );
        
        escrow.disputeWinner = _winner;
        escrow.status = EscrowStatus.Resolved;
        
        if (_winner == escrow.seller) {
            uint256 platformFee = (escrow.amount * platformFeePercent) / 10000;
            uint256 sellerAmount = escrow.amount - platformFee;
            
            payable(escrow.seller).transfer(sellerAmount);
            payable(owner).transfer(platformFee);
        } else {
            payable(escrow.buyer).transfer(escrow.amount);
        }
        
        emit DisputeResolved(_escrowId, _winner, block.timestamp);
    }
    
    /**
     * @dev Get escrow details
     * @param _escrowId Escrow ID
     * @return Escrow struct
     */
    function getEscrow(
        uint256 _escrowId
    ) external view escrowExists(_escrowId) returns (Escrow memory) {
        return escrows[_escrowId];
    }
    
    /**
     * @dev Get buyer's escrows
     * @param _buyer Buyer address
     * @return Array of escrow IDs
     */
    function getBuyerEscrows(
        address _buyer
    ) external view returns (uint256[] memory) {
        return buyerEscrows[_buyer];
    }
    
    /**
     * @dev Get seller's escrows
     * @param _seller Seller address
     * @return Array of escrow IDs
     */
    function getSellerEscrows(
        address _seller
    ) external view returns (uint256[] memory) {
        return sellerEscrows[_seller];
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
     * @dev Get contract balance
     * @return Balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
