import React, { useEffect, useState } from 'react';
import Product from '../components/Product';
import { Row } from 'react-bootstrap';

export default function CustomerView({productsData}){

	const [products, setProducts] = useState([]);

	useEffect(() => {

		const productsArr = productsData.map(productData => {
			if (productData.isActive === true) {
				return (
					<Product data={productData} key={productData._id} breakPoint={4}/>
				);
			} else {
				return null;
			}
		});

		setProducts(productsArr);

	}, [productsData])

	return(
		<React.Fragment>
			<h2 className="text-center my-4">Our Products</h2>
			<Row>
				{products}
			</Row>
		</React.Fragment>
	);
	
}
