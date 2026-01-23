import React from "react";
import { useParams } from "react-router-dom";
import Triage from "./Triage";

/**
 * Shareable, rewrite-friendly case URL.
 *
 * IMPORTANT: We intentionally avoid doing any UUID parsing/validation in render.
 * Validation + any Supabase access happens inside Triage's mount effect.
 */
const Case = () => {
  const { caseId } = useParams();
  return <Triage initialCaseId={caseId} />;
};

export default Case;
