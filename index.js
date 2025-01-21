/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

console.warn = function () { };
console.log = function () { };
console.error = function () { };

AppRegistry.registerComponent(appName, () => App);
