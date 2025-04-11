import { NavLink } from "react-router-dom";
import SidebarAdmin from "../../components/Sidebar/SidebarAdmin"
import AdminHeader from "../../components/header/adminHeader";
import {
  UserPlusIcon,
  UsersIcon,
  CogIcon,
  BellIcon,
} from "@heroicons/react/24/outline"; // Icons for visual cues

const AdminSetting = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <AdminHeader />

        {/* Settings Section */}
        <div className="p-8 max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Admin Settings
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your system preferences and administrative actions.
            </p>
          </header>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add Senior Doctor */}
            <NavLink
              to="/dashboard/add-Senior"
              className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Add a senior doctor"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                  <UserPlusIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Add Senior Doctor
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Register a new senior doctor with auto-approved status.
                  </p>
                </div>
              </div>
            </NavLink>

            {/* Manage Users */}
            <NavLink
              to="/dashboard/manage-users"
              className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Manage users"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-300">
                  <UsersIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Manage Users
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    View and edit user profiles and roles.
                  </p>
                </div>
              </div>
            </NavLink>

            {/* System Settings */}
            <NavLink
              to="/dashboard/system-settings"
              className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="System settings"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-300">
                  <CogIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    System Settings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure system-wide preferences and options.
                  </p>
                </div>
              </div>
            </NavLink>

            {/* Notification Settings */}
            <NavLink
              to="/dashboard/notification-settings"
              className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Notification settings"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-300">
                  <BellIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notification Settings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Customize how and when you receive notifications.
                  </p>
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSetting;