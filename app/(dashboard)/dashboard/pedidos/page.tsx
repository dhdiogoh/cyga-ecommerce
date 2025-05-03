import { OrdersTable } from "@/components/orders-table"

export default function OrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
      <OrdersTable />
    </div>
  )
}
