import { Link } from "react-router-dom"

export default function Navbar() {
    return (
    <nav className="nav">
        <Link to="/" className="title">The Blob</Link>
        <ul>
            <li>
                <Link to="/login">Login</Link>
            </li>
            <li>
                <Link to="/createAcc">Create Account</Link>
            </li>
        </ul>
    </nav>
    )
}