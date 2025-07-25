"use client";

import { Store } from "@/utils/Store";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../Components/Layout";
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import TransitionLink from "@/utils/TransitionLink";
import { useRouter } from "next/navigation";

const Cart = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const {
    cart: { cartItems = [] },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(
      `https://amazona-ecommerce.onrender.com/product/get-product/${item._id}`
    );
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  const removeHandler = async (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const checkoutHandler = () => {
    if (userInfo) {
      router.push("/shipping");
    } else {
      router.push("/login");
    }
  };

  return (
    <Layout title="Shopping Cart">
      <Box sx={{ marginLeft: { md: "80px" } }}>
        <Typography component="h1" variant="h1">
          Shopping Cart
        </Typography>
        {cartItems.length === 0 ? (
          <div>
            Cart is empty.{" "}
            <Link href="/" style={{ color: "red" }}>
              Go Shopping
            </Link>
          </div>
        ) : (
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
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
                            <Typography color="primary">{item.name}</Typography>
                          </TransitionLink>
                        </TableCell>
                        <TableCell align="right">
                          <Select
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartHandler(item, e.target.value)
                            }
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <MenuItem key={x + 1} value={x + 1}>
                                {x + 1}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell align="right">${item.price}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => removeHandler(item)}
                          >
                            x
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Typography variant="h2">
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                      items) : ${" "}
                      {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Button
                      onClick={checkoutHandler}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Check Out
                    </Button>
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

export default Cart;
