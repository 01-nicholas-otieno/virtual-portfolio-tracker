import Image from "next/image";
import SearchBar from "./components/SearchBar";
import Ticker from "./components/Ticker";
import SymbolGrid from "./components/SymbolGrid";
import { getTopSymbols } from "./utils";



export default async function Home() {
  const topSymbols = await getTopSymbols();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Ticker />

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <SymbolGrid symbols={topSymbols} />
        <h3 className="w-full max-w-lg mx-auto">Your favourite stock symbol not listed? Search it...</h3>
        <SearchBar />

        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">Instant stock updates</li>
          <li className="tracking-[-.01em]">Buy stocks.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image className="dark:invert" src="/vercel.svg" alt="Vercel logo" width={20} height={20} />
            Trade now
          </a>
          <a
            className="rounded-full border border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        @Stocktracker 2025
      </footer>
    </div>
  );
}
