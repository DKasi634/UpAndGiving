import MenuItem from "@/components/menu-item.component";
import { menuItems } from "@/constants";
import { Outlet } from "react-router-dom";

const AccountNavigation = () => {
  return (
    <div className="flex h-screen">
      {/* Fixed Menu Bar */}
      <aside className="w-16 lg:w-36 h-full fixed left-0 top-0 bottom-0 bg-white border-r border-black/40 shadow-sm drop-shadow-md shadow-black/10 px-1">
        <div className="flex flex-col pt-8 gap-2 items-start justify-start w-full">
          {menuItems.map((item, idx) => (
            <MenuItem item={item} key={idx} />
          ))}
        </div>
      </aside>

      {/* Scrollable Content */}
      <main className="ml-16 lg:ml-36 flex-1 h-screen max-h-screen lg:overflow-y-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountNavigation;
