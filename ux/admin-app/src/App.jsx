import { Toaster, toast } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import NotFound from "./modules/subscription-plan/pages/NotFoundPage";
import SuperAdminPage from "./modules/subscription-plan/pages/SuperAdminPage";
import "./config/i18n.js";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<SuperAdminPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
