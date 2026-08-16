import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../features/favorite/favoriteSlice'
import { addToCart, removeMessage, removeSuccess as removeCartSuccess } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'

function Products({ product }) {

    const [rating, setRatting] = useState(0);
    const dispatch = useDispatch();
    const { favorites } = useSelector((state) => state.favorite);
    const { isAuthenticated } = useSelector((state) => state.user);

    const isFavorited = favorites?.some(
        (fav) => fav._id === product._id || fav === product._id
    );

    const handleRatingChange = (newRating) => {
        setRatting(rating)
        console.log(`Rating changed to ${newRating}`);
    }

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
             toast.warning('Please login to add to wishlist!', {
                position: 'top-center',
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        dispatch(toggleFavorite(product._id));

        if (isFavorited) {
            toast.info(`"${product.name}" removed from wishlist`, {
                position: 'top-center',
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            toast.success(`"${product.name}" added to wishlist! ❤️`, {
                position: 'top-center',
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock === 0) {
            toast.error('Product is out of stock!',{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
            return;
        }

        dispatch(addToCart({ id: product._id, quantity: 1 }))
            .unwrap()
            .then(() => {
                toast.success(`${product.name} added to cart!`,{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
                // Clear Redux success/message so ProductDetails doesn't re-fire the toast
                dispatch(removeMessage());
                dispatch(removeCartSuccess());
            })
            .catch((err) => toast.error(err || 'Failed to add to cart',{ position: 'top-center', autoClose: 3000, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined }));
    }

    const discountPercentage =
        product.showOriginalPrice &&
            product.originalPrice > product.price
            ? Math.round(
                ((product.originalPrice - product.price) /
                    product.originalPrice) *
                100
            )
            : 0;

    return (
        <Link to={`/product/${product._id}`} className='no-underline text-inherit '>
            <div className="w-full text-[#1F2937] rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.12)] text-center transition-all duration-300 flex flex-col border border-gray-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.2)] relative">

                {product.showOriginalPrice && discountPercentage > 0 && (
                    <div className="absolute top-0 left-3 sm:left-4 z-20">
                        <div className="relative bg-[#0E5D33] text-white w-12 h-16 sm:w-16 sm:h-20 flex flex-col items-center justify-center shadow-lg rounded-b-md">

                            <span className="text-base sm:text-xl font-bold leading-none">
                                -{discountPercentage}%
                            </span>

                            <span className="text-[8px] sm:text-[10px] tracking-widest uppercase">
                                OFF
                            </span>

                            <div className="absolute -bottom-[10px] left-0 w-0 h-0 border-l-[24px] sm:border-l-[32px] border-r-[24px] sm:border-r-[32px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#0E5D33]"></div>

                        </div>
                    </div>
                )}

                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-10 cursor-pointer"
                >
                    {isFavorited ? (
                        <FavoriteIcon className="text-red-600 " fontSize="small" />
                    ) : (
                        <FavoriteBorderIcon className="text-gray-500 hover:text-red-500" fontSize="small" />
                    )}
                </button>

                <div className="w-full h-[160px] sm:h-[190px] md:h-[220px] flex items-center justify-center p-2 sm:p-3">
                    <img
                        src={product.image[0]?.url}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain rounded-tl-lg rounded-tr-lg"
                    />
                </div>
                <div className="p-[0.75rem] sm:p-[1rem] ">
                    <h3 className="font-[1rem] sm:font-[1.2rem] font-bold mb-[0.5rem] text-black">
                        {product.name}
                    </h3>
                    <div className="mt-2 flex flex-col items-start h-[80px] sm:h-[90px]">

                        {/* Fixed space for original price & savings */}
                        <div className="h-[30px] sm:h-[34px] flex items-center">

                            {product.showOriginalPrice && discountPercentage > 0 ? (

                                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

                                    <span className="text-sm sm:text-lg text-gray-400 line-through">
                                        Rs. {product.originalPrice.toLocaleString()}
                                    </span>

                                    <span className="bg-green-100 text-[#0E5D33] text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                                        You Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                                    </span>

                                </div>

                            ) : (

                                <div className="h-[30px] sm:h-[34px]"></div>

                            )}

                        </div>

                        {/* Current Price */}
                        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E5D33] mt-2">
                            Rs. {product.price.toLocaleString()}
                        </span>

                    </div>
                    <div className="flex items-center justify-center">
                        <Rating className="flex items-center justify-center gap-1"
                            value={product.ratings}
                            onRatingChange={handleRatingChange}
                            disable={true}
                        />
                    </div>
                    <span className='flex items-center justify-center gap-1 text-xs sm:text-sm text-gray-500 mt-2'>
                        ( {product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"} )
                    </span>
                    <div className="mt-[1rem] flex flex-col xs:flex-row sm:flex-row gap-2 w-full">
                        <button className="w-full xs:flex-1 sm:flex-1 min-w-0 whitespace-nowrap bg-gradient-to-r from-[#0E5D33] to-[#0A4A28] text-white py-[6px] sm:py-2 px-2 sm:px-3 rounded-[6px] font-semibold text-[11px] sm:text-xs md:text-sm hover:scale-[1.02] hover:shadow-md transition-all duration-300 cursor-pointer
                        ">
                            View Detail
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={` flex items-center justify-center gap-1 w-full xs:flex-1 sm:flex-1 min-w-0 whitespace-nowrap py-[6px] sm:py-2 px-2 sm:px-3 rounded-[6px] font-semibold text-[11px] sm:text-xs md:text-sm transition-all duration-300 cursor-pointer border
                                ${product.stock === 0
                                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'bg-white text-[#0E5D33] border-[#0E5D33] hover:bg-[#0E5D33] hover:text-white hover:scale-[1.02] hover:shadow-md'
                                }
                            `}
                        >
                            <ShoppingCartIcon sx={{ fontSize: 14, '@media (min-width:640px)': { fontSize: 16 } }} />
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Products