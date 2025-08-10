import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import Analytics from './pages/Analytics';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import {theme} from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import { TransactionProvider } from './contexts/TransactionContext';
import AuthGate from './guards/AuthGate';
import AuthBootstrapper from './guards/AuthBootstrapper';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthBootstrapper />
      <AuthGate>
      <TransactionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={ <Home />} />
              <Route path="/report" element={ <Report />} />
              <Route path="/analytics" element={ <Analytics />} />
            <Route path="*" element={ <NoMatch />} />
          </Route>
        </Routes>
      </Router>
      </TransactionProvider>
      </AuthGate>
    </ThemeProvider>
  );
}

export default App;
