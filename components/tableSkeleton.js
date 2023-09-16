import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function TableSkeleton({loading, row, column}){
    return (
        [...Array(row)].map((e, i) => 
            <tr key={i} className={loading ? '' : 'hidden'}>
                {[...Array(column)].map((e,i)=>
                    <td key={i}><Skeleton /></td>
                )}
            </tr>
        )
    )
}