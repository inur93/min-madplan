

import { useState, useEffect } from 'react';
import { GetUsersApi } from '../pages/api/usersApi';
import useSWR from 'swr';

export function useSelf() {
    const api = GetUsersApi();
    const self = useSWR('/me', path => {
        return api.self().catch(() => {
            console.log('error');
        })
    });
    return [self.data, self.revalidate];
}