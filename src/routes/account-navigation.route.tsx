import MenuItem from "@/components/generic/menu-item/menu-item.component";
import { menuItems } from "@/constants";
import { NoScrollbarConatiner } from "@/styles/global.styles";
import { Outlet } from "react-router-dom";

const AccountNavigation = () => {
  return (
    <div className="flex h-screen">
      {/* Fixed Menu Bar */}
      <aside className="w-16 lg:w-36 h-full fixed left-0 top-0 bottom-0 bg-white shadow-sm drop-shadow-md  px-2">
        <div className="flex flex-col pt-8 gap-2 items-start justify-start w-full">
          {menuItems.map((item, idx) => (
            <MenuItem item={item} key={idx} />
          ))}
        </div>
      </aside>

      {/* Scrollable Content */}
      <NoScrollbarConatiner className="ml-16 lg:ml-36 flex-1 h-screen max-h-screen lg:overflow-y-auto">
        <Outlet />
      </NoScrollbarConatiner>
    </div>
  );
};

export default AccountNavigation;
