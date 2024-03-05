// Importing required modules and functions
import React, { useContext, useEffect, useReducer, useState } from 'react'; // Importing React and its hooks
import { useNavigate, useParams } from 'react-router-dom'; // Importing React Router hooks
import { toast } from 'react-toastify'; // Importing toast notification library
import axios from 'axios'; // Importing Axios for making HTTP requests
import { Store } from '../Store'; // Importing Store context
import { getError } from '../utils'; // Importing utility function
import { Container, Form, Button, ListGroup } from 'react-bootstrap'; // Importing Bootstrap components
import { Helmet } from 'react-helmet-async'; // Importing Helmet for managing document head
import LoadingBox from '../components/LoadingBox'; // Importing loading spinner component
import MessageBox from '../components/MessageBox'; // Importing message box component

// Reducer function for managing state
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

// Main component for editing products
export default function ProductEdit() {
  const navigate = useNavigate(); // Initializing navigate hook
  const params = useParams(); // /product/:id
  const { id: productId } = params; // Extracting product ID from params

  const { state } = useContext(Store); // Accessing state from Store context
  const { userInfo } = state; // Destructuring user info from state
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    }); // Initializing state and dispatch function with useReducer hook

  // Initializing state variables using useState hook
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [from, setFrom] = useState('');
  const [finish, setFinish] = useState('');
  const [description, setDescription] = useState('');

  // Effect hook to fetch product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' }); // Dispatching fetch request action
        const { data } = await axios.get(`/api/products/${productId}`); // Fetching product data
        setName(data.name); // Setting product name
        setSlug(data.slug); // Setting product slug
        setPrice(data.price); // Setting product price
        setImage(data.image); // Setting product image
        setImages(data.images); // Setting product images
        setCategory(data.category); // Setting product category
        setCountInStock(data.countInStock); // Setting product count in stock
        setFrom(data.from); // Setting product origin
        setFinish(data.setFinish); // Setting product finish
        setDescription(data.description); // Setting product description
        dispatch({ type: 'FETCH_SUCCESS' }); // Dispatching fetch success action
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        }); // Dispatching fetch fail action with error payload
      }
    };
    fetchData(); // Calling fetchData function
  }, [productId]); // Dependencies: productId

  // Handler function for form submission
  const submitHandler = async (e) => {
    e.preventDefault(); // Preventing default form submission behavior
    try {
      dispatch({ type: 'UPDATE_REQUEST' }); // Dispatching update request action
      await axios.put(
        `/api/products/${productId}`, // PUT request to update product
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          from,
          finish,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Setting authorization header
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      }); // Dispatching update success action
      toast.success('Product updated successfully', {
        autoClose: 1000, // Display success message for 1 second
      }); // Showing success toast notification
      setTimeout(() => {
        navigate('/admin/products'); // Navigating to '/admin/products' after 1 second
      }, 1000); // Delay: 1000 ms
    } catch (err) {
      toast.error(getError(err)); // Showing error toast notification
      dispatch({ type: 'UPDATE_FAIL' }); // Dispatching update fail action
    }
  };

  // Handler function for uploading files
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0]; // Getting uploaded file
    const bodyFormData = new FormData(); // Creating FormData object
    bodyFormData.append('file', file); // Appending file to FormData object
    try {
      dispatch({ type: 'UPLOAD_REQUEST' }); // Dispatching upload request action
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`, // Setting authorization header
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' }); // Dispatching upload success action

      if (forImages) {
        setImages([...images, data.secure_url]); // Adding uploaded image URL to images array
      } else {
        setImage(data.secure_url); // Setting image URL
      }
      toast.success('Image uploaded successfully. click Update to apply it', {
        autoClose: 1000, // Display success message for 1 second
      }); // Showing success toast notification
    } catch (err) {
      toast.error(getError(err)); // Showing error toast notification
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) }); // Dispatching upload fail action with error payload
    }
  };

  // Handler function for deleting files
  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f); // Logging filename and f
    console.log(images); // Logging images array
    console.log(images.filter((x) => x !== fileName)); // Logging filtered images array
    setImages(images.filter((x) => x !== fileName)); // Updating images array by removing deleted file
    toast.success('Image removed successfully. click Update to apply it'); // Showing success toast notification
  };

  // Rendering UI components
  return (
    <Container className='small-screen'>
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <br />
      <h4 className='box'>Edit Product {productId}</h4>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          {' '}
          {/* Product name input field */}
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          {/* Product slug input field */}
          <Form.Group className='mb-3' controlId='slug'>
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          {/* Product price input field */}
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          {/* Product image input field */}
          <Form.Group className='mb-3' controlId='image'>
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          {/* Upload image input field */}
          <Form.Group className='mb-3' controlId='imageFile'>
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type='file' onChange={uploadFileHandler} />
            {loadingUpload && <LoadingBox delay={1000} />}
          </Form.Group>
          {/* Additional images input field */}
          <Form.Group className='mb-3' controlId='additionalImage'>
            <Form.Label>Additional Images</Form.Label>
            {images.length === 0 && <MessageBox>No image</MessageBox>}
            <ListGroup variant='flush'>
              {/* Mapping through additional images */}
              {images.map((x) => (
                <ListGroup.Item key={x}>
                  {x}
                  <Button variant='light' onClick={() => deleteFileHandler(x)}>
                    <i className='fa fa-times-circle'></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          {/* Upload additional images input field */}
          <Form.Group className='mb-3' controlId='additionalImageFile'>
            <Form.Label>Upload Additional Image</Form.Label>
            <Form.Control
              type='file'
              onChange={(e) => uploadFileHandler(e, true)}
            />
            {loadingUpload && <LoadingBox delay={1000} />}
          </Form.Group>
          {/* Product category input field */}
          <Form.Group className='mb-3' controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          {/* Product origin input field */}
          <Form.Group className='mb-3' controlId='from'>
            <Form.Label>From</Form.Label>
            <Form.Control
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </Form.Group>
          {/* Product finish input field */}
          <Form.Group className='mb-3' controlId='finish'>
            <Form.Label>Finish</Form.Label>
            <Form.Control
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              required
            />
          </Form.Group>
          {/* Product count in stock input field */}
          <Form.Group className='mb-3' controlId='countInStock'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          {/* Product description input field */}
          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={5} // 5 rows
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          {/* Update button */}
          <div className='mb-3'>
            <Button disabled={loadingUpdate} type='submit'>
              Update
            </Button>
            {loadingUpdate && <LoadingBox />}
          </div>
        </Form>
      )}
      <br />
    </Container>
  );
}
