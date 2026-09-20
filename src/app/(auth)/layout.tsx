const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(360px,0.85fr)_minmax(480px,1.15fr)]">
      <aside className="relative hidden overflow-hidden bg-[#21333a] px-12 py-10 text-[#f7f4eb] lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="relative z-10 flex items-center gap-3 text-sm font-semibold tracking-[0.18em] uppercase">
          <span className="grid size-9 place-items-center rounded-full bg-[#d8a24b] text-lg font-bold text-[#21333a]">e</span>
          Eunoia English
        </div>
        <div className="relative z-10 max-w-md pb-8">
          <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-[#d8a24b] uppercase">Read. Notice. Grow.</p>
          <h2 className="font-display text-5xl leading-[1.05] xl:text-6xl">Find your voice in a world of words.</h2>
          <p className="mt-6 max-w-sm text-base leading-7 text-[#c6d0cc]">A calm space to build the English you actually want to use, one thoughtful page at a time.</p>
          <div className="mt-10 flex items-center gap-3 border-t border-white/15 pt-5 text-sm text-[#c6d0cc]">
            <span className="grid size-9 place-items-center rounded-full bg-[#d8a24b] font-display text-lg text-[#21333a]">L</span>
            <span>“Small habits, remarkable fluency.”</span>
          </div>
        </div>
        <div className="absolute -right-24 top-1/3 size-72 rounded-full border border-[#d8a24b]/30" />
        <div className="absolute -right-10 top-[38%] size-44 rounded-full border border-[#d8a24b]/20" />
      </aside>
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
