import { useContext, useEffect } from 'react';
import { Store } from '../Store';
import { Row, Col, ListGroup } from 'react-bootstrap';

const Sidebar = ({ handleSidebarOpen }) => {
  // ✅ Read { state } from your Store context
  const { state } = useContext(Store) || {};
  // ✅ Safely access cartItems with fallbacks
  const cartItems = state?.cart?.cartItems ?? [];

  const imageStyle = {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
  };

  useEffect(() => {
    handleSidebarOpen();
    const timer = setTimeout(() => {
      handleSidebarOpen();
    }, 2000);
    return () => clearTimeout(timer);
  }, [handleSidebarOpen]);

  return (
    <div className='content'>
      <br />
      <Row>
        <Col>
          {cartItems.length > 0 && (
            <ListGroup>
              <h4 className='text-center'>Items In Cart</h4>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Col>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='img-fluid rounded img-thumbnail'
                      style={imageStyle}
                    />
                    <span>
                      <strong>{item.name}</strong> <br />
                      added to cart
                    </span>
                  </Col>
                  <hr />
                  <Col>Price: ${item.price}</Col>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Sidebar;
