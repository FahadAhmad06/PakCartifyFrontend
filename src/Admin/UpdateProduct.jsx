import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImagePlus, X } from "lucide-react";

import PageTitle from "../coponents/PageTitle";

import {
    getAdminProductDetails,
    updateProduct,
    removeErrors,
    removeSuccess
} from "../features/Admin/AdminSlice";

function UpdateProduct() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();

    const { product, loading, error, success } = useSelector((state) => state.admin);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [showOriginalPrice, setShowOriginalPrice] = useState(false);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [stock, setStock] = useState("");

    const [image, setImage] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);

    const fileInputRef = useRef(null);

    // Fetch Product
    useEffect(() => {
        dispatch(getAdminProductDetails(id));

        return () => {
            dispatch(removeErrors());
        };
    }, [dispatch, id]);

    // Fill Product Data
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setOriginalPrice(product.originalPrice || "");
            setShowOriginalPrice(product.showOriginalPrice);
            setDescription(product.description);
            setCategory(product.category);
            setSubcategory(product.subcategory);
            setStock(product.stock);

            setImagePreview(product.image?.map((img) => img.url) || []);
        }
    }, [product]);

    // Toast
    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-center"
            });

            dispatch(removeErrors());
        }

        if (success) {
            toast.success("Product Updated Successfully", {
                position: "top-center"
            });

            dispatch(removeSuccess());

            navigate("/admin/products");
        }
    }, [error, success, dispatch, navigate]);

    // Image Change
    const updateProductImage = (e) => {
        const files = Array.from(e.target.files);

        setImage([]);
        setImagePreview([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview((old) => [...old, reader.result]);
                    setImage((old) => [...old, file]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    // Open file picker via the Select Images button
    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    // Remove single image
    const removeImage = (index) => {
        setImage((old) => old.filter((_, i) => i !== index));
        setImagePreview((old) => old.filter((_, i) => i !== index));
    };

    // Submit Update
    const updateProductSubmit = (e) => {
        e.preventDefault();

        const productData = new FormData();

        productData.set("name", name);
        productData.set("price", price);
        productData.set("originalPrice", showOriginalPrice ? originalPrice : null);
        productData.set("showOriginalPrice", showOriginalPrice);
        productData.set("description", description);
        productData.set("category", category);
        productData.set("subcategory", subcategory);
        productData.set("stock", stock);

        image.forEach((img) => {
            productData.append("image", img);
        });

        dispatch(
            updateProduct({
                id,
                productData
            })
        );
    };

    if (!product) {
        return <div className="text-center mt-40 text-xl">Loading Product...</div>;
    }

    return (
        <>
            <PageTitle title="Update Product" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-white py-10 px-4 pt-15 mt-20">
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
                    <div className="bg-gradient-to-r from-emerald-700 to-green-600 p-8">
                        <h1 className="text-3xl font-bold text-white">Update Product</h1>
                    </div>

                    <form onSubmit={updateProductSubmit} className="p-8 space-y-7">
                        <div>
                            <label className="font-semibold">Product Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mt-2 border rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-200"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="font-semibold">Price</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full mt-2 border rounded-xl px-4 py-3"
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Original Price</label>
                                <input
                                    type="number"
                                    disabled={!showOriginalPrice}
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                    className="w-full mt-2 border rounded-xl px-4 py-3 disabled:bg-gray-100"
                                />

                                <label className="flex gap-2 mt-3">
                                    <input
                                        type="checkbox"
                                        checked={showOriginalPrice}
                                        onChange={(e) => setShowOriginalPrice(e.target.checked)}
                                    />
                                    Show Discount
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="font-semibold">Description</label>
                            <textarea
                                rows="5"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full mt-2 border rounded-xl px-4 py-3"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="font-semibold">Category</label>
                                <input
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full mt-2 border rounded-xl px-4 py-3"
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Sub Category</label>
                                <input
                                    value={subcategory}
                                    onChange={(e) => setSubcategory(e.target.value)}
                                    className="w-full mt-2 border rounded-xl px-4 py-3"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="font-semibold">Stock</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full mt-2 border rounded-xl px-4 py-3"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="font-semibold">Product Images</label>

                                <button
                                    type="button"
                                    onClick={openFilePicker}
                                    className="flex items-center gap-1.5 bg-white border-2 border-emerald-500 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-500 hover:text-white transition shadow-sm"
                                >
                                    <ImagePlus size={14} />
                                    Select Images
                                </button>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={updateProductImage}
                                hidden
                            />

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                                {imagePreview.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={img}
                                            className="h-32 w-full object-cover rounded-xl shadow border"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Product"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UpdateProduct;