import Link from 'next/link'

export default function Detail({ store, isOwner, toggleFavorite }) {
  const ownerButtons = () => {
    return (
      <div className="buttons">
        <Link href={`/stores/${store.id}/edit`} className="button is-primary is-inverted">
            Edit Store
        </Link>
        <Link href="/products/new" className="button is-primary is-inverted">
            Add a Product
        </Link>
      </div>
    )
  }
  
  const userButtons = () => {
  return (
    <button className="button is-primary is-inverted" onClick={toggleFavorite}>
      <span className="icon is-small">
        <i className={`fas ${store.is_favorited ? "fa-heart-broken" : "fa-heart"}`}></i>
      </span>
      <span>{store.is_favorited ? "Unfavorite Store" : "Favorite Store"}</span>
    </button>
  );
}

  return (
    <section className="hero is-primary mb-3">
      <div className="hero-head">
        <nav className="navbar">
          <div className="navbar-menu">
            <div className="navbar-end">
              <span className="navbar-item">
                {
                  isOwner ?
                    ownerButtons()
                    :
                    userButtons()
                }
              </span>
            </div>
          </div>
        </nav>
      </div>
      <div className="hero-body">
        <p className="title">
          {store.name}
        </p>
        <p className="subtitle">
          {store.description}
        </p>
      </div>
    </section>
  )
}
