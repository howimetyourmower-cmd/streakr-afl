
export const PageHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-8 text-center">
    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{title}</h1>
    {subtitle && <p className="mt-4 text-lg text-gray-400">{subtitle}</p>}
  </div>
);
