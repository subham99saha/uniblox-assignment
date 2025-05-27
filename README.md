# Uniblox Assignment

You are designing an ecommerce store. Clients can add items to their cart and checkout to successfully place an order. Every *n*th order gets a coupon code for 10% discount and can apply to their cart. 

We would like you to design and implement APIs for adding items to cart and checkout functionality. The checkout API would validate if the discount code is valid before giving the discount. 

Building a UI that showcases the functionality is a stretch goal. If you are primarily a backend engineer, you can also submit postman or REST client or equivalent.

The store also has two admin API's:
1. Generate a discount code if the condition above is satisfied.
2. Lists count of items purchased, total purchase amount, list of discount codes and total discount amount. 

You can build this with a technology stack that you are comfortable with. You would push the code to your github repo and share the link once its complete. We would like to see your commits that show progression and thought process as to how you are completing the exercise. 

Things that you will be evaluated on:

1.	Functional code
2.	Code quality
3.	UI in a framework of your choice
4.	Code comments, readme docs
5.	Unit tests

Assumptions you can make:
1.	The API’s don’t need a backend store. It can be an in-memory store.


## FAQ:
**Q**: Can a discount code be used multiple times?

**A**: Discount code can be requested by every user, but is made available for every nth order only. The discount code can be used only once before the next one becomes available on the next nth order.

**Q**: Does the discount code apply to one item?

**A**: Discount code applies to the entire order.

# Interface Instructions

Visit the home page which lists all products and also contains the cart plus checkout interface

![](https://raw.githubusercontent.com/subham99saha/uniblox-assignment/refs/heads/main/snaps/2.png)

Click on **Add to cart** to enable checkout functions. Add and subtract quantity of each item or remove an item entirely. Click on **CHECK FOR DISCOUNTS** to check if it's your _Nth_ order

![](https://raw.githubusercontent.com/subham99saha/uniblox-assignment/refs/heads/main/snaps/3.png)

After clicking on **PLACE ORDER** your order will be placed with or without a discount

![](https://raw.githubusercontent.com/subham99saha/uniblox-assignment/refs/heads/main/snaps/4.png)

Click on **APPLY** after putting in a discount code to check if it's valid

![](https://raw.githubusercontent.com/subham99saha/uniblox-assignment/refs/heads/main/snaps/5.png)

If it is your _Nth_ order, clicking on **CHECK FOR DISCOUNTS** will generate and place a discount code 

![](https://raw.githubusercontent.com/subham99saha/uniblox-assignment/refs/heads/main/snaps/6.png)

Click on **APPLY** to use the generated discount code for your order

![](https://raw.githubusercontent.com/subham99saha/uniblox-assignment/refs/heads/main/snaps/7.png)

If it is not your _Nth_ order, you won't be able to use a discount code even if the code is valid

Visit the admin page to view all orders, count of items purchased, total purchase amount, list of discount codes and total discount amount

![](https://raw.githubusercontent.com/subham99saha/uniblox-assignment/refs/heads/main/snaps/8.png)

# Deployment Instructions
## Run Server

Switch to the _api_ folder
```
cd api
```
Install dependencies
```
npm install
```
Start server
```
npm start
```

## Run UI

Switch to the _ui_ folder
```
cd ui
```
Install dependencies
```
npm install
```
Start front-end
```
npm start
```

*Home:* http://localhost:3000/

*Admin:* http://localhost:3000/admin

# API documentation

## Overview
This API provides endpoints for managing orders and discount codes. It includes functionality for generating discount codes, validating them, placing orders, and viewing order history.

## Base URL
All endpoints are relative to the base URL and chosen PORT of your API server. By default the base url is _http://localhost:5000_

## Endpoints

### Fetch Products
Fetch all available products.

```
GET /products
```

#### Response
```json
[
    {
        "id": 1,
        "title": "Item A",
        "price": 30,
        "image": "a.jpg",
        "description": "Phasellus quis lectus et metus iaculis suscipit eu in tortor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames."
    },
    {
        "id": 2,
        "title": "Item B",
        "price": 50,
        "image": "b.jpg",
        "description": "Aliquam erat volutpat. Praesent interdum ligula sed libero scelerisque, in varius turpis fringilla. Nunc feugiat a nibh non aliquet. Vivamus."
    }
]
```
---
### Generate Discount Code
Generates a discount code for eligible users based on their order history.

```
GET /orders/gen-code/:userId
```

#### Parameters
- `userId` (path parameter): The unique identifier of the user

#### Response
```json
{
  "eligible": true,
  "code": "abcdef"
}
```
OR
```json
{
  "eligible": false
}
```

#### Notes
- Generates a 6-character random code if the user's next order would be their Nth order (where N is configured in config.js)
- Codes are generated using lowercase letters a-z

---

### Check Discount Code
Validates a discount code for a specific user.

```
GET /orders/check-code/:userId/:code
```

#### Parameters
- `userId` (path parameter): The unique identifier of the user
- `code` (path parameter): The discount code to validate

#### Response
```json
{
  "valid": true,
  "message": "Code applied successfully."
}
```
OR
```json
{
  "valid": false,
  "message": "Invalid code. Code doesn't exist."
}
```
OR
```json
{
  "valid": false,
  "message": "You are not eligible for this code."
}
```

#### Notes
- Validates both code existence and user eligibility
- User must be eligible for a discount (Nth order) to use the code

---

### View All Discount Codes
Returns a list of all discount codes in the system.

```
GET /orders/view-codes
```

#### Response
```json
[
  {
    "code": "abcdef",
    "used": false
  }
]
```

---

### Place Order
Creates a new order in the system.

```
POST /orders
```

#### Request Body
```json
{
  "userId": "string",
  "discountApplied": boolean,
  "discCode": "string", // Optional, required if discountApplied is true
  "items": [
    {
        "id": 1, // 1
        "title": "string", // Item A
        "price": "number", // 30
        "image": "string", // a.jpg (url)
        "description": "string",
        "qty": "number" // 3
    }
  ]
}
```

#### Response
```json
{
  "message": "Order placed successfully. Discount added."
}
```
OR
```json
{
  "message": "Order placed successfully."
}
```

#### Notes
- If a discount code is applied, it will be marked as used upon successful order placement

---

### View All Orders
Returns a list of all orders in the system.

```
GET /orders
```

#### Response
```json
[
  {
    "userId": "string",
    "discountApplied": boolean,
    "discCode": "string"
    "items": [
        // List of items...
    ]
  },
  // More orders...
]
```

---

### Bulk Set Orders
Bulk updates the orders database (for testing/administrative purposes).

```
POST orders/multi/orders
```

#### Request Body
```json
{
  "dataArr": [
    // Array of order objects
  ]
}
```

#### Response
```json
{
  "message": "Data set successfully"
}
```

---

### Bulk Set Discount Codes
Bulk updates the discount codes database (for testing/administrative purposes).

```
POST orders/multi/codes
```

#### Request Body
```json
{
  "dataArr": [
    // Array of discount code objects
  ]
}
```

#### Response
```json
{
  "message": "Data set successfully"
}
```

## Data Models

### Product Object
```json
{
    "id": 1, // 1
    "title": "string", // Item A
    "price": "number", // 30
    "image": "string", // a.jpg (url)
    "description": "string"
}
```

### Order Object
```json
{
  "userId": "string",
  "discountApplied": boolean,
  "discCode": "string",
  "items": array
}
```

### Discount Code Object
```json
{
  "code": "string",
  "used": boolean
}
```

## Technical Notes
- The API uses an in-memory store for both orders and discount codes
- The discount eligibility is based on the configuration value `N` from config.js
- All discount codes are case-insensitive during validation

