import urlJoin from 'url-join';

const dataModels = {
  Note: {
    shapeTreeUri: urlJoin(import.meta.env.VITE_SHAPE_REPOSITORY_URL, 'shapetrees/as/Note'),
    list: {}
  },
  Video: {
    shapeTreeUri: urlJoin(import.meta.env.VITE_SHAPE_REPOSITORY_URL, 'shapetrees/as/Video'),
    list: {}
  },
  Article: {
    shapeTreeUri: urlJoin(import.meta.env.VITE_SHAPE_REPOSITORY_URL, 'shapetrees/as/Article'),
    list: {}
  },
  Event: {
    shapeTreeUri: urlJoin(import.meta.env.VITE_SHAPE_REPOSITORY_URL, 'shapetrees/as/Event'),
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
