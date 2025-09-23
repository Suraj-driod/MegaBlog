import React from 'react'

function Button({
    children,
    type = "button",
    className = "",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    ...props // this means if any extra props given they will be spread automatically
}) {
    return (
        <Button className={`px-4 py-2 rounded-lg ${className} ${bgColor} ${textColor}`} {...props}>
            {children}
        </Button>
    )
}

export default Button
