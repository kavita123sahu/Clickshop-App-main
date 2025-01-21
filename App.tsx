import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { store } from './src/redux/Store.tsx'
import Navigator from './src/navigation/Navigator.tsx'
import { WebView, WebViewNavigation } from 'react-native-webview';
import { AppState, Linking, Platform } from 'react-native';
import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';
import Toast from 'react-native-toast-message';


const inAppUpdates = new SpInAppUpdates(
  false
);


const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  const handleNavigationChange = (navState: WebViewNavigation) => {
    const url = navState.url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    } else {
      Linking.openURL(url);
      return false;
    }
  };

  useEffect(() => {
    const _handleAppStateChange = (nextAppState: any) => {
      console.log("inside  function  ", appState.match(/inactive|background/), '....', appState, '  ... ', nextAppState);
      if (!appState.match(/inactive|background/) && nextAppState === 'active') {
        if (Platform.OS === 'android') {
          checkUpdates();
        }
      }
      setAppState(nextAppState);
      return true;
    }
    const AppStateChangeHandler = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );
    return () => AppStateChangeHandler.remove();
  }, [])


  const checkUpdates = () => {
    try {
      inAppUpdates.checkNeedsUpdate().then((result: any) => {
        if (result.shouldUpdate) {
          let updateOptions = {};
          if (Platform.OS === 'android') {
            updateOptions = {
              updateType: IAUUpdateKind.IMMEDIATE,
            };
          }
          inAppUpdates.startUpdate(updateOptions);
        }
      });

    } catch (e) {
      console.log(e);
    }

  }

  return (
    <Provider store={store}>
      <Navigator />
      <Toast />
    </Provider>
    // <WebView
    //   source={{ uri: 'https://clikshop.co.in/' }}
    //   style={{ flex: 1 }}
    //   onShouldStartLoadWithRequest={handleNavigationChange}
    //   scrollEnabled
    //   setSupportMultipleWindows={false}
    // />
  )
}

export default App