import { Outlet } from 'react-router-dom'
import { Navigation, PageLayout } from './components/layout'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <PageLayout>
        <Outlet />
      </PageLayout>
    </div>
  )
}

export default App
