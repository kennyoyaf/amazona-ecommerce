'use client';

import { Store } from '@/utils/Store';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Layout from '../../Components/Layout';
import {
  Box,
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
import { useParams, useRouter } from 'next/navigation';
import CheckoutWizard from '../../Components/checkoutWizard';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const Order = () => {
  const router = useRouter();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [orderData, setOrderData] = useState([]);

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: ''
  });

  // const {
  //   orderItems = [],
  //   shippingAddress,
  //   paymentMethod,
  //   itemsPrice,
  //   taxPrice,
  //   shippingPrice,
  //   totalPrice
  // } = order;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const response = await fetch(
          `http://localhost:4000/product/order/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.accessToken}`
            }
          }
        );

        const data = await response.json();
        console.log(data.data);
        setOrderData(data.data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        setOrderData(null);
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    if (!order._id || (order._id && order._id !== id)) {
      fetchOrder();
    }
  }, [order._id, id, userInfo, router]);

  return (
    <Layout title={`Order ${id}`}>
      <Box sx={{ marginLeft: { md: '80px' } }}>
        <CheckoutWizard activeStep={3} />
        <Typography component="h1" variant="h1">
          Order {id}
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography>{error}</Typography>
        ) : (
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
                    {orderData.shippingAddress?.fullName},{' '}
                    {orderData.shippingAddress?.address},{' '}
                    {orderData.shippingAddress?.city},{' '}
                    {orderData.shippingAddress?.postalCode},{' '}
                    {orderData.shippingAddress?.country}
                  </ListItem>
                  <ListItem>
                    Status:{' '}
                    {orderData.isDelivered
                      ? `delivered at ${orderData.deliveredAt}`
                      : 'not delivered'}
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
                  <ListItem>{orderData.paymentMethod}</ListItem>
                  <ListItem>
                    Status:{' '}
                    {orderData.isPaid
                      ? `paid at ${orderData.paidAt}`
                      : 'not paid'}
                  </ListItem>
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
                          {orderData.orderItems.map(item => (
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
                        <Typography align="right">
                          ${orderData.itemsPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Tax:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          ${orderData.taxPrice}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Shipping:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          ${orderData.shippingPrice}
                        </Typography>
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
                          <strong> ${orderData.totalPrice}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default Order;
