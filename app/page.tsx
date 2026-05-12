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
    { name: "PlugXR Creator", desc: "SAAS Platform for create 3d Experience, to deploy in AR/VR, XR.", isMobile: false, isWeb: true, link: 'https://plugxr.com/', },
    { name: "ATUM Life", desc: "E-commerce + Admin, For reusable & organic products.", isMobile: true, isWeb: true, link: 'https://atumlife.com/home', },
    { name: "Telangana Nijam", desc: "E-newspaper - Editorial Admin + User Portal.", isMobile: false, isWeb: true, link: 'https://epaper.telangananijam.com/', },
    { name: "Sand CRM", desc: "CRM for tracking vehicle, minerals transport.", isMobile: false, isWeb: true, link: '', },
    { name: "Accelor8", desc: "A multi utility SaaS for retailers.", isMobile: false, isWeb: true, link: '', },
    { name: "Rapidé nforce", desc: "B2B SAAS Platform for tracking orders.", isMobile: false, isWeb: true, link: '', },
  ];

  const experiences = [
    {
      role: "Software Engineer",
      company: "Kiot Innovations",
      duration: "Oct 2025 - Present",
      description: "Leading the front-end development, building scalable web applications using React and Next.js, and integrating 3D experiences with Three.js."
    },
    {
      role: "Junior Executive - Mobile Developer",
      company: "Visaka Industries",
      duration: "Jul 2022 - May 2024",
      description: "Leading the front-end development, building scalable web applications using React and Next.js, and integrating 3D experiences with Three.js."
    },
    {
      role: "Software Developer",
      company: "PlugXR Reality",
      duration: "Jan 2019 - Jun 2022",
      description: "Leading the front-end development, building scalable web applications using React and Next.js, and integrating 3D experiences with Three.js."
    },
    {
      role: "React Developer - Consultant",
      company: "LoginSoft",
      duration: "Mar 2020 - Sept 2020",
      description: "Leading the front-end development, building scalable web applications using React and Next.js, and integrating 3D experiences with Three.js."
    },
    {
      role: "Software Developer",
      company: "Marvij IT",
      duration: "Jul 2018 - Mar 2020",
      description: "Leading the front-end development, building scalable web applications using React and Next.js, and integrating 3D experiences with Three.js."
    }
  ];

  const skills = [
    { name: 'HTML', rate: 70, isNew: false, icon: 'https://w7.pngwing.com/pngs/201/90/png-transparent-logo-html-html5.png' },
    { name: 'CSS', rate: 50, isNew: false, icon: 'https://www.citypng.com/public/uploads/preview/hd-css3-round-logo-icon-transparent-png-701751694771807mljmgxztmt.png' },
    { name: 'JavaScript', rate: 70, isNew: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png' },
    { name: 'TypeScript', rate: 60, isNew: true, icon: 'https://icons.veryicon.com/png/o/business/vscode-program-item-icon/typescript-def.png' },
    { name: 'Vue', rate: 35, isNew: true, icon: 'https://brandlogovector.com/wp-content/uploads/2021/12/Vue-Js-Logo-Small-150x150.png' },
    { name: 'Three Js', rate: 68, isNew: false, icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6eYPFwgeZwxd58aXqFwuhMF914MrfSPtqjQ&s' },
    { name: 'React Js & React Native', rate: 90, isNew: false, icon: 'https://i.pinimg.com/736x/e3/68/6a/e3686af5908e06e5278158b626207d5f.jpg' },
    // { name: 'Vite', rate: 80, isNew: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/2078px-Vitejs-logo.svg.png' },
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
            <b>Front End Developer</b> with 6 years of experience in designing and developing web apps using <b>React, Next Js, HTML, CSS, JS, TS, Tailwind CSS, Node Js & Three Js</b>.
            Skilled in UI development, API integration <b>Axios - REST</b> and deployment on AWS - Amplify Vercel & GoDaddy.<br /><br />
            Hands-on with <strong> Firebase, Chart Js, Paytm Payment Gateway, React Three Fiber & WebXR</strong>, State Management - <b>Redux, Context</b>.
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

      {/* Work Experience Timeline */}
      <Section id="experience" anim="fade-up">
        <h2 className="text-xl font-semibold mb-6">Experience</h2>
        <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-3 mb-12">
          {experiences.map((exp, idx) => (
            <div key={idx} className="mb-8 pl-6 relative">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-neutral-400 dark:bg-neutral-600 ring-4 ring-white dark:ring-[#0a0a0a]"></span>
              <h3 className="font-semibold text-lg">{exp.role}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-500 dark:text-neutral-400 mb-2 gap-1 sm:gap-2">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{exp.company}</span>
                <span className="hidden sm:inline">•</span>
                <span>{exp.duration}</span>
              </div>
              {/* <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {exp.description}
              </p> */}
            </div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" anim="fade-up">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>

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