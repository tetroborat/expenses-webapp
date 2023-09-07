import React from "react";

export default function Badge({color, content, addContent, className='', style}) {
    return (
        <span className={`badge ${className}`} style={{
            backgroundColor: color,
            ...style
        }}>
            {content} {addContent}
        </span>
    )
}