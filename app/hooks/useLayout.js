import { useState } from "react"

export function useLayout() {
    const [showMenu, setShowMenu] = useState(false);

    const state = {
        showMenu
    }
    const handlers = {
        hideMenu: () => setShowMenu(false),
        showMenu: () => setShowMenu(true)
    }
    return [state, handlers]
}