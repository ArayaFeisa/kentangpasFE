import "../styles/tailwind.css";
import { router } from "./routes/router";

const style = document.createElement("style");
style.innerHTML = `
  .animate-scaleIn {
    animation: scaleIn 0.2s ease-out;
  }
  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);

// inisialisasi router
window.addEventListener("load", router);
window.addEventListener("hashchange", router);
