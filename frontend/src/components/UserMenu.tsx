import React, { useState } from 'react';
import {
  IconButton, ListItemIcon, Avatar, Menu, MenuItem
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

const UserMenu = () => {
    const isLoggedIn = useUserStore(state => state.loggedIn);
    const logOut = useUserStore(state => state.logOut);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleUserMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logOut();
        handleUserMenuClose();
    };

    return (
        <>
            {isLoggedIn && (
                <>
                    <IconButton onClick={handleUserMenuOpen} size="large">
                        <Avatar alt="Benutzerbild" src="/images/avatar.jpg" />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleUserMenuClose}
                    >
                        <MenuItem onClick={handleUserMenuClose}>Profil</MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Logout
                        </MenuItem>
                    </Menu>
                </>
            )}
        </>
    );
}

export default UserMenu;