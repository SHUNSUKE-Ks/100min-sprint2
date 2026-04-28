import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './RootLayout'
import { SprintBoard } from './screens/SprintBoard'
import { SummaryView } from './screens/SummaryView'
import { SettingsScreen } from './screens/SettingsScreen'
import { SplashScreen } from './screens/SplashScreen'

export const router = createBrowserRouter([
  { path: '/', element: <SplashScreen /> },
  {
    element: <RootLayout />,
    children: [
      { path: '/sprint', element: <SprintBoard /> },
      { path: '/task/:id', element: <SprintBoard /> },
      { path: '/summary', element: <SummaryView /> },
      { path: '/settings', element: <SettingsScreen /> },
    ],
  },
])
