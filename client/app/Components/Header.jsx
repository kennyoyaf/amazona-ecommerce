'use client';

import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Switch,
  SvgIcon,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Cookies from 'js-cookie';
import TransitionLink from '@/utils/TransitionLink';
import { useRouter } from 'next/navigation';

export default function Header({ dispatch, darkMode, cart, userInfo }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [checked, setChecked] = useState(darkMode);
  const [cartItemsLength, setCartItemsLength] = useState(0);

  const router = useRouter();
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setCartItemsLength(cart?.cartItems?.length || 0);
  }, [cart]);

  const darkModeChangeHandler = () => {
    const newDarkMode = !checked;
    setChecked(newDarkMode);
    dispatch({ type: newDarkMode ? 'DARK_MODE_ON' : 'DARK_MODE_OFF' });
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF', { expires: 100 });
  };

  if (!isClient) {
    return null;
  }

  const open = Boolean(anchorEl);
  const loginClickHandler = e => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = () => {
    setAnchorEl(null);
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#203040',
        '& a': {
          color: '#ffffff',
          marginLeft: 2
        }
      }}
    >
      <Toolbar>
        <TransitionLink href="/">
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}
          >
            amazona
          </Typography>
        </TransitionLink>

        <Box sx={{ flexGrow: 1 }}></Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Switch checked={checked} onChange={darkModeChangeHandler} />
          <TransitionLink href="/cart">
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <SvgIcon color="secondary">
                <ShoppingCartIcon />
              </SvgIcon>
              {cartItemsLength > 0 && (
                <Box
                  position="absolute"
                  top="-4px"
                  right="-4px"
                  width="18px"
                  height="18px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bgcolor="secondary.main"
                  borderRadius="50%"
                  color="white"
                  fontSize="12px"
                >
                  {cartItemsLength}
                </Box>
              )}
            </Box>
          </TransitionLink>
          {userInfo ? (
            <>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={loginClickHandler}
                sx={{
                  color: '#ffffff',
                  textTransform: 'initial',
                  height: '20px'
                }}
              >
                {userInfo.user.firstName}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={loginMenuCloseHandler}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem onClick={loginMenuCloseHandler}>Profile</MenuItem>
                <MenuItem onClick={loginMenuCloseHandler}>My account</MenuItem>
                <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <TransitionLink href="/login">Login</TransitionLink>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
