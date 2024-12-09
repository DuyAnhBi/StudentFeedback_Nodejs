import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FeedbackForm = () => {
    const { teacherId } = useParams();
    const studentId = localStorage.getItem('userId');
    const classId = Number(localStorage.getItem('classId'));
    const [criteria, setCriteria] = useState([]);
    const [teacherName, setTeacherName] = useState('');
    const [feedback, setFeedback] = useState({
        classId: classId,
        studentId: studentId,
        teacherId: teacherId,
        criteriaId: 1,
        comment: '',
        ratings: {},
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCriteria = async () => {
            const res = await axios.get('http://localhost:9999/criteria');
            setCriteria(res.data);
        };

        const fetchTeacherName = async () => {
            try {
                const res = await axios.get(`http://localhost:9999/teachers/${teacherId}`);
                setTeacherName(res.data.name);
            } catch (error) {
                console.error('Error fetching teacher information:', error);
            }
        };

        fetchCriteria();
        fetchTeacherName();
    }, [teacherId]);

    const handleChange = (criterionId, value) => {
        setFeedback((prev) => ({
            ...prev,
            ratings: { ...prev.ratings, [criterionId]: value }
        }));
    };

    const handleNoteChange = (e) => {
        setFeedback((prev) => ({
            ...prev,
            comment: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const feedbackEntries = criteria.map((criterion) => ({
            classId: classId,
            studentId: studentId,
            teacherId: feedback.teacherId,
            criteriaId: criterion.id,
            comment: feedback.ratings[criterion.id] || '',
        }));
        const additionalFeedbackEntry = {
            classId: classId,
            studentId: studentId,
            teacherId: feedback.teacherId,
            criteriaId: null,
            comment: feedback.comment
        };

        await Promise.all([
            ...feedbackEntries.map(entry => axios.post('http://localhost:9999/feedbacks', entry)),
            axios.post('http://localhost:9999/feedbacks', additionalFeedbackEntry)
        ]);

        alert('Cảm ơn bạn đã gửi đánh giá!');
        navigate('/student-dashboard');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card" style={{
                width: '90%',
                maxWidth: '600px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px'
            }}>
                <div className="card-body">
                    <h1 className="text-center mb-4">Đánh Giá Giáo Viên</h1>
                    <h2 className="text-center mb-4" style={{ overflowWrap: 'break-word' }}>
                        {teacherName || 'Đang tải tên giáo viên...'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {criteria.map((criterion) => (
                                <div key={criterion.id} className="col-md-6 mb-3">
                                    <label className="form-label">{criterion.criteriaName}</label>
                                    <div className="d-flex flex-column">
                                        {['Rất Thích', 'Thích', 'Bình Thường', 'Cũng Ổn', 'Tệ'].map((rating) => (
                                            <div key={rating} className="form-check">
                                                <input
                                                    type="radio"
                                                    name={`criteriaId_${criterion.id}`}
                                                    className="form-check-input"
                                                    value={rating}
                                                    onChange={() => handleChange(criterion.id, rating)}
                                                    required
                                                />
                                                <label className="form-check-label">{rating}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ý Kiến Bổ Sung</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={feedback.comment}
                                onChange={handleNoteChange}
                                placeholder="Nhập ý kiến của bạn ở đây..."
                            />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary mt-3">Gửi Đánh Giá</button>
                            <button
                                type="button"
                                className="btn btn-secondary mt-3 ms-2"
                                onClick={() => navigate('/student-dashboard')}
                            >
                                Quay Về Dashboard
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
