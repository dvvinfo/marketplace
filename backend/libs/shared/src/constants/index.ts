export const RABBITMQ_QUEUES = {
  PROMO_CODE_SERVICE: 'promo_code_queue',
  ORDER_SERVICE: 'order_queue',
  PRODUCT_SERVICE: 'product_queue',
  USER_SERVICE: 'user_queue',
  NOTIFICATION_SERVICE: 'notification_queue',
} as const;

export const RABBITMQ_PATTERNS = {
  // PromoCode Service
  VALIDATE_PROMO_CODE: 'validate_promo_code',
  CREATE_PROMO_CODE: 'create_promo_code',
  GET_PROMO_CODE: 'get_promo_code',
  
  // Order Service
  CREATE_ORDER: 'create_order',
  GET_ORDER: 'get_order',
  
  // Product Service
  UPDATE_STOCK: 'update_stock',
  GET_PRODUCT: 'get_product',
} as const;
