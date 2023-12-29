import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useUserStore } from './store/useUserStore';
import { AuthCheck } from './components/AuthCheck';
import Movie from './pages/Movie';
import MenuBar from './components/TopBar';
import Home from './pages/Home';

const AppRouter = () => {
    const isLoggedIn = useUserStore(state => state.loggedIn);
   
    return (
        <BrowserRouter>
            <AuthCheck />
            <MenuBar>
                <Routes> 
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
                        <Route path="/movie" element={<Movie />} />
                        <Route path="/" element={<Home />} />
                    </Route>
                </Routes>
            </MenuBar>
        </BrowserRouter>
    );
};

export default AppRouter;