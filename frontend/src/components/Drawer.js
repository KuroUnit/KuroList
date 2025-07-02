import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, List, Drawer, Typography, Divider, Tooltip,
  CssBaseline, AppBar as MuiAppBar, Toolbar, IconButton, 
  ListItem, ListItemButton, ListItemIcon, ListItemText 
} from '@mui/material';

import { styled, useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListIcon from '@mui/icons-material/List';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchBar from './Search';
import GridMangas from './GridMangas';
import GridLists from './GridLists';

import { authActions } from '../context/authSlice';
import { map_drawer, map_drawer_open, uiActions } from '../context/uiSlice';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'drawer_open' })(
  ({ theme, drawer_open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(drawer_open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'drawer_open',
})(({ theme, drawer_open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(drawer_open && {
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
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const drawer_open = useSelector(map_drawer_open),
        drawer = useSelector(map_drawer);

  const handleDrawerOpen = () => {
    dispatch(uiActions.set_drawer_open(true));
  };

  const handleDrawerClose = () => {
    dispatch(uiActions.set_drawer_open(false));
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" drawer_open={drawer_open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{mr: 2,}, drawer_open && { display: 'none' }]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            KURO LIST
          </Typography>
          {drawer === 'Mangas' ? <SearchBar /> : ''}
          <Tooltip title="Logout" sx={{ marginLeft: 3 }}>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawer_open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Mangas', 'Lists'].map((text, index) => (
            <ListItem key={text} onClick={(ev) => dispatch(uiActions.set_drawer(ev.target.textContent))} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <AutoStoriesIcon /> : <ListIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main drawer_open={drawer_open} sx={{ height: '100%' }}>
        <DrawerHeader />
        {drawer === 'Mangas' ? <GridMangas /> : <GridLists />}
      </Main>
    </Box>
  );
}
