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
		<main className="min-h-screen overflow-hidden bg-[#f5f1e8] text-[#1e3036]">
			<Header />

			<section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-10 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:pb-28 lg:pt-16">
				<div className="relative z-10 max-w-xl">
					<div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9b66a]/60 bg-[#f8e9c6] px-3 py-1.5 text-xs font-bold tracking-[0.12em] text-[#8a6227] uppercase">
						<Sparkles className="size-3.5" />
						A better way to remember
					</div>
					<h1 className="max-w-2xl font-display text-5xl leading-[0.98] tracking-[-0.04em] text-[#1e3036] sm:text-7xl">
						Make words <span className="text-[#d66d4a]">stick.</span>
					</h1>
					<p className="mt-7 max-w-lg text-lg leading-8 text-[#5b6b6d] sm:text-xl">
						Eunoia turns everyday English into small, focused flashcard sessions
						that fit into your life and stay in your memory.
					</p>
					<div className="mt-9 flex flex-col gap-3 sm:flex-row">
						<Link
							href="/learning"
							className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d66d4a] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_-12px_#d66d4a] transition hover:-translate-y-0.5 hover:bg-[#c85d3c]"
						>
							Build your word habit
							<ArrowRight className="size-4" />
						</Link>
						<a
							href="#method"
							className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b8c2bd] px-6 py-3.5 text-sm font-bold text-[#1e3036] transition hover:border-[#1e3036]"
						>
							<Play className="size-4 fill-current" />
							See how it works
						</a>
					</div>
					<div className="mt-9 flex items-center gap-3 text-sm text-[#718083]">
						<div className="flex -space-x-2">
							{['M', 'A', 'J'].map((initial, index) => (
								<span
									key={initial}
									className={`grid size-8 place-items-center rounded-full border-2 border-[#f5f1e8] text-xs font-bold ${
										index === 0
											? 'bg-[#c8dfd5] text-[#286052]'
											: index === 1
												? 'bg-[#f3c56f] text-[#76501b]'
												: 'bg-[#e9b6a2] text-[#884d3a]'
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
					<div className="absolute -right-32 top-1/2 size-[34rem] -translate-y-1/2 rounded-full border border-[#d7c8a9] sm:-right-10" />
					<div className="absolute right-2 top-8 hidden size-14 rounded-full bg-[#d66d4a] sm:block" />
					<div className="absolute bottom-2 left-2 size-7 rounded-full bg-[#6aa99a]" />

					<div className="absolute left-0 top-12 w-[86%] rotate-[-7deg] rounded-[2rem] border border-[#d5d8ce] bg-[#e9e4d8] p-4 shadow-xl sm:left-10 sm:w-[78%]">
						<div className="flex items-center justify-between px-3 py-2 text-[10px] font-bold tracking-[0.16em] text-[#81908d] uppercase">
							<span>Daily review</span>
							<span>04 / 12</span>
						</div>
						<div className="flex min-h-[285px] flex-col justify-between rounded-[1.5rem] bg-[#fffdf7] p-7 shadow-[0_12px_30px_-22px_#1e3036] sm:min-h-[330px] sm:p-10">
							<div className="flex items-start justify-between">
								<span className="rounded-full bg-[#d9eee4] px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-[#286052] uppercase">
									Verb
								</span>
								<Volume2 className="size-5 text-[#81908d]" />
							</div>
							<div>
								<p className="font-display text-4xl text-[#1e3036] sm:text-5xl">
									notice
								</p>
								<p className="mt-3 text-sm text-[#81908d]">
									to become aware of something
								</p>
							</div>
							<div className="flex items-center justify-between border-t border-[#e8e4d9] pt-4 text-xs font-semibold text-[#81908d]">
								<span>Example</span>
								<span className="text-[#d66d4a]">I notice the details.</span>
							</div>
						</div>
					</div>

					<div className="absolute bottom-3 right-0 w-[72%] rotate-[7deg] rounded-[1.5rem] border border-[#c7d9d1] bg-[#dcebe4] p-5 shadow-lg sm:right-3 sm:w-[58%]">
						<div className="flex items-center gap-3">
							<span className="grid size-10 place-items-center rounded-xl bg-[#f5c66f] text-[#72501e]">
								<Brain className="size-5" />
							</span>
							<div>
								<p className="text-sm font-bold text-[#1e3036]">Memory moment</p>
								<p className="text-xs text-[#648078]">You are on a 7 day streak</p>
							</div>
						</div>
						<div className="mt-4 flex gap-1.5">
							{[1, 2, 3, 4, 5, 6, 7].map((day) => (
								<span key={day} className="h-1.5 flex-1 rounded-full bg-[#6aa99a]" />
							))}
						</div>
					</div>
				</div>
			</section>

			<section id="features" className="border-y border-[#dfe0d7] bg-[#fbf9f3]">
				<div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-10 md:grid-cols-3 lg:px-12">
					{[
						{
							icon: Layers3,
							title: 'Small, focused sessions',
							text: 'A calm set of cards is easier to start and easier to finish.',
							color: 'bg-[#d9eee4] text-[#286052]',
						},
						{
							icon: Brain,
							title: 'Built for memory',
							text: 'Smart review brings the right words back before they fade.',
							color: 'bg-[#f8e4bb] text-[#8a6227]',
						},
						{
							icon: Clock3,
							title: 'Progress that feels good',
							text: 'See your habit grow without turning learning into a chore.',
							color: 'bg-[#f3d2c7] text-[#9b513c]',
						},
					].map(({ icon: Icon, title, text, color }) => (
						<div key={title} className="flex gap-4">
							<span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${color}`}>
								<Icon className="size-5" />
							</span>
							<div>
								<h2 className="font-semibold text-[#1e3036]">{title}</h2>
								<p className="mt-1 text-sm leading-6 text-[#718083]">{text}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			<section id="method" className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-28">
				<div>
					<p className="text-xs font-bold tracking-[0.18em] text-[#d66d4a] uppercase">The Eunoia method</p>
					<h2 className="mt-4 max-w-md font-display text-4xl leading-tight text-[#1e3036] sm:text-5xl">
						Learn a little. Remember a lot.
					</h2>
					<p className="mt-5 max-w-md leading-7 text-[#718083]">
						Language grows through return visits. Eunoia gives you a simple rhythm for meeting new words, using them, and seeing them again at just the right moment.
					</p>
					<Link href="/register" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#1e3036] underline decoration-[#d66d4a] decoration-2 underline-offset-4">
						Start with your first deck
						<ArrowRight className="size-4" />
					</Link>
				</div>

				<div className="grid gap-3 sm:grid-cols-3">
					{[
						['01', 'Meet', 'Add words from the English you actually want to understand.'],
						['02', 'Practice', 'Turn five quiet minutes into a useful daily ritual.'],
						['03', 'Keep', 'Watch new vocabulary move from unfamiliar to yours.'],
					].map(([number, title, text]) => (
						<div key={number} className="rounded-3xl border border-[#dfe0d7] bg-[#fbf9f3] p-6 sm:p-7">
							<span className="text-sm font-bold text-[#d66d4a]">{number}</span>
							<h3 className="mt-12 font-display text-2xl text-[#1e3036]">{title}</h3>
							<p className="mt-3 text-sm leading-6 text-[#718083]">{text}</p>
							<Check className="mt-8 size-5 text-[#6aa99a]" />
						</div>
					))}
				</div>
			</section>

			<section id="review" className="mx-6 mb-8 overflow-hidden rounded-[2rem] bg-[#1e3036] sm:mx-10 lg:mx-auto lg:max-w-7xl">
				<div className="grid items-center gap-8 px-7 py-12 sm:px-12 lg:grid-cols-[1fr_auto] lg:px-16 lg:py-14">
					<div>
						<BookOpenCheck className="size-8 text-[#f5c66f]" />
						<h2 className="mt-5 max-w-xl font-display text-4xl leading-tight text-[#f8f4eb] sm:text-5xl">
							Your next favorite word is waiting.
						</h2>
						<p className="mt-4 max-w-lg leading-7 text-[#b8c7c3]">
							Make space for the kind of English that gives you more to say.
						</p>
					</div>
					<Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5c66f] px-6 py-3.5 text-sm font-bold text-[#1e3036] transition hover:bg-[#f8d58e]">
						Create free account
						<ArrowRight className="size-4" />
					</Link>
				</div>
			</section>

			<footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-xs text-[#81908d] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
				<span className="font-bold tracking-[0.14em] text-[#1e3036] uppercase">Eunoia English</span>
				<span>Learn with intention.</span>
			</footer>

		</main>
	);
};

export default HomePage;
