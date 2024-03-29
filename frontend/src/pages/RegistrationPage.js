import axios from 'axios'
import { useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { BACKEND_URL } from '../configuration/BackendConfig'

function RegistrationPage () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false) // Added loading state

  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    if (password !== passwordConfirmation) {
      toast.warning('Passwords do not match!')
      return
    }

    const postData = {
      password,
      username
    }

    setLoading(true) // Set loading state to true

    console.log('Sending registration data: ', postData)

    axios
      .post(BACKEND_URL + '/register', postData)
      .then((response) => {
        console.log('Register response:', response.data)
        toast.success('User registered successfully!')
        navigate('/login')
      })
      .catch((error) => {
        toast.error('Error registering user!')
        console.error(error.response.data)
      })
      .finally(() => {
        setLoading(false) // Set loading state to false after the request completes
      })
  }

  return (
    <>
      <ToastContainer />
      <Container style={{ marginTop: '250px' }}>
        <Row>
          <Col>
            <h2
              className="text-primary"
              style={{
                fontSize: '24px',
                textAlign: 'center'
              }}
            >
              Registration Page
            </h2>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="username">
                    <Form.Control
                      type="text"
                      placeholder="Username*"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="password">
                    <Form.Control
                      type="password"
                      placeholder="Password*"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="passwordConfirmation">
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password*"
                      value={passwordConfirmation}
                      onChange={(event) =>
                        setPasswordConfirmation(event.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    width: '200px',
                    height: '50px'
                  }}
                  onClick={handleSubmit}
                  disabled={loading} // Disable the button when loading is true
                >
                  {loading ? ( // Conditionally render the button text or a spinner based on the loading state
                    <Spinner animation="border" size="sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    'Register Now'
                  )}
                </Button>
              </div>

              <p
                style={{
                  color: 'black',
                  fontSize: '15px',
                  textAlign: 'center',
                  marginTop: '20px'
                }}
              >
                Already have an account? <a href="/login">Login</a>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default RegistrationPage
