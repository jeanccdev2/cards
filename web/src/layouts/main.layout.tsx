import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Outlet } from "react-router";

export const MainLayout = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};
