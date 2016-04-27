import React from 'react';
import ReactDOM from 'react-dom';
import antd, { Menu } from 'antd';

export function flattenMenu(menu) {
    if (menu.type === Menu.Item) {
        return menu;
    }

    if (Array.isArray(menu)) {
        return menu.reduce((acc, item) => {
            return acc.concat(flattenMenu(item));
        }, []);
    }

    return flattenMenu(menu.props.children);
}

export function getActiveMenuItem(props, index) {
    const routes = props.routes;
    return routes[routes.length - 1].path || index;
}

export function getFooterNav(menuItems, activeMenuItem) {
    const menuItemsList = flattenMenu(menuItems);
    const activeMenuItemIndex = menuItemsList.findIndex((menuItem) => {
        return menuItem.key === activeMenuItem;
    });
    const prev = menuItemsList[activeMenuItemIndex - 1];
    const next = menuItemsList[activeMenuItemIndex + 1];
    return { prev, next };
}