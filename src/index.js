
import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store/store'
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthLayout} from './components/index.js'
import './index.css';
import App from './App';

import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import HomePage from  './pages/home.js';
import Account from './pages/account';
import Admin from './pages/admin.js'
import About from './pages/about.js';
import Event from "./pages/event.js"
import Gallery from './pages/gallery.js';
import Trustees from './pages/trustees.js';
import Contribution from './pages/contribution.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path:"/",
        element: <HomePage/>,
      },
      {
        path:"/login",
        element: (
          <AuthLayout authentication={false}>
            <Login/>
          </AuthLayout>
        )
      },
      {
          path: "/signup",
          element: (
              <AuthLayout authentication={false}>
                  <Signup />
              </AuthLayout>
          ),
      },
      {
          path: "/admin",
          element: (
              <AuthLayout authentication>
                  {" "}
                  <Admin/>
              </AuthLayout>
          ),
      },
      {
          path: "/account",
          element: (
              <AuthLayout authentication>
                  {" "}
                  <Account/>
              </AuthLayout>
          ),
      },
      {
          path: "/about",
          element: (
              <AuthLayout authentication>
                  {" "}
                  <About/>
              </AuthLayout>
          ),
      },
      {
          path: "/trustees",
          element: (
              <AuthLayout authentication>
                  {" "}
                  <Trustees/>
              </AuthLayout>
          ),
      },
      {
          path: "/gallery",
          element: (
              <AuthLayout authentication>
                  {" "}
                  <Gallery/>
              </AuthLayout>
          ),
      },
      {
          path: "/contribution",
          element: (
              <AuthLayout authentication>
                  {" "}
                  <Contribution/>
              </AuthLayout>
          ),
      },
        {
            path:"/gallery/:id",
            element:(
                <AuthLayout authentication>
                     {" "}
                     <Event/>
                </AuthLayout>
            ),
        },
        {
            path:"/user/:id",
            element:(
                <AuthLayout authentication>
                     {" "}
                     <Account/>
                </AuthLayout>
            ),
        },
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)

