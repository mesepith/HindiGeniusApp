// src/components/LogoutHandler.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useGoogleSignIn from '../hooks/useGoogleSignIn';
import { RootState } from '../store/store';

const LogoutHandler = () => {
    const { logout } = useGoogleSignIn();
    const triggerLogout = useSelector((state: RootState) => state.user.triggerLogout);

    useEffect(() => {
        if (triggerLogout) {
            logout();
        }
    }, [triggerLogout, logout]);

    return null;  // This component does not render anything
};

export default LogoutHandler;
