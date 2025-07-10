"use client";

import { Store } from "@/utils/Store";
import Layout from "./Components/Layout";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import TransitionLink from "@/utils/TransitionLink";

const apiUrl =
  "https://amazona-ecommerce.onrender.com/product/get-all-products";

export default function Home() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchDataForPosts = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        let postsData = await response.json();
        setProducts(postsData.data);
      } catch (err) {
        setProducts(null);
      }
    };

    fetchDataForPosts();
  }, []);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `https://amazona-ecommerce.onrender.com/product/get-product/${product._id}`
    );
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    router.push("/cart");
  };
  return (
    <Layout>
      <Box sx={{ padding: { xs: "40px 0", md: "40px 100px" } }}>
        <Typography
          variant="h4"
          sx={{ paddingBottom: "20px", fontWeight: 700 }}
        >
          Products
        </Typography>
        <Grid container spacing={3}>
          {products?.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <TransitionLink href={`/product/${product._id}`}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                      alt={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography color="primary">{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </TransitionLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button
                    size="small"
                    sx={{ fontWeight: "700" }}
                    color="primary"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}
