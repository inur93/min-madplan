
import { GetUsersApi } from '../_api';
import useSWR from 'swr';

export function useSelf() {
    const api = GetUsersApi();
    const self = useSWR('/me', path => {
        return api.self().catch(() => {
            console.error('error');
        })
    });
    return [self.data, self.revalidate];
}