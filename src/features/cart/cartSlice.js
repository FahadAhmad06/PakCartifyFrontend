import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

// ! add items to cart (used when adding a NEW item, e.g. from product page)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);

      if (quantity > data.product.stock) {
        return rejectWithValue("Requested quantity exceeds available stock");
      }

      return {
        product: data.product._id,
        name: data.product.name, 
        price: data.product.price,
        image: data.product.image[0]?.url,
        stock: data.product.stock,
        quantity: quantity,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Add to cart failed. Please try again later."
      );
    }
  }
);

const safeParse = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined") return null;
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: safeParse("cartItems") || [],
    loading: false,
    error: null,
    success: false,
    message: null,
    removingId: null,
    shippingInfo: safeParse("shippingInfo") || {},
    appliedCoupon: safeParse("appliedCoupon") || null
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    removeItemFromCart: (state, action) => {
      state.removingId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.product != action.payload)
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      state.removingId = null
    },


    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.product === id);

      if (item) {
        const safeQuantity = Math.max(1, Math.min(quantity, item.stock));
        item.quantity = safeQuantity;
        state.message = `Updated ${item.name} quantity in the cart`;
        state.success = true;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    saveShippingInfo:(state,action)=>{
      state.shippingInfo=action.payload
      localStorage.setItem('shippingInfo',JSON.stringify(state.shippingInfo))
    },
    clearCart:(state)=>{
      state.cartItems=[],
      localStorage.removeItem('cartInfo')
      localStorage.removeItem('shippingInfo')
      localStorage.removeItem('cartItems')

    },
    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
      localStorage.setItem("appliedCoupon", JSON.stringify(state.appliedCoupon));
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      localStorage.removeItem("appliedCoupon");
    }
  },

  extraReducers: (builder) => {
    // add items to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload;

        const existingItem = state.cartItems.find(
          (i) => i.product === item.product
        );

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + item.quantity,
            item.stock
          );
          existingItem.quantity = newQuantity;
          state.message = `Updated ${item.name} quantity in the cart`;
        } else {
          state.cartItems.push(item);
          state.message = `${item.name} added to cart successfully`;
        }

        state.loading = false;
        state.error = null;
        state.success = true;

        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          action.payload ||
          "Add to cart failed. Please try again later.";
      });
  },
});

export const { removeErrors, removeMessage, removeSuccess, removeItemFromCart, updateCartQuantity,saveShippingInfo, applyCoupon, removeCoupon,clearCart } = cartSlice.actions;

export default cartSlice.reducer;