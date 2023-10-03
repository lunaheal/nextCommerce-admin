import ActionButton from "@/components/actionButton"
import Layout from "@/components/layout"
import TableSkeleton from "@/components/tableSkeleton"
import axios from "axios";
import { useEffect, useState } from "react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        })
    }, [])
    const [isLoading, setIsLoading] = useState(false);
    return (
        <Layout>
            <table className="basic mt-4">
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Paid</td>
                    <td>Recipient</td>
                    <td>Products</td>
                </tr>
            </thead>
            <tbody>
                <TableSkeleton row={10} column={3} loading={isLoading} />
                {
                    orders?.length > 0 && orders.map((order, i) => (
                        <tr key={order._id}>
                            <td>{
                                (new Date(order.createdAt)).toLocaleString()
                            }</td>
                            <td>
                                <span className={
                                    order.paid ? 'text-green-500' : 'text-red-500'}>
                                    {order.paid ? 'YES' : 'NO'}
                                </span>
                            </td>
                            <td>
                                {order.name} {order.email} <br />
                                {order.city} {order.postalCode} <br />
                                {order.streetAddress} {order.country}
                            </td>
                            <td>
                                {order.line_items.map(item => (
                                    <p key={item._id}> 
                                        {item.price_data?.product_data.name} 
                                        <span className="mx-1 font-bold text-sm">x</span>
                                        {item.quantity}
                                    </p>
                                ))}
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </Layout>
    )
}