import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xóa thông tin người dùng từ localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('classId');
        localStorage.removeItem('userRole'); // Xóa thêm role người dùng nếu cần

        // Điều hướng đến trang đăng nhập
        navigate('/login'); // Đường dẫn đến trang đăng nhập của bạn
    };

    return (
        <button className="btn btn-danger" onClick={handleLogout}>
            Đăng Xuất
        </button>
    );
};

export default LogoutButton;
