function selectMenuItem(menuItem = '') {
  return {
    type: 'SELECT_MENU_ITEM',
    menuItem
  };
}

export default selectMenuItem;
