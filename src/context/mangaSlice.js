import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

import { baseUrl, excludedTagIDs } from "../request_params";

export const mangaSlice = createSlice({
  name: 'manga',
  initialState: {mangas: []},
  reducers: {
    set_mangas: (state, action) => {
      state.mangas = action.payload
      return state;
    }
  }
});
export const map_pagination = (state) => state.manga.pagination
export const map_page = (state) => state.manga.page
export const map_mangas = (state) => state.manga.mangas
export const mangaActions = mangaSlice.actions

export const find_mangas = (pagination={limit: 48, offset: 0}, title=false) => async (dispatch) => {

  const resp = await axios({
    method: 'GET',
    url: `${baseUrl}/manga`,
    params: {
      'limit': pagination.limit,
      'offset': pagination.offset,
      'excludedTags[]': excludedTagIDs,
      'contentRating[]': ['safe'],
      'includes[]': ['cover_art'],
      ...(title && {'title': title})

    }
    
  });
  const api_response = resp.data;
  
  const mangasData = api_response.data.map((manga) => {
    const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
    const fileName = coverRel.attributes.fileName;
    
    return {
      id: manga.id,
      title: manga.attributes.title.en,
      description: manga.attributes.description.en,
      status: manga.attributes.status,
      year: manga.attributes.year,
      genre: manga.attributes.tags
      .filter((tag) => tag.attributes.group === 'genre')
      .map(tag => tag.attributes.name.en),
      coverUrl: fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}` : null
    };
  });
  dispatch(mangaActions.set_mangas(mangasData))
};

export default mangaSlice.reducer;