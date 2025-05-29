// src/types/dto.ts
export type UserDto = {
    id: number;
    name: string;
    email: string;
    sellerStatus?: "PENDING" | "APPROVED" | "REJECTED" | "NONE";
    role: string;
  };
  export interface StoreDto {
    id: number;
    name: string;
    description: string;
    ownerId: number;
    ownerName: string;
    productCount: number;
    rating?: number;
    reviewCount?: number;
    products?: ProductDto[];
    categories?: CategoryDto[];
  }
  export interface ProductDto {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    description: string;
    categoryId: number;
    storeId: number;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
    stock: number;
  }
  export type OrderItemDto = { id: number; productId: number; quantity: number; price: string; };
  export type OrderDto = { id: number; buyerId: number; items: OrderItemDto[]; totalAmount: string; status: string; createdAt: string; };
  export type CategoryDto = {
    id: number;
    name: string;
    description: string;
  };