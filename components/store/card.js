import Link from 'next/link'
import { ProductCard } from '../product/card'

export function StoreCard({ store, width = "is-full" }) {
  return (
    <div className={`column ${width}`}>
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            {store.name} ({store.products.length} items)
          </p>
        </header>
        <div className="card-content">
          <p className="content">
            <strong>Owner:</strong> {store.owner}
          </p>
          <div className="content">
            {store.description}
          </div>
          <hr />
          <div className="columns is-multiline">
            {store.products.map(product => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
        <footer className="card-footer">
          <Link href={`/stores/${store.id}`} className="card-footer-item">View Store</Link>
        </footer>
      </div>
    </div>
  )
}
