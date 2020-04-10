import nextCookie from 'next-cookies';
import { Image, Input, Segment } from 'semantic-ui-react';
import { GetPageSettingsApi } from '../api';
import { Button } from '../components/shared/Button';
import { Form, FormError } from '../components/shared/Form';
import { absUrl } from '../functions/imageFunctions';
import { useLogin } from '../hooks/useLogin';

const Page = function ({ bannerImage }) {
    const [state, handlers] = useLogin();
    return (
        <div>
            {bannerImage && <Image src={absUrl(bannerImage.url)} fluid />}

            <Segment className='login-container'>
                <Form error={state.error} onSubmit={handlers.onLogin}>
                    <Form.Field>
                        <label>Brugernavn</label>
                        <Input required name='username' placeholder='Brugernavn' />
                    </Form.Field>
                    <Form.Field>
                        <label>Kodeord</label>
                        <Input required name='password' type='password' placeholder='Kodeord' />
                    </Form.Field>
                    <FormError message="Brugernavn eller kodeord er forkert" />
                    <Button loading={state.loading}>Login</Button>
                </Form>
            </Segment>
        </div>
    );
}

const LoginPage = Page;

LoginPage.getInitialProps = async ctx => {
    const cookies = nextCookie(ctx);
    const jwt = cookies.jwt;
    const { bannerImage } = await GetPageSettingsApi(ctx).get('Login');
    if (ctx.req && jwt) {
        ctx.res.writeHead(302, { Location: '/' })
        ctx.res.end()
        return
    }
    return {
        jwt,
        bannerImage
    }
}
export default LoginPage;