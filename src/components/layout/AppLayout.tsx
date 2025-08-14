import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';
import SideBar from '../common/SideBar';
import WhoAmI from '../dev/WhoAmI'; // ★ 追加

const drawerWidth = 240;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: (theme) => theme.palette.grey[100], minHeight: '100vh' }}>
      <CssBaseline />

      {/* {ヘッダー} */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            マルカン 家計簿Webアプリ
          </Typography>

          {/* 右端に現在のログイン情報（デバッグ用） */}
          <Box sx={{ ml: 'auto' }}>
            <WhoAmI />
          </Box>
        </Toolbar>
      </AppBar>

      {/* {サイドバー} */}
      <SideBar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        handleDrawerClose={handleDrawerClose}
      />

      {/* {メインコンテンツ} */}
      <Box
        component="main"
        sx={(theme) => ({ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: theme.palette.grey[100],
          minHeight: '100vh',
          [theme.breakpoints.down('sm')]: {
            p: 0,
            width: '100%'
          }
        })}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
