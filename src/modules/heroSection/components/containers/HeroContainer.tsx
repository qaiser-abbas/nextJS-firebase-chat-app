import React from 'react'
import Hero from '../Hero'

export default function HeroContainer() {
    return (
        <div>
            <Hero
                title="Intelligent Apps for Every Business Model"
                subtitle="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt."
                imageUrl="/images/hero-image.png"  // Add this image to public/images
                buttonText="BEGIN FREE TRIAL"
                buttonLink="/contact"
            />
        </div>
    )
}
