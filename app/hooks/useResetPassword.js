import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GetAuthApi } from "../_api";


export function useResetPassword() {
    const api = GetAuthApi();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    let timer;
    const onSubmit = async (data) => {
        const code = router.query.code;
        if (!code) return; //TODO error message
        setLoading(true);
        await api.resetPassword({
            code,
            ...data
        });
        setLoading(false);
        setSuccess(true);
        timer = setTimeout(() => {
            setSuccess(false);
            router.push('/login');
            timer = null;
        }, 3000);
    }

    useEffect(() => timer && clearTimeout(timer), []);

    const state = {
        success,
        loading
    }

    const handlers = {
        onSubmit
    }
    return [state, handlers];
}