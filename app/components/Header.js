import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Menu, Segment, Header as HeaderSUI } from 'semantic-ui-react';
import { ButtonBack } from './shared/Button';

const linkStyle = {
    marginRight: 15
}

const Header = ({ showBackBtn, title }) => {
    const { pathname } = useRouter();
    //indkøbsliste
    //ugeplan
    //opskrifter
    return (
        <div>
            <Segment clearing>
                <HeaderSUI as='h1' floated='left'>
                    {title}
                </HeaderSUI>
                {showBackBtn && <ButtonBack floated='right' />}
            </Segment>
        </div>)
}

export default Header;