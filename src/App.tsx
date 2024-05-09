import Layout from "@/components/common/layout";
import SuspensIcon from "@/components/common/suspense-icon";
import AppContext from "@/context/app-context";
import { RoutePaths } from "@/lib/routes";
import { type FC, lazy, LazyExoticComponent, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { ErrorBoundary } from "@/components/fallbacks/error-boundary";
import { FallbackProps } from "@/types/error-boundary";

const Workflow: LazyExoticComponent<FC> = lazy(() => import("@/pages/workflow"));
const HeroPage: LazyExoticComponent<FC> = lazy(() => import("@/pages/hero-page"));
const NotFound: LazyExoticComponent<FC> = lazy(() => import("@/pages/not-found"));
const ErrorFallback: LazyExoticComponent<FC<FallbackProps>> = lazy(() => import("@/pages/error-fall-back"));

const App: FC = () => {

  return <Suspense fallback={<main className="grid-center h-dvh w-full"><SuspensIcon /></main>}>
    <AppContext>
      <Layout>
        <Routes>
          <Route index
            path={RoutePaths.LANDING}
            element={
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <HeroPage />
              </ErrorBoundary>} />
          <Route
            path={RoutePaths.WORKFLOW}
            element={
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Workflow />
              </ErrorBoundary>} />
          <Route
            path={RoutePaths.NOT_FOUND}
            element={<NotFound />} />
        </Routes>
      </Layout>
    </AppContext>
  </Suspense>
}

export default App;