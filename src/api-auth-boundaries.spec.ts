import 'reflect-metadata';
import { AppController } from './app.controller';
import { IS_PUBLIC_KEY } from './auth/decorators/public.decorator';
import { PaymentRequestsController } from './modules/payment-requests/payment-requests.controller';
import { UsersController } from './modules/users/users.controller';
import { TransactionsController } from './modules/transactions/transactions.controller';

function isPublic(target: object, method: string): boolean {
  return Reflect.getMetadata(IS_PUBLIC_KEY, target, method) === true;
}

describe('API authentication boundaries', () => {
  it('keeps only health and stateless validation routes public', () => {
    expect(isPublic(AppController.prototype, 'getHealth')).toBe(true);
    expect(isPublic(AppController.prototype, 'getReadiness')).toBe(true);
    expect(isPublic(AppController.prototype, 'getStellarHealth')).toBe(true);
    expect(isPublic(PaymentRequestsController.prototype, 'validate')).toBe(true);
  });

  it('does not accidentally expose stateful or user-scoped routes', () => {
    expect(isPublic(PaymentRequestsController.prototype, 'create')).toBe(false);
    expect(isPublic(PaymentRequestsController.prototype, 'findByExternalRequestId')).toBe(false);
    expect(isPublic(UsersController.prototype, 'getMe')).toBe(false);
    expect(isPublic(UsersController.prototype, 'linkWallet')).toBe(false);
    expect(isPublic(TransactionsController.prototype, 'simulate')).toBe(false);
    expect(isPublic(TransactionsController.prototype, 'list')).toBe(false);
  });
});
