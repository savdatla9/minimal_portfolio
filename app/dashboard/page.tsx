'use client'

import React from 'react';
import axios from 'axios';
import { MailCheck } from 'lucide-react';
import {
  Table, TableBody, TableCaption,
  TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";

export default function Dashboard(){
    const [mesArr, setMArr] = React.useState<any[]>([]);
    const [load, setLoad] = React.useState<boolean>(false);

    const handleDate = (time: any) => {
        const fireBaseTime = new Date(
            time.seconds * 1000 + time.nanoseconds / 1000000,
        );
        
        return fireBaseTime.toDateString();
    };

    const handleClose = async(message: any) => {
        if(message){
            const isDone = true;

            const ref = doc(db, "messages", message.id);
            const snap = await getDoc(ref);

            if(!snap.exists()) {
                return alert('Data not Found');
            };

            // console.log(ref, snap);

            await updateDoc(ref, { isDone });

            setLoad(true);

            axios.get('/api/contact')
            .then((res) => { 
                setLoad(false);
                setMArr(res.data.messages.filter((it: any) => it.isDone!==true));
            })
            .catch((err) => console.log(err));
            // console.log('response', res);
        };
    };

    React.useEffect(() => {
        setLoad(true);

        axios.get('/api/contact')
        .then((res) => { 
            setLoad(false);
            setMArr(res.data.messages.filter((it: any) => it.isDone!==true));
        })
        .catch((err) => console.log(err));
    }, []);

    return(
        <div>
            <h2 className='text-center font-semibold text-2xl uppercase'>dashboard</h2>

            <div className='mt-1'>
                <Table className='w-full'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-start p-2 border'>Name</TableHead>
                            <TableHead className='text-start p-2 border'>Email</TableHead>
                            <TableHead className='text-start p-2 border'>Message</TableHead>
                            <TableHead className='text-start p-2 border'>Created At</TableHead>
                            <TableHead className='text-start p-2 border'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {(load===false&&mesArr.length>0) ? mesArr.map((message) => <TableRow key={message.id} className='border'>
                            <TableCell className='p-2'>{message.name}</TableCell>
                            <TableCell className='p-2'>{message.email}</TableCell>
                            <TableCell className='p-2'>{message.message}</TableCell>
                            <TableCell className='p-2'>{handleDate(message.createdAt)}</TableCell>
                            <TableCell className='p-2'>
                                <div key={message.id} onClick={() => handleClose(message)}>
                                    <MailCheck />
                                </div>
                            </TableCell>
                        </TableRow>) : load===true ? <TableRow className='border'>
                            <TableCell colSpan={12} className='p-2 text-center'>...Mails Receiving...</TableCell>    
                        </TableRow> : <TableRow className='border'>
                            <TableCell colSpan={12} className='p-2 text-center'>...No New Mails...</TableCell>    
                        </TableRow>}
                    </TableBody>

                    <TableCaption className='text-2xl font-semibold mb-2 underline p-1 text-left'> List of Mails </TableCaption>
                </Table>
            </div>
        </div>
    );
};