import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import PageTitle from '../coponents/PageTitle'
import { createProduct, removeErrors, removeSuccess } from '../features/Admin/AdminSlice'
import {
    CloudUpload,
    Dashboard,
    AddBox,
    Inventory,
    People,
    Star,
    ShoppingCart,
} from '@mui/icons-material'
import { X, ChevronRight } from 'lucide-react'

const categoriesData = [
    {
        name: "Electronics",
        subCategories: [
            "Mobiles & Tablets",
            "Computers & Laptops",
            "Cameras",
            "Gaming",
            "Smart Watches",
            "Headphones",
            "Speakers",
            "Accessories",
        ],
    },
    {
        name: "Fashion",
        subCategories: [
            "Men's Fashion",
            "Women's Fashion",
            "Shoes",
            "Bags & Luggage",
            "Jewelry & Watches",
        ],
    },
    {
        name: "Kids & Baby",
        subCategories: ["Baby Clothing", "Baby Toys", "Diapers", "Baby Care"],
    },
    {
        name: "Beauty & Personal Care",
        subCategories: ["Skincare", "Makeup", "Hair Care", "Perfumes"],
    },
    {
        name: "Health & Wellness",
        subCategories: ["Vitamins", "Medicines", "Fitness Equipment", "Health Devices"],
    },
    {
        name: "Home & Kitchen",
        subCategories: ["Kitchen Appliances", "Cookware", "Storage", "Dining"],
    },
    {
        name: "Home Decor",
        subCategories: ["Wall Art", "Lighting", "Curtains", "Decor Items"],
    },
    {
        name: "Furniture",
        subCategories: ["Sofas", "Beds", "Tables", "Office Furniture"],
    },
    {
        name: "Grocery",
        subCategories: ["Rice", "Oil", "Snacks", "Beverages"],
    },
    {
        name: "Sports & Outdoors",
        subCategories: ["Cricket", "Football", "Gym Equipment", "Camping"],
    },
    {
        name: "Automotive",
        subCategories: ["Car Accessories", "Bike Accessories", "Tyres", "Engine Oil"],
    },
    {
        name: "Books & Stationery",
        subCategories: ["Books", "Notebooks", "Pens", "School Supplies"],
    },
    {
        name: "Office Supplies",
        subCategories: ["Office Chairs", "Desks", "Printers", "Office Accessories"],
    },
    {
        name: "Toys & Games",
        subCategories: ["Educational Toys", "Board Games", "Remote Control Toys", "Soft Toys"],
    },
    {
        name: "Pet Supplies",
        subCategories: ["Dog Food", "Cat Food", "Pet Toys", "Pet Accessories"],
    },
    {
        name: "Tools & Hardware",
        subCategories: ["Power Tools", "Hand Tools", "Safety Equipment", "Tool Kits"],
    },
    {
        name: "Garden & Outdoor",
        subCategories: ["Plants", "Pots", "Garden Tools", "Outdoor Furniture"],
    },
    {
        name: "Musical Instruments",
        subCategories: ["Guitars", "Keyboards", "Drums", "Microphones"],
    },
    {
        name: "Gift Items",
        subCategories: ["Gift Boxes", "Flowers", "Greeting Cards", "Personalized Gifts"],
    },
];

const navSections = [
    {
        title: 'Products',
        links: [
            { to: '/admin/products', label: 'All Products', icon: Inventory },
            { to: '/admin/product/create', label: 'Create Products', icon: AddBox },
        ],
    },
    { title: 'User', links: [{ to: '/admin/user', label: 'All Users', icon: People }] },
    { title: 'Orders', links: [{ to: '/admin/orders', label: 'All Orders', icon: ShoppingCart }] },
    { title: 'Reviews', links: [{ to: '/admin/reviews', label: 'All Reviews', icon: Star }] },
]

function CreateProduct() {
    const { success, loading, error } = useSelector((state) => state.admin)
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [originalPrice, setOriginalPrice] = useState("")
    const [showOriginalPrice, setShowOriginalPrice] = useState(false)
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [subCategory, setSubCategory] = useState("")
    const [stock, setStock] = useState("")
    const [image, setImage] = useState([])
    const [imagePreview, setImagePreview] = useState([])

    const availableSubCategories =
        categoriesData.find((item) => item.name === category)?.subCategories || []

    const resetForm = () => {
        setName("")
        setPrice("")
        setOriginalPrice("")
        setShowOriginalPrice(false)
        setDescription("")
        setCategory("")
        setSubCategory("")
        setStock("")
        setImage([])
        setImagePreview([])
    }

    const createProductSubmit = (e) => {
        e.preventDefault()

        const myForm = new FormData()
        myForm.set('name', name)
        myForm.set('price', price)
        if (showOriginalPrice && originalPrice) {
            myForm.set('originalPrice', originalPrice)
        }
        myForm.set('showOriginalPrice', showOriginalPrice)
        myForm.set('description', description)
        myForm.set('category', category)
        myForm.set('subcategory', subCategory)
        myForm.set('stock', stock)
        image.forEach((img) => {
            myForm.append('image', img)
        })

        dispatch(createProduct(myForm))
    }

    const createProductImage = (e) => {
        const files = Array.from(e.target.files)

        setImage([])
        setImagePreview([])

        files.forEach((file) => {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview((old) => [...old, reader.result])
                    setImage((old) => [...old, file])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index) => {
        setImage((old) => old.filter((_, i) => i !== index))
        setImagePreview((old) => old.filter((_, i) => i !== index))
    }

    useEffect(() => {
        if (error) {
            toast.error(error.message || 'An error occurred while creating products', {
                position: 'top-center',
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
            })
            dispatch(removeErrors())
        }

        if (success) {
            toast.success(success.message || 'Product created successfully', {
                position: 'top-center',
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            dispatch(removeSuccess())
            resetForm()
        }
    }, [dispatch, error, success])

    return (
        <>
            <PageTitle title="Create Product" />

            <div className="min-h-screen bg-slate-100 mt-15 pt-15">
                {/* Top banner */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 mx-4 sm:mx-6 mt-6 rounded-2xl px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-white/40 flex items-center justify-center text-white font-semibold text-lg">
                            PC
                        </div>
                        <div className="text-white">
                            <p className="font-semibold text-lg leading-tight">Create Product</p>
                            <p className="text-emerald-100 text-sm">Add new products to your PakCartify Store</p>
                        </div>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
                        <CloudUpload className="text-white" />
                    </div>
                </div>

                <div className="flex gap-6 px-4 sm:px-6 py-6">
                    {/* Sidebar */}
                    <aside className="w-64 shrink-0 hidden lg:block self-start sticky top-35 max-h-[calc(100vh-3rem)] overflow-y-auto">
                        <div className="bg-emerald-800 rounded-xl px-5 py-4 mb-3">
                            <p className="text-white font-semibold">Admin Panel</p>
                            <p className="text-emerald-200 text-xs mt-0.5">Manage everything from here</p>
                        </div>
                        <nav className="bg-white rounded-xl p-3 space-y-4">
                            <Link
                                to="/admin/dashboard"
                                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-800 transition-colors"
                            >
                                <span className="flex items-center gap-3">
                                    <Dashboard fontSize="small" className="text-slate-400" />
                                    Dashboard
                                </span>
                                <ChevronRight size={16} className="text-slate-300" />
                            </Link>
                            {navSections.map((section) => (
                                <div key={section.title}>
                                    <h3 className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        {section.title}
                                    </h3>
                                    {section.links.map(({ to, label, icon: Icon }) => {
                                        const isActive = to === '/admin/product/create'
                                        return (
                                            <Link
                                                key={to}
                                                to={to}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? 'bg-emerald-50 text-emerald-800'
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-800'
                                                }`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <Icon fontSize="small" className={isActive ? '' : 'text-slate-400'} />
                                                    {label}
                                                </span>
                                                <ChevronRight size={16} className="text-slate-300" />
                                            </Link>
                                        )
                                    })}
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">
                        <form
                            onSubmit={createProductSubmit}
                            encType="multipart/form-data"
                            className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
                        >
                            {/* Title */}
                            <div className="bg-emerald-800 px-8 py-5">
                                <h2 className="text-white text-xl font-semibold">Product Information</h2>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Product Name */}
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter product name..."
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                    />
                                </div>

                                {/* Price */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                                            Price (Rs.)
                                        </label>

                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={price}
                                            name="price"
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Enter Price"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Original Price
                                            </label>

                                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={showOriginalPrice}
                                                    onChange={(e) => setShowOriginalPrice(e.target.checked)}
                                                    className="accent-emerald-600"
                                                />
                                                Show Discount
                                            </label>
                                        </div>

                                        <input
                                            type="number"
                                            min="0"
                                            disabled={!showOriginalPrice}
                                            value={originalPrice}
                                            name="originalPrice"
                                            onChange={(e) => setOriginalPrice(e.target.value)}
                                            placeholder="Original Price"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                        />
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <h2 className="text-xl font-bold text-emerald-700 mb-6">Product Description</h2>

                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                                            Description
                                        </label>

                                        <textarea
                                            rows={5}
                                            required
                                            maxLength={200}
                                            name="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Write product description..."
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 resize-none focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                        />

                                        <div className="flex justify-end mt-2">
                                            <span className="text-sm text-slate-500">
                                                {description.length}/200
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Section */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <h2 className="text-xl font-bold text-emerald-700 mb-6">Category Details</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Category */}
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-slate-700">
                                                Category
                                            </label>

                                            <select
                                                required
                                                value={category}
                                                name="category"
                                                onChange={(e) => {
                                                    setCategory(e.target.value)
                                                    setSubCategory("")
                                                }}
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                            >
                                                <option value="">Select Category</option>

                                                {categoriesData.map((item) => (
                                                    <option key={item.name} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Sub Category */}
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-slate-700">
                                                Sub Category
                                            </label>

                                            <select
                                                required
                                                disabled={!category}
                                                value={subCategory}
                                                name="subcategory"
                                                onChange={(e) => setSubCategory(e.target.value)}
                                                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                            >
                                                <option value="">
                                                    {category ? "Select Sub Category" : "Select Category First"}
                                                </option>

                                                {availableSubCategories.map((item) => (
                                                    <option key={item} value={item}>
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Inventory */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <h2 className="text-xl font-bold text-emerald-700 mb-6">Inventory</h2>

                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                                            Stock Quantity
                                        </label>

                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={stock}
                                            name="stock"
                                            onChange={(e) => setStock(e.target.value)}
                                            placeholder="Enter Stock Quantity"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-600 hover:border-emerald-400"
                                        />
                                    </div>
                                </div>

                                {/* Product Images */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <h2 className="text-xl font-bold text-emerald-700 mb-6">Product Images</h2>

                                    <label
                                        htmlFor="product-images"
                                        className="group flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-2xl p-10 cursor-pointer bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-500 transition-all duration-300"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 flex items-center justify-center shadow-xl mb-5 group-hover:scale-110 transition">
                                            <CloudUpload sx={{ fontSize: 40 }} className="text-white" />
                                        </div>

                                        <h3 className="text-lg font-semibold text-slate-700">Upload Product Images</h3>

                                        <p className="text-sm text-slate-500 mt-2 text-center">
                                            Click here or drag & drop your product images.
                                        </p>

                                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG</p>

                                        <input
                                            type="file"
                                            id="product-images"
                                            hidden
                                            multiple
                                            accept="image/*"
                                            name="image"
                                            onChange={createProductImage}
                                        />
                                    </label>

                                    {/* Preview */}
                                    {imagePreview.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-8">
                                            {imagePreview.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group rounded-2xl overflow-hidden shadow-lg border border-emerald-200 bg-white"
                                                >
                                                    <img
                                                        src={img}
                                                        alt=""
                                                        className="w-full h-40 object-cover group-hover:scale-110 transition duration-300"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="border-t border-emerald-100 pt-8">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 py-4 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition cursor-pointer"
                                        >
                                            Reset Form
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-green-700 hover:to-emerald-800 shadow-xl shadow-emerald-300/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {loading ? "Creating Product..." : "Create Product"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </>
    )
}

export default CreateProduct