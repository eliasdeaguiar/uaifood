import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingBag, CreditCard, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const DashboardOverview = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- CÁLCULOS ESTRATÉGICOS ---

  // 1. Calcular totais
  const calculateOrderTotal = (order: Order) => {
    return order.items?.reduce((sum, item) => {
      return sum + (item.item?.unitPrice || 0) * item.quantity;
    }, 0) || 0;
  };

  const validOrders = orders.filter(o => o.status !== 'CANCELLED');
  const totalRevenue = validOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);
  const totalOrdersCount = validOrders.length;
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // 2. Preparar dados para o Gráfico de Status
  const statusData = [
    { name: 'Pendentes', value: orders.filter(o => o.status === 'PENDING').length, color: '#EAB308' }, // Amarelo
    { name: 'Em Preparo/Entrega', value: orders.filter(o => ['CONFIRMED', 'DELIVERING'].includes(o.status)).length, color: '#3B82F6' }, // Azul
    { name: 'Entregues', value: orders.filter(o => o.status === 'DELIVERED').length, color: '#22C55E' }, // Verde
    { name: 'Cancelados', value: orders.filter(o => o.status === 'CANCELLED').length, color: '#EF4444' }, // Vermelho
  ];

  // 3. Preparar dados para o Gráfico de Pagamento (Receita por método)
  const paymentDataRaw = validOrders.reduce((acc, order) => {
    const total = calculateOrderTotal(order);
    acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + total;
    return acc;
  }, {} as Record<string, number>);

  const paymentData = Object.entries(paymentDataRaw).map(([key, value]) => ({
    name: key,
    value: value
  }));

  if (isLoading) {
    return <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-32"/><Skeleton className="h-32"/><Skeleton className="h-32"/></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* CARDS DE MÉTRICAS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total de pedidos válidos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrdersCount}</div>
            <p className="text-xs text-muted-foreground">Pedidos realizados (exceto cancelados)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageTicket.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Média de valor por pedido</p>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICOS */}
      <div className="grid gap-4 md:grid-cols-2">
        
        {/* Gráfico de Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pedidos por Status</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Pagamento */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Receita por Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    width={100}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Receita']}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default DashboardOverview;