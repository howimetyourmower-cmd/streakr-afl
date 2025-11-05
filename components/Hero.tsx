import Link from 'next/link';

const Hero = () => {
  return (
    <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center px-6 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1594495894542-a08dc8e3c365?q=80&w=2940&auto=format&fit=crop')] opacity-20 blur-sm"></div>
      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter">AFL Player Props, Perfected.</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-300">
          Make your picks each round and climb the leaderboard. The longest streak wins.
        </p>
        <div className="mt-8">
          <Link href="/picks" className="bg-orange-600 text-white font-bold py-4 px-8 rounded-full hover:bg-orange-700 transition-transform hover:scale-105 text-lg">
            Make a Pick
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
