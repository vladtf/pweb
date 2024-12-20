import React from 'react'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { FaCloud, FaHome, FaTeamspeak, FaFacebookMessenger, FaUserCircle, FaUserShield } from 'react-icons/fa' // Import the piggy bank icon from react-icons
import axios from 'axios'
import { BACKEND_URL } from '../configuration/BackendConfig'
import { useNavigate, useLocation } from 'react-router-dom'
import { MdOutlineFeedback } from 'react-icons/md'
import ShowErrorToast from '../exception/ToastUtils'

const MyNavbar = () => {
  const username = localStorage.getItem('username')
  const jwtToken = localStorage.getItem('jwtToken')
  const roles = localStorage.getItem('roles')
  const location = useLocation()
  const hideOnRoutes = ['/login', '/registration', '/']

  const currentPage = window.location.pathname

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('email')

    axios
      .get(BACKEND_URL + '/logout')
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        ShowErrorToast(error, 'Error logging out!')
      })
    navigate('/login')
  }

  const dropdownContainerStyle = {
    marginLeft: 'auto',
    marginRight: '100px'
  }

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold'
  }

  const navLinkStyle = {
    marginRight: '10px'
  }

  const dropdownItemStyle = {
    fontSize: '14px'
  }

  if (hideOnRoutes.includes(location.pathname)) {
    return null
  }

  return (
    <Navbar
      expand="lg"
      variant="dark"
      bg="primary"
      style={{
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px'
      }}
      className="mb-4"
    >
      <Navbar.Brand href="/home" style={brandStyle} className="px-2">
        <FaTeamspeak style={{ marginRight: '5px' }} /> Sonor
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="mx-2" />
      <Navbar.Collapse id="basic-navbar-nav" >
        <Nav className="me-auto">
          <Nav.Link href="/home" style={{ ...navLinkStyle, fontWeight: currentPage === '/home' ? 'bold' : 'normal' }} className="px-2">
            <FaHome style={{ marginRight: '5px' }} /> Home
          </Nav.Link>
          <Nav.Link href="/posts" style={{ ...navLinkStyle, fontWeight: currentPage === '/posts' ? 'bold' : 'normal' }} className="px-2">
            <FaCloud style={{ marginRight: '5px' }} /> Posts
          </Nav.Link>
          <Nav.Link href="/conversations" style={{ ...navLinkStyle, fontWeight: currentPage === '/conversations' ? 'bold' : 'normal' }} className="px-2">
            <FaFacebookMessenger style={{ marginRight: '5px' }} /> Conversations
          </Nav.Link>
          <Nav.Link href="/feedbacks" style={{ ...navLinkStyle, fontWeight: currentPage === '/feedbacks' ? 'bold' : 'normal' }} className="px-2">
            <MdOutlineFeedback style={{ marginRight: '5px' }} /> Feedbacks
          </Nav.Link>
        </Nav>
        <Nav style={dropdownContainerStyle}>
          {roles.includes('ADMIN') && jwtToken && (
            <Nav.Link href="/admin" style={navLinkStyle} className="px-2">
              <FaUserShield style={{ marginRight: '5px' }} /> Admin
            </Nav.Link>
          )}
          <NavDropdown
            title={<span><FaUserCircle style={{ marginRight: '5px' }} /> {username}</span>}
          >
            <NavDropdown.Item onClick={() => { }} style={dropdownItemStyle}>
              Change Password
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={handleLogout}
              style={dropdownItemStyle}
            >
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default MyNavbar
