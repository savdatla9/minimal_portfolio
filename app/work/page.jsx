"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelsTopLeft, TabletSmartphone, ExternalLink, Briefcase, ChevronRight, FolderDot } from 'lucide-react';
import Section from "@/components/Section";

export default function Work() {
  const [filter, setFilter] = useState('All');

  const experiences = [
    {
      role: "Software Engineer",
      company: "Kiot Innovations",
      duration: "Oct 2025 - Present",
      description: "Leading the front-end development, building scalable web applications using React and Next.js and integrating various maps services APIs like Mappls, Google Maps & etc."
    },
    {
      role: "Junior Executive - Mobile Developer",
      company: "Visaka Industries",
      duration: "Jul 2022 - May 2024",
      description: "Developed cross-platform mobile applications and scalable web platforms. Focused on user experience and clean UI/UX."
    },
    {
      role: "Software Developer",
      company: "PlugXR Reality",
      duration: "Jan 2019 - Jun 2022",
      description: "Contributed to SAAS Platform for creating 3D Experiences. Deployed to AR/VR and XR platform."
    },
    {
      role: "React Developer - Consultant",
      company: "LoginSoft",
      duration: "Mar 2020 - Sept 2020",
      description: "Consulted on React applications, optimizing performance and establishing best practices for frontend architectures."
    },
    {
      role: "Software Developer",
      company: "Marvij IT",
      duration: "Jul 2018 - Mar 2020",
      description: "Worked on various client projects with a strong focus on responsive frontend designs and performance optimizations."
    }
  ];

  const projects = [
    { name: "Gifteria", desc: "E-commerce, For Gift products.", isMobile: false, isWeb: true, link: 'https://gifteria.in/', type: "E-Commerce" },
    { name: "Mee Bazaar", desc: "E-commerce + Admin, For third tier cities and similar to BigBasket.", isMobile: true, isWeb: true, link: '', type: "E-Commerce" },
    { name: "Split Deals", desc: "Semi-Social platform + Admin, For purchase billing & discount splits.", isMobile: false, isWeb: true, link: '', type: "Platform" },
    { name: "Linview", desc: "SAAS Web site for Kubernetes Storage.", isMobile: false, isWeb: true, link: '', type: "SaaS" },
    { name: "PlugXR Creator", desc: "SAAS Platform for create 3d Experience, to deploy in AR/VR, XR.", isMobile: false, isWeb: true, link: 'https://plugxr.com/', type: "SaaS" },
    { name: "ATUM Life", desc: "E-commerce + Admin, For reusable & organic products.", isMobile: true, isWeb: true, link: 'https://atumlife.com/home', type: "E-Commerce" },
    { name: "Telangana Nijam", desc: "E-newspaper - Editorial Admin + User Portal.", isMobile: false, isWeb: true, link: 'https://epaper.telangananijam.com/', type: "Platform" },
    { name: "Sand CRM", desc: "CRM for tracking vehicle, minerals transport.", isMobile: false, isWeb: true, link: '', type: "SaaS" },
    { name: "Accelr8", desc: "A multi utility SaaS for retailers.", isMobile: false, isWeb: true, link: '', type: "SaaS" },
    { name: "Rapidé nforce", desc: "B2B SAAS Platform for tracking orders.", isMobile: false, isWeb: true, link: '', type: "SaaS" },
  ];

  const categories = ['All', 'SaaS', 'E-Commerce', 'Platform'];
  
  const filteredProjects = projects.filter(p => filter === 'All' || p.type === filter);

  return (
    <main className="min-h-screen pb-20">
      {/* Header Section */}
      <Section id="work-header" anim="fade-up">
        <div className="pt-12 pb-6 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400 dark:from-blue-400 dark:to-teal-300"
          >
            My Work
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed"
          >
            A curated collection of projects and professional experiences that define my journey as a developer.
          </motion.p>
        </div>
      </Section>

      {/* Experience Timeline Section */}
      <Section id="experience" anim="fade-up">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold mb-2 flex items-center gap-3">
            <Briefcase className="text-blue-500 w-8 h-8" />
            Experience
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"></div>
        </div>

        <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-4 lg:ml-6 mb-16 space-y-12">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative pl-8 sm:pl-12 group"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[11px] top-2 h-5 w-5 rounded-full bg-white dark:bg-[#0a0a0a] border-4 border-neutral-300 dark:border-neutral-700 transition-all duration-300 group-hover:border-blue-500 group-hover:scale-125"></div>
              
              <div className="bg-neutral-50 dark:bg-[#ffffff08] rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:border-blue-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 dark:text-white transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400">
                    {exp.role}
                  </h3>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 whitespace-nowrap">
                    {exp.duration}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-4 text-lg font-medium text-neutral-700 dark:text-neutral-300">
                  <ChevronRight className="w-5 h-5 text-blue-500" />
                  {exp.company}
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Projects Section */}
      <Section id="projects" anim="fade-up">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold mb-2 flex items-center gap-3">
            <FolderDot className="text-teal-500 w-8 h-8" />
            Featured Projects
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-teal-400 to-green-500 rounded-full mb-8"></div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md scale-105' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 hover:scale-105'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p, idx) => (
              <motion.article
                key={p.name}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4 }}
                className="group relative flex flex-col justify-between rounded-[2rem] bg-neutral-50 dark:bg-[#ffffff08] border border-neutral-200 dark:border-neutral-800 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* Decorative background blob */}
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10 mb-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700 group-hover:scale-110 transition-transform duration-300">
                      <FolderDot className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />
                    </div>
                    <div className="flex gap-2">
                      {p.isWeb && <div className="p-1.5 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50"><PanelsTopLeft className="w-5 h-5 text-neutral-500" /></div>}
                      {p.isMobile && <div className="p-1.5 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50"><TabletSmartphone className="w-5 h-5 text-neutral-500" /></div>}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {p.name}
                  </h3>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 text-[15px] leading-relaxed mb-6">
                    {p.desc}
                  </p>
                  
                  <span className="inline-block px-3 py-1 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    {p.type}
                  </span>
                </div>

                <div className="relative z-10 pt-5 border-t border-neutral-200 dark:border-neutral-800 mt-auto flex items-center justify-between">
                  {p.link ? (
                    <Link 
                      href={p.link} 
                      target='_blank'
                      className="inline-flex items-center gap-2 text-sm font-semibold hover:text-blue-500 dark:hover:text-blue-400 transition-colors group/link"
                    >
                      View Live <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-neutral-400 dark:text-neutral-600 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                      Internal
                    </span>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Additional Custom/Hobby Projects */}
        <h2 className="text-3xl font-semibold mt-8 flex items-center gap-3">
          <FolderDot className="text-teal-500 w-8 h-8" />
          Personal Projects
        </h2>

        <div className="w-16 h-1.5 bg-gradient-to-r from-teal-400 to-green-500 rounded-full mb-1"></div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/editor3D" className="group rounded-[2rem] border border-neutral-200 dark:border-neutral-800 p-8 hover:bg-neutral-50 dark:hover:bg-[#ffffff08] transition-all hover:shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
              3D Editor
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-neutral-400 group-hover:text-purple-500" />
            </h3>
            <p className="text-neutral-500 text-sm">A simple 3D editor using Three.js</p>
          </Link>
          
          <Link href="/games" className="group rounded-[2rem] border border-neutral-200 dark:border-neutral-800 p-8 hover:bg-neutral-50 dark:hover:bg-[#ffffff08] transition-all hover:shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
              Games on Web
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-neutral-400 group-hover:text-green-500" />
            </h3>
            <p className="text-neutral-500 text-sm">Basic Games created by me</p>
          </Link>
          
          <Link href="/configurator" className="group rounded-[2rem] border border-neutral-200 dark:border-neutral-800 p-8 hover:bg-neutral-50 dark:hover:bg-[#ffffff08] transition-all hover:shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
              3D Configurators
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-neutral-400 group-hover:text-orange-500" />
            </h3>
            <p className="text-neutral-500 text-sm">Configurators for customise a Shirt, Cap & Shoe</p>
          </Link>
        </div>
      </Section>
    </main>
  );
};