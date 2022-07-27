import React, { useState, useEffect } from 'react';
import { Container, Card, Accordion, Jumbotron } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment';

export default function Orders(){

	const [ordersList, setOrdersList] = useState([])


	useEffect(()=> {

		fetch(`${ process.env.REACT_APP_API_URL}/users/myOrders`, {
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`
			}
		})
		.then(res => res.json())
		.then(data => {
			if(data.length > 0){
				let orders = data.map((item, index)=> {
					return(
						<Card key={item._id}>
							<Accordion.Toggle as={Card.Header} eventKey={index + 1} className="bg-secondary text-white">
								Order #{index + 1} - Purchased on: {moment(item.purchasedOn).format("MM-DD-YYYY")} (Click for Details)
							</Accordion.Toggle>
							<Accordion.Collapse eventKey={index + 1}>
								<Card.Body>
									<h6>Items:</h6>
									<ul>
									{
										item.products.map((subitem) => {
											return (
												<li key={subitem.productId}>
												{subitem.productName} - Quantity: {subitem.quantity}</li>
											)
										})
									}
									</ul>
									<h6>Total: <span className="text-warning">₱{item.totalAmount}</span></h6>
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					)
				})
	
				setOrdersList(orders)				
			}
		})
	}, [])

	return(
		ordersList.length === 0
		?<Jumbotron>
				<h3 className="text-center">No orders placed yet! <Link to="/products">Start shopping.</Link></h3>
		</Jumbotron>
		:
		<Container>
			<h2 className="text-center my-4">Order History</h2>
			<Accordion>
				{ordersList}
			</Accordion>
		</Container>
	)
}