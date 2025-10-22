// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SupplyChainTracking
 * @dev Immutable tracking of product movements across the supply chain
 * @notice This contract provides complete transparency and traceability for LogiSync products
 */
contract SupplyChainTracking {
    
    // State variables
    address public owner;
    uint256 public productCount;
    uint256 public movementCount;
    
    // Structs
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
    
    enum ProductStatus {
        Manufactured,
        InTransit,
        InWarehouse,
        Delivered,
        Recalled
    }
    
    enum MovementType {
        Manufacture,
        Transfer,
        Sale,
        Return,
        Disposal
    }
    
    // Mappings
    mapping(uint256 => Product) public products;
    mapping(uint256 => Movement) public movements;
    mapping(uint256 => uint256[]) public productMovements; // productId => movementIds[]
    mapping(address => bool) public authorizedWarehouses;
    mapping(string => uint256) public skuToProductId;
    
    // Events
    event ProductRegistered(
        uint256 indexed productId,
        string sku,
        string name,
        address indexed manufacturer,
        uint256 timestamp
    );
    
    event ProductMoved(
        uint256 indexed movementId,
        uint256 indexed productId,
        address indexed from,
        address to,
        string fromLocation,
        string toLocation,
        uint256 quantity,
        uint256 timestamp
    );
    
    event ProductStatusChanged(
        uint256 indexed productId,
        ProductStatus oldStatus,
        ProductStatus newStatus,
        uint256 timestamp
    );
    
    event WarehouseAuthorized(
        address indexed warehouse,
        bool authorized,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorized() {
        require(
            msg.sender == owner || authorizedWarehouses[msg.sender],
            "Not authorized"
        );
        _;
    }
    
    modifier productExists(uint256 _productId) {
        require(products[_productId].exists, "Product does not exist");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        productCount = 0;
        movementCount = 0;
    }
    
    /**
     * @dev Register a new product in the supply chain
     * @param _sku Product SKU
     * @param _name Product name
     * @param _manufacturer Manufacturer address
     * @return productId The ID of the newly registered product
     */
    function registerProduct(
        string memory _sku,
        string memory _name,
        address _manufacturer
    ) external onlyAuthorized returns (uint256) {
        require(skuToProductId[_sku] == 0, "Product with this SKU already exists");
        require(_manufacturer != address(0), "Invalid manufacturer address");
        
        productCount++;
        uint256 newProductId = productCount;
        
        products[newProductId] = Product({
            id: newProductId,
            sku: _sku,
            name: _name,
            manufacturer: _manufacturer,
            manufacturedDate: block.timestamp,
            exists: true,
            status: ProductStatus.Manufactured
        });
        
        skuToProductId[_sku] = newProductId;
        
        emit ProductRegistered(
            newProductId,
            _sku,
            _name,
            _manufacturer,
            block.timestamp
        );
        
        return newProductId;
    }
    
    /**
     * @dev Record a product movement
     * @param _productId Product ID
     * @param _from Source address
     * @param _to Destination address
     * @param _fromLocation Source location name
     * @param _toLocation Destination location name
     * @param _quantity Quantity moved
     * @param _movementType Type of movement
     * @param _notes Additional notes
     * @return movementId The ID of the recorded movement
     */
    function recordMovement(
        uint256 _productId,
        address _from,
        address _to,
        string memory _fromLocation,
        string memory _toLocation,
        uint256 _quantity,
        MovementType _movementType,
        string memory _notes
    ) external onlyAuthorized productExists(_productId) returns (uint256) {
        require(_quantity > 0, "Quantity must be greater than 0");
        require(_to != address(0), "Invalid destination address");
        
        movementCount++;
        uint256 newMovementId = movementCount;
        
        movements[newMovementId] = Movement({
            id: newMovementId,
            productId: _productId,
            from: _from,
            to: _to,
            fromLocation: _fromLocation,
            toLocation: _toLocation,
            timestamp: block.timestamp,
            quantity: _quantity,
            movementType: _movementType,
            notes: _notes
        });
        
        productMovements[_productId].push(newMovementId);
        
        // Update product status based on movement type
        if (_movementType == MovementType.Transfer) {
            _updateProductStatus(_productId, ProductStatus.InTransit);
        } else if (_movementType == MovementType.Sale) {
            _updateProductStatus(_productId, ProductStatus.Delivered);
        }
        
        emit ProductMoved(
            newMovementId,
            _productId,
            _from,
            _to,
            _fromLocation,
            _toLocation,
            _quantity,
            block.timestamp
        );
        
        return newMovementId;
    }
    
    /**
     * @dev Update product status
     * @param _productId Product ID
     * @param _newStatus New status
     */
    function updateProductStatus(
        uint256 _productId,
        ProductStatus _newStatus
    ) external onlyAuthorized productExists(_productId) {
        _updateProductStatus(_productId, _newStatus);
    }
    
    /**
     * @dev Internal function to update product status
     * @param _productId Product ID
     * @param _newStatus New status
     */
    function _updateProductStatus(
        uint256 _productId,
        ProductStatus _newStatus
    ) internal {
        ProductStatus oldStatus = products[_productId].status;
        products[_productId].status = _newStatus;
        
        emit ProductStatusChanged(
            _productId,
            oldStatus,
            _newStatus,
            block.timestamp
        );
    }
    
    /**
     * @dev Authorize or revoke warehouse access
     * @param _warehouse Warehouse address
     * @param _authorized Authorization status
     */
    function setWarehouseAuthorization(
        address _warehouse,
        bool _authorized
    ) external onlyOwner {
        require(_warehouse != address(0), "Invalid warehouse address");
        authorizedWarehouses[_warehouse] = _authorized;
        
        emit WarehouseAuthorized(_warehouse, _authorized, block.timestamp);
    }
    
    /**
     * @dev Get product movement history
     * @param _productId Product ID
     * @return movementIds Array of movement IDs
     */
    function getProductMovementHistory(
        uint256 _productId
    ) external view productExists(_productId) returns (uint256[] memory) {
        return productMovements[_productId];
    }
    
    /**
     * @dev Get product details
     * @param _productId Product ID
     * @return Product struct
     */
    function getProduct(
        uint256 _productId
    ) external view productExists(_productId) returns (Product memory) {
        return products[_productId];
    }
    
    /**
     * @dev Get product ID by SKU
     * @param _sku Product SKU
     * @return productId Product ID
     */
    function getProductIdBySKU(
        string memory _sku
    ) external view returns (uint256) {
        uint256 productId = skuToProductId[_sku];
        require(productId != 0, "Product not found");
        return productId;
    }
    
    /**
     * @dev Get movement details
     * @param _movementId Movement ID
     * @return Movement struct
     */
    function getMovement(
        uint256 _movementId
    ) external view returns (Movement memory) {
        require(_movementId > 0 && _movementId <= movementCount, "Invalid movement ID");
        return movements[_movementId];
    }
    
    /**
     * @dev Verify product authenticity
     * @param _productId Product ID
     * @param _expectedManufacturer Expected manufacturer address
     * @return isAuthentic Boolean indicating authenticity
     */
    function verifyProductAuthenticity(
        uint256 _productId,
        address _expectedManufacturer
    ) external view productExists(_productId) returns (bool) {
        return products[_productId].manufacturer == _expectedManufacturer;
    }
    
    /**
     * @dev Transfer ownership
     * @param _newOwner New owner address
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner address");
        owner = _newOwner;
    }
}
