export interface RabbitMQConfig {
  url: string;
  queue: string;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductResponse {
  id: number;
  title: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  categoryId: number | null;
  image: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
