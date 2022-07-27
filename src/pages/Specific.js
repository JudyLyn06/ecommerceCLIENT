import { useState, useEffect, useContext } from 'react';
import { Card, Container, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Link, useParams, Redirect } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Specific(){

	const { user } = useContext(UserContext);
	const { productId } = useParams();

	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [qty, setQty] = useState(1);
	const [price, setPrice] = useState(0);

// Page redirection for conditional rendering
	const [willRedirect, setWillRedirect] = useState(false);

	useEffect(() => {

		fetch(`${ process.env.REACT_APP_API_URL}/products/${ productId }`)
		.then(res => res.json())
		.then(data => {

			setId(data._id);
			setName(data.name);
			setDescription(data.description);
			setPrice(data.price);

		})

	});

// Function of reducing the quantity (qty can't be below 0)
	const reduceQty = () => {
		if (qty <= 1) {
			alert("Quantity can't be lower than 1.");
		} else {
			setQty(qty - 1);
		}
	};

// Function for input fields to change the number
	const qtyInput = (value) => {

		if (value === '') {
			value = 1;
		} else if (value === "0") {
			alert("Quantity can't be lower than 1.");
			value = 1;
		}

		setQty(value);

	}

/*
Add to Cart Function 
stored data using local storage

Logic:
1. Create an empty array where we store the products 
2. Check if there are already a product in the cart Item
3. If we found duplicates, just update the quantity and the amount
4. If no duplicates, store the product to the cart in local storage
5. Add an alert message how many item added to cart(optional yung how many)
*/
	const addToCart = () => {

		let alreadyInCart = false;
		let productIndex;
		let message;
		let cart = [];

		if (localStorage.getItem('cart')) {
			cart = JSON.parse(localStorage.getItem('cart'));
		};

		for(let i = 0; i < cart.length; i++){
			if (cart[i].productId === id) {
				alreadyInCart = true;
				productIndex = i;
			}
		}

		if (alreadyInCart) {
			cart[productIndex].quantity += qty;
			cart[productIndex].subtotal = cart[productIndex].price * cart[productIndex].quantity;
		} else {
			cart.push({
				'productId' : id,
				'name': name,
				'price': price,
				'quantity': qty,
				'subtotal': price * qty
			});		
		};

		localStorage.setItem('cart', JSON.stringify(cart));

		if (qty === 1) {
			message = "1 item added to cart.";
		} else {
			message = `${qty} items added to cart.`;
		}

		alert(message);

	}

	const checkout = () => {

			fetch(`${ process.env.REACT_APP_API_URL}/users/checkout`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${ localStorage.getItem('token') }`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					products: {
						productId: id,
						productName: name,
						quantity: qty
					},
					totalAmount: price * qty
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

	return (
		willRedirect === true

		? <Redirect to="/orders"/>

		:

		<Container>
			<Card className="mt-5">
				<Card.Header className="bg-secondary text-white text-center pb-0"><h4>{name}</h4></Card.Header>
				<Card.Body>
					<Card.Text>{description}</Card.Text>
					<h6>
						Price: <span className="text-warning">₱{price}</span>
					</h6>
					<h6>Quantity:</h6>
					<InputGroup className="qty mt-2 mb-1">
						<InputGroup.Prepend className="d-none d-md-flex">
							<Button variant="secondary" onClick={reduceQty}>
								-
							</Button>
						</InputGroup.Prepend>
						<FormControl 
							type="number"
							min="1"
							value={qty}
							onChange={e => qtyInput(e.target.value)}
						/>
						<InputGroup.Append className="d-none d-md-flex">
							<Button
								variant="secondary"
								onClick={() => setQty(qty + 1)}
							>
								+
							</Button>
						</InputGroup.Append>
					</InputGroup>
				</Card.Body>
				<Card.Footer>
				{user.id !== null ? 
						user.isAdmin === true ?
							<div className="d-grid gap-2">
								<Button variant="danger" block disabled>Admin can't Add to Cart</Button>
							</div>
							:

							<div className="d-grid gap-2">
								<Button variant="primary" block onClick={addToCart}>Add to Cart</Button>
								<Button variant="info" block onClick={checkout}>Checkout</Button>
							</div>
					:
					<div className="d-grid gap-2"> 
						<Link className="btn btn-warning btn-block" to={{pathname: '/login', state: { from: 'cart'}}}>Log in to Add to Cart</Link>
					</div>
				}
	      		</Card.Footer>
			</Card>
		</Container>
	)
}

