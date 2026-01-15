// Icons
import { useSelector } from "react-redux";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">
            <div>
              <h1 className="text-xs font-semibold">Welcome Back!</h1>
              <p className="text-xl font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-purple-600 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <button className="relative text-sm text-white bg-purple-500 hover:bg-purple-600 rounded-full w-8 h-8 flex justify-center items-center">
                    {user?.firstName[0] + user?.lastName[0]}
                  </button>
                </MenuButton>
              </div>
              {user?.jobRole === "Super Admin" && (
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-purple-600 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Settings
                    </a>
                  </MenuItem>
                </MenuItems>
              )}
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default Header;
