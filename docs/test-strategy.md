# Focused test strategy

Use the smallest relevant command while iterating. All commands below use the
repository's mocked infrastructure and do not contact Stellar or production
databases.

## API and application boundaries

```sh
npx jest src/api-auth-boundaries.spec.ts --runInBand
npx jest src/app.controller.spec.ts --runInBand
```

These cover authentication and the application controller without starting a
server.

## Contracts, persistence, and WebAuthn flows

```sh
npx jest src/contracts/payment-request.v1.spec.ts --runInBand
npx jest src/database/prisma.service.spec.ts --runInBand
npx jest src/stellar/stellar.service.spec.ts --runInBand
npx jest src/webauthn --runInBand
npx jest test/payment-requests-validate.e2e-spec.ts test/payment-requests-persist.e2e-spec.ts --runInBand
npx jest test/payments-full-flow.e2e-spec.ts test/webauthn-payments.e2e-spec.ts --runInBand
```

The payment-flow suites use the test environment and mocks. They do not prove a
physical NFC or passkey ceremony, nor do they submit a transaction to Horizon.

## Configuration, database, and testnet helpers

```sh
npx jest test/env.validation.spec.ts --runInBand
npm run prisma:generate
npm run check:testnet
```

The Prisma command validates generated client compatibility. The testnet helper
is an explicit network check and must only be run with testnet configuration.

## Full local verification

Run the repository-wide checks before opening a pull request:

```sh
npx eslint "{src,apps,libs,test}/**/*.ts" --no-fix
npx prettier --check .
npx tsc --noEmit
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
```

The end-to-end suite requires the configured local PostgreSQL/Supabase test
environment. Never point it at production. For a live Stellar check, use only
testnet accounts and independently verify the resulting transaction in Horizon.
