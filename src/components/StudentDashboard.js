import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from "./LogoutButton";

const StudentDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [studentId] = useState(localStorage.getItem('userId') || "1");
    const [studentClass, setStudentClass] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [className, setClassName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const { data: student } = await axios.get(`http://localhost:9999/students/${studentId}`);
                setStudentClass(student.classId);
                setStudentName(student.name);
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };

        const fetchFeedbacks = async () => {
            try {
                const { data } = await axios.get(`http://localhost:9999/feedbacks?studentId=${studentId}`);
                setFeedbacks(data);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        };

        fetchStudentData();
        fetchFeedbacks();
    }, [studentId]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const { data: classes } = await axios.get('http://localhost:9999/classes');
                const studentClassData = classes.find(cls => Number(cls.id) === studentClass);

                if (studentClassData?.teacherIds) {
                    const { data: allTeachers } = await axios.get('http://localhost:9999/teachers');
                    const assignedTeachers = allTeachers.filter(teacher =>
                        studentClassData.teacherIds.includes(parseInt(teacher.id))
                    );
                    setTeachers(assignedTeachers);
                    setClassName(studentClassData.name);
                }
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        };

        if (studentClass) {
            fetchTeachers();
        }
    }, [studentClass]);

    const handleFeedback = (teacherId) => {
        const feedbackExists = feedbacks.some(feedback => feedback.teacherId === teacherId);
        if (feedbackExists) {
            alert("Bạn đã đánh giá giáo viên này rồi!");
        } else {
            navigate(`/student-dashboard/feedback/${teacherId}`);
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="text-center">Danh Sách Giáo Viên Cần Feedback</h1>
                <LogoutButton />
            </div>
            <h4 className="text-center">Học sinh: {studentName} - Lớp: {className}</h4>
            {teachers.length === 0 ? (
                <div className="text-center">Không có giáo viên nào cần đánh giá.</div>
            ) : (
                <table className="table">
                    <thead>
                    <tr>
                        <th>Tên Giáo Viên</th>
                        <th>Đánh Giá</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher.id}>
                            <td>{teacher.name}</td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleFeedback(teacher.id)}
                                >
                                    Đánh Giá
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentDashboard;
