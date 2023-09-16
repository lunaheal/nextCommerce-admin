import Link from "next/link";
import { useRouter } from "next/router";
import { NavItem } from "./constant";
import { useEffect, useState} from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import parse from 'html-react-parser';
import { withSwal } from "react-sweetalert2";
import { signOut } from "next-auth/react";

function Nav({swal}) {
    const inactiveLink = 'flex gap-2 sm:mb-1 p-2 sm:p-3 sm:pr-5 rounded-t-lg sm:rounded-t-none sm:rounded-l-lg';
    const activeLink = inactiveLink+' activeLink';
    const inActiveIcon = 'w-6 h-6'
    const activeIcon = inActiveIcon + ' fill-current'
    const [navVisible, setNavVisible] = useLocalStorage('navVisible', true);
    const router = useRouter();
    const {pathname} = router;
    function showHideNav(){
        setNavVisible(!navVisible)
    }
    function handleLogout(){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to logout`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                await router.push('/');
                await signOut();
            }
        });
    }
    return (
        <aside className="text-white sm:!px-4 flex sticky top-0">
            <nav className="flex flex-row sm:flex-col sm:w-max gap-2 pt-2 justify-between w-full wrapper sm:bg-none ">
                <div className="flex sm:flex-col">
                    {NavItem.map((item, index)=>
                        <Link
                            key={index}
                            href={item.route}
                            className = {(pathname === item.route || (pathname.includes(item.route) && item.route !== '/') ? activeLink : inactiveLink) + ' hover:text-sky-400'}>
                                <span className={(pathname === item.route || (pathname.includes(item.route) && item.route !== '/') ? activeIcon : inActiveIcon)}>{parse(item.icon)}</span>
                                <span className={navVisible ? 'hidden sm:block' : 'hidden'}>{item.title}</span>
                        </Link>
                    )}
                    <button className={inactiveLink + ' hover:text-sky-400 hidden sm:flex'} onClick={showHideNav}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            {
                                navVisible
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            }
                        </svg>
                        <span className={navVisible ? 'block' : 'hidden'}>Collapse</span>
                    </button>
                </div>
                <button className={inactiveLink + ' hover:text-sky-400'} onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    <span className={navVisible ? 'hidden sm:block' : 'hidden'}>Logout</span>
                </button>
            </nav>
        </aside>
    );
}

export default withSwal (({ swal }, ref) => <Nav key={0} swal={swal}/>)