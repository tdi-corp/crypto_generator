import { Helmet } from "react-helmet"

interface IHelmet {
    title: string;
}

export const Meta = ({title}: IHelmet) => {
    return (
        <Helmet>
            {title && <title>{title}</title>}
        </Helmet>
    )
}