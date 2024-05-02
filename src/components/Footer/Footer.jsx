import React from "react";
import './Footer.css'

const Footer = () => {
    return (
        <footer className="footer" >
            <div className="footer-container" >
                <h3 style={{ fontWeight: "normal" }}>
                    <span>
                        <a className="footer-text" 
                        href="https://gitlab.com/LucaGilli/einfach-text"
                        target="_blank"
                        rel="noreferrer">
                        Copyright &copy; {new Date().getFullYear()} 
                        </a>
                    </span>
                </h3>
            </div>
        </footer>
    );
};

export default Footer;