import { useState, useEffect } from "react";
import { forgotPassword } from "../_api";


export function useForgotPassword() {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    let timer;
    const onSubmit = async (data) => {
        setLoading(true);
        await forgotPassword(data);
        setLoading(false);
        setSuccess(true);
        timer = setTimeout(() => {
            setSuccess(false);
            timer = null;
        }, 8000);
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