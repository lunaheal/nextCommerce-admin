import ActionButton from "@/components/actionButton";
import Layout from "@/components/layout";
import TableSkeleton from "@/components/tableSkeleton";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import 'react-loading-skeleton/dist/skeleton.css'

export default function Products(){
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(()=>{
        fetchDB();
    },[])
    async function fetchDB(){
        setIsLoading(true);
        await axios.get('/api/products').then(res=>{
            setProducts(res.data);
        })
        await axios.get('/api/categories').then(res=>{
            setCategories(res.data)
        })
        await setIsLoading(false)
    }
    function renderCategory(product){
        if (categories.length > 0 && product.category){
            let catInfo = categories.find(({_id}) => _id === product.category)
            return catInfo?.name
        } else {
            return;
        }
    }
    return (
        <Layout>
            <div className="flex justify-between">
                <h1>List Product</h1>
                <Link href={'/products/new'} className="btn-success px-2 inline-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>
                        Add <span className="hidden sm:inline">product</span>
                    </span>
                </Link>
            </div>
            
            <p className="content-before content-after content-hover-before w-min-content relative transition-all
                before::absolute before::bottom-0 before::right-0
                before::h-1 before::w-0 before::bg-blue-400
                before::transition-all before::duration-500
                hover:before::left-0 hover:before::w-full hover:before::bg-red-500">Underline</p>

            <p className="content-before content-after content-hover-before background-hover-before
            relative
            before:inline-block 
            before:w-12
            before:h-6
            before:opacity-50
            before:bg-red-500 before:top-0 before:content-[''] before:absolute
            hover:before:opacity-0
            "
             >
            Tailwind CSS
            </p>

            {/* <ClipLoader color='#000000' loading={isLoading} size={20} aria-label="Loading Spinner" data-testId="loader" className=""></ClipLoader> */}
            <table className="basic mt-2">
                <thead>
                    <tr>
                        <td className="w-1/2">Product name</td>
                        <td className="w-1/4">Cate name</td>
                        <td className="">Price</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    <TableSkeleton row={10} column={4} loading={isLoading} />
                    {(products.length > 0 && categories.length > 0) && products.map(product => (
                        <tr key={product._id}>
                            <td>{product.title}</td>
                            <td>
                                {renderCategory(product)}
                            </td>
                            <td className="">
                                <span className="bg-yellow-400 p-1 mr-1 rounded text-white font-bold">$</span>{product.price}
                            </td>
                            <td className="text-right">
                                <Link href={'/products/edit/'+product._id}>
                                    <ActionButton type='edit'>Edit</ActionButton>
                                </Link>
                                <Link href={'/products/delete/'+product._id}>
                                    <ActionButton type='delete'>Delete</ActionButton>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}