import Home from './pages/home/home';
import "../styles/tailwind.css";

const app = document.querySelector('#app') as HTMLElement;
const homePage = new Home();
app.innerHTML = homePage.render();
