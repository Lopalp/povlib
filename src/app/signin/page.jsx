"use client";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import LogoHeading from "@/components/typography/LogoHeading";
import BackButton from "@/components/buttons/BackButton";
import { useEffect, useState } from 'react';
import { FaDiscord } from "react-icons/fa";
import "./signin.css";

export default function SignInPage() {
  const [scale, setScale] = useState(5);

  const glassBg = 'bg-black/50 backdrop-blur-lg border border-gray-700';

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      // Scale from 5 at 320px to 1.2 at 1920px
      const newScale = 5 - (width - 320) / (1920 - 320) * 3.8;
      setScale(Math.max(1.2, Math.min(5, newScale)));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Video */}
      <div className="absolute h-full w-full rounded-lg overflow-hidden">
        <iframe
          className="absolute top-0 left-0 h-full w-full rounded-lg"
          src={`https://www.youtube-nocookie.com/embed/d-8WyXJ5EtQ?autoplay=1&mute=1&loop=1&playlist=d-8WyXJ5EtQ&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&enablejsapi=1`}
          title="selectedDemo.title"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{
            border: "none",
            transform: `scale(${scale})`
          }}
        />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/70">
        <div className={`p-20 rounded-2xl shadow-lg text-left space-y-8 w-150 ${glassBg} justify-center items-center align-center flex flex-col`}
        style={{paddingBottom: 20}}>
          <div style={{ height: 10 }}></div>
          <LogoHeading size={4} />
          <p className="text-white text-lg font-medium m-0"
            style={{ fontWeight: 300, fontSize: "1.5rem", lineHeight: "2rem", marginTop: -10 }}
          >
            The ultimate CS2 library.
          </p>
          <div style={{ height: 50 }}></div>
          <GoogleSignInButton />
          <a 
            href="https://discord.gg/vqjmXGgFbJ"
            target="_blank"
            rel="noopener noreferrer"
            className="discord-link"
            style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none', gap: 10, justifyContent: "center"}}
          >
            <FaDiscord fontSize={"2rem"} color="#7289da"/>
            <p> Join our community on Discord!</p>
          </a>
          <div style={{ height: 10 }}></div>
          <BackButton text={"Back to home"} />
        </div>
      </div>
    </div>
  );
}