import './App.scss';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import CreateReport from './pages/reports/CreateReport';
import Users from './pages/reports/Users';
import VisReport from './pages/reports/VisReport';
import AssignReport from './pages/reports/AssignReport';
import MyReports from './pages/reports/MyReports';

// router dom para manejar rutas
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />, 
  },
  {
    path: '/register',
    element: <Register />, 
  },
  {
    path: '/dashboard', 
    element: <Dashboard />,  //rutas hijas para la sidebar del dashboard
    children: [
      {
        path: '/report',
        element: <CreateReport />, 
      },
      {
        path: '/visualize',
        element: <VisReport />, 
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/assign',
        element: <AssignReport />, 
      },
      {
        path: '/myreports',
        element: <MyReports />, 
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
