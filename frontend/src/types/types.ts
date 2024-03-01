import { PosterSizeType, PosterSize } from '../components/Poster/Poster';
import { PosterRatingSizeTypes, PosterRatingSize } from '../components/Poster/PosterRating';

export const imgTmdbUrl = "https://image.tmdb.org/t/p/";

type GetPosterRatingSize = {
    [K in PosterSizeType]: PosterRatingSizeTypes;
}

export const getPosterRatingSize: GetPosterRatingSize = {
    [PosterSize.LG]: PosterRatingSize.LG,
    [PosterSize.MD]: PosterRatingSize.MD,
    [PosterSize.SM]: PosterRatingSize.SM,
}
