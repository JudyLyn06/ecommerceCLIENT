import React, { useState, useEffect } from 'react';
import { Container, Jumbotron, InputGroup, Button, FormControl, Table } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom';

export default function MyCart(){

	const [total, setTotal] = useState(0);
	const [cart, setCart] = useState([]);
	const [tableRows, setTableRows] = useState([]);
	const [willRedirect, setWillRedirect] = useState(false);

	useEffect(()=> {

		if (localStorage.getItem('cart')) {
			setCart(JSON.parse(localStorage.getItem('cart')));
		}

	}, [])

	useEffect(()=> {

		const qtyInput = (productId, value) => {

			let tempCart = [...cart];

			if (value === '') {
				value = 1;
			} else if (value === "0") {
				alert("Quantity can't be lower than 1.");
				value = 1;
			}

			for(let i = 0; i < cart.length; i++){

				if(tempCart[i].productId === productId){
					tempCart[i].quantity = parseFloat(value);
					tempCart[i].subtotal = tempCart[i].price * tempCart[i].quantity;
				}

			}

			setCart(tempCart);
			localStorage.setItem('cart', JSON.stringify(tempCart));

		}

		const qtyBtns = (productId, operator) => {

			let tempCart = [...cart];

			for(let i = 0; i < tempCart.length; i++){

				if (tempCart[i].productId === productId) {

					if (operator === "+") {
						tempCart[i].quantity += 1;
						tempCart[i].subtotal = tempCart[i].price * tempCart[i].quantity;
					} else if (operator === "-") {
						if(tempCart[i].quantity <= 1){
							alert("Quantity can't be lower than 1.");
						}else{
							tempCart[i].quantity -= 1;
							tempCart[i].subtotal = tempCart[i].price * tempCart[i].quantity;
						}
					}

				}
			}

			setCart(tempCart);
			localStorage.setItem('cart', JSON.stringify(tempCart));

		}

		const removeBtn = (productId) => {

			let tempCart = [...cart];

			let cartIds = cart.map((item)=> {
				return item.productId;
			})

			// console.log(tempCart);

			tempCart.splice([cartIds.indexOf(productId)], 1);

			setCart(tempCart);
			localStorage.setItem('cart', JSON.stringify(tempCart));

		}

		let cartItems = cart.map((item, index) => {

			return (
		      <tr key={item.productId}>
		          <td>
		          	<Link to={`/products/${item.productId}`}>
		          		{item.name}
		          	</Link>
		          </td>
		          <td>₱{item.price}</td>
		          <td>
				  	<InputGroup className="d-md-none">
						<FormControl
							type="number"
							min="1"
							value={item.quantity}
							onChange={e => qtyInput(item.productId, e.target.value)}
						/>
					</InputGroup>
					<InputGroup className="d-none d-md-flex w-50">

						<InputGroup.Prepend>
							<Button 
								variant="secondary"
								onClick={() => qtyBtns(item.productId, "-")}
							>
								-
							</Button>
						</InputGroup.Prepend>

						<FormControl
							type="number"
							min="1" value={item.quantity}
							onChange={e => qtyInput(item.productId, e.target.value)}
						/>

						<InputGroup.Append>
							<Button 
								variant="secondary"
								onClick={() => qtyBtns(item.productId, "+")}
							>
								+
							</Button>
						</InputGroup.Append>

					</InputGroup>
		          </td>
		          <td>₱{item.subtotal}</td>
		          <td className="text-center">
		          	<Button 
		          		variant="danger"
		          		onClick={() => removeBtn(item.productId)}
		          	>
		          		Remove
		          	</Button>
		          </td>
		      </tr>			
			);

		})

		setTableRows(cartItems);

		let tempTotal = 0;

		cart.forEach((item)=> {
			tempTotal += item.subtotal;
		});

		setTotal(tempTotal);

	}, [cart]);

const checkout = () => {

		const checkoutCart =  cart.map((item) => {
			return {
				productId: item.productId,
				productName: item.name,
				quantity: item.quantity,
			}
		})

		fetch(`${ process.env.REACT_APP_API_URL}/users/checkout`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				products: checkoutCart,
				totalAmount: total
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data === true){
				alert("Order placed! Thank you!")

				localStorage.removeItem('cart')

				setWillRedirect(true)
			}else{
				alert("Something went wrong. Order was NOT placed.")
			}
		})
	}

	return(
		willRedirect === true ? 
			<Redirect to="/orders"/>
		:
			cart.length <= 0 ? 
					<Jumbotron>
						<h3 className="text-center">
							Your cart is empty! <Link to="/products">Start shopping.</Link>
						</h3>
					</Jumbotron>
				:
				<Container>
					<h2 className="text-center my-4">Your Shopping Cart</h2>
					<Table striped bordered hover responsive>
						<thead className="bg-secondary text-white">
							<tr>
								<th>Name</th>
								<th>Price</th>
								<th>Quantity</th>
								<th>Subtotal</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{tableRows}
							<tr>
								<td colSpan="3">
									<div className="d-grid gap-2">
										<Button 
											variant="success"
											block
											onClick={checkout}
										>
											Checkout
										</Button>
									</div>
								</td>
								<td colSpan="2">
									<h3>Total: ₱{total}</h3>
								</td>
							</tr>
						</tbody>						
					</Table>
				</Container>
	);
	
}
