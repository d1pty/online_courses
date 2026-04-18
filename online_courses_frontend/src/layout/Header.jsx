import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authActions from "../actions/auth";
import { connect, useDispatch } from "react-redux";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Header({ user }) {
    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
        }
    }, [user]);

    const logOut = () => {
        dispatch(authActions.logout());
        window.location.href = '/login';
    };

    const isTeacher = currentUser?.role?.includes('ROLE_TEACHER');
    const isStudent = currentUser?.role?.includes('ROLE_STUDENT');

    return (
        <AppBar position="static" style={{ background: '#72beda' }}>
            <Toolbar>
                {isTeacher && (
                    <>
                        <Typography variant="h6" component={Link} to={`/${currentUser.id}/courses`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            Мои Курсы
                        </Typography>
                        <Typography variant="h6" component={Link} to="/groups" style={{ color: 'inherit', textDecoration: 'none', marginLeft: '20px' }}>
                            Группы
                        </Typography>
                    </>
                )}
                {isStudent && currentUser && (
                    <Typography 
                        variant="h6" 
                        component={Link} 
                        to={`/UserCourses/${currentUser.id}`} 
                        style={{ color: 'inherit', textDecoration: 'none', marginLeft: '20px' }}
                    >
                        Мои курсы
                    </Typography>
                )}
                <div style={{ marginLeft: 'auto' }}>
                    {currentUser ? (
                        <>
                            <Button color="inherit" component={Link} to="/profile">
                                {currentUser.username}
                            </Button>
                            <Button color="inherit" onClick={logOut}>
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/register">
                                Регистрация
                            </Button>
                            <Button color="inherit" component={Link} to="/login">
                                Вход в систему
                            </Button>
                        </>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user
  };
}

export default connect(mapStateToProps)(Header);
