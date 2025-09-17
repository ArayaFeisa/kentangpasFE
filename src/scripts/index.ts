import "../styles/tailwind.css";
import { startRouter } from "./routes/router";
import { registerSW } from './sw-register';

startRouter();
registerSW();
