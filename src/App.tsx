import Layout from "@/components/common/layout";
import AppContext from "@/context/app-context";
import { RoutePaths } from "@/lib/routes";
import { type FC, lazy, LazyExoticComponent, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import SuspensIcon from "@/components/common/suspense-icon";

const Workflow: LazyExoticComponent<FC> = lazy(() => import("@/pages/workflow"));
const HeroPage: LazyExoticComponent<FC> = lazy(() => import("@/pages/hero-page"));

const App: FC = () => {

  return <Suspense fallback={<main className="grid-center h-dvh w-full"><SuspensIcon /></main>}>
    <AppContext>
      <Layout>
        <Routes>
          <Route index path={RoutePaths.LANDING} element={<HeroPage />} />
          <Route path={RoutePaths.WORKFLOW} element={<Workflow />} />
        </Routes>
      </Layout>
    </AppContext>
  </Suspense>
}

export default App;