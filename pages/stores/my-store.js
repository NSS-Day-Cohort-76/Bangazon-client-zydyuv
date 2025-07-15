import { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import Navbar from '../../components/navbar'
import { ProductCard } from '../../components/product/card'
import { useAppContext } from '../../context/state'

export default function MyStore() {
  const { token } = useAppContext()
  const [storeData, setStoreData] = useState({
    store: {},
    selling: [],
    sold: []
  })

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/stores/my_store", {
        headers: {
          Authorization: `Token ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setStoreData(data)
        })
        .catch(err => console.error("Failed to load store", err))
    }
  }, [token])

  return (
    <>
      <section className="section">
        <h1 className="title">{storeData.store.name}</h1>
        <p className="subtitle">{storeData.store.description}</p>
      </section>

      <section className="section">
        <h2 className="title is-4">Selling</h2>
        <div className="columns is-multiline">
          {
            storeData.selling.length
              ? storeData.selling.map(product => (
                  <ProductCard key={product.id} product={product} isOwner={true} />
                ))
              : <p>No products currently listed for sale.</p>
          }
        </div>
      </section>

      <section className="section">
        <h2 className="title is-4">Sold</h2>
        <div className="columns is-multiline">
          {
            storeData.sold.length
              ? storeData.sold.map(product => (
                  <ProductCard key={product.id} product={product} isOwner={true} />
                ))
              : <p>No products have been sold yet.</p>
          }
        </div>
      </section>
    </>
  )
}

MyStore.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  )
}
