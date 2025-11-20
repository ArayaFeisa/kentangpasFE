export default class SplashPage {
  private timer?: number;
  render() {
    return `
      <section
        class="relative h-screen w-screen overflow-hidden bg-neutral-background font-sans animate-scale-in
               pt-[calc(env(safe-area-inset-top)+12px)]"
      >
        <img src="/icons/splash1.svg" alt="" class="pointer-events-none select-none absolute top-0 left-0 w-[70%] opacity-80" draggable="false" />
        <img src="/icons/splash2.svg" alt="" class="pointer-events-none select-none absolute top-0 right-0 w-[70%] opacity-80" draggable="false" />
        <img src="/icons/splash3.svg" alt="" class="pointer-events-none select-none absolute bottom-0 left-0 w-[70%] opacity-80" draggable="false" />
        <img src="/icons/splash4.svg" alt="" class="pointer-events-none select-none absolute bottom-0 right-0 w-[70%] opacity-80" draggable="false" />
        <div class="relative z-10 h-full w-full flex flex-col items-center justify-center">
          <img
            src="/icons/kentangpas-splashscreen.svg"
            alt="KENTANGPAS"
            class="w-[78%] max-w-[340px] mb-1"
            draggable="false"
          />
          <img
            src="/icons/icon-kentang.svg"
            alt="Kentang"
            class="w-[44%] max-w-[210px] -mt-30 md:-mt-4 mb-6"
            draggable="false"
          />
          <img
            src="/icons/subkentangpas.svg"
            alt="Sesuaikan, Hitung, Tanam"
            class="w-[62%] max-w-[260px] mt-2"
            draggable="false"
          />
        </div>
      </section>
    `;
  }
  mount(_root?: HTMLElement) {
    this.timer = window.setTimeout(() => location.hash = "/home", 1800);
  }
}
