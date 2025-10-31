export const RABBITMQ_QUEUES = {
  PROMO_CODE_SERVICE: 'promo_code_queue',
  PRODUCT_SERVICE: 'product_queue',
  ORDER_SERVICE: 'order_queue',
  USER_SERVICE: 'user_queue',
  REVIEW_SERVICE: 'review_queue',
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
  GET_ALL_ORDERS: 'get_all_orders',
  GET_ORDER: 'get_order',
  GET_USER_ORDERS: 'get_user_orders',
  CREATE_ORDER: 'create_order',
  UPDATE_ORDER: 'update_order',
  DELETE_ORDER: 'delete_order',

  // Cart Service
  GET_CART: 'get_cart',
  ADD_TO_CART: 'add_to_cart',
  UPDATE_CART_ITEM: 'update_cart_item',
  REMOVE_CART_ITEM: 'remove_cart_item',
  CLEAR_CART: 'clear_cart',

  // User Service
  GET_ALL_USERS: 'get_all_users',
  GET_USER: 'get_user',
  GET_USER_BY_EMAIL: 'get_user_by_email',
  CREATE_USER: 'create_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',

  // Auth Service
  AUTH_REGISTER: 'auth_register',
  AUTH_LOGIN: 'auth_login',
  AUTH_VALIDATE_TOKEN: 'auth_validate_token',
  AUTH_VALIDATE_USER: 'auth_validate_user',
  AUTH_CHANGE_PASSWORD: 'auth_change_password',

  // Address Service
  GET_ALL_ADDRESSES: 'get_all_addresses',
  GET_ADDRESS: 'get_address',
  GET_USER_ADDRESSES: 'get_user_addresses',
  GET_DEFAULT_ADDRESS: 'get_default_address',
  CREATE_ADDRESS: 'create_address',
  UPDATE_ADDRESS: 'update_address',
  SET_DEFAULT_ADDRESS: 'set_default_address',
  DELETE_ADDRESS: 'delete_address',

  // Review Service
  GET_ALL_REVIEWS: 'get_all_reviews',
  GET_REVIEW_BY_ID: 'get_review_by_id',
  GET_REVIEWS_BY_PRODUCT: 'get_reviews_by_product',
  GET_PRODUCT_RATING: 'get_product_rating',
  GET_REVIEWS_BY_USER: 'get_reviews_by_user',
  CREATE_REVIEW: 'create_review',
  UPDATE_REVIEW: 'update_review',
  DELETE_REVIEW: 'delete_review',
} as const;
