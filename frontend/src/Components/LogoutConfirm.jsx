import React from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import BackButton from './BackButton';
import '../styles/custom.css';

function LogoutConfirm() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("token");
      navigate('/');
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackButton />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="form-container max-w-md w-full text-center">
          <div className="mb-8 text-red-500">
            <svg 
              className="w-16 h-16 mx-auto" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Xác nhận đăng xuất
          </h2>
          
          <p className="text-gray-600 mb-8">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
          </p>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Đăng xuất
            </button>
            
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirm;
