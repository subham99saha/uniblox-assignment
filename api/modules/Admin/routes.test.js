const request = require('supertest');
const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use('/', routes);

describe('Backend Routes and Services Tests', () => {
    /* 
        Ensuring empty state for all variables before running unit tests
    */
    beforeEach(async () => {
        await request(app).post('/multi/orders').send({
            dataArr: []
        });
        await request(app).post('/multi/discCodes').send({
            dataArr: []
        });
    });

    describe('GET /gen-code/:userId', () => {
        it('should generate a discount code when the user is eligible', async () => {
            await request(app).post('/multi/orders').send({
                dataArr: [
                    { userId: 'test_user', orderId: 1 },
                    { userId: 'test_user', orderId: 2 }
                ]
            });

            const res = await request(app).get('/gen-code/test_user');

            expect(res.statusCode).toBe(200);
            expect(res.body.applicable).toBe(true);
            expect(res.body.code).toBeDefined();
        });

        it('should not generate a discount code when the user is not eligible', async () => {
            await request(app).post('/multi/orders').send({
                dataArr: [
                    { userId: 'test_user', orderId: 1 }
                ]
            });

            const res = await request(app).get('/gen-code/test_user');

            expect(res.statusCode).toBe(200);
            expect(res.body.applicable).toBe(false);
        });
    });

    describe('GET /check-code/:userId/:code', () => {
        it('should validate a discount code if it exists and the user is eligible', async () => {
            await request(app).post('/multi/orders').send({
                dataArr: [
                    { userId: 'test_user', orderId: 1 },
                    { userId: 'test_user', orderId: 2 },
                ]
            });
            await request(app).post('/multi/codes').send({
                dataArr: [
                    { code: 'abc123', used: false }
                ]
            });

            const res = await request(app).get('/check-code/test_user/abc123');

            expect(res.statusCode).toBe(200);
            expect(res.body.valid).toBe(true);
            expect(res.body.message).toBe('Code applied successfully.');
        });

        it('should return invalid if the code does not exist', async () => {
            const res = await request(app).get('/check-code/test_user/invalid123');

            expect(res.statusCode).toBe(200);
            expect(res.body.valid).toBe(false);
            expect(res.body.message).toBe("Invalid code. Code doesn't exist.");
        });

        it('should return invalid if the user is not eligible for the code', async () => {
            await request(app).post('/multi/codes').send({
                dataArr: [
                    { code: 'abc123', used: false }
                ]
            });

            const res = await request(app).get('/check-code/test_user/abc123');

            expect(res.statusCode).toBe(200);
            expect(res.body.valid).toBe(false);
            expect(res.body.message).toBe('You are not applicable for this code.');
        });
    });

    describe('GET /view-codes', () => {
        it('should return all discount codes', async () => {
            await request(app).post('/multi/codes').send({
                dataArr: [
                    { code: 'abc123', used: false }
                ]
            });

            const res = await request(app).get('/view-codes');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([{ code: 'abc123', used: false }]);
        });
    });

    describe('POST /', () => {
        it('should place an order without a discount code', async () => {
            const order = { userId: 'test_user', discountApplied: false };

            const res = await request(app).post('/').send(order);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Order placed successfully.');
        });

        it('should place an order with a discount code and mark it as used', async () => {
            await request(app).post('/multi/codes').send({
                dataArr: [
                    { code: 'abc123', used: false }
                ]
            });

            const order = { userId: 'test_user', orderId: 1, discountApplied: true, discCode: 'abc123' };

            const res = await request(app).post('/').send(order);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Order placed successfully. Discount added.');
        });
    });

    describe('GET /', () => {
        it('should return all orders', async () => {
            await request(app).post('/multi/orders').send({
                dataArr: [
                    { userId: 'test_user', orderId: 1 },
                    { userId: 'test_user', orderId: 2 },
                ]
            });

            const res = await request(app).get('/');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([
                { userId: 'test_user', orderId: 1 },
                { userId: 'test_user', orderId: 2 },
            ]);
        });
    });
});
