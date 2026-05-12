'use client'

// import React from 'react';
// import { google } from '@ai-sdk/google';

// import { generateText } from "ai";


// async function aiHandler(text) {
//   const { prompt } = await text.json();

//   // Choose a Google Gemini model
//   const model = google("gemini-2.5-flash");

//   const { text } = await generateText({
//     model,
//     prompt,
//     maxOutputTokens: 200,
//   });

//   return text;
// };

export default function page(){
    return (
        <div>
            <h2 className='text-center text-2xl font-semibold font-stretch-90% italic'>AI Tools</h2>

            {/* <p className='text-center text-sm'>Explore various AI-powered tools to enhance your productivity and creativity.</p> */}

            {/* <div className='mt-8 flex flex-wrap gap-6 justify-center'>
                <div className='p-6 border rounded-lg shadow-sm hover:shadow-md transition w-75'>
                    <h3 className='text-xl font-semibold mb-2'>AI Text Generator</h3>       
                    <p>Generate high-quality text content using advanced AI algorithms.</p>
                </div>

                <div className='p-6 border rounded-lg shadow-sm hover:shadow-md transition w-75'>
                    <h3 className='text-xl font-semibold mb-2'>Image Recognition</h3>       
                    <p>Identify and classify objects in images with precision.</p>
                </div>
            </div> */}


        </div>
    );
};