import supertest from 'supertest';
import { expect } from 'chai';
import config from '../config.js';

const requester = supertest(config.URL_FRONTEND);

describe('Pruebas de session route', () => {
  let token;

  it('should register a user', async () => {
    const user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'Password$1234',
    };

    const response = await requester.post('/api/sessions/register').send(user);

    expect(response.statusCode).to.be.equal(201);
    expect(response._body).to.have.property('message');
    expect(response._body.message).to.have.property('user');
    expect(response._body.message).to.have.property('token');
    expect(response._body.message.user).to.have.property('email');
    expect(response._body.message.user.email).to.be.equal('john@example.com');
  });

  it('should login a user', async () => {
    const user = {
      email: 'john@example.com',
      password: 'Password$1234',
    };

    const response = await requester.post('/api/sessions/login').send(user);

    expect(response.statusCode).to.be.equal(200);
    expect(response._body).to.have.property('message');
    expect(response._body.message).to.have.property('user');
    expect(response._body.message).to.have.property('token');
    expect(response._body.message.user).to.have.property('email');
    expect(response._body.message.user.email).to.be.equal('john@example.com');

    token = response._body.message.token;
  });

  it('should get actual user', async () => {
    const response = await requester
      .get('/api/sessions/current')
      .set('Authorization', 'Bearer ' + token);

    expect(response.statusCode).to.be.equal(200);
    expect(response._body).to.have.property('message');
    expect(response._body.message).to.have.property('email');
    expect(response._body.message.email).to.be.equal('john@example.com');

    await requester
      .delete('/api/users')
      .set('Authorization', 'Bearer ' + token);
  });
});
