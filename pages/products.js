import ActionButton from "@/components/actionButton";
import Layout from "@/components/layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { ClipLoader } from "react-spinners";

export default function Products(){
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(()=>{
        setIsLoading(true);
        axios.get('/api/products').then(res=>{
            setProducts(res.data);
            setIsLoading(false);
        })
    },[])
    return (
        <Layout>
            <div className="flex justify-between">
                <h1>List Product</h1>
                <Link href={'/products/new'} className="btn-success inline-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>
                        Add products
                    </span>
                </Link>
            </div>
            
            {/* <ClipLoader color='#000000' loading={isLoading} size={20} aria-label="Loading Spinner" data-testId="loader" className=""></ClipLoader> */}
            <table className="basic mt-2">
                <thead>
                    <tr>
                        <td>Product name</td>
                        <td>Price</td>
                        <td className="min-w-[120px]">Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(10)].map((e, i) => 
                        <tr key={i} className={isLoading || 'hidden'}>
                            <td><Skeleton /></td>
                            <td><Skeleton /></td>
                            <td><Skeleton /></td>
                        </tr>
                    )}
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.title}</td>
                            <td className="w-15">
                                <span className="bg-green-400 p-1 mr-1 rounded text-white font-bold">$</span>{product.price}
                            </td>
                            <td className="min-w-[120px]">
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