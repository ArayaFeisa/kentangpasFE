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

document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.querySelector<HTMLButtonElement>(".btn-back");

  if (backButton) {
    backButton.classList.add(
      "bg-red-400",
      "text-white",
      "px-4",
      "py-2",
      "rounded-lg",
      "transition",
      "duration-300",
      "ease-in-out",
      "hover:bg-red-600",
      "hover:scale-105",
      "hover:shadow-lg"
    );

    backButton.addEventListener("click", () => {
      localStorage.removeItem("formData");

      window.history.back();
    });
  }
});
