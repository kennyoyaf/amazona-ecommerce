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
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={product.image}
                    title={product.image}
                  ></CardMedia>
                  <CardContent>
                    <Typography>{product.name}</Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size="small" color="primary">
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
