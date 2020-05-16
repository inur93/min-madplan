import { useRouter } from "next/router";
import { useState } from "react";
import { GetAuthApi } from '../../_api';


export function useLoginForm() {
    const api = GetAuthApi();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const onLogin = async (data, e) => {
        setLoading(true);
        const response = await api.login(data);

        if (response.success) {
            setError(null);
            router.push("/");
        } else {
            setError(response.message);
        }
        setLoading(false);
    }

    const onForgotPassword = (e) => {
        e.preventDefault();
        router.push('/login?forgotPassword=true');
    }

    const state = {
        loading, error
    }
    const handlers = {
        onLogin,
        onForgotPassword
    }
    return [state, handlers];
}