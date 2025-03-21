import urlJoin from 'url-join';

const dataModels = {
  Note: {
    shapeTreeUri: urlJoin(import.meta.env.VITE_SHAPE_REPOSITORY_URL, 'shapetrees/as/Note'),
    list: {}
  },
  Profile: {
    shapeTreeUri: urlJoin(import.meta.env.VITE_SHAPE_REPOSITORY_URL, 'shapetrees/as/Profile'),
    list: {}
  },
  Activity: {
    types: ['as:Activity'],
    list: {}
  },
  Actor: {
    types: ['as:Actor'],
    list: {}
  }
};

export default dataModels;
