export default function Footer({name}:{name: string}){
    return(
        <footer className="py-6 opacity-60 text-md text-center">
            © {name}  &nbsp;{new Date().getFullYear()}
        </footer>
    );
};