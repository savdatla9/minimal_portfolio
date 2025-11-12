'use client'

import React from 'react';
import ContactForm from '@/components/ContactForm';

export default function Contact(){
    return(
        <div>
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            
            <p className="mb-6 max-w-xl opacity-80">
                Prefer email? Reach me at &nbsp;&nbsp;
                <a className="underline" href="mailto:dsavarma.9@gmail.com">
                    dsavarma.9@gmail.com
                </a>.
    
                <br/> 
                
                Otherwise, drop a note below—messages go straight to my inbox.
            </p>
            
            <ContactForm />
        </div>
    );
};