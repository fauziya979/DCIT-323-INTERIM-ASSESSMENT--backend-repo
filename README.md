# Backend

Express + MongoDB backend for the Coinbase Clone full-stack project.

## Features

- User registration
- User login with JWT
- HTTP-only auth cookie support
- Protected profile endpoint
- Crypto listing endpoints
- Top gainers endpoint
- New listings endpoint
- Create custom cryptocurrency entries in MongoDB

## Environment Variables

Create `backend/.env` from [backend/.env.example](backend/.env.example) and set:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Local Development

```bash
cd backend
npm install
npm run dev
```

## Scripts

- `npm run dev` starts the API with nodemon
- `npm start` starts the API in production mode

## API Endpoints

### Auth

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/profile`

### Crypto

- `GET /api/crypto`
- `GET /api/crypto/gainers`
- `GET /api/crypto/new`
- `POST /api/crypto`

## Notes

- `POST /api/crypto` requires authentication.
- `GET /api/profile` requires authentication.
- Authentication works with a Bearer token and also sets an HTTP-only cookie on login.

## Deployment

Recommended platforms: Render or Railway.

Set these environment variables in production:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `NODE_ENV=production`

Start command:

```bash
npm start
```

## Security

- Do not commit `.env`.
- Rotate any previously exposed secrets before deploying.