import { PropsWithChildren } from 'react'

function PageLayout({ children }: PropsWithChildren) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {children}
    </main>
  )
}

export default PageLayout
