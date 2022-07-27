import {useState, useEffect} from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';

export default function Register(){

    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [error1, setError1] = useState(true);
    const [error2, setError2] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [willRedirect, setWillRedirect] = useState(false);

    useEffect(() => {

        if ((email !== '' && password1 !== '' && password2 !== '') && (password1 === password2)) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }

    }, [email, password1, password2]);

    useEffect(() => {

        if (email === '' || password1 === '' || password2 === '') {
            setError1(true);
            setError2(false);
            setIsActive(false);
        } else if ((email !== '' && password1 !== '' && password2 !== '') && (password1 !== password2)) {
            setError1(false);
            setError2(true);
            setIsActive(false);
        } else if((email !== '' && password1 !== '' && password2 !== '') && (password1 === password2)) {
            setError1(false);
            setError2(false);
            setIsActive(true);
        }

    }, [email, password1, password2]);

    const registerUser = (e) => {

        e.preventDefault();

        fetch(`${ process.env.REACT_APP_API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password1
            })
        })
        .then(res => res.json())
        .then(data => {

            if (data === true) {
                alert("Registration successful. You may now log in.");
                setWillRedirect(true);
            } else {
                alert("Something went wrong.");
                setEmail("");
                setPassword1("");
                setPassword2("");
            }
        })
    }

    return(
        willRedirect === true ?
                <Redirect to={{pathname: '/login', state: { from: 'register'}}}/>
            :
                <Row className="justify-content-center">
                    <Col xs md="6">
                        <h2 className="text-center my-4">Register</h2>
                        <Card>
                            <Form onSubmit={e => registerUser(e)}>
                                <Card.Body>

                                    <Form.Group controlId="userEmail">
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="password1">
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password1}
                                            onChange={e => setPassword1(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="password2">
                                        <Form.Label>Verify Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Verify your password"
                                            value={password2}
                                            onChange={e => setPassword2(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                </Card.Body>
                                <Card.Footer>
                                    {isActive === true ? 
                                        <div className="d-grid gap-2">
                                            <Button 
                                                variant="success"
                                                type="submit"
                                                block
                                            >
                                                Register
                                            </Button>
                                        </div>
                                        : 
                                            error1 === true || error2 === true ? 
                                            <div className="d-grid gap-2">
                                                <Button
                                                    variant="danger"
                                                    type="submit"
                                                    disabled
                                                    block
                                                >
                                                    Please enter your registration details
                                                </Button>
                                            </div>
                                            : 
                                            <div className="d-grid gap-2">
                                                <Button
                                                    variant="danger"
                                                    type="submit"
                                                    disabled
                                                    block
                                                >
                                                    Passwords must match
                                                </Button>
                                            </div>
                                    }
                                </Card.Footer>
                            </Form>
                        </Card>
                        <p className="text-center mt-3">
                            Already have an account? <Link to={{pathname: '/login', state: { from: 'register'}}}>Click here</Link> to log in.
                        </p>
                    </Col>
                </Row>
    );

}
