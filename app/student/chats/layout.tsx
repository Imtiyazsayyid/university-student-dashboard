import SideBar from "./components/sidebar/SideBar";
import UserList from "./components/UserList";

const Userlayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SideBar>
      <div className="h-full bg-slate-50">
        <UserList />
        {children}
      </div>
    </SideBar>
  );
};

export default Userlayout;
