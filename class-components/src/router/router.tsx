import { createBrowserRouter, RouterProvider } from 'react-router';
import MainPage from '../pages/main/main';
import NotFoundPage from '../pages/404/404';
import { appRoutes } from './routes';
import AboutPage from '../pages/about/about';

const router = createBrowserRouter([
  {
    path: appRoutes.main,
    element: <MainPage />
  },
  {
    path: appRoutes.about,
    element: <AboutPage />
  },
  {
    path: appRoutes.notFound,
    element: <NotFoundPage />
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />
}