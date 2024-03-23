import * as React from "react"

    interface MyComponentProps {
        name: string;
      }
const CryptoImage: React.FC<MyComponentProps> = ({ name} ) => {


    const getPath = new URL(`../../node_modules/cryptocurrency-icons/svg/color/${(name).toLowerCase()}.svg`, import.meta.url).href

    return (
        <img src={getPath} alt='dsd' width="24px" height="24px"/>
    )
 }
// CryptoImage.displayName = "CryptoImage"

export {CryptoImage}