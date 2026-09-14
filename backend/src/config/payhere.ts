import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export const PAYHERE_CONFIG = {
  merchantId: process.env.PAYHERE_MERCHANT_ID || '1238014',
  merchantSecret: process.env.PAYHERE_MERCHANT_SECRET || '',
  environment: process.env.PAYHERE_ENVIRONMENT || 'sandbox',
  currency: process.env.PAYHERE_CURRENCY || 'LKR',
  returnUrl: process.env.PAYHERE_RETURN_URL || 'http://localhost:3000/payment/success',
  cancelUrl: process.env.PAYHERE_CANCEL_URL || 'http://localhost:3000/payment/failed',
  notifyUrl: process.env.PAYHERE_NOTIFY_URL || 'http://localhost:5000/api/payments/notify',

  get checkoutUrl() {
    return this.environment === 'live'
      ? 'https://www.payhere.lk/pay/checkout'
      : 'https://sandbox.payhere.lk/pay/checkout';
  },
};

// ==========================================
// GENERATE HASH (For Payment Initiation)
// ==========================================
export const generatePaymentHash = (
  orderId: string,
  amount: number,
  currency: string = 'LKR'
): string => {
  const merchantId = PAYHERE_CONFIG.merchantId;
  const merchantSecret = PAYHERE_CONFIG.merchantSecret;

  const formattedAmount = amount.toFixed(2);

  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
  const hash = crypto
    .createHash('md5')
    .update(hashString)
    .digest('hex')
    .toUpperCase();

  return hash;
};

// ==========================================
// VERIFY WEBHOOK SIGNATURE
// ==========================================
export const verifyWebhookSignature = (data: any): boolean => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = data;

    if (!md5sig) return false;

    const hashedSecret = crypto
      .createHash('md5')
      .update(PAYHERE_CONFIG.merchantSecret)
      .digest('hex')
      .toUpperCase();

    const expectedHash = crypto
      .createHash('md5')
      .update(
        `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`
      )
      .digest('hex')
      .toUpperCase();

    return expectedHash === md5sig;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
};