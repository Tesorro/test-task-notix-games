import Image from 'next/image';
import { SearchInput } from './components/search-input';
import { Suspense } from 'react';
interface Props {}

export function Header({}: Props) {
  return (
    <header className="flex items-center gap-4">
      <Image
        src="/logo.jpg"
        width={30}
        height={30}
        alt="Notix.Games Ltd"
        className="rounded-br-2xl rounded-tl-2xl"
        autoFocus
      />
      <Suspense fallback={<div className="h-9 w-full" />}>
        <SearchInput />
      </Suspense>
    </header>
  );
}
