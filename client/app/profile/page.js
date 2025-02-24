'use client';

import { useRouter } from 'next/navigation';
import { Store } from '@/utils/Store';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../Components/Layout';
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Profile() {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
  });

  const submitHandler = async data => {
    closeSnackbar();
    setIsLoading(true);

    try {
      const response = await axios.put(
        'http://localhost:4000/product/client/auth/signup',
        data
      );

      dispatch({
        type: 'USER_LOGIN',
        payload: {
          user: response.data.data.user,
          accessToken: response.data.data.accessToken
        }
      });

      Cookies.set(
        'userInfo',
        JSON.stringify({
          user: response.data.data.user,
          accessToken: response.data.data.accessToken
        }),
        { expires: 7 }
      );

      enqueueSnackbar('Profile updated successful!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.response?.data || 'Registration failed', {
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Profile">
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
                  <ListItem selected component="a">
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
                  <ListItem component="a">
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
                    Profile
                  </Typography>
                </ListItem>

                <ListItem>
                  <form
                    onSubmit={handleSubmit(submitHandler)}
                    style={{ maxWidth: 800, margin: '0 auto' }}
                  >
                    <List>
                      <ListItem>
                        <Controller
                          name="firstName"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'First name is required' }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="firstName"
                              label="Firstname"
                              error={Boolean(errors.firstName)}
                              helperText={errors.firstName?.message || ''}
                              {...field}
                              sx={{ input: { color: 'black' } }}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="lastName"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Last name is required' }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="lastName"
                              label="Lastname"
                              error={Boolean(errors.lastName)}
                              helperText={errors.lastName?.message || ''}
                              {...field}
                              sx={{ input: { color: 'black' } }}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="email"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: 'Email is required',
                            pattern: {
                              value:
                                /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                              message: 'Invalid email address'
                            }
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="email"
                              label="Email"
                              error={Boolean(errors.email)}
                              helperText={errors.email?.message || ''}
                              {...field}
                              sx={{ input: { color: 'black' } }}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="password"
                          control={control}
                          defaultValue=""
                          rules={{
                            validate: value =>
                              value === '' ||
                              value.length > 5 ||
                              'Password must be at least 6 characters long'
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="password"
                              label="Password"
                              type="password"
                              error={Boolean(errors.password)}
                              helperText={
                                errors.password
                                  ? 'Password length is more than 5'
                                  : ''
                              }
                              {...field}
                              sx={{ input: { color: 'black' } }}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          color="primary"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                      </ListItem>
                    </List>
                  </form>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
