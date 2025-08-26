import "../styles/tailwind.css";
import { router } from "./routes/router";

// inisialisasi router
window.addEventListener("load", router);
window.addEventListener("hashchange", router);
