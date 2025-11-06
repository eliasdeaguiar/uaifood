import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FoodCard from "@/components/FoodCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-food.jpg";
import { mockItems, mockDishesOfTheDay } from "@/data/mockData";

const today = new Date().getDay();
const todayDish = mockDishesOfTheDay.find(d => d.dayOfWeek === today);
const dishOfTheDay = todayDish ? [mockItems.find(i => i.id === todayDish.itemId)].filter(Boolean) : [];
const popularItems = mockItems.slice(0, 3);

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImg}
              alt="Comida deliciosa"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
          
          <div className="relative container z-10 text-white">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Comida deliciosa na{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  porta da sua casa
                </span>
              </h1>
              <p className="text-xl text-white/90">
                Os melhores pratos da região, preparados com carinho e entregues com rapidez
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" variant="hero" className="text-lg px-8">
                  <Link to="/menu">
                    Ver Cardápio
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/auth">Fazer Pedido</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Dish of the Day Section */}
        {dishOfTheDay.length > 0 && (
          <section className="container py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Prato do Dia
              </h2>
              <p className="text-muted-foreground text-lg">
                Sabor especial selecionado para você hoje
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
              {dishOfTheDay.map((item) => item && (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Items Section */}
        <section className="container py-20 bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mais Pedidos
            </h2>
            <p className="text-muted-foreground text-lg">
              Os favoritos dos nossos clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link to="/menu">
                Ver Todos os Pratos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-20">
          <div className="container text-center space-y-6">
            <h2 className="text-4xl font-bold">
              Pronto para fazer seu pedido?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cadastre-se agora e ganhe 10% de desconto no primeiro pedido!
            </p>
            <Button asChild size="lg" variant="hero" className="text-lg px-8">
              <Link to="/auth">Começar Agora</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
