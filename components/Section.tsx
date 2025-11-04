"use client";

import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

export default function Section({
  id,
  anim = "fade-up",
  children,
}: {
  id?: string;
  anim?: string;
  children: React.ReactNode;
}) {
    useEffect(() => {
        AOS.init({ duration: 600, once: true, easing: "ease-out-cubic" });
    }, []);

    return (
        <section id={id} data-aos={anim} className="py-16">
            {children}
        </section>
    );
}