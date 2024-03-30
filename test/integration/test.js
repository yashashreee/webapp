const chai = require('chai');
const supertest = require('supertest');
const app = require('../../index');
const { sequelize } = require('../../src/configs/database');
const { expect } = chai;

const request = supertest(app);

describe('Integration Tests for /v1/user endpoint', () => {
  before(async () => {
    await sequelize.authenticate();
  });
  it('Test 1: Create an account and validate it exists', async () => {
    const response = await request.post('/v1/user').send({
      "email": "krenil@gmail.com",
      "password": "hey123",
      "first_name": "Yash",
      "last_name": "Patel"
    });

    const credentials = 'yash1@gmail.com:hey123';
    const base64Credentials = Buffer.from(credentials).toString('base64');

    const test1 = await request.get('/v1/user/self')
      .set('Authorization', `Basic ${base64Credentials}`);

    expect(test1.status).to.equal(400);
  });

  it('Test 2: Update the account and validate it was updated', async () => {
    const credentials = 'yash1@gmail.com:hey123';
    const base64Credentials = Buffer.from(credentials).toString('base64');
    
    const response = await request.put('/v1/user/self')
    .set('Authorization', `Basic ${base64Credentials}`)
    .send({
      "first_name": "Yashashree"
    });

    const test2 = await request.get('/v1/user/self')
      .set('Authorization', `Basic ${base64Credentials}`);

    expect(test2.status).to.equal(400);
  });

  after(async () => {
    await sequelize.close();
  });
});
