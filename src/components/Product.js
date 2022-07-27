import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Product(props){

	const { breakPoint, data } = props;

	const { _id, name, description, price } = data;

	return(
		<Col xs={12} md={breakPoint} className="mt-4">
			<Card className="card1">
				<Card.Body>
					<Card.Title className="text-center card2">
						<Link to={`/products/${	_id}`}>
							{name}
						</Link>
					</Card.Title>
					<Card.Text className="card3">{description}</Card.Text>
					<h5 className="text-warning">₱{price}</h5>
				</Card.Body>
				<Card.Footer>
					<div className="d-grid gap-2">
						<Link 
							className="btn btn-primary btn-block"
							to={`/products/${	_id}`}
						>
							Details
						</Link>
					</div>
				</Card.Footer>
			</Card>
		</Col>
	);
	
}
