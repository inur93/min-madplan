import { useState, useEffect } from "react";
import { GetAuthApi } from "../_api";


export function useForgotPassword() {
    const api = GetAuthApi();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    let timer;
    const onSubmit = async (data) => {
        setLoading(true);
        await api.forgotPassword(data);
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