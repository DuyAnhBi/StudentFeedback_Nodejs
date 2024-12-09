import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null); // State để lưu thông tin người dùng
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const studentResponse = await fetch('http://localhost:9999/students');
            const students = await studentResponse.json();
            const student = students.find((s) => s.email === email && s.password === password);

            if (student) {
                localStorage.setItem('userId', student.id);
                localStorage.setItem('classId', student.classId);
                localStorage.setItem('userRole', 'student');
                setUser({ name: student.name, role: 'student' });
                navigate('/student-dashboard', {
                    state: {
                        userId: student.id,
                        classId: student.classId,
                    },
                });
                return;
            }

            const teacherResponse = await fetch('http://localhost:9999/teachers');
            const teachers = await teacherResponse.json();
            const teacher = teachers.find((t) => t.email === email && t.password === password);

            if (teacher) {
                localStorage.setItem('userId', teacher.id);
                localStorage.setItem('userRole', 'teacher');
                setUser({ name: teacher.name, role: 'teacher' });
                navigate('/teacher-dashboard', {
                    state: {
                        teacherId: teacher.id,
                    }
                });
                return;
            }

            setErrorMessage('Invalid email or password!');
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred while logging in.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('classId');
        setUser(null);
        navigate('/login');
    };

    return (
        <div>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <h2 className="text-center">WELCOME TO FEEDBACK SYSTEM</h2>
                        <h2 className="text-center">Login</h2>
                        <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow">
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Login</button>
                            {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;
