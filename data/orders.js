import { fetchWithResponse } from './fetcher'

const API = "http://localhost:8000"

export function getCart() {
  return fetchWithResponse('cart', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  }).catch((err) => {
    if (err.message === '404') {
      return null
    }
    throw err;
  })
}

export function getOrders() {
  return fetchWithResponse('orders', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function completeCurrentOrder(orderId, paymentTypeId) {
  return fetchWithResponse(`orders/${orderId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({paymentTypeId})
  })
}

export function deleteCart() {
  return fetch(`${API}/profile/cart`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error("Failed to delete cart")
    }
    return response
  })
}