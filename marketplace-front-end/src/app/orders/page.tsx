"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  productId: number;
  userId: number;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<{ [key: number]: boolean }>({});
  const [reviewData, setReviewData] = useState<{ [key: number]: { rating: number; comment: string } }>({});
  const [existingReviews, setExistingReviews] = useState<{ [key: number]: Review }>({});
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await axios.get<Order[]>(`/api/orders/history/${user.id}`);
        setOrders(res.data);
        console.log("Fetched orders:", res.data);
        // For each product in orders, fetch existing review
        const allProductIds = res.data.flatMap(order => order.items.map(item => item.product.id));
        const uniqueProductIds = Array.from(new Set(allProductIds));
        const reviews: { [key: number]: Review } = {};
        await Promise.all(
          uniqueProductIds.map(async (pid) => {
            const r = await axios.get<Review[]>(`/api/reviews/product/${pid}`);
            const userReview = r.data.find(rv => rv && rv.userId === user.id);
            if (userReview) reviews[pid] = userReview;
          })
        );
        setExistingReviews(reviews);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleReviewClick = (productId: number) => {
    setReviewing((prev) => ({ ...prev, [productId]: true }));
    setReviewData((prev) => ({
      ...prev,
      [productId]: { rating: 5, comment: "" },
    }));
  };

  const handleReviewChange = (productId: number, field: "rating" | "comment", value: any) => {
    setReviewData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleSubmitReview = async (productId: number) => {
    if (!user) return;
    try {
      await axios.post(`/api/reviews/${user.id}/${productId}`, {
        rating: reviewData[productId].rating,
        comment: reviewData[productId].comment,
      });
      setSuccessMsg("Review submitted!");
      setReviewing((prev) => ({ ...prev, [productId]: false }));
      setExistingReviews((prev) => ({
        ...prev,
        [productId]: {
          id: 0,
          rating: reviewData[productId].rating,
          comment: reviewData[productId].comment,
          productId,
          userId: user.id,
        },
      }));
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (e) {
      setSuccessMsg("Failed to submit review.");
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff]">
      <Navbar />
      <main className="flex-1 w-full max-w-[900px] mx-auto px-4 pt-8 pb-0 flex flex-col">
        <h1 className="text-2xl font-bold text-[#1C2834] mb-6">My Orders</h1>
        {loading ? (
          <div className="text-center text-[#495D69]">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-[#495D69]">You have no orders yet.</div>
        ) : (
          <div className="flex flex-col gap-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-[#DBDBDB] rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-[#1C2834]">Order #{order.id}</span>
                  <span className="text-sm text-[#495D69]">Status: {order.status}</span>
                </div>
                <div className="text-sm text-[#495D69] mb-4">Placed: {new Date(order.createdAt).toLocaleString()}</div>
                <div className="flex flex-col gap-4">
                  {console.log("Order items:", order.items)}
                  {order.items.map((item) => {
                    console.log("Item product:", item.product);
                    return !item.product ? null : (
                      <div key={item.id} className="flex items-center gap-4 border-b border-[#F7F8FB] pb-4">
                        <div className="flex-1 flex flex-col">
                          <span className="font-bold text-[#1C2834]">{item.product.name}</span>
                          <span className="text-[#C1CF16] font-bold">{item.price.toLocaleString()} Rwf</span>
                          <span className="text-xs text-[#495D69]">Qty: {item.quantity}</span>
                          {/* Review Section */}
                          <div className="mt-2">
                            {existingReviews[item.product.id] ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[#495D69] text-sm">Your Review:</span>
                                <span className="flex items-center">
                                  {[1,2,3,4,5].map((n) => (
                                    <Star
                                      key={n}
                                      className={`w-4 h-4 ${n <= existingReviews[item.product.id].rating ? "text-[#C1CF16]" : "text-[#DBDBDB]"}`}
                                      fill={n <= existingReviews[item.product.id].rating ? "#C1CF16" : "none"}
                                    />
                                  ))}
                                </span>
                                <span className="text-xs text-[#495D69] ml-2">{existingReviews[item.product.id].comment}</span>
                              </div>
                            ) : reviewing[item.product.id] ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  {[1,2,3,4,5].map((n) => (
                                    <button
                                      key={n}
                                      type="button"
                                      onClick={() => handleReviewChange(item.product.id, "rating", n)}
                                    >
                                      <Star
                                        className={`w-5 h-5 ${n <= reviewData[item.product.id]?.rating ? "text-[#C1CF16]" : "text-[#DBDBDB]"}`}
                                        fill={n <= reviewData[item.product.id]?.rating ? "#C1CF16" : "none"}
                                      />
                                    </button>
                                  ))}
                                </div>
                                <textarea
                                  className="border border-[#DBDBDB] rounded-lg px-3 py-2 text-[#1C2834] bg-[#F7F8FB] focus:outline-none focus:ring-2 focus:ring-[#C1CF16]"
                                  placeholder="Leave a comment (optional)"
                                  value={reviewData[item.product.id]?.comment || ""}
                                  onChange={e => handleReviewChange(item.product.id, "comment", e.target.value)}
                                  maxLength={1000}
                                />
                                <div className="flex gap-2">
                                  <button
                                    className="px-4 py-2 bg-[#C1CF16] rounded-lg font-bold text-[#1C2834] hover:bg-[#b0b800] transition-colors"
                                    onClick={() => handleSubmitReview(item.product.id)}
                                  >
                                    Submit
                                  </button>
                                  <button
                                    className="px-4 py-2 border border-[#DBDBDB] rounded-lg font-semibold text-[#1C2834] bg-white hover:bg-[#F7F8FB]"
                                    onClick={() => setReviewing((prev) => ({ ...prev, [item.product.id]: false }))}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                className="px-4 py-2 border border-[#DBDBDB] rounded-lg font-semibold text-[#1C2834] bg-white hover:bg-[#F7F8FB] mt-2"
                                onClick={() => handleReviewClick(item.product.id)}
                              >
                                Rate & Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end mt-4">
                  <span className="font-bold text-[#1C2834]">Total: {order.totalAmount.toLocaleString()} Rwf</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {successMsg && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#C1CF16] text-[#1C2834] px-6 py-3 rounded-lg shadow-lg font-bold z-50">
            {successMsg}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
