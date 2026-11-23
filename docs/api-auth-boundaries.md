# API authentication boundaries

The server applies `SupabaseAuthGuard` globally. Routes are public only when
they explicitly use the `@Public()` decorator; every other controller method
requires a Supabase JWT in the `Authorization: Bearer <token>` header.

| Boundary | Endpoints | Authentication |
| --- | --- | --- |
| Liveness/readiness | `GET /v1/health`, `GET /v1/health/ready`, `GET /v1/health/stellar` | Public; responses contain health state only |
| Stateless NFC validation | `POST /v1/payment-requests/validate` | Public; validates the supplied payload and does not persist it |
| Payment request ownership | `POST /v1/payment-requests`, `GET /v1/payment-requests/*` | Authenticated; the user identity comes from the verified JWT, not the request body |
| User profile and wallets | `GET /v1/users/me`, `POST /v1/users/me/wallet` | Authenticated |
| Payments and transaction history | `POST /v1/payments/*`, `POST /v1/transactions/simulate`, `GET /v1/transactions` | Authenticated |

The public validation route is intentionally limited to contract validation.
It does not create payment requests, link wallets, sign transactions, or
return user data. Stellar-facing checks may use the configured testnet
provider, but no production keys or signed payloads belong in examples or
logs. Swagger UI is available at `/v1/docs` when enabled; its protected
operations must still be called with a bearer token.

When adding a route, decide its boundary first. Use `@Public()` only for a
route whose response is safe without an account, and add `@ApiBearerAuth()` to
protected controllers so generated OpenAPI documentation reflects the runtime
guard. Update this table and the boundary regression test when the public
surface changes.
