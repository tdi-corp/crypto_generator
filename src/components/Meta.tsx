import { Helmet } from "react-helmet-async"

interface IHelmet {
    title: string;
    titleTemplate?: string | undefined;
    description?: string | undefined;
}

export const Meta = (prop: IHelmet) => {

    const {
        title,
        titleTemplate = undefined,
        description = undefined
    } = prop

    return (
        <Helmet
            titleTemplate={titleTemplate}
        >
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}            
        </Helmet>
    )
}