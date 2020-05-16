import { GetPlanApi } from "../../_api";
import { useLoading } from "../shared/useLoading";
import { useView } from "../shared/useView";


export function usePlanCreate() {
    const api = GetPlanApi();
    const [loading, load] = useLoading();
    const [show, edit, goTo] = useView('/plan');

    const onCreate = async (data) => {
        load(async () => {
            const { _id } = await api.create({
                ...data,
                durationType: 'days',
                length: 7
            });
            goTo.details(_id);
        });
    }

    const state = {
        loading
    }

    const handlers = {
        onCreate
    }
    return [state, handlers];
}