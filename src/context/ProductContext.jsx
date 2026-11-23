import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext(null);
const API_URL = "https://json-server-vercel-wa8c.vercel.app/products";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]= useState(true)
  const [error, setError] = useState(null);

  

  // Fetch products when the provider first loads. GET request/ READ operation
  useEffect(() => {
    async function fetchProducts() {
      try {
  
        // const response = await fetch("http://localhost:3001/products");
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);


//function to add products. POST Request /Create operation
async function addProduct(product) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    const newProduct = await response.json();

    setProducts((currentProducts) => [
      ...currentProducts,
      newProduct,
    ]);

    return newProduct;

  } catch (error) {
    setError(error.message);
    throw error;
  }
}

//function to edit product info. PATCH request/ Update operation

async function updateProduct(id, updatedData) {
  try {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    const updatedProduct = await response.json();
//if the product id matches the updatedproduct id, update the product, else keep the original product
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      )
    );

    return updatedProduct;

  } catch (error) {
    setError(error.message);
    throw error;
  }
}


//function to delete a product. DELETE Method/ delete operation
async function deleteProduct(id){
    try{
        const response = await fetch (`${API_URL}/${id}`,
            {
                method : "DELETE",
            }
        )
        if(!response.ok) {
            throw new Error ("Failed to delete product")
        }
        setProducts((currentProducts) =>
            currentProducts.filter((product)=> product.id !== id)
            )
    }
    catch(error){
        setError(error.message)
        throw error;
    }
}



  // Share products and functions with child components.
  const value = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

//custom hook, useContext
export function useProductContext() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }

  return context;
}

export default ProductContext;