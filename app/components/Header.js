import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Menu, Segment, Header as HeaderSUI, Dropdown } from 'semantic-ui-react';
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
                {showBackBtn && <ButtonBack floated='left' />}
                <HeaderSUI className="custom-header" as='h1' floated='left'>
                    {title}
                </HeaderSUI>
                <Dropdown icon="ellipsis vertical"
                    value=""
                    className="settings-icon"
                    floating
                    size='large'
                    options={[
                        { key: 'delete', text: 'Delete', value: 'delete' },
                        { key: 'edit', text: 'edit', value: 'edit' }
                    ]} />

                <style jsx>{`
                    :global(h1.custom-header.header){
                        margin-bottom: 0;
                        margin-left: 1rem;
                    },
                    :global(div.dropdown.settings-icon){
                        right: 1rem;
                        top: 1.5rem;
                        font-size: 1.3rem;
                        position: absolute;
                    },
                    :global(div.dropdown.settings-icon div.text){
                        display: none;
                    },
                    :global(div.dropdown.settings-icon .visible.menu){
                        right: 0;
                        left: auto;
                    }
    `}</style>
            </Segment>
        </div>)
}

export default Header;