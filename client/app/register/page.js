"use client";

import React, { useContext, useEffect, useState } from "react";
import Layout from "../Components/Layout";
import { Button, List, ListItem, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { Store } from "@/utils/Store";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";

const Register = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      router.push("/shipping");
    }
  }, [userInfo, router]);

  const submitHandler = async (data) => {
    closeSnackbar();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://amazona-ecommerce.onrender.com/product/client/auth/signup",
        data
      );

      dispatch({
        type: "USER_LOGIN",
        payload: {
          user: response.data.data.user,
          accessToken: response.data.data.accessToken,
        },
      });

      Cookies.set(
        "userInfo",
        JSON.stringify({
          user: response.data.data.user,
          accessToken: response.data.data.accessToken,
        }),
        { expires: 7 }
      );

      enqueueSnackbar("Registration successful!", { variant: "success" });
      router.push("/login?redirect=/shipping");
    } catch (error) {
      enqueueSnackbar(error.response?.data || "Registration failed", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleSubmit(submitHandler)}
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <Typography component="h1" variant="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="firstName"
                  label="Firstname"
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message || ""}
                  {...field}
                  sx={{ input: { color: "black" } }}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="lastName"
                  label="Lastname"
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message || ""}
                  {...field}
                  sx={{ input: { color: "black" } }}
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
                required: "Email is required",
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message || ""}
                  {...field}
                  sx={{ input: { color: "black" } }}
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
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message || ""}
                  {...field}
                  sx={{ input: { color: "black" } }}
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
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </ListItem>
          <ListItem>
            Already have an account? &nbsp;
            <Link href="/login">
              <Typography color="primary">Login</Typography>
            </Link>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Register;
