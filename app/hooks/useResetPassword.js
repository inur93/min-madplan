import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { resetPassword } from "../_api";


export function useResetPassword() {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    let timer;
    const onSubmit = async (data) => {
        const code = router.query.code;
        if (!code) return; //TODO error message
        setLoading(true);
        await resetPassword({
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