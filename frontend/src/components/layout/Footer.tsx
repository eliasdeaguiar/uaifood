import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-secondary/5 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                UaiFood
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Comida deliciosa na porta da sua casa
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link to="/fale-conosco" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contato@uaifood.com.br</li>
              <li>(31) 99999-9999</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Redes Sociais</h3>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2025 UaiFood. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
