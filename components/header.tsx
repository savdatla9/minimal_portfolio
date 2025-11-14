"use client"

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from 'lucide-react';

export default function Header({ name } : { name: string }){
    const { setTheme, theme } = useTheme();

    const handleTheme = () => {
        theme==='light'? setTheme('dark') : setTheme('light')
    };

    return(
        <header className="flex items-center justify-between py-8 z-10">
            <Link href="/" className="font-semibold text-2xl tracking-tight">
                {name}
            </Link>
            
            <nav className="flex items-center gap-4">
                <a className="opacity-80 font-semibold hover:opacity-100" href="#about">
                    About
                </a>

                <a className="opacity-80 font-semibold hover:opacity-100" href="#work">
                    Work
                </a>
                
                <a className="opacity-80 font-semibold hover:opacity-100" href="#contact">
                    Contact
                </a>

                <div onClick={handleTheme}>
                    {theme==='light' && <Sun />}

                    {theme==='dark' && <Moon />}
                </div>
            </nav>
        </header>
    );
};