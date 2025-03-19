
import MenuItem from "@/components/generic/menu-item/menu-item.component";
import { menuItems } from "@/constants";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { LogoContainer, NoScrollbarContainer } from "@/styles/global.styles";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";

const AccountNavigation = () => {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className="flex h-screen">
      {/* Fixed Menu Bar */}
      <aside className="w-16 lg:w-36 h-full fixed left-0 top-0 bottom-0 bg-black/5 shadow-sm lg:shadow-black/20 px-2 border-r border-black/10">
        <LogoContainer className="py-8">
          <Link className="bg-white w-12 aspect-square border-2 p-1 border-black/80 rounded-full flex items-center justify-center text-xl" to="/">
            {/* <img src={Logo} alt="logo" /> */}
            <span className="text-indigo-600/90">U</span><span className="text-green-600/90">p</span>
          </Link>
        </LogoContainer>
        <div className="flex flex-col pt-8 gap-2 items-start justify-start w-full">
          {menuItems.map((item, idx) => {
            if (!item.restrictedTo.some(restrictionRole => restrictionRole === currentUser.user?.role)) {
              return null
            }
            return <MenuItem item={item} key={idx} />
          }
          ).filter(Boolean)}
        </div>
      </aside>

      {/* Scrollable Content */}
      <NoScrollbarContainer className="ml-16 lg:ml-36 flex-1 h-screen max-h-screen lg:overflow-y-auto">
        <Outlet />
      </NoScrollbarContainer>
    </div>
  );
};

export default AccountNavigation;
