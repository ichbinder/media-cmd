import React, { FunctionComponent, PropsWithChildren } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Box, Avatar, Menu, MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import IconButton from '@mui/material/IconButton';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { styled, useTheme } from '@mui/material/styles';


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

interface MenuBarProps {
    setDrawerOpen: (open: boolean) => void;
    drawerOpen: boolean;
    drawerWidth: number;
}

const MenuBar: FunctionComponent<PropsWithChildren<MenuBarProps>> = (props) => {
    const theme = useTheme();
    const isLoggedIn = useUserStore(state => state.loggedIn);
    const logOut = useUserStore(state => state.logOut);

    const navigate = useNavigate();

    const handleDrawerClose = (link: string) => {
        props.setDrawerOpen(false);
        navigate('/search');
    };

    const menuItems = [
        { text: 'Search', icon: <AccountCircleIcon />, link: '/search' },
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/search' },
        { text: 'About', icon: <InfoIcon />, link: '/search' },
        // Weitere Menüeinträge...
    ];

    return (
        // <Drawer
        //     variant="permanent"
        //     sx={{
        //         width: props.drawerOpen ? drawerWidth : 0,
        //         '& .MuiDrawer-paper': {
        //             width: props.drawerOpen ? drawerWidth : 0,
        //             boxSizing: 'border-box',
        //             zIndex: theme.zIndex.appBar - 1, // Um sicherzustellen, dass der Drawer unter der AppBar angezeigt wird
        //             marginTop: '60px', // um die Höhe der AppBar zu kompensieren
        //         },
        //         marginTop: '60px', // um die Höhe der AppBar zu kompensieren
        //     }}
        //     open={props.drawerOpen}
        // >
        //     <List>
        //         {menuItems.map((item) => (
        //             <ListItem key={item.text} onClick={() => handleDrawerClose(item.link)}>
        //                 <ListItemIcon>{item.icon}</ListItemIcon>
        //                 <ListItemText primary={item.text} />
        //             </ListItem>
        //         ))}
        //     </List>
        // </Drawer>
        <Drawer
            sx={{
                width: props.drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: props.drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={props.drawerOpen}
        >
            <DrawerHeader>
                <IconButton onClick={() => props.setDrawerOpen(false)}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            {/* <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List> */}
        </Drawer>
    );
}

export default MenuBar;