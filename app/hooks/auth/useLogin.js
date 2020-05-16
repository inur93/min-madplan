import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GetUsersApi, logout } from "../../_api";


export function useLogin() {
    const [showLogin, setShowLogin] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const resetPassword = router.query.code;
        const forgotPassword = router.query.forgotPassword;

        if (resetPassword) {
            setShowResetPassword(true);
            setShowLogin(false);
            setShowForgotPassword(false);
        } else if (forgotPassword) {
            setTimeout(() => setShowForgotPassword(true), 600);
            setShowLogin(false);
            setShowResetPassword(false);
        } else {
            setTimeout(() => setShowLogin(true), 600);
            setShowForgotPassword(false);
            setShowResetPassword(false);
        }
    }, [router.query.forgotPassword, router.query.code])


    const state = {
        showLogin, showResetPassword, showForgotPassword
    }
    return [state];
}