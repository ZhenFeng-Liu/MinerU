import { Route } from "react-router-dom";
import PDFUpload from "@/pages/extract/components/pdf-upload";
import PDFExtractionJob from "@/pages/extract/components/pdf-extraction";
import TalentManagement from "@/pages/talent";

function AppRoutes() {
  return (
    <>
      <Route path="/OpenSourceTools/Extractor/PDF" element={<PDFUpload />} />
      <Route
        path="/OpenSourceTools/Extractor/PDF/:jobID"
        element={<PDFExtractionJob />}
      />
      <Route path="/talent" element={<TalentManagement />} />
    </>
  );
}

export default AppRoutes;
