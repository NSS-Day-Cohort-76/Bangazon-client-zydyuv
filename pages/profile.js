import { useEffect } from 'react'
import CardLayout from '../components/card-layout'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { ProductCard } from '../components/product/card'
import { StoreCard } from '../components/store/card'
import { useAppContext } from '../context/state'
import { getUserProfile } from '../data/auth'
import { getLikedProducts, likeProduct, unLikeProduct } from '../data/products'

export default function Profile() {
  const { profile, setProfile } = useAppContext()

  useEffect(() => {
    Promise.all([getUserProfile(), getLikedProducts()])
      .then(([profileData, likedProducts]) => {
        if (profileData && likedProducts) {
          const likedProductsList = likedProducts.map(like =>
            like.product)
          setProfile({
            ...profileData,
            likes: likedProductsList,
          })
        }
      })
      .catch((error) => {
        console.error("Error loading profile or liked products:", error)
      })
  }, [])

  const isLiked = (productId) => {
    return profile.likes?.some(p => p.id === productId)
  }

  const handleLikeToggle = (productId) => {
    const product = profile.likes.find(p => p.id === productId)

    if (isLiked(productId)) {
      unLikeProduct(productId)
        .then(() => {
          setProfile(prev => ({
            ...prev,
            likes: prev.likes.filter(p => p.id !== productId) || []
          }))
        })
        .catch(err => console.error("Error unliking product:", err))
    } else {
      likeProduct(productId)
        .then(() => {
          const likedProduct = profile.recommendations?.find(r => r.product.id === productId)?.product
            || profile.recommended_by?.find(r => r.product.id === productId)?.product

          if (likedProduct) {
            setProfile(prev => ({
              ...prev,
              likes: [...prev.likes, likedProduct]
            }))
          }
        })
        .catch(err => console.error("Error liking product:", err))
    }
  }

  if (!profile) return <p>Loading profile...</p>

  // Helper function to render empty state
  const renderEmptyState = (message) => (
    <div className="has-text-centered py-6">
      <div className="icon is-large has-text-grey-light mb-4">
        <i className="fas fa-search fa-3x"></i>
      </div>
      <p className="has-text-grey">{message}</p>
    </div>
  )

  return (
    <div className="section">
      <div className="container">
        {/* Profile Header */}
        <div className="mb-6">
          <div className="block">
            <h1 className="title is-2 mb-6">My Profile</h1>
            <p className="subtitle is-5 has-text-grey">
              Manage your favorites, recommendations, and liked items
            </p>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="columns is-multiline mb-6">
          <div className="column is-3">
            <div className="box has-text-centered">
              <p className="heading">Favorite Stores</p>
              <p className="title is-3 has-text-primary">
                {profile.favorites?.length || 0}
              </p>
            </div>
          </div>
          <div className="column is-3">
            <div className="box has-text-centered">
              <p className="heading">Products Recommended</p>
              <p className="title is-3 has-text-info">
                {profile.recommended_by?.length || 0}
              </p>
            </div>
          </div>
          <div className="column is-3">
            <div className="box has-text-centered">
              <p className="heading">Recommendations Received</p>
              <p className="title is-3 has-text-success">
                {profile.recommendations?.length || 0}
              </p>
            </div>
          </div>
          <div className="column is-3">
            <div className="box has-text-centered">
              <p className="heading">Liked Products</p>
              <p className="title is-3 has-text-warning">
                {profile.likes?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="columns is-multiline">
          {/* Favorite Stores */}
          <div className="column is-12">
            <CardLayout title="Favorite Stores" width="is-full">
              {[
                <div className="columns is-multiline" key="content">
                  {profile.favorites && profile.favorites.length > 0 ? (
                    profile.favorites.map(favorite => (
                      <StoreCard store={favorite} key={favorite.id} width="is-one-third-desktop is-half-tablet" />
                    ))
                  ) : (
                    <div className="column is-12">
                      {renderEmptyState("No favorite stores yet. Start exploring to add some!")}
                    </div>
                  )}
                </div>,
                null
              ]}
            </CardLayout>
          </div>

          {/* Products You've Recommended */}
          <div className="column is-12">
            <CardLayout title="Products You've Recommended" width="is-full">
              {[
                <div className="columns is-multiline" key="content">
                  {profile.recommended_by && profile.recommended_by.length > 0 ? (
                    profile.recommended_by.map(recommendation => (
                      <ProductCard product={recommendation.product} key={recommendation.product.id} width="is-one-third-desktop is-half-tablet" />
                    ))
                  ) : (
                    <div className="column is-12">
                      {renderEmptyState("You haven't recommended any products yet. Share your favorites with others!")}
                    </div>
                  )}
                </div>,
                null
              ]}
            </CardLayout>
          </div>

          {/* Products Recommended to You */}
          <div className="column is-12">
            <CardLayout title="Products Recommended to You" width="is-full">
              {[
                <div className="columns is-multiline" key="content">
                  {profile.recommendations && profile.recommendations.length > 0 ? (
                    profile.recommendations.map(recommendation => (
                      <ProductCard product={recommendation.product} key={recommendation.product.id} width="is-one-third-desktop is-half-tablet" />
                    ))
                  ) : (
                    <div className="column is-12">
                      {renderEmptyState("No recommendations yet. Connect with others to get personalized suggestions!")}
                    </div>
                  )}
                </div>,
                null
              ]}
            </CardLayout>
          </div>

          {/* Products You've Liked */}
          <div className="column is-12">
            <CardLayout title="Products You've Liked" width="is-full">
              {[
                <div className="columns is-multiline" key="content">
                  {profile.likes && profile.likes.length > 0 ? (
                    profile.likes.map(product => (
                      <ProductCard product={product} key={product.id} width="is-one-third-desktop is-half-tablet" />
                    ))
                  ) : (
                    <div className="column is-12">
                      {renderEmptyState("No liked products yet. Start liking products to build your collection!")}
                    </div>
                  )}
                </div>,
                null
              ]}
            </CardLayout>
          </div>
        </div>
      </div>
    </div>
  )
}

Profile.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  )
}