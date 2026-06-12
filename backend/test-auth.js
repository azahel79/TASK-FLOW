const http = require('http');

function makeRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('=== TEST 1: Sin token (debe fallar) ===');
  let r = await makeRequest('GET', '/api/projects');
  console.log(`Status: ${r.status} - ${r.body.message || 'OK'}`);

  console.log('\n=== TEST 2: Registrar usuario ===');
  r = await makeRequest('POST', '/api/auth/register', { name: 'Test User', email: 'test@test.com', password: 'test123' });
  console.log(`Status: ${r.status}`);
  console.log(`Token: ${r.body.data?.token ? 'RECIBIDO' : 'NO'}`);

  console.log('\n=== TEST 3: Login ===');
  r = await makeRequest('POST', '/api/auth/login', { email: 'carlos@example.com', password: 'password123' });
  console.log(`Status: ${r.status}`);
  const token = r.body.data?.token;
  console.log(`Token: ${token ? token.substring(0, 30) + '...' : 'NO'}`);

  console.log('\n=== TEST 4: Profile con token ===');
  r = await makeRequest('GET', '/api/auth/profile', null, token);
  console.log(`Status: ${r.status} - Usuario: ${r.body.data?.name}`);

  console.log('\n=== TEST 5: Proyectos con token ===');
  r = await makeRequest('GET', '/api/projects', null, token);
  console.log(`Status: ${r.status} - Proyectos: ${r.body.data?.length}`);

  console.log('\n✅ Todas las pruebas completadas!');
}

test().catch(console.error);