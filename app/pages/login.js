import nextCookie from 'next-cookies';
import { Container, Image, Segment, Transition } from 'semantic-ui-react';
import { GetPageSettingsApi } from '../_api';
import { LoginForm } from '../components/auth/LoginForm';
import { ResetPassword } from '../components/auth/ResetPassword';
import { absUrl } from '../functions/imageFunctions';
import { useLogin } from '../hooks/useLogin';
import { ForgotPassword } from '../components/auth/ForgotPassword';

const Page = function ({ bannerImage }) {
    const [state] = useLogin();

    return (
        <div>
            {bannerImage && <Image src={absUrl(bannerImage.url)} fluid />}

            <Segment className='login-container'>
                <Transition animation='fade up' visible={state.showLogin}>
                    <Container>
                        <LoginForm />
                    </Container>
                </Transition>
                <Transition animation='fade down' visible={state.showForgotPassword} >
                    <Container>
                        <ForgotPassword />
                    </Container>
                </Transition>
                <Transition visible={state.showResetPassword} >
                    <Container>
                        <ResetPassword />
                    </Container>
                </Transition>
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