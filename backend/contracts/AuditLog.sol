// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AuditLog
 * @dev Immutable blockchain audit trail for system events
 * @notice Records all critical system events with cryptographic integrity
 */
contract AuditLog {
    
    // State variables
    address public owner;
    uint256 public logCount;
    
    // Structs
    struct LogEntry {
        uint256 id;
        address actor;
        string eventType;
        string resource;
        string action;
        string details;
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
    
    // Mappings
    mapping(uint256 => LogEntry) public logs;
    mapping(address => uint256[]) public actorLogs;
    mapping(string => uint256[]) public eventTypeLogs;
    mapping(string => uint256[]) public resourceLogs;
    
    // Events
    event LogRecorded(
        uint256 indexed logId,
        address indexed actor,
        string eventType,
        string resource,
        uint256 timestamp
    );
    
    event SuspiciousActivityDetected(
        address indexed actor,
        string eventType,
        string reason,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        logCount = 0;
    }
    
    /**
     * @dev Record a new audit log entry
     * @param _eventType Type of event
     * @param _resource Resource being accessed/modified
     * @param _action Action performed
     * @param _details Additional details (JSON string)
     * @param _ipAddress IP address of actor
     * @param _userAgent User agent string
     * @return logId The ID of the recorded log
     */
    function recordLog(
        string memory _eventType,
        string memory _resource,
        string memory _action,
        string memory _details,
        string memory _ipAddress,
        string memory _userAgent
    ) external returns (uint256) {
        logCount++;
        uint256 newLogId = logCount;
        
        bytes32 dataHash = keccak256(
            abi.encodePacked(
                msg.sender,
                _eventType,
                _resource,
                _action,
                _details,
                block.timestamp
            )
        );
        
        logs[newLogId] = LogEntry({
            id: newLogId,
            actor: msg.sender,
            eventType: _eventType,
            resource: _resource,
            action: _action,
            details: _details,
            timestamp: block.timestamp,
            dataHash: dataHash,
            ipAddress: _ipAddress,
            userAgent: _userAgent
        });
        
        actorLogs[msg.sender].push(newLogId);
        eventTypeLogs[_eventType].push(newLogId);
        resourceLogs[_resource].push(newLogId);
        
        emit LogRecorded(
            newLogId,
            msg.sender,
            _eventType,
            _resource,
            block.timestamp
        );
        
        // Detect suspicious patterns
        _detectSuspiciousActivity(msg.sender, _eventType);
        
        return newLogId;
    }
    
    /**
     * @dev Get log entry
     * @param _logId Log ID
     * @return LogEntry struct
     */
    function getLog(uint256 _logId) external view returns (LogEntry memory) {
        require(_logId > 0 && _logId <= logCount, "Log does not exist");
        return logs[_logId];
    }
    
    /**
     * @dev Get logs by actor
     * @param _actor Actor address
     * @return Array of log IDs
     */
    function getLogsByActor(address _actor) external view returns (uint256[] memory) {
        return actorLogs[_actor];
    }
    
    /**
     * @dev Get logs by event type
     * @param _eventType Event type
     * @return Array of log IDs
     */
    function getLogsByEventType(string memory _eventType) external view returns (uint256[] memory) {
        return eventTypeLogs[_eventType];
    }
    
    /**
     * @dev Get logs by resource
     * @param _resource Resource name
     * @return Array of log IDs
     */
    function getLogsByResource(string memory _resource) external view returns (uint256[] memory) {
        return resourceLogs[_resource];
    }
    
    /**
     * @dev Get recent logs
     * @param _count Number of recent logs to return
     * @return Array of LogEntry structs
     */
    function getRecentLogs(uint256 _count) external view returns (LogEntry[] memory) {
        if (_count > logCount) {
            _count = logCount;
        }
        
        LogEntry[] memory recentLogs = new LogEntry[](_count);
        for (uint256 i = 0; i < _count; i++) {
            recentLogs[i] = logs[logCount - i];
        }
        
        return recentLogs;
    }
    
    /**
     * @dev Verify log integrity
     * @param _logId Log ID
     * @return Valid integrity status
     */
    function verifyLogIntegrity(uint256 _logId) external view returns (bool) {
        require(_logId > 0 && _logId <= logCount, "Log does not exist");
        
        LogEntry memory log = logs[_logId];
        bytes32 expectedHash = keccak256(
            abi.encodePacked(
                log.actor,
                log.eventType,
                log.resource,
                log.action,
                log.details,
                log.timestamp
            )
        );
        
        return log.dataHash == expectedHash;
    }
    
    /**
     * @dev Detect suspicious activity patterns
     */
    function _detectSuspiciousActivity(address _actor, string memory _eventType) internal {
        uint256[] memory actorHistory = actorLogs[_actor];
        
        // Check for rapid successive attempts (>5 in last minute)
        if (actorHistory.length >= 5) {
            uint256 recentCount = 0;
            uint256 timeWindow = block.timestamp - 1 minutes;
            
            for (uint256 i = actorHistory.length - 1; i >= 0 && i < actorHistory.length; i--) {
                if (logs[actorHistory[i]].timestamp >= timeWindow) {
                    recentCount++;
                    if (recentCount >= 5) {
                        emit SuspiciousActivityDetected(
                            _actor,
                            _eventType,
                            "High frequency access detected",
                            block.timestamp
                        );
                        break;
                    }
                } else {
                    break;
                }
            }
        }
    }
}
