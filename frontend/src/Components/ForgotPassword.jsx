import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('request'); // 'request' | 'reset'
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const tokenInputRef = useRef(null);
  const navigate = useNavigate();
  const [showToken, setShowToken] = useState(true); // checkbox to toggle token visibility (dev only)

  const location = useLocation();

  // Nếu URL có token (ví dụ /forgot-password?token=...), tự điền và chuyển sang bước reset
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const qToken = params.get('token') || params.get('resetToken') || params.get('reset_token');
      if (qToken) {
        setToken(qToken);
        setStep('reset');
        setTimeout(() => {
          try {
            if (tokenInputRef.current) {
              tokenInputRef.current.focus();
              tokenInputRef.current.select?.();
            }
          } catch (e) {}
        }, 100);
      }
    } catch (e) {
      // ignore
    }
  }, [location.search]);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Vui lòng nhập email');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      const res = await API.post('/auth/forgot-password', { email });
      // Nếu backend trả token trực tiếp (dev mode), lấy token để hiển thị cho testing
      // Thử các vị trí có thể chứa token (nhiều backend trả về format khác nhau)
      console.log('forgot-password response', res.data);
      // Backend returns a resetLink (e.g. http://localhost:3000/reset-password/<token>)
      // Try to extract token from that link so we can auto-fill it for dev testing
      let extractedToken;
      try {
        if (res.data?.resetLink) {
          try {
            const u = new URL(res.data.resetLink);
            const parts = u.pathname.split('/').filter(Boolean);
            extractedToken = parts[parts.length - 1];
          } catch (e) {
            // fallback: simple regex
            const m = String(res.data.resetLink).match(/reset-password\/(.+)$/);
            if (m) extractedToken = m[1];
          }
        }

        const returnedToken =
          extractedToken ||
          res.data?.token ||
          res.data?.resetToken ||
          res.data?.reset_token ||
          res.data?.data?.token ||
          res.data?.data?.resetToken ||
          res.data?.data?.reset_token ||
          (typeof res.data === 'string' ? res.data : undefined);

        if (returnedToken) {
          const tok = String(returnedToken);
          setToken(tok);
          setMessage('✅ Token đặt lại mật khẩu đã được tạo (chỉ dùng trong môi trường test).');
          setStep('reset');
          // focus + select token input so user can copy immediately
          setTimeout(() => {
            try {
              if (tokenInputRef.current) {
                tokenInputRef.current.focus();
                tokenInputRef.current.select?.();
              }
            } catch (e) {
              // ignore
            }
          }, 100);
        } else {
          setMessage('✅ Link đặt lại mật khẩu đã được gửi vào email của bạn');
          setStep('reset');
        }
      } catch (e) {
        console.error('Error processing forgot-password response', e);
        setMessage('✅ Link đặt lại mật khẩu đã được gửi vào email của bạn');
        setStep('reset');
      }
    } catch (err) {
      console.error('Lỗi:', err);
      setMessage(err.response?.data?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token || !newPassword || !confirmPassword) {
      setMessage('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      // Backend expects token in URL param: POST /auth/reset-password/:token
      await API.post(`/auth/reset-password/${encodeURIComponent(token)}`, {
        newPassword
      });
      setMessage('✅ Đặt lại mật khẩu thành công');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Lỗi:', err);
      setMessage(err.response?.data?.message || 'Không thể đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToken = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setMessage('✅ Token đã được sao chép vào clipboard');
    } catch (err) {
      console.error('Copy failed', err);
      setMessage('⚠️ Không thể sao chép token');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          {/* Logo/Header */}
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              {step === 'request' ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {step === 'request' 
                ? 'Nhập email để nhận link đặt lại mật khẩu'
                : 'Nhập mã token và mật khẩu mới'}
            </p>
            {/* Checkbox: show token (dev only) */}
            <div className="mt-3 text-center">
              <label className="inline-flex items-center text-sm text-gray-600">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-purple-600" checked={showToken} onChange={(e) => setShowToken(e.target.checked)} />
                <span className="ml-2">Hiển thị token (chỉ dùng cho môi trường test)</span>
              </label>
            </div>
          </div>

          {/* Form */}
          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                    placeholder="Địa chỉ email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                {/* Nếu token đã được trả về từ backend (dev), hiển thị rõ ràng và cho phép sao chép */}
                {token ? (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Token đặt lại (dành cho test)</label>
                    <div className="flex items-center gap-2">
                      {showToken ? (
                        <code className="font-mono bg-gray-100 px-3 py-2 rounded break-all">{token}</code>
                      ) : (
                        <div className="font-mono bg-gray-100 px-3 py-2 rounded">••••••••••••</div>
                      )}
                      <button type="button" onClick={handleCopyToken} className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Sao chép</button>
                      <button type="button" onClick={() => setToken('')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md">Xóa</button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Token này được hiển thị bởi backend (chỉ dùng môi trường test). Bạn vẫn có thể dán token khác vào ô bên dưới nếu cần.</p>
                    <div className="mt-2">
                      <label htmlFor="token" className="sr-only">Token</label>
                      <input
                        id="token"
                        name="token"
                        type={showToken ? 'text' : 'password'}
                        required
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        ref={tokenInputRef}
                        className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                        placeholder="Nhập mã token từ email"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="token" className="sr-only">Token</label>
                    <input
                      id="token"
                      name="token"
                      type={showToken ? 'text' : 'password'}
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      ref={tokenInputRef}
                      className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                      placeholder="Nhập mã token từ email"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="new-password" className="sr-only">Mật khẩu mới</label>
                  <input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                    placeholder="Mật khẩu mới"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Xác nhận mật khẩu</label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </button>
              </div>
            </form>
          )}

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Back to login */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-purple-600 hover:text-purple-500"
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}