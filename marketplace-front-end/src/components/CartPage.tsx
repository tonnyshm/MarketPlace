'use client'

import React, { useState } from 'react'
import {
  X,
  Heart,
  Trash2,
  Plus,
  Minus,
  Info,
  DollarSign
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import PaymentModal from './PaymentModal'
import { useAuth } from '@/context/AuthContext'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleOrderSuccess = () => {
    setOrderSuccess(true);
    clearCart();
    setShowPayment(false);
  };

  return (
    <div className="w-[728px] mx-auto border border-[#DBDBDB] bg-white flex flex-col">
      {/* Header */}
      <div className="flex flex-row items-center justify-between px-10 py-5 border-b border-[#DBDBDB]">
        <div className="flex gap-5 items-center">
          <X className="w-4 h-4 text-[#495D69]" />
          <h1 className="font-bold text-[#1C2834] text-lg capitalize">
            My cart ({items.length})
          </h1>
        </div>
        <button className="flex items-center gap-2 border border-[#DBDBDB] rounded-lg px-8 py-2 text-sm font-extrabold text-[#141C24]">
          <Heart className="w-4 h-4 text-[#C1CF16]" />
          Favourite
        </button>
        <button
          className="w-12 h-12 border border-[#DBDBDB] rounded-lg flex items-center justify-center"
          onClick={clearCart}
        >
          <Trash2 className="w-4 h-4 text-[#EE4545]" />
        </button>
      </div>

      {/* Notice */}
      <div className="flex items-center px-10 py-4 bg-[#F4F5F6] gap-5 border-b border-[#DBDBDB]">
        <Info className="w-4 h-4 text-[#495D69]" />
        <p className="text-sm font-medium text-[#495D69]">By proceeding you won't be charged yet</p>
      </div>

      {/* Items Scroll Area */}
      <div className="flex flex-col gap-10 px-10 py-10 max-h-[853px] overflow-y-auto">
        {orderSuccess && (
          <div className="text-center text-green-600 font-bold mb-4">
            Order placed successfully!
          </div>
        )}
        {items.length === 0 ? (
          <div className="text-center text-[#495D69]">Your cart is empty.</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white border border-[#DBDBDB] rounded-2xl p-5"
            >
              <div className="flex items-center gap-10 w-full">
                <span className="text-[#1C2834] font-bold text-base">{item.id}</span>
                <div className="w-20 h-20 bg-[#F7F8FB] rounded-lg flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 w-[148px]">
                  <h3 className="font-bold text-[#1C2834] text-base capitalize">{item.name}</h3>
                  <p className="text-sm font-medium text-[#495D69]">
                    {item.price.toLocaleString()} Rwf
                    {item.oldPrice && (
                      <span className="ml-2 text-xs text-[#DBDBDB] line-through">
                        {item.oldPrice.toLocaleString()} Rwf
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <button
                  className="w-12 h-12 border border-[#DBDBDB] rounded-lg flex items-center justify-center"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4 text-[#0C0D0D]" />
                </button>
                <div className="bg-black/5 rounded-lg px-4 py-3 text-center font-semibold text-sm text-[#1C2834]">
                  {item.quantity}
                </div>
                <button
                  className="w-12 h-12 border border-[#DBDBDB] rounded-lg flex items-center justify-center"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-4 h-4 text-[#0C0D0D]" />
                </button>
              </div>

              <button
                className="w-12 h-12 border border-[#DBDBDB] rounded-lg flex items-center justify-center"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="w-4 h-4 text-[#EE4545]" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer Summary */}
      <div className="flex items-center justify-between border-t border-[#DBDBDB] px-10 py-9">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-light text-[#1C2834]">Total:</p>
          <p className="text-2xl font-black text-[#1C2834]">
            {total.toLocaleString()} Rwf
          </p>
        </div>

        <button
          className="flex items-center gap-2 bg-[#C1CF16] rounded-lg px-8 py-3 text-sm font-extrabold text-[#1C2834]"
          onClick={() => setShowPayment(true)}
          disabled={items.length === 0}
        >
          <DollarSign className="w-4 h-6 text-[#1C2834]" />
          Pay Now
        </button>
      </div>
      {/* Payment Modal */}
      {user && (
        <PaymentModal
          open={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handleOrderSuccess}
          total={total}
          userId={user.id}
          cartItems={items}
        />
      )}
    </div>
  )
}