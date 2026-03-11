import { io } from 'socket.io-client';
import Constants from 'expo-constants';

const WS_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_WS_URL ?? 'http://localhost:3000';

export const socket = io(WS_URL, {
  autoConnect: false,
  transports: ['websocket'],
});
