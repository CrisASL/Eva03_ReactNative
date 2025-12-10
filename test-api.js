const API_URL = 'https://basic-hono-api.borisbelmarm.workers.dev';

async function test() {
  const email = `test_agent_${Date.now()}@example.com`;
  const password = 'password123';

  console.log('Registering user:', email);
  try {
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const regText = await regRes.text();
    console.log('Register status:', regRes.status);
    console.log('Register response:', regText);

    if (regRes.ok) {
      console.log('Logging in...');
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const loginText = await loginRes.text();
      console.log('Login status:', loginRes.status);
      console.log('Login response:', loginText);
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
