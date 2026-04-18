import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import Header from './layout/Header'

import Login from "./pages/authorization/Login";
import Register from "./pages/authorization/Register";
import Profile from "./pages/authorization/Profile";

import ListCourses from './pages/courses/ListCourses';
import AddCourse from './pages/courses/AddCourse';
import CourseDetails from './pages/courses/CourseDetails';

import UserCourses from './pages/user/UserCourses';
import UserCourseDetails from './pages/user/UserCourseDetails';

import ListGroups from './pages/groups/ListGroups';
import AddGroup from './pages/groups/AddGroup';
import GroupDetails from './pages/groups/GroupDetails';

import { connect } from "react-redux";

class App extends React.Component {
    render() {

        return (
            <div>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/UserCourses/course/:courseId" element={<UserCourseDetails />} />
                        <Route path="/UserCourses/:userId" element={<UserCourses  />} />
                        <Route path="/course/:courseId" element={<CourseDetails />} />
                        <Route path="/group/:groupId" element={<GroupDetails />} />
                        <Route path="/groups" element={<ListGroups />} />
                        <Route path="/addGroup" element={<AddGroup />} />
                        <Route path="/:userId/courses" element={<ListCourses />} />
                        <Route path="/addCourse" element={<AddCourse />} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/register" element={<Register/>} />
                        <Route path="/profile" element={<Profile/>} />
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user
    };
}

export default connect(mapStateToProps)(App);
