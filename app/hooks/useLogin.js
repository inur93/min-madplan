import { useRouter } from "next/router";
import { useState } from "react";
import { login } from '../pages/api';


export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();

    const onLogin = async (data, e) => {
        setLoading(true);
        const response = await login(data);
        if (!response) {
            setError(true);
        } else {
            setError(false);
            router.push("/");
        }
        setLoading(false);
    }

    const state = {
        loading, error
    }
    const handlers = {
        onLogin
    }
    return [state, handlers];
}