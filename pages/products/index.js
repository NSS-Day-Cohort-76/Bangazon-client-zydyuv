import { useEffect, useState } from "react";
import Filter from "../../components/filter";
import Layout from "../../components/layout";
import Navbar from "../../components/navbar";
import { ProductCard } from "../../components/product/card";
import { getCategories, getProducts } from "../../data/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading products...");
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    getProducts()
      .then((data) => {
        if (data) {
          const locationData = [
            ...new Set(data.map((product) => product.location)),
          ];
          const locationObjects = locationData.map((location) => ({
            id: location,
            name: location,
          }));

          setProducts(data);
          setIsLoading(false);
          setLocations(locationObjects);
        }
      })
      .catch((err) => {
        setLoadingMessage(
          `Unable to retrieve products. Status code ${err.message} on response.`
        );
      });

    getCategories().then((data) => {
      if (data) {
        setCategories(data);
      }
    });
  }, []);

  const searchProducts = (event) => {
    getProducts(event).then((productsData) => {
      if (productsData) {
        setProducts(productsData);
        setIsFiltered(!!event);
      }
    });
  };

  if (isLoading) return <p>{loadingMessage}</p>;

  return (
    <>
      <Filter
        productCount={products.length}
        onSearch={searchProducts}
        locations={locations}
      />
      {!isFiltered &&
        categories.map((category) => {
          return (
            <div key={category.id}>
              <h1 className="title mt-6">{category.name}</h1>
              <div className="columns is-multiline">
                {products
                  .filter((p) => p.category?.id === category.id)
                  .sort(
                    (a, b) =>
                      new Date(b.created_date) - new Date(a.created_date)
                  )
                  .slice(0, 5)
                  .map((product) => (
                    <ProductCard product={product} key={product.id} />
                  ))}
              </div>
            </div>
          );
        })}
      {isFiltered && (
        <>
          <h1 className="title mt-6">Products matching filters</h1>
          <div className="columns is-multiline">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

Products.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  );
};
