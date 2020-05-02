import { GetPlanApi } from "../../_api";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState, useEffect } from "react";


export function usePlanDay(idParam, dateParam) {
    const api = GetPlanApi();
    const router = useRouter();
    const [planDay, setPlanDay] = useState(null);
    const [hide, setHide] = useState(true);
    const {
        data: plan,
        isValidating: reloading
    } = useSWR(router.query[idParam]
        ? ['/plan', router.query[idParam]]
        : null,
        (url, id) => api.findOne(id));


    useEffect(() => {
        setHide(!router.query[idParam]
            || !router.query[dateParam]);
    }, [router.query[idParam], router.query[dateParam]]);

    useEffect(() => {
        if (plan) {
            const existing = plan.plan.find(x => x.date === router.query[dateParam]);
            setPlanDay(existing || { date: router.query[dateParam] });
        }
    }, [plan, router.query[dateParam]]);

    const state = {
        hide,
        planDay,
        loading: !planDay || reloading
    }

    return [state]

}