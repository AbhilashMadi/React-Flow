import { RoutePaths } from "@/utils/routes";
import { type FC, lazy, LazyExoticComponent, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/components/common/layout";
import AppContext from "@/context/app-context";

const Workflow: LazyExoticComponent<FC> = lazy(() => import("@/pages/workflow"));

const App: FC = () => {

  return <Suspense fallback={"loading..."}>
    <AppContext>
      <Layout>
        <Routes>
          <Route index path={RoutePaths.LANDING} element={<>Welcome</>} />
          <Route path={RoutePaths.WORKFLOW} element={<Workflow />} />
        </Routes>
      </Layout>
    </AppContext>
  </Suspense>
}

export default App;