import { useNavigate } from "react-router-dom";

export const useSmartNavigation = () => {
    const navigate = useNavigate();

    const smartBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/dashboard');
        }
    };

    return { smartBack, navigate };
};