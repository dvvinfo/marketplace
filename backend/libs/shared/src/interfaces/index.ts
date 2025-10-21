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
