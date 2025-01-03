const placeOrderHandler = async () => {
  closeSnackbar();
  try {
    setLoading(true);
    const payload = {
      user: userInfo.id,
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country
      },
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false
    };
    console.log('Payload to send:', payload);
    console.log('Authorization Header:', userInfo?.accessToken);

    const { data } = await axios.post(
      'http://localhost:4000/product/order/details',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${userInfo.accessToken}`
        }
      }
    );
    dispatch({ type: 'CART_CLEAR' });
    Cookies.remove('cartItems');
    setLoading(false);
    router.push(`/order/${data._id}`);
    console.log(data);
  } catch (error) {
    setLoading(false);
    if (error.response) {
      // Server responded with a status other than 200 range
      if (error.response.status === 401) {
        enqueueSnackbar('Unauthorized: Please log in again.', {
          variant: 'error'
        });
        // router.push('/login'); // Redirect to login if unauthorized
      } else {
        enqueueSnackbar('Failed to place order. Try again.', {
          variant: 'error'
        });
      }
      console.error('Error response:', error.response);
    } else if (error.request) {
      // Request was made but no response received
      enqueueSnackbar('Network error: Please check your connection.', {
        variant: 'error'
      });
      console.error('Error request:', error.request);
    } else {
      // Something else happened while setting up the request
      enqueueSnackbar('An unexpected error occurred. Try again.', {
        variant: 'error'
      });
      console.error('Error message:', error.message);
    }
  }
};
