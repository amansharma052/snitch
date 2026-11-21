import { addItem, getCart } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { setCart } from "../state/cart.slice"


export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId })

        return data
    }

    async function handleGetCart() {
        const data = await getCart()
        console.log(data)
        dispatch(setCart(data.cart))
    }
     return { handleAddItem, handleGetCart}
}