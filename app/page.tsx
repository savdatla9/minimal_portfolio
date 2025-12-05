"use client"

import Link from 'next/link';
import { Github, Linkedin, PanelsTopLeft, TabletSmartphone, BadgePlus } from 'lucide-react';

import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";

export default function Page() {
  const title = "Sai Akhil Varma Datla";
  const email = "dsavarma.9@gmail.com";

  const socials = [
    { label: "GitHub", href: "https://github.com/savdatla9/", },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sai-akhil-varma-datla-051b3b158/", },
  ];

  const projects = [
    { name: "Gifteria", desc: "E-commerce, For Gift products.", isMobile: false, isWeb: true, link: 'https://gifteria.in/', },
    { name: "Mee Bazaar", desc: "E-commerce + Admin, For third tier cities and similar to BigBasket.", isMobile: true, isWeb: true, link: '', },
    { name: "Split Deals", desc: "Semi-Social platform + Admin, For purchase billing & discount splits.", isMobile: false, isWeb: true, link: '', },
    { name: "Linview", desc: "SAAS Web site for Kubernetes Storage.", isMobile: false, isWeb: true, link: '', },
    { name: "PlugXR Creator", desc: "SAAS Platform for create 3d Experience, to deploy in AR/VR, XR.", isMobile: false, isWeb: true, link: 'https://creator.plugxr.com/login', },
    { name: "ATUM Life", desc: "E-commerce + Admin, For reusable & organic products.", isMobile: true, isWeb: true, link: 'https://atumlife.com/home', },
    { name: "Telangana Nijam", desc: "E-newspaper - Editorial Admin + User Portal.", isMobile: false, isWeb: true, link: 'https://epaper.telangananijam.com/', },
    { name: "Sand CRM", desc: "CRM for tracking vehicle, minerals transport.", isMobile: false, isWeb: true, link: '', },
  ];

  const skills = [
    { name: 'HTML', rate: 70, isNew: false, icon: 'https://w7.pngwing.com/pngs/201/90/png-transparent-logo-html-html5.png' },
    { name: 'CSS', rate: 50, isNew: false, icon: 'https://www.citypng.com/public/uploads/preview/hd-css3-round-logo-icon-transparent-png-701751694771807mljmgxztmt.png' },
    { name: 'JavaScript', rate: 70, isNew: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png' },
    { name: 'TypeScript', rate: 60, isNew: true, icon: 'https://icons.veryicon.com/png/o/business/vscode-program-item-icon/typescript-def.png' },
    { name: 'Vue', rate: 35, isNew: true, icon: 'https://brandlogovector.com/wp-content/uploads/2021/12/Vue-Js-Logo-Small-150x150.png' },
    { name: 'Three Js', rate: 68, isNew: false, icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6eYPFwgeZwxd58aXqFwuhMF914MrfSPtqjQ&s' },
    { name: 'React Js & React Native', rate: 90, isNew: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png' },
    { name: 'Vite', rate: 80, isNew: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/2078px-Vitejs-logo.svg.png' },
    { name: 'Next Js', rate: 40, isNew: true, icon: 
      // 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV9uzErWz9EXqZDxZ5lP9aYpMz8eK6rr5X3w&s' 
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwIy-mzDNwEgiWKpwsy_8CK9KSr6GEnCcpgQ&s"
    },
    { name: 'Nuxt', rate: 38, isNew: true, icon: 'https://nuxt.com/assets/design-kit/icon-green.svg' },
    { name: 'Firebase', rate: 80, isNew: false, icon: 'https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/google-firebase-logo-icon-hd.png' },
    { name: 'Node Js', rate: 65, isNew: false, icon: 'https://www.freepnglogos.com/uploads/javascript-png/javascript-nodejs-logo-27.png' },
    { name: 'Express Js', rate: 63, isNew: true, icon: 'https://www.peanutsquare.com/wp-content/uploads/2024/04/Express.png' },
    { name: 'WebXR', rate: 78, isNew: false, icon: 'https://avatars.githubusercontent.com/u/34385910?s=280&v=4' },
  ];

  return (
    <main>
      {/* Hero */}
      <Section id="about" anim="fade">
        <div className="flex flex-col gap-4 py-4">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            {title}
          </h1>

          <p className="opacity-80">
            <b>Front End React Js Developer</b> with 5+years of experience in designing and developing web apps using <b>React, Vite-React, Next Js, Typescript, Node Js & Three Js</b>.
            Skilled in UI development, API integration <b>Axios - Rest, Next Js Server Components</b> and deployment on Vercel & GoDaddy.<br /><br />
            Hands-on with <strong> Firebase, Chart Js, Paytm Payment Gateway, React Three Fiber & WebXR</strong>, State Management - <b>Redux, Context, Vailto & Zustand</b>.
            Strong understanding of SDLC, agile delivery and troubleshooting. 
            Certification in <b><a href='https://www.linkedin.com/learning/certificates/be20676aa26f443ea107c4633d9b52c60ef8142227349fd4d7a879eb3154cc61' target="_blank">React Js</a> & <a href='https://threejs-journey.com/certificate/view/13686' target="_blank">Three Js</a></b>.<br />
          </p>
          
          {/* <div className="flex gap-2">
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
          </div> */}

          <ul className="flex flex-row justify-center gap-9 dark:bg-[#ffffff15] w-[200px] rounded-[25px] bg-[#00000015]">
            {socials.map((s) => (
              <li key={s.label} className="pt-5">
                <a className="hover:underline" href={s.href} target="_blank">
                  {s.label=='GitHub' ? <Github size={30} /> : <Linkedin size={30} />}
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
        
        <div className=" flex flex-wrap justify-center gap-6">
          {skills.map((it, idx) => <div key={idx} className="flex flex-col">
            <img src={it.icon} width={150} height={105} className="rounded-[5%]" />
 
            <p className="flex flex-row justify-center font-semibold items-center gap-2 p-2 italic">
              {it.name}

              {it.isNew===true && <BadgePlus size={20} />}
            </p>
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
              className="rounded-2xl border border-b-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
            >
              <h3 className="font-medium flex flex-row justify-between"><div>{p.name}</div> <div className="flex flex-row">{p.isWeb && <PanelsTopLeft />}&nbsp;&nbsp;{p.isMobile && <TabletSmartphone />}</div></h3>

              <p className="text-sm opacity-75">{p.desc}</p>

              {p.link!=='' && <Link href={p.link} target='_blank'>View Live</Link>}
            </article>
          ))}

          <article
            key={projects.length}
            className="rounded-2xl border border-b-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
          >
            <h3 className="font-medium flex flex-row justify-between"><div>Unsplash Photos</div> <div className="flex flex-row"><PanelsTopLeft /></div></h3>

            <p className="text-sm opacity-75">My Hobby - Photography</p>

            <Link href='/unsplash'>View Live</Link>
          </article>

          <article
            key={projects.length+1}
            className="rounded-2xl border border-b-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
          >
            <h3 className="font-medium flex flex-row justify-between"><div>Games on Web</div> <div className="flex flex-row"><PanelsTopLeft /></div></h3>

            <p className="text-sm opacity-75">Basic Games created by me</p>

            <Link href='/games'>View Live</Link>
          </article>

          <article
            key={projects.length+2}
            className="rounded-2xl border border-b-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
          >
            <h3 className="font-medium flex flex-row justify-between"><div>3D Configurators</div> <div className="flex flex-row"><PanelsTopLeft /></div></h3>

            <p className="text-sm opacity-75">Configurators for customise a Shirt, Cap & Shoe</p>

            <Link href='/configurator'>View Live</Link>
          </article>

          <article
            key={projects.length+3}
            className="rounded-2xl border border-b-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
          >
            <h3 className="font-medium flex flex-row justify-between"><div>3D Editor</div> <div className="flex flex-row"><PanelsTopLeft /></div></h3>

            <p className="text-sm opacity-75">3D Editor for 3d Models, 3d Text, Image, etc.</p>

            <Link href='/editor3D'>View Live</Link>
          </article>
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
    </main>
  );
};