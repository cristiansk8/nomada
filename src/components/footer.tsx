import InstagramFeed from "./InstagramFeed";

export default function Footer() {
    return (
        <footer className="bg-black py-4 text-center text-sm text-white border-t">
            <InstagramFeed/>
            <p>© {new Date().getFullYear()} Todos los derechos reservados</p>
            <p>Desarrollado por <a href="https://deepfc.vercel.app/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">DeepFC</a></p>
        </footer>
    )
}