import { fetchWithResponse, fetchWithoutResponse } from './fetcher'

export function getProducts(query=undefined) {
  let url = 'products'

  if (query) {
    url += `?${query}`
  }

  return fetchWithResponse(url, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function getCategories() {
  return fetchWithResponse('productcategories', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function getProductById(id) {
  return fetchWithResponse(`products/${id}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function addProductToOrder(id) {
  return fetchWithResponse(`lineitems`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({product_id: id})
  })
}

export function removeProductFromOrder(id) {
  return fetchWithoutResponse(`products/${id}/remove-from-order`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function deleteProduct(id) {
  return fetchWithoutResponse(`products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function rateProduct(productId, rating) {
  return fetchWithResponse(`products/${productId}/rate-product`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rating)
  })
}

export function addProduct(product) {
  return fetchWithResponse(`products`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  })
}

export function editProduct(id, product) {
  return fetchWithoutResponse(`products/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  })
}

// export function recommendProduct(id, username) {
//   return fetchWithResponse(`products/${id}/recommend`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Token ${localStorage.getItem('token')}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({username})
//   })
// }

export async function recommendProduct(toUsername, productId) {
  const res = await fetchWithResponse(`/products/${productId}/recommend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ to_username: toUsername })
  });
  if (res.status === 204) return; // Success, no content
  if (!res.ok) throw new Error('Failed to recommend product');
  // Only try to parse JSON if there is content
  if (res.headers.get("content-length") === "0" || res.status === 204) return;
  return res.json();
}

export function likeProduct(productId) {
  return fetchWithoutResponse(`products/${productId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
  })
}

export function unLikeProduct(productId) {
  return fetchWithoutResponse(`products/${productId}/like`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
  })
}

export function getLikedProducts() {
  return fetchWithResponse('products/liked', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  })
}

