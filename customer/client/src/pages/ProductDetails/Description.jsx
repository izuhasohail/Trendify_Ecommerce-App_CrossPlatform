import React, { useState } from "react";

// Accordion
const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="pd-accordion-item">
            <div className="pd-accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <p>{title}</p>
                <span>{isOpen ? "-" : "+"}</span>
            </div>
            {isOpen && (
                <ul className="pd-accordion-content">
                    {content.map((item, index) => (
                        <li key={index}> {item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const Description = ({ desc }) => {

    const instructions = [
        {
            title: "Care Instructions",
            content: ["Wash light and bright colors separately.",
                "Machine or hand wash upto 30°C/86F.",
                "Do not bleach.", "Do not tumble dry.",
                "Delicate spin cycle on gentler/embellished garments.",
                "Do not dry in direct sunlight."]
        },
        {
            title: "Shipping & Return",
            content: ["The estimated delivery timeline for local order is 2-3 working days.",
                "International delivery timeline will be 7-10 working days.",
                "Exchange & Return",
                "There will be no exchange/refund on a discounted products.",
                "Any defect in product can be claimed on presentation of original receipt within 3 days of receiving the order.",
                "For more details on refund/claims you can check our Refund Policy"]
        },
        {
            title: "Disclaimer",
            content: ["Actual colors of the product may slightly vary from the colors being displayed on your device."]
        }
    ]

    return (
        <>
            <div className="pd-info-desc">
                <p>{desc}</p>
                <div className="pd-aaccorrdion-container">
                    {instructions.map((instruction, index) =>
                        <AccordionItem title={instruction["title"]}
                            content={instruction["content"]}
                            key={index}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default Description;