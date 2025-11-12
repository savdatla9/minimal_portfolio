export default function Footer({name}:{name: string}){
    return(
        <footer className="py-12 opacity-60 text-sm text-center">
            © {name}  &nbsp;{new Date().getFullYear()}
        </footer>
    );
};