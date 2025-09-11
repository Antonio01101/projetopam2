// config.js
import Constants from "expo-constants";

const { manifest } = Constants;
const host = manifest?.debuggerHost?.split(":").shift();
const API_URL = `http://${host}:3000`; // IP automático do seu PC

export default API_URL;
