import { useRouter } from "next/router";
import useSWR from "swr";
import v from "../../functions/views";
import { GetShoppingListApi } from "../../_api";
const views = v.ShoppingList;

export function useShoppingListHistory() {
    const api = GetShoppingListApi();
    const router = useRouter();
    const {
        data: history,
        isValidating
    } = useSWR('/shopping-lists', api.find);

    const state = {
        loading: !history,
        reloading: isValidating, //TODO maybe sneaky ?
        history: history || []
    }
    return [state];
}