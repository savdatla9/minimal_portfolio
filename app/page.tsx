"use client"


import Link from "next/link";
import { Github, Linkedin, PanelsTopLeft, TabletSmartphone,  } from 'lucide-react';
import { useTheme } from "next-themes";

// const NoSSR = dynamic(() => import("iconsax-react"), { ssr: false })

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"

import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";

export default function Page() {
  const name = "S A V D";
  const title = "Sai Akhil Varma Datla";
  const email = "dsavarma.9@gmail.com";

  const { setTheme, theme } = useTheme();

  const socials = [
    { label: "GitHub", href: "https://github.com/savdatla9/", icon: <Github /> },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sai-akhil-varma-datla-051b3b158/", icon: <Linkedin /> },
  ];

  const projects = [
    { name: "Gifteria", desc: "E-commerce, For Gift products", isMobile: false, isWeb: true, },
    { name: "Mee Bazaar", desc: "E-commerce + admin, For third tier cities and similar to BigBasket", isMobile: true, isWeb: true, },
    { name: "Split Deals", desc: "Semi Social platform + admin, For purchase billing and discount splits", isMobile: false, isWeb: true, },
    { name: "Linview", desc: "SAAS Web site for Storage/Network purpose, ", isMobile: false, isWeb: true, },
    { name: "PlugXR Creator", desc: "React conversion & OAuth, 3D/Three.js, WebXR support", isMobile: false, isWeb: true, },
    { name: "ATUM Life", desc: "E-commerce + admin; payments & deployments", isMobile: true, isWeb: true, },
    { name: "Telangana Nijam", desc: "E-newspaper; editorial admin tooling", isMobile: false, isWeb: true, },
    { name: "Sand CRM", desc: "Nuxt + ShadCN; Mappls map tracking", isMobile: false, isWeb: true, },
  ];

  const skills = [
    { name: 'HTML', rate: 70, isNew: false, icon: 'https://w7.pngwing.com/pngs/201/90/png-transparent-logo-html-html5.png' },
    { name: 'CSS', rate: 50, isNew: false, icon: 'https://www.citypng.com/public/uploads/preview/hd-css3-round-logo-icon-transparent-png-701751694771807mljmgxztmt.png' },
    { name: 'JavaScript', rate: 70, isNew: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png' },
    { name: 'React Js', rate: 90, isNew: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png' },
    { name: 'React Native', rate: 65, isNew: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png' },
    { name: 'Three Js', rate: 68, isNew: false, icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6eYPFwgeZwxd58aXqFwuhMF914MrfSPtqjQ&s' },
    { name: 'TypeScript', rate: 60, isNew: false, icon: 'https://icons.veryicon.com/png/o/business/vscode-program-item-icon/typescript-def.png' },
    { name: 'Vite', rate: 80, isNew: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/2078px-Vitejs-logo.svg.png' },
    { name: 'Next Js', rate: 40, isNew: true, icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV9uzErWz9EXqZDxZ5lP9aYpMz8eK6rr5X3w&s' },
    { name: 'Vue', rate: 35, isNew: true, icon: 'https://logowik.com/content/uploads/images/vue2883.jpg' },
    { name: 'Nuxt', rate: 38, isNew: true, icon: 'https://nuxt.com/assets/design-kit/icon-green.svg' },
    { name: 'Firebase', rate: 80, isNew: false, icon: 'https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/google-firebase-logo-icon-hd.png' },
    { name: 'Node Js', rate: 65, isNew: false, icon: 'https://w7.pngwing.com/pngs/450/470/png-transparent-node-js-angularjs-react-javascript-npm-node-js-angle-text-trademark.png' },
    { name: 'Express Js', rate: 63, isNew: false, icon: 'https://www.peanutsquare.com/wp-content/uploads/2024/04/Express.png' },
    { name: 'WebXR', rate: 78, isNew: false, icon: 'https://avatars.githubusercontent.com/u/34385910?s=280&v=4' },
    // { name: '', rate: 4, isNew: false, icon: '' },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* Header */}
      <header className="flex items-center justify-between py-8">
        <Link href="/" className="font-semibold text-2xl tracking-tight">
          {name}
        </Link>
        
        <nav className="flex items-center gap-4">
          <a className="opacity-80 hover:opacity-100" href="#about">
            About
          </a>
          <a className="opacity-80 hover:opacity-100" href="#work">
            Work
          </a>
          <a className="opacity-80 hover:opacity-100" href="#contact">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero */}
      <Section id="about" anim="fade">
        <div className="flex flex-col gap-4 py-4">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            {title}
          </h1>

          <p className="opacity-80">
            <b>Front End React Js Developer</b> with 5+ years of experience in designing and developing web apps using <b>React, Vue/Nuxt, Node Js & Three Js</b>. 
            Skilled in UI/UX development, API integration and deployment on Vercel & GoDaddy.<br /><br />
            Hands-on with <strong>Mappls Maps, Firebase, Chart Js, Paytm Payment Gateway</strong>.
            Strong understanding of SDLC, agile delivery and troubleshooting.
            Certified in React Js & Three Js.<br />
          </p>
          
          <div className="flex gap-2">
            <a
              href="#contact"
              className="rounded-xl border-solid px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              Contact me
            </a>

            <a
              href={`mailto:${email}`}
              className="rounded-xl border-solid px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              Email
            </a>
          </div>

          <ul className="flex gap-4 text-md opacity-75">
            {socials.map((s) => (
              <li key={s.label}>
                <a className="hover:underline" href={s.href} target="_blank">
                  {s.icon}
                </a>&nbsp;&nbsp;&nbsp;
                {/* <Button variant="secondary" onClick={() => window.location.href=s.href}>{s.icon}</Button> */}
              </li>
            ))}
          </ul>
        </div>
      </Section>

       {/* Skills */}
      <Section id="about" anim="fade-up">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        
        <div className=" flex flex-wrap gap-6">
          {skills.map((it, idx) => <div key={idx}>
            <p>{it.name}</p>

            <img src={it.icon} width={150} height='auto' className="rounded-[25%]" />
            {/* <Progress value={it.rate} /> */}
          </div>)}
        </div>
      </Section>

      {/* Work */}
      <Section id="work" anim="fade-up">
        <h2 className="text-xl font-semibold mb-4">Work</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <article
              key={p.name}
              className="rounded-2xl border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
            >
              <h3 className="font-medium flex flex-row justify-between"><div>{p.name}</div> <div className="flex flex-row">{p.isWeb && <PanelsTopLeft />}&nbsp;&nbsp;{p.isMobile && <TabletSmartphone />}</div></h3>

              <p className="text-sm opacity-75">{p.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" anim="fade-left">
        <h2 className="text-xl font-semibold mb-4">Contact</h2>

        <p className="mb-6 max-w-2xl opacity-80">
          Prefer email? Reach me at{" "}
          <a className="underline" href={`mailto:${email}`}>
            {email}
          </a>.

          <br/> 
          
          Otherwise, drop a note below—messages go straight to my inbox.
        </p>

        <ContactForm />
      </Section>

      {/* Footer */}
      <footer className="py-12 opacity-60 text-sm">
        © {name}  &nbsp;{new Date().getFullYear()}
      </footer>
    </main>
  );
};