'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartAdventure = () => {
    router.push('/start'); // Navigates to app/start.tsx
  };

  return (
    <main className="main-container" style={{ background: "var(--color-3)" }}>
      <div className="home-content">
        <div className="h-full flex flex-col place-content-center">
          <h1 className="title" style={{ color: "var(--color-1)", fontSize: "16rem" }}>rutIA</h1>
          <div className='image flex'>
            {/* <Image></Image> */}
            <Image
              src="/Yellow Dotted Lines.svg"
              width={600}
              height={200}
              alt="Dotted line simulating route"
              className='object-cover'
            />
          </div>
          <button
            onClick={handleStartAdventure}
            className="start-button primary uppercase px-7 mt-3 self-center text-xl"
          >
            Comença l&apos;aventura
          </button>
        </div>
      </div>
    </main>
  );
}
