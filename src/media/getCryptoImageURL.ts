// const path = '../../node_modules/cryptocurrency-icons/svg/color'

const getCryptoImageURL = (name: string): string => {
    return new URL(`../../node_modules/cryptocurrency-icons/svg/color/${(name).toLowerCase()}.svg`, import.meta.url).href
}

export default getCryptoImageURL