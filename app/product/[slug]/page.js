'use client';

import Layout from '@/app/Components/Layout';
import data from '@/utils/data';
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  Typography
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

export default function ProductScreen() {
  const { slug } = useParams();
  const product = data.products.find(a => a.slug === slug);
  if (!product) {
    return <div>Product Not Found</div>;
  }
  return (
    <Layout title={product.name} description={product.description}>
      <Box sx={{ marginLeft: '80px' }}>
        <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
          <Link href="/">
            {' '}
            <Typography sx={{ fontWeight: 700 }}>
              Back to products
            </Typography>{' '}
          </Link>
        </Box>
        <Grid container spacing={1}>
          <Grid item md={6} xs={12}>
            <Image
              src={product.image}
              alt={product.name}
              width={640}
              height={640}
              layout="responsive"
            ></Image>
          </Grid>
          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography component="h1" sx={{ fontWeight: 700 }}>
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
            <Card sx={{ marginRight: '50px' }}>
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
                        ${product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Button fullWidth variant="contained" color="primary">
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
