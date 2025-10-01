// src/services/sweeping.service.ts

import {
  SimulatedWalletService,
  WalletId,
  NotEnoughGasError,
  NotEnoughTokenError,
} from './wallet.service';

// 1. Define the interface that was missing
export interface SweepingService {
  /**
   * Sweep all funds from the user wallet to a specified address.
   * @param walletIds - Wallets to sweep from
   * @param toAddress - Target address for sweeping funds
   * @returns {Promise<void>}
   */
  sweepAll(walletIds: WalletId[], toAddress: WalletId): Promise<void>;
}

// 2. Implement the class based on the interface
export class TaskSweepingService implements SweepingService {
  constructor(
    private walletService: SimulatedWalletService,
    private mainWalletId: string,
  ) {}

  // 3. Implement the sweeping logic required by the tests
  async sweepAll(walletIds: WalletId[], toWalletId: WalletId): Promise<void> {
    for (const fromWalletId of walletIds) {
      try {
        const usdtBalance = this.walletService.getBalance(fromWalletId, 'USDT');

        // Only attempt a transaction if there's something to sweep
        if (usdtBalance > 0) {
          this.walletService.send(
            fromWalletId,
            toWalletId,
            'USDT',
            usdtBalance,
          );
        }
      } catch (error) {
        // The tests expect us to silently ignore wallets that fail to sweep
        // (e.g., due to insufficient gas). We can log this for debugging.
        if (
          error instanceof NotEnoughGasError ||
          error instanceof NotEnoughTokenError
        ) {
          // console.log(`Skipping wallet ${fromWalletId}: Not enough funds for sweep.`);
        } else {
          // If it's a different, unexpected error, we should probably know about it.
          console.error(
            `An unexpected error occurred while sweeping wallet ${fromWalletId}:`,
            error,
          );
        }
      }
    }
  }
}