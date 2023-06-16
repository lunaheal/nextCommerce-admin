import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { ReactSortable } from "react-sortablejs";
export default function ProductForm(
    {   
        _id,
        title: existingTitle,
        description: existingDescription,
        price: existingPrice,
        images: existingImages,
    }
    ) {
    // ----- Data handle -----
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    function clearImage(ev){
        ev.preventDefault();
        console.log(ev);
        setImages(null);
    }
    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title,description,price,images};
        if(_id) {
            // Update existing data
            await axios.put('/api/products', {...data, _id})
        } else {
            // Create new data
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }
    if(goToProducts) router.push('/products');
    async function uploadImages(ev){
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData;
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
            setIsUploading(false);
        }
    }
    function goBack(){
        setGoToProducts(true);
    }
    function updateImagesOrder(images){
        setImages(images);
    }
    return (
        <form onSubmit={saveProduct} action="">
            <label >Product name</label>
            <input 
                type="text"
                placeholder="Product name"
                value={title}
                onChange={ev=>setTitle(ev.target.value)}/>
            <label>Photos</label>
            <div className="flex flex-wrap mb-2 gap-2">
                <ReactSortable className="flex flex-wrap gap-1" list={images} setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => {
                        link = link.toString();
                        return <Image key={link} src={link} width={100} height={100} className="w-24 h-24 object-cover rounded border" alt="productPicture"></Image>
                    })}
                </ReactSortable>
                <label className={"bg-gray-200 hover:bg-gray-300 relative w-24 h-24 cursor-pointer rounded"+(isUploading?' bg-lime-100 hover:bg-lime-200':'')}>
                    {isUploading
                        ? (
                            <div className="flex flex-col justify-center items-center gap-1 text-sm text-gray-600 h-full">
                                <ClipLoader color='#a3e635' loading={true} size={20} className="w-24 h-24"/>
                                <span>Uploading</span>
                            </div>
                        )
                        : (
                            <div className="flex flex-col justify-center items-center gap-1 text-sm text-gray-600 h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                                </svg>
                                <span>Upload</span>
                            </div>
                    )
                    }
                    <input type="file" className="hidden" onChange={uploadImages} disabled={isUploading} />
                </label>
                {
                    (!images?.length && isUploading) && <div className="mb-1">No photos in this products</div>
                }
            </div>
            <label >Description</label>
            <textarea 
                name="" id="" cols="30" rows="10"
                placeholder="Product description"
                value={description}
                onChange={ev=>setDescription(ev.target.value)}></textarea>
            <label >Price (in USD)</label>
            <input 
                type="number"
                placeholder="Product price"
                value={price}
                onChange={ev=>setPrice(ev.target.value)}/>
            <button type="submit" className="btn-primary mr-2">Save</button>
            <button  className="btn-sub" onClick={goBack}>Cancel</button>
        </form>
    );
}