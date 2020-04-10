import { useRouter } from 'next/router';
import { Icon, Image, Label, Menu as MenuSUI, Sidebar } from 'semantic-ui-react';
import { GetGroupsApi, GetUsersApi, logout } from '../../api';
import { absUrl } from '../../functions/imageFunctions';
import { useData } from '../../hooks/useData';
import { useInvitesCount } from '../../hooks/useInvitesCount';
import { usePageSettings } from '../../hooks/usePageSettings';
import { useSelf } from '../../hooks/useSelf';
import { ButtonClose } from '../shared/Button';
import './menu.scss';

const fullname = (firstname, lastname) => `${firstname || ""} ${lastname || ""}`;

const Menu = function ({ visible, onHide }) {
    const router = useRouter();
    const invitesCount = useInvitesCount();
    const [self, revalidate] = useSelf();
    const settings = usePageSettings('profile');
    const { firstname, lastname, selectedGroup, _id } = self || {};
    const groups = useData('groups', GetGroupsApi().find) || [];

    const goto = (url) => () => {
        router.push(url);
        onHide();
    }
    const selectGroup = (id) => async () => {
        await GetUsersApi().update(_id, {
            selectedGroup: id
        });
        router.push('/');
        onHide();
    }

    const { fallbackProfileImage } = (settings || { fallbackProfileImage: {} });
    const profileImage = (self && self.avatar) || fallbackProfileImage;
    return (<Sidebar as={MenuSUI}
        className="mmp-sidebar"
        animation='overlay'
        onHide={onHide}
        visible={visible}
        width='wide'
        vertical>
        <div className="mmp-menu-item-profile">
            <div className="mmp-profile-image">
                <Image src={absUrl(profileImage.url)} avatar />
            </div>
            <div className="mmp-info">
                <h3>{fullname(firstname, lastname)}</h3>
                <a onClick={goto('/profile')}>View profile</a>
            </div>
            <ButtonClose onClick={onHide} />

        </div>
        <MenuSUI.Item link onClick={goto('/shopping-list')}>
            Indkøbsliste
            </MenuSUI.Item>
        <MenuSUI.Item link name="Ugeplan" onClick={goto('/plan')} />
        <MenuSUI.Item name="Opskrifter" onClick={goto('/recipes')} />
        <MenuSUI.Item >
            Grupper
            <MenuSUI.Item onClick={goto('/groups?view=invites')}>
                Invitationer
                <Label>{invitesCount.data}</Label>
            </MenuSUI.Item>
            <MenuSUI.Item onClick={goto('/groups/create')} >
                Opret gruppe
                    <Icon name="add" />
            </MenuSUI.Item>
            {groups.map(group =>
                <MenuSUI.Item key={group._id}
                    active={selectedGroup === group._id}
                    onClick={selectGroup(group._id)}>
                    {group.name}
                </MenuSUI.Item>
            )}
        </MenuSUI.Item>
        <MenuSUI.Item name='Log ud' onClick={logout} />
    </Sidebar>);
};
export default Menu;