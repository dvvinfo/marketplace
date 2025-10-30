export const useProducts = () => {
  const { apiFetch } = useApi();

  const fetchProducts = async (params?: {
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => {
    const url = '/products/search';
    const queryParams = new URLSearchParams();

    if (params?.search) {
      queryParams.append('search', params.search);
    }

    if (params?.categoryId) {
      queryParams.append('categoryId', params.categoryId.toString());
    }

    if (params?.minPrice !== undefined) {
      queryParams.append('minPrice', params.minPrice.toString());
    }

    if (params?.maxPrice !== undefined) {
      queryParams.append('maxPrice', params.maxPrice.toString());
    }

    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }

    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return await apiFetch<any>(fullUrl);
  };

  const fetchProductById = async (id: number) => {
    return await apiFetch<any>(`/products/${id}`);
  };

  const fetchCategories = async () => {
    return await apiFetch<any[]>('/categories');
  };

  const fetchCategoryTree = async () => {
    return await apiFetch<any[]>('/categories/tree');
  };

  return {
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchCategoryTree,
  };
};
