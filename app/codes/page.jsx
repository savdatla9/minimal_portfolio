"use client"

import { useState } from "react";
import { useTheme } from "next-themes";
import { Sandpack } from "@codesandbox/sandpack-react";
import { freeCodeCampDark, githubLight } from "@codesandbox/sandpack-themes";

const CodeBase = () => {
    const files = {};
    const { theme } = useTheme();
    const [types, setTypes] = useState('vite-react');

    let arr = [
        { name: 'Vanilla Js', value: 'vanilla' },
        { name: 'React', value: 'vite-react' }, 
        { name: 'Vue Js', value: 'vue' }, { name: 'Angular', value: 'angular' },
        { name: 'Node Js', value: 'node' }, { name: 'Next Js', value: 'nextjs' },
        { name: 'React TypeScript', value: 'vite-react-ts' },
    ];

    return (
        <div>
            <h3 className="text-center font-semibold text-[28px] mb-2">CodeBase&nbsp;&nbsp;👨‍💻</h3>

            <div className="flex flex-wrap justify-center gap-6 mb-4">
                {arr.map((itm, idx) => <div 
                    key={idx} onClick={() => setTypes(itm.value)}
                    className={types==itm.value ? "border border-b-3 text-amber-400 dark:text-sky-400 font-bold rounded-xl p-3" : "border border-b-3 rounded-xl p-3"}
                >{itm.name}</div>)}
            </div>

            <div className="border-2 border-b-5 rounded-[10px] p-1">
                <Sandpack
                    files={files}
                    theme={theme==='light' ? githubLight : freeCodeCampDark}
                    template={types}
                    options={{
                        editorHeight: "50vh",
                        showConsole: true,
                        showConsoleButton: true,
                        showInlineErrors: true,
                        showNavigator: true,
                        showLineNumbers: true,
                        showTabs: true,
                    }}                
                />
            </div>
        </div>
    );
};

export default CodeBase;