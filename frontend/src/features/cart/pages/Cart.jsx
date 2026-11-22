import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useCart } from "../hook/useCart";

const Cart = () => {
    const items = useSelector(state => state.cart.items || []);
    const currency = useSelector(state => state.cart.currency);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [error, setError] = useState("");
    const { handleGetCart, handleIncrementCartItem } = useCart();

    useEffect(() => {
        let isMounted = true;

        handleGetCart()
            .catch(() => {
                if (isMounted) {
                    setError("We couldn't retrieve your cart. Please try again.");
                }
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const subtotal = useMemo(
        () => items.reduce((total, item) => total + (item.price?.amount || 0) * item.quantity, 0),
        [items]
    );

    const formatPrice = amount => {
        const priceCurrency = currency || items.find(item => item.price?.currency)?.price.currency || "INR";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: priceCurrency,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const incrementItem = async item => {
        const productId = item.product?._id;
        const variantId = item.variant?._id || item.variant;

        if (!productId || !variantId) {
            setError("This item can't be updated right now. Please refresh your cart.");
            return;
        }

        setUpdatingItem(`${productId}-${variantId}`);
        setError("");

        try {
            await handleIncrementCartItem({ productId, variantId });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "We couldn't update this quantity. Please try again.");
        } finally {
            setUpdatingItem(null);
        }
    };

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <main
                className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
                style={{ backgroundColor: "#fbf9f6", fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
                    <div className="pt-12 pb-8">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[#C9A96E]"
                            style={{ color: "#7A6E63" }}
                        >
                            <span aria-hidden="true">←</span> Continue exploring
                        </Link>
                    </div>

                    <header className="pb-10 border-b" style={{ borderColor: "#e4e2df" }}>
                        <span className="text-[10px] uppercase tracking-[0.28em] font-medium" style={{ color: "#C9A96E" }}>
                            Your selection
                        </span>
                        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                            <h1
                                className="text-5xl md:text-6xl font-light leading-none"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1b1c1a" }}
                            >
                                Shopping Bag
                            </h1>
                            {!isLoading && (
                                <span className="pb-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: "#7A6E63" }}>
                                    {items.length} {items.length === 1 ? "piece" : "pieces"}
                                </span>
                            )}
                        </div>
                        <div className="mt-5 h-px w-14" style={{ backgroundColor: "#C9A96E" }} />
                    </header>

                    {error && (
                        <p role="alert" className="mt-6 text-sm" style={{ color: "#9b3c32" }}>
                            {error}
                        </p>
                    )}

                    {isLoading ? (
                        <div className="py-24 text-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] animate-pulse" style={{ color: "#B5ADA3" }}>
                                Gathering your pieces...
                            </p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="py-24 text-center flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-[0.24em] font-medium mb-4" style={{ color: "#C9A96E" }}>
                                Nothing here just yet
                            </span>
                            <h2
                                className="text-3xl md:text-4xl font-light mb-4"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1b1c1a" }}
                            >
                                Your bag is waiting.
                            </h2>
                            <p className="max-w-md text-sm leading-relaxed mb-8" style={{ color: "#7A6E63" }}>
                                Explore the collection and find a piece that feels like you.
                            </p>
                            <Link
                                to="/"
                                className="inline-block px-8 py-4 text-[10px] uppercase tracking-[0.24em] font-medium transition-colors hover:bg-[#C9A96E] hover:text-[#1b1c1a]"
                                style={{ backgroundColor: "#1b1c1a", color: "#fbf9f6" }}
                            >
                                Discover the collection
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-12 lg:gap-16 pt-10">
                            <section aria-label="Items in your shopping bag" className="divide-y" style={{ borderColor: "#e4e2df" }}>
                                {items.map((item, index) => {
                                    const product = item.product || {};
                                    const variantId = item.variant?._id || item.variant;
                                    const variant = product.variants?.find(entry => entry._id === variantId) || item.variant;
                                    const imageUrl = variant?.images?.[0]?.url || product.images?.[0]?.url || "/snitch_editorial_warm.png";
                                    const attributes = variant?.attributes ? Object.values(variant.attributes).join(" / ") : "";
                                    const key = `${product._id || index}-${variantId || index}`;
                                    const itemKey = `${product._id}-${variantId}`;

                                    return (
                                        <article key={key} className="flex gap-5 py-7 first:pt-0">
                                            <Link to={product._id ? `/product/${product._id}` : "/"} className="w-28 sm:w-36 shrink-0 aspect-[4/5] overflow-hidden" style={{ backgroundColor: "#f5f3f0" }}>
                                                <img src={imageUrl} alt={product.title || "Selected piece"} className="h-full w-full object-cover" />
                                            </Link>
                                            <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 sm:flex-row sm:items-start">
                                                <div className="min-w-0">
                                                    <h2
                                                        className="text-2xl leading-tight"
                                                        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1b1c1a" }}
                                                    >
                                                        {product.title || "Selected piece"}
                                                    </h2>
                                                    {attributes && (
                                                        <p className="mt-2 text-[10px] uppercase tracking-[0.17em]" style={{ color: "#7A6E63" }}>
                                                            {attributes}
                                                        </p>
                                                    )}
                                                    <p className="mt-4 text-xs" style={{ color: "#7A6E63" }}>
                                                        {formatPrice(item.price?.amount || 0)} each
                                                    </p>
                                                    <div className="mt-5 inline-flex items-center border" style={{ borderColor: "#d0c5b5" }}>
                                                        <span className="px-4 py-2 text-[10px] uppercase tracking-[0.12em]" style={{ color: "#7A6E63" }}>
                                                            Qty {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => incrementItem(item)}
                                                            disabled={updatingItem === itemKey}
                                                            aria-label={`Increase quantity of ${product.title || "selected piece"}`}
                                                            className="border-l px-3 py-2 text-base leading-none transition-colors hover:bg-[#1b1c1a] hover:text-[#fbf9f6] disabled:cursor-wait disabled:opacity-50"
                                                            style={{ borderColor: "#d0c5b5", color: "#1b1c1a" }}
                                                        >
                                                            {updatingItem === itemKey ? "…" : "+"}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="shrink-0 text-[11px] uppercase tracking-[0.12em] font-medium sm:text-right" style={{ color: "#1b1c1a" }}>
                                                    {formatPrice((item.price?.amount || 0) * item.quantity)}
                                                </p>
                                            </div>
                                        </article>
                                    );
                                })}
                            </section>

                            <aside className="h-fit border p-6 sm:p-8" style={{ borderColor: "#e4e2df", backgroundColor: "#f7f5f1" }}>
                                <h2
                                    className="text-2xl mb-7"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1b1c1a" }}
                                >
                                    Order summary
                                </h2>
                                <div className="space-y-4 border-b pb-5 text-xs" style={{ borderColor: "#e4e2df", color: "#7A6E63" }}>
                                    <div className="flex justify-between gap-4">
                                        <span>Subtotal</span>
                                        <span style={{ color: "#1b1c1a" }}>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span>Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                </div>
                                <div className="flex justify-between gap-4 pt-5 text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: "#1b1c1a" }}>
                                    <span>Estimated total</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <button
                                    type="button"
                                    disabled
                                    className="mt-8 w-full py-4 text-[10px] uppercase tracking-[0.24em] font-medium opacity-60 cursor-not-allowed"
                                    style={{ backgroundColor: "#1b1c1a", color: "#fbf9f6" }}
                                >
                                    Checkout coming soon
                                </button>
                                <p className="mt-4 text-center text-[10px] leading-relaxed" style={{ color: "#7A6E63" }}>
                                    Complimentary shipping on orders over INR 15,000.
                                </p>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Cart;