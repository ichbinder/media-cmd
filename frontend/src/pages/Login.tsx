import React from 'react';
import SignInSide from '../components/SignInSide';
import { useUserStore, Store } from '../store/useUserStore';

const Login = () => {
  const isLoggedIn = useUserStore((state: Store) => state.loggedIn);

  return (
    isLoggedIn ? <></> :
    <SignInSide />
  );
};

export default Login;
