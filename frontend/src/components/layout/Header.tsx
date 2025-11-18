import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/components/auth/AuthModal";

const Header = () => {
  const { totalItems } = useCart();
  const { user, signOut, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            UaiFood
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/menu" className="text-sm font-medium hover:text-primary transition-colors">
            Cardápio
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 hover:text-primary transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="hero">
                  <User className="h-4 w-4 mr-2" />
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Painel Admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem onClick={() => navigate("/meus-pedidos")}>
                  <Package className="h-4 w-4 mr-2" />
                  Meus Pedidos
                </DropdownMenuItem>

                {/* 2. ADICIONE ESTE ITEM */}
                <DropdownMenuItem onClick={() => navigate("/meus-enderecos")}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Meus Endereços
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" variant="hero" onClick={() => setIsAuthModalOpen(true)}>
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </nav>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Header;
