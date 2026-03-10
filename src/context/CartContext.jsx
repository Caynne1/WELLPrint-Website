import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'wellprint_cart'

function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD': {
      const { item } = action
      const key = `${item.slug}__${JSON.stringify(item.selections)}`
      const existing = state.find(i => i.key === key)
      if (existing) {
        return state.map(i =>
          i.key === key ? { ...i, qty: i.qty + item.qty } : i
        )
      }
      return [...state, { ...item, key }]
    }

    case 'UPDATE_QTY': {
      const { key, qty } = action
      if (qty <= 0) return state.filter(i => i.key !== key)
      return state.map(i => i.key === key ? { ...i, qty } : i)
    }

    case 'REMOVE':
      return state.filter(i => i.key !== action.key)

    case 'CLEAR':
      return []

    case 'HYDRATE':
      return action.payload

    default:
      return state
  }
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0)

  function addToCart(item) {
    dispatch({ type: 'ADD', item })
  }
  function updateQty(key, qty) {
    dispatch({ type: 'UPDATE_QTY', key, qty })
  }
  function removeItem(key) {
    dispatch({ type: 'REMOVE', key })
  }
  function clearCart() {
    dispatch({ type: 'CLEAR' })
  }

  return (
    <CartContext.Provider value={{ cart, totalItems, totalPrice, addToCart, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}