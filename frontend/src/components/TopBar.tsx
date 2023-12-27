import React, { FunctionComponent, PropsWithChildren } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import UserMenu from './UserMenu';
import MenuBar from './MenuBar';
import { useUserStore } from '../store/useUserStore';
import SearchIcon from '@mui/icons-material/Search';
import SearchField from './searchField/SearchField';


const drawerWidth = 200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

type TopBarProps = {};


const TopBar: FunctionComponent<PropsWithChildren<TopBarProps>> = (props) => {
    const [open, setOpen] = React.useState(false);
    const isLoggedIn = useUserStore(state => state.loggedIn);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {isLoggedIn && <AppBar position="fixed" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: open ? 'flex-end' : 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                        <SearchField />
                        <UserMenu />
                    </Box>
                </Toolbar>
            </AppBar>}
            {isLoggedIn && <MenuBar drawerOpen={open} setDrawerOpen={setOpen} drawerWidth={drawerWidth} />}
            <Main open={open}>
                {isLoggedIn && <DrawerHeader />}
                {props.children}
            </Main>
        </Box>
    );
}

export default TopBar;