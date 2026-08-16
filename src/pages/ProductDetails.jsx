import React, { useState, useEffect } from 'react'
import { getProductdetails, removeErrors, createReview, removeSuccess } from '../features/Products/productslice'
import PageTitle from '../coponents/PageTitle'
import Rating from '../coponents/Rating'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../coponents/Loader'
import { addToCart, removeMessage, removeSuccess as removeCartSuccess, removeErrors as removeCartErrors } from '../features/cart/cartSlice'


function ProductDetails() {
    const [userRating, setUserRating] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [reviewText, setReviewText] = useState('')
    const [activeImage, setActiveImage] = useState(0);

    const { loading, error, product, reviewLoading, reviewSuccess } = useSelector((state) => state.product)
    const { loading: cartLoading, error: cartError, success, message, cartItems } = useSelector((state) => state.cart)

    const dispatch = useDispatch()
    const { id } = useParams()
    const navigate = useNavigate()

    const handleAddToCart = () => {
        dispatch(addToCart({ id: product._id, quantity }))
    }

    const handleBuyNow = async () => {
        const result = await dispatch(addToCart({ id: product._id, quantity }))
        if (addToCart.fulfilled.match(result)) {
            navigate('/shipping')
        }
    }

    useEffect(() => {
        if (id) dispatch(getProductdetails(id))
        return () => dispatch(removeErrors())
    }, [dispatch, id])

    useEffect(() => {
        setActiveImage(0)
    }, [product?._id])

    // Cart success message
    useEffect(() => {
        if (success && message) {
            toast.success(message, {
                position: 'top-center', autoClose: 3000,
                closeOnClick: true, pauseOnHover: true, draggable: true,
            })
            dispatch(removeMessage())
            dispatch(removeCartSuccess())
        }
    }, [dispatch, success, message])

    // Product fetch error
    useEffect(() => {
        if (error) {
            toast.error(error.message || error || 'An error occurred', {
                position: 'top-center', autoClose: 3000,
                closeOnClick: true, pauseOnHover: true, draggable: true,
            })
            dispatch(removeErrors())
        }
    }, [dispatch, error])

    // Cart error
    useEffect(() => {
        if (cartError) {
            toast.error(cartError.message || cartError || 'An error occurred', {
                position: 'top-center', autoClose: 3000,
                closeOnClick: true, pauseOnHover: true, draggable: true,
            })
            dispatch(removeCartErrors())
        }
    }, [dispatch, cartError])

    // Review success
    useEffect(() => {
        if (reviewSuccess) {
            toast.success('Thanks! Review submitted successfully', {
                position: 'top-center', autoClose: 3000,
                closeOnClick: true, pauseOnHover: true, draggable: true,
            })
            setUserRating(0)
            setReviewText('')
            dispatch(removeSuccess())
            dispatch(getProductdetails(id))
        }
    }, [dispatch, reviewSuccess, id])

    if (loading || !product) return <Loader />

    // product.image is the array [{public_id, url}, ...] from the schema
    const gallery = Array.isArray(product.image) && product.image.length > 0
        ? product.image
        : (product.images && product.images.length > 0 ? product.images : []);

    const currentImage = gallery[activeImage] || gallery[0];

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => {
            const next = prev + delta;

            if (next > product.stock) {
                toast.warn(`Maximum ${product.stock} item${product.stock > 1 ? 's' : ''} available in stock`, {
                    position: 'top-center', autoClose: 2500,
                });
                return prev;
            }

            if (next < 1) {
                toast.warn('Minimum 1 item required', {
                    position: 'top-center', autoClose: 2500,
                });
                return prev;
            }

            return next;
        });
    }

    const handleReviewSubmit = () => {
        if (!userRating) {
            return toast.warn('Rating is required', { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
        }
        if (!reviewText.trim()) {
            return toast.warn('Review is required', { position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
        }

        dispatch(createReview({
            rating: userRating,
            comment: reviewText.trim(),
            productId: product._id,
        }))
    };

    const discountPercentage =
        product.showOriginalPrice &&
            product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

    const stockStatus = product.stock === 0 ? 'out' : product.stock <= 10 ? 'low' : 'in';

    const stockStyles = {
        out: { dot: 'bg-red-400', text: 'text-red-300', label: 'Out of Stock' },
        low: { dot: 'bg-amber-400', text: 'text-amber-300', label: 'Low Stock' },
        in: { dot: 'bg-[#5FBF88]', text: 'text-[#B7E4C7]', label: 'In Stock' },
    };

    const reviews = product.reviews || [];
    const totalReviews = reviews.length;
    const ratingBuckets = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => Math.round(r.rating) === star).length;
        const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        return { star, count, pct };
    });

    return (
        <>
            <PageTitle title={`${product.name} - Details`} />

            <div className="bg-white min-h-screen mt-30 lg:mt-20 pb-28 lg:pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 lg:pt-14">

                    {/* Breadcrumb */}
                    {/* <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-slate-400 mb-6">
                        <span>Catalogue</span>
                        <span className="opacity-40">/</span>
                        <span className="text-slate-700 font-semibold">{product.name}</span>
                    </div> */}

                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-14 items-start">

                        {/* ── Image Panel ── */}
                        <div className="lg:sticky lg:top-10">
                            <div className="relative bg-white rounded-[28px] border-2 border-emerald-50 w-full max-w-md lg:max-w-lg mx-auto h-[380px] lg:h-[500px] overflow-hidden shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]">

                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white to-white pointer-events-none" />

                                <img
                                    src={currentImage?.url?.replace('./', '/') || ''}
                                    alt={product.name}
                                    className="relative z-10 w-full h-full object-cover"
                                />

                                {stockStatus === 'low' && (
                                    <span className="absolute top-5 left-5 z-20 bg-amber-500 text-white text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full shadow-[0_4px_14px_rgba(245,158,11,0.4)]">
                                        Only {product.stock} left
                                    </span>
                                )}

                                {stockStatus === 'out' && (
                                    <span className="absolute top-5 left-5 z-20 bg-red-500 text-white text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full shadow-[0_4px_14px_rgba(239,68,68,0.4)]">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {gallery.length > 1 && (
                                <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                                    {gallery.map((img, index) => (
                                        <button
                                            key={img.public_id || index}
                                            type="button"
                                            onClick={() => setActiveImage(index)}
                                            className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 bg-white overflow-hidden transition-all duration-300 cursor-pointer ${activeImage === index
                                                ? "border-[#1B4332] shadow-[0_6px_16px_rgba(27,67,50,0.3)] scale-[1.03]"
                                                : "border-emerald-50 hover:border-emerald-200 hover:scale-[1.02]"
                                                }`}
                                        >
                                            <img
                                                src={img.url.replace('./', '/')}
                                                alt={`${product.name} thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="hidden lg:flex items-center gap-4 mt-4 text-slate-400 text-xs">
                                <span className="w-8 h-px bg-slate-200" />
                                <span className="uppercase tracking-[0.15em]">Sourced &amp; verified quality</span>
                            </div>
                        </div>

                        {/* ── Content ── */}
                        <div className="flex flex-col gap-6">

                            <div>
                                <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-slate-900 leading-[1.1] tracking-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-3">
                                    <Rating value={product.ratings} disabled={true} />
                                    <span className="text-sm text-slate-500">
                                        {product.numOfReviews} {product.numOfReviews === 1 ? 'review' : 'reviews'}
                                    </span>
                                </div>
                            </div>

                            {/* ── Purchase Card ── */}
                            <div className="bg-[#1B4332] rounded-[24px] p-6 sm:p-7 text-white shadow-[0_16px_40px_-12px_rgba(27,67,50,0.45)] relative overflow-hidden">

                                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

                                <div className="relative flex items-end justify-between flex-wrap gap-2">
                                    <div className="flex items-baseline gap-3">
                                        <span className="font-serif text-4xl lg:text-5xl text-white ">
                                            Rs. {product.price.toLocaleString()}
                                        </span>
                                        {product.showOriginalPrice && discountPercentage > 0 && (
                                            <span className="bg-[#5FBF88] text-[#0E2A1C] text-[11px] font-bold  px-2.5 py-1 rounded-full">
                                                {discountPercentage}% off
                                            </span>
                                        )}
                                    </div>
                                    <span className={`flex items-center gap-1.5 text-xs font-medium ${stockStyles[stockStatus].text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${stockStyles[stockStatus].dot} ${stockStatus !== 'out' ? 'animate-pulse' : ''}`} />
                                        {stockStyles[stockStatus].label}
                                    </span>
                                </div>

                                {product.showOriginalPrice && discountPercentage > 0 && (
                                    <div className="relative flex items-center gap-3 flex-wrap mt-1.5">
                                        <span className="text-sm text-[#B7E4C7]/70 line-through">
                                            Rs. {product.originalPrice.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-[#5FBF88] font-semibold">
                                            Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {stockStatus === 'low' && (
                                    <p className="relative text-amber-300 text-xs font-medium mt-3">
                                        Only {product.stock} left — order soon
                                    </p>
                                )}

                                <div className="h-px bg-white/10 my-5" />

                                {product.stock > 0 ? (
                                    <>
                                        <div className="relative flex items-center justify-between gap-4">
                                            <span className="text-sm text-[#B7E4C7]">Quantity</span>
                                            <div className="flex items-center border border-white/20 rounded-full overflow-hidden">
                                                <button
                                                    onClick={() => handleQuantityChange(-1)}
                                                    className="w-9 h-9 text-lg hover:bg-white/10 transition cursor-pointer"
                                                >−</button>
                                                <input
                                                    type="text"
                                                    value={quantity}
                                                    readOnly
                                                    className="w-10 h-9 text-center bg-transparent text-sm"
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(1)}
                                                    className="w-9 h-9 text-lg hover:bg-white/10 transition cursor-pointer"
                                                >+</button>
                                            </div>
                                        </div>

                                        <div className="relative flex items-center gap-3 mt-5">
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={cartLoading}
                                                className={`flex-1 py-3 px-5 rounded-full text-sm font-semibold transition-all duration-300 ${cartLoading
                                                    ? "bg-[#5FBF88] text-[#0E2A1C] cursor-wait"
                                                    : "bg-white text-[#1B4332] hover:bg-emerald-50 cursor-pointer"
                                                    }`}
                                            >
                                                {cartLoading ? "Adding to Cart..." : "Add to Cart"}
                                            </button>
                                            <button
                                                onClick={handleBuyNow}
                                                disabled={cartLoading}
                                                className="flex-1 py-3 px-5 flex items-center justify-center rounded-full text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-all cursor-pointer duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {cartLoading ? "Please wait..." : "Buy Now"}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="relative text-sm text-[#B7E4C7]">
                                        This item is currently unavailable. Check back soon.
                                    </p>
                                )}
                            </div>

                            {/* ── Description ── */}
                            <div>
                                <h3 className="font-serif text-lg text-slate-900 mb-2">About this item</h3>
                                <p className="text-slate-600 leading-7 text-[15px]">
                                    {product.description}
                                </p>
                            </div>

                            {/* ── Write a Review ── */}
                            <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.15)]">
                                <h3 className="font-serif text-lg text-slate-900 mb-3">Leave a review</h3>
                                <Rating value={userRating} disabled={false} onRatingChange={setUserRating} className="mb-3" />
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Write your review here..."
                                    className="w-full min-h-[100px] p-3 bg-white border border-slate-200 rounded-xl resize-y text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition"
                                />
                                <button onClick={handleReviewSubmit} disabled={reviewLoading}
                                    className="mt-3 bg-[#1B4332] text-white py-2.5 px-5 rounded-full text-sm font-semibold hover:bg-[#123024] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {reviewLoading ? "Submitting..." : "Submit Review"}
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* ── Reviews ── */}
                    <div className="mt-14 pt-8 border-t border-slate-100">
                        <h3 className="font-serif text-2xl text-slate-900 mb-6">What people are saying</h3>

                        {totalReviews > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-12">

                                {/* Rating summary breakdown */}
                                <div className="md:sticky md:top-10 h-fit bg-white border border-slate-200 rounded-[20px] p-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-serif text-4xl text-slate-900">
                                            {product.ratings?.toFixed ? product.ratings.toFixed(1) : product.ratings}
                                        </span>
                                        <span className="text-slate-400 text-sm">/ 5</span>
                                    </div>
                                    <Rating value={product.ratings} disabled={true} className="mt-1" />
                                    <p className="text-sm text-slate-500 mt-1.5">
                                        Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                                    </p>

                                    <div className="mt-5 flex flex-col gap-2">
                                        {ratingBuckets.map(({ star, count, pct }) => (
                                            <div key={star} className="flex items-center gap-2 text-xs">
                                                <span className="w-8 text-slate-500 font-medium">{star}★</span>
                                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#1B4332] rounded-full transition-all duration-500"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="w-6 text-right text-slate-400">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Review list */}
                                <div className="flex flex-col divide-y divide-slate-100">
                                    {reviews.map((review, index) => (
                                        <div className="py-6 first:pt-0 flex flex-col items-start gap-2" key={index}>
                                            <div className="flex items-center gap-3">
                                                <span className="w-9 h-9 rounded-full bg-[#1B4332] text-white text-sm font-semibold flex items-center justify-center shrink-0">
                                                    {review.name?.charAt(0)?.toUpperCase() || "?"}
                                                </span>
                                                <div>
                                                    <p className="text-slate-900 text-sm font-semibold">{review.name}</p>
                                                    <Rating value={review.rating} disabled={true} />
                                                </div>
                                            </div>
                                            <p className="text-slate-600 leading-6 text-[15px]">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="border border-dashed border-slate-200 rounded-[20px] p-10 text-center">
                                <p className="text-slate-500">No reviews yet — be the first to share your thoughts.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Sticky Mobile Purchase Bar ── */}
            {product.stock > 0 && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B4332] px-4 py-3 flex items-center gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.18)]">
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-[#B7E4C7]/70 truncate">{product.name}</p>
                        <p className="font-serif text-lg text-[#E8C97A] leading-tight">
                            Rs. {product.price.toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={cartLoading}
                        className={`py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${cartLoading
                            ? "bg-[#5FBF88] text-[#0E2A1C] cursor-wait"
                            : "bg-white text-[#1B4332] hover:bg-emerald-50 cursor-pointer"
                            }`}
                    >
                        {cartLoading ? "Adding..." : "Add to Cart"}
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={cartLoading}
                        className="py-2.5 px-4 rounded-full text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-all cursor-pointer duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Buy Now
                    </button>
                </div>
            )}
        </>
    )
}

export default ProductDetails