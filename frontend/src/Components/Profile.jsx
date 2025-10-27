import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/custom.css';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    role: 'user',
    createdAt: null,
    updatedAt: null,
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/profile');
      // ensure fields exist
      const data = res.data || {};
      const normalized = {
        name: data.name || data.username || '',
        email: data.email || '',
        avatar: data.avatar || '',
        role: data.role || 'user',
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
        _id: data._id || null,
      };
      setProfile(normalized);
      setOriginalProfile(normalized);
    } catch (error) {
      setMessage('Không thể tải thông tin profile ❌');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      setMessage('Vui lòng chọn ảnh để tải lên');
      return;
    }
    setMessage('');
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      const res = await API.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newAvatar = res.data.avatar || (res.data.user && res.data.user.avatar);
      if (newAvatar) {
        setProfile({ ...profile, avatar: newAvatar });
        setOriginalProfile({ ...originalProfile, avatar: newAvatar });
        setSelectedFile(null);
        setSelectedPreview(null);
        setMessage('Tải ảnh thành công ✅');
      } else {
        setMessage('Không nhận được URL ảnh từ server');
      }
    } catch (err) {
      console.error(err);
      setMessage('Lỗi tải ảnh ❌');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // client-side validation
    setMessage('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.name || !profile.email) {
      setMessage('Vui lòng nhập tên và email');
      return;
    }
    if (!emailRegex.test(profile.email)) {
      setMessage('Email không hợp lệ');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
      };
      const res = await API.put('/profile', payload);
      setMessage('Cập nhật thông tin thành công ✅');
      const updated = res.data.user || res.data;
      const normalized = {
        name: updated.name || '',
        email: updated.email || '',
        avatar: updated.avatar || '',
        role: updated.role || profile.role,
        createdAt: updated.createdAt || profile.createdAt,
        updatedAt: updated.updatedAt || new Date().toISOString(),
        _id: updated._id || profile._id,
      };
      setProfile(normalized);
      setOriginalProfile(normalized);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setMessage('Lỗi khi cập nhật thông tin ❌');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-purple-600 text-lg">Đang tải...</div>
      </div>
    );
  }

  const isDirty = JSON.stringify(profile) !== JSON.stringify(originalProfile);
  const formatDate = (iso) => {
    if (!iso) return '-';
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      
      <button
        onClick={() => navigate('/logout')}
        className="fixed top-6 right-6 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 z-20"
      >
        Đăng xuất
      </button>

      <div className="flex-1 flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: avatar */}
          <div className="flex flex-col items-center md:items-start md:col-span-1">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-100 mb-4">
              {profile.avatar ? (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" onError={(e)=>{e.target.onerror=null;e.target.src='https://via.placeholder.com/160'}} />
              ) : (
                <div className="w-full h-full bg-purple-50 flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold">{profile.name || '-'}</h3>
              <p className="text-sm text-gray-500">{profile.email || '-'}</p>
              <div className="mt-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${profile.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {profile.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </span>
              </div>
              <p className="mt-4 text-xs text-gray-400">Tham gia: {formatDate(profile.createdAt)}</p>
              <p className="text-xs text-gray-400">Cập nhật: {formatDate(profile.updatedAt)}</p>
            </div>
          </div>

          {/* Right: details & form */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Hồ sơ của tôi</h2>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Chỉnh sửa</button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setProfile(originalProfile); setIsEditing(false); setMessage(''); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Hủy</button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Tên</label>
                  <input name="name" value={profile.name} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-md" />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input name="email" type="email" value={profile.email} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-md" />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Link ảnh đại diện</label>
                  <input name="avatar" value={profile.avatar || ''} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-md" placeholder="https://..." />
                  <div className="mt-2">
                    <label className="block text-sm text-gray-600">Hoặc tải ảnh từ máy</label>
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="mt-1" />
                  </div>

                  {selectedPreview && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="w-28 h-28 rounded overflow-hidden border">
                        <img src={selectedPreview} alt="preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button type="button" onClick={handleUploadAvatar} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md">{isSaving ? 'Đang tải...' : 'Tải ảnh lên'}</button>
                        <button type="button" onClick={() => { setSelectedFile(null); setSelectedPreview(null); }} className="px-4 py-2 bg-gray-100 rounded-md">Hủy</button>
                      </div>
                    </div>
                  )}
                  {!selectedPreview && profile.avatar && (
                    <div className="w-28 h-28 mt-2 rounded overflow-hidden border">
                      <img src={profile.avatar} alt="preview" className="w-full h-full object-cover" onError={(e)=>{e.target.onerror=null;e.target.src='https://via.placeholder.com/112'}} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={!isDirty || isSaving} className={`px-6 py-2 rounded-md text-white ${(!isDirty || isSaving) ? 'bg-gray-300' : 'bg-purple-600 hover:bg-purple-700'}`}>
                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button type="button" onClick={() => { setProfile(originalProfile); setIsEditing(false); setMessage(''); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Hủy</button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600"><span className="font-semibold">Tên:</span> {profile.name || '-'}</p>
                  <p className="text-sm text-gray-600"><span className="font-semibold">Email:</span> {profile.email || '-'}</p>
                </div>
              </div>
            )}

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-center ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
