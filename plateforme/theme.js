/*
    CONFIGURATION DE MUI :
    Les components de MUI utilise des thèmes pour les couleurs, et on peut utilise nos propres thèmes
*/

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    red: {
      main: '#0971f1',
      darker: '#053e85',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

export default theme