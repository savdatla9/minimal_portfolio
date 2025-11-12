import Link from "next/link";
import Image from "next/image";
import NotIcon from '@/components/assets/404page.png'

export default function NotFound(){
    return(
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <Image src={NotIcon} alt="404 icon" />
            <Link href='/' className="text-xl mt-3 w-[100px] italic border-solid border border-b-4 p-2 text-center rounded-xl">Home</Link>
        </div>
    );
};