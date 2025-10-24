export const RABBITMQ_QUEUES = {
  PROMO_CODE_SERVICE: 'promo_code_queue',
  PRODUCT_SERVICE: 'product_queue',
  ORDER_SERVICE: 'order_queue',
  USER_SERVICE: 'user_queue',
  NOTIFICATION_SERVICE: 'notification_queue',
} as const;

export const RABBITMQ_PATTERNS = {
  // PromoCode Service
  VALIDATE_PROMO_CODE: 'validate_promo_code',
  CREATE_PROMO_CODE: 'create_promo_code',
  GET_PROMO_CODE: 'get_promo_code',
  
  // Product Service
  GET_ALL_PRODUCTS: 'get_all_products',
  SEARCH_PRODUCTS: 'search_products',
  GET_PRODUCT: 'get_product',
  CREATE_PRODUCT: 'create_product',
  UPDATE_PRODUCT: 'update_product',
  DELETE_PRODUCT: 'delete_product',
  UPDATE_STOCK: 'update_stock',
  
  // Category Service
  GET_ALL_CATEGORIES: 'get_all_categories',
  GET_ROOT_CATEGORIES: 'get_root_categories',
  GET_CATEGORY_TREE: 'get_category_tree',
  GET_CATEGORY: 'get_category',
  GET_CATEGORY_BY_SLUG: 'get_category_by_slug',
  GET_CHILD_CATEGORIES: 'get_child_categories',
  CREATE_CATEGORY: 'create_category',
  UPDATE_CATEGORY: 'update_category',
  DELETE_CATEGORY: 'delete_category',
  
  // ProductView Service
  TRACK_PRODUCT_VIEW: 'track_product_view',
  GET_RECENTLY_VIEWED: 'get_recently_viewed',
  GET_PRODUCT_VIEW_COUNT: 'get_product_view_count',
  GET_TRENDING_PRODUCTS: 'get_trending_products',
  GET_POPULAR_PRODUCTS: 'get_popular_products',
  
  // Order Service
  CREATE_ORDER: 'create_order',
  GET_ORDER: 'get_order',
} as const;
