/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
//import type {PropsWithChildren} from 'react';
import {Text, View} from 'react-native';
import El from './composants/element';

function App(): React.JSX.Element {
  return (
    <View>
      <El></El>
    </View>
  );
}

export default App;
