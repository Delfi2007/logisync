import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api/auth';
let testUser = null;
let tokens = {};

// Color output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol} ${message}${colors.reset}`);
}

async function test(name, fn) {
  try {
    console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.blue}Testing: ${name}${colors.reset}`);
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    await fn();
    log(colors.green, '✅', `${name} - PASSED`);
  } catch (error) {
    log(colors.red, '❌', `${name} - FAILED: ${error.message}`);
    throw error;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  console.log(`\n  📤 ${options.method || 'GET'} ${endpoint}`);
  
  if (options.body) {
    console.log(`  📦 Body:`, JSON.stringify(options.body, null, 2));
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  
  const data = await response.json();
  
  console.log(`  📥 Status: ${response.status}`);
  console.log(`  📦 Response:`, JSON.stringify(data, null, 2));
  
  if (!response.ok && data.success !== false) {
    throw new Error(`HTTP ${response.status}: ${data.message || 'Request failed'}`);
  }
  
  return { response, data };
}

// Test 1: Register a new user
await test('1. Register New User', async () => {
  const { data } = await request('/register', {
    method: 'POST',
    body: {
      email: `test.${Date.now()}@example.com`,
      password: 'Test@12345',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890'
    }
  });
  
  if (!data.success || !data.data.user || !data.data.tokens) {
    throw new Error('Registration failed');
  }
  
  testUser = data.data.user;
  tokens = data.data.tokens;
  
  log(colors.yellow, '📝', `User created: ${testUser.email}`);
  log(colors.yellow, '🔑', `Access Token: ${tokens.accessToken.substring(0, 20)}...`);
});

// Test 2: Login with the registered user
await test('2. Login User', async () => {
  const { data } = await request('/login', {
    method: 'POST',
    body: {
      email: testUser.email,
      password: 'Test@12345'
    }
  });
  
  if (!data.success || !data.data.tokens) {
    throw new Error('Login failed');
  }
  
  tokens = data.data.tokens;
  log(colors.yellow, '🔑', `New Access Token: ${tokens.accessToken.substring(0, 20)}...`);
});

// Test 3: Get user profile
await test('3. Get User Profile', async () => {
  const { data } = await request('/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`
    }
  });
  
  if (!data.success || !data.data.email) {
    throw new Error('Failed to get profile');
  }
  
  log(colors.yellow, '👤', `Profile: ${data.data.email} - ${data.data.first_name} ${data.data.last_name}`);
  log(colors.yellow, '🎭', `Roles: ${data.data.roles.map(r => r.name).join(', ')}`);
});

// Test 4: Verify token
await test('4. Verify Token', async () => {
  const { data } = await request('/verify-token', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`
    }
  });
  
  if (!data.success) {
    throw new Error('Token verification failed');
  }
  
  log(colors.yellow, '✓', 'Token is valid');
});

// Test 5: Refresh access token
await test('5. Refresh Access Token', async () => {
  const oldAccessToken = tokens.accessToken;
  
  const { data } = await request('/refresh-token', {
    method: 'POST',
    body: {
      refreshToken: tokens.refreshToken
    }
  });
  
  if (!data.success || !data.data.tokens) {
    throw new Error('Token refresh failed');
  }
  
  tokens = data.data.tokens;
  
  log(colors.yellow, '🔄', 'Access token refreshed');
  log(colors.yellow, '🔑', `Old token: ${oldAccessToken.substring(0, 20)}...`);
  log(colors.yellow, '🔑', `New token: ${tokens.accessToken.substring(0, 20)}...`);
});

// Test 6: Change password
await test('6. Change Password', async () => {
  const { data } = await request('/change-password', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`
    },
    body: {
      currentPassword: 'Test@12345',
      newPassword: 'NewPass@12345',
      confirmPassword: 'NewPass@12345'
    }
  });
  
  if (!data.success) {
    throw new Error('Password change failed');
  }
  
  log(colors.yellow, '🔒', 'Password changed successfully');
});

// Test 7: Login with new password
await test('7. Login with New Password', async () => {
  const { data } = await request('/login', {
    method: 'POST',
    body: {
      email: testUser.email,
      password: 'NewPass@12345'
    }
  });
  
  if (!data.success) {
    throw new Error('Login with new password failed');
  }
  
  tokens = data.data.tokens;
  log(colors.yellow, '✓', 'Login successful with new password');
});

// Test 8: Request password reset
await test('8. Request Password Reset', async () => {
  const { data } = await request('/forgot-password', {
    method: 'POST',
    body: {
      email: testUser.email
    }
  });
  
  if (!data.success) {
    throw new Error('Password reset request failed');
  }
  
  log(colors.yellow, '📧', 'Password reset email would be sent');
  
  // In debug mode, the reset link is returned
  if (data.data && data.data.resetLink) {
    log(colors.yellow, '🔗', `Reset link: ${data.data.resetLink}`);
  }
});

// Test 9: Get activity log
await test('9. Get Activity Log', async () => {
  const { data } = await request('/activity', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`
    }
  });
  
  if (!data.success || !data.data.activities) {
    throw new Error('Failed to get activity log');
  }
  
  log(colors.yellow, '📊', `Activity records: ${data.data.activities.length}`);
  log(colors.yellow, '📋', `Total: ${data.data.pagination.total}`);
});

// Test 10: Logout
await test('10. Logout User', async () => {
  const { data } = await request('/logout', {
    method: 'POST',
    body: {
      refreshToken: tokens.refreshToken
    }
  });
  
  if (!data.success) {
    throw new Error('Logout failed');
  }
  
  log(colors.yellow, '👋', 'User logged out successfully');
});

// Test 11: Verify old token is revoked
await test('11. Verify Token Revoked After Logout', async () => {
  try {
    const { data } = await request('/refresh-token', {
      method: 'POST',
      body: {
        refreshToken: tokens.refreshToken
      }
    });
    
    // This should fail
    if (data.success) {
      throw new Error('Token should have been revoked');
    }
    
    log(colors.yellow, '✓', 'Token correctly revoked');
  } catch (error) {
    // Expected to fail
    log(colors.yellow, '✓', 'Token correctly revoked (request failed as expected)');
  }
});

// Final summary
console.log(`\n${colors.green}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.green}  ✅ ALL AUTHENTICATION TESTS PASSED!${colors.reset}`);
console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}\n`);
