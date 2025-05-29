import { useEffect, useState } from "react";
import axios from "axios";
import { OrderDto } from "@/types/dto";

export default function AdminOrdersTab() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<OrderDto[]>("/api/admin/orders")
      .then(res => setOrders(res.data))
      .catch(() => {})
      .then(() => setLoading(false));
  }, []);

  const handleStatusUpdate = (id: number, status: string) => {
    axios.post<OrderDto>(`/api/admin/orders/${id}/status`, { status })
      .then(res => setOrders(orders.map(o => o.id === id ? res.data : o)));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between bg-[#F7F8FB] p-4 rounded-lg shadow">
            <div>
              <div className="font-semibold">Order #{order.id}</div>
              <div className="text-sm text-gray-500">Status: {order.status} - Total: ${order.totalAmount}</div>
            </div>
            <div>
              <button
                className="px-4 py-2 bg-green-600 rounded text-white font-bold mr-2"
                onClick={() => handleStatusUpdate(order.id, "COMPLETED")}
              >
                Mark Completed
              </button>
              <button
                className="px-4 py-2 bg-red-500 rounded text-white font-bold"
                onClick={() => handleStatusUpdate(order.id, "CANCELLED")}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}