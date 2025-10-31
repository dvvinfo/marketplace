import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
    loading: false,
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => {
      const price = item.product?.price || item.price || 0;
      return sum + price * item.quantity;
    }, 0),
  },

  actions: {
    async fetchCart() {
      const { apiFetch } = useApi()
      const { user } = useAuth()
      
      if (!user.value) return
      
      this.loading = true

      try {
        const response = await apiFetch<any>(`/cart/user/${user.value.id}`)
        this.items = response.items || []
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        this.loading = false
      }
    },

    async addItem(productId: number, quantity: number = 1) {
      const { apiFetch } = useApi()
      const { user } = useAuth()
      
      if (!user.value) {
        throw new Error('User not authenticated')
      }

      try {
        await apiFetch('/cart/add', {
          method: 'POST',
          body: { userId: user.value.id, productId, quantity },
        })
        await this.fetchCart()
      } catch (error) {
        console.error('Failed to add item to cart:', error)
        throw error
      }
    },

    async updateQuantity(itemId: number, quantity: number) {
      const { apiFetch } = useApi()

      try {
        await apiFetch(`/cart/item/${itemId}`, {
          method: 'PUT',
          body: { quantity },
        })
        await this.fetchCart()
      } catch (error) {
        console.error('Failed to update cart item:', error)
        throw error
      }
    },

    async removeItem(itemId: number) {
      const { apiFetch } = useApi()

      try {
        await apiFetch(`/cart/item/${itemId}`, {
          method: 'DELETE',
        })
        await this.fetchCart()
      } catch (error) {
        console.error('Failed to remove cart item:', error)
        throw error
      }
    },

    async clearCart() {
      const { apiFetch } = useApi()
      const { user } = useAuth()
      
      if (!user.value) return

      try {
        await apiFetch(`/cart/user/${user.value.id}/clear`, {
          method: 'DELETE',
        })
        this.items = []
      } catch (error) {
        console.error('Failed to clear cart:', error)
        throw error
      }
    },
  },
})
