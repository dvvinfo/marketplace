export const useAuth = () => {
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  const user = useState<any>('user', () => null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    const { apiFetch } = useApi()
    
    try {
      const response = await apiFetch<{ access_token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      token.value = response.access_token
      user.value = response.user

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    const { apiFetch } = useApi()
    
    try {
      const response = await apiFetch<{ access_token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: data,
      })

      token.value = response.access_token
      user.value = response.user

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  const fetchUser = async () => {
    if (!token.value) return

    const { apiFetch } = useApi()
    
    try {
      user.value = await apiFetch('/auth/profile')
    } catch (error) {
      logout()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  }
}
