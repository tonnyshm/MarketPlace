'use client'
import React, { useState } from "react";
import axios from "axios";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  total: number;
  userId: number;
  cartItems: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

type PaymentResponse = { status: string; [key: string]: any };

interface ProductResponse {
  id: number;
  name: string;
  stock: number;
  price: number;
}

export default function PaymentModal({
  open,
  onClose,
  onSuccess,
  total,
  userId,
  cartItems,
}: PaymentModalProps) {
  const [method, setMethod] = useState<"card" | "mobile-money">("card");
  const [details, setDetails] = useState({ cardNumber: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      // First check if any items are out of stock
      const stockCheckPromises = cartItems.map(item =>
        axios.get<ProductResponse>(`/api/products/${item.id}`)
      );
      
      const stockCheckResults = await Promise.all(stockCheckPromises);
      const outOfStockItems = stockCheckResults
        .map((res, index) => ({ product: cartItems[index], stock: res.data.stock }))
        .filter(item => item.stock < item.product.quantity);

      if (outOfStockItems.length > 0) {
        const itemNames = outOfStockItems.map(item => item.product.name).join(", ");
        setError(`The following items are out of stock: ${itemNames}`);
        setLoading(false);
        return;
      }

      let paymentRes;
      if (method === "card") {
        paymentRes = await axios.post<PaymentResponse>("/api/payments/card", {
          cardNumber: details.cardNumber,
          amount: total,
        });
      } else {
        paymentRes = await axios.post<PaymentResponse>("/api/payments/mobile-money", {
          phone: details.phone,
          amount: total,
        });
      }
      if (paymentRes.data.status === "SUCCESS") {
        // Place order
        await axios.post(`/api/orders/${userId}`, cartItems.map(item => ({
          product: { id: item.id },
          quantity: item.quantity,
          price: item.price
        })));
        onSuccess();
      } else {
        setError("Payment failed.");
      }
    } catch (e: any) {
      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else if (e.response?.status === 400) {
        setError("Some items are out of stock. Please check your cart.");
      } else {
        setError("Payment or order failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Pay {total.toLocaleString()} Rwf</h2>
        <div className="mb-4">
          <label>
            <input
              type="radio"
              checked={method === "card"}
              onChange={() => setMethod("card")}
            />{" "}
            Card
          </label>
          <label className="ml-4">
            <input
              type="radio"
              checked={method === "mobile-money"}
              onChange={() => setMethod("mobile-money")}
            />{" "}
            Mobile Money
          </label>
        </div>
        {method === "card" ? (
          <input
            className="border p-2 w-full mb-4"
            placeholder="Card Number"
            value={details.cardNumber}
            onChange={e => setDetails(d => ({ ...d, cardNumber: e.target.value }))}
          />
        ) : (
          <input
            className="border p-2 w-full mb-4"
            placeholder="Phone Number"
            value={details.phone}
            onChange={e => setDetails(d => ({ ...d, phone: e.target.value }))}
          />
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex gap-2">
          <button
            className="bg-[#C1CF16] px-6 py-2 rounded font-bold"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay"}
          </button>
          <button className="px-6 py-2 border rounded" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
