import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './RootLayout'
import { SprintBoard } from './screens/SprintBoard'
import { SummaryView } from './screens/SummaryView'
import { SettingsScreen } from './screens/SettingsScreen'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <SprintBoard /> },
      { path: 'summary', element: <SummaryView /> },
      { path: 'settings', element: <SettingsScreen /> },
    ],
  },
])
