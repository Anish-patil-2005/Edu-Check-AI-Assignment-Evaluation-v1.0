import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useState } from "react";
import { teacherMenu, studentMenu } from "./menuItems.js";

function Layout() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  // Select menu based on role
  const menuItems = user?.role === "teacher" ? teacherMenu : studentMenu;

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center justify-start rtl:justify-end">
              <Link to="/" className="flex ms-2 md:me-24">
                <img
                  src="../../public/image.png"
                  className="h-8 me-3"
                  alt="Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  EduCheck - AI-Assignment-Evaluation
                </span>
              </Link>
            </div>

            {/* Profile Section */}
            <div className="flex items-center relative">
              <div className="flex items-center ms-3">
                <h3 className="text-gray-900 text-2xl dark:text-white p-1">
                  {user?.role}
                </h3>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  >
                    <img
                      className="w-8 h-8 rounded-full"
                      src="../../public/8847419.png"
                      alt="user photo"
                    />
                  </button>

                  {/* Dropdown */}
                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg dark:bg-gray-700">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => logout()}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Profile ends */}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform 
                   -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 
                   dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.path}
                  className="flex items-center p-2 text-gray-900 rounded-lg 
                             dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className="ms-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
