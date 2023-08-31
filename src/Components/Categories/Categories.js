import React from 'react'
import { useContext } from 'react'
import ProductContext from '../../context/Product/ProductContext';

const Categories = () => {
        const context = useContext(ProductContext);
        const { Categories } = context;

  return (
    <>
        {Categories.map(category => (
            <div className="card" key={category._id}>
                <div>{category.name}({category.count})</div>
            </div>
            ))}
    </>
  )
}

export default Categories