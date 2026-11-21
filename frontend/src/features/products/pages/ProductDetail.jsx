
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { useProduct } from '../hook/useProduct';

const ProductDetail = () => {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});

    const { handleGetProductById } = useProduct();

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedAttributes(product.variants[0].attributes || {});
        }
    }, [product]);

    const activeVariant = useMemo(() => {
        if (!product?.variants?.length) return null;

        return product.variants.find(v => {
            const vAttrs = v.attributes || {};
            const sKeys = Object.keys(selectedAttributes);

            return Object.keys(vAttrs).length === sKeys.length &&
                Object.keys(vAttrs).every(
                    key => vAttrs[key] === selectedAttributes[key]
                );
        });
    }, [product, selectedAttributes]);

    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};

        const attrs = {};

        product.variants.forEach(variant => {
            Object.entries(variant.attributes || {}).forEach(([key, value]) => {
                if (!attrs[key]) attrs[key] = new Set();
                attrs[key].add(value);
            });
        });

        Object.keys(attrs).forEach(key => {
            attrs[key] = Array.from(attrs[key]);
        });

        return attrs;
    }, [product]);

    useEffect(() => {
        setSelectedImage(0);
    }, [activeVariant]);

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = {
            ...selectedAttributes,
            [attrName]: value
        };

        const exactMatch = product.variants.find(v => {
            const vAttrs = v.attributes || {};

            return Object.keys(newAttrs).every(
                key => newAttrs[key] === vAttrs[key]
            ) &&
            Object.keys(vAttrs).every(
                key => newAttrs[key] === vAttrs[key]
            );
        });

        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            const fallbackVariant = product.variants.find(
                v => v.attributes?.[attrName] === value
            );

            setSelectedAttributes(
                fallbackVariant?.attributes || newAttrs
            );
        }
    };

    if (!product) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: '#fbf9f6' }}
            >
                <p className="text-xs uppercase tracking-widest text-gray-400 animate-pulse">
                    Retrieving product...
                </p>
            </div>
        );
    }

    const displayImages =
        activeVariant?.images?.length > 0
            ? activeVariant.images
            : product.images?.length > 0
                ? product.images
                : [{ url: '/snitch_editorial_warm.png' }];

    const displayPrice = activeVariant?.price || product.price;

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen pb-24"
                style={{
                    backgroundColor: '#fbf9f6',
                    fontFamily: "'Inter', sans-serif"
                }}
            >
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

                        {/* Product Images */}
                        <div className="w-full lg:w-[70%] flex flex-col-reverse md:flex-row gap-4 lg:gap-6">

                            {displayImages.length > 1 && (
                                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto pb-2 w-full md:w-20 lg:w-24 flex-shrink-0">
                                    {displayImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`flex-shrink-0 w-20 md:w-full aspect-[4/5] overflow-hidden ${
                                                selectedImage === idx
                                                    ? 'ring-1 ring-[#C9A96E]'
                                                    : 'opacity-50 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt={`Product view ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image */}
                            <div
                                className="relative w-full aspect-[4/5] overflow-hidden group"
                                style={{ backgroundColor: '#f5f3f0' }}
                            >
                                <img
                                    src={displayImages[selectedImage]?.url || displayImages[0].url}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />

                                {displayImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setSelectedImage(prev =>
                                                    prev === 0
                                                        ? displayImages.length - 1
                                                        : prev - 1
                                                )
                                            }
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3"
                                        >
                                            ←
                                        </button>

                                        <button
                                            onClick={() =>
                                                setSelectedImage(prev =>
                                                    prev === displayImages.length - 1
                                                        ? 0
                                                        : prev + 1
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3"
                                        >
                                            →
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Product Information */}
                        <div className="w-full lg:w-[30%] lg:sticky lg:top-24 pt-4">

                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    color: '#1b1c1a'
                                }}
                            >
                                {product.title}
                            </h1>

                            <div className="mb-8">
                                <span className="text-sm uppercase tracking-widest font-medium">
                                    {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                                </span>
                            </div>

                            <div className="h-px w-full mb-8 bg-[#e4e2df]" />

                            {/* Product Variants */}
                            {Object.entries(availableAttributes).map(([attrName, values]) => (
                                <div key={attrName} className="mb-6">

                                    <h3 className="text-xs uppercase tracking-widest mb-3 text-[#C9A96E]">
                                        {attrName}
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {values.map(val => (
                                            <button
                                                key={val}
                                                onClick={() => handleAttributeChange(attrName, val)}
                                                className={`px-4 py-2 text-xs uppercase border transition ${
                                                    selectedAttributes[attrName] === val
                                                        ? 'bg-black text-white border-black'
                                                        : 'border-gray-300 hover:border-black'
                                                }`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Stock Information */}
                            {activeVariant?.stock !== undefined && (
                                <div className="mb-6">
                                    <span className={`text-xs uppercase tracking-widest ${
                                        activeVariant.stock > 0
                                            ? 'text-green-700'
                                            : 'text-red-700'
                                    }`}>
                                        {activeVariant.stock > 0
                                            ? `${activeVariant.stock} in stock`
                                            : 'Out of stock'}
                                    </span>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mt-10">
                                <h3 className="text-xs uppercase tracking-widest mb-4 text-[#C9A96E]">
                                    Product Details
                                </h3>

                                <p className="text-sm leading-relaxed text-[#7A6E63]">
                                    {product.description}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
