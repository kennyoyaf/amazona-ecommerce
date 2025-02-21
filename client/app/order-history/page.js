'use client';

import { useRouter } from 'next/navigation';
import { Store } from '@/utils/Store';
import React, { useContext, useEffect, useState, useReducer } from 'react';
import Layout from '../Components/Layout';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import Link from 'next/link';

const initialState = {
  loading: true,
  orders: [],
  error: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function OrderHistory() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const response = await fetch(
          `http://localhost:4000/product/order-history`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.accessToken}`
            }
          }
        );

        const data = await response.json();
        console.log(data);
        setOrderData(data.data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data.data });
      } catch (error) {
        setOrderData(null);
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchOrder();
  }, []);

  return (
    <Layout title="Order History">
      <Box sx={{ marginLeft: { md: '80px' } }}>
        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card sx={{ margin: '10px 0' }}>
              <List>
                <Link
                  href="/profile"
                  style={{ textDecoration: 'none' }}
                  passHref
                  legacyBehavior
                >
                  <ListItem component="a">
                    <ListItemText
                      primary="User Profile"
                      sx={{ color: 'yellowgreen' }}
                    ></ListItemText>
                  </ListItem>
                </Link>
                <Link
                  href="/order-history"
                  style={{ textDecoration: 'none' }}
                  passHref
                  legacyBehavior
                >
                  <ListItem selected component="a">
                    <ListItemText
                      primary="Order History"
                      sx={{ color: 'yellowgreen' }}
                    ></ListItemText>
                  </ListItem>
                </Link>
              </List>
            </Card>
          </Grid>

          <Grid item md={9} xs={12}>
            <Card sx={{ margin: '10px 0' }}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Order History
                  </Typography>
                </ListItem>

                <ListItem>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography>{error}</Typography>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>DATE</TableCell>
                            <TableCell>TOTAL</TableCell>
                            <TableCell>PAID</TableCell>
                            <TableCell>DELIVERED</TableCell>
                            <TableCell>ACTIONS</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderData.map(order => (
                            <TableRow key={order._id}>
                              <TableCell>{order._id}</TableCell>
                              <TableCell>{order.createdAt}</TableCell>
                              <TableCell>${order.totalPrice}</TableCell>
                              <TableCell>
                                {order.isPaid
                                  ? `paid at ${order.paidAt}`
                                  : 'not paid'}
                              </TableCell>
                              <TableCell>
                                {order.isDelivered
                                  ? `delivered at ${order.deliveredAt}`
                                  : 'not delivered'}
                              </TableCell>
                              <TableCell>
                                <Link href={`/order/${order._id}`} passHref>
                                  <Button variant="contained">Details</Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
