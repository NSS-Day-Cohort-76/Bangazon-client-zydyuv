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

  // Helper function to render empty state
  const renderEmptyState = (message, icon = "fas fa-box-open") => (
    <div className="column is-12">
      <div className="has-text-centered py-6">
        <div className="icon is-large has-text-grey-light mb-4">
          <i className={`${icon} fa-3x`}></i>
        </div>
        <p className="has-text-grey is-size-5">{message}</p>
      </div>
    </div>
  )

  return (
    <div className="section">
      <div className="container">
        {/* Store Header */}
        <div className="mb-6">
          <div className="block">
            <h1 className="title is-2 mb-4">
              {storeData.store.name || "My Store"}
            </h1>
            <p className="subtitle is-5 has-text-grey">
              {storeData.store.description || "Your online marketplace store"}
            </p>
          </div>
        </div>

        {/* Store Stats */}
        <div className="columns is-multiline mb-6">
          <div className="column is-4">
            <div className="box has-text-centered">
              <p className="heading">Currently Selling</p>
              <p className="title is-3 has-text-primary">
                {storeData.selling?.length || 0}
              </p>
            </div>
          </div>
          <div className="column is-4">
            <div className="box has-text-centered">
              <p className="heading">Products Sold</p>
              <p className="title is-3 has-text-success">
                {storeData.sold?.length || 0}
              </p>
            </div>
          </div>
          <div className="column is-4">
            <div className="box has-text-centered">
              <p className="heading">Total Products</p>
              <p className="title is-3 has-text-info">
                {(storeData.selling?.length || 0) + (storeData.sold?.length || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="columns is-multiline">
          {/* Currently Selling Section */}
          <div className="column is-12">
            <div className="card">
              <header className="card-header">
                <h2 className="card-header-title is-size-4">
                  <span className="icon has-text-primary mr-2">
                    <i className="fas fa-shopping-cart"></i>
                  </span>
                  Currently Selling
                </h2>
              </header>
              <div className="card-content">
                <div className="columns is-multiline">
                  {storeData.selling && storeData.selling.length > 0 ? (
                    storeData.selling.map(product => (
                      <div key={product.id} className="column is-one-third-desktop is-half-tablet">
                        <ProductCard product={product} isOwner={true} width="is-full" />
                      </div>
                    ))
                  ) : (
                    renderEmptyState(
                      "No products currently listed for sale. Add your first product to get started!",
                      "fas fa-plus-circle"
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sold Products Section */}
          <div className="column is-12">
            <div className="card">
              <header className="card-header">
                <h2 className="card-header-title is-size-4">
                  <span className="icon has-text-success mr-2">
                    <i className="fas fa-check-circle"></i>
                  </span>
                  Sold Products
                </h2>
              </header>
              <div className="card-content">
                <div className="columns is-multiline">
                  {storeData.sold && storeData.sold.length > 0 ? (
                    storeData.sold.map(product => (
                      <div key={product.id} className="column is-one-third-desktop is-half-tablet">
                        <ProductCard product={product} isOwner={true} width="is-full" />
                      </div>
                    ))
                  ) : (
                    renderEmptyState(
                      "No products have been sold yet. Keep promoting your listings!",
                      "fas fa-chart-line"
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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