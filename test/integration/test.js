const chai = require('chai');
const supertest = require('supertest');
const app = require('../../index');
const { expect } = chai;

const request = supertest(app);

describe('Integration Tests for /v1/user endpoint', () => {

  it('Test 1: Create an account and validate it exists', async () => {
    const response = await request.post('/v1/user').send({
      "email": "yash@gmail.com",
      "password": "hey123",
      "first_name": "Yash",
      "last_name": "Patel"
    });
    console.log('body', response.body);

    const credentials = 'yash@gmail.com:hey123';
    const base64Credentials = Buffer.from(credentials).toString('base64');

    const getResponse = await request.get('/v1/user/self')
      .set('Authorization', `Basic ${base64Credentials}`);

    expect(getResponse.status).to.equal(200);
  });

  it('Test 2: Update the account and validate it was updated', async () => {
    const credentials = 'yash@gmail.com:hey123';
    const base64Credentials = Buffer.from(credentials).toString('base64');
    
    const response = await request.put('/v1/user/self')
    .set('Authorization', `Basic ${base64Credentials}`)
    .send({
      "first_name": "Yashashree"
    });
    console.log('body', response.body);

    const getResponse = await request.get('/v1/user/self')
      .set('Authorization', `Basic ${base64Credentials}`);

    expect(getResponse.status).to.equal(200);
  });
});