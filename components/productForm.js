import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toUpperCaseFirst } from "./constant";
import { ReactSortable } from "react-sortablejs";
export default function ProductForm(
    {   
        _id,
        title: existingTitle,
        description: existingDescription,
        price: existingPrice,
        images: existingImages,
        category: existingCategory,
        properties: assignedProperties
    }
    ) {
    // ----- Data handle -----
    useEffect(()=>{
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    },[])
    const [title, setTitle] = useState(existingTitle || '');
    const [category, setCategory] = useState(existingCategory || '');
    const [categories, setCategories] = useState([]);
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [mainImage, setMainImage] = useState('');
    const [images, setImages] = useState(existingImages || []);
    // ----- UI handle -----
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    function clearImage(ev){
        ev.preventDefault();
        console.log(ev);
        setImages(null);
    }
    async function saveProduct(ev){
        ev.preventDefault();
        let data = {
            title,
            description,
            price,
            images,
            category,
            properties: productProperties
        };
        data.category == '' ? data.category = null : data.category
        console.log(data);
        if(_id) {
            // Update existing data
            await axios.put('/api/products', {...data, _id})
        } else {
            // Create new data
            await axios.post('/api/products', data);
        }
        router.push('/products');
    }
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
        router.back()
    }
    function updateImagesOrder(images){
        setImages(images);
    }

    let propertiesToFill = [];
    if (categories.length > 0 && category){
        let catInfo = categories.find(({_id}) => _id === category)
        catInfo && propertiesToFill.push(...catInfo.properties);
        while(catInfo?.parent?._id){
            const parentCategory = categories.find(({_id}) => _id === catInfo?.parent?._id)
            propertiesToFill.push(...parentCategory.properties)
            catInfo = parentCategory;
        }
        console.log('propertiesToFill',propertiesToFill);
    }

    function setProductProp(propName, value){
        setProductProperties(prev => {
            const newProductProps = {...prev}
            newProductProps[propName] = value;
            console.log(newProductProps);
            return newProductProps;
        })
    }
    
    return (
        <form onSubmit={saveProduct} action="">
            <label >Product name</label>
            <input 
                type="text"
                placeholder="Product name"
                value={title}
                onChange={ev=>setTitle(ev.target.value)}/>
            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value=''>Uncategorized</option>
                {categories.length > 0 && categories.map((c, i) => (
                    <option key={i} value={c._id}>{c.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map((p,i)=>{
                return <div key={i} className="flex gap-2">
                    <div className="w-3/12">
                        {toUpperCaseFirst(p.name) + ":"}
                    </div>
                    <select type="text"
                        value={productProperties[p.name]}
                        onChange={(ev) => setProductProp(p.name, ev.target.value)}>
                        <option value=''></option>
                        {p.values.map((v, i)=>(
                            <option key={i} value={v}>{toUpperCaseFirst(v)}</option>
                        ))}
                    </select>
                </div>
            })}
            <label className="">Photos</label>
            <div className="flex  mb-2 gap-2">
                {mainImage && <img src={mainImage} className="w-80 h-80 object-contain"/>}
                <div className="flex">
                <ReactSortable className="flex flex-wrap gap-1" list={images} setList={updateImagesOrder}>
                    {!!images?.length && images.map((link, index) => {
                        link = link.toString();
                        return <button type="button" key={index} src={link} onClick={() => setMainImage(link)}>
                            <Image key={index} src={link} width={100} height={100} className="object-cover rounded border " alt="productPicture"></Image>
                        </button>
                            
                    })}
                </ReactSortable>
                <label className={"bg-blue-50 hover:bg-blue-100 relative w-24 h-max cursor-pointer rounded hover:shadow-sm"+(isUploading?' bg-lime-100 hover:bg-lime-200':'')}>
                    {isUploading
                        ? (
                            <div className="flex flex-col justify-center items-center gap-1 text-sm text-gray-600 h-full">
                                <ClipLoader color='#a3e635' loading={true} size={20} className="w-24 h-24"/>
                                <span>Uploading</span>
                            </div>
                        )
                        : (
                            <div className="flex flex-col justify-center items-center gap-1 text-sm text-blue-600 h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                                </svg>
                                <span>Add image</span>
                            </div>
                    )
                    }
                    <input type="file" className="hidden" onChange={uploadImages} disabled={isUploading} />
                </label>
                {
                    (!images?.length && isUploading) && <div className="mb-1">No photos in this products</div>
                }
                </div>
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