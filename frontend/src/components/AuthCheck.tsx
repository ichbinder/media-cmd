import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { isUserTokenValid } from "../services/backendApiRequests";

export const AuthCheck: React.FC = () => {
    const navigate = useNavigate();
    const loggedIn = useUserStore((state) => state.loggedIn);
    const checkToken = useUserStore((state) => state.checkToken);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response: boolean = await checkToken();
                console.log(response);
                console.log(loggedIn);
                if (!response) {
                    navigate('/login');
                }
            } catch (error) {
                console.log(error);
                navigate('/login');
            }
        };

        if (loggedIn) {
            validateToken();
        }
    }, [loggedIn, checkToken, navigate]);

    return null; // Diese Komponente rendert nichts
};