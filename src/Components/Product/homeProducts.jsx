import React from "react";

function HomeProducts() {
  const products = [
    { id: 1, name: "Product 1", price: "$10", image: "image1.jpg" },
    { id: 2, name: "Product 2", price: "$20", image: "image2.jpg" },
    { id: 3, name: "Product 3", price: "$30", image: "image3.jpg" },
    // Add more products as needed
  ];
  return (
    <>
      {products.map((product) => (
        <div key={product.id} className="col-6 col-md-4 col-lg-2 mb-4">
          <div className="card h-100">
            <img
              src={product.image}
              className="card-img-top"
              alt={product.name}
            />
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">Price: {product.price}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default HomeProducts;
