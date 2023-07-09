import Content from "@/components/Content"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import axios from "axios"

export default function Products() {
    const [products, setProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [chosenProductToDelete, setChosenProductToDelete] = useState(null);
    const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
    const [chosenCategoryToDelete, setChosenCategoryToDelete] = useState(null);
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [showEditCategoryField, setShowEditCategoryField] = useState('');
    const [editCategoryName, setEditCategoryName] = useState('');

    const deleteModal = useRef(null);
    const deleteCategoryModal = useRef(null);

    useEffect(() => {
        axios.get('/api/products').then(res => {
            setProducts(res.data)
        })
        axios.get('/api/categories').then(res => {
            setCategories(res.data)
        })
    }, [])

    useEffect(() => {
        const handleOutSideClick = (event) => {
            if (!deleteModal.current?.contains(event.target)) {
                setShowDeleteModal(false)
            }
            if (!deleteCategoryModal.current?.contains(event.target)) {
                setShowDeleteCategoryModal(false)
            }
        };
        window.addEventListener("mousedown", handleOutSideClick);
        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [deleteModal]);

    function showDeletePopup(product_id) {
        setChosenProductToDelete(product_id)
        setShowDeleteModal(true)
    }

    function hideDeletePopup() {
        setChosenProductToDelete(null)
        setShowDeleteModal(false)
    }

    async function deleteProduct() {
        if(chosenProductToDelete) {
            let response = await axios.delete(`/api/products?id=${chosenProductToDelete}`);
            if(response.data.status === "success") {
                const updatedProducts = products.filter(product => product._id !== chosenProductToDelete);
                setProducts(updatedProducts);
            }
        }
        setShowDeleteModal(false)
    }

    async function addNewCategory() {
        if(newCategoryName !== '') {
            let newCategory = await axios.post('/api/categories', {
                name: newCategoryName
            })
            if(newCategory.data) {
                console.log(categories)
                console.log({
                    _id: newCategory.data._id,
                    name: newCategory.data.name
                })
                setCategories([
                    ...categories,
                    {
                        _id: newCategory.data._id,
                        name: newCategory.data.name
                    }
                ])
            }
        }
    }

    function showEditField(category_id, category_name) {
        if(category_id== showEditCategoryField) {
            setEditCategoryName('')
            setShowEditCategoryField('')
        } else {
            setEditCategoryName(category_name)
            setShowEditCategoryField(category_id)
        }
    }

    function changeCategoryName() {
        axios.put('/api/categories', {
            id: showEditCategoryField,
            name: editCategoryName
        }).then(res => {
            if(res.data.status === "success") {
                let updatedCategories = categories;
                const index = updatedCategories.findIndex(item => item._id === showEditCategoryField);
                if (index !== -1) {
                    updatedCategories[index].name = editCategoryName;
                }
                setCategories(updatedCategories)
            }
            setEditCategoryName('')
            setShowEditCategoryField('')
        })

    }

    function showDeleteCategoryPopup(category_id) {
        setChosenCategoryToDelete(category_id)
        setShowDeleteCategoryModal(true)
    }

    function hideDeleteCategoryPopup() {
        setChosenCategoryToDelete(null)
        setShowDeleteCategoryModal(false)
    }

    async function deleteCategory() {
        if(chosenCategoryToDelete) {
            let response = await axios.delete(`/api/categories?id=${chosenCategoryToDelete}`);
            if(response.data.status === "success") {
                const updatedCategories = categories.filter(category => category._id !== chosenCategoryToDelete);
                setCategories(updatedCategories);
            }
        }
        setShowDeleteCategoryModal(false)
    }

    return <Content>
        {showDeleteModal ? (
            <>
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    <div className="relative w-auto my-6 mx-auto max-w-3xl" ref={deleteModal}>
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                <h3 className="text-3xl font-semibold">
                                    Delete product
                                </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                <p className="my-4 text-slate-500 text-lg leading-relaxed">
                                    Do you really want to delete this product?
                                </p>
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    className="text-black background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => hideDeletePopup()}
                                >
                                    No
                                </button>
                                <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => deleteProduct()}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null}


        <h1>Products list</h1>
        <Link 
            className="bg-emerald-600 rounded-md px-4 py-2 font-bold transition-all hover:bg-emerald-500 text-white" 
            href={'/products/new'}>
            Add new
        </Link>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-white/60 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Product name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                    products.length > 0 ? 
                    <>
                        {products.map(product => (
                            <tr className="bg-white/80 border-b dark:bg-gray-800 dark:border-gray-700" key={product._id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {product?.title}
                                </th>
                                <td className="px-6 py-4">
                                    {product?.category?.name}
                                </td>
                                <td className="px-6 py-4">
                                    {product?.price}$
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link 
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2" 
                                        href={`/products/${product._id}`}>
                                        Edit
                                    </Link>
                                    <button 
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline" 
                                        onClick={(e) => showDeletePopup(product._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </>
                    :
                        <tr className="bg-white/80 border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">
                                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                            </td>
                            <td className="px-6 py-4">
                            </td>
                            <td className="px-6 py-4">
                            </td>
                            <td className="px-6 py-4">
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>




        {showDeleteCategoryModal ? (
            <>
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    <div className="relative w-auto my-6 mx-auto max-w-3xl" ref={deleteCategoryModal}>
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                <h3 className="text-3xl font-semibold">
                                    Delete category
                                </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                <p className="my-4 text-slate-500 text-lg leading-relaxed">
                                    Do you really want to delete this category?
                                </p>
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    className="text-black background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => hideDeleteCategoryPopup()}
                                >
                                    No
                                </button>
                                <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => deleteCategory()}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null}

        <h1 className="mt-5">Categories list</h1>

        <div className="flex flex-col">
            <label>Category name</label>
            <input 
                type="text" 
                name="category" 
                placeholder="Category"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                />
            <button 
                className="bg-emerald-600 rounded-md px-4 py-2 font-bold w-fit transition-all hover:bg-emerald-500 text-white"
                onClick={(e) => addNewCategory()}>
                Add new
            </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-white/60 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Category name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                    categories.length > 0 ? 
                    <>
                        {categories.map(category => (
                            <tr className="bg-white/80 border-b dark:bg-gray-800 dark:border-gray-700" key={category._id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {
                                        showEditCategoryField == category._id ?
                                            <div className="flex">
                                                <input 
                                                    type="text" 
                                                    name="editCategoryName" 
                                                    placeholder="Category name"
                                                    value={editCategoryName}
                                                    onChange={e => setEditCategoryName(e.target.value)}
                                                    className="mb-0"
                                                />
                                                <button
                                                    onClick={e => changeCategoryName()}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#059669" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </button>
                                            </div>
                                            
                                        :
                                            category?.name
                                    }
                                </th>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2" 
                                        onClick={(e) => showEditField(category._id, category.name)}>
                                        Edit
                                    </button>
                                    <button 
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline" 
                                        onClick={(e) => showDeleteCategoryPopup(category._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </>
                    :
                        <tr className="bg-white/80 border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">
                                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                            </td>
                            <td className="px-6 py-4">
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>

    </Content>
}
