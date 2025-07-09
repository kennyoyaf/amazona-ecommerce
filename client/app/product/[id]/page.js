"use client";

import Layout from "@/app/Components/Layout";
import { Store } from "@/utils/Store";
import TransitionLink from "@/utils/TransitionLink";
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function ProductScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { id } = useParams();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchDataForPosts = async () => {
      try {
        const response = await fetch(
          `https://amazona-ecommerce.onrender.com/product/get-product/${id}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        let postsData = await response.json();
        setProduct(postsData.data);
      } catch (err) {
        setProduct(null);
      }
    };

    fetchDataForPosts();
  }, [id]);

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };
  return (
    <Layout title={product.name} description={product.description}>
      <Box sx={{ marginLeft: { xs: "0", md: "80px" } }}>
        <Box sx={{ marginTop: "20px", marginBottom: "20px" }}>
          <TransitionLink href="/">
            <Typography sx={{ fontWeight: 700 }} color="primary">
              Back to products
            </Typography>
          </TransitionLink>
        </Box>
        <Grid container spacing={1}>
          <Grid item md={6} xs={12}>
            <Image
              src={product.image}
              alt={product.name || "Product Image"}
              width={640}
              height={640}
              layout="intrinsic"
            ></Image>
          </Grid>
          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography
                  component="h1"
                  variant="h1"
                  sx={{ fontWeight: 700 }}
                >
                  {product.name}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography sx={{ fontWeight: 700 }}>
                  Category: {product.category}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography sx={{ fontWeight: 700 }}>
                  Brand: {product.brand}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography sx={{ fontWeight: 700 }}>
                  Rating:
                  {product.rating} stars ({product.numReviews} reviews)
                </Typography>
              </ListItem>
              <ListItem>
                <Typography sx={{ fontWeight: 700 }}>
                  Description: {product.description}
                </Typography>
              </ListItem>
            </List>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card sx={{ marginRight: "50px" }}>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Price</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>${product.price}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Status</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        {product.countInStock > 0 ? "In stock" : "Unavailable"}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={addToCartHandler}
                  >
                    Add to cart
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
