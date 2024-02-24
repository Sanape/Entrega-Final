import supertest from 'supertest';
import { expect } from 'chai';
import config from '../config.js';

const requester = supertest(config.URL_FRONTEND);

let token;
let currentCartId;

describe('Pruebas de cart route', () => {
  before(async () => {
    const user = {
      email: 'adminCoder@coder.com',
      password: 'adminCod3r123$',
    };

    const response = await requester.post('/api/sessions/login').send(user);

    token = response._body.message.token;
  });

  it('should get cart of actual user', async () => {
    const response = await requester
      .get('/api/carts')
      .set('Authorization', 'Bearer ' + token);

    expect(response.statusCode).to.be.equal(200);

    expect(response._body).to.have.property('message');
    expect(response._body.message).to.have.property('id');
    currentCartId = response._body.message.id;
    expect(response._body.message).to.have.property('userId');
    expect(response._body.message.userId).to.be.equal(18);
    expect(response._body.message).to.have.property('products');
  });

  it('should get history of carts', async () => {
    const response = await requester
      .get('/api/carts/history')
      .set('Authorization', 'Bearer ' + token);

    expect(response.statusCode).to.be.equal(200);

    expect(response._body).to.have.property('message');

    expect(response._body.message[0]).to.have.property('bought');

    expect(response._body.message[0].bought).to.be.true;
  });

  it('should add product to cart', async () => {
    const response = await requester
      .post('/api/carts/')
      .set('Authorization', 'Bearer ' + token)
      .send({
        cartId: currentCartId,
        productId: 1,
      });

    expect(response.statusCode).to.be.equal(201);

    expect(response._body).to.have.property('message');

    expect(response._body.message).to.be.equal('Product added to cart');
  });

  it('should delete product from cart', async () => {
    const response = await requester
      .delete('/api/carts/' + currentCartId + '/product/1')
      .set('Authorization', 'Bearer ' + token);

    expect(response.statusCode).to.be.equal(200);

    expect(response._body).to.have.property('message');

    expect(response._body.message).to.be.equal('Product remove from cart');
  });
});
