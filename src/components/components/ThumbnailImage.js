import React, { useContext } from 'react';
import OpenInNew from '@material-ui/icons/OpenInNew';
import IconButton from '@material-ui/core/IconButton';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render an image that opens in a new window on click
 */
const ThumbnailImage = ({ mediaId, alt }) => {
    const { language } = useContext(LanguageContext);

    /**
     * Open full image in new window
     *
     * @param {Object} e Event
     */
    const openWindow = (e) => {
        if (e) e.preventDefault();
        window.open(
            `${process.env.REACT_APP_API_URL}/media/${mediaId}`,
            '_blank', 'toolbar=no, top=200, width=400, height=400',
        ).opener = null;
    };

    return (
        <div className="text-center text-sm">
            <div className="relative w-36 m-auto">
                <img
                    className="w-full border-2 border-solid rounded"
                    alt={alt}
                    src={`${process.env.REACT_APP_API_URL}/media/thumbnails/${mediaId}`}
                />
                <span className="absolute top-0 right-3">
                    <IconButton
                        edge="end"
                        aria-label="close"
                        title={language.dictionary.titleExpandImage}
                        onClick={() => openWindow()}
                    >
                        <OpenInNew />
                    </IconButton>
                </span>
            </div>
            <a
                href={`${process.env.REACT_APP_API_URL}/media/${mediaId}`}
                title={language.dictionary.titleExpandImage}
                onClick={(e) => openWindow(e)}
            >
                {language.dictionary.clickToExpand}
            </a>
        </div>
    );
};

export default ThumbnailImage;
