import { useEffect, useState } from "react";
import axios from "axios";
import { UserDto } from "@/types/dto";

export default function AdminSellersTab() {
  const [pendingSellers, setPendingSellers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<UserDto[]>("/api/admin/users/pending-sellers")
      .then(res => {
        console.log("Pending sellers:", res.data);
        setPendingSellers(res.data);
      })
      .catch((err) => { console.error("API error:", err); })
      .then(() => setLoading(false));
  }, []);

  const handleApprove = (id: number) => {
    axios.post(`/api/admin/users/approve-seller/${id}`)
      .then(() => setPendingSellers(pendingSellers.filter(s => s.id !== id)));
  };

  const handleReject = (id: number) => {
    axios.post(`/api/admin/users/reject-seller/${id}`)
      .then(() => setPendingSellers(pendingSellers.filter(s => s.id !== id)));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pending Seller Applications</h2>
      <div className="space-y-4">
        {pendingSellers.map((seller) => (
          <div key={seller.id} className="flex items-center justify-between bg-[#F7F8FB] p-4 rounded-lg shadow">
            <div>
              <div className="font-semibold">{seller.name}</div>
              <div className="text-sm text-gray-500">{seller.email}</div>
            </div>
            <div>
              <button
                className="px-4 py-2 bg-[#C1CF16] rounded font-bold text-[#1C2834] mr-2"
                onClick={() => handleApprove(seller.id)}
              >
                Approve
              </button>
              <button
                className="px-4 py-2 bg-red-500 rounded font-bold text-white"
                onClick={() => handleReject(seller.id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}