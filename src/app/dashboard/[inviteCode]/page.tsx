import { Suspense } from "react";
import { DashboardClient } from "@/components/DashboardClient";

export default function DashboardPage({ params }: { params: { inviteCode: string } }) {
  return (
    <Suspense fallback={null}>
      <DashboardClient inviteCode={params.inviteCode} />
    </Suspense>
  );
}
