import { Container, Logo, LogoutBtn } from '../index'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

function Header() {
    const authStatus = useSelector(state => state.auth.status)
    //Difference between Link and useNavigate is that Link is used to navigate to a different route 
    //when the user clicks on a link, whereas useNavigate is used to navigate programmatically.
    const navigate = useNavigate()
    //Navigate is used to forcefully navigate the user to a different route
    //For example, if the user is not logged in and tries to access a protected route, we can use navigate to redirect them to the login page.
    const navItems = [
        {
            name: "Home",
            slug: "/",
            active: true
        },
        {
            name: "Login",
            slug: "/login",
            active: !authStatus
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus
            //This will be accessible only if the user is logged in
        },
        {
            name: "Add Post",
            slug: "/add-post",
            active: authStatus
        },
    ]
    return (
        <Header className='py-3 shadow bg-gray-500'>
            <Container>
                <nav className='flex'>
                    <div className='mr-4'>
                        <link>
                            <Logo width='70px' />
                        </link>
                    </div>
                    <ul className='flex ml-auto'>
                        {navItems.map((item) =>
                            item.active ? (
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.slug)}
                                        className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                                    >{item.name}</button>
                                </li>
                            ) : null
                        )}
                        {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
        </Header>
    )
}

export default Header
