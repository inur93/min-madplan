import { Container, Image, Segment, Transition } from 'semantic-ui-react';
import { ForgotPassword } from '../components/auth/ForgotPassword';
import { LoginForm } from '../components/auth/LoginForm';
import { ResetPassword } from '../components/auth/ResetPassword';
import { absUrl } from '../functions/imageFunctions';
import { getJwtToken, validateToken } from '../functions/tokenFunctions';
import { useLogin } from '../hooks/useLogin';
import { GetPageSettingsApi, GetUsersApi } from '../_api';

function Page({ bannerImage }) {
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

Page.getInitialProps = async () => {
    const { bannerImage } = await GetPageSettingsApi().get('Login');
    return { bannerImage }
}

export default Page;