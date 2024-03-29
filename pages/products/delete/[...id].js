import Layout from "@/components/layout"
import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo, setProductsInfo] = useState();
    const {id} = router.query;
    useEffect(()=>{
        if(!id) return;
        axios.get('/api/products?id='+id).then(res=>{
            setProductsInfo(res.data);
        })
    }, [id])
    function goBack(){
        router.push('/products')
    }
    async function deleteProduct(){
        await axios.delete('/api/products?id='+id);
        goBack();
    }
    return (
    <Layout>
        <h1 className="text-center">Do you really want to delete
            &nbsp;"{productInfo?.title}"?</h1>
        <div className="flex gap-2 justify-center">
            <button className="btn-danger" onClick={deleteProduct}>Yes</button>
            <button className="btn-default" onClick={goBack}>NO</button>
        </div>
    </Layout>
    )
}