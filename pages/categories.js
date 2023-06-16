import Layout from "@/components/layout"
import axios from "axios";
import { useState } from "react"

export default function Categories() {
    const [name,setName] = useState('');

    async function saveCategory(ev){
        ev.preventDefault();
        await axios.post('api/categories', {name});
        setName('');
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>Product name</label>
            <form onSubmit={saveCategory} className="flex gap-2">
                <input className="mb-0"
                type="text"
                value={name}
                onChange={ev => setName(ev.target.value)}
                placeholder="Category name"/>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            
        </Layout>
    )
}