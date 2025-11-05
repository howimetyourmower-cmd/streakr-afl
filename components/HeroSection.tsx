// components/HeroSection.tsx
export default function HeroSection() {
  return (
    <section className="relative w-full h-[48vh] md:h-[60vh] bg-black">
      <img
        src="/mcg-hero.jpg"
        alt="MCG under lights"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      <div className="relative z-10 h-full flex flex-col justify-end max-w-6xl mx-auto px-4 pb-8 md:pb-12">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold">
          Welcome to STREAKr AFL 2026
        </h1>
        <p className="mt-3 text-white/90 text-base md:text-lg max-w-2xl">
          Make your picks. Build your streak. Chase the glory.
        </p>
        <a
          href="#picks"
          className="inline-block mt-6 rounded-lg px-5 py-3 bg-orange-500 hover:bg-orange-600 transition self-start"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}
