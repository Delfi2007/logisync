// Distance Calculator Utility (JavaScript version for backend)
// Calculates distance between two locations using coordinates or pincode-based estimation

/**
 * Calculates the distance between two points using the Haversine formula
 * @param {Object} coord1 - First coordinate point {lat, lng}
 * @param {Object} coord2 - Second coordinate point {lat, lng}
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in kilometers
  
  const lat1 = toRadians(coord1.lat);
  const lat2 = toRadians(coord2.lat);
  const deltaLat = toRadians(coord2.lat - coord1.lat);
  const deltaLng = toRadians(coord2.lng - coord1.lng);
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const distance = R * c; // Distance in kilometers
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Estimates coordinates based on pincode (simplified approach)
 * In production, this should use a pincode-to-coordinates API
 * @param {string} pincode - 6-digit Indian pincode
 * @returns {Object|null} Estimated coordinates {lat, lng}
 */
export function pincodeToCoordinates(pincode) {
  // Pincode format validation
  if (!/^\d{6}$/.test(pincode)) {
    return null;
  }

  // Extract region from first digit of pincode
  const region = parseInt(pincode.charAt(0));
  
  // Simplified pincode to region mapping (approximate center coordinates)
  const regionCoordinates = {
    1: { lat: 28.7041, lng: 77.1025 }, // Delhi (110xxx)
    2: { lat: 19.0760, lng: 72.8777 }, // Mumbai (400xxx)
    3: { lat: 23.0225, lng: 72.5714 }, // Gujarat/Rajasthan
    4: { lat: 17.3850, lng: 78.4867 }, // Hyderabad (500xxx)
    5: { lat: 12.9716, lng: 77.5946 }, // Bangalore (560xxx)
    6: { lat: 13.0827, lng: 80.2707 }, // Chennai (600xxx)
    7: { lat: 22.5726, lng: 88.3639 }, // Kolkata (700xxx)
    8: { lat: 26.9124, lng: 75.7873 }, // Jaipur
    9: { lat: 21.1458, lng: 79.0882 }, // Nagpur
  };
  
  return regionCoordinates[region] || null;
}

/**
 * Calculates distance using pincodes (converts to coordinates first)
 * @param {string} pincode1 - First location pincode
 * @param {string} pincode2 - Second location pincode
 * @returns {number|null} Distance in kilometers or null if pincodes are invalid
 */
export function calculateDistanceByPincode(pincode1, pincode2) {
  const coord1 = pincodeToCoordinates(pincode1);
  const coord2 = pincodeToCoordinates(pincode2);
  
  if (!coord1 || !coord2) {
    return null;
  }
  
  return calculateDistance(coord1, coord2);
}

/**
 * Formats distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted string
 */
export function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)} km`;
  } else {
    return `${Math.round(distance)} km`;
  }
}

/**
 * Calculates estimated delivery time based on distance
 * @param {number} distance - Distance in kilometers
 * @returns {number} Estimated delivery time in hours
 */
export function estimateDeliveryTime(distance) {
  // Assumptions:
  // - Local delivery (< 50km): 4-6 hours
  // - Regional delivery (50-300km): 1-2 days
  // - Long distance (> 300km): 2-5 days
  
  if (distance < 50) {
    return 6; // 6 hours
  } else if (distance < 300) {
    return 36; // 1.5 days
  } else {
    return 72; // 3 days
  }
}

/**
 * Formats delivery time for display
 * @param {number} hours - Delivery time in hours
 * @returns {string} Formatted string
 */
export function formatDeliveryTime(hours) {
  if (hours < 24) {
    return `${hours} hours`;
  } else {
    const days = Math.ceil(hours / 24);
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
}

export default {
  calculateDistance,
  pincodeToCoordinates,
  calculateDistanceByPincode,
  formatDistance,
  estimateDeliveryTime,
  formatDeliveryTime
};
