export const useAuth = () => {
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  const user = useState<any>('user', () => null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    const { apiFetch } = useApi()
    
    try {
      const response = await apiFetch<{ accessToken: string; user: any }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      token.value = response.accessToken
      user.value = response.user

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Неверный email или пароль' }
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
      const response = await apiFetch<{ accessToken: string; user: any }>('/auth/register', {
        method: 'POST',
        body: {
          email: data.email,
          password: data.password,
          nameFirst: data.firstName,
          nameLast: data.lastName,
        },
      })

      token.value = response.accessToken
      user.value = response.user

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Ошибка регистрации' }
    }
  }

  const logout = async () => {
    token.value = null
    user.value = null
    await navigateTo('/login')
  }

  const fetchUser = async () => {
    if (!token.value) return

    const { apiFetch } = useApi()
    
    try {
      const userData = await apiFetch('/auth/profile')
      console.log('Fetched user data:', userData)
      user.value = userData
    } catch (error: any) {
      // Только если токен невалидный (401), разлогиниваем
      if (error?.statusCode === 401 || error?.status === 401) {
        console.error('Token invalid, logging out')
        token.value = null
        user.value = null
      } else {
        console.error('Failed to fetch user, but keeping token:', error)
      }
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
