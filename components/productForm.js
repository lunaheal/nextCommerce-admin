import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm(
    {   
        _id,
        title: existingTitle,
        description: existingDescription,
        price: existingPrice,
        images,
    }
    ) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const [renderImages, setRenderImages] = useState('')
    const router = useRouter();
    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title,description,price};
        if(_id) {
            //update
            await axios.put('/api/products', {...data, _id})
        } else {
            //create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }
    if(goToProducts) router.push('/products');
    async function uploadImages(ev){
        const files = ev.target?.files;
        const data = new FormData;
        for (const file of files) {
            console.log(file);
            document.querySelector('.productImage').src = URL.createObjectURL(file)
            data.append('file', file)
        }
        const res = await axios.post('/api/upload', data);
        console.log(res.data);

    }
    return (
        <form onSubmit={saveProduct} action="">
            <label htmlFor="">Product name</label>
            <input 
                type="text"
                placeholder="Product name"
                value={title}
                onChange={ev=>setTitle(ev.target.value)}/>
                <label>Photos</label>
                <div>
                <img className="productImage w-24 h-24" src='#' alt="" srcset="" />
                <label className="w-24 h-24 bg-gray-200 cursor-pointer flex flex-col justify-center items-center gap-1 text-sm text-gray-600 rounded">
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                    </svg>
              
                    Upload
                    <input type="file" className="hidden" onChange={uploadImages}/>
                </label>
                {
                    !images?.length && (
                        <div className="mb-1">
                            No photos in this products
                        </div>)
                }
            <label htmlFor="">Description</label>
            </div>
            <textarea 
                name="" id="" cols="30" rows="10"
                placeholder="Product description"
                value={description}
                onChange={ev=>setDescription(ev.target.value)}></textarea>
            <label htmlFor="">Price (in USD)</label>
            <input 
                type="text"
                placeholder="Product price"
                value={price}
                onChange={ev=>setPrice(ev.target.value)}/>
            <button type="submit" className="btn-primary">Save</button>
        </form>
    );
}