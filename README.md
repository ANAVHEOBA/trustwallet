# TrustWallet

A secure cryptocurrency wallet application built with Node.js, Express, and TypeScript.

## Features

- Wallet generation and management
- Cryptocurrency balance tracking
- Secure transfer system with admin approval
- JWT-based authentication
- Multi-wallet support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Scripts

- `npm run clean` - Clean the build directory
- `npm run build` - Build the TypeScript code
- `npm start` - Run the production server
- `npm run dev` - Run the development server with hot reload
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── config/         # Configuration files
├── modules/        # Feature modules (wallet, crypto, etc.)
├── middleware/     # Express middleware
├── guards/         # Authentication guards
└── utils/         # Utility functions
```

## License

ISC 