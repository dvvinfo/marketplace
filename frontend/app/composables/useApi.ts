import type { UseFetchOptions } from 'nuxt/app'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  const apiFetch = <T>(url: string, options?: UseFetchOptions<T>) => {
    const token = useCookie('auth_token')

    return $fetch<T>(url, {
      baseURL,
      headers: {
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...options?.headers,
      },
      ...options,
    })
  }

  return {
    apiFetch,
    baseURL,
  }
}
