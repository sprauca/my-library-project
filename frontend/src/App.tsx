import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Box} from '@chakra-ui/react';
import useAuth from './hooks/useAuth';

import Header from './components/Haeder';
import Home from './pages/Home';
import Games from './pages/Games';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  const {initialized} = useAuth();

  if (!initialized) return <p>Auth loading...</p>;

  return (
    <Router>
      <Box minH="100vh" bg="gray.100">
        <Header />
        <Box maxW="6xl" mx="auto" px={4} py={6}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/games" 
              element={
                <ProtectedRoute>
                  <Games />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;