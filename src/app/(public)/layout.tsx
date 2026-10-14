import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Global3DEnvironment } from '@/components/background/Global3DEnvironment'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden w-full">
      <div className="hidden md:block">
        <Global3DEnvironment />
      </div>
      <Navbar />
      <div className="flex-grow pt-16 relative z-10">
        {children}
      </div>
      <Footer />
    </div>
  )
}
