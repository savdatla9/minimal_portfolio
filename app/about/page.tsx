"use client";

import { motion } from 'framer-motion';
import { Code, Palette, Rocket, Terminal, GraduationCap, Award, Coffee } from 'lucide-react';
import Section from "@/components/Section";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  // const itemVariants = {
  //   hidden: { y: 20, opacity: 0 },
  //   visible: {
  //     y: 0,
  //     opacity: 1,
  //     transition: { duration: 0.5, ease: "easeOut" },
  //   },
  // };

  const services = [
    {
      title: "Frontend Development",
      description: "Building responsive, performant, and accessible web applications using modern frameworks like React and Next.js.",
      icon: <Code className="w-6 h-6" />,
    },
    {
      title: "UI/UX Design",
      description: "Crafting beautiful, intuitive interfaces with a focus on user experience and modern design principles.",
      icon: <Palette className="w-6 h-6" />,
    },
    {
      title: "3D Web Experiences",
      description: "Creating immersive 3D web environments and product configurators using Three.js and WebGL.",
      icon: <Rocket className="w-6 h-6" />,
    },
    {
      title: "Backend & APIs",
      description: "Developing robust backend services and RESTful APIs using Node.js and Express.",
      icon: <Terminal className="w-6 h-6" />,
    },
  ];

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <Section id="about-hero" anim="fade-up">
        <div className="flex flex-col md:flex-row gap-12 items-center pt-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="w-full md:w-1/3 aspect-square relative rounded-[2rem] overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <img 
              src="/CDSC_0433.jpg" 
              alt="Sai Akhil Varma Datla" 
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>

          <div className="w-full md:w-2/3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 mb-2">
                Hi, I'm Sai Akhil Varma Datla.
              </h1>
              <h2 className="text-xl sm:text-2xl font-medium text-neutral-600 dark:text-neutral-400">
                A passionate Front End Developer crafting digital experiences.
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 text-lg opacity-80 leading-relaxed"
            >
              <p>
                With over 6 years of experience in the tech industry, I specialize in building rich, interactive web applications. 
                My journey began with a curiosity for how things work on the internet, which quickly blossomed into a career focused on 
                pushing the boundaries of web technologies.
              </p>
              <p>
                I believe in writing clean, maintainable code and designing interfaces that are both beautiful and highly functional. 
                Whether it's an e-commerce platform, a complex SaaS dashboard, or an immersive 3D experience, I approach every 
                project with dedication and an eye for detail.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* What I Do Section */}
      <Section id="services" anim="fade-up">
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-semibold mb-3">What I Do</h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"></div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                // variants={itemVariants}
                className="p-8 rounded-[2rem] bg-neutral-50 dark:bg-[#ffffff08] border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center mb-6 text-neutral-800 dark:text-neutral-200 group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Philosophy / Personal Stats */}
      <Section id="philosophy" anim="fade-up">
        <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-[2.5rem] p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-500/20 to-green-500/20 dark:from-teal-500/10 dark:to-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">My Philosophy</h2>
              <blockquote className="text-xl sm:text-2xl font-medium italic border-l-4 border-white/30 dark:border-black/30 pl-6 py-2 opacity-90 leading-relaxed">
                "Design is not just what it looks like and feels like. Design is how it works."
              </blockquote>
              <p className="text-lg opacity-80 leading-relaxed">
                I approach every project with a user-centric mindset. From the first line of code to the final deployment, the goal is always to create a seamless, intuitive experience that leaves a lasting impression. Performance and aesthetics go hand-in-hand in my development process.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white/10 dark:bg-black/5 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 hover:bg-white/15 dark:hover:bg-black/10 transition-colors">
                <Terminal className="w-8 h-8 opacity-70" />
                <div className="text-3xl sm:text-4xl font-bold">10k+</div>
                <div className="opacity-70 text-sm font-medium uppercase tracking-wider">Hours Coding</div>
              </div>
              <div className="bg-white/10 dark:bg-black/5 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 hover:bg-white/15 dark:hover:bg-black/10 transition-colors">
                <Code className="w-8 h-8 opacity-70" />
                <div className="text-3xl sm:text-4xl font-bold">10+</div>
                <div className="opacity-70 text-sm font-medium uppercase tracking-wider">Projects done</div>
              </div>
              <div className="bg-white/10 dark:bg-black/5 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 hover:bg-white/15 dark:hover:bg-black/10 transition-colors">
                <Award className="w-8 h-8 opacity-70" />
                <div className="text-3xl sm:text-4xl font-bold">6+</div>
                <div className="opacity-70 text-sm font-medium uppercase tracking-wider">Years Exp.</div>
              </div>
              <div className="bg-white/10 dark:bg-black/5 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 hover:bg-white/15 dark:hover:bg-black/10 transition-colors">
                <GraduationCap className="w-8 h-8 opacity-70" />
                <div className="text-3xl sm:text-4xl font-bold">100%</div>
                <div className="opacity-70 text-sm font-medium uppercase tracking-wider">Dedication</div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
};