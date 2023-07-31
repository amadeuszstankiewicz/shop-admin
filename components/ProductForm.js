import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm(currentProduct) {
    const [title, setTitle] = useState(currentProduct.title || '');
    const [images, setImages] = useState(currentProduct.images || '');
    const [category, setCategory] = useState(currentProduct.category || '');
    const [description, setDescription] = useState(currentProduct.description || '');
    const [price, setPrice] = useState(currentProduct.price || '');
    const [isImageUploading, setIsImageUploading] = useState(false);

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
                category,
                images
            })
        } else {
            await axios.post('/api/products', {
                title,
                description,
                price,
                category,
                images
            })
        }
        setGoBack(true)
    }
    if(goBack) {
        router.push('/products')
    }

    async function uploadImages(e) {
        setIsImageUploading(true);
        
        const files = e.target?.files
        if(files?.length > 0) {
            const imagesData = new FormData()
            for(const file of files) {
                imagesData.append('file', file)
            }

            const response = await axios.post('/api/upload', imagesData)

            let newImages = [...images, ...response.data.image_links];
            setImages(newImages)
        }

        setIsImageUploading(false);
    }

    function removeImage(e, link) {
        e.preventDefault();

        setImages((prevImages) => {
            const updatedImages = prevImages.filter((image) => image !== link);
            return updatedImages;
        });
    }

    function imagesOrder(sortedImages) {
        setImages(sortedImages)
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

            <label>Images</label>
            <div className="flex gap-2">

                <ReactSortable 
                    className="flex gap-2"
                    list={images}
                    setList={imagesOrder}>
                    {
                        images.length > 0 ?
                            images.map(link => (
                                <div key={link} className="relative w-24 h-24 overflow-hidden rounded flex justify-center items-center">
                                    <img src={link} />
                                    <button 
                                        className="absolute top-0 right-0 bg-white rounded-xl"
                                        onClick={e => removeImage(e, link)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-all stroke-red-600 hover:stroke-red-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        :
                            null
                    }
                </ReactSortable>

                {isImageUploading && (
                    <div className="relative w-24 h-24 overflow-hidden rounded flex justify-center items-center">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                    </div>
                )}

                <label>
                    <div className="w-24 h-24 border flex items-center justify-center rounded transition-all bg-white/60 hover:bg-white/30 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
                        </svg>
                    </div>
                    <input 
                        type="file" 
                        className="hidden" 
                        onChange={uploadImages}/>
                </label>
            </div>
            {
                images.length == 0 ?
                    <div>No images...</div>
                :
                    null
            }

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
                rows={8}
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
