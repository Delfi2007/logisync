/**
 * Simple debug script to test authentication
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('1. Testing Health...');
  const health = await fetch('http://localhost:5000/health');
  const healthData = await health.json();
  console.log('Health:', healthData);

  console.log('\n2. Testing Register...');
  const registerData = {
    full_name: `Test User ${Date.now()}`,
    email: `testuser${Date.now()}@example.com`,
    password: 'Test@12345',
  };
  console.log('Register data:', registerData);
  
  const register = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerData),
  });
  const registerResponse = await register.json();
  console.log('Register response:', JSON.stringify(registerResponse, null, 2));

  if (registerResponse.token) {
    console.log('\n3. Testing authenticated request with token...');
    const products = await fetch(`${BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${registerResponse.token}`,
      },
    });
    const productsData = await products.json();
    console.log('Products response:', JSON.stringify(productsData, null, 2));
  }
}

testAuth().catch(console.error);
