
import { GetUsersApi } from '../_api';
import useSWR from 'swr';

export function useSelf() {
    const api = GetUsersApi();
    const {
        data: self,
        revalidate
    } = useSWR('/me', path => {
        return api.self().catch((error) => {
            console.error('error', error);
        })
    });
    return [self, revalidate];
}