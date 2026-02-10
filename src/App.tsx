import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Navigation, PageLayout } from './components/layout'
import { initialItems } from './constants/initialItems'
import { seedItemsIfNeeded } from './utils/storage'

function App() {
  useEffect(() => {
    void seedItemsIfNeeded(initialItems)
  }, [])

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
