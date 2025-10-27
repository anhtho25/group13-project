import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function UserList({ initialAdmin = false }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (initialAdmin) {
        setIsAdmin(true);
        await loadUsers();
      } else {
        await checkAdminAndLoad();
      }
    })();
  }, [initialAdmin]);

  // Kiểm tra role từ /profile và nếu là admin thì load users
  const checkAdminAndLoad = async () => {
    try {
      setLoading(true);
      const res = await API.get("/profile");
      if (res.data?.role !== "admin") {
        setIsAdmin(false);
        alert("Bạn không có quyền truy cập trang này.");
        navigate("/");
        return;
      }
      setIsAdmin(true);
      await loadUsers();
    } catch (err) {
      console.error("Lỗi kiểm tra quyền:", err);
      setError("Bạn cần đăng nhập để truy cập.");
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Lỗi load users:", err);
      setError("Không thể lấy danh sách users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const meToken = localStorage.getItem('token');
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;
    try {
      setDeletingId(id);
      await API.delete(`/users/${id}`);
      // Nếu admin xóa chính mình, logout
      const meRes = await API.get('/profile');
      if (meRes.data?._id === id) {
        localStorage.removeItem('token');
        alert('Bạn đã xóa chính tài khoản của mình. Hệ thống sẽ chuyển hướng tới trang đăng nhập.');
        navigate('/login');
        return;
      }
      alert('Đã xóa user thành công');
      await loadUsers();
    } catch (err) {
      console.error('Lỗi khi xóa user:', err);
      if (err.response?.status === 403) alert('Bạn không có quyền xóa user này');
      else alert('Xóa thất bại');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Trang Admin - Quản lý Users</h2>

      {!isAdmin ? (
        <div className="text-red-500">Bạn không có quyền truy cập.</div>
      ) : (
        <div className="flex-1 overflow-hidden border rounded-lg bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="sticky top-0 px-4 py-2 text-left">STT</th>
                  <th className="sticky top-0 px-4 py-2 text-left">Họ tên</th>
                  <th className="sticky top-0 px-4 py-2 text-left">Email</th>
                  <th className="sticky top-0 px-4 py-2 text-left">Vai trò</th>
                  <th className="sticky top-0 px-4 py-2 text-center">Hành động</th>
                </tr>
              </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 border-b">Không có user nào</td>
                </tr>
              )}
              {users.map((u, idx) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">{idx + 1}</td>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
                      onClick={() => handleDelete(u._id)}
                      disabled={deletingId === u._id}
                    >
                      {deletingId === u._id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
