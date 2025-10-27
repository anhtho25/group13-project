import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/custom.css';

function Home() {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleLogout = () => {
    // clear token and redirect to logout confirmation (if exists) or home
    localStorage.removeItem('token');
    navigate('/logout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100 flex items-center">
      <div className="container mx-auto px-6 py-16">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700">Hệ thống Quản lý Người dùng</h1>
            <p className="text-gray-600 text-lg">Quản lý hồ sơ, cập nhật thông tin và bảo mật tài khoản — giao diện gọn, hiện đại và bảo mật.</p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
              {token ? (
                <>
                  <button onClick={() => navigate('/profile')} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow hover:scale-[1.01] transition-transform">
                    Xem hồ sơ của tôi
                  </button>
                  <button onClick={handleLogout} className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow hover:scale-[1.01] transition-transform">
                    Đăng nhập
                  </button>
                  <button onClick={() => navigate('/signup')} className="px-6 py-3 bg-white border border-purple-600 rounded-xl font-medium text-purple-600 hover:bg-purple-50">
                    Đăng ký
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>Nhanh chóng, an toàn và dễ sử dụng. Dành cho sinh viên và giảng viên.</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-inner">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Tính năng</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Xem và cập nhật thông tin cá nhân</li>
                  <li>• Tải ảnh đại diện</li>
                  <li>• Bảo mật bằng JWT</li>
                </ul>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">© 2025 Nhóm 13</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
