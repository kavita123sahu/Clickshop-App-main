/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
      },
      colors: {
        primaryColor: '#e62e04',
        textColor: '#1B1869',
        whiteColor: '#FFFFFF',
        blackColor: '#000000',
        greyColor: '#A6A8D6',
        bgGrayColor: '#EDEEF5',
        activeColor: '#A52238',
        inActiveColor: '#1B1869',
        fieldGrayColor: 'rgba(166, 168, 214, 0.25)',
        fieldTextColor: 'rgba(144, 147, 216, 1)',
        greyBorder: '#9093D8',
        toggleColor: '#9C2B5F',
        greyColor50: 'rgba(166, 168, 214, 0.5)',
        greyColor10: 'rgba(166, 168, 214, 0.1)',
        greyColor25: 'rgba(166, 168, 214, 0.25)',
        errorColor: '#DF0C34',
        blackColor50: 'rgba(0, 0, 0, 0.5)',
        onlineColor: '#3AA352',
        offlineColor: '#9093D8',
        // orangeColor: '#FF8000',
        orangeColor: '#e62e04',
        borderColor: "#CBD6E2",
        bgcolor: '#F5F8FA',
        newTextColor: '#494F73',
        blockColor: 'rgba(223, 12, 52, 0.10)',
      }
    },
    fontFamily: {
      LexendMedium: 'LexendDeca-Medium',
      Lexendlight: 'LexendDeca-Light',
      LexendBold: 'LexendDeca-Bold',
      LexendSemiBold: 'LexendDeca-SemiBold',
      LexendThin: 'LexendDeca-Thin',
      LexendBlack: 'LexendDeca-Black',
      LexendExtraBold: 'LexendDeca-ExtraBold',
      LexendExtraLight: 'LexendDeca-ExtraLight',
      LexendRegular: 'LexendDeca-Regular',
    }

  },
  plugins: [],
}

