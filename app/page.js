'use client';

import Image from 'next/image';
import styles from './page.module.css';
import Layout from './Components/Layout';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';
import data from '@/utils/data';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <Box sx={{ padding: '40px 100px' }}>
        <Typography
          variant="h4"
          sx={{ paddingBottom: '20px', fontWeight: 700 }}
        >
          Products
        </Typography>
        <Grid container spacing={3}>
          {data.products.map(product => (
            <Grid item md={4} key={product.name}>
              <Card>
                <Link href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button
                    size="small"
                    sx={{ color: '#7b1fa2', fontWeight: '700' }}
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
