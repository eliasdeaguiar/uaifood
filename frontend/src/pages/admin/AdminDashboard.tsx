import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemsManagement from "@/components/admin/ItemsManagement";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import MessagesManagement from "@/components/admin/MessagesManagement";
import DishOfTheDayManagement from "@/components/admin/DishOfTheDayManagement";
import AdminOrderManagement from "@/components/admin/AdminOrderManagement";
import DashboardOverview from "@/components/admin/DashboardOverview";

const AdminDashboard = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-4xl font-bold mb-8 ...">
          Painel Administrativo
        </h1>

        <Tabs defaultValue="overview" className="w-full"> {/* 2. MUDE O 'defaultValue' */}
          {/* 3. ATUALIZE O GRID (de 'grid-cols-4' para 'grid-cols-5') */}
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger> {/* 4. ADICIONE A NOVA ABA */}
            <TabsTrigger value="items">Pratos</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="dishes">Pratos do Dia</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>
          
          <TabsContent value="orders">
            <AdminOrderManagement />
          </TabsContent>

          <TabsContent value="items">
            <ItemsManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesManagement />
          </TabsContent>

          <TabsContent value="dishes">
            <DishOfTheDayManagement />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
