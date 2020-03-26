import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { Input } from '../components/shared/Input';
import { Form, FormField, FormError } from '../components/shared/Form';
import { Button } from '../components/shared/Button';
import { login } from './api/auth';
import { useState } from 'react';
import nextCookie from 'next-cookies';

const Page = function () {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleLogin = async (data, e) => {
        setLoading(true);
        const response = await login(data);
        if (!response) {
            setError(true);
        } else {
            setError(false);
            router.push("/");
        }
        setLoading(false);
    }
    return (
        <Layout simple>
            <Form error={error} onSubmit={handleLogin}>
                <FormField label="Brugernavn" placeholder="Brugernavn" name="username" />
                <FormField type="password" label="Kodeord" placeholder="Kodeord" name="password" />
                <FormError message="Brugernavn eller kodeord er forkert" />
                <Button loading={loading}>Login</Button>
            </Form>
        </Layout>
    );
}

const LoginPage = Page;

LoginPage.getInitialProps = async ctx => {
    const cookies = nextCookie(ctx);
    console.log('jwt', {
        cookies
    });
    const jwt = cookies.jwt;
    if (ctx.req && jwt) {
        ctx.res.writeHead(302, { Location: '/' })
        ctx.res.end()
        return
    }
    return {
        jwt
    }
}
export default LoginPage;
// export default dynamic(() => Promise.resolve(LoginPage), {
//     ssr: false
// });