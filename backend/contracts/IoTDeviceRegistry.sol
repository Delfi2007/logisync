// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IoTDeviceRegistry
 * @dev Blockchain registry for IoT devices and sensor data
 * @notice Tracks device registration, sensor data, and device status
 */
contract IoTDeviceRegistry {
    
    // State variables
    address public owner;
    uint256 public deviceCount;
    uint256 public sensorDataCount;
    
    // Structs
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
    
    enum AlertType {
        Temperature,
        Humidity,
        Offline,
        LowBattery,
        Tamper,
        Critical
    }
    
    // Mappings
    mapping(uint256 => Device) public devices;
    mapping(string => uint256) public deviceIdToNumber; // deviceId => id
    mapping(uint256 => SensorData[]) public deviceSensorData;
    mapping(uint256 => DeviceAlert[]) public deviceAlerts;
    mapping(address => uint256[]) public userDevices;
    mapping(uint256 => address[]) public deviceAuthorizedUsers;
    
    // Events
    event DeviceRegistered(
        uint256 indexed deviceId,
        string deviceIdString,
        string deviceType,
        address indexed registeredBy,
        uint256 timestamp
    );
    
    event SensorDataRecorded(
        uint256 indexed sensorDataId,
        uint256 indexed deviceId,
        string sensorType,
        bytes32 dataHash,
        uint256 timestamp
    );
    
    event DeviceStatusChanged(
        uint256 indexed deviceId,
        bool active,
        uint256 timestamp
    );
    
    event AlertTriggered(
        uint256 indexed deviceId,
        string alertType,
        string message,
        uint256 timestamp
    );
    
    event AlertResolved(
        uint256 indexed deviceId,
        uint256 alertIndex,
        uint256 timestamp
    );
    
    event UserAuthorized(
        uint256 indexed deviceId,
        address indexed user,
        uint256 timestamp
    );
    
    event UserRevoked(
        uint256 indexed deviceId,
        address indexed user,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier deviceExists(uint256 _deviceId) {
        require(_deviceId > 0 && _deviceId <= deviceCount, "Device does not exist");
        _;
    }
    
    modifier onlyDeviceOwnerOrAuthorized(uint256 _deviceId) {
        require(
            devices[_deviceId].registeredBy == msg.sender ||
            _isAuthorized(_deviceId, msg.sender),
            "Not authorized"
        );
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        deviceCount = 0;
        sensorDataCount = 0;
    }
    
    /**
     * @dev Register a new IoT device
     * @param _deviceId Unique device identifier
     * @param _deviceType Type of device (e.g., "temperature_sensor", "humidity_sensor")
     * @param _location Device location
     * @param _metadata Additional metadata (JSON string)
     * @return deviceId The ID of the registered device
     */
    function registerDevice(
        string memory _deviceId,
        string memory _deviceType,
        string memory _location,
        string memory _metadata
    ) external returns (uint256) {
        require(bytes(_deviceId).length > 0, "Device ID cannot be empty");
        require(deviceIdToNumber[_deviceId] == 0, "Device already registered");
        
        deviceCount++;
        uint256 newDeviceId = deviceCount;
        
        devices[newDeviceId] = Device({
            id: newDeviceId,
            deviceId: _deviceId,
            deviceType: _deviceType,
            registeredBy: msg.sender,
            registeredAt: block.timestamp,
            active: true,
            location: _location,
            metadata: _metadata,
            lastUpdateTime: block.timestamp
        });
        
        deviceIdToNumber[_deviceId] = newDeviceId;
        userDevices[msg.sender].push(newDeviceId);
        
        emit DeviceRegistered(
            newDeviceId,
            _deviceId,
            _deviceType,
            msg.sender,
            block.timestamp
        );
        
        return newDeviceId;
    }
    
    /**
     * @dev Record sensor data from IoT device
     * @param _deviceId Device ID
     * @param _sensorType Type of sensor (e.g., "temperature", "humidity")
     * @param _value Sensor value
     * @param _unit Unit of measurement
     * @return sensorDataId The ID of the recorded sensor data
     */
    function recordSensorData(
        uint256 _deviceId,
        string memory _sensorType,
        string memory _value,
        string memory _unit
    ) external deviceExists(_deviceId) onlyDeviceOwnerOrAuthorized(_deviceId) returns (uint256) {
        require(devices[_deviceId].active, "Device is not active");
        
        sensorDataCount++;
        bytes32 dataHash = keccak256(
            abi.encodePacked(_deviceId, _sensorType, _value, block.timestamp)
        );
        
        SensorData memory newData = SensorData({
            id: sensorDataCount,
            deviceId: _deviceId,
            sensorType: _sensorType,
            value: _value,
            unit: _unit,
            timestamp: block.timestamp,
            dataHash: dataHash,
            verified: true
        });
        
        deviceSensorData[_deviceId].push(newData);
        devices[_deviceId].lastUpdateTime = block.timestamp;
        
        emit SensorDataRecorded(
            sensorDataCount,
            _deviceId,
            _sensorType,
            dataHash,
            block.timestamp
        );
        
        return sensorDataCount;
    }
    
    /**
     * @dev Batch record sensor data
     * @param _deviceId Device ID
     * @param _sensorTypes Array of sensor types
     * @param _values Array of sensor values
     * @param _units Array of units
     */
    function batchRecordSensorData(
        uint256 _deviceId,
        string[] memory _sensorTypes,
        string[] memory _values,
        string[] memory _units
    ) external deviceExists(_deviceId) onlyDeviceOwnerOrAuthorized(_deviceId) {
        require(devices[_deviceId].active, "Device is not active");
        require(
            _sensorTypes.length == _values.length &&
            _values.length == _units.length,
            "Array length mismatch"
        );
        
        for (uint256 i = 0; i < _sensorTypes.length; i++) {
            sensorDataCount++;
            bytes32 dataHash = keccak256(
                abi.encodePacked(_deviceId, _sensorTypes[i], _values[i], block.timestamp)
            );
            
            SensorData memory newData = SensorData({
                id: sensorDataCount,
                deviceId: _deviceId,
                sensorType: _sensorTypes[i],
                value: _values[i],
                unit: _units[i],
                timestamp: block.timestamp,
                dataHash: dataHash,
                verified: true
            });
            
            deviceSensorData[_deviceId].push(newData);
            
            emit SensorDataRecorded(
                sensorDataCount,
                _deviceId,
                _sensorTypes[i],
                dataHash,
                block.timestamp
            );
        }
        
        devices[_deviceId].lastUpdateTime = block.timestamp;
    }
    
    /**
     * @dev Update device status
     * @param _deviceId Device ID
     * @param _active Active status
     */
    function updateDeviceStatus(
        uint256 _deviceId,
        bool _active
    ) external deviceExists(_deviceId) onlyDeviceOwnerOrAuthorized(_deviceId) {
        devices[_deviceId].active = _active;
        
        emit DeviceStatusChanged(_deviceId, _active, block.timestamp);
    }
    
    /**
     * @dev Trigger alert for device
     * @param _deviceId Device ID
     * @param _alertType Alert type
     * @param _message Alert message
     */
    function triggerAlert(
        uint256 _deviceId,
        string memory _alertType,
        string memory _message
    ) external deviceExists(_deviceId) onlyDeviceOwnerOrAuthorized(_deviceId) {
        DeviceAlert memory newAlert = DeviceAlert({
            deviceId: _deviceId,
            alertType: _alertType,
            message: _message,
            timestamp: block.timestamp,
            resolved: false
        });
        
        deviceAlerts[_deviceId].push(newAlert);
        
        emit AlertTriggered(_deviceId, _alertType, _message, block.timestamp);
    }
    
    /**
     * @dev Resolve alert
     * @param _deviceId Device ID
     * @param _alertIndex Alert index
     */
    function resolveAlert(
        uint256 _deviceId,
        uint256 _alertIndex
    ) external deviceExists(_deviceId) onlyDeviceOwnerOrAuthorized(_deviceId) {
        require(_alertIndex < deviceAlerts[_deviceId].length, "Invalid alert index");
        
        deviceAlerts[_deviceId][_alertIndex].resolved = true;
        
        emit AlertResolved(_deviceId, _alertIndex, block.timestamp);
    }
    
    /**
     * @dev Authorize user to access device
     * @param _deviceId Device ID
     * @param _user User address
     */
    function authorizeUser(
        uint256 _deviceId,
        address _user
    ) external deviceExists(_deviceId) {
        require(
            devices[_deviceId].registeredBy == msg.sender,
            "Only device owner can authorize"
        );
        require(_user != address(0), "Invalid user address");
        require(!_isAuthorized(_deviceId, _user), "User already authorized");
        
        deviceAuthorizedUsers[_deviceId].push(_user);
        
        emit UserAuthorized(_deviceId, _user, block.timestamp);
    }
    
    /**
     * @dev Revoke user access to device
     * @param _deviceId Device ID
     * @param _user User address
     */
    function revokeUser(
        uint256 _deviceId,
        address _user
    ) external deviceExists(_deviceId) {
        require(
            devices[_deviceId].registeredBy == msg.sender,
            "Only device owner can revoke"
        );
        
        address[] storage authorizedUsers = deviceAuthorizedUsers[_deviceId];
        for (uint256 i = 0; i < authorizedUsers.length; i++) {
            if (authorizedUsers[i] == _user) {
                authorizedUsers[i] = authorizedUsers[authorizedUsers.length - 1];
                authorizedUsers.pop();
                emit UserRevoked(_deviceId, _user, block.timestamp);
                break;
            }
        }
    }
    
    /**
     * @dev Get device information
     * @param _deviceId Device ID
     * @return Device struct
     */
    function getDevice(
        uint256 _deviceId
    ) external view deviceExists(_deviceId) returns (Device memory) {
        return devices[_deviceId];
    }
    
    /**
     * @dev Get device by device ID string
     * @param _deviceId Device ID string
     * @return Device struct
     */
    function getDeviceByDeviceId(
        string memory _deviceId
    ) external view returns (Device memory) {
        uint256 deviceNum = deviceIdToNumber[_deviceId];
        require(deviceNum > 0, "Device not found");
        return devices[deviceNum];
    }
    
    /**
     * @dev Get sensor data for device
     * @param _deviceId Device ID
     * @return Array of SensorData structs
     */
    function getDeviceSensorData(
        uint256 _deviceId
    ) external view deviceExists(_deviceId) returns (SensorData[] memory) {
        return deviceSensorData[_deviceId];
    }
    
    /**
     * @dev Get latest sensor data for device
     * @param _deviceId Device ID
     * @param _count Number of latest records to return
     * @return Array of SensorData structs
     */
    function getLatestSensorData(
        uint256 _deviceId,
        uint256 _count
    ) external view deviceExists(_deviceId) returns (SensorData[] memory) {
        SensorData[] memory allData = deviceSensorData[_deviceId];
        uint256 dataLength = allData.length;
        
        if (_count > dataLength) {
            _count = dataLength;
        }
        
        SensorData[] memory latestData = new SensorData[](_count);
        for (uint256 i = 0; i < _count; i++) {
            latestData[i] = allData[dataLength - _count + i];
        }
        
        return latestData;
    }
    
    /**
     * @dev Get device alerts
     * @param _deviceId Device ID
     * @return Array of DeviceAlert structs
     */
    function getDeviceAlerts(
        uint256 _deviceId
    ) external view deviceExists(_deviceId) returns (DeviceAlert[] memory) {
        return deviceAlerts[_deviceId];
    }
    
    /**
     * @dev Get unresolved alerts for device
     * @param _deviceId Device ID
     * @return Array of DeviceAlert structs
     */
    function getUnresolvedAlerts(
        uint256 _deviceId
    ) external view deviceExists(_deviceId) returns (DeviceAlert[] memory) {
        DeviceAlert[] memory allAlerts = deviceAlerts[_deviceId];
        uint256 unresolvedCount = 0;
        
        // Count unresolved alerts
        for (uint256 i = 0; i < allAlerts.length; i++) {
            if (!allAlerts[i].resolved) {
                unresolvedCount++;
            }
        }
        
        // Build array of unresolved alerts
        DeviceAlert[] memory unresolvedAlerts = new DeviceAlert[](unresolvedCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allAlerts.length; i++) {
            if (!allAlerts[i].resolved) {
                unresolvedAlerts[index] = allAlerts[i];
                index++;
            }
        }
        
        return unresolvedAlerts;
    }
    
    /**
     * @dev Get user's devices
     * @param _user User address
     * @return Array of device IDs
     */
    function getUserDevices(address _user) external view returns (uint256[] memory) {
        return userDevices[_user];
    }
    
    /**
     * @dev Get authorized users for device
     * @param _deviceId Device ID
     * @return Array of user addresses
     */
    function getAuthorizedUsers(
        uint256 _deviceId
    ) external view deviceExists(_deviceId) returns (address[] memory) {
        return deviceAuthorizedUsers[_deviceId];
    }
    
    /**
     * @dev Verify sensor data integrity
     * @param _deviceId Device ID
     * @param _dataIndex Data index
     * @param _expectedHash Expected data hash
     * @return Valid integrity status
     */
    function verifySensorDataIntegrity(
        uint256 _deviceId,
        uint256 _dataIndex,
        bytes32 _expectedHash
    ) external view deviceExists(_deviceId) returns (bool) {
        require(_dataIndex < deviceSensorData[_deviceId].length, "Invalid data index");
        
        SensorData memory data = deviceSensorData[_deviceId][_dataIndex];
        return data.dataHash == _expectedHash;
    }
    
    /**
     * @dev Check if user is authorized for device
     */
    function _isAuthorized(uint256 _deviceId, address _user) internal view returns (bool) {
        address[] memory authorizedUsers = deviceAuthorizedUsers[_deviceId];
        for (uint256 i = 0; i < authorizedUsers.length; i++) {
            if (authorizedUsers[i] == _user) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Transfer device ownership
     * @param _deviceId Device ID
     * @param _newOwner New owner address
     */
    function transferDeviceOwnership(
        uint256 _deviceId,
        address _newOwner
    ) external deviceExists(_deviceId) {
        require(
            devices[_deviceId].registeredBy == msg.sender,
            "Only owner can transfer"
        );
        require(_newOwner != address(0), "Invalid new owner address");
        
        devices[_deviceId].registeredBy = _newOwner;
        userDevices[_newOwner].push(_deviceId);
    }
}
