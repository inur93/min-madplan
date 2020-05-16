import { useLoading } from "../shared/useLoading";
import { GetShoppingListApi } from "../../_api";
import { useRouter } from "next/router";
import { useView, views } from "../shared/useView";


export function useShoppingListCreate() {
    const api = GetShoppingListApi();
    const router = useRouter();
    const [loading, load] = useLoading();
    const [show, edit, goTo] = useView('/shopping-list');

    const onCreate = async (data) => {
        load(async () => {
            const { _id } = await api.create(data);
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