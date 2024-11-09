'use client'; // Mark this file as a Client Component


import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartAdventure = () => {
    router.push('/start'); // Navigates to app/start.tsx
  };

  return (
    <main className="main-container" style={{ background: "var(--color-3)" }}>
      <div className="home-content">
        <div className="centered-container">
          <h1 className="title" style={{ color: "var(--color-1)", fontSize: "16rem" }}>rutIA</h1>
          <button
            onClick={handleStartAdventure}
            className="start-button primary uppercase px-7 self-center mt-auto text-lg"
          >
            Comença l'aventura
          </button>
        </div>
      </div>
    </main>
  );
}
