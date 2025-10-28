import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
    loading: false,
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    async fetchCart() {
      const { apiFetch } = useApi()
      this.loading = true

      try {
        const response = await apiFetch<any>('/cart')
        this.items = response.items || []
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        this.loading = false
      }
    },

    async addItem(productId: number, quantity: number = 1) {
      const { apiFetch } = useApi()

      try {
        await apiFetch('/cart/items', {
          method: 'POST',
          body: { productId, quantity },
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
        await apiFetch(`/cart/items/${itemId}`, {
          method: 'PATCH',
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
        await apiFetch(`/cart/items/${itemId}`, {
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

      try {
        await apiFetch('/cart', {
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
