import Link from 'next/link';
import {
	ArrowRight,
	BookOpenCheck,
	Brain,
	Check,
	Clock3,
	Layers3,
	Play,
	Sparkles,
	Volume2,
} from 'lucide-react';

import Header from '@/components/common/Header';

const HomePage = () => {
	return (
		<main className="min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
			<Header />

			<section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-10 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:pb-28 lg:pt-16">
				<div className="relative z-10 max-w-xl">
					<div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold tracking-[0.12em] text-primary uppercase shadow-sm">
						<Sparkles className="size-3.5" />
						A better way to remember
					</div>
					<h1 className="max-w-2xl font-display text-5xl leading-[0.98] tracking-[-0.04em] text-foreground sm:text-7xl">
						Make words <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">stick.</span>
					</h1>
					<p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground sm:text-xl">
						Eunoia turns everyday English into small, focused flashcard sessions
						that fit into your life and stay in your memory.
					</p>
					<div className="mt-9 flex flex-col gap-3 sm:flex-row">
						<Link
							href="/learning"
							className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5 hover:opacity-90"
						>
							Build your word habit
							<ArrowRight className="size-4" />
						</Link>
						<a
							href="#method"
							className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
						>
							<Play className="size-4 fill-current" />
							See how it works
						</a>
					</div>
					<div className="mt-9 flex items-center gap-3 text-sm text-muted-foreground">
						<div className="flex -space-x-2">
							{['M', 'A', 'J'].map((initial, index) => (
								<span
									key={initial}
									className={`grid size-8 place-items-center rounded-full border-2 border-background text-xs font-bold shadow-sm ${
										index === 0
											? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
											: index === 1
												? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
												: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
									}`}
								>
									{initial}
								</span>
							))}
						</div>
						<span>Join 2,000+ thoughtful learners</span>
					</div>
				</div>

				<div className="relative min-h-[460px] sm:min-h-[530px]">
					<div className="absolute -right-32 top-1/2 size-[34rem] -translate-y-1/2 rounded-full border border-border sm:-right-10 opacity-50" />
					<div className="absolute right-2 top-8 hidden size-14 rounded-full bg-primary/20 blur-xl sm:block" />
					<div className="absolute bottom-2 left-2 size-7 rounded-full bg-secondary/20 blur-lg" />

					<div className="absolute left-0 top-12 w-[86%] rotate-[-7deg] rounded-[2rem] border border-border/50 bg-muted/30 p-4 shadow-xl backdrop-blur-sm sm:left-10 sm:w-[78%]">
						<div className="flex items-center justify-between px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
							<span>Daily review</span>
							<span>04 / 12</span>
						</div>
						<div className="flex min-h-[285px] flex-col justify-between rounded-[1.5rem] bg-card p-7 shadow-2xl shadow-black/5 sm:min-h-[330px] sm:p-10 border border-border/50">
							<div className="flex items-start justify-between">
								<span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-primary uppercase">
									Verb
								</span>
								<Volume2 className="size-5 text-muted-foreground transition-colors hover:text-foreground cursor-pointer" />
							</div>
							<div>
								<p className="font-display text-4xl text-card-foreground sm:text-5xl font-bold">
									notice
								</p>
								<p className="mt-3 text-sm text-muted-foreground">
									to become aware of something
								</p>
							</div>
							<div className="flex items-center justify-between border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
								<span>Example</span>
								<span className="text-primary italic">I notice the details.</span>
							</div>
						</div>
					</div>

					<div className="absolute bottom-3 right-0 w-[72%] rotate-[7deg] rounded-[1.5rem] border border-border/50 bg-card/90 p-5 shadow-xl backdrop-blur-md sm:right-3 sm:w-[58%]">
						<div className="flex items-center gap-3">
							<span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
								<Brain className="size-5" />
							</span>
							<div>
								<p className="text-sm font-bold text-foreground">Memory moment</p>
								<p className="text-xs text-muted-foreground">You are on a 7 day streak</p>
							</div>
						</div>
						<div className="mt-4 flex gap-1.5">
							{[1, 2, 3, 4, 5, 6, 7].map((day) => (
								<span key={day} className="h-1.5 flex-1 rounded-full bg-primary/20 first:bg-primary last:bg-primary" />
							))}
						</div>
					</div>
				</div>
			</section>

			<section id="features" className="border-y border-border bg-muted/20">
				<div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-10 md:grid-cols-3 lg:px-12">
					{[
						{
							icon: Layers3,
							title: 'Small, focused sessions',
							text: 'A calm set of cards is easier to start and easier to finish.',
							color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
						},
						{
							icon: Brain,
							title: 'Built for memory',
							text: 'Smart review brings the right words back before they fade.',
							color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
						},
						{
							icon: Clock3,
							title: 'Progress that feels good',
							text: 'See your habit grow without turning learning into a chore.',
							color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400',
						},
					].map(({ icon: Icon, title, text, color }) => (
						<div key={title} className="flex gap-4 group">
							<span className={`grid size-11 shrink-0 place-items-center rounded-2xl transition-transform group-hover:scale-110 ${color}`}>
								<Icon className="size-5" />
							</span>
							<div>
								<h2 className="font-semibold text-foreground">{title}</h2>
								<p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			<section id="method" className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-28">
				<div>
					<p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">The Eunoia method</p>
					<h2 className="mt-4 max-w-md font-display text-4xl leading-tight text-foreground sm:text-5xl font-bold">
						Learn a little. Remember a lot.
					</h2>
					<p className="mt-5 max-w-md leading-7 text-muted-foreground">
						Language grows through return visits. Eunoia gives you a simple rhythm for meeting new words, using them, and seeing them again at just the right moment.
					</p>
					<Link href="/register" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:opacity-80 transition-opacity">
						Start with your first deck
						<ArrowRight className="size-4" />
					</Link>
				</div>

				<div className="grid gap-4 sm:grid-cols-3">
					{[
						['01', 'Meet', 'Add words from the English you actually want to understand.'],
						['02', 'Practice', 'Turn five quiet minutes into a useful daily ritual.'],
						['03', 'Keep', 'Watch new vocabulary move from unfamiliar to yours.'],
					].map(([number, title, text]) => (
						<div key={number} className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7">
							<span className="text-sm font-bold text-primary">{number}</span>
							<h3 className="mt-10 font-display text-2xl font-bold text-foreground">{title}</h3>
							<p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
							<Check className="mt-8 size-5 text-primary" />
						</div>
					))}
				</div>
			</section>

			<section id="review" className="mx-6 mb-8 overflow-hidden rounded-[2rem] bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 shadow-2xl sm:mx-10 lg:mx-auto lg:max-w-7xl relative">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
				<div className="relative grid items-center gap-8 px-7 py-12 sm:px-12 lg:grid-cols-[1fr_auto] lg:px-16 lg:py-14">
					<div>
						<BookOpenCheck className="size-8 text-primary" />
						<h2 className="mt-5 max-w-xl font-display text-4xl leading-tight text-zinc-50 font-bold sm:text-5xl">
							Your next favorite word is waiting.
						</h2>
						<p className="mt-4 max-w-lg leading-7 text-zinc-400">
							Make space for the kind of English that gives you more to say.
						</p>
					</div>
					<Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-zinc-900 transition hover:bg-zinc-200">
						Create free account
						<ArrowRight className="size-4" />
					</Link>
				</div>
			</section>

			<footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
				<span className="font-bold tracking-[0.14em] text-foreground uppercase">Eunoia English</span>
				<span>Learn with intention.</span>
			</footer>

		</main>
	);
};

export default HomePage;
