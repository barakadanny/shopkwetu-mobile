import axios from 'axios';
import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
