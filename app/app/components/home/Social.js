"use client"
import { FaInstagram, FaGoogle, FaYoutube } from 'react-icons/fa';

export default function Social() {
    return (
        <section style={{ background: "#fff", padding: "80px 0", position: "relative" }}>
            <div className="container">
                <div className="row">
                    {/* Instagram Widget - Left Side */}
                    <div className="col-lg-4 mb-4">
                        <div style={{
                            background: "#fff",
                            borderRadius: "16px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                            padding: "30px",
                            border: "1px solid #f0f0f0",
                            height: "100%"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
                                <div style={{
                                    width: "50px",
                                    height: "50px",
                                    background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "15px"
                                }}>
                                    <FaInstagram style={{ 
                                        color: "#fff", 
                                        fontSize: "1.8rem" 
                                    }} />
                                </div>
                                <div>
                                    <h3 style={{ 
                                        margin: "0", 
                                        fontSize: "1.4rem", 
                                        fontWeight: "700",
                                        color: "#333"
                                    }}>
                                        Follow Us on Instagram
                                    </h3>
                                    <p style={{ 
                                        margin: "5px 0 0 0", 
                                        fontSize: "1rem", 
                                        color: "#666"
                                    }}>
                                        @serles_bake
                                    </p>
                                </div>
                            </div>
                            
                            {/* Instagram Grid */}
                            <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(3, 1fr)", 
                                gap: "12px",
                                marginBottom: "25px"
                            }}>
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <a key={item} href="https://www.instagram.com/serles_bake/"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    >
                                    <div key={item} style={{
                                        width: "100%",
                                        height: "120px",
                                        background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontSize: "2rem",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        position: "relative",
                                        overflow: "hidden"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = "scale(1.05)";
                                        e.target.style.boxShadow = "0 8px 25px rgba(220, 39, 67, 0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = "scale(1)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                    >
                                        <i className="fas fa-cake"></i>
                                        <div style={{
                                            position: "absolute",
                                            top: "8px",
                                            right: "8px",
                                            background: "rgba(255,255,255,0.9)",
                                            color: "#dc2743",
                                            borderRadius: "50%",
                                            width: "24px",
                                            height: "24px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.8rem"
                                        }}>
                                            <i className="fas fa-heart"></i>
                                        </div>
                                    </div>
                                    </a>
                                ))}
                            </div>
                            
                            <a 
                                href="https://www.instagram.com/serles_bake/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "25px",
                                    padding: "12px 30px",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    width: "100%",
                                    transition: "all 0.3s ease",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    textDecoration: "none",
                                    display: "block",
                                    textAlign: "center"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-3px)";
                                    e.target.style.boxShadow = "0 8px 25px rgba(220, 39, 67, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                <FaInstagram style={{ marginRight: "8px", display: "inline" }} />
                                Follow on Instagram
                            </a>
                        </div>
                    </div>

                    {/* YouTube Widget - Middle */}
                    <div className="col-lg-4 mb-4">
                        <div style={{
                            background: "#fff",
                            borderRadius: "16px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                            padding: "30px",
                            border: "1px solid #f0f0f0",
                            height: "100%"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
                                <div style={{
                                    width: "50px",
                                    height: "50px",
                                    background: "#ff0000",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "15px"
                                }}>
                                    <FaYoutube style={{ 
                                        color: "#fff", 
                                        fontSize: "1.8rem" 
                                    }} />
                                </div>
                                <div>
                                    <h3 style={{ 
                                        margin: "0", 
                                        fontSize: "1.4rem", 
                                        fontWeight: "700",
                                        color: "#333"
                                    }}>
                                        Watch Our Videos
                                    </h3>
                                    <p style={{ 
                                        margin: "5px 0 0 0", 
                                        fontSize: "1rem", 
                                        color: "#666"
                                    }}>
                                        @SerlesBake
                                    </p>
                                </div>
                            </div>
                            
                            {/* YouTube Video Preview */}
                            <div style={{ 
                                background: "#f8f9fa", 
                                padding: "20px", 
                                borderRadius: "12px",
                                marginBottom: "25px",
                                textAlign: "center"
                            }}>
                                <div style={{
                                    width: "100%",
                                    height: "120px",
                                    background: "#ff0000",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontSize: "3rem",
                                    marginBottom: "15px",
                                    position: "relative",
                                    overflow: "hidden"
                                }}>
                                    <FaYoutube />
                                    <div style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        background: "rgba(255,255,255,0.9)",
                                        borderRadius: "50%",
                                        width: "40px",
                                        height: "40px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <i className="fas fa-play" style={{ color: "#ff0000", fontSize: "1.2rem" }}></i>
                                    </div>
                                </div>
                                <h4 style={{ 
                                    margin: "0 0 10px 0", 
                                    fontSize: "1.1rem", 
                                    fontWeight: "600",
                                    color: "#333"
                                }}>
                                    Cake Making Tutorials
                                </h4>
                                <p style={{ 
                                    fontSize: "0.9rem", 
                                    color: "#666",
                                    margin: "0"
                                }}>
                                    Learn the art of cake making with our step-by-step videos
                                </p>
                            </div>
                            
                            <a 
                                href="https://www.youtube.com/@SerlesBake" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    background: "#ff0000",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "25px",
                                    padding: "12px 30px",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    width: "100%",
                                    transition: "all 0.3s ease",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    textDecoration: "none",
                                    display: "block",
                                    textAlign: "center"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-3px)";
                                    e.target.style.boxShadow = "0 8px 25px rgba(255, 0, 0, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                <FaYoutube style={{ marginRight: "8px", display: "inline" }} />
                                Subscribe on YouTube
                            </a>
                        </div>
                    </div>

                    {/* Google Reviews Widget - Right Side */}
                    <div className="col-lg-4 mb-4">
                        <div style={{
                            background: "#fff",
                            borderRadius: "16px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                            padding: "30px",
                            border: "1px solid #f0f0f0",
                            height: "100%"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
                                <div style={{
                                    width: "50px",
                                    height: "50px",
                                    background: "#4285f4",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "15px"
                                }}>
                                    <FaGoogle style={{ 
                                        color: "#fff", 
                                        fontSize: "1.8rem" 
                                    }} />
                                </div>
                                <div>
                                    <a href="https://www.google.com/search?q=serles+bake" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    >   
                                    <h3 style={{ 
                                        margin: "0", 
                                        fontSize: "1.4rem", 
                                        fontWeight: "700",
                                        color: "#333"
                                    }}>
                                        Google Reviews
                                    </h3>
                                    <p style={{ 
                                        margin: "5px 0 0 0", 
                                        fontSize: "1rem", 
                                        color: "#666"
                                    }}>
                                        What our customers say
                                    </p>
                                    </a>
                                </div>
                            </div>
                            
                            {/* Overall Rating */}
                            <div style={{ 
                                background: "#f8f9fa", 
                                padding: "20px", 
                                borderRadius: "12px",
                                marginBottom: "25px",
                                textAlign: "center"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                                    <div style={{ display: "flex", gap: "3px", marginRight: "15px" }}>
                                        {[1, 2, 3, 4, 5].map((star, idx) => (
                                            <i 
                                                key={`overall-star-${star}-${idx}`} 
                                                className="fas fa-star"  
                                                style={{ 
                                                    color: "#ffc107", 
                                                    fontSize: "1.5rem" 
                                                }}
                                            ></i>
                                        ))}
                                        
                                    </div>
                                    <span style={{ fontSize: "2rem", fontWeight: "700", color: "#333" }}>5.0</span>
                                </div>
                                <span style={{ fontSize: "1.1rem", color: "#666" }}>Based on  reviews</span>
                            </div>
                            
                            {/* Recent Reviews */}
                            <div style={{ marginBottom: "25px" }}>
                                <h4 style={{ 
                                    margin: "0 0 15px 0", 
                                    fontSize: "1.1rem", 
                                    fontWeight: "600",
                                    color: "#333"
                                }}>
                                    Recent Reviews
                                </h4>
                                
                                {/* Review 1 */}
                                <div style={{ 
                                    background: "#f8f9fa", 
                                    padding: "15px", 
                                    borderRadius: "10px",
                                    marginBottom: "12px"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                        <div style={{ display: "flex", gap: "2px", marginRight: "10px" }}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i key={star} className="fas fa-star" style={{ 
                                                    color: "#ffc107", 
                                                    fontSize: "0.9rem" 
                                                }}></i>
                                            ))}
                                        </div>
                                        {/* <span style={{ fontSize: "0.9rem", color: "#666" }}>2 days ago</span> */}
                                    </div>
                                    <p style={{ 
                                        fontSize: "0.95rem", 
                                        color: "#333", 
                                        margin: "0 0 5px 0",
                                        lineHeight: "1.5"
                                    }}>
                                       Taste: the flavors were spot on,and the cake was moist...🥰
Presentation: the simple design was beautiful and the cake looked exactly like the picture ♥️
Service : the sister and brother as friendly and responsive to my queries
Value : the price was reasonable considering the quality and quantity 🥰
Totally I like this it on homemade cake...🥰😘
♥️ thank you for good service and good cake..♥️
                                    </p>
                                    <span style={{ fontSize: "0.9rem", color: "#666", fontStyle: "italic", fontWeight: "500" }}>esai Nandhini</span>
                                </div>

                                {/* Review 2 */}
                              
                            </div>
                            
                            <a 
                                href="https://share.google/LXNL5vGddaEwhpoIb" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    background: "#4285f4",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "25px",
                                    padding: "12px 30px",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    width: "100%",
                                    transition: "all 0.3s ease",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    textDecoration: "none",
                                    display: "block",
                                    textAlign: "center"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-3px)";
                                    e.target.style.boxShadow = "0 8px 25px rgba(66, 133, 244, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                <FaGoogle style={{ marginRight: "8px", display: "inline" }} />
                                Write a Review
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
