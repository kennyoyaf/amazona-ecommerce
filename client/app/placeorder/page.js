'use client';

import { Store } from '@/utils/Store';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../Components/Layout';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import TransitionLink from '@/utils/TransitionLink';
import { useRouter } from 'next/navigation';
import CheckoutWizard from '../Components/checkoutWizard';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const Placeorder = () => {
  const router = useRouter();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod }
  } = state;

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!paymentMethod) {
      router.push('/payment');
    }
    // if (cartItems.length === 0) {
    //   router.push('/cart');
    // }
  }, [cartItems.length, paymentMethod, router]);
  if (!isMounted) {
    return null;
  }

  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const round2 = num => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
      const itemsPrice = round2(
        cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
      );
      const shippingPrice = itemsPrice > 200 ? 10 : 25;
      const taxPrice = round2(itemsPrice * 0.15);
      const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

      const payload = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid: false,
        isDelivered: false
      };

      const response = await fetch(
        'http://localhost:4000/product/order/details',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.accessToken}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      const newData = data.data;
      router.push(`/order/${newData._id}`);
      dispatch({ type: 'CART_CLEAR' });
      Cookies.remove('cartItems');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401) {
        enqueueSnackbar('Unauthorized: Please log in again.', {
          variant: 'error'
        });
        router.push('/login');
      } else {
        enqueueSnackbar('Failed to place order. Try again.', {
          variant: 'error'
        });
      }
    }
  };

  const round2 = num => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  const shippingPrice = itemsPrice > 2200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return (
    <Layout title="Place Order">
      <Box sx={{ marginLeft: { md: '80px' } }}>
        <CheckoutWizard activeStep={3} />
        <Typography component="h1" variant="h1">
          Place Order
        </Typography>
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card sx={{ margin: '10px 0' }}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress?.fullName}, {shippingAddress?.address},{' '}
                  {shippingAddress?.city}, {shippingAddress?.postalCode},{' '}
                  {shippingAddress?.country}
                </ListItem>
              </List>
            </Card>
            <Card sx={{ margin: '10px 0' }}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Payment Methods
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
              </List>
            </Card>
            <Card sx={{ margin: '10px 0' }}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map(item => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <Link href={`/product/${item._id}`} passHref>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                />
                              </Link>
                            </TableCell>
                            <TableCell>
                              <TransitionLink
                                href={`/product/${item._id}`}
                                passHref
                              >
                                <Typography color="primary">
                                  {item.name}
                                </Typography>
                              </TransitionLink>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography> ${item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card sx={{ md: { margin: '10px 0' } }}>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong> Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong> ${totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Button
                    onClick={placeOrderHandler}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Place Order
                  </Button>
                </ListItem>
                {loading && (
                  <ListItem>
                    <CircularProgress />
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Placeorder;
