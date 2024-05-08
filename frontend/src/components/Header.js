import { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

const Header = () => {
  // Access the global state and dispatch function from the context
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // removes the user from local storage when signed out
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
  };

  return (
    <header>
      <Navbar className='header' variant='dark' expand='lg'>
        <LinkContainer to='/'>
          <Navbar.Brand className='me-auto'>
            <img src='./images/logo1.png' alt='logo'></img>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto  w-100  justify-content-end'>
            {/* About Us dropdown */}
            <NavDropdown title='About Us' id='basic-nav-dropdown'>
              <NavDropdown.Item href='/about'>About Us</NavDropdown.Item>
              <NavDropdown.Item href='/contact'>Contact Us</NavDropdown.Item>
              {/* call this what you like */}
              <NavDropdown.Item href='/design'>Design</NavDropdown.Item>
            </NavDropdown>

            {/* Display user-related navigation elements */}
            {userInfo ? (
              <NavDropdown title={userInfo.name} id='basic-nav-dropdown'>
                <LinkContainer to='/profile'>
                  <NavDropdown.Item>User Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/orderhistory'>
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                {/* Sign Out option */}
                <Link
                  className='dropdown-item'
                  to='#signout'
                  onClick={signoutHandler}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            ) : (
              <Link className='nav-link' to='/signin'>
                <i class='fas fa-sign-in-alt'></i> Sign In
              </Link>
            )}

            {/* moved cart to end of header */}
            <Link to='/cart' className='nav-link'>
              <i className='fa fa-shopping-cart'></i> Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg='danger'>
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
