import ActionButton from "@/components/actionButton";
import Layout from "@/components/layout"
import TableSkeleton from "@/components/tableSkeleton";
import axios from "axios";
import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton";
import { withSwal } from "react-sweetalert2";

function Categories({swal}) {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('');
    const [editedCategory, setEditedCategory] = useState(null)
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [properties, setProperties] = useState([])
    useEffect(() => {
        setIsLoading(true);
        fetchCategories();
    },[])
    async function fetchCategories(){
        await axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
        setIsLoading(false);
    }
    async function saveCategory(ev){
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p=>({
                name: p.name,
                values: p.values
            }))
        };
        if(name){
            if (editedCategory) {
                data._id = editedCategory._id;
                await axios.put('api/categories', data);
                setEditedCategory(null)
            } else {
                await axios.post('api/categories', data);
            }
            setName('');
            setParentCategory('')
            fetchCategories();
            setProperties([]);
        } else swal.fire({
            title: 'Name is required',
        })
    }
    function cancelEdited(){
        setEditedCategory(null)
        setProperties([]);
        setName('');
        setParentCategory('');
    }
    function editCategory(category){
        setEditedCategory(category);
        setProperties(category.properties)
        setName(category.name);
        setParentCategory(category.parent?._id);
    }
    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed){
                const {_id} = category
                await axios.delete('api/categories?_id='+_id, {_id})
                fetchCategories();
            }
        });
    }
    function addProperty(){
        setProperties(prev => {
            return [...prev, {name: '', values:''}]
        });
    }
    function handlePropertyNameChange(index, property, newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }
    function handlePropertyValueChange(index, property, newValue){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValue.split(',');
            console.log(properties);
            return properties;
        })
    }
    function removeProperty(index, property){
        const removeItem = (index) => setProperties(prev => {
            const newProperties = [...prev];
            newProperties.splice(index,1)
            return newProperties
        })
        console.log(property);
        if(property.name == '' && property.values == '') {
            removeItem(index)
        }
        else swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${property.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true,
        }).then(result => {
            if (result.isConfirmed) {
                removeItem(index)
            }
        });
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>{
                editedCategory
                ? `Edit Category ${editedCategory.name}`
                : 'Create new category'
            }</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input 
                    type="text"
                    value={name}
                    onChange={ev => setName(ev.target.value)}
                    placeholder="Category name"/>
                    <select 
                        value={parentCategory}
                        onChange={ev => {
                                setParentCategory(ev.target.value)
                            }}
                        >
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map((category, index) => (
                            <option key={index} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Property</label>
                    <button type="button"
                        className="btn-default text-sm text-white my-1"
                        onClick={addProperty}>
                        Add new Property
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-1" key={index}>
                            <input type="text"
                                className="mb-0"
                                value={property.name}
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder="Property name (example: color)"/>
                            <input type="text"
                                className="mb-0"
                                value={property.values}
                                onChange={ev => handlePropertyValueChange(index, property, ev.target.value)}
                                placeholder="values, comma separated"/>
                            <button
                                type="button"
                                className="btn-default"
                                onClick={() => removeProperty(index, property)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory &&
                        <button type="button"
                            className="btn-default py-1 text-white"
                            onClick={cancelEdited}>
                            Cancel
                        </button>
                    }
                    <button type="submit" className="btn-primary py-1">Save</button>
                </div>
            </form>
            
        {!editedCategory && 
        <table className="basic mt-4">
            <thead>
                <tr>
                    <td className="w-1/2">Category name</td>
                    <td>Parent Category</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <TableSkeleton row={10} column={3} loading={isLoading} />
                {categories.length > 0 && categories.map((category, index) => (
                    <tr key={index}>
                        <td>{category.name}</td>
                        <td>{category?.parent?.name}</td>
                        <td className="text-right">
                            <ActionButton type='edit' onClick={()=> editCategory(category)}>Edit</ActionButton>
                            <ActionButton type='delete' onClick={()=> deleteCategory(category)}>Delete</ActionButton>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        }
        </Layout>
    )
}

export default withSwal (({ swal }, ref) => <Categories key={0} swal={swal}/>)