'use client';

import React, { useContext, useEffect, useState } from 'react';
import Layout from '../Components/Layout';
import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';
import { Store } from '@/utils/Store';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, [userInfo, router]);

  const submitHandler = async data => {
    closeSnackbar();
    try {
      const response = await axios.post(
        'http://localhost:4000/product/client/auth/login',
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
      setIsLoading(true);
      enqueueSnackbar('Login successful!', { variant: 'success' });
      router.push('/');
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Email or password is incorrect', {
        variant: 'error'
      });
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleSubmit(submitHandler)}
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                  message: 'Email is not valid'
                }
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  aria-label="email"
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
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long'
                }
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  aria-label="password"
                  slotProps={{
                    input: {
                      type: 'password'
                    }
                  }}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message || ''}
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
              aria-label="login"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          </ListItem>
          <ListItem>
            Don&apos;t have an account? &nbsp;
            <Link href="/register" passHref>
              <Typography color="primary">Register</Typography>
            </Link>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Login;
