import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CardLayout from '../components/card-layout'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import CartDetail from '../components/order/detail'
import CompleteFormModal from '../components/order/form-modal'
import { completeCurrentOrder, getCart } from '../data/orders'
import { getPaymentTypes } from '../data/payment-types'
import { removeProductFromOrder } from '../data/products'

export default function Cart() {
  const [cart, setCart] = useState({})
  const [paymentTypes, setPaymentTypes] = useState([])
  const [showCompleteForm, setShowCompleteForm] = useState(false)
  const router = useRouter()

  const refresh = () => {
    getCart().then(cartData => {
      if (cartData) {
        setCart(cartData)
      } else {
        setCart(null)
      }
    })
  }

  useEffect(() => {
    refresh()
    getPaymentTypes().then(paymentData => {
      console.log("Payment types:", paymentData)
      if (paymentData) {
        setPaymentTypes(paymentData)
      }
    })
  }, [])

  const completeOrder = (paymentTypeId) => {
    completeCurrentOrder(cart.id, paymentTypeId).then(() => router.push('/my-orders'))
  }

  const removeProduct = (productId) => {
    removeProductFromOrder(productId).then(refresh)
  }

  return (
    <>
      <CompleteFormModal
        showModal={showCompleteForm}
        setShowModal={setShowCompleteForm}
        paymentTypes={paymentTypes}
        completeOrder={completeOrder}
      />
      <CardLayout title="Your Current Order"> {
        cart && cart.lineitems?.length > 0 ? (
          <>
        <CartDetail cart={cart} removeProduct={removeProduct} />
        
          <a className="card-footer-item" onClick={() => setShowCompleteForm(true)}>Complete Order</a>
          <a className="card-footer-item">Delete Order</a>
        </>
        ) : (
          <p className='p-4'>You have no items in your cart.</p>
        )
}
      </CardLayout>
    </>
  )
}

Cart.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      <section className="container">{page}</section>
    </Layout>
  )
}
