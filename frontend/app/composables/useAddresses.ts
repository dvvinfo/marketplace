export interface Address {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  state?: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressDto {
  userId: number;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  state?: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto {
  fullName?: string;
  phone?: string;
  country?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
  isDefault?: boolean;
}

export const useAddresses = () => {
  const { apiFetch } = useApi();

  const getAddresses = async (userId: number): Promise<Address[]> => {
    return await apiFetch(`/addresses/user/${userId}`);
  };

  const getDefaultAddress = async (userId: number): Promise<Address | null> => {
    try {
      return await apiFetch(`/addresses/user/${userId}/default`);
    } catch {
      return null;
    }
  };

  const createAddress = async (data: CreateAddressDto): Promise<Address> => {
    return await apiFetch('/addresses', {
      method: 'POST',
      body: data,
    });
  };

  const updateAddress = async (
    id: number,
    userId: number,
    data: UpdateAddressDto
  ): Promise<Address> => {
    return await apiFetch(`/addresses/${id}/user/${userId}`, {
      method: 'PUT',
      body: data,
    });
  };

  const setDefaultAddress = async (
    id: number,
    userId: number
  ): Promise<Address> => {
    return await apiFetch(`/addresses/${id}/user/${userId}/default`, {
      method: 'PATCH',
    });
  };

  const deleteAddress = async (id: number, userId: number): Promise<void> => {
    await apiFetch(`/addresses/${id}/user/${userId}`, {
      method: 'DELETE',
    });
  };

  const formatAddressString = (address: Address): string => {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return {
    getAddresses,
    getDefaultAddress,
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress,
    formatAddressString,
  };
};
