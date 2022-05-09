/*
    CONFIGURATION DE MUI :
    Les components de MUI utilise des thèmes pour les couleurs, et on peut utilise nos propres thèmes
*/

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  primary: {
    main: '#E92129',
    darker: '#DF161D',
  },
  palette: {
    primary: {
      main: '#E92129',
      darker: '#DF161D',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

export default theme