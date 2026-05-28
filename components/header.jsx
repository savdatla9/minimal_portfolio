"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Header({ name }) {
    const { setTheme, theme } = useTheme();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Scroll listener for sticky drop-shadow/backdrop transition
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 15) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Work", href: "/work" },
        { name: "Contact", href: "/contact" },
        { name: "Photography", href: "/photos" },
    ];

    return (
        <header 
            className={`sticky top-0 z-50 transition-all duration-300 w-full py-4 px-1 rounded-2xl mb-4 ${
                scrolled 
                    ? "bg-background/70 backdrop-blur-lg border-b border-border/40 shadow-[0_10px_30px_rgba(0,0,0,0.02)]" 
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="flex items-center justify-between px-2">
                {/* Logo / Brand Name */}
                <Link 
                    href="/" 
                    className="font-extrabold text-2xl tracking-tight bg-linear-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent hover:scale-[1.02] active:scale-95 transition-transform"
                >
                    {name}
                </Link>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative font-semibold text-sm transition-all duration-200 pb-1 ${
                                    isActive 
                                        ? "text-foreground opacity-100" 
                                        : "text-muted-foreground opacity-80 hover:text-foreground hover:opacity-100"
                                }`}
                            >
                                {link.name}
                                {isActive && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-foreground rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Desktop Theme Toggle */}
                    <button
                        onClick={handleTheme}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                        aria-label="Toggle Theme"
                    >
                        <div className="transition-transform duration-500 hover:rotate-45">
                            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500 animate-pulse" />}
                        </div>
                    </button>
                </nav>

                {/* Mobile Navigation Interface (Hamburger + Theme Toggle) */}
                <div className="flex md:hidden items-center gap-3">
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={handleTheme}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-secondary border border-border text-foreground transition-all duration-300 active:scale-90 cursor-pointer"
                        aria-label="Toggle Theme"
                    >
                        <div className="transition-transform duration-500 hover:rotate-45">
                            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
                        </div>
                    </button>

                    {/* Animated Custom Hamburger Button */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-secondary border border-border text-foreground transition-all duration-300 focus:outline-none hover:scale-105 active:scale-95 cursor-pointer"
                        aria-label="Toggle Menu"
                    >
                        <div className="relative w-5 h-5 flex flex-col justify-between items-center">
                            <span className={`absolute h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${isOpen ? "rotate-45 top-[9px]" : "top-0.5"}`} />
                            <span className={`absolute h-0.5 w-5 bg-current rounded-full transition-all duration-300 top-[9px] ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
                            <span className={`absolute h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${isOpen ? "-rotate-45 top-[9px]" : "top-4"}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Panel Menu */}
            <div 
                className={`md:hidden absolute left-0 right-0 mt-2 px-2 transition-all duration-300 ease-out transform origin-top ${
                    isOpen 
                        ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto" 
                        : "opacity-0 -translate-y-4 scale-y-90 pointer-events-none"
                }`}
            >
                <div className="p-4 bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl flex flex-col gap-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-base ${
                                    isActive 
                                        ? "bg-secondary text-foreground" 
                                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                                }`}
                            >
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}