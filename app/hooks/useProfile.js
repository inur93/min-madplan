import { useState, useEffect } from "react";
import { GetFilesApi, GetGroupsApi, GetUsersApi } from "../_api";
import { useData } from "./useData";
import { usePageSettings } from "./usePageSettings";
import { sanitizeImageName, absUrl } from "../functions/imageFunctions";
import { mutate } from "swr";



export function useProfile(self) {
    const api = GetUsersApi();
    const fileApi = GetFilesApi();
    const groups = useData('groups', GetGroupsApi().find) || [];
    const settings = usePageSettings('profile');

    const [image, setImage] = useState(null);
    const [clearAvatar, setClearAvatar] = useState(false);
    const [group, setGroup] = useState(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const saveImage = async () => {
        try {
            if (!clearAvatar && image) {
                const data = new FormData();
                data.append('ref', 'user');
                data.append('refId', self._id);
                data.append('field', 'avatar');
                data.append('files', image);
                data.append('source', 'users-permissions');
                return fileApi.upload(data);
            }
        } catch (e) {
            setError(e.message);
        }
    }
    const onSave = async (updates) => {
        setSaving(true);
        const data = { ...updates };
        if (group) data.selectedGroup = group;
        if (clearAvatar) data.avatar = null; //clear image
        await Promise.all([
            api.update(self._id, data),
            saveImage()
        ])
        mutate('/me');
        setSaved(true);
        setSaving(false);
        setTimeout(() => setSaved(false), 3000);
    }

    const onImageChange = (e) => {
        const file = e.target.files[0];
        const newFile = new File([file], sanitizeImageName(file.name), { type: file.type });
        setImage(newFile);
        setClearAvatar(false);
    }

    const changeGroup = (e, el) => {
        setGroup(el.value);
    }

    const removeImage = () => {
        if (image) setImage(null);
        else setClearAvatar(true);
    }

    const state = {
        error,
        loading: saving,
        groups,
        saved,
        image: image ? URL.createObjectURL(image) : (clearAvatar ? null : (self && self.avatar && absUrl(self.avatar.url))),
        fallbackImage: settings && settings.fallbackProfileImage && absUrl(settings.fallbackProfileImage.url)
    }
    const handlers = {
        onSave,
        changeGroup,
        onImageChange,
        removeImage
    }
    return [state, handlers];
}