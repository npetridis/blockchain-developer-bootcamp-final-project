import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    background: {
      active: '#212429',
      light: '#2c2f36',
      dark: '#191b1f',
      white: '#c3c5cb'
    },
    text: {
      regular: '#c3c5cb',
      hover: '#e6e6e6',
      dark: '#212429'
    }
  },
  components: {
    Text: {
      baseStyle: {
        color: 'text.regular'
      }
    },
    FormLabel: {
      baseStyle: {
        color: 'text.regular'
      }
    },
    Input: {
      baseStyle: {
        field: {
          _placeholder: {
            color: 'text.regular'
          },
          color: 'white'
        }
      }
    },
    Accordion: {
      baseStyle: {
        container: {
          color: 'text.regular',
        }
      }
    }
  }
})
