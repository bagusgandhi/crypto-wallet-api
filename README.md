# **NestJS Crypto Wallet API**

Welcome to the NestJS Crypto Wallet API! This API allows you to manage crypto wallets, perform transactions, and more.

## **Table of Contents**

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the App](#running-the-app)
  - [Running in Docker](#running-in-docker)
- [Usage](#usage)
  - [Endpoints](#endpoints)
  - [Authentication](#authentication)
- [License](#license)

## **Getting Started**

### **Installation**

To install the NestJS Crypto Wallet API, follow these steps:


```bash

$ git clone https://github.com/bagusgandhi/crypto-wallet-api.git

$ cd ./crypto-wallet-api

$ npm install
```


### **Configuration**

Copy the .env.example file to .env and fill in the required values.


```bash
$ cp .env.example .env
```

In .env file, the **DATABASE_URL** content should be like this:


```bash
DATABASE_URL="postgresql://username:password@hostname:port/dbname"
```

Then fill the **JWT_SECRET** with your randomstring as a secret


```bash
JWT_SECRET="your-random-string"
```

After that, run **prisma generate** and **prisma migrate**


```bash
$ npx prisma generate

$ npx prisma migrate dev
```


### **Running the app**

For running the app, you can choose as you needed 

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

For running the test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### **Running in Docker**

For running the app in Docker, first you need create content database cred in your .env for create database container like this:

```bash
DATABASE_USERNAME="your user"
DATABASE_PASSWORD="your database password"
DATABASE_NAME="your database name"
```
For more detail, you can see the docker-compose.yml file in:

```bash
$ cat ./docker-compose.yml
```

Run docker compose up

```bash
$ docker compose up -d --build
```

Run docker exec for **prisma migrate** 

```bash
$ docker exec crypto-wallet-api npx prisma migrate dev
```


## **Usage**

### **Endpoints**

The Endpoints Documentation you can acces in this link:
[Crypto Wallet Api](https://crypto-wallet-api.bagusgandhi.web.id/api)


### **Authentication**

This API uses API keys for authentication. Include your API token in the headers of your requests. You can get the token after request register endpoint


```bash
Authorization: Bearer YOUR_API_TOKEN
```

## **Lisence**

This project is licensed under the MIT License.
