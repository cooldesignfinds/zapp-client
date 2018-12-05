import React from 'react';

export const themes = {
  light: {
    borderColor: '#EEE',
    textColor: '#999',
    foreground: '#000000',
    background: '#FFF',
    headerBackground: '#EEE',
    editor: 'tomorrow'
  },
  dark: {
    borderColor: '#000',
    textColor: '#999',
    foreground: '#ffffff',
    background: '#313239',
    headerBackground: '#000',
    editor: 'tomorrow_night_eighties'
  }
};

export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {}
});
