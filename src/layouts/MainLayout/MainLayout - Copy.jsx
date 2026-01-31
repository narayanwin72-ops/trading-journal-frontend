import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import "./MainLayout.css";

export default function MainLayout({ userPlan, children }) {
  const user = { name: "Narayan Pal" };
  const isFree = userPlan === "free";

  return (
    <div className="layout">
      <Sidebar userPlan={userPlan} />

      <div className="content">
        <Topbar user={user} />

        <div
          className="page-container"
          style={{
            maxWidth: isFree ? "1000px" : "100%",
            margin: isFree ? "0 auto" : "0",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
