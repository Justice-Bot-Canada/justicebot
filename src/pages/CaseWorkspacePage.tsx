import { useParams, useNavigate } from "react-router-dom";
import { CaseWorkspace } from "@/components/CaseWorkspace";

const CaseWorkspacePage = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  if (!caseId) {
    return null;
  }

  return (
    <CaseWorkspace 
      caseId={caseId} 
      onBack={() => navigate('/dashboard')} 
    />
  );
};

export default CaseWorkspacePage;
