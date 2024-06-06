// test/productControllerTest.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../app'); // Ensure you export your express app in app.js
const Product = require('../models/Product');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Product Controller', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  it('should create a new product', async () => {
    const res = await chai.request(app).post('/products').send({ name: 'Test Product', price: 100, description: 'Test Description', category: 'Test Category', stock: 10 });
    expect(res).to.have.status(201);
    expect(res.body).to.include({ name: 'Test Product', price: 100, description: 'Test Description', category: 'Test Category', stock: 10 });
  });

  it('should get all products', async () => {
    await Product.create({ name: 'Test Product', price: 100, description: 'Test Description', category: 'Test Category', stock: 10 });
    const res = await chai.request(app).get('/products');
    expect(res).to.have.status(200);
    expect(res.body).to.have.lengthOf(1);
  });

  it('should get a product by ID', async () => {
    const product = await Product.create({ name: 'Test Product', price: 100, description: 'Test Description', category: 'Test Category', stock: 10 });
    const res = await chai.request(app).get(`/products/${product._id}`);
    expect(res).to.have.status(200);
    expect(res.body).to.include({ name: 'Test Product', price: 100, description: 'Test Description', category: 'Test Category', stock: 10 });
  });

  it('should update a product by ID', async () => {
    const product = await Product.create({ name: 'Test Product', price: 100, description: 'Test Description', category: 'Test Category', stock: 10 });
    const res = await chai.request(app).put(`/products/${product._id}`).send({ price: 150 });
    expect(res).to.have.status(200);
    expect(res.body.price).to.equal(150);
  });

  it('should delete a product by ID', async () => {
    const product = await Product.create({ name: 'Test Product', price: 100, description: 'Test Description', category: 'Test Category', stock: 10 });
    const res = await chai.request(app).delete(`/products/${product._id}`);
    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('Product deleted');
    const foundProduct = await Product.findById(product._id);
    expect(foundProduct).to.be.null;
  });
});
