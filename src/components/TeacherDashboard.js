import React, {useEffect, useState} from 'react';
// import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import LogoutButton from "./LogoutButton";

const FeedbackList = () => {
    const [data, setData] = useState({
        groupedFeedbacks: {},
        criteriaMap: {},
        studentMap: {},
        classMap: {},
        teacherName: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const feedbackResponse = axios.get('http://localhost:9999/feedbacks');
                const criteriaResponse = axios.get('http://localhost:9999/criteria');
                const studentResponse = axios.get('http://localhost:9999/students');
                const classResponse = axios.get('http://localhost:9999/classes');
                const teacherResponse = axios.get(`http://localhost:9999/teachers/${userId}`);

                const [
                    feedbackData,
                    criteriaData,
                    studentData,
                    classData,
                    teacherData
                ] = await Promise.all([
                    feedbackResponse,
                    criteriaResponse,
                    studentResponse,
                    classResponse,
                    teacherResponse
                ]);

                const filteredFeedbacks = feedbackData.data.filter(feedback => feedback.teacherId === userId);

                const feedbackByStudent = filteredFeedbacks.reduce((acc, feedback) => {
                    const {studentId} = feedback;
                    if (!acc[studentId]) acc[studentId] = [];
                    acc[studentId].push(feedback);
                    return acc;
                }, {});

                const criteriaMap = criteriaData.data.reduce((acc, criterion) => {
                    acc[criterion.id] = criterion.criteriaName;
                    return acc;
                }, {});

                const studentMap = studentData.data.reduce((acc, student) => {
                    acc[student.id] = {name: student.name, classId: student.classId};
                    return acc;
                }, {});

                const classMap = classData.data.reduce((acc, classItem) => {
                    acc[classItem.id] = classItem.name;
                    return acc;
                }, {});

                setData({
                    groupedFeedbacks: feedbackByStudent,
                    criteriaMap,
                    studentMap,
                    classMap,
                    teacherName: teacherData.data.name || 'Unknown Teacher'
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-danger text-center">{error}</div>;
    }

    const {groupedFeedbacks, criteriaMap, studentMap, classMap, teacherName} = data;

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            marginTop: '30px',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2 style={{color: '#343a40', fontWeight: 'bold'}}>
                    Feedback từ Học Sinh - Giáo viên: {teacherName}
                </h2>
                <LogoutButton/>
            </div>

            {Object.keys(groupedFeedbacks).length === 0 ? (
                <div style={{textAlign: 'center'}}>Không có phản hồi nào.</div>
            ) : (
                <div>
                    {Object.keys(groupedFeedbacks).map(studentId => (
                        <div
                            key={studentId}
                            style={{
                                backgroundColor: '#ffffff',
                                marginBottom: '15px',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                padding: '20px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            <h5 style={{color: '#007bff', fontWeight: 'bold'}}>
                                Phản hồi của học sinh: {studentMap[studentId]?.name || 'Unknown Student'} -
                                Lớp: {classMap[studentMap[studentId]?.classId] || 'Unknown Class'}
                            </h5>
                            <ul style={{paddingLeft: '20px', listStyle: 'none'}}>
                                {groupedFeedbacks[studentId].map(feedback => (
                                    <li key={feedback.id} style={{marginBottom: '10px'}}>
                                        {feedback.criteriaId === null ? (
                                            <div style={{marginTop: '5px', fontStyle: 'italic', color: '#6c757d'}}>
                                                <span
                                                    style={{fontWeight: 'bold'}}>Ý kiến bổ sung:</span> {feedback.comment}
                                            </div>
                                        ) : (
                                            <div>
                                                <span style={{
                                                    fontWeight: 'bold',
                                                    color: '#495057'
                                                }}>Tiêu chí: {criteriaMap[feedback.criteriaId] || 'Unknown'} <br/>
                                                <span style={{
                                                    fontWeight: 'bold',
                                                    color: '#495057'
                                                }}>Điểm:</span> </span> {feedback.comment}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeedbackList;
