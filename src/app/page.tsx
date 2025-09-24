import { Header } from '@/components/shared/header';
import { Main } from '@/components/shared/main';

export default function Home() {
  return (
    <div className="max-w-[1400] w-full mx-auto">
      <Header />
      <Main />
      <footer></footer>
    </div>
  );
}
