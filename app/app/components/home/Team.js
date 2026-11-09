'use client';

import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import styles from './Team.module.css';
import { logImageError, getFallbackImage } from '../../utils/imageUtils';

export default function Team() {
    // Team member data as props
    const teamMembers = [
        {
            name: "SANTHIYA THANGARAJ",
            role: "CEO & Head Baker",
            image: "/img/team/santhiya-cartoon.webp",
            socials: {
                facebook: "https://www.facebook.com/santhiya.krishna.790?mibextid=rS40aB7S9Ucbxw6v",
                instagram: "https://www.instagram.com/_sandyraj_?igsh=MWw4cDRsdWhnazFoOQ=="
            }
        },
        {
            name: "THANGARAJ S.",
            role: "CFO & Creative Designer",
            image: "/img/team/thangaraj-cartoon.webp",
            socials: {
                facebook: "https://www.facebook.com/thangaraj.s.102?mibextid=rS40aB7S9Ucbxw6v",
                instagram: "https://www.instagram.com/thangaraj_s_navy_cop_navigator?igsh=ZjRqejVwMXZqaHUy"
            }
        },
        {
            name: "AMULRAJ S.",
            role: "COO",
            image: "/img/team/amulrajs-cartoon.webp",
            socials: {
                facebook: "https://www.facebook.com/profile.php?id=100007379657190",
                instagram: "https://www.instagram.com/amul_raj_s/profilecard/?igsh=ZmVpNnQ1cTMybWY="
            }
        },
        {
            name: "RAMYA",
            role: "CFO",
            image: "/img/team/ramya-cartoon.webp",
            socials: {
                facebook: "https://www.facebook.com/ramya.krish.777?mibextid=rS40aB7S9Ucbxw6v",
                instagram: "https://www.instagram.com/_mis_delight_?igsh=M2J3Nm03aTdqNnQw"
            }
        }
    ];

    function TeamMember({ name, role, image, socials }) {
        const handleImageError = (e) => {
            logImageError(image, 'Team', new Error('Image failed to load'));
            e.target.src = getFallbackImage('team');
        };

        return (
            <div className="col-lg-3 col-md-6 col-6">
                <div className={`team__item set-bg ${styles.teamItem}`}>
                    <Image
                        src={image}
                        alt={name}
                        width={300}
                        height={400}
                        className={styles.teamMemberImage}
                        onError={handleImageError}
                        priority={true}
                    />
                    <div className={`team__item__text ${styles.teamItemText}`}>
                        <h3 className="h6">{name}</h3>
                        <span>{role}</span>
                        <div className="team__item__social">
                            {socials.facebook && (
                                <a href={socials.facebook} target="_blank" rel="noopener noreferrer">
                                    <FaFacebook />
                                </a>
                            )}
                            {socials.instagram && (
                                <a href={socials.instagram} target="_blank" rel="noopener noreferrer">
                                    <FaInstagram />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="team spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7 col-md-7 col-sm-7">
                        <div className="section-title">
                            <span className="text-pink cursive">Team Members</span>
                            <h2 className="h1 text-gray">Meet the Team  </h2>
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-5">

                    </div>
                </div>
                <div className="row">
                    {teamMembers.map((member, idx) => (
                        <TeamMember
                            key={idx}
                            name={member.name}
                            role={member.role}
                            image={member.image}
                            socials={member.socials}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
