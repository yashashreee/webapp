const chai = require('chai');
const supertest = require('supertest');
const app = require('../../index');
const logger = require('../../logger/index');
const { sequelize } = require('../../src/configs/database');
const { expect } = chai;

const request = supertest(app);

describe('Integration Tests for /v1/user endpoint', () => {
  before(async () => {
    logger.info('Sequelize connection status:', await sequelize.authenticate());
    console.log('Sequelize connection status:', await sequelize.authenticate());
  });
  it('Test 1: Create an account and validate it exists', async () => {
    const response = await request.post('/v1/user').send({
      "email": "yash1@gmail.com",
      "password": "hey123",
      "first_name": "Yash",
      "last_name": "Patel"
    });

    const credentials = 'yash1@gmail.com:hey123';
    const base64Credentials = Buffer.from(credentials).toString('base64');

    const getResponse = await request.get('/v1/user/self')
      .set('Authorization', `Basic ${base64Credentials}`);

    expect(getResponse.status).to.equal(200);
  });

  it('Test 2: Update the account and validate it was updated', async () => {
    const credentials = 'yash1@gmail.com:hey123';
    const base64Credentials = Buffer.from(credentials).toString('base64');
    
    const response = await request.put('/v1/user/self')
    .set('Authorization', `Basic ${base64Credentials}`)
    .send({
      "first_name": "Yashashree"
    });

    const getResponse = await request.get('/v1/user/self')
      .set('Authorization', `Basic ${base64Credentials}`);

    expect(getResponse.status).to.equal(200);
  });

  after(async () => {
    await sequelize.close();
    logger.info('Sequelize connection closed.');
    console.log('Sequelize connection closed.');
  });
});
