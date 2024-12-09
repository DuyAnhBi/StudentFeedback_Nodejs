import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedbackForm from "./components/FeedbackForm";
import LogIn from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";


const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LogIn/>}/>
                <Route path="/student-dashboard" element={<StudentDashboard/>} />
                <Route path="/student-dashboard/feedback/:teacherId" element={<FeedbackForm />} />
                <Route path="/teacher-dashboard" element={<TeacherDashboard/>} />
            </Routes>
        </Router>
    );
};

export default App;
