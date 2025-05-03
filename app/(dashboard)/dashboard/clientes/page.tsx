import { CustomersTable } from "@/components/customers-table"

export default function CustomersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
      <CustomersTable />
    </div>
  )
}
