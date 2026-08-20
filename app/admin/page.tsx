import type { Metadata } from "next";
import AdminApp from "./AdminApp";
import "./admin.css";

export const metadata: Metadata = {
  title: "Administrácia",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminApp />;
}
