import React from 'react';
import AdminLayout from './AdminLayout';
import UserList from './UserList';

export default function AdminPage() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-xl font-bold mb-4">Quản lý người dùng</h1>
        <p className="text-sm text-gray-600 mb-4">Trang dành cho admin để xem, xóa và quản lý quyền người dùng.</p>
        <UserList />
      </div>
    </AdminLayout>
  );
}
