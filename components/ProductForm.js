import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router";

export default function ProductForm(currentProduct) {
    const [title, setTitle] = useState(currentProduct.title || '');
    const [category, setCategory] = useState(currentProduct.category || '');
    const [description, setDescription] = useState(currentProduct.description || '');
    const [price, setPrice] = useState(currentProduct.price || '');

    const [goBack, setGoBack] = useState(false);

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get(`/api/categories`).then(res => {
            setCategories(res.data)
        })
    }, [])

    const router = useRouter();

    async function saveProduct(e) {
        e.preventDefault()

        if(currentProduct._id) {
            await axios.put('/api/products', {
                id: currentProduct._id,
                title,
                description,
                price,
                category
            })
        } else {
            await axios.post('/api/products', {
                title,
                description,
                price,
                category
            })
        }
        setGoBack(true)
    }
    if(goBack) {
        router.push('/products')
    }

    return (
        <form 
            onSubmit={saveProduct}
            className="flex flex-col">

            {
                !currentProduct.title ?
                    <h1>New product</h1>
                :
                    <h1>Edit product</h1>
            }
            
            <label>Product name</label>
            <input 
                type="text" 
                name="name" 
                placeholder="Product name"
                value={title}
                onChange={e => setTitle(e.target.value)}
                />

            <label>Category</label>
            <select
                name="country"
                onChange={e => setCategory(e.target.value)}
                value={category._id}
                >
                <option value="">Choose a category</option>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>

            <label>Description</label>
            <textarea 
                name="description" 
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                ></textarea>

            <label>Price</label>
            <input 
                type="number" 
                name="price" 
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                />

            <button className="btn-primary mt-2">Save</button>
        </form>
    );
}
