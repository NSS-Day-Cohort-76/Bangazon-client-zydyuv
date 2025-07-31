import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import Navbar from "../../../components/navbar";
import { ProductCard } from "../../../components/product/card";
import Detail from "../../../components/store/detail";
import { useAppContext } from "../../../context/state";
import { deleteProduct } from "../../../data/products";
import {
  favoriteStore,
  getStoreById,
  unfavoriteStore,
} from "../../../data/stores";

export default function StoreDetail() {
  const { profile } = useAppContext();
  const router = useRouter();
  const { id } = router.query;
  const [store, setStore] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [storeNotFound, setStoreNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (id) {
      console.log("Router store ID param:", id);
      refresh();
      if (profile?.store?.id) {
        setIsOwner(parseInt(id) === profile.store.id);
      }
    }
  }, [id, profile]);

  // Trigger fade-in animation when store loads
  useEffect(() => {
    if (store && !isLoading) {
      setTimeout(() => setFadeIn(true), 100);
    }
  }, [store, isLoading]);

  const refresh = () => {
    setIsLoading(true);
    getStoreById(id)
      .then((storeData) => {
        if (storeData) {
          setStore(storeData);
          setStoreNotFound(false);
        } else {
          setStore(null);
          setStoreNotFound(true);
        }
      })
      .catch((err) => {
        console.error("Store fetch failed:", err);
        setStore(null);
        setStoreNotFound(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const removeProduct = (productId) => {
    deleteProduct(productId).then(refresh);
  };

  const favorite = () => {
    favoriteStore(id).then(refresh);
  };

  const unfavorite = () => {
    unfavoriteStore(id).then(refresh);
  };

  // Enhanced loading state with animated skeleton
  if (isLoading) {
    return (
      <div className="container is-max-desktop">
        <div className="section">
          <div className="box has-background-light">
            <div className="content has-text-centered">
              <div className="loading-spinner mb-4">
                <div className="spinner-border" role="status">
                  <span className="is-sr-only">Loading...</span>
                </div>
              </div>
              <p className="title is-5 has-text-grey">
                <span className="icon mr-2">
                  <i className="fas fa-store"></i>
                </span>
                Loading store details...
              </p>
              <progress className="progress is-primary" max="100">
                Loading
              </progress>
            </div>
          </div>
        </div>

        {/* Loading skeleton for products */}
        <div className="section">
          <div className="columns is-multiline">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="column is-one-quarter">
                <div className="box skeleton-box">
                  <div className="skeleton-image mb-4"></div>
                  <div className="skeleton-line mb-2"></div>
                  <div className="skeleton-line is-half mb-3"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .loading-spinner {
            display: flex;
            justify-content: center;
          }

          .spinner-border {
            width: 3rem;
            height: 3rem;
            border: 0.25em solid transparent;
            border-top: 0.25em solid #3273dc;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .skeleton-box {
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }

          .skeleton-image {
            height: 150px;
            background: #e0e0e0;
            border-radius: 6px;
          }

          .skeleton-line {
            height: 20px;
            background: #e0e0e0;
            border-radius: 4px;
          }

          .skeleton-line.is-half {
            width: 60%;
          }

          .skeleton-button {
            height: 40px;
            background: #e0e0e0;
            border-radius: 6px;
            width: 120px;
          }

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    );
  }

  // Enhanced error state
  if (storeNotFound) {
    return (
      <div className="container is-max-desktop">
        <div className="section">
          <div className="box has-background-danger-light">
            <div className="content has-text-centered">
              <div className="mb-4">
                <span className="icon is-large has-text-danger">
                  <i className="fas fa-exclamation-triangle fa-2x"></i>
                </span>
              </div>
              <h1 className="title is-4 has-text-danger">Store Not Found</h1>
              <p className="subtitle is-6 has-text-danger-dark">
                The store you're looking for doesn't exist or has been removed.
              </p>
              <div className="buttons is-centered mt-5">
                <button
                  className="button is-primary is-medium"
                  onClick={() => router.push("/stores")}
                >
                  <span className="icon">
                    <i className="fas fa-arrow-left"></i>
                  </span>
                  <span>Browse All Stores</span>
                </button>
                <button
                  className="button is-light is-medium"
                  onClick={() => router.back()}
                >
                  <span className="icon">
                    <i className="fas fa-undo"></i>
                  </span>
                  <span>Go Back</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`store-detail-container ${fadeIn ? "fade-in" : ""}`}>
      {/* Enhanced store detail component with animation */}
      <div className="store-header-section">
        <Detail
          store={store}
          isOwner={isOwner}
          favorite={favorite}
          unfavorite={unfavorite}
        />
      </div>

      {/* Products section with enhanced styling */}
      <div className="products-section">
        <div className="container is-max-desktop">
          <div className="section">
            {store.products?.length > 0 ? (
              <>
                <div className="level mb-5">
                  <div className="level-left">
                    <div className="level-item">
                      <h2 className="title is-4 has-text-weight-bold">
                        <span className="icon mr-2 has-text-primary">
                          <i className="fas fa-boxes"></i>
                        </span>
                        Products ({store.products.length})
                      </h2>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item">
                      <div className="field has-addons">
                        <div className="control">
                          <div className="select is-small">
                            <select>
                              <option>Sort by: Latest</option>
                              <option>Price: Low to High</option>
                              <option>Price: High to Low</option>
                              <option>Name: A-Z</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columns is-multiline products-grid">
                  {store.products.map((product, index) => (
                    <div
                      key={product.id}
                      className="column is-one-quarter-desktop is-one-third-tablet is-half-mobile product-card-wrapper"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard
                        product={product}
                        isOwner={isOwner}
                        removeProduct={removeProduct}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-products-state">
                <div className="box has-background-light">
                  <div className="content has-text-centered py-6">
                    <div className="mb-4">
                      <span className="icon is-large has-text-grey-light">
                        <i className="fas fa-box-open fa-3x"></i>
                      </span>
                    </div>
                    <h3 className="title is-5 has-text-grey">
                      No Products Yet
                    </h3>
                    <p className="subtitle is-6 has-text-grey-dark mb-4">
                      {isOwner
                        ? "Start building your store by adding your first product!"
                        : "This store is just getting started. Check back soon for new products!"}
                    </p>
                    {isOwner && (
                      <button
                        className="button is-primary is-medium"
                        onClick={() => router.push("/products/new")}
                      >
                        <span className="icon">
                          <i className="fas fa-plus"></i>
                        </span>
                        <span>Add First Product</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .store-detail-container {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }

        .store-detail-container.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .store-header-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .store-header-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="%23ffffff" opacity="0.1"><polygon points="1000,100 1000,0 0,100"/></svg>');
          background-size: cover;
        }

        .products-section {
          background: #fafafa;
          min-height: 400px;
        }

        .products-grid {
          gap: 1.5rem;
        }

        .product-card-wrapper {
          opacity: 0;
          transform: translateY(30px);
          animation: slideInUp 0.6s ease-out forwards;
        }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .empty-products-state {
          animation: fadeInScale 0.8s ease-out;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .level .title {
          margin-bottom: 0 !important;
        }

        .box {
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          transition: all 0.3s ease;
        }

        .box:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .button {
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .select select {
          border-radius: 6px;
          border-color: #e5e5e5;
        }

        @media (max-width: 768px) {
          .products-grid {
            margin-left: -0.75rem;
            margin-right: -0.75rem;
          }

          .product-card-wrapper {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

StoreDetail.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  );
};
