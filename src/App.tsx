import { RoutePaths } from "@/utils/routes";
import { type FC, lazy, LazyExoticComponent, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/components/common/layout";

const Workflow: LazyExoticComponent<FC> = lazy(() => import("@/pages/workflow"));

const App: FC = () => {

  return <Suspense fallback={"loading..."}>
    <Layout>
      <Routes>
        <Route index path={RoutePaths.LANDING} element={<>Welcome</>} />
        <Route path={RoutePaths.WORKFLOW} element={<Workflow />} />
      </Routes>
    </Layout>
  </Suspense>
}

export default App;