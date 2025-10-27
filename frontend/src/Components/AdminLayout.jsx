import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Admin Panel</h3>
            <p className="text-sm text-gray-500">Quản lý hệ thống</p>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-100">
                  Quản lý Users
                </Link>
              </li>
              <li>
                <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-100">
                  Về trang chính
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded shadow p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
