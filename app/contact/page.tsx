"use client";

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import Section from "@/components/Section";

export default function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "dsavarma.9@gmail.com",
      link: "mailto:dsavarma.9@gmail.com",
      description: "Drop me an email anytime!"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      value: "+91 789300 00778",
      link: "tel:+917893000078",
      description: "Mon-Fri from 9am to 6pm."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: "Hyderabad, India",
      link: "#",
      description: "Available for remote work worldwide."
    }
  ];

  const socials = [
    { name: "GitHub", icon: <Github className="w-5 h-5" />, href: "https://github.com/savdatla9/" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/sai-akhil-varma-datla-051b3b158/" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/d.s.a.v_/" },
  ];

  return (
    <main className="min-h-screen pb-20">
      {/* Header Section */}
      <Section id="contact-header" anim="fade-up">
        <div className="pt-12 pb-6 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-300"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed"
          >
            Have a question, a project in mind, or just want to say hi? I'd love to hear from you.
          </motion.p>
        </div>
      </Section>

      <Section id="contact-content" anim="fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-start mt-8">
          
          {/* Left Column: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold flex items-center gap-3">
                <MessageSquare className="text-purple-500 w-8 h-8" />
                Let's talk
              </h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, idx) => (
                <a 
                  key={idx} 
                  href={info.link}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-[#ffffff08] transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                      {info.title}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium mb-1 transition-colors group-hover:text-purple-700 dark:group-hover:text-purple-300">
                      {info.value}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {info.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold mb-4">Connect with me</h3>
              <div className="flex gap-4">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-3 bg-neutral-50 dark:bg-[#ffffff08] rounded-[2.5rem] p-8 sm:p-12 border border-neutral-200 dark:border-neutral-800 shadow-xl relative overflow-hidden"
          >
            {/* Decorative blurs */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-semibold mb-2">Send me a message</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                Fill out the form below and I'll get back to you as soon as possible.
              </p>
              
              {/* Wrapping the form and overriding max-w so it takes full width in this grid column */}
              <div className="[&>form]:max-w-full [&>form]:w-full w-full">
                <ContactForm />
              </div>
            </div>
          </motion.div>

        </div>
      </Section>
    </main>
  );
}