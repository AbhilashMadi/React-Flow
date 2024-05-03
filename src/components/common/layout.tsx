import type { FC, ReactNode } from "react"

import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

interface ILayoutProps {
  children: ReactNode;
}

const Layout: FC<ILayoutProps> = ({ children }) => {

  return <main>
    <Header />
    {children}
    <Footer />
  </main>
}

export default Layout;